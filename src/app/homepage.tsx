"use client";

import { useState } from "react";
import { Header } from "./_components/header";
import { SearchFilters } from "./_components/search-filters";
import { ProductCard } from "./_components/product-card";
import { api } from "~/trpc/react";

export default function Home() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    batchId: "",
    branchId: "",
    semesterId: "",
    typeId: "",
  });

  const { data, isLoading, error } = api.product.getAll.useQuery({
    page,
    limit: 12,
    ...filters,
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Study Notes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through thousands of high-quality notes organized by batch, branch, semester, and type. 
            Get the notes you need to excel in your studies.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading products. Please try again.</p>
          </div>
        ) : !data?.products.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notes found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {data.products.length} of {data.totalCount} notes
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        page === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
