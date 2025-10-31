"use client";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import { CategoriesResponse } from "../../../types/Category/Category.type";
import CategoriesList from "../../(components)/Categories/Categories.component";
import CreateCategoryForm from "../../(components)/Categories/CreateCategories.component";
import axios from "axios";
import { motion } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import CustomLoader from "../../(components)/utils/Loader";
import { Folder, Plus, RefreshCw, Layers } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CategoryManager() {
  const { data: session } = useSession();
  const [categoriesData, setCategoriesData] =
    useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const fetchCategories = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/admin/category-manager?page=${page}&limit=${limit}&include_creator=true`
        );
        setCategoriesData(response.data);
      } catch (err) {
        toast.error(getAxiosErrorMessage(err, "Failed to fetch categories"));
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchCategories(currentPage);
  }, [fetchCategories, currentPage]);

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-indigo-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Folder className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Category Manager
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Create and manage content categories for better organization
                </p>

                {/* Go Back Button */}
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
                >
                  ← Go Back to Dashboard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Create Category Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-blue-400" />
              Create New Category
            </h2>
            <CreateCategoryForm
              onCategoryCreated={() => fetchCategories(currentPage)}
            />
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {categoriesData?.pagination?.total || 0}
              </div>
              <div className="text-gray-400 text-sm">Total Categories</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {categoriesData?.pagination?.totalPages || 1}
              </div>
              <div className="text-gray-400 text-sm">Total Pages</div>
            </div>
          </motion.div>

          {/* Categories List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Layers className="w-6 h-6 text-blue-400" />
                Manage Categories ({categoriesData?.categories?.length || 0})
              </h2>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchCategories(currentPage)}
                className="px-4 py-2 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>

            <CategoriesList
              categoriesData={categoriesData}
              loading={loading}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </motion.div>

          {/* Bottom Refresh Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchCategories(currentPage)}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Categories
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
