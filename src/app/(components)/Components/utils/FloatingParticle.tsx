"use client";
import { motion } from "framer-motion";

export default function FloatingParticles() {
  const particleTypes = [
    {
      count: 12,
      size: "w-1.5 h-1.5",
      color: "bg-white/20",
      duration: [3, 6],
      distance: [40, 80],
      delay: [0, 5],
      curve: "easeInOut",
    },
    {
      count: 6,
      size: "w-3 h-3",
      color: "bg-emerald-400/30",
      duration: [4, 7],
      distance: [60, 100],
      delay: [0, 7],
      curve: "easeOut",
    },
    {
      count: 4,
      size: "w-2 h-2",
      color: "bg-cyan-400/25",
      duration: [5, 8],
      distance: [80, 120],
      delay: [0, 3],
      curve: "easeIn",
    },
    {
      count: 3,
      size: "w-4 h-4",
      color: "bg-purple-400/20",
      duration: [6, 9],
      distance: [30, 60],
      delay: [0, 8],
      curve: "easeInOut",
      shape: "rounded-lg",
    },
    {
      count: 5,
      size: "w-1 h-4",
      color: "bg-amber-300/15",
      duration: [2, 4],
      distance: [50, 90],
      delay: [0, 6],
      curve: "linear",
      shape: "rounded-sm",
    },
    {
      count: 4,
      size: "w-2.5 h-2.5",
      color: "bg-pink-400/15",
      duration: [7, 10],
      distance: [70, 110],
      delay: [0, 4],
      curve: "easeOut",
      movement: "horizontal",
    },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particleTypes.map((type, typeIndex) =>
        [...Array(type.count)].map((_, i) => {
          const particleKey = `${typeIndex}-${i}`;
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          const duration =
            type.duration[0] +
            Math.random() * (type.duration[1] - type.duration[0]);
          const distance =
            type.distance[0] +
            Math.random() * (type.distance[1] - type.distance[0]);
          const delay =
            Math.random() * (type.delay[1] - type.delay[0]) + type.delay[0];

          const animateProps =
            type.movement === "horizontal"
              ? {
                  x: [null, -distance - Math.random() * 40],
                  y: [null, Math.random() * 20 - 10],
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }
              : {
                  y: [null, -distance - Math.random() * 20],
                  x: [null, Math.random() * 10 - 5],
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                  rotate: type.shape === "rounded-lg" ? [0, 180, 360] : 0,
                };

          return (
            <motion.div
              key={particleKey}
              className={`absolute ${type.size} ${type.color} ${
                type.shape || "rounded-full"
              }`}
              initial={{
                x: randomX + "vw",
                y: randomY + "vh",
                scale: 0,
                rotate: type.shape === "rounded-lg" ? Math.random() * 360 : 0,
              }}
              animate={animateProps}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: type.curve as unknown as import("framer-motion").Easing,
                repeatType: "loop",
              }}
            />
          );
        })
      )}

      {/* Special floating elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`special-${i}`}
          className="absolute w-6 h-6 opacity-10"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          animate={{
            y: [null, -20, 10, -30],
            x: [null, 5, -3, 8],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full border border-emerald-400/30 rounded-full" />
        </motion.div>
      ))}

      {/* Pulsing glow dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute w-8 h-8 rounded-full"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            scale: 0,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeOut",
          }}
        >
          <div className="w-full h-full bg-cyan-400/20 rounded-full blur-sm" />
        </motion.div>
      ))}

      {/* Fast moving small particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`fast-${i}`}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          animate={{
            y: [null, -150 - Math.random() * 100],
            x: [null, Math.random() * 50 - 25],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
