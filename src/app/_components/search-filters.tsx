"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    batchId: string;
    branchId: string;
    semesterId: string;
    typeId: string;
  }) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [search, setSearch] = useState("");
  const [batchId, setBatchId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [typeId, setTypeId] = useState("");

  // Fetch categories
  const { data: batches } = api.category.getBatches.useQuery();
  const { data: branches } = api.category.getBranches.useQuery();
  const { data: semesters } = api.category.getSemesters.useQuery();
  const { data: types } = api.category.getTypes.useQuery();

  const handleFilterChange = () => {
    onFiltersChange({
      search,
      batchId,
      branchId,
      semesterId,
      typeId,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setBatchId("");
    setBranchId("");
    setSemesterId("");
    setTypeId("");
    onFiltersChange({
      search: "",
      batchId: "",
      branchId: "",
      semesterId: "",
      typeId: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Notes
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTimeout(handleFilterChange, 300); // Debounce search
            }}
            placeholder="Search by name or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Batch Filter */}
        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <select
            id="batch"
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Batches</option>
            {batches?.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name} ({batch._count.products})
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <select
            id="branch"
            value={branchId}
            onChange={(e) => {
              setBranchId(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Branches</option>
            {branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch._count.products})
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            id="semester"
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Semesters</option>
            {semesters?.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name} ({semester._count.products})
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={typeId}
            onChange={(e) => {
              setTypeId(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Types</option>
            {types?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type._count.products})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
