"use client";
import { useState } from "react";
import {
  CalendarDays,
  User,
  Hash,
  FileText,
  Edit3,
  Folder,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  CategoriesResponse,
  Category,
} from "../../../types/Category/Category.type";
import { motion } from "framer-motion";

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    onPageChange(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;

    return `${day} ${month}, ${year} ${formattedHours}:${minutes}${ampm}`;
  };

  if (loading && !categoriesData) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No categories found.</p>
          <p className="text-sm">Create your first one above to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 border-b border-stone-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700">
              {categories.map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-black/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Folder className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {category.name}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {category.description || "No description"}
                        </div>
                        <div className="text-gray-500 text-xs font-mono mt-1">
                          ID: {category.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-white">
                          {category.created_by?.name || "System"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {category.created_by?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(category.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-full transition-all duration-200 group cursor-pointer"
                      title="View details"
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-400 group-hover:border-blue-400 flex items-center justify-center transition-colors">
                        <Eye className="w-3 h-3" />
                      </div>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-stone-700 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing page {currentPage} of {pagination.totalPages} •{" "}
              {pagination.total} total categories
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-sm bg-stone-700 text-white rounded-xl disabled:opacity-50 hover:bg-stone-600 transition-all duration-300 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-sm bg-stone-700 text-white rounded-xl disabled:opacity-50 hover:bg-stone-600 transition-all duration-300 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-sm border border-stone-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-stone-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Folder className="w-5 h-5 text-blue-400" />
                Category Details
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-white text-lg font-bold transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Name */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Category Name
                </label>
                <div className="text-white font-medium bg-black/40 border border-stone-700 rounded-xl p-4">
                  {selectedCategory.name}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Description
                </label>
                <div className="text-gray-300 bg-black/40 border border-stone-700 rounded-xl p-4 leading-relaxed">
                  {selectedCategory.description || "No description available"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created At */}
                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-green-400" />
                    Created At
                  </label>
                  <div className="text-white bg-black/40 border border-stone-700 rounded-xl p-4">
                    {formatDate(selectedCategory.created_at)}
                  </div>
                </div>

                {/* Updated At */}
                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                    <Edit3 className="w-4 h-4 text-yellow-400" />
                    Updated At
                  </label>
                  <div className="text-white bg-black/40 border border-stone-700 rounded-xl p-4">
                    {formatDate(selectedCategory.updated_at)}
                  </div>
                </div>
              </div>

              {/* Created By */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-pink-400" />
                  Created By
                </label>
                <div className="bg-black/40 border border-stone-700 rounded-xl divide-y divide-stone-700">
                  <div className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-300">User ID:</span>{" "}
                    <span className="text-white font-mono">
                      {selectedCategory.created_by?.user_id || "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-300">Name:</span>{" "}
                    <span className="text-white">
                      {selectedCategory.created_by?.name || "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-300">Username:</span>{" "}
                    <span className="text-white">
                      {selectedCategory.created_by?.username || "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-300">Email:</span>{" "}
                    <span className="text-white">
                      {selectedCategory.created_by?.email || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category ID */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-gray-400" />
                  Category ID
                </label>
                <div className="text-white bg-black/40 border border-stone-700 rounded-xl p-4 font-mono text-sm break-all">
                  {selectedCategory.id}
                </div>
              </div>
            </div>

            <div className="bg-black/40 border-t border-stone-700 p-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2 rounded-xl bg-stone-700 text-white text-sm font-medium hover:bg-stone-600 transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
