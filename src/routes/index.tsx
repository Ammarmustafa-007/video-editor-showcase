import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";
import { scrollToY } from "@/lib/smoothScroll";
import { DockingHologram } from "@/components/site/DockingHologram";
import { BuildIntro } from "@/components/site/BuildIntro";
import { StarField } from "@/components/site/StarField";
import { ZoomWord } from "@/components/site/ZoomWord";
import { Showreel } from "@/components/site/Showreel";
import { ChatWidget } from "@/components/site/ChatWidget";
import { EditTimeline } from "@/components/site/EditTimeline";
import site from "@/content/site.json";
import { useIsMobile } from "@/hooks/useIsMobile";
import { TimelineNavigation } from "@/components/site/TimelineNavigation";

import { AboutPage } from "@/components/sections/about";
import { EducationPage } from "@/components/sections/education";
import { SkillsPage } from "@/components/sections/skills";
import { ExperiencePage } from "@/components/sections/experience";
import { TestimonialsPage } from "@/components/sections/testimonials";
import { WhyMePage } from "@/components/sections/why-me";
import { ContactPage } from "@/components/sections/contact";
import { WorkPage } from "@/components/sections/work";
import { CaseStudiesPage } from "@/components/sections/cases";
import { ServicesPage } from "@/components/sections/services";
import { WORK } from "@/lib/videoConfig";
import { BrandsSection } from "@/components/sections/brands";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: site.seo.title },
      { name: "description", content: site.seo.description },
    ],
  }),
  component: HomePage,
});

type Entry = "rise" | "tilt-left" | "tilt-right" | "depth";
type SectionConfig = { id: string; children: React.ReactNode; entry?: Entry };

const k01 = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Sections sit in 3D space. Each one comes up out of the page at a slight angle (tilted back, turned a little to one
 * side, or set further away) and settles flat while you read. Small angles, no spins: the depth is the point.
 */
function SectionWrapper({ id, children, entry = "rise" }: SectionConfig) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const m = reduced ? 0 : isMobile ? 0.5 : 1;

  const inT = (v: number) => 1 - ease(k01(v, 0.0, 0.32));
  const outT = (v: number) => k01(v, 0.82, 1);

  const opacity = useTransform(p, (v) => (reduced ? 1 : Math.min(0.25 + 0.75 * k01(v, 0, 0.18), 1 - 0.6 * outT(v))));
  const rotateX = useTransform(p, (v) => m * (entry === "rise" ? 16 : entry === "depth" ? 8 : 6) * inT(v) - m * 8 * outT(v));
  const rotateY = useTransform(p, (v) => m * (entry === "tilt-left" ? 12 : entry === "tilt-right" ? -12 : 0) * inT(v));
  const z = useTransform(p, (v) => m * (entry === "depth" ? -260 : -120) * inT(v) - m * 120 * outT(v));
  const y = useTransform(p, (v) => m * 40 * inT(v));

  return (
    <section id={id} ref={ref} className="relative z-10 flex flex-col justify-center py-6 md:py-10" style={{ perspective: isMobile ? 1000 : 1600 }}>
      <motion.div
        style={{ opacity, rotateX, rotateY, z, y, transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
        className="w-full px-4 md:px-8 lg:px-12 mx-auto max-w-[75rem] will-change-transform"
      >
        <div className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#120d22]/70 p-3 md:p-6">{children}</div>
      </motion.div>
    </section>
  );
}

const hero = site.hero;

function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      scrollToY(top);
    }
  };

  return (
    <>
      <StarField />
      <TimelineNavigation />
      <ChatWidget />
      <DockingHologram slot={slot} />
      <BuildIntro slot={slot} />

      <section id="home" ref={ref} className="relative overflow-hidden min-h-screen pt-16">
        <motion.div style={{ opacity }} className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-[88rem] grid-cols-1 items-center gap-4 px-4 md:px-8 lg:grid-cols-12 lg:px-12">
          {/* left: who */}
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.7, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1 lg:col-span-4 text-center lg:text-left"
          >
            <p className="mb-4 font-mono text-[13px] text-white/50">
              <span className="text-brand-yellow">00:00:00:00</span>&nbsp;&nbsp;{hero.eyebrow}
            </p>
            <h1 data-build="h1 · name" className="font-display text-5xl md:text-6xl xl:text-7xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground">
              {hero.first}
              <br />
              <span className="text-brand-yellow">{hero.last}</span>
            </h1>
            <p data-build="role" className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-lg md:text-xl font-medium text-foreground/90 lg:justify-start">
              {hero.role.split(" · ")[0]}
              {hero.role.split(" · ")[1] && (
                <button type="button" onClick={() => { const el = document.getElementById("ai-videos"); if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 80); }} className="inline-flex items-center gap-2 rounded-full border border-[#c9a6ff]/40 bg-[#c9a6ff]/10 px-3 py-1 text-sm font-medium text-brand-yellow transition-colors hover:bg-[#c9a6ff]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />{hero.role.split(" · ")[1]}
                </button>
              )}
            </p>
            <p data-build="tagline" className="mt-2 text-base text-white/60 max-w-md mx-auto lg:mx-0">{hero.tagline}</p>
          </motion.div>

          {/* centre: the box the hologram starts in (it is drawn by DockingHologram, fixed on top) */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative">
            <div ref={slot} className="mx-auto h-[56vh] md:h-[72vh] lg:h-[84vh] w-full max-w-[640px]" />
          </div>

          {/* right: numbers + actions */}
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0%)" }}
            transition={{ duration: 0.7, delay: 1.45, ease: [0.22, 1, 0.36, 1] }}
            className="order-3 lg:col-span-3 flex flex-col items-center lg:items-end gap-8 pb-16 lg:pb-0 lg:pr-20 xl:pr-24"
          >
            <dl data-build="stats" className="flex lg:flex-col gap-6 lg:gap-5 text-center lg:text-right">
              {hero.stats.map((st) => (
                <div key={st.label}>
                  <dt className="sr-only">{st.label}</dt>
                  <dd className="font-display text-3xl md:text-4xl font-medium tabular-nums text-foreground">{st.value}</dd>
                  <dd className="text-[13px] text-white/50">{st.label}</dd>
                </div>
              ))}
            </dl>
            <div data-build="actions" className="flex flex-wrap justify-center lg:justify-end gap-3">
              <button
                onClick={() => handleScroll("#contact")}
                className="group inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-yellow px-5 text-sm font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform,background-color] duration-150 hover:bg-[#d9c2ff] active:scale-[0.98]"
              >
                Hire me <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => handleScroll("#showreel")}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-foreground transition-[transform,background-color] duration-150 hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <Play size={16} strokeWidth={1.5} /> Watch the work
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Showreel />

      <ZoomWord />

      <BrandsSection />

      <div className="flex flex-col w-full [overflow-x:clip]">
        <SectionWrapper id="services" entry="rise">
          <ServicesPage />
        </SectionWrapper>

        <SectionWrapper id="about" entry="tilt-left">
          <AboutPage />
        </SectionWrapper>

        <SectionWrapper id="education" entry="tilt-right">
          <EducationPage />
        </SectionWrapper>

        <SectionWrapper id="skills" entry="depth">
          <SkillsPage />
        </SectionWrapper>

        <SectionWrapper id="experience" entry="rise">
          <ExperiencePage />
        </SectionWrapper>

        <SectionWrapper id="testimonials" entry="tilt-left">
          <TestimonialsPage />
        </SectionWrapper>

        <SectionWrapper id="why-me" entry="tilt-right">
          <WhyMePage />
        </SectionWrapper>

        <EditTimeline />

        {WORK.map((w, i) => (
          <SectionWrapper key={w.id} id={w.id} entry={(["depth", "tilt-left", "tilt-right", "rise"] as const)[i % 4]}>
            <WorkPage section={w} />
          </SectionWrapper>
        ))}

        <SectionWrapper id="case-studies" entry="rise">
          <CaseStudiesPage />
        </SectionWrapper>

        <SectionWrapper id="contact" entry="depth">
          <ContactPage />
        </SectionWrapper>
      </div>
    </>
  );
}
