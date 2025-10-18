"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "@/utils/Variables/getAxiosError.util";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export default function LoginPage() {
    const [token, setToken] = useState("");
    const [isValidFormat, setIsValidFormat] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [tokenValidated, setTokenValidated] = useState(false);

    useEffect(() => {
        const isValid = token.length === 36 &&
            /^[a-zA-Z0-9-]+$/.test(token) &&
            !token.includes("'") &&
            !token.includes(";") &&
            !token.includes("--") &&
            !token.includes("/*") &&
            !token.includes("*/");
        setIsValidFormat(isValid);

        if (tokenValidated && !isValid) {
            setTokenValidated(false);
        }
    }, [token, tokenValidated]);

    const validateToken = async () => {
        if (!isValidFormat) {
            toast.error("Invalid token format");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/admin/invite-code-manager/validate', { token });

            if (response.data.valid) {
                setTokenValidated(true);
                toast.success("Token validated! You can now sign up.");
            } else {
                toast.error("Invalid or expired invite token");
                setTokenValidated(false);
            }
        } catch (error: unknown) {
            toast.error(getAxiosErrorMessage(error, 'Cannot validate token'));
            setTokenValidated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (showTokenInput && !tokenValidated) {
            toast.error("Please validate your token first");
            return;
        }

        setLoading(true);
        try {
            Cookies.set("invite_token", token, { path: "/"});
            await signIn("google");
        } catch (error: unknown) {
            toast.error(getAxiosErrorMessage(error, 'Failed to sign in'));
        } finally {
            setLoading(false);
        }
    };

    const handleNewUserClick = () => {
        setShowTokenInput(true);
        setToken("");
        setTokenValidated(false);
    };

    const handleBackToLogin = () => {
        setShowTokenInput(false);
        setToken("");
        setTokenValidated(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold text-gray-900 mb-2"
                        >
                            {showTokenInput ? "Create Account" : "Welcome Back"}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600"
                        >
                            {showTokenInput
                                ? "Enter your invite token to get started"
                                : "Sign in to your account"
                            }
                        </motion.p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!showTokenInput ? (
                            <motion.div
                                key="login-options"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {/* Google Sign-In Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Login with Google
                                </motion.button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                                    </div>
                                </div>

                                {/* New User Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNewUserClick}
                                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                                >
                                    I&apos;m New, I have Invite Token!
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="token-input"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Token Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Invite Token
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        type="text"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="Enter your 36-character invite token"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        maxLength={36}
                                    />
                                    <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
                                        <span>{token.length}/36 characters</span>
                                        {token.length > 0 && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={isValidFormat ? "text-green-600" : "text-red-600"}
                                            >
                                                {isValidFormat ? "✓ Valid format" : "✗ Invalid format"}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBackToLogin}
                                        disabled={loading}
                                        className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50"
                                    >
                                        Back
                                    </motion.button>

                                    {!tokenValidated ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={validateToken}
                                            disabled={!isValidFormat || loading}
                                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    🔄
                                                </motion.span>
                                            ) : (
                                                "Validate Token"
                                            )}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleGoogleSignIn}
                                            disabled={loading}
                                            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Signing Up..." : "Sign Up with Google"}
                                        </motion.button>
                                    )}
                                </div>

                                {/* Validation Status */}
                                <AnimatePresence>
                                    {tokenValidated && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-3 bg-green-50 border border-green-200 rounded-xl"
                                        >
                                            <p className="text-green-800 text-sm text-center">
                                                ✅ Token validated! You can now create your account.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}