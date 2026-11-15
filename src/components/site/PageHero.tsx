import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { timecodeFor } from "@/lib/sections";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};


export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl px-4 lg:px-8 pt-12 pb-4 md:pt-16"
      >
        {eyebrow && (
          <p className="mb-4 font-mono text-[13px] text-white/50">
            {timecodeFor(eyebrow) && <span className="text-brand-yellow">{timecodeFor(eyebrow)}:00</span>}
            {timecodeFor(eyebrow) && <>&nbsp;&nbsp;</>}
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-[-0.025em] leading-[1.08] text-foreground [text-wrap:balance] max-w-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base md:text-lg text-white/60 max-w-xl">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </motion.div>
    </section>
  );
}
