"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { personalInfo } from "@/data";

/* ─── Animated input field ─────────────────────────────── */
function Field({
  label, name, type = "text", placeholder, value, onChange, focused, onFocus, onBlur, rows,
}: {
  label: string; name: string; type?: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  focused: boolean; onFocus: () => void; onBlur: () => void; rows?: number;
}) {
  const isActive = focused || value.length > 0;
  const Tag = rows ? "textarea" : "input";

  return (
    <div className="relative group">
      {/* Label */}
      <motion.label
        animate={{
          y: isActive ? -22 : 0,
          scale: isActive ? 0.75 : 1,
          color: focused ? "#D4A373" : isActive ? "rgba(237,224,212,0.5)" : "rgba(237,224,212,0.3)",
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-4 top-4 text-xs font-syne font-bold tracking-[0.2em] uppercase origin-left pointer-events-none z-10"
      >
        {label}
      </motion.label>

      {/* Input */}
      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required
        placeholder=""
        rows={rows}
        className="w-full bg-transparent px-4 pt-7 pb-3 text-[#EDE0D4] text-sm font-dm outline-none resize-none relative z-10"
        style={{
          minHeight: rows ? "auto" : undefined,
        }}
      />

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(237,224,212,0.1)]" />
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-[#D4A373]"
        animate={{ width: focused ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: focused ? "0 0 12px rgba(212,163,115,0.5)" : "none" }}
      />

      {/* Left accent line */}
      <motion.div
        className="absolute top-0 left-0 w-px bg-[#D4A373]"
        animate={{ height: focused ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: 0.4 }}
      />
    </div>
  );
}

/* ─── Contact info item ────────────────────────────────── */
function ContactItem({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-4 group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
        transition={{ duration: 0.3 }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 relative overflow-hidden"
        style={{ background: "rgba(237,224,212,0.04)", border: "1px solid rgba(237,224,212,0.08)" }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(212,163,115,0.1)" }}
        />
        <span className="relative z-10">{icon}</span>
      </motion.div>
      <div>
        <p className="text-[0.58rem] font-syne font-bold tracking-[0.25em] uppercase text-[#EDE0D4]/30 mb-0.5">{label}</p>
        <p className="text-[#EDE0D4]/70 group-hover:text-[#D4A373] transition-colors text-sm font-dm">
          {value}
        </p>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulation de chargement pour l'animation (1.2 seconde)
    await new Promise(r => setTimeout(r, 1200));

    // Construction du message WhatsApp avec mise en forme grasse (*texte*)
    const messageText = `Bonjour ! Nouveau message depuis le portfolio :

*Nom complet :* ${form.name}
*Email :* ${form.email}
*Sujet :* ${form.subject}

*Message :*
${form.message}`;

    // Encodage propre de l'URL pour gérer les espaces et caractères spéciaux
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/22871254851?text=${encodedText}`;

    // Ouverture de WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, "_blank");

    setSending(false);
    setSent(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Parallax glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute right-[-5%] bottom-[-10%] w-[600px] h-[600px] bg-[#D4A373] rounded-full blur-[280px] opacity-[0.045] pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute left-[10%] top-[20%] w-[300px] h-[300px] bg-[#D4A373] rounded-full blur-[180px] opacity-[0.025] pointer-events-none"
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
              Travaillons ensemble
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
              Contact<span className="text-[#D4A373]">.</span>
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

        <div className="grid lg:grid-cols-2 gap-20">
          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <p
              className="text-[#EDE0D4]/50 leading-relaxed max-w-md"
              style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
            >
              Vous avez un projet en tête ? Une collaboration à proposer ?
              Je suis disponible et à l'écoute. N'hésitez pas à m'écrire.
            </p>

            <div className="space-y-6">
              <ContactItem icon="✉" label="Email" value={personalInfo.email} href={`mailto:${personalInfo.email}`} />
              <ContactItem icon="📞" label="Téléphone" value={personalInfo.phone} href={`tel:${personalInfo.phone}`} />
            </div>

            {/* Socials */}
            <div className="space-y-3">
              <p className="text-[0.58rem] font-syne font-bold tracking-[0.3em] uppercase text-[#EDE0D4]/25 mb-4">
                Réseaux
              </p>
              {[
                { label: "GitHub", href: personalInfo.github, icon: "⌥" },
                { label: "LinkedIn", href: personalInfo.linkedin, icon: "in" },
              ].map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 8, color: "#D4A373" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 text-[#EDE0D4]/40 group"
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-syne font-black flex-shrink-0 group-hover:border-[#D4A373]/40 transition-all"
                    style={{ background: "rgba(237,224,212,0.04)", border: "1px solid rgba(237,224,212,0.07)" }}
                  >
                    {icon}
                  </span>
                  <span className="text-sm font-syne font-bold tracking-wide group-hover:text-[#D4A373] transition-colors">{label}</span>
                  <motion.span
                    className="ml-auto opacity-0 group-hover:opacity-100 text-xs"
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Right (Form) ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center gap-6 min-h-[450px] rounded-3xl relative overflow-hidden"
                  style={{ background: "rgba(12,12,12,0.6)", border: "1px solid rgba(212,163,115,0.12)" }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      background: [
                        "radial-gradient(circle at 50% 50%, rgba(212,163,115,0.05) 0%, transparent 60%)",
                        "radial-gradient(circle at 50% 50%, rgba(212,163,115,0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 50% 50%, rgba(212,163,115,0.05) 0%, transparent 60%)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-6xl"
                  >
                    🚀
                  </motion.div>
                  <div className="relative z-10 space-y-3">
                    <h3 className="font-syne font-black text-2xl text-[#EDE0D4]">Redirection WhatsApp...</h3>
                    <p className="text-[#EDE0D4]/45 max-w-xs text-sm leading-relaxed">
                      Votre message a été mis en forme. Il ne vous reste plus qu'à cliquer sur "Envoyer" dans WhatsApp.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-3xl p-8 space-y-6 relative overflow-hidden"
                  style={{ background: "rgba(12,12,12,0.6)", border: "1px solid rgba(237,224,212,0.07)" }}
                >
                  {/* Form glow */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,163,115,0.04) 0%, transparent 60%)" }}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { name: "name", label: "Nom complet", type: "text", placeholder: "John Doe" },
                      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                    ].map(({ name, label, type }) => (
                      <Field
                        key={name}
                        name={name}
                        label={label}
                        type={type}
                        placeholder=""
                        value={(form as Record<string, string>)[name]}
                        onChange={handleChange}
                        focused={focused === name}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused(null)}
                      />
                    ))}
                  </div>

                  <Field
                    name="subject"
                    label="Sujet"
                    placeholder=""
                    value={form.subject}
                    onChange={handleChange}
                    focused={focused === "subject"}
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused(null)}
                  />

                  <Field
                    name="message"
                    label="Message"
                    placeholder=""
                    value={form.message}
                    onChange={handleChange}
                    focused={focused === "message"}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    rows={5}
                  />

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-syne font-black text-xs tracking-[0.25em] uppercase relative overflow-hidden"
                    style={{ background: "#D4A373", color: "#0a0a0a" }}
                  >
                    {/* Hover sweep */}
                    <motion.span
                      className="absolute inset-0 bg-[#EDE0D4]"
                      initial={{ x: "-101%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Pulse glow */}
                    <motion.span
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: ["0 0 0px rgba(212,163,115,0)", "0 0 30px rgba(212,163,115,0.4)", "0 0 0px rgba(212,163,115,0)"],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    <AnimatePresence mode="wait">
                      {sending ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative z-10 flex items-center justify-center gap-2"
                        >
                          <motion.span
                            className="w-3 h-3 rounded-full border-2 border-[#0a0a0a] border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                          Envoi...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative z-10"
                        >
                          Envoyer le message →
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}