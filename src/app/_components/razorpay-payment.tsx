"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal: {
        ondismiss: () => void;
    };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
    }
}

interface RazorpayPaymentProps {
    productId: string;
    productName: string;
    amount: number;
    onSuccess: (paymentDetails: RazorpayResponse) => void;
    onError: (error: string) => void;
    disabled?: boolean;
    children: React.ReactNode;
}

export function RazorpayPayment({
    productId,
    productName,
    amount,
    onSuccess,
    onError,
    disabled = false,
    children,
}: RazorpayPaymentProps) {
    const verifyPaymentMutation = api.product.verifyRazorpayPayment.useMutation({
        onSuccess: () => {
            onSuccess({
                razorpay_order_id: '',
                razorpay_payment_id: '',
                razorpay_signature: '',
            });
        },
        onError: (error) => {
            onError(error.message);
        },
    });

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        try {
            // Create Razorpay order
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    productId,
                    productName,
                }),
            });

            const data = await response.json() as { success: boolean; order?: { id: string; amount: number; currency: string }; error?: string };

            if (!data.success || !data.order) {
                throw new Error(data.error ?? 'Failed to create order');
            }

            const order = data.order;

            // Get Razorpay key from environment
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            if (!razorpayKeyId) {
                throw new Error('Razorpay key not configured');
            }

            const options: RazorpayOptions = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: 'NotesHub',
                description: `Purchase: ${productName}`,
                order_id: order.id,
                handler: function (response: RazorpayResponse) {
                    void (async () => {
                        try {
                            // Verify payment on server
                            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(response),
                            });

                            const verifyData = await verifyResponse.json() as { success: boolean; error?: string };

                            if (verifyData.success) {
                                // Complete the purchase in our database
                                verifyPaymentMutation.mutate({
                                    productId,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                });
                            } else {
                                throw new Error(verifyData.error ?? 'Payment verification failed');
                            }
                        } catch (error) {
                            onError(error instanceof Error ? error.message : 'Payment verification failed');
                        }
                    })();
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#7c3aed', // Purple color to match our theme
                },
                modal: {
                    ondismiss: function () {
                        onError('Payment cancelled by user');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Failed to initiate payment');
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={disabled || verifyPaymentMutation.isPending}
            className="w-full"
        >
            {children}
        </button>
    );
}
