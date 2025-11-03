"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  AlertTriangle,
  RefreshCw,
  Settings,
  Edit3,
  Save,
  X,
  Trash2,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import PageWrapper from "../../(components)/PageWrapper";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import CustomLoader from "../../(components)/Components/utils/Loader";
import { RouteAccessRowProps } from "../../../types/Admin/Settings/RouteAccessRow.type";

/**
 * TODO:
 * 1. Remove Live
 * 2. Refresh button
 * 3. Remove extra refresh button
 */

function RouteAccessRow({
  id,
  routeKey,
  enabled,
  onToggleSuccess,
  onRequestRename,
  onRequestDelete,
}: RouteAccessRowProps) {
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(routeKey);
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await axios.patch(`/api/admin/routes-access/${routeKey}`);
      toast.success(res.data?.message || "Toggled successfully");
      setCurrentEnabled(!currentEnabled);
      onToggleSuccess();
    } catch (err: unknown) {
      toast.error(
        getAxiosErrorMessage(
          err,
          "An unexpected error occurred while toggling."
        )
      );
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(routeKey);
  };

  const handleSave = () => {
    if (!editValue.trim() || editValue === routeKey) {
      setIsEditing(false);
      return;
    }
    onRequestRename(routeKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(routeKey);
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Route key copied to clipboard!");
  };

  const isBusy = isToggling;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-4 hover:bg-black/50 transition-all duration-200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* ID */}
        <div className="lg:col-span-1">
          <div className="text-sm font-medium text-gray-400 mb-2">ID</div>
          <div className="text-xl font-bold text-white bg-black/40 px-3 py-2 rounded-lg border border-stone-700">
            #{id + 1}
          </div>
        </div>

        {/* Route Key */}
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-gray-400 mb-2">
            Route Key
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
              autoFocus
              placeholder="Enter route key"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => copyToClipboard(routeKey)}
            >
              <code className="flex-1 font-mono text-white bg-black/40 px-4 py-3 rounded-xl border border-stone-700 group-hover:border-emerald-500/50 transition-colors break-all">
                {routeKey}
              </code>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
            </motion.div>
          )}
        </div>

        {/* Status */}
        <div className="lg:col-span-2">
          <div className="text-sm font-medium text-gray-400 mb-2">Status</div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
              currentEnabled
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            {currentEnabled ? (
              <>
                <Eye size={14} />
                Enabled
              </>
            ) : (
              <>
                <EyeOff size={14} />
                Disabled
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-4">
          <div className="text-sm font-medium text-gray-400 mb-2">Actions</div>
          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={!editValue.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Save size={16} />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-600 text-white font-semibold rounded-xl hover:bg-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-200"
                >
                  <X size={16} />
                  Cancel
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggle}
                  disabled={isBusy}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    currentEnabled
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isBusy ? (
                    <CustomLoader
                      color={
                        currentEnabled ? "text-amber-400" : "text-emerald-400"
                      }
                      size={5}
                    />
                  ) : currentEnabled ? (
                    <>
                      <EyeOff size={16} />
                      Disable
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Enable
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Edit3 size={16} />
                  Edit
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRequestDelete(routeKey)}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Trash2 size={16} />
                  Delete
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Page Component
export default function RoutesAccessAdmin() {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [newRouteId, setNewRouteId] = useState<string>("");

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [renameTarget, setRenameTarget] = useState<{
    oldKey: string;
    newKey: string;
  } | null>(null);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const fetchSettings = async () => {
    try {
      setIsFetching(true);
      const { data } = await axios.get("/api/admin/routes-access");
      setSettings(data);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to fetch routes"));
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  const handleAddRoute = async () => {
    if (!newRouteId.trim()) return;
    try {
      setIsFetching(true);
      const res = await axios.post(
        `/api/admin/routes-access/add/${newRouteId}`
      );
      toast.success(res.data?.message || "Route added successfully");
      setNewRouteId("");
      fetchSettings();
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to add route"));
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateRouteConfirmed = async () => {
    if (!renameTarget) return;
    setIsRenaming(true);
    try {
      const res = await axios.patch(
        `/api/admin/routes-access/update/${renameTarget.oldKey}`,
        { route: renameTarget.newKey }
      );
      toast.success(res.data?.message || "Route renamed successfully");
      fetchSettings();
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to rename route"));
    } finally {
      setIsRenaming(false);
      setRenameTarget(null);
    }
  };

  const handleDeleteRouteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `/api/admin/routes-access/remove/${deleteTarget}`
      );
      toast.success(res.data?.message || "Route deleted successfully");
      fetchSettings();
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to delete route"));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  const enabledCount = Object.values(settings).filter(Boolean).length;
  const disabledCount = Object.values(settings).filter((v) => !v).length;

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-black to-purple-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sky-500/20 rounded-lg">
                <Settings className="w-8 h-8 text-sky-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Route Access Control
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Manage application routes and page access permissions
                </p>

                {/* Go Back Button */}
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
                >
                  <ArrowLeft size={16} />
                  Go Back to Dashboard
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
                {Object.keys(settings).length}
              </div>
              <div className="text-gray-400 text-sm">Total Routes</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {enabledCount}
              </div>
              <div className="text-gray-400 text-sm">Enabled</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {disabledCount}
              </div>
              <div className="text-gray-400 text-sm">Disabled</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {isFetching ? (
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Live"
                )}
              </div>
              <div className="text-gray-400 text-sm">Status</div>
            </div>
          </motion.div>

          {/* Add Route Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-emerald-400" />
              Add New Route
            </h2>

            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1 w-full">
                <label
                  htmlFor="newRoute"
                  className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Route Path
                </label>
                <input
                  type="text"
                  id="newRoute"
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  placeholder="Enter route path (e.g., /admin/users)"
                  className="w-full px-4 py-2.5 text-sm border border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-black/30 backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                  disabled={isFetching}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRoute()}
                />
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddRoute}
                  disabled={isFetching || !newRouteId.trim()}
                  className="flex items-center gap-2 px-6 py-3 text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isFetching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Route
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchSettings}
                  className="flex items-center gap-2 px-6 py-3 text-sm bg-stone-700 text-stone-300 border border-stone-600 rounded-xl hover:bg-stone-600 transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Routes
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Routes List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-stone-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings className="w-6 h-6 text-sky-400" />
                Managed Routes ({Object.keys(settings).length})
              </h2>
              <div className="text-sm text-gray-400">
                Enabled {enabledCount}
                {" | "}
                Disabled {disabledCount}
              </div>
            </div>

            {Object.keys(settings).length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No routes configured</p>
                <p className="text-sm">
                  Add your first route using the form above
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(settings)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, value], index) => (
                      <RouteAccessRow
                        key={key}
                        id={index}
                        routeKey={key}
                        enabled={value}
                        onToggleSuccess={fetchSettings}
                        onRequestRename={(oldKey: string, newKey: string) =>
                          setRenameTarget({ oldKey, newKey })
                        }
                        onRequestDelete={(routeKey: string) =>
                          setDeleteTarget(routeKey)
                        }
                      />
                    ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Warning Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">
                  Warning: Modifying routes can break application functionality
                </p>
              </div>
            </div>
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchSettings}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Routes
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
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
                  Delete Route
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6 pl-16">
              Are you sure you want to delete the route &quot;{deleteTarget}
              &quot;?
            </p>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-stone-700 rounded-xl transition-all duration-200 font-medium cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteRouteConfirmed}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all duration-200 font-medium cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-400"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Route
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rename Confirmation Modal */}
      {renameTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-sm border border-stone-700 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <Edit3 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Rename Route
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  This will update the route key
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6 pl-16">
              Are you sure you want to rename &quot;{renameTarget.oldKey}&quot;
              to &quot;{renameTarget.newKey}&quot;?
            </p>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-stone-700 rounded-xl transition-all duration-200 font-medium cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateRouteConfirmed}
                disabled={isRenaming}
                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/30 disabled:opacity-50 transition-all duration-200 font-medium cursor-pointer"
              >
                {isRenaming ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-amber-400"></div>
                    Renaming...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Rename Route
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
}
