"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import { UserCheck, Users, ArrowRight, Crown, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function RoleSelectionPage() {
  const { data: session } = useSession();

  if (!session) return;
  const roles = [
    {
      title: "Admin",
      description: "Full system access with all permissions",
      href: "/admin/dashboard",
      icon: Crown,
      color: "from-amber-500 to-yellow-500",
      glowColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "border-amber-500/30",
      hoverColor: "hover:border-amber-400/50",
      buttonBorderColor: "group-hover:border-amber-400/60",
      features: [
        "Manage all users",
        "System configuration",
        "Audit logs access",
        "Full moderation powers",
      ],
    },
    {
      title: "Moderator",
      description: "Content moderation and user management",
      href: "/mod-dashboard",
      icon: UserCheck,
      color: "from-emerald-500 to-green-500",
      glowColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "border-emerald-500/30",
      hoverColor: "hover:border-emerald-400/50",
      buttonBorderColor: "group-hover:border-emerald-400/60",
      features: [
        "Content moderation",
        "User reports review",
        "Post management",
        "Basic user management",
      ],
    },
    {
      title: "User",
      description: "Standard user interface",
      href: `/profile/${session.user.username}`,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "border-blue-500/30",
      hoverColor: "hover:border-blue-400/50",
      buttonBorderColor: "group-hover:border-blue-400/60",
      features: [
        "Browse content",
        "Create posts",
        "Interact with community",
        "Personal profile",
      ],
    },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/20 rounded-full px-6 py-3 mb-8 shadow-2xl"
            >
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-300 font-medium bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                Role Selection
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                Choose Your Interface
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-lg py-2 px-4"
            >
              Select the appropriate interface based on your role and
              responsibilities
            </motion.p>
          </motion.div>

          {/* Enhanced Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <RoleCard key={role.title} role={role} index={index} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function RoleCard({
  role,
  index,
}: {
  role: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    glowColor: string;
    borderColor: string;
    hoverColor: string;
    buttonBorderColor: string;
    features: string[];
  };
  index: number;
}) {
  const Icon = role.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{
        scale: 1.03,
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.6,
        },
      }}
      className="h-full"
    >
      <Link href={role.href}>
        <div
          className={`relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border ${role.borderColor} ${role.hoverColor} rounded-2xl p-8 transition-all duration-500 cursor-pointer h-full flex flex-col group overflow-hidden shadow-2xl`}
          style={{
            boxShadow: `0 8px 32px 0 ${role.glowColor}`,
          }}
        >
          {/* Icon and Title */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${role.color} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
              whileHover={{
                rotate: 5,
                transition: { duration: 0.4 },
              }}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
            <p className="text-gray-300 font-light leading-relaxed">
              {role.description}
            </p>
          </div>

          {/* Features List */}
          <div className="flex-1 mb-8 relative z-10">
            <ul className="space-y-4">
              {role.features.map((feature, featureIndex) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.1 + featureIndex * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="flex items-center gap-4 text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${role.color} flex-shrink-0`}
                  />
                  <span className="font-medium">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Enhanced Action Button with Colored Border */}
          <motion.div
            whileHover={{ x: 8 }}
            className={`relative backdrop-blur-xl bg-white/5 border border-white/20 ${role.buttonBorderColor} rounded-xl p-4 transition-all duration-500 overflow-hidden`}
          >
            {/* Button Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`}
            />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-white font-semibold text-sm">
                Enter as {role.title}
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
