"use client";
import { useEffect, useState } from "react";
import PageWrapper from "../PageWrapper";
import { Settings, Wrench, Clock } from 'lucide-react';

export default function Maintenance() {
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
                    {/* Animated Maintenance Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="text-white motion-rotate-loop-[1turn]/reset motion-duration-3000">
                                <Settings className="w-32 h-32" />
                            </div>
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl motion-pulse-loop motion-duration-2000"></div>
                        </div>
                    </div>

                    {/* Maintenance Text */}
                    <div className="space-y-4">
                        <h1 className="text-8xl font-bold text-white motion-scale-in-0 motion-duration-1000">
                            Maintenance
                        </h1>
                        <div className="motion-opacity-in-0 motion-blur-in-md motion-delay-300">
                            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center justify-center gap-3">
                                <Wrench className="w-8 h-8" />
                                System Under Maintenance
                            </h2>
                            <p className="text-gray-300 max-w-md mx-auto">
                                We&apos;re performing some maintenance at the moment.
                            </p>
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="flex items-center justify-center text-lg text-gray-300 motion-opacity-in-0 motion-delay-500 bg-black/40 backdrop-blur-sm py-3 px-6 rounded-full border border-stone-800">
                        <Clock className="w-5 h-5 mr-3" />
                        We&apos;ll be back shortly. Thank you for your patience.
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center motion-opacity-in-0 motion-delay-700">
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 px-4 rounded-full cursor-pointer hover:scale-110 transition-all duration-1000 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white"
                        >
                            Check Again
                        </button>

                        <button
                            onClick={handleGoBack}
                            className={`p-2 px-4 rounded-full cursor-pointer hover:scale-110 transition-all duration-1000 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white ${
                                !isClient ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                        >
                            Go Back
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="motion-opacity-in-0 motion-delay-900">
                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                            If you need immediate assistance, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}