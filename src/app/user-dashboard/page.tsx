"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import { MessageSquare, ArrowLeft, User, User2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const userActions = [
    {
      title: "My Profile",
      description: "View and customize your profile",
      icon: User2Icon,
      color: "emerald",
      href: session ? `/profile/${session.user.username}` : `/profile`,
    },
    {
      title: "Send Suggestions",
      description: "Share your ideas or report issues!",
      icon: MessageSquare,
      color: "emerald",
      href: "/user-dashboard/send-suggestion",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald:
        "border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/10",
    };
    return colors[color];
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "text-emerald-400",
    };
    return colors[color];
  };

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold text-white mt-4 mb-2">
              User Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back! Interact with the platform using the tools below.
            </p>
          </motion.div>

          {/* User Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
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

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              User
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
