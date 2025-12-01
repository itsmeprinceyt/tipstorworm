/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  FileText,
  Edit2,
  Trash2,
  RefreshCw,
  MessageSquare,
  Bug,
  Lightbulb,
  Flag,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Users,
  MoreVertical,
  Calendar,
  Copy,
  Shield,
  Star,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

interface Suggestion {
  id: string;
  type:
    | "suggestion"
    | "bug_report"
    | "feature_request"
    | "content_report"
    | "other";
  title: string;
  description: string;
  status:
    | "open"
    | "in_review"
    | "planned"
    | "in_progress"
    | "completed"
    | "rejected"
    | "duplicate";
  priority: "low" | "medium" | "high" | "critical";
  vote_count: number;
  user_id: string;
  user_username?: string;
  user_email?: string;
  user_is_mod?: boolean;
  user_is_admin?: boolean;
  assigned_to?: string;
  assigned_username?: string;
  assigned_email?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  allow_contact: boolean;
  contact_email?: string;
  related_post_id?: string;
  related_user_id?: string;
  post_title?: string;
  related_user_username?: string;
  metadata?: any;
}

interface SuggestionStats {
  status: string;
  count: number;
  critical_count: number;
  high_count: number;
}

interface StatusOption {
  value: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface PriorityOption {
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

export default function AdminSuggestionsManager() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SuggestionStats[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Reduced for better card layout
    total: 0,
    pages: 1,
  });

  const [filters, setFilters] = useState({
    type: "",
    status: "",
    priority: "",
    assigned_to: "",
    search: "",
  });

  const [sort, setSort] = useState({ field: "created_at", order: "desc" });
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [quickStats, setQuickStats] = useState({
    total: 0,
    open: 0,
    critical: 0,
    unassigned: 0,
  });

  const statusOptions: StatusOption[] = [
    {
      value: "open",
      label: "Open",
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      value: "in_review",
      label: "In Review",
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      value: "planned",
      label: "Planned",
      icon: CheckCircle,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      value: "in_progress",
      label: "In Progress",
      icon: RefreshCw,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      value: "duplicate",
      label: "Duplicate",
      icon: FileText,
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    },
  ];

  const priorityOptions: PriorityOption[] = [
    {
      value: "critical",
      label: "Critical",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      value: "high",
      label: "High",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      value: "low",
      label: "Low",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
  ];

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sort.field,
        order: sort.order,
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.assigned_to && { assigned_to: filters.assigned_to }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`/api/admin/suggestions?${params}`);

      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
        setStats(response.data.data.stats);
        setPagination(response.data.data.pagination);

        // Calculate quick stats
        const total = response.data.data.pagination.total;
        const open =
          response.data.data.stats.find((s: any) => s.status === "open")
            ?.count || 0;
        const critical = response.data.data.suggestions.filter(
          (s: Suggestion) => s.priority === "critical"
        ).length;
        const unassigned = response.data.data.suggestions.filter(
          (s: Suggestion) => !s.assigned_to
        ).length;

        setQuickStats({ total, open, critical, unassigned });
      }
    } catch (error: any) {
      console.error("Error fetching suggestions:", error);
      toast.error(error.response?.data?.error || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleStatusUpdate = async (
    suggestionId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      const response = await axios.patch(
        `/api/admin/suggestions?id=${suggestionId}`,
        {
          status: newStatus,
          ...(notes && { admin_notes: notes }),
        }
      );

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchSuggestions();

        // Update local state
        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === suggestionId
              ? {
                  ...s,
                  status: newStatus as any,
                  updated_at: new Date().toISOString(),
                }
              : s
          )
        );
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const handlePriorityUpdate = async (
    suggestionId: string,
    newPriority: string
  ) => {
    try {
      const response = await axios.patch(
        `/api/admin/suggestions?id=${suggestionId}`,
        { priority: newPriority }
      );

      if (response.data.success) {
        toast.success(`Priority updated to ${newPriority}`);
        fetchSuggestions();

        // Update local state
        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === suggestionId ? { ...s, priority: newPriority as any } : s
          )
        );
      }
    } catch (error: any) {
      console.error("Error updating priority:", error);
      toast.error(error.response?.data?.error || "Failed to update priority");
    }
  };

  const handleAssignTo = async (suggestionId: string, userId: string) => {
    try {
      const response = await axios.patch(
        `/api/admin/suggestions?id=${suggestionId}`,
        { assigned_to: userId }
      );

      if (response.data.success) {
        toast.success("Assigned to user");
        fetchSuggestions();
      }
    } catch (error: any) {
      console.error("Error assigning suggestion:", error);
      toast.error(error.response?.data?.error || "Failed to assign suggestion");
    }
  };

  const handleDelete = async (suggestionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this suggestion? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `/api/admin/suggestions?id=${suggestionId}`
      );

      if (response.data.success) {
        toast.success("Suggestion deleted successfully");
        fetchSuggestions();
      }
    } catch (error: any) {
      console.error("Error deleting suggestion:", error);
      toast.error(error.response?.data?.error || "Failed to delete suggestion");
    }
  };

  const handleVote = async (suggestionId: string, increment: boolean) => {
    try {
      // This would call a separate API endpoint to handle voting
      // For now, we'll just update the local state
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId
            ? {
                ...s,
                vote_count: increment
                  ? s.vote_count + 1
                  : Math.max(0, s.vote_count - 1),
              }
            : s
        )
      );

      toast.success(increment ? "Voted up!" : "Voted down!");
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error("Failed to update vote");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug_report":
        return <Bug className="w-5 h-5" />;
      case "feature_request":
        return <Lightbulb className="w-5 h-5" />;
      case "content_report":
        return <Flag className="w-5 h-5" />;
      case "suggestion":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug_report":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "feature_request":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "content_report":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "suggestion":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in_review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "planned":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "in_progress":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "duplicate":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleCardExpansion = (suggestionId: string) => {
    setExpandedCard(expandedCard === suggestionId ? null : suggestionId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen p-4 md:p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-full text-xs bg-white shadow-xl hover:bg-gray-100 transition-all"
                >
                  ← Back to Admin Dashboard
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 flex items-center gap-3">
                  <MessageSquare className="w-7 h-7 md:w-8 md:h-8 text-blue-400" />
                  Suggestions Manager
                </h1>
                <p className="text-gray-300 text-sm md:text-lg">
                  Review and manage user feedback, bug reports, and suggestions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="px-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white hover:border-blue-500 transition-colors flex items-center gap-2"
                >
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white hover:border-blue-500 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {quickStats.total}
                    </div>
                    <div className="text-sm text-gray-300">Total</div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {quickStats.open}
                    </div>
                    <div className="text-sm text-gray-300">Open</div>
                  </div>
                  <AlertCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {quickStats.critical}
                    </div>
                    <div className="text-sm text-gray-300">Critical</div>
                  </div>
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {quickStats.unassigned}
                    </div>
                    <div className="text-sm text-gray-300">Unassigned</div>
                  </div>
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 md:p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters & Sorting
                </h2>
                <button
                  onClick={() => {
                    setFilters({
                      type: "",
                      status: "",
                      priority: "",
                      assigned_to: "",
                      search: "",
                    });
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      placeholder="Search title, description, or user..."
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="content_report">Content Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Priorities</option>
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sorting */}
              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-2">
                  Sort By
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setSort({ field: "created_at", order: "desc" })
                    }
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      sort.field === "created_at" && sort.order === "desc"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-black/40 border-stone-700 text-gray-300 hover:border-stone-500"
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() =>
                      setSort({ field: "created_at", order: "asc" })
                    }
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      sort.field === "created_at" && sort.order === "asc"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-black/40 border-stone-700 text-gray-300 hover:border-stone-500"
                    }`}
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() =>
                      setSort({ field: "vote_count", order: "desc" })
                    }
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      sort.field === "vote_count"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-black/40 border-stone-700 text-gray-300 hover:border-stone-500"
                    }`}
                  >
                    Most Votes
                  </button>
                  <button
                    onClick={() =>
                      setSort({ field: "priority", order: "desc" })
                    }
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      sort.field === "priority"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-black/40 border-stone-700 text-gray-300 hover:border-stone-500"
                    }`}
                  >
                    Highest Priority
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                } gap-4`}
              >
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden hover:border-stone-600 transition-all duration-300 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Card Header */}
                    <div
                      className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(
                              suggestion.type
                            )}`}
                          >
                            {getTypeIcon(suggestion.type)}
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                                suggestion.priority
                              )}`}
                            >
                              {suggestion.priority}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Vote Counter */}
                          <div className="flex items-center gap-1 bg-black/40 rounded-lg px-3 py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(suggestion.id, true);
                              }}
                              className="hover:text-emerald-400 transition-colors"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium mx-1">
                              {suggestion.vote_count}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(suggestion.id, false);
                              }}
                              className="hover:text-red-400 transition-colors"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardExpansion(suggestion.id);
                            }}
                            className="p-2 hover:bg-black/40 rounded-lg transition-colors"
                          >
                            {expandedCard === suggestion.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {suggestion.title}
                      </h3>

                      {/* Description Preview */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {suggestion.description}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{suggestion.user_username || "Anonymous"}</span>
                          {suggestion.user_is_admin && (
                            <Shield className="w-3 h-3 text-purple-400" />
                          )}
                          {suggestion.user_is_mod && (
                            <Star className="w-3 h-3 text-blue-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(suggestion.created_at)}</span>
                        </div>
                        {suggestion.assigned_username && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>
                              Assigned to {suggestion.assigned_username}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status and Actions Row */}
                      <div className="flex items-center justify-between">
                        {/* Status Dropdown */}
                        <div className="relative group">
                          <select
                            value={suggestion.status}
                            onChange={(e) =>
                              handleStatusUpdate(suggestion.id, e.target.value)
                            }
                            className={`appearance-none px-3 py-1 rounded-full text-xs border cursor-pointer ${getStatusColor(
                              suggestion.status
                            )} focus:outline-none`}
                          >
                            {statusOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-black"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          {/* Priority Selector */}
                          <select
                            value={suggestion.priority}
                            onChange={(e) =>
                              handlePriorityUpdate(
                                suggestion.id,
                                e.target.value
                              )
                            }
                            className={`appearance-none px-3 py-1 rounded-full text-xs border cursor-pointer ${getPriorityColor(
                              suggestion.priority
                            )} focus:outline-none`}
                          >
                            {priorityOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-black"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>

                          {/* More Actions Dropdown */}
                          <div className="relative group">
                            <button className="p-2 hover:bg-black/40 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-black/90 border border-stone-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(suggestion.id);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-stone-800 flex items-center gap-2"
                              >
                                <Copy className="w-3 h-3" />
                                Copy ID
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSuggestion(suggestion);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-stone-800 flex items-center gap-2"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignTo(suggestion.id, "user-id-here"); // You'd implement a user selector
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-stone-800 flex items-center gap-2"
                              >
                                <Users className="w-3 h-3" />
                                Assign To...
                              </button>
                              <div className="border-t border-stone-700 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(suggestion.id);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedCard === suggestion.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-4 pb-4 border-t border-stone-700 mt-4 pt-4"
                      >
                        {/* Full Description */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Description
                          </h4>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">
                            {suggestion.description}
                          </p>
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="text-gray-400 mb-1">Submitted</h4>
                            <p className="text-white">
                              {formatFullDate(suggestion.created_at)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-gray-400 mb-1">Last Updated</h4>
                            <p className="text-white">
                              {formatFullDate(suggestion.updated_at)}
                            </p>
                          </div>
                          {suggestion.contact_email &&
                            suggestion.allow_contact && (
                              <div>
                                <h4 className="text-gray-400 mb-1">
                                  Contact Email
                                </h4>
                                <p className="text-white">
                                  {suggestion.contact_email}
                                </p>
                              </div>
                            )}
                          {suggestion.post_title && (
                            <div>
                              <h4 className="text-gray-400 mb-1">
                                Related Post
                              </h4>
                              <p className="text-white truncate">
                                {suggestion.post_title}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Admin Notes */}
                        {suggestion.admin_notes && (
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <h4 className="text-sm font-medium text-yellow-400 mb-1">
                              Admin Notes
                            </h4>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">
                              {suggestion.admin_notes}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {suggestions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    No suggestions found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or check back later
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        type: "",
                        status: "",
                        priority: "",
                        assigned_to: "",
                        search: "",
                      });
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 mt-6 bg-black/40 border border-stone-800 rounded-xl">
                  <div className="text-sm text-gray-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} suggestions
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={pagination.page === 1}
                      className="px-4 py-2 text-sm bg-black/40 border border-stone-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-400">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 text-sm bg-black/40 border border-stone-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
