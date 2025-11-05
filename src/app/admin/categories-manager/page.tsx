"use client";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import { CategoriesResponse } from "../../../types/Admin/Category/Category.type";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import CustomLoader from "../../(components)/Components/utils/Loader";
import {
  Folder,
  Plus,
  RefreshCw,
  Layers,
  CalendarDays,
  User,
  Hash,
  FileText,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  IdCard,
  UserCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CategoryManager() {
  const { data: session } = useSession();
  const [categoriesData, setCategoriesData] =
    useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  const fetchCategories = useCallback(
    async (page = 1, showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshLoading(true);
        } else {
          setLoading(true);
        }

        const response = await axios.get(
          `/api/admin/category-manager?page=${page}&limit=${limit}&include_creator=true`
        );
        if (response.data.success) {
          setCategoriesData(response.data);
        }
      } catch (err: unknown) {
        toast.error(getAxiosErrorMessage(err, "Failed to fetch categories"));
      } finally {
        setLoading(false);
        setRefreshLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchCategories(currentPage);
  }, [fetchCategories, currentPage]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    setCreateMessage("");

    try {
      const response = await axios.post(
        "/api/admin/category-manager/create",
        formData
      );
      if (response.data.success) {
        setCreateMessage("Category created successfully!");
        setFormData({ name: "", description: "" });
        fetchCategories(currentPage, true);
      }
    } catch (err: unknown) {
      const error = getAxiosErrorMessage(err, "Failed to create category");
      setCreateError(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormReset = () => {
    setFormData({ name: "", description: "" });
    setCreateError("");
    setCreateMessage("");
  };

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      (categoriesData?.pagination &&
        newPage > categoriesData.pagination.totalPages)
    )
      return;
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    fetchCategories(currentPage, true);
  };

  const toggleCategoryDetails = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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

  if (!session) {
    return null;
  }

  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination;

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

            {/* Create Form Messages */}
            {createMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-4"
              >
                {createMessage}
              </motion.div>
            )}

            {createError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4"
              >
                {createError}
              </motion.div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 space-y-6">
                  {/* Category Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter category name"
                      maxLength={200}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      {formData.name.length}/200 characters
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 resize-vertical"
                      placeholder="Enter category description (optional)"
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      {formData.description.length}/1000 characters
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createLoading || !formData.name.trim()}
                    className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 flex-1"
                  >
                    {createLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Category
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFormReset}
                    disabled={createLoading}
                    className="px-6 py-3 border border-stone-600 bg-stone-900 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 cursor-pointer rounded-xl transition-all duration-300 flex items-center justify-center gap-2 flex-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </motion.button>
                </div>
              </div>
            </form>

            {/* Character Count Preview */}
            {(formData.name || formData.description) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mt-4"
              >
                <h4 className="text-blue-400 text-sm font-medium mb-2">
                  Preview
                </h4>
                {formData.name && (
                  <div className="text-white text-sm mb-2">
                    <span className="text-blue-400">Name:</span> {formData.name}
                  </div>
                )}
                {formData.description && (
                  <div className="text-gray-300 text-sm">
                    <span className="text-blue-400">Description:</span>{" "}
                    {formData.description}
                  </div>
                )}
              </motion.div>
            )}
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
                {pagination?.total || 0}
              </div>
              <div className="text-gray-400 text-sm">Total Categories</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {pagination?.totalPages || 1}
              </div>
              <div className="text-gray-400 text-sm">Total Pages</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentPage}
              </div>
              <div className="text-gray-400 text-sm">Current Page</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {categories.length}
              </div>
              <div className="text-gray-400 text-sm">Showing</div>
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
                Manage Categories ({categories.length})
              </h2>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="px-4 py-2 border border-stone-600 bg-stone-900 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
                />
                {refreshLoading ? "Refreshing..." : "Refresh"}
              </motion.button>
            </div>

            {/* Categories Table */}
            <div className="relative min-h-[200px]">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <CustomLoader />
                </div>
              ) : categories.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No categories found.</p>
                  <p className="text-sm">
                    Create your first one above to get started.
                  </p>
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
                        <>
                          <motion.tr
                            key={`${category.id}-id`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-black/30 transition-colors duration-200 cursor-pointer"
                            onClick={() => toggleCategoryDetails(category.id)}
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
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCategoryDetails(category.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-full transition-all duration-200 group cursor-pointer"
                                  title="View details"
                                >
                                  {expandedCategory === category.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>

                          {/* Expanded Details Row */}
                          <AnimatePresence>
                            {expandedCategory === category.id && (
                              <motion.tr
                                key={`${category.id}-details`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-black/20"
                              >
                                <td colSpan={4} className="px-6 py-4">
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl p-6"
                                  >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Category Information */}
                                      <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                          <FileText className="w-5 h-5 text-blue-400" />
                                          Category Information
                                        </h4>

                                        <div className="space-y-3">
                                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                              Name
                                            </label>
                                            <div className="text-white font-semibold text-lg">
                                              {category.name}
                                            </div>
                                          </div>

                                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                              Description
                                            </label>
                                            <div className="text-gray-300 leading-relaxed">
                                              {category.description || (
                                                <span className="text-gray-500 italic">
                                                  No description provided
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Timestamps & Technical Details */}
                                      <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                          <CalendarDays className="w-5 h-5 text-green-400" />
                                          Timestamps
                                        </h4>

                                        <div className="space-y-3">
                                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                              <Edit3 className="w-4 h-4 text-yellow-400" />
                                              Created At
                                            </label>
                                            <div className="text-white font-medium">
                                              {formatDate(category.created_at)}
                                            </div>
                                          </div>

                                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                              <Edit3 className="w-4 h-4 text-yellow-400" />
                                              Updated At
                                            </label>
                                            <div className="text-white font-medium">
                                              {formatDate(category.updated_at)}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Technical Details */}
                                        <div className="space-y-3">
                                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Hash className="w-5 h-5 text-gray-400" />
                                            Technical Details
                                          </h4>
                                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                              Category ID
                                            </label>
                                            <div className="text-white font-mono text-sm bg-black/30 p-3 rounded-lg break-all">
                                              {category.id}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Creator Information */}
                                    {category.created_by && (
                                      <div className="mt-6 space-y-4">
                                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                          <UserCircle className="w-5 h-5 text-purple-400" />
                                          Created By
                                        </h4>

                                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-700">
                                            <div className="p-4 flex items-center gap-3">
                                              <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <IdCard className="w-4 h-4 text-purple-400" />
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-400">
                                                  User ID
                                                </div>
                                                <div className="text-white font-mono text-sm">
                                                  {category.created_by.user_id.slice(
                                                    0,
                                                    8
                                                  )}
                                                  ...
                                                </div>
                                              </div>
                                            </div>

                                            <div className="p-4 flex items-center gap-3">
                                              <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <User className="w-4 h-4 text-blue-400" />
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-400">
                                                  Name
                                                </div>
                                                <div className="text-white font-medium">
                                                  {category.created_by.name}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="p-4 flex items-center gap-3">
                                              <div className="p-2 bg-green-500/20 rounded-lg">
                                                <User className="w-4 h-4 text-green-400" />
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-400">
                                                  Username
                                                </div>
                                                <div className="text-white">
                                                  @
                                                  {category.created_by
                                                    .username || "N/A"}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="p-4 flex items-center gap-3">
                                              <div className="p-2 bg-orange-500/20 rounded-lg">
                                                <Mail className="w-4 h-4 text-orange-400" />
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-400">
                                                  Email
                                                </div>
                                                <div className="text-white">
                                                  {category.created_by.email}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-end gap-3">
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Category
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          setExpandedCategory(null)
                                        }
                                        className="px-4 py-2 text-sm bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                                      >
                                        <X className="w-4 h-4" />
                                        Close
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </>
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
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
