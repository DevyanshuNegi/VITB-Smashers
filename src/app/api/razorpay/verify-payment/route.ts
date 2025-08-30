import { type NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '~/lib/razorpay';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();
        const paymentData = verifyPaymentSchema.parse(body);

        // Verify the payment signature
        const isValid = verifyPaymentSignature(paymentData);

        if (isValid) {
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid payment signature'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Payment verification failed'
            },
            { status: 500 }
        );
    }
}
