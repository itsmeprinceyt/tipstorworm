"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Code,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getDevLogs } from "../../utils/Website/DevLogs.util";
import { DevLog } from "../../types/Website/DevLogs.type";
import PageWrapper from "../(components)/PageWrapper";
import CustomLoader from "../(components)/utils/Loader";

export default function DevLogsPage() {
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logsPerPage] = useState<number>(5);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const devLogs = await getDevLogs();
        setLogs(devLogs);
      } catch (error: unknown) {
        console.error("Failed to load dev logs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-indigo-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Code className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Public Dev Logs
            </h1>
            <p className="text-gray-300 text-lg">
              Latest updates and changes to the platform
            </p>
          </motion.div>

          {/* Logs List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {currentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden hover:border-stone-700 transition-all duration-200"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedLog(expandedLog === log.id ? null : log.id)
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {log.title}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(log.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Code className="w-4 h-4" />
                          {log.version}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 hover:text-white transition-colors">
                      {expandedLog === log.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300">{log.description}</p>
                </div>

                <AnimatePresence>
                  {expandedLog === log.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-stone-700"
                    >
                      <div className="p-6 bg-black/20">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-400" />
                          Changes:
                        </h4>
                        <ul className="space-y-2">
                          {log.changes.map((change, changeIndex) => (
                            <li
                              key={changeIndex}
                              className="flex items-start gap-3 text-gray-300"
                            >
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <span className="text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12 pt-8 border-t border-stone-700"
          >
            <p className="text-gray-400">
              {logs.length} total updates • Last:{" "}
              {logs.length > 0 ? formatDate(logs[0].date) : "Never"}
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
