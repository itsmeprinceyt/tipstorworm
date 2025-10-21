"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "../(components)/PageWrapper";
import { Shield, UserCheck, Users, ArrowRight, Crown, } from "lucide-react";

export default function RoleSelectionPage() {
    const roles = [
        {
            title: "Admin",
            description: "Full system access with all permissions",
            href: "/admin/dashboard",
            icon: Crown,
            color: "from-amber-500 to-amber-500",
            borderColor: "border-amber-500/50",
            hoverColor: "hover:border-amber-500 hover:bg-amber-500/10",
            features: [
                "Manage all users",
                "System configuration",
                "Audit logs access",
                "Full moderation powers"
            ]
        },
        {
            title: "Moderator",
            description: "Content moderation and user management",
            href: "/mod",
            icon: UserCheck,
            color: "from-green-500 to-green-500",
            borderColor: "border-green-500/50",
            hoverColor: "hover:border-green-500 hover:bg-green-500/10",
            features: [
                "Content moderation",
                "User reports review",
                "Post management",
                "Basic user management"
            ]
        },
        {
            title: "User",
            description: "Standard user interface",
            href: "/dashboard",
            icon: Users,
            color: "from-blue-500 to-blue-500",
            borderColor: "border-blue-500/50",
            hoverColor: "hover:border-blue-500 hover:bg-blue-500/10",
            features: [
                "Browse content",
                "Create posts",
                "Interact with community",
                "Personal profile"
            ]
        }
    ];

    return (
        <PageWrapper>
            <div className="min-h-screen p-6 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-stone-800 rounded-full px-6 py-3 mb-6"
                        >
                            <Shield className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Role Selection</span>
                        </motion.div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Choose Your Interface
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Select the appropriate interface based on mood
                        </p>
                    </motion.div>

                    {/* Role Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {roles.map((role, index) => (
                            <RoleCard
                                key={role.title}
                                role={role}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

function RoleCard({ role, index }: {
    role: {
        title: string;
        description: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        borderColor: string;
        hoverColor: string;
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
            whileHover={{ scale: 1.02 }}
            className="h-full"
        >
            <Link href={role.href}>
                <div className={`bg-black/40 backdrop-blur-sm border ${role.borderColor} rounded-xl p-6 ${role.hoverColor} transition-all duration-300 cursor-pointer h-full flex flex-col group`}>
                    {/* Icon and Title */}
                    <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${role.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {role.title}
                        </h3>
                        <p className="text-gray-300">
                            {role.description}
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="flex-1 mb-6">
                        <ul className="space-y-3">
                            {role.features.map((feature, featureIndex) => (
                                <motion.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 + featureIndex * 0.1 }}
                                    className="flex items-center gap-3 text-sm text-gray-400"
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`} />
                                    {feature}
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-stone-700/50 group-hover:border-stone-600 transition-all duration-300"
                    >
                        <span className="text-white font-medium">
                            Enter as {role.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
}