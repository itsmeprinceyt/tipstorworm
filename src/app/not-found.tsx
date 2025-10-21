"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageWrapper from "./(components)/PageWrapper";
import Planet from "./(components)/SVG/Planet";

export default function Custom404() {
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleGoBack = () => {
        if (typeof window !== "undefined") {
            window.history.back();
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-8">
                    {/* Animated Planet with enhanced styling */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <Planet
                                className="text-white motion-rotate-loop-[1turn]/reset motion-duration-3000"
                            />
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl motion-pulse-loop motion-duration-2000"></div>
                        </div>
                    </div>

                    {/* 404 Text */}
                    <div className="space-y-4">
                        <h1 className="text-8xl font-bold text-white motion-scale-in-0 motion-duration-1000">
                            404
                        </h1>
                        <div className="motion-opacity-in-0 motion-blur-in-md motion-delay-300">
                            <h2 className="text-2xl font-semibold text-white mb-2">
                                Worm Planet Not Found
                            </h2>
                            <p className="text-gray-300 max-w-md mx-auto">
                                The planet you are trying to access does not exist.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center motion-opacity-in-0 motion-delay-500">
                        <Link
                            href="/"
                            className="p-2 px-4 rounded-full cursor-pointer hover:scale-110 transition-all duration-1000 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white"
                        >
                            Return to Home
                        </Link>

                        <button
                            onClick={handleGoBack}
                            className={`p-2 px-4 rounded-full cursor-pointer hover:scale-110 transition-all duration-1000 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white ${
                                !isClient ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}