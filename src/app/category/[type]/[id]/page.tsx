"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "~/app/_components/header";
import { ProductCard } from "~/app/_components/product-card";
import { api } from "~/trpc/react";

export default function CategoryProductsPage() {
    const params = useParams();
    const router = useRouter();

    const categoryType = params.type as string;
    const categoryId = params.id as string;

    // Determine which API call to make based on category type
    const getBatchProducts = api.category.getBatchProducts.useQuery(
        { id: categoryId },
        { enabled: categoryType === 'batch' }
    );

    const getBranchProducts = api.category.getBranchProducts.useQuery(
        { id: categoryId },
        { enabled: categoryType === 'branch' }
    );

    const getSemesterProducts = api.category.getSemesterProducts.useQuery(
        { id: categoryId },
        { enabled: categoryType === 'semester' }
    );

    const getTypeProducts = api.category.getTypeProducts.useQuery(
        { id: categoryId },
        { enabled: categoryType === 'type' }
    );

    // Get the appropriate data based on category type
    const getQueryData = () => {
        switch (categoryType) {
            case 'batch':
                return getBatchProducts;
            case 'branch':
                return getBranchProducts;
            case 'semester':
                return getSemesterProducts;
            case 'type':
                return getTypeProducts;
            default:
                return { data: null, isLoading: false, error: new Error('Invalid category type') };
        }
    };

    const { data: category, isLoading, error } = getQueryData();

    const getCategoryDisplayName = () => {
        return categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
    };

    if (isLoading) {
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

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                        <p className="text-gray-600 mb-8">The category you are looking for does not exist.</p>
                        <button
                            onClick={() => router.push("/categories")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
                        >
                            Back to Categories
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
                            <button
                                onClick={() => router.push("/categories")}
                                className="text-gray-500 hover:text-purple-600"
                            >
                                Categories
                            </button>
                        </li>
                        <li>
                            <span className="text-gray-400">/</span>
                        </li>
                        <li>
                            <span className="text-gray-700 font-medium">{category.name}</span>
                        </li>
                    </ol>
                </nav>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {getCategoryDisplayName()}: {category.name}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {category.products?.length || 0} notes available in this category
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {!category.products?.length ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes available</h3>
                        <p className="text-gray-500 mb-4">
                            There are currently no notes available in this {categoryType}.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                        >
                            Browse All Notes
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Related Categories */}
                <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Other Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => router.push("/categories")}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            All Categories
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            All Notes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
