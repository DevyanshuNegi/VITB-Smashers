"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "~/app/_components/header";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const productId = params.id as string;

    const { data: product, isLoading: productLoading, error: productError } = api.product.getById.useQuery(
        { id: productId },
        { enabled: !!productId }
    );

    const { data: hasPurchased, isLoading: purchaseCheckLoading } = api.product.hasPurchased.useQuery(
        { productId },
        { enabled: !!session && !!productId }
    );

    const createPurchaseMutation = api.product.createPurchase.useMutation({
        onSuccess: () => {
            alert("Purchase successful! You can now access the notes.");
            router.push("/dashboard");
        },
        onError: (error) => {
            alert(`Purchase failed: ${error.message}`);
            setIsPurchasing(false);
        },
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price / 100);
    };

    const handlePurchase = async () => {
        if (!session) {
            router.push("/api/auth/signin");
            return;
        }

        setIsPurchasing(true);
        // In a real app, you'd integrate with a payment gateway here
        // For demo purposes, we'll simulate a successful payment
        createPurchaseMutation.mutate({
            productId,
            paymentGatewayId: `demo_${Date.now()}`, // Demo payment ID
        });
    };

    if (productLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <button
                                onClick={() => router.push("/")}
                                className="text-gray-500 hover:text-purple-600"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <span className="text-gray-400">/</span>
                        </li>
                        <li>
                            <span className="text-gray-700 font-medium">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Info */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                                        {product.type.name}
                                    </span>
                                    {hasPurchased && (
                                        <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                                            Purchased
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {product.description && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}

                                {/* Category Information */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    {product.batch && (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h3 className="font-medium text-gray-900">Batch</h3>
                                            <p className="text-gray-600">{product.batch.name}</p>
                                        </div>
                                    )}
                                    {product.branch && (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h3 className="font-medium text-gray-900">Branch</h3>
                                            <p className="text-gray-600">{product.branch.name}</p>
                                        </div>
                                    )}
                                    {product.semester && (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h3 className="font-medium text-gray-900">Semester</h3>
                                            <p className="text-gray-600">{product.semester.name}</p>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-medium text-gray-900">Type</h3>
                                        <p className="text-gray-600">{product.type.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Section */}
                            <div className="lg:pl-8">
                                <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-gray-900 mb-2">
                                            {formatPrice(product.price)}
                                        </div>
                                        <p className="text-gray-600">One-time purchase</p>
                                    </div>

                                    {session ? (
                                        <>
                                            {purchaseCheckLoading ? (
                                                <div className="flex justify-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                                </div>
                                            ) : hasPurchased ? (
                                                <div className="text-center">
                                                    <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                                                        <p className="font-medium">You own this product!</p>
                                                        <p className="text-sm">Access your notes anytime from your dashboard.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push("/dashboard")}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
                                                    >
                                                        View in Dashboard
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handlePurchase}
                                                    disabled={isPurchasing}
                                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-md font-medium"
                                                >
                                                    {isPurchasing ? "Processing..." : "Purchase Now"}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-gray-600 mb-4">Sign in to purchase this product</p>
                                            <button
                                                onClick={() => router.push("/api/auth/signin")}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
                                            >
                                                Sign In to Purchase
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-3">What you get:</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center">
                                                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Lifetime access to notes
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Download and print
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                High-quality content
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
