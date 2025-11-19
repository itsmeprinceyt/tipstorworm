"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  InstagramLink,
  YouTubeLink,
} from "../../../../utils/Website/Footer.util";
import InstagramSVG from "../SVG/Instagram";
import YouTubeSVG from "../SVG/YouTube";

// TODO : work in progress
interface HideUntilData {
  timestamp: number;
  duration: number;
}

interface SocialPlatform {
  name: "instagram" | "youtube";
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  gradient: string;
  hoverGradient: string;
  title: string;
  subtitle: string;
  pingColor: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: "instagram",
    icon: InstagramSVG,
    link: InstagramLink,
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    hoverGradient: "from-purple-600 via-pink-600 to-orange-600",
    title: "Follow us",
    subtitle: "See our latest updates!",
    pingColor: "from-purple-500 via-pink-500 to-orange-500",
  },
  {
    name: "youtube",
    icon: YouTubeSVG,
    link: YouTubeLink,
    gradient: "from-red-500 to-red-600",
    hoverGradient: "from-red-600 to-red-700",
    title: "Subscribe",
    subtitle: "Watch our videos!",
    pingColor: "from-red-500 to-red-600",
  },
];

// Animation variants - Fixed types
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
} as const;

const iconVariants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 12,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  switch: {
    scale: [1, 1.2, 1] as [number, number, number],
    rotate: [0, -15, 0] as [number, number, number],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
} as const;

const textVariants = {
  initial: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  enter: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
} as const;

const pingVariants = {
  animate: {
    scale: [1, 1.5, 1] as [number, number, number],
    opacity: [0.2, 0, 0.2] as [number, number, number],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

const progressVariants = {
  initial: {
    scaleX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 5,
      ease: "linear",
    },
  },
} as const;

export default function FloatingSocial() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const currentPlatform = socialPlatforms[currentPlatformIndex];

  useEffect(() => {
    setIsMounted(true);
    const hideData = localStorage.getItem("social-button-hide");
    if (!hideData) return setIsVisible(true);

    try {
      const data: HideUntilData = JSON.parse(hideData);
      setIsVisible(Date.now() >= data.timestamp + data.duration);
    } catch {
      setIsVisible(true);
    }
  }, []);

  // Cycle through platforms every 5 seconds, pause on hover
  useEffect(() => {
    if (!isVisible || isHovered) return;

    const interval = setInterval(() => {
      setCurrentPlatformIndex((prev) =>
        prev === socialPlatforms.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, isHovered]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(
      "social-button-hide",
      JSON.stringify({
        timestamp: Date.now(),
        duration: 60 * 60 * 1000,
      })
    );
    setIsVisible(false);
  };

  const handleSocialClick = () => {
    window.open(currentPlatform.link);
  };

  if (!isMounted || !isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="floating-social"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="fixed bottom-4 left-4 z-50 cursor-pointer"
        onClick={handleSocialClick}
      >
        <motion.div
          className={`
            flex items-center gap-2 bg-black/90 backdrop-blur-sm hover:bg-black/80 
            rounded-2xl shadow-lg p-2 pl-3 hover:shadow-xl group border border-white/10
          `}
        >
          {/* Dynamic Icon Container */}
          <motion.div
            key={`icon-${currentPlatform.name}`}
            variants={iconVariants}
            initial="initial"
            animate="switch"
            whileHover="hover"
            className={`
              bg-gradient-to-br ${currentPlatform.gradient} text-white rounded-full p-2 
              flex items-center justify-center shadow-md relative
            `}
          >
            <currentPlatform.icon />
            <motion.div
              variants={pingVariants}
              animate="animate"
              className={`
                absolute inset-0 rounded-full bg-gradient-to-br ${currentPlatform.pingColor}
              `}
            />
          </motion.div>

          {/* Text Content with smooth transitions */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`title-${currentPlatform.name}`}
                  variants={textVariants}
                  initial="enter"
                  animate="animate"
                  exit="exit"
                  className="text-xs font-semibold text-white whitespace-nowrap"
                >
                  {currentPlatform.title}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`subtitle-${currentPlatform.name}`}
                  variants={textVariants}
                  initial="enter"
                  animate="animate"
                  exit="exit"
                  className="text-[10px] text-stone-300 whitespace-nowrap"
                >
                  {currentPlatform.subtitle}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200 cursor-pointer"
              aria-label="Close for 1 hour"
            >
              <X size={12} />
            </motion.button>
          </div>

          {/* Progress Bar */}
          {!isHovered && (
            <motion.div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                key={`progress-${currentPlatform.name}`}
                variants={progressVariants}
                initial="initial"
                animate="animate"
                className={`h-full bg-gradient-to-r ${currentPlatform.gradient}`}
                onAnimationComplete={() => {
                  if (!isHovered) {
                    setCurrentPlatformIndex((prev) =>
                      prev === socialPlatforms.length - 1 ? 0 : prev + 1
                    );
                  }
                }}
              />
            </motion.div>
          )}

          {/* Platform Indicator Dots */}
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {socialPlatforms.map((_, index) => (
              <motion.div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentPlatformIndex ? "bg-white" : "bg-white/30"
                }`}
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full"
          animate={{
            y: [0, 6, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
