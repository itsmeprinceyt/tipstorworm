"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
// import { MyJWT } from "../../../types/User/JWT.type";
import colors from "../../../utils/Colors/Colors.util";
import Maintenance from "../../(components)/utils/Maintenance";

export default function ProfileDashboard() {
    const { data: session, status } = useSession();
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
    //const myUser = user as MyJWT;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
    };

    // Mock data for skills and features
    const skills = ["HTML", "CSS", "Dart", "C++", "UI Design"];
    const features = [
        {
            title: "Ready for work",
            description: "Show recruiters that you're ready for work."
        },
        {
            title: "Share posts",
            description: "Share latest news to get connected with others."
        },
        {
            title: "Update",
            description: "Keep your profile updated so that recruiters know you better."
        }
    ];

    if (1) {
        return <Maintenance />
    }

    return (
        <div style={{ backgroundColor: colors.background }} className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Logout */}
                <motion.div
                    className="flex justify-end mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm disabled:opacity-50 border"
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

                {/* Main Profile Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="rounded-2xl shadow-lg p-6 mb-6"
                            style={{
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.primary}33`
                            }}
                        >
                            {/* Profile Image */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <motion.div
                                    className="relative w-24 h-24 mb-4"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Image
                                        src={user.image || "/default-avatar.png"}
                                        fill
                                        alt={user.name || "User"}
                                        className="rounded-full object-cover"
                                        style={{ border: `3px solid ${colors.primary}4D` }}
                                    />
                                </motion.div>

                                <h1 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                                    {user.name}
                                </h1>

                                <p className="mb-4" style={{ color: colors.text + 'CC' }}>
                                    Software Engineer
                                </p>

                                <p className="mb-4" style={{ color: colors.text + 'CC' }}>
                                    Los Angeles, California
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <motion.button
                                    className="w-full py-3 rounded-lg font-medium transition-all duration-200 border"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.text,
                                        borderColor: colors.primary
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Edit Profile
                                </motion.button>
                                <motion.button
                                    className="w-full py-3 rounded-lg font-medium transition-all duration-200 border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: colors.text,
                                        borderColor: colors.primary + '4D'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Settings
                                </motion.button>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl shadow-lg p-6"
                            style={{
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.primary}33`
                            }}
                        >
                            <h3 className="font-semibold mb-4" style={{ color: colors.text }}>Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="px-3 py-1 rounded-full text-sm border"
                                        style={{
                                            backgroundColor: colors.primary + '1A',
                                            color: colors.text,
                                            borderColor: colors.primary + '33'
                                        }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-2xl shadow-lg p-6 border"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.primary}33`
                                    }}
                                    whileHover={{ y: -2 }}
                                >
                                    <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm" style={{ color: colors.text + 'CC' }}>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Current Role Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl shadow-lg p-6 border"
                            style={{
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.primary}33`
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Role */}
                                <div>
                                    <h3 className="font-semibold mb-4" style={{ color: colors.text }}>
                                        Current role
                                    </h3>
                                    <div className="p-4 rounded-lg border"
                                        style={{
                                            backgroundColor: colors.primary + '1A',
                                            borderColor: colors.primary + '33'
                                        }}
                                    >
                                        <div className="font-semibold" style={{ color: colors.text }}>
                                            Software Engineer
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Summary */}
                                <div>
                                    <h3 className="font-semibold mb-4" style={{ color: colors.text }}>
                                        Skills Summary
                                    </h3>
                                    <div className="space-y-2">
                                        {skills.map((skill, index) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-2 rounded border"
                                                style={{
                                                    backgroundColor: colors.background,
                                                    borderColor: colors.primary + '33'
                                                }}
                                            >
                                                <span style={{ color: colors.text }}>{skill}</span>
                                                <div className="w-16 h-2 rounded-full bg-gray-300">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            backgroundColor: colors.primary,
                                                            width: `${Math.min(100, (index + 1) * 20)}%`
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}