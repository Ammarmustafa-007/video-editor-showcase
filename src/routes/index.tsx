import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Play } from "lucide-react";
import { useRef } from "react";
import portrait from "@/assets/portrait-hero.jpg";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abdullah Qureshi — Video Editor" },
      { name: "description", content: "Creative video editor crafting cinematic stories for brands, weddings and creators." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <>
      <section ref={ref} className="relative overflow-hidden bg-hero-gradient">
        <motion.div
          aria-hidden
          className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand-yellow/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-brand-green/25 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-36 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.4em] text-brand-yellow font-semibold mb-5"
            >
              My Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] text-foreground"
            >
              Abdullah <br />
              <span className="text-brand-yellow">Qureshi</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-2xl md:text-3xl font-display font-bold text-brand-yellow"
            >
              Video Editor
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg"
            >
              Cinematic storytelling, smooth transitions and post-production that converts attention into results.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 bg-brand-yellow text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-[1.03] transition-transform"
              >
                Hire Me <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/work/weddings"
                className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:border-brand-yellow hover:text-brand-yellow transition-colors"
              >
                <Play size={16} /> View Showreels
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto"
          >
            <TiltCard className="rounded-3xl overflow-hidden shadow-card bg-brand-green p-4 md:p-6 max-w-sm">
              <div className="rounded-2xl overflow-hidden">
                <img src={portrait} alt="Abdullah Qureshi portrait" className="w-full h-auto block" />
              </div>
              <p className="mt-4 font-display text-2xl font-extrabold text-brand-yellow">My Portfolio</p>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick highlights */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground max-w-3xl">
            Crafting moments that <span className="text-brand-yellow">move</span> people.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "3+", l: "Years editing experience" },
            { n: "50+", l: "Projects delivered globally" },
            { n: "100%", l: "Client satisfaction" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.12}>
              <div className="p-8 rounded-2xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors">
                <p className="font-display text-5xl font-extrabold text-brand-yellow">{s.n}</p>
                <p className="mt-2 text-muted-foreground">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground max-w-xl">
              Ready to make something cinematic together?
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-yellow text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-[1.03] transition-transform"
            >
              Start a project <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// Type-safe loosen for Download icon (not used but keeps import clean if added later)
void Download;
