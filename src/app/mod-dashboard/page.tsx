"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import { Ban, ShieldCheck, FileText, Edit, ArrowLeft } from "lucide-react";

export default function ModDashboard() {
  const modActions = [
    {
      title: "Ban User",
      description: "Restrict user access to the platform",
      icon: Ban,
      action: "ban_user",
      color: "red",
      href: "/mod/ban-user",
    },
    {
      title: "Unban User",
      description: "Restore user access to the platform",
      icon: ShieldCheck,
      action: "unban_user",
      color: "green",
      href: "/mod/unban-user",
    },
    {
      title: "Create Post",
      description: "Create official moderator posts",
      icon: FileText,
      action: "create_post",
      color: "blue",
      href: "/mod-dashboard/create-post",
    },
    {
      title: "Manage Posts",
      description: "Moderate and manage user posts",
      icon: Edit,
      action: "manage_posts",
      color: "purple",
      href: "/mod/manage-posts",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      red: "border-red-500/50 hover:border-red-500 hover:bg-red-500/10",
      green: "border-green-500/50 hover:border-green-500 hover:bg-green-500/10",
      blue: "border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10",
      purple:
        "border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: "text-red-400",
      green: "text-green-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back to Admin Home
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">
              Moderator Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Content moderation and user management tools
            </p>
          </motion.div>

          {/* Mod Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {modActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <div
                    className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 cursor-pointer group h-full ${getColorClasses(
                      action.color
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`text-2xl p-3 rounded-lg bg-black/40 ${getIconColor(
                          action.color
                        )}`}
                      >
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg mb-2 group-hover:${getIconColor(
                            action.color
                          )} transition-colors`}
                        >
                          {action.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {action.description}
                        </p>
                      </div>
                      <div
                        className={`group-hover:${getIconColor(
                          action.color
                        )} transition-colors transform group-hover:translate-x-1 duration-300`}
                      >
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Moderation Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/20 rounded-lg border border-stone-700">
                  <div className="text-red-400 text-2xl font-bold">12</div>
                  <div className="text-gray-400 text-sm">Banned Users</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-stone-700">
                  <div className="text-yellow-400 text-2xl font-bold">8</div>
                  <div className="text-gray-400 text-sm">Pending Reviews</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-stone-700">
                  <div className="text-green-400 text-2xl font-bold">24</div>
                  <div className="text-gray-400 text-sm">Posts Today</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-stone-700">
                  <div className="text-blue-400 text-2xl font-bold">3</div>
                  <div className="text-gray-400 text-sm">Active Reports</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              Moderator access level • Limited administrative privileges
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
