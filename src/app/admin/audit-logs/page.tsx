"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import CustomLoader from "../../(components)/Components/utils/Loader";
import {
  Shield,
  Search,
  RefreshCw,
  Calendar,
  User,
  Clock,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  ChevronRight,
  Code,
} from "lucide-react";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import { AuditLog } from "../../../types/AuditLogger/Audit.type";
import { GetAuditLogsResponseDTO } from "../../../types/DTO/Audit.DTO";

const actionTypeGroups = {
  "User Management": [
    "user_signup",
    "user_update",
    "user_ban",
    "user_unban",
    "admin_promote",
    "admin_demote",
    "mod_promote",
    "mod_demote",
  ],
  "Content Management": [
    "post_create",
    "post_update",
    "post_delete",
    "post_feature",
    "post_unfeature",
    "category_create",
    "category_update",
    "category_delete",
  ],
  Interactions: [
    "reaction_create",
    "reaction_delete",
    "suggestion_create",
    "suggestion_update",
    "suggestion_delete",
    "suggestion_status_change",
  ],
  System: [
    "invite_token_create",
    "invite_token_deactivate",
    "settings_update",
    "system",
  ],
};

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const updateActiveFilters = useCallback(() => {
    const filters = [];
    if (search) filters.push(`Search: "${search}"`);
    if (actionType) filters.push(`Action: ${formatActionType(actionType)}`);
    if (startDate)
      filters.push(`From: ${new Date(startDate).toLocaleDateString()}`);
    if (endDate) filters.push(`To: ${new Date(endDate).toLocaleDateString()}`);
    setActiveFilters(filters);
  }, [search, actionType, startDate, endDate]);

  useEffect(() => {
    updateActiveFilters();
  }, [updateActiveFilters]);

  const fetchLogs = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(search && { search }),
          ...(actionType && { action_type: actionType }),
          ...(startDate && { start_date: startDate }),
          ...(endDate && { end_date: endDate }),
        });

        const response = await axios.get<GetAuditLogsResponseDTO>(
          `/api/admin/audit-logs?${params}`
        );
        setLogs(response.data.audit_logs);
        setPagination(response.data.pagination);
      } catch (err: unknown) {
        toast.error(getAxiosErrorMessage(err, "Failed to fetch audit logs"));
      } finally {
        setLoading(false);
      }
    },
    [search, actionType, startDate, endDate, pagination.limit]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleSearch = () => {
    fetchLogs(1);
  };

  const handleReset = () => {
    setSearch("");
    setActionType("");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
    setExpandedLogId(null);
    fetchLogs(1);
  };

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith("Search:")) {
      setSearch("");
    } else if (filterToRemove.startsWith("Action:")) {
      setActionType("");
    } else if (filterToRemove.startsWith("From:")) {
      setStartDate("");
    } else if (filterToRemove.startsWith("To:")) {
      setEndDate("");
    }
  };

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateMobile = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatActionType = (actionType: string) => {
    return actionType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatActionTypeMobile = (actionType: string) => {
    const words = actionType.split("_");
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes("create") || actionType.includes("promote")) {
      return "text-emerald-400 bg-emerald-500/20 border-emerald-500/50";
    }
    if (
      actionType.includes("delete") ||
      actionType.includes("ban") ||
      actionType.includes("demote")
    ) {
      return "text-red-400 bg-red-500/20 border-red-500/50";
    }
    if (actionType.includes("update") || actionType.includes("change")) {
      return "text-blue-400 bg-blue-500/20 border-blue-500/50";
    }
    return "text-gray-400 bg-gray-500/20 border-gray-500/50";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formatJSON = (obj: any) => {
    if (obj === null || obj === undefined) {
      return "No meta data is available";
    }
    if (Object.keys(obj).length === 0) {
      return "No meta data is available";
    }
    return JSON.stringify(obj, null, 2);
  };

  if (loading && logs.length === 0) {
    return <CustomLoader fullscreen random_text />;
  }

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-black to-green-900/5"></div>
        <div className="absolute top-4 left-4 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg mt-1">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-4xl font-bold text-white truncate">
                  Audit Logs
                </h1>
                <p className="text-gray-300 text-sm sm:text-lg mt-1 sm:mt-2">
                  Monitor system activities and user actions
                </p>

                {/* Go Back Button */}
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mt-3 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-lg shadow-white/10"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 sm:p-6 mb-6"
          >
            {/* Main Controls Row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs, users, or descriptions..."
                    className="w-full pl-10 pr-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              {/* Action Type Filter */}
              <div className="w-full lg:w-64">
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer text-sm"
                >
                  <option value="">All Action Types</option>
                  {Object.entries(actionTypeGroups).map(([category, types]) => (
                    <optgroup key={category} label={category}>
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {formatActionType(type)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Filter Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer border ${
                  showFilters
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                    : "bg-stone-700/50 text-white border-stone-600 hover:bg-stone-600/50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {activeFilters.map((filter) => (
                  <motion.div
                    key={filter}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-700 mt-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Range
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer text-sm"
                          />
                          <div className="text-xs text-gray-400 mt-1">
                            Start Date
                          </div>
                        </div>
                        <div>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer text-sm"
                          />
                          <div className="text-xs text-gray-400 mt-1">
                            End Date
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer font-medium"
              >
                <Search className="w-4 h-4" />
                Apply Filters
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
                Clear All
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchLogs(pagination.page)}
                className="flex-1 px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center hover:bg-black/50 transition-colors duration-200">
              <div className="text-2xl font-bold text-white mb-1">
                {pagination.total}
              </div>
              <div className="text-gray-400 text-sm">Total Logs</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center hover:bg-black/50 transition-colors duration-200">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {
                  logs.filter(
                    (log) =>
                      log.action_type.includes("create") ||
                      log.action_type.includes("promote")
                  ).length
                }
              </div>
              <div className="text-gray-400 text-sm">Create Actions</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center hover:bg-black/50 transition-colors duration-200">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {
                  logs.filter(
                    (log) =>
                      log.action_type.includes("delete") ||
                      log.action_type.includes("ban")
                  ).length
                }
              </div>
              <div className="text-gray-400 text-sm">Delete Actions</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center hover:bg-black/50 transition-colors duration-200">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {
                  logs.filter(
                    (log) =>
                      log.action_type.includes("update") ||
                      log.action_type.includes("change")
                  ).length
                }
              </div>
              <div className="text-gray-400 text-sm">Update Actions</div>
            </div>
          </motion.div>

          {/* Logs List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                Audit Logs
                <span className="text-gray-400 text-sm font-normal">
                  ({pagination.total} records)
                </span>
              </h2>
              <div className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No audit logs found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search filters
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20 border-b border-stone-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-8"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Target
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-700">
                      {logs.map((log, index) => (
                        <React.Fragment key={`${log}-${index}`}>
                          <motion.tr
                            key={`${log.id}-${index}}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="hover:bg-black/30 transition-colors duration-200 group cursor-pointer"
                            onClick={() => toggleExpand(log.id)}
                          >
                            <td className="px-6 py-4">
                              <motion.div
                                animate={{
                                  rotate: expandedLogId === log.id ? 90 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className="text-gray-400 hover:text-white"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${getActionColor(
                                  log.action_type
                                )}`}
                              >
                                <span className="font-medium">
                                  {formatActionType(log.action_type)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <div className="text-white truncate">
                                      {log.actor.display_name ||
                                        log.actor.name ||
                                        "System"}
                                    </div>
                                    <div className="text-gray-400 text-xs truncate">
                                      {log.actor.email || "N/A"}
                                    </div>
                                  </div>
                                </div>
                                {log.actor.user_id && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(log.actor.user_id!);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer p-1 hover:bg-white/10 rounded"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                                  </motion.button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {log.target ? (
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-white truncate">
                                        {log.target.name || "--"}
                                      </div>
                                      <div className="text-gray-400 text-xs truncate">
                                        {log.target.username
                                          ? `@${log.target.username}`
                                          : "--"}
                                      </div>
                                    </div>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(log.target!.user_id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer p-1 hover:bg-white/10 rounded"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                                  </motion.button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="text-sm text-gray-300 line-clamp-2">
                                {log.description || "No description"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Clock className="w-4 h-4" />
                                {formatDateTime(log.performed_at)}
                              </div>
                            </td>
                          </motion.tr>

                          {/* Expanded Metadata Row */}
                          <AnimatePresence>
                            {expandedLogId === log.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-black/20 border-b border-stone-700"
                              >
                                <td colSpan={6} className="px-6 py-4">
                                  <div className="flex items-start gap-3 mb-3">
                                    <Code className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                    <div>
                                      <h3 className="text-sm font-medium text-emerald-400 mb-2">
                                        Metadata
                                      </h3>
                                      <div className="bg-black/40 rounded-lg p-4 border border-stone-700">
                                        <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                          {formatJSON(log.meta)}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(formatJSON(log.meta));
                                      }}
                                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer flex items-center gap-2"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Copy JSON
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-stone-700">
                  {logs.map((log, index) => (
                    <div key={log.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="p-4 hover:bg-black/30 transition-colors duration-200 cursor-pointer"
                        onClick={() => toggleExpand(log.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{
                                rotate: expandedLogId === log.id ? 90 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className="text-gray-400"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                            <div
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border text-xs ${getActionColor(
                                log.action_type
                              )}`}
                            >
                              <span className="font-medium">
                                {formatActionTypeMobile(log.action_type)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDateMobile(log.performed_at)}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            {/* Actor */}
                            <div>
                              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Actor
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="min-w-0 flex-1">
                                  <div className="text-white truncate">
                                    {log.actor.display_name ||
                                      log.actor.name ||
                                      "System"}
                                  </div>
                                  <div className="text-gray-400 text-xs truncate">
                                    {log.actor.email || "N/A"}
                                  </div>
                                </div>
                                {log.actor.user_id && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(log.actor.user_id!);
                                    }}
                                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Target */}
                            <div>
                              <div className="text-xs text-gray-400 mb-1">
                                Target
                              </div>
                              {log.target ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="min-w-0 flex-1">
                                    <div className="text-white truncate">
                                      {log.target.name || "--"}
                                    </div>
                                    <div className="text-gray-400 text-xs truncate">
                                      {log.target.username
                                        ? `@${log.target.username}`
                                        : "--"}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(log.target!.user_id);
                                    }}
                                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <div className="text-xs text-gray-400 mb-1">
                              Description
                            </div>
                            <div className="text-sm text-gray-300 line-clamp-3">
                              {log.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Metadata for Mobile */}
                      <AnimatePresence>
                        {expandedLogId === log.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-black/20 border-t border-stone-700 overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <Code className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium text-emerald-400 mb-2">
                                    Metadata
                                  </h3>
                                  <div className="bg-black/40 rounded-lg p-3 border border-stone-700">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                      {formatJSON(log.meta)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(formatJSON(log.meta));
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy JSON
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div className="text-sm text-gray-400">
              Showing {logs.length} of {pagination.total} records
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2.5 bg-stone-700 text-white rounded-xl hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm cursor-pointer"
              >
                Previous
              </motion.button>

              <span className="text-gray-300 text-sm px-4 min-w-[120px] text-center">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2.5 bg-stone-700 text-white rounded-xl hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm cursor-pointer"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
