'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageWrapper from '../../(components)/PageWrapper';
import CustomLoader from '../../(components)/utils/Loader';
import { Shield, Search, Filter, RefreshCw, Calendar, User, Clock, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import getAxiosErrorMessage from '../../../utils/Variables/getAxiosError.util';
import { AuditLog } from '../../../types/AuditLogger/Audit.type';
import { GetAuditLogsResponseDTO } from '../../../types/DTO/Audit.DTO';

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [actionType, setActionType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const actionTypes = [
    'user_signup', 'user_update', 'user_ban', 'user_unban',
    'admin_promote', 'admin_demote', 'mod_promote', 'mod_demote',
    'post_create', 'post_update', 'post_delete', 'post_feature', 'post_unfeature',
    'category_create', 'category_update', 'category_delete',
    'reaction_create', 'reaction_delete', 'invite_token_create', 'invite_token_deactivate',
    'suggestion_create', 'suggestion_update', 'suggestion_delete', 'suggestion_status_change',
    'settings_update', 'system'
  ];

  const fetchLogs = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(actionType && { action_type: actionType }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate })
      });

      const response = await axios.get<GetAuditLogsResponseDTO>(`/api/admin/audit-logs?${params}`);
      setLogs(response.data.audit_logs);
      setPagination(response.data.pagination);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, 'Failed to fetch audit logs'));
    } finally {
      setLoading(false);
    }
  }, [search, actionType, startDate, endDate, pagination.limit]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleSearch = () => {
    fetchLogs(1);
  };

  const handleReset = () => {
    setSearch('');
    setActionType('');
    setStartDate('');
    setEndDate('');
    fetchLogs(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatActionType = (actionType: string) => {
    return actionType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes('create') || actionType.includes('promote')) {
      return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
    }
    if (actionType.includes('delete') || actionType.includes('ban') || actionType.includes('demote')) {
      return 'text-red-400 bg-red-500/20 border-red-500/50';
    }
    if (actionType.includes('update') || actionType.includes('change')) {
      return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    }
    return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading && logs.length === 0) {
    return <CustomLoader fullscreen random_text />;
  }

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Audit Logs
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Monitor system activities and user actions
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

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end mb-4">
              {/* Search Input */}
              <div className="flex-1 w-full">
                <label htmlFor="search" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by description, actor name, or email..."
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
                />
              </div>

              {/* Action Type Filter */}
              <div className="w-full lg:w-64">
                <label htmlFor="actionType" className="text-sm font-medium text-gray-300 mb-2 block">
                  Action Type
                </label>
                <select
                  id="actionType"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="">All Actions</option>
                  {actionTypes.map(type => (
                    <option key={type} value={type}>
                      {formatActionType(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 transition-all duration-300 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col lg:flex-row gap-4 pt-4 border-t border-stone-700"
              >
                <div className="flex-1">
                  <label htmlFor="startDate" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer"
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 flex-1"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 transition-all duration-300 flex items-center justify-center gap-2 flex-1"
              >
                Reset Filters
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{pagination.total}</div>
              <div className="text-gray-400 text-sm">Total Logs</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {logs.filter(log => log.action_type.includes('create') || log.action_type.includes('promote')).length}
              </div>
              <div className="text-gray-400 text-sm">Create Actions</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {logs.filter(log => log.action_type.includes('delete') || log.action_type.includes('ban')).length}
              </div>
              <div className="text-gray-400 text-sm">Delete Actions</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {logs.filter(log => log.action_type.includes('update') || log.action_type.includes('change')).length}
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
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-400" />
                Audit Logs ({pagination.total})
              </h2>
              <div className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No audit logs found.</p>
                <p className="text-sm">Try adjusting your search filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20 border-b border-stone-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-700">
                    {logs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="hover:bg-black/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getActionColor(log.action_type)}`}>
                            <span className="text-xs font-medium">
                              {formatActionType(log.action_type)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-white">{log.actor.display_name || log.actor.name || 'System'}</div>
                              <div className="text-gray-400 text-xs">{log.actor.email || 'N/A'}</div>
                            </div>
                            {log.actor.user_id && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => copyToClipboard(log.actor.user_id!)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.target ? (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-white">{log.target.name || '--'}</div>
                                <div className="text-gray-400 text-xs">{log.target.username ? `@${log.target.username}` : '--'}</div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => copyToClipboard(log.target!.user_id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                              </motion.button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="text-sm text-gray-300 line-clamp-2">
                            {log.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Clock className="w-4 h-4" />
                            {formatDateTime(log.performed_at)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Pagination and Refresh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            {/* Pagination */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-stone-700 text-white rounded-xl hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </motion.button>
              <span className="text-gray-300 text-sm px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-stone-700 text-white rounded-xl hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </motion.button>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchLogs(pagination.page)}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}