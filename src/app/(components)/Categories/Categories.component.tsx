"use client";
import { useState } from "react";
import { CalendarDays, User, Hash, FileText, Edit3 } from "lucide-react";
import { CategoriesResponse, Category } from "../../../types/Category/Category.type";

export default function CategoriesList({
    categoriesData,
    loading,
    currentPage,
    onPageChange,
}: {
    categoriesData: CategoriesResponse | null;
    loading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
}) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const categories = categoriesData?.categories || [];
    const pagination = categoriesData?.pagination;

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
        onPageChange(newPage);
    };

    if (loading && !categoriesData) {
        return (
            <div className="min-h-[50vh] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 select-text shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-gray-600 mt-1">Total: {pagination?.total || 0} categories</p>
            </div>

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500">Get started by creating your first category.</p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <div key={category.id} className="p-4 hover:bg-gray-50 transition-all duration-200 rounded-md">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                ID: {category.id.slice(0, 8)}...
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-3">
                                            {category.description || "No description provided"}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div>
                                                <span className="font-medium">Created:</span>{" "}
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="font-medium">Updated:</span>{" "}
                                                {new Date(category.updated_at).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="font-medium">By:</span>{" "}
                                                {category.created_by?.name || "Unknown"}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedCategory(category)}
                                        className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {currentPage} of {pagination.totalPages} • {pagination.total} total
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Details Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Category Details</h3>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Category Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" /> Category Name
                                </label>
                                <div className="mt-1 text-gray-900 font-medium border rounded-lg p-3 bg-gray-50">
                                    {selectedCategory.name}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-500" /> Description
                                </label>
                                <div className="mt-1 text-gray-800 border rounded-lg p-3 bg-gray-50 leading-relaxed">
                                    {selectedCategory.description || "No description available"}
                                </div>
                            </div>

                            {/* Created At */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-green-500" /> Created At
                                </label>
                                <div className="mt-1 text-gray-900 border rounded-lg p-3 bg-gray-50">
                                    {new Date(selectedCategory.created_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Updated At */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-yellow-500" /> Updated At
                                </label>
                                <div className="mt-1 text-gray-900 border rounded-lg p-3 bg-gray-50">
                                    {new Date(selectedCategory.updated_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Created By */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <User className="w-4 h-4 text-pink-500" /> Created By
                                </label>
                                <div className="mt-2 border rounded-lg bg-gray-50 divide-y divide-gray-200">
                                    <div className="px-3 py-2 text-sm">
                                        <span className="font-medium text-gray-700">User ID:</span>{" "}
                                        {selectedCategory.created_by?.user_id || "—"}
                                    </div>
                                    <div className="px-3 py-2 text-sm">
                                        <span className="font-medium text-gray-700">Name:</span>{" "}
                                        {selectedCategory.created_by?.name || "—"}
                                    </div>
                                    <div className="px-3 py-2 text-sm">
                                        <span className="font-medium text-gray-700">Username:</span>{" "}
                                        {selectedCategory.created_by?.username || "—"}
                                    </div>
                                    <div className="px-3 py-2 text-sm">
                                        <span className="font-medium text-gray-700">Email:</span>{" "}
                                        {selectedCategory.created_by?.email || "—"}
                                    </div>
                                </div>
                            </div>

                            {/* Category ID */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-gray-500" /> Category ID
                                </label>
                                <div className="mt-1 text-gray-900 border rounded-lg p-3 bg-gray-50 font-mono text-xs">
                                    {selectedCategory.id}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
