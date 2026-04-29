"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { personalInfo } from "@/data";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* Top border with gradient */}
      <motion.div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,163,115,0.3), transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <span className="font-syne font-black text-base text-[#EDE0D4]">
                K<span className="text-[#D4A373]">D</span>
              </span>
              <motion.span
                className="w-1 h-1 rounded-full bg-[#D4A373]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <span className="text-[0.55rem] font-syne font-bold tracking-[0.25em] uppercase text-[#EDE0D4]/25">
                {personalInfo.title}
              </span>
            </div>

            {/* Copyright */}
            <p className="text-[0.6rem] font-dm text-[#EDE0D4]/25 text-center">
              © {year} KOKA Essowaba David — Tous droits réservés.
            </p>

            {/* Links */}
            <div className="flex items-center gap-6">
              {[
                { label: "GitHub", href: personalInfo.github },
                { label: "LinkedIn", href: personalInfo.linkedin },
              ].map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, color: "#D4A373" }}
                  className="text-[0.6rem] font-syne font-bold tracking-[0.2em] uppercase text-[#EDE0D4]/35 hover:text-[#D4A373] transition-colors relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D4A373] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}