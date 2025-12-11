/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import { ArrowLeft, MessageSquare, Send, AlertCircle } from "lucide-react";
import Link from "next/link";
import CustomSelect from "../../(components)/Components/CustomSelect";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import { SuggestionCreateRequestDTO } from "../../../types/DTO/Suggestion/SuggestionCreate.DTO";

export default function SendSuggestionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SuggestionCreateRequestDTO>({
    type: "suggestion",
    title: "",
    description: "",
    allow_contact: false,
  });

  const suggestionTypes = [
    { value: "suggestion", label: "Suggestion" },
    { value: "bug_report", label: "Bug Report" },
    { value: "feature_request", label: "Feature Request" },
    { value: "content_report", label: "Content Report" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!session || !session.user) {
      toast.error("Please login to submit a suggestion");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (formData.title.length > 200) {
      toast.error("Title must be 200 characters or less");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/user/suggestions-create", {
        ...formData,
        contact_email: formData.allow_contact ? session.user.email : undefined,
      });

      if (response.data.success) {
        toast.success("Suggestion submitted successfully!");
        setFormData({
          type: "suggestion",
          title: "",
          description: "",
          allow_contact: false,
        });
        window.location.reload();
      }
    } catch (error: unknown) {
      toast.error(getAxiosErrorMessage(error, "Failed to submit suggestion"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden text-white">
        {/* Background Effects (matches dashboards) */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/20 via-black to-green-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/user-dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-full text-xs bg-white shadow-xl hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to User Dashboard
            </Link>

            <h1 className="text-4xl font-bold mt-4 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
              Send Suggestion / Report
            </h1>
            <p className="text-gray-300 text-lg">
              Help us improve by sharing your feedback or reporting issues.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Type *
                </label>
                <CustomSelect
                  placeholder="Choose a type"
                  value={formData.type}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as any }))
                  }
                  options={suggestionTypes}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief summary of your suggestion or issue"
                  className="w-full bg-black/40 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                  maxLength={200}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {formData.title.length}/200 characters
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Please provide as much detail as possible..."
                  className="w-full bg-black/40 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                ></textarea>
                <div className="text-xs text-gray-400 mt-1">
                  Be specific and include steps to reproduce if reporting a bug
                </div>
              </div>

              {/* Related Post/User IDs (optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Related Post ID (optional)
                  </label>
                  <input
                    type="text"
                    name="related_post_id"
                    value={formData.related_post_id || ""}
                    onChange={handleInputChange}
                    placeholder="Post ID if applicable"
                    className="w-full bg-black/40 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Related User ID (optional)
                  </label>
                  <input
                    type="text"
                    name="related_user_id"
                    value={formData.related_user_id || ""}
                    onChange={handleInputChange}
                    placeholder="User ID if applicable"
                    className="w-full bg-black/40 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Allow Contact */}
              <div className="flex items-start gap-3 p-4 bg-black/20 rounded-lg border border-stone-700/50">
                <input
                  type="checkbox"
                  id="allow_contact"
                  name="allow_contact"
                  checked={formData.allow_contact}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 accent-emerald-500 mt-1"
                />
                <div>
                  <label
                    htmlFor="allow_contact"
                    className="text-gray-300 block mb-1"
                  >
                    Allow admins to contact me about this
                  </label>
                  <p className="text-gray-400 text-sm">
                    If checked, administrators may contact you at{" "}
                    {session?.user?.email} for follow-up questions
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">
                    Important Information
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• All suggestions are reviewed by the admin team</li>
                    <li>
                      • You can track the status of your submission in your
                      dashboard
                    </li>
                    <li>
                      • Please be respectful and constructive in your feedback
                    </li>
                    {formData.type === "bug_report" && (
                      <li>
                        • For bug reports, please include steps to reproduce
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit{" "}
                    {formData.type === "bug_report"
                      ? "Bug Report"
                      : formData.type === "content_report"
                      ? "Content Report"
                      : "Suggestion"}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
