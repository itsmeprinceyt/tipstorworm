"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MyJWT } from "../../../types/User/JWT.type";
import colors from "../../../utils/Colors/Colors.util";

export default function ProfileDashboard() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<"profile" | "details">("profile");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (status === "loading") {
        return (
            <div style={{ backgroundColor: colors.background }} className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full border-4 animate-spin"
                    style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                />
            </div>
        );
    }

    const { user } = session!;
    const myUser = user as MyJWT;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
    };

    const ProfileCard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl shadow-lg p-6"
            style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}33`
            }}
        >
            <div className="flex flex-col items-center text-center mb-6">
                <motion.div
                    className="relative w-32 h-32 mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image
                        src={user.image || "/default-avatar.png"}
                        fill
                        alt={user.name || "User"}
                        className="rounded-full object-cover"
                        style={{ border: `4px solid ${colors.primary}4D` }}
                    />
                    <motion.div
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4"
                        style={{
                            backgroundColor: colors.accent,
                            borderColor: colors.background
                        }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                <motion.h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {user.name}
                </motion.h1>

                {user.username && (
                    <motion.p
                        className="font-medium mb-2"
                        style={{ color: colors.primary }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        @{user.username}
                    </motion.p>
                )}

                <motion.p
                    className="mb-4"
                    style={{ color: colors.text + 'CC' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {user.email}
                </motion.p>

                <motion.div
                    className="flex gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {myUser?.is_admin && (
                        <span
                            className="px-3 py-1 rounded-full text-sm font-medium border"
                            style={{
                                backgroundColor: colors.primary + '33',
                                color: colors.text,
                                borderColor: colors.primary + '4D'
                            }}
                        >
                            Admin
                        </span>
                    )}
                    {myUser?.is_mod && (
                        <span
                            className="px-3 py-1 rounded-full text-sm font-medium border"
                            style={{
                                backgroundColor: colors.secondary + '66',
                                color: colors.text,
                                borderColor: colors.secondary + '80'
                            }}
                        >
                            Moderator
                        </span>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={{
                        backgroundColor: colors.primary + '1A',
                        borderColor: colors.primary + '33'
                    }}
                >
                    <span style={{ color: colors.text }}>User ID</span>
                    <span
                        className="font-mono text-sm px-2 py-1 rounded border"
                        style={{
                            color: colors.text,
                            backgroundColor: colors.background,
                            borderColor: colors.primary + '33'
                        }}
                    >
                        {myUser?.user_id || myUser?.id}
                    </span>
                </div>

                <div
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={{
                        backgroundColor: colors.secondary + '33',
                        borderColor: colors.secondary + '4D'
                    }}
                >
                    <span style={{ color: colors.text }}>Status</span>
                    <span
                        className="px-2 py-1 rounded-full text-xs font-medium border"
                        style={{
                            backgroundColor: colors.accent + '4D',
                            color: colors.text,
                            borderColor: colors.accent + '66'
                        }}
                    >
                        Active
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );

    const DetailsCard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl shadow-lg p-6"
            style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}33`
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>User Details</h3>
                <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                    ></div>
                </div>
            </div>

            <div
                className="rounded-xl p-4 font-mono text-sm border"
                style={{
                    backgroundColor: colors.text,
                    borderColor: colors.primary + '4D'
                }}
            >
                <pre className="overflow-x-auto" style={{ color: colors.secondary }}>
                    <code>{JSON.stringify(user, null, 2)}</code>
                </pre>
            </div>
        </motion.div>
    );

    const StatsCard = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl shadow-lg p-6 border"
            style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: colors.text,
                borderColor: colors.primary + '4D'
            }}
        >
            <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm" style={{ color: colors.text + 'CC' }}>Active Session</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">
                        {myUser?.is_admin ? "Admin" : myUser?.is_mod ? "Mod" : "User"}
                    </div>
                    <div className="text-sm" style={{ color: colors.text + 'CC' }}>Role</div>
                </div>
            </div>
        </motion.div>
    );

    const tabVariants = {
        active: {
            backgroundColor: colors.primary,
            color: colors.text,
            scale: 1.05,
        },
        inactive: {
            backgroundColor: 'transparent',
            color: colors.text,
            scale: 1,
        }
    };

    return (
        <div style={{ backgroundColor: colors.background }} className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Profile Dashboard</h1>
                    <motion.button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 rounded-xl transition-all duration-200 font-medium shadow-sm disabled:opacity-50 border"
                        style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                            borderColor: colors.primary
                        }}
                    >
                        {isLoggingOut ? (
                            <div
                                className="w-4 h-4 border-2 rounded-full animate-spin mx-auto"
                                style={{
                                    borderColor: colors.text,
                                    borderTopColor: 'transparent'
                                }}
                            />
                        ) : (
                            "Logout"
                        )}
                    </motion.button>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Navigation */}
                        <motion.div
                            className="rounded-2xl shadow-lg p-2 border"
                            style={{
                                backgroundColor: colors.background,
                                borderColor: colors.primary + '33'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex space-x-2">
                                <motion.button
                                    onClick={() => setActiveTab("profile")}
                                    variants={tabVariants}
                                    animate={activeTab === "profile" ? "active" : "inactive"}
                                    className="flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all duration-200"
                                >
                                    Profile
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab("details")}
                                    variants={tabVariants}
                                    animate={activeTab === "details" ? "active" : "inactive"}
                                    className="flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all duration-200"
                                >
                                    Raw Data
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "profile" ? <ProfileCard /> : <DetailsCard />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Column */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <StatsCard />

                        {/* Quick Actions */}
                        <motion.div
                            className="rounded-2xl shadow-lg p-6 border"
                            style={{
                                backgroundColor: colors.background,
                                borderColor: colors.primary + '33'
                            }}
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Quick Actions</h3>
                            <div className="space-y-3">
                                <motion.button
                                    className="w-full text-left p-3 rounded-lg border transition-all duration-200"
                                    style={{
                                        borderColor: colors.primary + '33'
                                    }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="font-medium" style={{ color: colors.text }}>Edit Profile</div>
                                    <div className="text-sm" style={{ color: colors.text + 'B3' }}>Update your personal information</div>
                                </motion.button>
                                <motion.button
                                    className="w-full text-left p-3 rounded-lg border transition-all duration-200"
                                    style={{
                                        borderColor: colors.secondary + '4D'
                                    }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="font-medium" style={{ color: colors.text }}>Security Settings</div>
                                    <div className="text-sm" style={{ color: colors.text + 'B3' }}>Change password & 2FA</div>
                                </motion.button>
                                <motion.button
                                    className="w-full text-left p-3 rounded-lg border transition-all duration-200"
                                    style={{
                                        borderColor: colors.accent + '4D'
                                    }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="font-medium" style={{ color: colors.text }}>Preferences</div>
                                    <div className="text-sm" style={{ color: colors.text + 'B3' }}>Customize your experience</div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}