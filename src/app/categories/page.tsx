"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomLoader from "../(components)/Components/utils/Loader";
import {
  FolderOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  Layers,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface ApiResponse {
  success: boolean;
  response: {
    categories: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Fetch categories
  const fetchCategories = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await axios.get<ApiResponse>(
        `/api/public/categories?${params.toString()}`
      );

      if (response.data.success && response.data.response) {
        const data = response.data.response;
        setCategories(data.categories || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        setTotalCategories(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to empty array if API fails
      setCategories([]);
      setTotalCategories(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCategories(page, searchTerm);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    fetchCategories(1, "");
  };

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Categories
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage and explore all post categories
                </p>
              </div>

              {/* Create New Category Button */}
              <Link
                href="/admin/categories-manager/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Category
              </Link>
            </div>

            {/* Go Back Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 text-white rounded-xl hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 text-white rounded-xl hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
                >
                  Clear
                </button>
              )}
            </form>
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {categories.length === 0 ? (
              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-12 text-center">
                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? "No categories match your search criteria."
                    : "Get started by creating your first category."}
                </p>
                <Link
                  href="/admin/categories-manager/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Create First Category
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                        <FolderOpen className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-1 hover:bg-emerald-500/20 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                        </button>
                        <button className="p-1 hover:bg-red-500/20 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      {category.name}
                    </h3>

                    {category.description ? (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No description provided
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-stone-700/50">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>ID: {category.id.slice(0, 8)}...</span>
                        <Link
                          href={`/categories/${category.id}`}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          View Posts →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-2"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-black/40 border border-stone-700 text-white rounded-xl hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-xl transition-all duration-300 ${
                      currentPage === page
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-black/40 border-stone-700 text-white hover:border-emerald-500"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black/40 border border-stone-700 text-white rounded-xl hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Categories Summary
                  </h2>
                  <p className="text-gray-300">
                    {categories.length} categories on this page
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">
                    {totalCategories}
                  </div>
                  <div className="text-gray-400 text-sm">Total Categories</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
