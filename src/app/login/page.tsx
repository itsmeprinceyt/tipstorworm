"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import getAxiosErrorMessage from "../../utils/Variables/getAxiosError.util";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import PageWrapper from "../(components)/PageWrapper";
import GoogleSVG from "../(components)/SVG/Google";

export default function LoginPage() {
    const [token, setToken] = useState<string>("");
    const [isValidFormat, setIsValidFormat] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
    const [tokenValidated, setTokenValidated] = useState<boolean>(false);

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
            const response = await axios.post('/api/public/invite-code-validate', { token });

            if (response.data.success && response.data.data.valid) {
                setTokenValidated(true);

                if (response.data.data.expires_at) {
                    Cookies.set("invite_token", token, {
                        path: "/",
                        expires: new Date(response.data.data.expires_at)
                    });
                } else {
                    Cookies.set("invite_token", token, { path: "/" });
                }

                toast.success(response.data.message);
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
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effects - Matching HeroSection */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl shadow-lg z-10"
                >
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-bold text-white mb-2"
                            >
                                {showTokenInput ? "Create Account" : "Welcome Back"}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-300 text-lg"
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
                                        className="w-full flex items-center justify-center gap-3 bg-black/40 backdrop-blur-sm border border-stone-800 text-white py-4 px-6 rounded-xl hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-50"
                                    >
                                        <GoogleSVG />
                                        Login with Google
                                    </motion.button>

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-stone-700" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-black/40 text-gray-400">New to our platform?</span>
                                        </div>
                                    </div>

                                    {/* New User Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNewUserClick}
                                        className="w-full bg-black/40 backdrop-blur-sm border border-stone-800 text-white py-4 px-6 rounded-xl hover:border-green-500 hover:bg-green-500/20 transition-all duration-300"
                                    >
                                        I have Invite Token !!
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
                                    {!tokenValidated ? (
                                        <>
                                            {/* Token Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    Invite Token
                                                </label>
                                                <motion.input
                                                    whileFocus={{ scale: 1.01 }}
                                                    type="text"
                                                    value={token}
                                                    onChange={(e) => setToken(e.target.value)}
                                                    placeholder="Enter your 36-character invite token"
                                                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300"
                                                    maxLength={36}
                                                />
                                                <div className="mt-2 text-sm text-gray-400 flex justify-between items-center">
                                                    <span>{token.length}/36 characters</span>
                                                    {token.length > 0 && (
                                                        <motion.span
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className={isValidFormat ? "text-emerald-400" : "text-red-400"}
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
                                                    className="flex-1 bg-black/40 backdrop-blur-sm border border-stone-800 text-white py-3 px-4 rounded-xl hover:border-stone-600 hover:bg-stone-800/30 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    Back
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={validateToken}
                                                    disabled={!isValidFormat || loading}
                                                    className="flex-1 bg-black/40 backdrop-blur-sm border border-emerald-600 text-white py-3 px-4 rounded-xl hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                                    ) : (
                                                        "Validate Token"
                                                    )}
                                                </motion.button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Validation Success Message - Top */}
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="p-3 bg-emerald-600/20 border border-emerald-600 rounded-xl"
                                            >
                                                <p className="text-emerald-400 text-sm text-center">
                                                    Token validated! You can now create your account.
                                                </p>
                                            </motion.div>

                                            {/* Google Sign Up Button - Middle */}
                                            <motion.button
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleGoogleSignIn}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-3 bg-black/40 backdrop-blur-sm border border-emerald-600 text-white py-4 px-6 rounded-xl hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                            >
                                                <GoogleSVG />
                                                {loading ? "Signing Up..." : "Sign Up with Google"}
                                            </motion.button>

                                            {/* Back Button - Bottom */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleBackToLogin}
                                                disabled={loading}
                                                className="w-full bg-black/40 backdrop-blur-sm border border-stone-800 text-white py-3 px-4 rounded-xl hover:border-stone-600 hover:bg-stone-800/30 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                            >
                                                Back
                                            </motion.button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}