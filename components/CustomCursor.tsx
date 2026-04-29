"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [state, setState] = useState<"default" | "hover" | "click">("default");
  const [isMobile, setIsMobile] = useState(true); // default true to avoid SSR flash

  // Outer ring – lagging spring
  const ringX = useSpring(cursorX, { stiffness: 100, damping: 22, mass: 0.6 });
  const ringY = useSpring(cursorY, { stiffness: 100, damping: 22, mass: 0.6 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isTouch);
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea")
      );
      setState(s => s === "click" ? "click" : isInteractive ? "hover" : "default");
    };

    const onDown = () => setState("click");
    const onUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(target.closest("a") || target.closest("button"));
      setState(isInteractive ? "hover" : "default");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999]" aria-hidden>
      {/* Outer ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: state === "hover" ? 56 : state === "click" ? 28 : 36,
          height: state === "hover" ? 56 : state === "click" ? 28 : 36,
          opacity: state === "click" ? 0.5 : 1,
          borderColor:
            state === "hover"
              ? "rgba(237,224,212,0.6)"
              : "rgba(212,163,115,0.5)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full border"
        style2={{
          boxShadow: state === "hover" ? "0 0 20px rgba(212,163,115,0.2)" : "none",
        } as any}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: state === "hover" ? 6 : state === "click" ? 12 : 6,
          height: state === "hover" ? 6 : state === "click" ? 12 : 6,
          backgroundColor: state === "hover" ? "#EDE0D4" : "#D4A373",
          scale: state === "click" ? 0.6 : 1,
          boxShadow:
            state === "hover"
              ? "0 0 12px rgba(237,224,212,0.6)"
              : "0 0 8px rgba(212,163,115,0.5)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full"
      />

      {/* Glow aura on hover */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: state === "hover" ? 100 : 0,
          height: state === "hover" ? 100 : 0,
          opacity: state === "hover" ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,163,115,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}