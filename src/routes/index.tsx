import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef, lazy, Suspense } from "react";
const HologramPortrait = lazy(() => import("@/components/HologramPortrait").then((m) => ({ default: m.HologramPortrait })));
import { ZoomWord } from "@/components/site/ZoomWord";
import { ChatWidget } from "@/components/site/ChatWidget";
import { EditTimeline } from "@/components/site/EditTimeline";
import site from "@/content/site.json";
import { useIsMobile } from "@/hooks/useIsMobile";
const ThreeBackground = lazy(() => import("@/components/ThreeBackground").then(m => ({ default: m.ThreeBackground })));
import { TimelineNavigation } from "@/components/site/TimelineNavigation";

import { AboutPage } from "@/components/sections/about";
import { EducationPage } from "@/components/sections/education";
import { SkillsPage } from "@/components/sections/skills";
import { ExperiencePage } from "@/components/sections/experience";
import { TestimonialsPage } from "@/components/sections/testimonials";
import { WhyMePage } from "@/components/sections/why-me";
import { WeddingsPage } from "@/components/sections/work.weddings";
import { TalkingHeadPage } from "@/components/sections/work.talking-head";
import { MontagePage } from "@/components/sections/work.montage";
import { LongFormPage } from "@/components/sections/work.long-form";
import { ContactPage } from "@/components/sections/contact";
import { BrandsSection } from "@/components/sections/brands";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abdullah Qureshi — Video Editor" },
      { name: "description", content: "Creative video editor crafting cinematic stories for brands, weddings and creators." },
    ],
  }),
  component: HomePage,
});

type Entry = "swipe-left" | "swipe-right" | "flip" | "spin" | "zoom-in" | "zoom-out";
type SectionConfig = { id: string; children: React.ReactNode; entry?: Entry };

const k01 = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Every section arrives in 3D, each in its own way: a page swiping in from the side, a page flipping up, a full turn,
 * a zoom in from far away or a zoom down from too close. It settles flat while you read, then sinks back as you leave.
 */
function SectionWrapper({ id, children, entry = "zoom-in" }: SectionConfig) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const flat = reduced;
  const m = isMobile ? 0.45 : 1; // gentler on phones

  const inT = (v: number) => 1 - ease(k01(v, 0.02, 0.3)); // 1 while arriving, 0 once settled
  const outT = (v: number) => k01(v, 0.8, 1);             // 0 while reading, 1 as it leaves

  const opacity = useTransform(p, (v) => (flat ? 1 : Math.min(k01(v, 0.0, 0.16), 1 - outT(v) * 0.9)));
  const x = useTransform(p, (v) => {
    if (flat) return "0vw";
    const i = inT(v);
    return `${(entry === "swipe-left" ? -70 : entry === "swipe-right" ? 70 : 0) * i * m}vw`;
  });
  const y = useTransform(p, (v) => (flat ? 0 : (entry === "flip" ? 120 : 60) * inT(v) * m - 60 * outT(v) * m));
  const rotateY = useTransform(p, (v) => {
    if (flat) return 0;
    const i = inT(v);
    if (entry === "swipe-left") return 55 * i * m;
    if (entry === "swipe-right") return -55 * i * m;
    if (entry === "spin") return -360 * i * (isMobile ? 0 : 1);
    return 0;
  });
  const rotateX = useTransform(p, (v) => (flat ? 0 : (entry === "flip" ? 70 * inT(v) * m : 0) - 14 * outT(v) * m));
  const scale = useTransform(p, (v) => {
    if (flat) return 1;
    const i = inT(v);
    const s = entry === "zoom-in" ? 1 - 0.45 * i : entry === "zoom-out" ? 1 + 0.6 * i : entry === "spin" ? 1 - 0.35 * i : 1 - 0.08 * i;
    return s * (1 - 0.12 * outT(v));
  });

  return (
    <section id={id} ref={ref} className="relative z-10 flex flex-col justify-center py-6 md:py-10" style={{ perspective: isMobile ? 900 : 1400 }}>
      <motion.div
        style={{ opacity, x, y, rotateY, rotateX, scale, transformStyle: "preserve-3d", transformOrigin: entry === "flip" ? "50% 100%" : "50% 50%" }}
        className="w-full px-4 md:px-8 lg:px-12 mx-auto max-w-[75rem] will-change-transform"
      >
        <div className="relative rounded-[2rem] p-3 md:p-6 transition-colors duration-700 hover:bg-brand-navy-deep/25">
          <span aria-hidden className="holo-corners pointer-events-none absolute inset-0 rounded-[2rem] opacity-70" />
          <div className="relative overflow-hidden rounded-[1.6rem]">{children}</div>
        </div>
      </motion.div>
    </section>
  );
}

/** Floating badge with count-up animation */
function StatBadge({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateZ: -10 }}
      animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
      className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center lg:text-right min-w-[96px]"
    >
      <p className="text-2xl md:text-3xl font-display font-extrabold text-foreground tabular-nums">{value}</p>
      <p className="text-[11px] tracking-wide text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const hero = site.hero;

function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const isMobile = useIsMobile();

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-brand-navy-deep -z-10" />}>
        <ThreeBackground />
      </Suspense>
      <TimelineNavigation />
      <ChatWidget />

      <section id="home" ref={ref} className="relative overflow-hidden min-h-screen pt-16">
        {/* the name, huge and faint, behind the hologram */}
        <motion.div aria-hidden style={{ y, opacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
          <span className="font-display font-black uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(180,140,255,0.16)] text-[24vw] md:text-[19vw] tracking-tight">
            {hero.last}
          </span>
        </motion.div>

        <motion.div style={{ opacity, scale }} className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-[88rem] grid-cols-1 items-center gap-2 px-4 md:px-8 lg:grid-cols-12 lg:px-12">
          {/* left: who */}
          <div className="order-2 lg:order-1 lg:col-span-4 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-[13px] uppercase tracking-[0.4em] text-brand-yellow font-semibold mb-3"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.95] text-foreground"
            >
              {hero.first} <br />
              <span className="text-brand-yellow holo-text">{hero.last}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.9 }}
              className="mt-4 text-lg md:text-xl font-display font-semibold text-foreground/90"
            >
              {hero.role}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="mt-3 text-sm md:text-base text-muted-foreground max-w-md mx-auto lg:mx-0"
            >
              {hero.tagline}
            </motion.p>
          </div>

          {/* centre: the hologram */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative">
            <Suspense fallback={<div className="mx-auto h-[56vh] md:h-[72vh] lg:h-[84vh] w-full max-w-[640px]" />}>
              <HologramPortrait className="mx-auto h-[56vh] md:h-[72vh] lg:h-[84vh] w-full max-w-[640px]" />
            </Suspense>
          </div>

          {/* right: numbers + actions */}
          <div className="order-3 lg:col-span-3 flex flex-col items-center lg:items-end gap-5 pb-16 lg:pb-0 lg:pr-20 xl:pr-24">
            <div className="flex lg:flex-col gap-3 lg:gap-4">
              {hero.stats.map((st, k) => (
                <StatBadge key={st.label} label={st.label} value={st.value} delay={2.1 + k * 0.12} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.5 }}
              className="flex flex-wrap justify-center lg:justify-end gap-3"
            >
              <motion.button
                onClick={() => handleScroll("#contact")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 bg-brand-yellow text-primary-foreground font-semibold px-5 py-2.5 rounded-full shadow-glow text-sm"
              >
                Hire me <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => handleScroll("#weddings")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/12 text-foreground font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-white/10"
              >
                <Play size={14} /> Watch the work
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div className="w-1 h-2 rounded-full bg-brand-yellow" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        </motion.div>
      </section>

      <ZoomWord />

      <BrandsSection />

      <div className="flex flex-col w-full [overflow-x:clip]">
        <SectionWrapper id="about" entry="swipe-left">
          <AboutPage />
        </SectionWrapper>

        <SectionWrapper id="education" entry="swipe-right">
          <EducationPage />
        </SectionWrapper>

        <SectionWrapper id="skills" entry="spin">
          <SkillsPage />
        </SectionWrapper>

        <SectionWrapper id="experience" entry="flip">
          <ExperiencePage />
        </SectionWrapper>

        <SectionWrapper id="testimonials" entry="zoom-out">
          <TestimonialsPage />
        </SectionWrapper>

        <SectionWrapper id="why-me" entry="swipe-left">
          <WhyMePage />
        </SectionWrapper>

        <EditTimeline />

        <SectionWrapper id="weddings" entry="zoom-in">
          <WeddingsPage />
        </SectionWrapper>

        <SectionWrapper id="talking-head" entry="swipe-right">
          <TalkingHeadPage />
        </SectionWrapper>

        <SectionWrapper id="montage" entry="flip">
          <MontagePage />
        </SectionWrapper>

        <SectionWrapper id="long-form" entry="swipe-left">
          <LongFormPage />
        </SectionWrapper>

        <SectionWrapper id="contact" entry="zoom-out">
          <ContactPage />
        </SectionWrapper>
      </div>
    </>
  );
}
