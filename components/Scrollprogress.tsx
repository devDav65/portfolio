"use client";
import { useScroll, useSpring, motion, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 35, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left z-[9998] pointer-events-none"
      style={{
        height: "2px",
        background: "linear-gradient(90deg, #B8956A 0%, #D4A373 35%, #EDE0D4 55%, #D4A373 80%, #B8956A 100%)",
        scaleX,
        boxShadow: "0 0 14px 2px rgba(212,163,115,0.65)",
      }}
    />
  );
}