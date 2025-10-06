"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import colors from "../../utils/Colors/Colors.util";

export default function Navbar() {
    const { data: session } = useSession();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
    };

    return (
        <motion.nav
            className="p-4 flex justify-between items-center border-b shadow-sm"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.primary + '33'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo/Brand */}
            <motion.div
                className="text-2xl font-bold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Link href="/" className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                        }}
                    >
                        <span className="text-sm font-bold" style={{ color: colors.text }}>TW</span>
                    </div>
                    <span>Tipstor Worm</span>
                </Link>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
                <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Link
                        href="/"
                        className="transition-colors duration-200 font-medium"
                        style={{ color: colors.text }}
                    >
                        Home
                    </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Link
                        href="/dashboard/profile"
                        className="transition-colors duration-200 font-medium"
                        style={{ color: colors.text }}
                    >
                        Profile
                    </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Link
                        href="/dashboard"
                        className="transition-colors duration-200 font-medium"
                        style={{ color: colors.text }}
                    >
                        Dashboard
                    </Link>
                </motion.div>

                <AnimatePresence mode="wait">
                    {session ? (
                        <motion.div
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="authenticated"
                        >
                            {/* User Info */}
                            <motion.div
                                className="hidden sm:flex items-center space-x-3 px-3 py-1 rounded-full border"
                                style={{
                                    backgroundColor: colors.primary + '1A',
                                    borderColor: colors.primary + '33'
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.accent }}
                                ></div>
                                <span className="text-sm font-medium">Hi, {session.user?.name}</span>
                            </motion.div>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-sm disabled:opacity-50 flex items-center space-x-2 border"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.primary + '4D'
                                }}
                            >
                                {isLoggingOut ? (
                                    <>
                                        <div
                                            className="w-4 h-4 border-2 rounded-full animate-spin"
                                            style={{
                                                borderColor: colors.text,
                                                borderTopColor: 'transparent'
                                            }}
                                        />
                                        <span>Logging out...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="unauthenticated"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium border flex items-center space-x-2"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        color: colors.text,
                                        borderColor: colors.primary + '4D'
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Login</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}