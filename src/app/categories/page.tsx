"use client";

import Link from "next/link";
import { Header } from "~/app/_components/header";
import { api } from "~/trpc/react";

export default function CategoriesPage() {
    const { data: batches, isLoading: batchesLoading } = api.category.getBatches.useQuery();
    const { data: branches, isLoading: branchesLoading } = api.category.getBranches.useQuery();
    const { data: semesters, isLoading: semestersLoading } = api.category.getSemesters.useQuery();
    const { data: types, isLoading: typesLoading } = api.category.getTypes.useQuery();

    const isLoading = batchesLoading || branchesLoading || semestersLoading || typesLoading;

    const CategorySection = ({
        title,
        items,
        basePath
    }: {
        title: string;
        items: Array<{ id: string; name: string; _count: { products: number } }> | undefined;
        basePath: string;
    }) => (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
            {items?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/category/${basePath}/${item.id}`}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        >
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {item._count.products}
                            </span>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No {title.toLowerCase()} available</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Categories</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Find notes organized by batch, branch, semester, and type to match your specific study needs.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <CategorySection title="Batches" items={batches} basePath="batch" />
                        <CategorySection title="Branches" items={branches} basePath="branch" />
                        <CategorySection title="Semesters" items={semesters} basePath="semester" />
                        <CategorySection title="Types" items={types} basePath="type" />
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-12 bg-purple-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
                    <p className="text-gray-600 mb-6">Browse all available notes or use our search feature.</p>
                    <div className="space-x-4">
                        <Link
                            href="/"
                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
                        >
                            Browse All Notes
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
