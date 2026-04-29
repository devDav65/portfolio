"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { label: "Accueil",      href: "#hero"     },
  { label: "À propos",    href: "#about"    },
  { label: "Compétences", href: "#skills"   },
  { label: "Projets",     href: "#projects" },
  { label: "Contact",     href: "#contact"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Active section tracker
  useEffect(() => {
    const sections = navLinks.map(l => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{
          background: scrolled
            ? "rgba(10,10,10,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,163,115,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="group flex items-center gap-2.5 relative"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-syne font-black text-xl text-[#EDE0D4]">
              K
              <motion.span
                className="text-[#D4A373] inline-block"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                D
              </motion.span>
            </span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#D4A373]"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            {/* Hover glow line */}
            <motion.div
              className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#D4A373] to-transparent"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 relative">
            {navLinks.map((link) => (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative text-[0.65rem] font-syne font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                    active === link.href ? "text-[#D4A373]" : "text-[#EDE0D4]/50 hover:text-[#EDE0D4]"
                  }`}
                >
                  {link.label}

                  {/* Active indicator */}
                  {active === link.href && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-[#D4A373]"
                      style={{ boxShadow: "0 0 8px rgba(212,163,115,0.8)" }}
                    />
                  )}

                  {/* Hover underline */}
                  {active !== link.href && (
                    <motion.span
                      className="absolute -bottom-2 left-0 h-px bg-[#EDE0D4]/30"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredLink === link.href ? "100%" : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <motion.a
            href="mailto:kessowaba@gmail.com"
            className="hidden md:flex items-center gap-2 relative group overflow-hidden px-5 py-2.5 rounded-full border border-[rgba(212,163,115,0.25)] text-[0.6rem] font-syne font-black tracking-[0.2em] text-[#D4A373] uppercase"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-[#D4A373] translate-x-[-101%] group-hover:translate-x-0 rounded-full transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <motion.span
              className="relative z-10 flex w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-300">Contact</span>
          </motion.a>

          {/* Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] relative"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={
                  open
                    ? i === 1
                      ? { opacity: 0, x: -8 }
                      : i === 0
                      ? { rotate: 45, y: 10, width: 24 }
                      : { rotate: -45, y: -10, width: 24 }
                    : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 16 : 24 }
                }
                className="block h-px bg-[#D4A373] origin-center"
                style={{ width: i === 1 ? 16 : 24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(30px)" }}
          >
            {/* BG decorative */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(212,163,115,0.04) 0%, transparent 70%)" }}
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Links */}
            <div className="flex flex-col items-center gap-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setOpen(false)}
                  className="group font-syne font-black text-[clamp(2.2rem,8vw,3.5rem)] text-[#EDE0D4] hover:text-[#D4A373] transition-colors relative"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4A373] group-hover:w-full transition-all duration-300 origin-left" />
                </motion.a>
              ))}

              <motion.a
                href="mailto:kessowaba@gmail.com"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: navLinks.length * 0.07 + 0.1 }}
                onClick={() => setOpen(false)}
                className="mt-4 px-8 py-3 border border-[rgba(212,163,115,0.3)] rounded-full text-[0.65rem] font-syne font-black tracking-[0.25em] uppercase text-[#D4A373]"
              >
                Contactez-moi
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}