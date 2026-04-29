"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { projects } from "@/data";
import Image from "next/image";

type Project = (typeof projects)[0];

/* ─── Modal Carousel ───────────────────────────────────── */
function ModalCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const valid = images.filter(Boolean);

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  if (!valid.length) {
    return (
      <div className="aspect-video bg-[#111] rounded-2xl flex items-center justify-center">
        <span className="font-syne font-black text-[80px] text-[#D4A373]/08 select-none">
          {title.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#111]">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          initial={{ x: dir > 0 ? "100%" : "-100%", opacity: 0, scale: 1.05 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: dir > 0 ? "-100%" : "100%", opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          <Image src={valid[idx]} alt={`${title} ${idx + 1}`} fill sizes="768px" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent z-10 pointer-events-none" />

      {valid.length > 1 && (
        <>
          {[{ dir: -1, pos: "left-3", label: "←" }, { dir: 1, pos: "right-3", label: "→" }].map((btn) => (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => go((idx + btn.dir + valid.length) % valid.length)}
              className={`absolute ${btn.pos} top-1/2 -translate-y-1/2 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-[#D4A373] hover:bg-[rgba(212,163,115,0.15)] transition-all text-sm font-bold`}
            >
              {btn.label}
            </motion.button>
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {valid.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => go(i)}
                animate={{ width: i === idx ? 24 : 6, backgroundColor: i === idx ? "#D4A373" : "rgba(237,224,212,0.3)" }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Project Modal ─────────────────────────────────────── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#050505]/90"
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(28px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 60, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{
          background: "rgba(12,12,12,0.92)",
          border: "1px solid rgba(212,163,115,0.15)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,163,115,0.05)",
        }}
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="absolute top-5 right-5 z-20 w-9 h-9 glass rounded-full flex items-center justify-center text-[#EDE0D4]/50 hover:text-[#D4A373] transition-colors text-lg"
        >
          ×
        </motion.button>

        <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <ModalCarousel images={project.images ?? []} title={project.title} />

          <div className="space-y-5">
            <div>
              <p className="text-[0.58rem] font-syne font-bold tracking-[0.3em] uppercase text-[#D4A373]/60 mb-1">Projet</p>
              <h3 className="font-syne font-black text-2xl md:text-3xl text-[#EDE0D4]">{project.title}</h3>
            </div>

            <p className="text-[#EDE0D4]/55 leading-relaxed text-sm">{project.description}</p>

            {/* Stack */}
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1.5 rounded-full text-xs font-syne font-semibold bg-[rgba(212,163,115,0.1)] text-[#D4A373] border border-[rgba(212,163,115,0.22)]"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3.5 glass rounded-xl text-center text-xs font-syne font-black text-[#EDE0D4]/60 hover:text-[#D4A373] hover:border-[#D4A373]/40 transition-all tracking-[0.2em] uppercase"
              >
                GitHub →
              </motion.a>
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3.5 bg-[#D4A373] hover:bg-[#EDE0D4] text-[#0a0a0a] rounded-xl text-center text-xs font-syne font-black tracking-[0.2em] uppercase transition-colors duration-300"
                >
                  Voir le projet →
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D Tilt Card ──────────────────────────────────────── */
function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); };

  const cover = project.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onClick}
        className="cursor-pointer group"
      >
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden flex flex-col relative"
          style={{
            background: "rgba(15,15,15,0.8)",
            border: "1px solid rgba(237,224,212,0.07)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Dynamic glow follow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x} ${y}, rgba(212,163,115,0.08) 0%, transparent 50%)`
              ),
            }}
          />

          {/* Border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none z-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{ border: "1px solid rgba(212,163,115,0.3)", borderRadius: "1.5rem" }}
            transition={{ duration: 0.3 }}
          />

          {/* Image */}
          <div className="relative aspect-video bg-[#111] overflow-hidden z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

            {cover ? (
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Image src={cover} alt={project.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #111, #161616)" }}>
                <span className="font-syne font-black text-[60px] text-[#D4A373]/08 select-none">
                  {project.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              whileHover={{ opacity: 1, backdropFilter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(212,163,115,0.05)]"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="px-5 py-2.5 rounded-full border border-[#D4A373]/50 bg-[rgba(10,10,10,0.6)]"
              >
                <span className="text-[0.62rem] font-syne font-black tracking-[0.25em] uppercase text-[#D4A373]">
                  Voir le projet
                </span>
              </motion.div>
            </motion.div>

            {/* Index */}
            <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(10,10,10,0.7)", border: "1px solid rgba(212,163,115,0.2)" }}>
              <span className="font-syne font-black text-xs text-[#D4A373]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Image count */}
            {(project.images?.length ?? 0) > 1 && (
              <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: "rgba(10,10,10,0.7)", border: "1px solid rgba(212,163,115,0.15)" }}>
                <span className="text-[0.55rem] font-syne font-bold text-[#EDE0D4]/40">
                  {project.images!.length} imgs
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col gap-4 relative z-10">
            <div className="flex items-start justify-between">
              <h3 className="font-syne font-black text-lg text-[#EDE0D4] group-hover:text-[#D4A373] transition-colors duration-300 leading-tight">
                {project.title}
              </h3>
              <motion.span
                className="text-[#D4A373]/0 group-hover:text-[#D4A373] transition-colors text-sm font-bold ml-2 flex-shrink-0"
                style={{ transform: "rotate(-45deg)" }}
              >
                →
              </motion.span>
            </div>

            <p className="text-[#EDE0D4]/40 text-xs leading-relaxed flex-1 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-lg text-[0.6rem] font-syne font-bold bg-[rgba(212,163,115,0.07)] text-[#D4A373]/70 border border-[rgba(212,163,115,0.14)]"
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > 4 && (
                <span className="px-2 py-1 rounded-lg text-[0.6rem] font-syne text-[#EDE0D4]/25">
                  +{project.stack.length - 4}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────── */
export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <section id="projects" className="py-32 relative overflow-hidden">
        <div className="absolute left-[-5%] top-1/3 w-[500px] h-[500px] bg-[#D4A373] rounded-full blur-[240px] opacity-[0.04] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-24 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
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
                  Portfolio
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
                  Mes <span className="text-[#D4A373]">Projets</span>
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

            <motion.a
              href="https://github.com/devDav65"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="self-start relative group overflow-hidden px-6 py-3 rounded-full text-[0.62rem] font-syne font-black tracking-[0.2em] uppercase text-[#D4A373] border border-[rgba(212,163,115,0.25)] hover:border-[#D4A373]/60 transition-colors"
            >
              <span className="absolute inset-0 bg-[#D4A373]/0 group-hover:bg-[#D4A373]/8 rounded-full transition-all duration-300" />
              <span className="relative z-10">Voir tout sur GitHub →</span>
            </motion.a>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onClick={() => setSelected(project)} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}