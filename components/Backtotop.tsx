"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 24, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.7 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden group"
          style={{
            background: "rgba(10,10,10,0.9)",
            border: "1px solid rgba(212,163,115,0.2)",
            backdropFilter: "blur(12px)",
          }}
          aria-label="Retour en haut"
        >
          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0px rgba(212,163,115,0)",
                "0 0 24px rgba(212,163,115,0.35)",
                "0 0 0px rgba(212,163,115,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Hover fill */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(212,163,115,0.1)" }}
          />

          {/* Arrow */}
          <motion.span
            className="text-[#D4A373] text-base font-bold relative z-10"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↑
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}