import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";
import portrait from "@/assets/portrait-hero.jpg";
import { TiltCard } from "@/components/site/TiltCard";
import { ThreeBackground } from "@/components/ThreeBackground";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abdullah Qureshi — Video Editor" },
      { name: "description", content: "Creative video editor crafting cinematic stories for brands, weddings and creators." },
    ],
  }),
  component: HomePage,
});

type SectionConfig = {
  id: string;
  children: React.ReactNode;
  /** Entry direction: 'left' | 'right' | 'bottom' | 'zoom' */
  entry?: "left" | "right" | "bottom" | "zoom";
};

function SectionWrapper({ id, children, entry = "bottom" }: SectionConfig) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Base smooth opacity
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 25 });

  // 3D perspective-driven entry based on direction
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    entry === "zoom" ? [0, 0, 0, 0] : [80, 0, 0, -40]
  );
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    entry === "left" ? [-60, 0, 0, 0] : entry === "right" ? [60, 0, 0, 0] : [0, 0, 0, 0]
  );
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    entry === "zoom" ? [0.85, 1, 1, 0.92] : [0.95, 1, 1, 0.97]
  );
  const rawRotateY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    entry === "left" ? [-8, 0, 0, 0] : entry === "right" ? [8, 0, 0, 0] : [0, 0, 0, 0]
  );

  const y = useSpring(rawY, { stiffness: 80, damping: 20 });
  const x = useSpring(rawX, { stiffness: 80, damping: 20 });
  const scale = useSpring(rawScale, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 80, damping: 20 });

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{ scale, opacity, y, x, rotateY, transformPerspective: 1200 }}
      className="relative z-10 flex flex-col justify-center py-6 md:py-10"
    >
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto max-w-[75rem]">
        <div className="overflow-hidden transition-all duration-700 ease-out hover:shadow-[0_0_50px_rgba(255,215,0,0.08)] rounded-[2rem] hover:bg-brand-navy-deep/25 backdrop-blur-sm p-3 md:p-6 border border-transparent hover:border-brand-yellow/10">
          {children}
        </div>
      </div>
    </motion.section>
  );
}

/** Floating badge with count-up animation */
function StatBadge({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateZ: -10 }}
      animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-2 text-center shadow-card"
    >
      <p className="text-xl md:text-2xl font-display font-extrabold text-brand-yellow">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <ThreeBackground />
      <TimelineNavigation />

      <section id="home" ref={ref} className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-16">
        <motion.div style={{ y, opacity, scale }} className="relative w-full px-4 md:px-8 lg:px-12 mx-auto max-w-[75rem] py-6 md:py-14 grid gap-8 md:grid-cols-2 items-center z-10">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="text-[10px] uppercase tracking-[0.4em] text-brand-yellow font-semibold mb-4"
            >
              My Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 60, rotateX: 50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] text-foreground"
              style={{ perspective: 800 }}
            >
              Abdullah <br />
              <motion.span
                className="text-brand-yellow inline-block"
                whileHover={{ scale: 1.05, rotateZ: -2, color: "#ef4444" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Qureshi
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-xl md:text-2xl font-display font-bold text-brand-yellow"
            >
              Video Editor
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-sm md:text-base text-muted-foreground max-w-md"
            >
              Cinematic storytelling, smooth transitions and post-production that converts attention into results.
            </motion.p>

            {/* Stats row */}
            <div className="mt-6 flex gap-3">
              <StatBadge label="Projects" value="50+" delay={0.6} />
              <StatBadge label="Clients" value="20+" delay={0.75} />
              <StatBadge label="Years" value="3+" delay={0.9} />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 1, type: "spring" }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <motion.button
                onClick={() => handleScroll("#contact")}
                whileHover={{ scale: 1.08, boxShadow: "0 0 35px rgba(255,215,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 bg-brand-yellow text-black bg-amber-300 font-semibold px-5 py-2.5 rounded-full shadow-glow transition-all text-sm"
              >
                Hire Me <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => handleScroll("#weddings")}
                whileHover={{ scale: 1.08, borderColor: "rgba(255,215,0,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-full transition-all text-sm"
              >
                <Play size={14} className="group-hover:text-brand-yellow" /> View Showreels
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.4, rotateY: 50, z: -600 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.35 }}
            className="relative mx-auto perspective-[2000px] group cursor-pointer"
          >
            <TiltCard className="rounded-2xl overflow-hidden shadow-card bg-brand-green/80 backdrop-blur-sm p-3 md:p-4 max-w-xs border border-brand-green group-hover:border-brand-yellow transition-colors duration-500 group-hover:shadow-[0_0_50px_rgba(255,215,0,0.3)]">
              <div className="rounded-xl overflow-hidden relative">
                {/* Glitch/Flash hover overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors z-10 mix-blend-overlay duration-300" />
                <img src={portrait} alt="Abdullah Qureshi portrait" className="w-full h-auto block group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
              <p className="mt-3 font-display text-lg font-extrabold text-brand-yellow tracking-widest group-hover:tracking-[0.3em] transition-all duration-500">My Portfolio</p>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div className="w-1 h-2 rounded-full bg-brand-yellow" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        </motion.div>
      </section>

      <div className="flex flex-col w-full">
        <SectionWrapper id="about" entry="left">
          <AboutPage />
        </SectionWrapper>

        <SectionWrapper id="education" entry="right">
          <EducationPage />
        </SectionWrapper>

        <SectionWrapper id="skills" entry="zoom">
          <SkillsPage />
        </SectionWrapper>

        <SectionWrapper id="experience" entry="left">
          <ExperiencePage />
        </SectionWrapper>

        <SectionWrapper id="testimonials" entry="right">
          <TestimonialsPage />
        </SectionWrapper>

        <SectionWrapper id="why-me" entry="zoom">
          <WhyMePage />
        </SectionWrapper>

        <SectionWrapper id="weddings" entry="left">
          <WeddingsPage />
        </SectionWrapper>

        <SectionWrapper id="talking-head" entry="right">
          <TalkingHeadPage />
        </SectionWrapper>

        <SectionWrapper id="montage" entry="zoom">
          <MontagePage />
        </SectionWrapper>

        <SectionWrapper id="long-form" entry="left">
          <LongFormPage />
        </SectionWrapper>

        <SectionWrapper id="contact" entry="zoom">
          <ContactPage />
        </SectionWrapper>
      </div>
    </>
  );
}
