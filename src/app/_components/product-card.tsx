"use client";

import Link from "next/link";
import { type Product, type Batch, type Branch, type Semester, type Type } from "@prisma/client";

type ProductWithRelations = Product & {
  batch?: Batch | null;
  branch?: Branch | null;
  semester?: Semester | null;
  type: Type;
};

interface ProductCardProps {
  product: ProductWithRelations;
  isPurchased?: boolean;
}

export function ProductCard({ product, isPurchased = false }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price / 100); // Assuming price is stored in paisa
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Product Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {product.type.name}
          </span>
          {isPurchased && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Purchased
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Category Information */}
        <div className="space-y-1 mb-4">
          {product.batch && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Batch:</span>
              <span className="ml-1">{product.batch.name}</span>
            </div>
          )}
          {product.branch && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Branch:</span>
              <span className="ml-1">{product.branch.name}</span>
            </div>
          )}
          {product.semester && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Semester:</span>
              <span className="ml-1">{product.semester.name}</span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <Link
            href={`/product/${product.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {isPurchased ? 'View Details' : 'View & Buy'}
          </Link>
        </div>
      </div>
    </div>
  );
}
