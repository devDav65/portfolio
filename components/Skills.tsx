"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { skills } from "@/data";

const ICON_FILES: Record<string, string> = {
  JavaScript: "/icons/javascript-plain.svg",
  Python: "/icons/python-original.svg",
  C: "/icons/c-original.svg",
  "C#": "/icons/csharp-original.svg",
  HTML: "/icons/html5-original.svg",
  CSS: "/icons/css3-original.svg",
  "Tailwind CSS": "/icons/tailwindcss-original.svg",
  React: "/icons/reactnative-original.svg",
  Django: "/icons/django-plain.svg",
  DRF: "/icons/djangorest-original-wordmark.svg",
  FastAPI: "/icons/fastapi-original.svg",
  "ASP.NET Core": "/icons/dotnetcore-original.svg",
  Flutter: "/icons/flutter-original.svg",
  MySQL: "/icons/mysql-original.svg",
  MariaDB: "/icons/mariadb-original.svg",
  PostgreSQL: "/icons/postgresql-original.svg",
  "Azure SQL": "/icons/azuresqldatabase-original.svg",
  Docker: "/icons/docker-original.svg",
  Git: "/icons/git-original.svg",
  GitHub: "/icons/github-original.svg",
  Java: "/icons/java-plain.svg",
  Nginx: "/icons/nginx-original.svg",
  Redis: "/icons/redis-original.svg",
  PyCharm: "/icons/pycharm-original.svg",
  Rider: "/icons/rider-original.svg",
  VSCode: "/icons/vscode-original.svg",
  "Android Studio": "/icons/androidstudio-original.svg",
  NetBeans: "/icons/netbeans-original.svg",
  "Arch Linux": "/icons/archlinux-original.svg",
  Fedora: "/icons/fedora-original.svg",
  Ubuntu: "/icons/ubuntu-original.svg",
  Debian: "/icons/debian-original.svg",
  Windows: "/icons/windows11-original.svg",
  SQL: "/icons/azuresqldatabase-original.svg",
};

const categoryColors: Record<string, { primary: string; glow: string }> = {
  Langages:           { primary: "#D4A373", glow: "rgba(212,163,115,0.15)" },
  Frontend:           { primary: "#C9B99A", glow: "rgba(201,185,154,0.15)" },
  Backend:            { primary: "#B8956A", glow: "rgba(184,149,106,0.15)" },
  Mobile:             { primary: "#D4A373", glow: "rgba(212,163,115,0.15)" },
  "Bases de données": { primary: "#C9A96E", glow: "rgba(201,169,110,0.15)" },
  Outils:             { primary: "#B8956A", glow: "rgba(184,149,106,0.15)" },
  IDE:                { primary: "#D4A373", glow: "rgba(212,163,115,0.15)" },
  Systèmes:           { primary: "#C9A96E", glow: "rgba(201,169,110,0.15)" },
};

function SkillIcon({ skill }: { skill: string }) {
  const src = ICON_FILES[skill];
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-syne font-black text-[#D4A373]" style={{ fontSize: "1rem" }}>
          {skill.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
  return <img src={src} alt={skill} className="w-full h-full object-contain" draggable={false} />;
}

function SkillBadge({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
        show: {
          opacity: 1, scale: 1, filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 },
        },
      }}
      whileHover={{
        scale: 1.15,
        y: -6,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-[rgba(237,224,212,0.07)] cursor-default group relative overflow-hidden"
      title={skill}
    >
      {/* Hover bg */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "rgba(212,163,115,0.08)" }}
      />
      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-[#D4A373]/0 group-hover:border-[#D4A373]/40 transition-all duration-300 pointer-events-none"
      />

      {/* Float animation for icon */}
      <motion.div
        className="w-8 h-8 flex-shrink-0 relative z-10"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 2.5 + (index % 5) * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
      >
        <SkillIcon skill={skill} />
      </motion.div>

      <span className="text-[0.58rem] font-syne font-semibold text-[#EDE0D4]/45 tracking-wider uppercase text-center leading-tight group-hover:text-[#D4A373] transition-colors duration-200 relative z-10">
        {skill}
      </span>
    </motion.div>
  );
}

function CategoryCard({ group, index }: { group: typeof skills[0]; index: number }) {
  const color = categoryColors[group.category] ?? { primary: "#D4A373", glow: "rgba(212,163,115,0.15)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        borderColor: `${color.primary}55`,
        boxShadow: `0 0 60px ${color.glow}`,
      }}
      className="glass rounded-2xl p-6 relative overflow-hidden transition-all duration-500 group"
    >
      {/* Top glow accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color.primary}, transparent)` }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.5, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07 + 0.3, duration: 0.7 }}
      />

      {/* Radial bg glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Category header */}
      <div className="flex items-center gap-2.5 mb-6 relative z-10">
        <motion.span
          className="w-1.5 h-5 rounded-full"
          style={{ background: color.primary }}
          animate={{ scaleY: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
        />
        <p
          className="font-syne font-black text-[0.6rem] tracking-[0.35em] uppercase"
          style={{ color: color.primary }}
        >
          {group.category}
        </p>
        <span className="ml-auto font-syne font-bold text-[0.55rem] text-[#EDE0D4]/20">
          {String(group.items.length).padStart(2, "0")}
        </span>
      </div>

      {/* Skills grid */}
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-2 relative z-10"
      >
        {group.items.map((skill, i) => (
          <SkillBadge key={skill} skill={skill} index={i} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section id="skills" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Parallax glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute right-[-5%] top-1/3 w-[500px] h-[500px] bg-[#D4A373] rounded-full blur-[240px] opacity-[0.045] pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute left-[-10%] bottom-1/4 w-[400px] h-[400px] bg-[#D4A373] rounded-full blur-[200px] opacity-[0.025] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
              Mon arsenal technique
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="font-syne font-extrabold leading-tight text-[#EDE0D4]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Compétences<span className="text-[#D4A373]">.</span>
            </motion.h2>
          </div>

          <motion.div
            className="mt-5 h-px bg-gradient-to-r from-[#D4A373] to-transparent"
            initial={{ width: 0 }}
            whileInView={{ width: "200px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skills.map((group, i) => (
            <CategoryCard key={group.category} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}