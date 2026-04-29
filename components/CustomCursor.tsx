"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   Cursor states
   - default  : small dot + ring
   - hover    : expanded ring + rotates + shows text label
   - click    : burst compression
   - drag     : horizontal arrows
   ───────────────────────────────────────────────────────── */

const TRAIL_COUNT = 3;

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [state, setState] = useState<"default" | "hover" | "click">("default");
  const [label, setLabel] = useState("");
  const [isMobile, setIsMobile] = useState(true);

  /* Outer ring — lagging spring */
  const ringX = useSpring(cursorX, { stiffness: 90, damping: 20, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 90, damping: 20, mass: 0.5 });

  /* Ghost trail — increasingly lazy springs */
  const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => ({
    x: useSpring(cursorX, { stiffness: 60 - i * 15, damping: 20 + i * 3, mass: 0.4 }),
    y: useSpring(cursorY, { stiffness: 60 - i * 15, damping: 20 + i * 3, mass: 0.4 }),
  }));

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
      const link    = target.closest("a");
      const button  = target.closest("button");
      const input   = target.closest("input, textarea");

      if (state === "click") return;

      if (link) {
        setState("hover");
        const text = (link as HTMLElement).dataset.cursorLabel;
        setLabel(text ?? "VOIR");
      } else if (button) {
        setState("hover");
        const text = (button as HTMLElement).dataset.cursorLabel;
        setLabel(text ?? "CLICK");
      } else if (input) {
        setState("hover");
        setLabel("TYPE");
      } else {
        setState("default");
        setLabel("");
      }
    };

    const onDown = () => setState("click");
    const onUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(target.closest("a") || target.closest("button"));
      setState(isInteractive ? "hover" : "default");
      if (!isInteractive) setLabel("");
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
  }, [cursorX, cursorY, state]);

  if (isMobile) return null;

  const isHover = state === "hover";
  const isClick = state === "click";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999]" aria-hidden>

      {/* ── Ghost trails ── */}
      {trails.map((trail, i) => (
        <motion.div
          key={i}
          style={{ x: trail.x, y: trail.y, translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: 4 - i,
            height: 4 - i,
            opacity: isHover ? 0 : (0.15 - i * 0.04),
          }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 rounded-full bg-[#D4A373]"
        />
      ))}

      {/* ── Outer ring ── */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHover ? 64 : isClick ? 22 : 36,
          height: isHover ? 64 : isClick ? 22 : 36,
          borderColor: isHover ? "rgba(212,163,115,0.7)" : "rgba(212,163,115,0.4)",
          rotate: isHover ? 360 : 0,
          opacity: isClick ? 0.4 : 1,
        }}
        transition={{
          width: { duration: 0.25, ease: "easeOut" },
          height: { duration: 0.25, ease: "easeOut" },
          borderColor: { duration: 0.2 },
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.15 },
        }}
        className="fixed top-0 left-0 rounded-full border"
        style2={{ borderStyle: isHover ? "dashed" : "solid" } as any}
      />

      {/* ── Second ring (counter-rotation when hovering) ── */}
      <AnimatePresence>
        {isHover && (
          <motion.div
            style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 80, height: 80, opacity: 1, rotate: -360 }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{
              width: { duration: 0.3, ease: "easeOut" },
              height: { duration: 0.3, ease: "easeOut" },
              opacity: { duration: 0.2 },
              rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            }}
            className="fixed top-0 left-0 rounded-full border border-dashed border-[#D4A373]/20"
          />
        )}
      </AnimatePresence>

      {/* ── Inner dot ── */}
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHover ? 5 : isClick ? 16 : 6,
          height: isHover ? 5 : isClick ? 16 : 6,
          backgroundColor: isHover ? "#EDE0D4" : "#D4A373",
          scale: isClick ? 0.5 : 1,
          boxShadow: isHover
            ? "0 0 16px rgba(237,224,212,0.8)"
            : "0 0 8px rgba(212,163,115,0.6)",
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full"
      />

      {/* ── Text label inside ring ── */}
      <AnimatePresence mode="wait">
        {isHover && label && (
          <motion.div
            key={label}
            style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.5, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(6px)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
            style={{ width: 64, height: 64, marginTop: -32, marginLeft: -32 }}
          >
            <span
              className="font-syne font-black text-[0.45rem] tracking-[0.25em] uppercase text-[#D4A373]"
              style={{ position: "absolute" }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Glow aura on hover ── */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHover ? 120 : 0,
          height: isHover ? 120 : 0,
          opacity: isHover ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,163,115,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Click burst ── */}
      <AnimatePresence>
        {isClick && (
          <motion.div
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 rounded-full border border-[#D4A373]/40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}