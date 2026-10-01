"use client";

import { motion } from "framer-motion";

export function GlobeAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/40 via-black to-black" />

      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full opacity-30 lg:-right-16 lg:opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(212,175,55,0.35) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(10,22,40,0.6) 0%, transparent 40%),
            radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)
          `,
          boxShadow: "inset 0 0 80px rgba(212,175,55,0.15), 0 0 120px rgba(10,22,40,0.4)",
        }}
      >
        {[20, 40, 60, 80].map((y) => (
          <div
            key={y}
            className="absolute left-0 right-0 border-t border-gold/20"
            style={{ top: `${y}%` }}
          />
        ))}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <div
            key={deg}
            className="absolute inset-4 rounded-full border border-gold/10"
            style={{ transform: `rotateY(${deg}deg)` }}
          />
        ))}
      </motion.div>

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute h-2 w-2 rounded-full ${i % 4 === 0 ? "bg-life-green" : "bg-gold"}`}
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <svg className="absolute inset-0 h-full w-full opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${20 + i * 10}%`}
            y1={`${30 + (i % 3) * 15}%`}
            x2={`${50 + i * 5}%`}
            y2={`${20 + (i % 4) * 18}%`}
            stroke={i % 3 === 0 ? "rgb(34,197,94)" : "rgb(212,175,55)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </svg>

      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-life-green/10 blur-3xl" />
    </div>
  );
}
