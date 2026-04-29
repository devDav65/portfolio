"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { services, stats, personalInfo } from "@/data";

/* ─── Animated Counter ─────────────────────────────────── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const step = target / steps;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 28);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Section label with reveal line ──────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3 mb-5"
    >
      <motion.span
        className="block h-px bg-[#D4A373]"
        initial={{ width: 0 }}
        whileInView={{ width: 32 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <span className="text-[0.62rem] font-syne font-bold tracking-[0.35em] uppercase text-[#D4A373]">
        {children}
      </span>
    </motion.div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute left-[-10%] top-1/4 w-[600px] h-[600px] bg-[#D4A373] rounded-full blur-[260px] opacity-[0.045] pointer-events-none"
      />

      {/* Subtle grid accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,163,115,1) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="mb-24">
          <SectionLabel>Qui suis-je</SectionLabel>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="font-syne font-extrabold leading-tight text-[#EDE0D4]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              À <span className="text-[#D4A373]">Propos</span>
            </motion.h2>
          </div>
          <motion.div
            className="mt-5 h-px bg-gradient-to-r from-[#D4A373] to-transparent"
            initial={{ width: 0 }}
            whileInView={{ width: "200px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* ── Bio ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7"
          >
            {[
              <>Je suis <span className="text-[#D4A373] font-semibold">KOKA Essowaba David</span>, étudiant en <span className="text-[#EDE0D4] font-medium">2ème année de Génie Logiciel et Système d'Information</span> à l'<span className="text-[#EDE0D4] font-medium">IAI-TOGO</span>.</>,
              <>Passionné par la création d'expériences numériques de qualité, je maîtrise aussi bien le frontend que le backend, du design soigné aux architectures robustes.</>,
              <>Mon environnement de prédilection est <span className="text-[#D4A373]">Arch Linux</span>, et je suis constamment en train d'explorer de nouvelles technologies pour rester à la pointe.</>,
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="leading-relaxed"
                style={{
                  color: i === 0 ? "rgba(237,224,212,0.7)" : "rgba(237,224,212,0.45)",
                  fontSize: i === 0 ? "clamp(1rem, 1.4vw, 1.1rem)" : "clamp(0.9rem, 1.2vw, 1rem)",
                }}
              >
                {text}
              </motion.p>
            ))}

            {/* Contact items */}
            <div className="flex flex-col gap-3 pt-4">
              {[
                { icon: "✉", label: personalInfo.email, href: `mailto:${personalInfo.email}` },
                { icon: "📞", label: personalInfo.phone, href: `tel:${personalInfo.phone}` },
              ].map(({ icon, label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-3 text-[#EDE0D4]/50 hover:text-[#D4A373] transition-colors group"
                >
                  <motion.span
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:border-[#D4A373]/40 transition-all"
                  >
                    {icon}
                  </motion.span>
                  <span className="font-dm text-sm">{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Stats grid ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(212,163,115,0.45)",
                  boxShadow: "0 20px 60px rgba(212,163,115,0.08)",
                }}
                className="glass rounded-2xl p-7 group relative overflow-hidden transition-all duration-400"
              >
                {/* Hover shine */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(212,163,115,0.06) 0%, transparent 60%)",
                  }}
                />
                <p
                  className="font-syne font-extrabold text-[#D4A373] relative z-10"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[#EDE0D4]/40 text-xs mt-2 leading-snug font-syne tracking-wide relative z-10">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Services ── */}
        <div className="mt-32">
          <SectionLabel>Ce que je fais</SectionLabel>
          <div className="overflow-hidden mb-16">
            <motion.h3
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="font-syne font-bold text-[#EDE0D4]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Mes <span className="text-[#D4A373]">Services</span>
            </motion.h3>
          </div>

          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03 }}
                className="glass rounded-2xl p-7 group relative overflow-hidden cursor-default transition-all duration-400"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* BG glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(212,163,115,0.07) 0%, transparent 70%)",
                  }}
                />
                {/* Border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-[#D4A373]/0 group-hover:border-[#D4A373]/30 transition-all duration-500 pointer-events-none"
                />

                <motion.span
                  className="text-4xl mb-6 block"
                  whileHover={{ scale: 1.25, rotate: [-3, 3, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {service.icon}
                </motion.span>

                <h4 className="font-syne font-bold text-base text-[#EDE0D4] mb-3 group-hover:text-[#D4A373] transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-[#EDE0D4]/40 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Number watermark */}
                <span
                  className="absolute bottom-4 right-5 font-syne font-black text-[3.5rem] leading-none text-[#D4A373]/[0.04] select-none pointer-events-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}