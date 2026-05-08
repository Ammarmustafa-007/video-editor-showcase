import { motion } from "framer-motion";
import { type ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 90 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.03,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  const words = title.split(" ");

  return (
    <section className="relative overflow-hidden bg-hero-gradient rounded-xl">
      {/* animated yellow blob */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-brand-yellow/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-green/20 blur-3xl"
        animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle horizontal scan line effect */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,215,0,0.02) 3px, rgba(255,215,0,0.02) 4px)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 py-14 md:py-20">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[10px] uppercase tracking-[0.35em] text-brand-yellow font-semibold mb-3"
          >
            {eyebrow}
          </motion.p>
        )}
        {/* 3D word-by-word title reveal */}
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground" style={{ perspective: 600 }}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={letterVariants}
              className="inline-block mr-[0.3em] origin-bottom"
              style={{ transformStyle: "preserve-3d" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}