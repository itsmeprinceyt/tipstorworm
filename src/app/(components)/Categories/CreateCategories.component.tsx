"use client";
import { useState } from "react";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

export default function CreateCategoryForm({
  onCategoryCreated,
}: {
  onCategoryCreated?: () => void;
}) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "/api/admin/category-manager/create",
        formData
      );
      if (response.status === 201) {
        setMessage("Category created successfully!");
        setFormData({ name: "", description: "" });
        onCategoryCreated?.();
      }
    } catch (err) {
      const error = getAxiosErrorMessage(err, "Failed to create category");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFormData({ name: "", description: "" });
    setError("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl"
        >
          {message}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              disabled={loading || !formData.name.trim()}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
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
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center justify-center gap-2 flex-1"
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
          className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
        >
          <h4 className="text-blue-400 text-sm font-medium mb-2">Preview</h4>
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
    </div>
  );
}
