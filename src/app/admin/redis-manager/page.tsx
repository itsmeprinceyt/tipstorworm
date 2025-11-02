/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Database, RefreshCw, Trash2, Search, Layers } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import PageWrapper from "../../(components)/PageWrapper";
import { RedisKey, DeleteModalState, ExpandedKeys } from "../../../types/Redis/RedisKeyDate.type";
import CustomLoader from "../../(components)/Components/utils/Loader";

export default function RedisCacheManager() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [redisData, setRedisData] = useState<RedisKey[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    keyToDelete: null,
    isBulk: false
  });
  const [expandedKeys, setExpandedKeys] = useState<ExpandedKeys>({});

  const fetchRedisData = async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get("/api/admin/redis-manager");
      setRedisData(data.data || []);
      toast.success(`Loaded ${data.data?.length || 0} keys`);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to fetch cache data"));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRedisData();
  }, []);

  const handleFlushCache = async () => {
    setDeleteModal({
      isOpen: true,
      keyToDelete: null,
      isBulk: true
    });
  };

  const confirmFlushCache = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/admin/redis-manager');
      toast.success(data?.message || "Cache flushed successfully!");
      setRedisData([]);
      setDeleteModal({ isOpen: false, keyToDelete: null, isBulk: false });
      setExpandedKeys({});
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to flush cache"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = (key: string) => {
    setDeleteModal({
      isOpen: true,
      keyToDelete: key,
      isBulk: false
    });
  };

  const confirmDeleteKey = async () => {
    if (!deleteModal.keyToDelete) return;

    try {
      const { data } = await axios.delete(`/api/admin/redis-manager?key=${encodeURIComponent(deleteModal.keyToDelete)}`);
      toast.success(data?.message || "Key deleted successfully!");
      setRedisData(prev => prev.filter(item => item.key !== deleteModal.keyToDelete));
      setDeleteModal({ isOpen: false, keyToDelete: null, isBulk: false });

      const newExpandedKeys = { ...expandedKeys };
      delete newExpandedKeys[deleteModal.keyToDelete];
      setExpandedKeys(newExpandedKeys);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to delete key"));
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatTTL = (ttl: number) => {
    if (ttl === -1) return "No expiry";
    if (ttl === -2) return "Does not exist";

    const hours = Math.floor(ttl / 3600);
    const minutes = Math.floor((ttl % 3600) / 60);
    const seconds = ttl % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatValuePreview = (item: RedisKey) => {
    try {
      if (item.value === null || item.value === undefined) return "null";

      switch (item.type) {
        case 'string':
          const str = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          return str.length > 80 ? str.substring(0, 80) + '...' : str;

        case 'list':
          return `List [${Array.isArray(item.value) ? item.value.length : 0} items]`;

        case 'set':
          return `Set [${Array.isArray(item.value) ? item.value.length : 0} members]`;

        case 'zset':
          return `Sorted Set [${Array.isArray(item.value) ? item.value.length / 2 : 0} members]`;

        case 'hash':
          return `Hash [${Object.keys(item.value || {}).length} fields]`;

        default:
          return `Type: ${item.type}`;
      }
    } catch {
      return "Unable to display value";
    }
  };

  const renderExpandedValue = (item: RedisKey) => {
    if (!expandedKeys[item.key]) return null;

    try {
      switch (item.type) {
        case 'hash':
          return (
            <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
              <div className="text-xs font-semibold text-gray-300 mb-3 tracking-wide">HASH FIELDS</div>
              <div className="space-y-2">
                {Object.entries(item.value || {}).map(([field, value], index) => (
                  <div key={index} className="flex text-sm font-mono bg-black/30 p-2 rounded-lg border border-stone-600">
                    <span className="text-gray-300 flex-shrink-0 w-32 truncate font-medium" title={field}>
                      {field}:
                    </span>
                    <span className="text-white ml-3 flex-1 truncate" title={String(value)}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'list':
          return (
            <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
              <div className="text-xs font-semibold text-gray-300 mb-3 tracking-wide">LIST ITEMS</div>
              <div className="space-y-2">
                {(item.value || []).map((value: any, index: number) => (
                  <div key={index} className="text-sm font-mono text-white bg-black/30 p-2 rounded-lg border border-stone-600">
                    <span className="text-gray-400 text-xs mr-2">[{index}]</span>
                    {JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </div>
          );

        case 'set':
          return (
            <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
              <div className="text-xs font-semibold text-gray-300 mb-3 tracking-wide">SET MEMBERS</div>
              <div className="space-y-2">
                {(item.value || []).map((value: any, index: number) => (
                  <div key={index} className="text-sm font-mono text-white bg-black/30 p-2 rounded-lg border border-stone-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    {JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </div>
          );

        case 'zset':
          return (
            <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
              <div className="text-xs font-semibold text-gray-300 mb-3 tracking-wide">SORTED SET (score: value)</div>
              <div className="space-y-3">
                {(item.value || []).map((value: any, index: number) => (
                  <div key={index} className="text-sm font-mono text-white">
                    {index % 2 === 0 ? (
                      <div className="bg-black/30 p-2 rounded-lg border border-stone-600">
                        <span className="text-orange-400 font-medium">Score:</span> {value}
                      </div>
                    ) : (
                      <div className="bg-black/20 p-2 rounded-lg border border-stone-600 ml-4">
                        <span className="text-green-400 font-medium">Value:</span> {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return (
            <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
              <div className="text-xs font-semibold text-gray-300 mb-3 tracking-wide">FULL VALUE</div>
              <pre className="text-sm font-mono text-white bg-black/30 p-3 rounded-lg border border-stone-600 overflow-x-auto">
                {JSON.stringify(item.value, null, 2)}
              </pre>
            </div>
          );
      }
    } catch {
      return (
        <div className="mt-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-stone-700">
          <div className="text-sm text-gray-300 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Unable to display expanded value
          </div>
        </div>
      );
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      string: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      list: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      set: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
      zset: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      hash: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
      default: "bg-gray-500/20 text-gray-400 border border-gray-500/30"
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  const getTTLColor = (ttl: number) => {
    if (ttl === -1) return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    if (ttl < 60) return "bg-red-500/20 text-red-400 border border-red-500/30";
    if (ttl < 300) return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
    return "bg-green-500/20 text-green-400 border border-green-500/30";
  };

  const isExpandable = (type: string) => {
    return ['hash', 'list', 'set', 'zset'].includes(type);
  };

  const filteredData = redisData.filter(item =>
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching && redisData.length === 0) {
    return <CustomLoader fullscreen random_text />;
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
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Redis Cache Manager
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Monitor and manage Redis cache in real-time
                </p>

                {/* Go Back Button */}
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
                >
                  <ArrowLeft size={16} />
                  Back to Dev Panel
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {redisData.length}
              </div>
              <div className="text-gray-400 text-sm">Total Keys</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {redisData.filter(item => item.ttl === -1).length}
              </div>
              <div className="text-gray-400 text-sm">Persistent</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {redisData.filter(item => item.ttl > 0).length}
              </div>
              <div className="text-gray-400 text-sm">Expiring</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {formatSize(redisData.reduce((acc, item) => acc + item.size, 0))}
              </div>
              <div className="text-gray-400 text-sm">Total Size</div>
            </div>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search keys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 text-sm border border-stone-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-black/30 backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchRedisData}
                  disabled={isFetching}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm border border-stone-600 bg-stone-900 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 cursor-pointer rounded-xl disabled:opacity-50 transition-all duration-200"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  {isFetching ? "Refreshing..." : "Refresh"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFlushCache}
                  disabled={isLoading || redisData.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Flush All
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Cache Keys List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Layers className="w-6 h-6 text-blue-400" />
                Cache Keys ({filteredData.length})
              </h2>
            </div>

            {/* Table Content */}
            {filteredData.length === 0 ? (
              <div className="text-center p-16">
                <div className="w-16 h-16 bg-stone-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No keys found</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  {redisData.length === 0 ? "Your Redis cache is empty." : "No keys match your search criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-700">
                  <thead className="bg-stone-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Key</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">TTL</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/20 divide-y divide-stone-700">
                    {filteredData.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr className="hover:bg-stone-800/30 transition-all duration-200 group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-white max-w-xs truncate group-hover:text-gray-300 transition-colors" title={item.key}>
                              {item.key}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getTTLColor(item.ttl)}`}>
                              {formatTTL(item.ttl)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                            {formatSize(item.size)}
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-sm text-gray-400 font-mono max-w-md truncate cursor-pointer hover:text-white transition-all duration-200 ${isExpandable(item.type) ? 'hover:underline decoration-2 underline-offset-2' : ''
                                }`}
                              onClick={() => isExpandable(item.type) && toggleExpand(item.key)}
                              title={isExpandable(item.type) ? "Click to expand" : ""}
                            >
                              {formatValuePreview(item)}
                              {isExpandable(item.type) && (
                                <span className="ml-2 text-xs text-gray-500 transition-transform duration-200">
                                  {expandedKeys[item.key] ? '▼' : '▶'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteKey(item.key)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/30 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </motion.button>
                          </td>
                        </tr>
                        {expandedKeys[item.key] && (
                          <tr className="bg-stone-800/20">
                            <td colSpan={6} className="px-6 py-4 border-t border-stone-700">
                              {renderExpandedValue(item)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/80 backdrop-blur-sm border border-stone-700 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {deleteModal.isBulk ? "Flush Entire Cache" : "Delete Key"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6 pl-16">
                {deleteModal.isBulk
                  ? `Are you sure you want to flush the entire Redis cache? This will delete all ${redisData.length} keys.`
                  : `Are you sure you want to delete the key "${deleteModal.keyToDelete}"?`
                }
              </p>

              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteModal({ isOpen: false, keyToDelete: null, isBulk: false })}
                  className="px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-stone-700 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={deleteModal.isBulk ? confirmFlushCache : confirmDeleteKey}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all duration-200 font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-400"></div>
                      {deleteModal.isBulk ? "Flushing..." : "Deleting..."}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleteModal.isBulk ? "Flush Cache" : "Delete Key"}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}