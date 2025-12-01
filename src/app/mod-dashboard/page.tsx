"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import {
  Ban,
  ShieldCheck,
  FileText,
  Edit,
  ArrowLeft,
  AlertTriangle,
  EyeOff,
} from "lucide-react";

export default function ModDashboard() {
  const modActions = [
    {
      title: "Ban User",
      description: "Restrict user access to the platform",
      icon: Ban,
      color: "red",
      href: "/mod/ban-user",
    },
    {
      title: "Unban User",
      description: "Restore user access to the platform",
      icon: ShieldCheck,
      color: "green",
      href: "/mod/unban-user",
    },
    {
      title: "Create Post",
      description: "Publish official moderator announcements",
      icon: FileText,
      color: "blue",
      href: "/mod-dashboard/create-post",
    },
    {
      title: "Manage Posts",
      description: "Review and moderate community content",
      icon: Edit,
      color: "purple",
      href: "/mod/manage-posts",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      red: "border-red-500/50 hover:border-red-500 hover:bg-red-500/10",
      green: "border-green-500/50 hover:border-green-500 hover:bg-green-500/10",
      blue: "border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10",
      purple:
        "border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
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
        {/* === Background Glow Effects === */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* === Header === */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Moderator Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Manage content, enforce rules, and maintain community standards.
            </p>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back to Admin Home
            </Link>
          </motion.div>

          {/* === Quick Stats Section === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          >
            <StatCard title="Banned Users" value={12} icon={Ban} color="red" />
            <StatCard
              title="Pending Reviews"
              value={8}
              icon={AlertTriangle}
              color="yellow"
            />
            <StatCard
              title="Posts Today"
              value={24}
              icon={FileText}
              color="green"
            />
            <StatCard
              title="Active Reports"
              value={3}
              icon={EyeOff}
              color="blue"
            />
          </motion.div>

          {/* === Moderator Tools Section === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Moderator Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {modActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={action.href}>
                    <div
                      className={`bg-black/40 backdrop-blur-sm border rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer group ${getColorClasses(
                        action.color
                      )}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-black/40 ${getIconColor(
                            action.color
                          )}`}
                        >
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg mb-1 group-hover:${getIconColor(
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
            </div>
          </motion.div>

          {/* === Footer Note === */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
          >
            <p className="text-gray-500 text-sm">
              Moderator Access Level — Limited administrative privileges
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* === Stat Card Component (Matches Admin UI) === */
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-6 h-6 ${colorMap[color]}`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );
}
