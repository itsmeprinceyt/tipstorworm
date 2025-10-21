"use client";
import Link from "next/link";
import PageWrapper from "../PageWrapper";
import Logo from "../../../assets/Logo.png";
import Image from "next/image";

export default function HeroSection() {
    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="text-center space-y-8 z-10 max-w-4xl mx-auto w-full">
                    {/* Logo and Main Title */}
                    <div className="space-y-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative w-25 h-25 hover:scale-105 transition-all ease-in-out duration-1000">
                                <Image
                                    src={Logo}
                                    fill
                                    alt="Logo"
                                />
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold text-white">
                            Tipstor
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                                Worm
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                            Discover, share, and explore valuable tips across countless categories.
                            Post your own insights and let the world see your brilliance.
                        </p>

                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/categories"
                            className="p-3 px-8 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white hover:border-emerald-500 hover:bg-emerald-500/20"
                        >
                            Browse Categories
                        </Link>

                        <Link
                            href="/explore"
                            className="p-3 px-8 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white hover:border-green-500 hover:bg-green-500/20"
                        >
                            Explore Tips
                        </Link>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}