"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../../(components)/PageWrapper";
import { useState, useEffect } from "react";
// import axios from "axios";
import CustomLoader from "../../(components)/Components/utils/Loader";
import {
  Users,
  FileText,
  FolderOpen,
  Heart,
  Ticket,
  UserPlus,
  Settings,
  Shield,
  Flag,
  ClipboardList,
  BookOpen,
  Search,
  Database,
  NotebookTabs,
} from "lucide-react";

// TODO
// Types for better type safety
interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
  totalReactions: number;
  activeInvites: number;
  pendingReports: number;
  last30DaysSignups: number;
}

// TODO
interface ActivityItem {
  action: string;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  // State for real data
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCategories: 0,
    totalReactions: 0,
    activeInvites: 0,
    pendingReports: 0,
    last30DaysSignups: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data - replace with your actual API endpoints
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO
        setStats({
          totalUsers: 1247,
          totalPosts: 5432,
          totalCategories: 28,
          totalReactions: 18943,
          activeInvites: 15,
          pendingReports: 8,
          last30DaysSignups: 156,
        });
        setRecentActivity([
          {
            action: "user_signup",
            description: "New user registered",
            time: "2 mins ago",
          },
          {
            action: "post_create",
            description: "New post created",
            time: "5 mins ago",
          },
          {
            action: "content_report",
            description: "Content report submitted",
            time: "12 mins ago",
          },
          {
            action: "invite_token_create",
            description: "New invite token generated",
            time: "1 hour ago",
          },
        ]);
        // Example API calls - replace with your actual endpoints
        // const [statsResponse, activityResponse] = await Promise.all([
        //     axios.get('/api/admin/dashboard-stats'),
        //     axios.get('/api/admin/recent-activity')
        // ]);

        // if (statsResponse.data.success) {
        //     setStats(statsResponse.data.data);
        // }

        // if (activityResponse.data.success) {
        //     setRecentActivity(activityResponse.data.data);
        // }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 1247,
          totalPosts: 5432,
          totalCategories: 28,
          totalReactions: 18943,
          activeInvites: 15,
          pendingReports: 8,
          last30DaysSignups: 156,
        });
        setRecentActivity([
          {
            action: "user_signup",
            description: "New user registered",
            time: "2 mins ago",
          },
          {
            action: "post_create",
            description: "New post created",
            time: "5 mins ago",
          },
          {
            action: "content_report",
            description: "Content report submitted",
            time: "12 mins ago",
          },
          {
            action: "invite_token_create",
            description: "New invite token generated",
            time: "1 hour ago",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Category Manager",
      description: "Manage post categories",
      href: "/admin/categories-manager",
      icon: BookOpen,
    },
    {
      title: "Invite Manager",
      description: "Create and manage invite tokens",
      href: "/admin/invite-code-manager",
      icon: Ticket,
    },
    {
      title: "User Management",
      description: "Manage users and permissions",
      href: "/admin/users",
      icon: Shield,
    },
    {
      title: "Public Suggestions",
      description: "Review reported content",
      href: "/admin/suggestions-manager",
      icon: Flag,
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Audit Logs",
      description: "View system activity logs",
      href: "/admin/audit-logs",
      icon: ClipboardList,
    },
    {
      title: "Routes Access",
      description: "Manage Routes & Pages Access",
      href: "/admin/routes-access",
      icon: NotebookTabs,
    },
    {
      title: "Redis",
      description: "View and manage Redis",
      href: "/admin/redis-manager",
      icon: Database,
    },
  ];

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden">
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
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your platform and monitor activity
            </p>

            {/* Go Back Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
            >
              ← Go Back to Admin Home
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
          >
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              icon={FileText}
            />
            <StatCard
              title="Categories"
              value={stats.totalCategories}
              icon={FolderOpen}
            />
            <StatCard
              title="Reactions"
              value={stats.totalReactions}
              icon={Heart}
            />
            <StatCard
              title="Active Invites"
              value={stats.activeInvites}
              icon={Ticket}
            />
            <StatCard
              title="Last 30 Day Signups"
              value={stats.last30DaysSignups}
              icon={UserPlus}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Admin Panels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Admin Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Link href={action.href}>
                        <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">
                              <action.icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {action.description}
                              </p>
                            </div>
                            <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                              →
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-stone-700/50 hover:border-emerald-500/50 transition-all duration-300"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          {activity.description}
                        </p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pending Reports Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Pending Suggestions
                  </h2>
                  <p className="text-gray-300">
                    {stats.pendingReports} Suggestions waiting for review
                  </p>
                </div>
                <Link
                  href="/admin/reports"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Review Suggestions
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );
}
