/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "@/utils/Variables/getAxiosError.util";
import { CategoriesResponse } from "@/types/Admin/Category/Category.type";
import axios from "axios";
import { motion } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import {
  FileText,
  Plus,
  RefreshCw,
  Tag,
  Globe,
  Lock,
  Star,
  X,
  ChevronLeft,
  Layers,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PostCreateRequestDTO {
  title: string;
  short_description: string;
  long_description?: string;
  markdown_description?: string;
  categories?: string[];
  icon_url?: string;
  icon_id?: string;
  post_status?: "public" | "private";
  featured?: boolean;
  metadata?: Record<string, any>;
}

export default function PostCreator() {
  const { data: session } = useSession();
  const [categoriesData, setCategoriesData] =
    useState<CategoriesResponse | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState<PostCreateRequestDTO>({
    title: "",
    short_description: "",
    long_description: "",
    markdown_description: "",
    categories: [],
    post_status: "public",
    featured: false,
  });

  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch categories for selection
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get(
        `/api/admin/category-manager?page=1&limit=100&include_creator=false`
      );
      if (response.data.success) {
        setCategoriesData(response.data);
      }
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to fetch categories"));
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    setCreateMessage("");

    try {
      const postData = {
        ...formData,
        categories: selectedCategories,
        icon_url: formData.icon_url || undefined,
      };

      const response = await axios.post("/api/user/post/create", postData);
      if (response.data.success) {
        setCreateMessage("Post created successfully!");
        toast.success("Post created successfully!");

        setFormData({
          title: "",
          short_description: "",
          long_description: "",
          markdown_description: "",
          categories: [],
          post_status: "public",
          featured: false,
        });
        setSelectedCategories([]);
      }
    } catch (err: unknown) {
      const error = getAxiosErrorMessage(err, "Failed to create post");
      setCreateError(error);
      toast.error(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormReset = () => {
    setFormData({
      title: "",
      short_description: "",
      long_description: "",
      markdown_description: "",
      categories: [],
      post_status: "public",
      featured: false,
    });
    setSelectedCategories([]);
    setCreateError("");
    setCreateMessage("");
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const categories = categoriesData?.categories || [];

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-pink-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Create New Post
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Share your thoughts and ideas with the community
                </p>

                {/* Go Back Button */}
                <Link
                  href="/mod-dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Mod Dashboard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Create Post Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-emerald-400" />
              Post Details
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

            <form onSubmit={handleCreatePost} className="space-y-8">
              {/* Title & Short Description Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
                    placeholder="Enter post title"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    {formData.title.length}/500 characters
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
                    placeholder="Enter a brief description"
                    maxLength={255}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    {formData.short_description.length}/255 characters
                  </div>
                </div>
              </div>

              {/* Long Description */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Long Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 resize-vertical"
                  placeholder="Enter long description (optional)"
                  maxLength={65535}
                />
                <div className="text-xs text-gray-400 mt-2">
                  {formData.long_description?.length || 0}/65535 characters
                </div>
              </div>

              {/* Markdown Description */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Content (Markdown)
                </label>
                <textarea
                  name="markdown_description"
                  value={formData.markdown_description}
                  onChange={handleFormChange}
                  rows={8}
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 resize-vertical font-mono text-sm"
                  placeholder="Enter your post content (supports markdown)"
                />
                <div className="text-xs text-gray-400 mt-2">
                  Post content (supports markdown formatting)
                </div>
              </div>

              {/* Categories Selection */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Categories
                </label>
                {categoriesLoading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedCategories.includes(category.id)
                            ? "bg-emerald-500/20 border-emerald-500 text-white"
                            : "bg-black/40 border-stone-700 text-gray-300 hover:border-stone-500"
                        }`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        {category.description && (
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {category.description}
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-4">
                        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No categories available</p>
                        <Link
                          href="/admin/category-manager"
                          className="text-emerald-400 hover:text-emerald-300 text-sm"
                        >
                          Create categories first
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  {selectedCategories.length} categories selected
                </div>
              </div>

              {/* Settings Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Post Status */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    Post Status
                  </label>
                  <div className="relative">
                    <select
                      name="post_status"
                      value={formData.post_status}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 appearance-none"
                    >
                      <option value="public" className="bg-black text-white">
                        Public
                      </option>
                      <option value="private" className="bg-black text-white">
                        Private
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.post_status === "public" ? (
                        <Globe className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Featured Post */}
                <div className="flex items-center gap-3 p-4 bg-black/40 border border-stone-700 rounded-xl">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-emerald-500 bg-black border-stone-600 rounded focus:ring-emerald-500 focus:ring-offset-black"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-300 cursor-pointer">
                      Featured Post
                    </label>
                    <div className="text-xs text-gray-400">
                      Highlight this post
                    </div>
                  </div>
                  <Star
                    className={`w-4 h-4 ${
                      formData.featured ? "text-yellow-400" : "text-gray-500"
                    }`}
                  />
                </div>

                {/* Character Stats */}
                <div className="p-4 bg-black/40 border border-stone-700 rounded-xl">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Character Stats
                  </div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>Title: {formData.title.length}/500</div>
                    <div>
                      Short Desc: {formData.short_description.length}/255
                    </div>
                    <div>
                      Long Desc: {formData.long_description?.length || 0}/65535
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-700">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={
                    createLoading ||
                    !formData.title.trim() ||
                    !formData.short_description.trim()
                  }
                  className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 flex-1 text-lg font-semibold"
                >
                  {createLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Post
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFormReset}
                  disabled={createLoading}
                  className="px-6 py-4 border border-stone-600 bg-stone-900 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 cursor-pointer rounded-xl transition-all duration-300 flex items-center justify-center gap-2 flex-1"
                >
                  <X className="w-5 h-5" />
                  Reset Form
                </motion.button>
              </div>
            </form>

            {/* Preview Section */}
            {(formData.title ||
              formData.short_description ||
              formData.long_description) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mt-8"
              >
                <h4 className="text-emerald-400 text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Post Preview
                </h4>

                <div className="space-y-4">
                  {formData.title && (
                    <div>
                      <div className="text-emerald-400 text-sm font-medium mb-1">
                        Title
                      </div>
                      <div className="text-white text-xl font-bold">
                        {formData.title}
                      </div>
                    </div>
                  )}

                  {formData.short_description && (
                    <div>
                      <div className="text-emerald-400 text-sm font-medium mb-1">
                        Short Description
                      </div>
                      <div className="text-gray-300">
                        {formData.short_description}
                      </div>
                    </div>
                  )}

                  {formData.long_description && (
                    <div>
                      <div className="text-emerald-400 text-sm font-medium mb-1">
                        Long Description
                      </div>
                      <div className="text-gray-300 leading-relaxed">
                        {formData.long_description}
                      </div>
                    </div>
                  )}

                  {selectedCategories.length > 0 && (
                    <div>
                      <div className="text-emerald-400 text-sm font-medium mb-2">
                        Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((catId) => {
                          const category = categories.find(
                            (c) => c.id === catId
                          );
                          return category ? (
                            <span
                              key={catId}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30"
                            >
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      {formData.post_status === "public" ? (
                        <>
                          <Globe className="w-4 h-4" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Private
                        </>
                      )}
                    </div>
                    {formData.featured && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
