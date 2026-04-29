"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("kd-loaded");
      if (seen) { setLoading(false); return; }
    }

    const duration = 2000;
    const interval = 16;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const t = current / steps;
      // Ease-in-out cubic for realistic loading feel
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(Math.min(eased * 100, 100)));

      if (current >= steps) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("kd-loaded", "1");
          }, 1000);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.5 } }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(ellipse at 50% 50%, rgba(212,163,115,0.04) 0%, transparent 60%)",
                "radial-gradient(ellipse at 50% 50%, rgba(212,163,115,0.08) 0%, transparent 60%)",
                "radial-gradient(ellipse at 50% 50%, rgba(212,163,115,0.04) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(212,163,115,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Curtain reveal on exit */}
          <motion.div
            className="absolute inset-0 bg-[#050505] z-20 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase === "reveal" ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-xs px-8">

            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(30px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative select-none"
            >
              <h1
                className="font-syne font-black leading-none relative"
                style={{ fontSize: "clamp(80px, 20vw, 120px)", letterSpacing: "-0.05em" }}
              >
                <span className="text-[#EDE0D4]">K</span>
                <motion.span
                  initial={{ color: "#EDE0D4" }}
                  animate={{ color: "#D4A373" }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                >
                  D
                </motion.span>
              </h1>

              {/* Scan line */}
              <motion.div
                initial={{ top: 0, opacity: 1 }}
                animate={{ top: "105%", opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="absolute left-0 right-0 h-[2px] pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, #D4A373 30%, #EDE0D4 50%, #D4A373 70%, transparent)",
                  boxShadow: "0 0 20px 4px rgba(212,163,115,0.8)",
                }}
              />

              {/* Corner brackets decoration */}
              {[
                { top: -8, left: -8, rotate: 0 },
                { top: -8, right: -8, rotate: 90 },
                { bottom: -8, right: -8, rotate: 180 },
                { bottom: -8, left: -8, rotate: 270 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4"
                  style={{ ...pos }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                >
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d={`M${pos.rotate === 0 || pos.rotate === 270 ? "0" : "16"},${pos.rotate < 180 ? "16" : "0"} L${pos.rotate === 0 || pos.rotate === 270 ? "0" : "16"},${pos.rotate < 180 ? "0" : "16"} L${pos.rotate === 0 || pos.rotate === 90 ? "16" : "0"},${pos.rotate < 180 ? "0" : "16"}`}
                      stroke="#D4A373"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="w-full space-y-4"
            >
              {/* Bar */}
              <div className="relative h-px w-full overflow-hidden" style={{ background: "rgba(237,224,212,0.06)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0 origin-left"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, rgba(212,163,115,0.6), #D4A373, #EDE0D4)",
                    boxShadow: "0 0 12px rgba(212,163,115,0.6), 3px 0 20px rgba(212,163,115,0.4)",
                    transition: "width 16ms linear",
                  }}
                />
                {/* Shimmer on bar tip */}
                <motion.div
                  className="absolute top-0 bottom-0 w-8"
                  style={{
                    left: `calc(${progress}% - 32px)`,
                    background: "linear-gradient(90deg, transparent, rgba(237,224,212,0.4), transparent)",
                    transition: "left 16ms linear",
                  }}
                />
              </div>

              {/* Counter & label */}
              <div className="flex items-center justify-between">
                <motion.p
                  className="text-[0.58rem] font-syne font-bold tracking-[0.3em] uppercase text-[#EDE0D4]/25"
                >
                  Développeur Full Stack
                </motion.p>
                <span className="font-syne font-black text-sm text-[#D4A373]">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}