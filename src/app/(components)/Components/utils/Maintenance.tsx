"use client";
import { useEffect, useState } from "react";
import PageWrapper from "../../PageWrapper";
import { Settings, Wrench, Clock } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="text-center space-y-6 sm:space-y-8 w-full max-w-md sm:max-w-lg lg:max-w-xl">
          {/* Animated Maintenance Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-white motion-rotate-loop-[1turn]/reset motion-duration-3000">
                <Settings className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32" />
              </div>
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl motion-pulse-loop motion-duration-2000"></div>
            </div>
          </div>

          {/* Maintenance Text */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-white motion-scale-in-0 motion-duration-1000">
              Maintenance
            </h1>
            <div className="motion-opacity-in-0 motion-blur-in-md motion-delay-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Wrench className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                System Under Maintenance
              </h2>
              <p className="text-gray-300 text-sm sm:text-base px-4 sm:px-0">
                We&apos;re performing some maintenance at the moment.
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div className="flex items-center justify-center text-base sm:text-lg text-gray-300 motion-opacity-in-0 motion-delay-500 bg-black/40 backdrop-blur-sm py-3 px-4 sm:px-6 rounded-full border border-stone-800 mx-2 sm:mx-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0" />
            <span className="text-sm sm:text-base">
              We&apos;ll be back shortly. Thank you for your patience.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center motion-opacity-in-0 motion-delay-700 px-2 sm:px-0">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto p-2 px-4 rounded-full cursor-pointer hover:scale-105 sm:hover:scale-110 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white text-sm sm:text-base"
            >
              Check Again
            </button>

            <button
              onClick={handleGoBack}
              className={`w-full sm:w-auto p-2 px-4 rounded-full cursor-pointer hover:scale-105 sm:hover:scale-110 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-sm border border-stone-800 text-white text-sm sm:text-base ${
                !isClient ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              Go Back
            </button>
          </div>

          {/* Additional Info */}
          <div className="motion-opacity-in-0 motion-delay-900 px-4 sm:px-0">
            <p className="text-xs sm:text-sm text-gray-400">
              If you need immediate assistance, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
