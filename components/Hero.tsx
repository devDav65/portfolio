"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useAnimationFrame,
} from "framer-motion";
import { personalInfo } from "@/data";
import Image from "next/image";

/* ─── Scramble / Typewriter hybrid ────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ROLES = [
  "Développeur Full Stack",
  "Créateur d'interfaces",
  "Architecte d'API",
  "Développeur Mobile",
];

function ScrambleText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(0);
  const iterRef = useRef(0);

  useEffect(() => {
    iterRef.current = 0;
    const interval = setInterval(() => {
      iterRef.current += 0.5;
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iterRef.current) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iterRef.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = texts[idx];
    const clear = () => { if (timeout.current) clearTimeout(timeout.current); };
    if (!deleting && displayed.length < current.length) {
      timeout.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      timeout.current = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && displayed.length > 0) {
      timeout.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((p) => (p + 1) % texts.length);
    }
    return clear;
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="text-[#D4A373]">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[0.85em] bg-[#D4A373] ml-1 align-middle rounded-sm"
      />
    </span>
  );
}

/* ─── Advanced Particle System ─────────────────────────── */
type Particle = {
  id: number; x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; hue: number;
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 30 + 20,
    }));

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      particlesRef.current.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.8;
          p.vy += (dy / dist) * force * 0.8;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(212,163,115,${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}

/* ─── Magnetic Button ──────────────────────────────────── */
function MagneticBtn({
  children, className, href, download,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.4);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.4);
  }, [x, y]);
  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(download ? { download: true } : {})}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ─── Floating orbs background ────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { w: 700, h: 700, top: "5%", left: "15%", dur: 18, delay: 0, opacity: 0.045 },
        { w: 450, h: 450, top: "55%", right: "10%", dur: 22, delay: 3, opacity: 0.03 },
        { w: 300, h: 300, top: "25%", right: "30%", dur: 14, delay: 6, opacity: 0.025 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#D4A373]"
          style={{
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: (orb as any).left,
            right: (orb as any).right,
            filter: `blur(${orb.w / 2.5}px)`,
            opacity: orb.opacity,
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1.08, 1],
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Photo card with 3D parallax ─────────────────────── */
function PhotoCard() {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotX = useSpring(useTransform(cardY, [-80, 80], [12, -12]), { stiffness: 120, damping: 20 });
  const rotY = useSpring(useTransform(cardX, [-80, 80], [-12, 12]), { stiffness: 120, damping: 20 });
  const glowX = useTransform(cardX, [-80, 80], ["0%", "100%"]);
  const glowY = useTransform(cardY, [-80, 80], ["0%", "100%"]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, filter: "blur(30px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-shrink-0"
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        cardX.set(e.clientX - (rect.left + rect.width / 2));
        cardY.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { cardX.set(0); cardY.set(0); }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
        {/* Rotating ring 1 */}
        <motion.div
          className="absolute inset-[-28px] rounded-full border border-[#D4A373]/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        {/* Rotating ring 2 */}
        <motion.div
          className="absolute inset-[-14px] rounded-full border border-[#D4A373]/08"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Dashed accent ring */}
        <motion.div
          className="absolute inset-[-42px] rounded-full"
          style={{
            border: "1px dashed rgba(212,163,115,0.1)",
          }}
          animate={{ rotate: 180 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Glow bg */}
        <div className="absolute inset-[-10px] rounded-full bg-[#D4A373] blur-[80px] opacity-[0.14]" />

        {/* Photo */}
        <div
          className="relative rounded-full overflow-hidden border-2 border-[#D4A373]/30"
          style={{
            width: "clamp(240px, 28vw, 320px)",
            height: "clamp(240px, 28vw, 320px)",
          }}
        >
          {/* Dynamic glow overlay */}
          <motion.div
            className="absolute inset-0 z-10 rounded-full pointer-events-none"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x} ${y}, rgba(212,163,115,0.2) 0%, transparent 60%)`
              ),
            }}
          />
          <Image
            src="/profil.jpeg"
            alt="KOKA Essowaba David"
            fill
            sizes="320px"
            className="object-cover"
            priority
          />
        </div>

        {/* Floating badge – IAI */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-3 -right-6 glass px-4 py-2 rounded-xl border border-[#D4A373]/20"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[0.6rem] font-syne font-bold text-[#D4A373] tracking-[0.25em] uppercase">DEV DAV</p>
        </motion.div>

        {/* Floating badge – Dev */}
        <motion.div
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute -top-4 -left-8 glass px-4 py-2 rounded-xl border border-[#EDE0D4]/10"
          style={{ transform: "translateZ(30px)" }}
        >
          <p className="text-[0.55rem] font-syne font-bold text-[#EDE0D4]/60 tracking-[0.2em] uppercase">Full Stack Dev</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Light beam sweep ─────────────────────────────────── */
function LightBeam() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        className="absolute top-0 left-[-50%] w-[40%] h-full"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(212,163,115,0.035) 50%, transparent 60%)",
        }}
        animate={{ left: ["−50%", "160%"] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ─── Reveal word-by-word ──────────────────────────────── */
function RevealText({ children, delay = 0, className = "" }: {
  children: string; delay?: number; className?: string;
}) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.06,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Hero ─────────────────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,163,115,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gradient overlay at top/bottom */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />

      {/* Orbs */}
      <FloatingOrbs />

      {/* Light beam */}
      <LightBeam />

      {/* Particles */}
      {mounted && <ParticleCanvas />}

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">

          {/* ── Left ── */}
          <div className="flex-1 space-y-7 text-center lg:text-left">

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 glass px-5 py-2.5 rounded-full border border-[rgba(212,163,115,0.18)]"
            >
              <motion.span
                className="relative flex w-2.5 h-2.5"
              >
                <motion.span
                  className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75"
                  animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </motion.span>
              <span className="text-[0.62rem] font-syne font-bold tracking-[0.25em] uppercase text-[#EDE0D4]/70">
                Disponible pour des projets
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-[0.7rem] font-syne font-bold tracking-[0.35em] uppercase text-[#EDE0D4]/35"
            >
              Bonjour, je suis
            </motion.p>

            {/* Name */}
            <div className="overflow-hidden">
              <h1
                className="font-syne font-black leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden"
                >
                  <span className="block text-[#EDE0D4]">KOKA</span>
                </motion.div>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.38, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden"
                >
                  <span
                    className="block shimmer-text"
                    style={{ paddingBottom: "0.05em" }}
                  >
                    Essowaba
                  </span>
                </motion.div>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.51, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden"
                >
                  <span className="block text-[#EDE0D4]">David</span>
                </motion.div>
              </h1>
            </div>

            {/* Role typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="font-syne font-semibold min-h-[2.2rem]"
              style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)" }}
            >
              <Typewriter texts={ROLES} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
              className="text-[#EDE0D4]/50 max-w-lg leading-relaxed mx-auto lg:mx-0"
              style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
            >
              {personalInfo.tagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <MagneticBtn
                href="#projects"
                className="relative group overflow-hidden px-8 py-4 rounded-full font-syne font-black text-xs tracking-[0.2em] uppercase text-[#0a0a0a]"
              >
                {/* BG layers */}
                <span className="absolute inset-0 bg-[#D4A373] rounded-full" />
                <span className="absolute inset-0 bg-[#EDE0D4] rounded-full translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                {/* Glow */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{ boxShadow: ["0 0 0px rgba(212,163,115,0)", "0 0 30px rgba(212,163,115,0.5)", "0 0 0px rgba(212,163,115,0)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative z-10">Voir mes projets</span>
              </MagneticBtn>

              <MagneticBtn
                href="/cv.pdf"
                download
                className="relative group flex items-center gap-2.5 px-8 py-4 rounded-full font-syne font-black text-xs tracking-[0.2em] uppercase text-[#EDE0D4] border border-[rgba(237,224,212,0.15)] hover:border-[#D4A373]/50 transition-colors duration-300"
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(212,163,115,0.06)" }} />
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 text-[#D4A373]"
                >
                  ↓
                </motion.span>
                <span className="relative z-10">Télécharger CV</span>
              </MagneticBtn>
            </motion.div>

            {/* Socials */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="flex items-center gap-6 justify-center lg:justify-start"
              >
                {[
                  { label: "GitHub", href: personalInfo.github, icon: "/icons/github-original.svg" },
                  { label: "LinkedIn", href: personalInfo.linkedin, icon: "/icons/linkedin-original.svg" },
                ].map(({ label, href, icon }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-2 text-[#EDE0D4]/35 hover:text-[#D4A373] transition-colors text-[0.6rem] font-syne font-bold tracking-[0.3em] uppercase relative group"
                  >
                    {/* Affichage de l'icône */}
                    <Image 
                      src={icon} 
                      alt={label} 
                      width={14} 
                      height={14} 
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <span>{label}</span>
                    
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D4A373] group-hover:w-full transition-all duration-300" />
                  </motion.a>
                )).reduce((acc, el, i) => [
                  ...acc,
                  el,
                  ...(i === 0 ? [<span key="sep" className="w-px h-3 bg-[#EDE0D4]/15" />] : []),
                ], [] as React.ReactNode[])}
              </motion.div>
          </div>

          {/* ── Right ── */}
          <PhotoCard />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <motion.span
            className="text-[0.55rem] font-syne font-bold tracking-[0.4em] uppercase text-[#EDE0D4]/20"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Défiler
          </motion.span>
          <div className="relative w-px h-14 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#D4A373] to-transparent"
              animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}