"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "~/app/_components/header";
import { api } from "~/trpc/react";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: purchases, isLoading, error, refetch } = api.product.getUserPurchases.useQuery(
        undefined,
        { enabled: !!session }
    );

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [status, router]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price / 100);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            SUCCESS: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            FAILED: "bg-red-100 text-red-800",
            REFUNDED: "bg-gray-100 text-gray-800",
        };
        return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
    };

    if (status === "loading") {
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

    if (!session) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your purchased notes and account settings</p>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="text-gray-900">{session.user?.name ?? "Not provided"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="text-gray-900">{session.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Purchases Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">My Purchases</h2>
                            <button
                                onClick={() => refetch()}
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">Error loading purchases. Please try again.</p>
                            </div>
                        ) : !purchases?.length ? (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                                <p className="text-gray-500 mb-4">Start browsing our collection of study notes.</p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                                >
                                    Browse Notes
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {purchase.product.name}
                                                    </h3>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(purchase.status)}`}>
                                                        {purchase.status}
                                                    </span>
                                                </div>

                                                {purchase.product.description && (
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                        {purchase.product.description}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                    <div>
                                                        <span className="text-xs font-medium text-gray-500">Type</span>
                                                        <p className="text-sm text-gray-900">{purchase.product.type.name}</p>
                                                    </div>
                                                    {purchase.product.batch && (
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Batch</span>
                                                            <p className="text-sm text-gray-900">{purchase.product.batch.name}</p>
                                                        </div>
                                                    )}
                                                    {purchase.product.branch && (
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Branch</span>
                                                            <p className="text-sm text-gray-900">{purchase.product.branch.name}</p>
                                                        </div>
                                                    )}
                                                    {purchase.product.semester && (
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-500">Semester</span>
                                                            <p className="text-sm text-gray-900">{purchase.product.semester.name}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <span>Purchased on {formatDate(purchase.createdAt)}</span>
                                                    <span className="font-medium text-gray-900">{formatPrice(purchase.amountPaid)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {purchase.status === 'SUCCESS' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-green-600 font-medium">Ready to download</p>
                                                    <div className="space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/product/${purchase.product.id}`)}
                                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium">
                                                            Access Notes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
