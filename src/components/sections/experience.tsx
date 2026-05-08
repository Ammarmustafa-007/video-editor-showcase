import { Briefcase, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

const jobs = [
  {
    period: "2025 – 2026",
    location: "Remote · Qatar",
    role: "Freelance Video Editor",
    company: "EVOLVEMARKETING QATAR",
    points: [
      "Edited restaurant niche content and montage videos for major brands, including McLaren.",
      "Managed end-to-end remote workflows: raw footage, organization, delivery — independently.",
      "Developed advanced expertise in color grading, video enhancement, and full-scale post-production.",
    ],
  },
  {
    period: "2024 – 2025",
    location: "On-site · Lahore",
    role: "Senior Video Editor",
    company: "INVENTOR DESIGN STUDIO",
    points: [
      "Edited high-end projects including international weddings, talking-head and motion graphics content.",
      "Managed projects end-to-end while developing skills in color grading, sound design, and post-production.",
    ],
  },
  {
    period: "2023 – 2024",
    location: "On-site · Lahore",
    role: "Video Editing Intern",
    company: "STYLE STUDIO",
    points: [
      "Learned video editing fundamentals through hands-on project work — construction and montage videos.",
      "Assisted in editing using Adobe Premiere Pro, with basic motion graphics and visual enhancements.",
      "Gained practical experience in project creation, workflow management, and creative requirements.",
    ],
  },
];

export function ExperiencePage() {
  return (
    <>
      <PageHero eyebrow="Experiences" title="Where I've shaped stories." />
      <section className="mx-auto max-w-4xl px-4 lg:px-8 py-10 md:py-16 space-y-5">
        {jobs.map((j, i) => (
          <Reveal key={j.company} delay={i * 0.12} x={i % 2 === 0 ? -30 : 30} rotate={i % 2 === 0 ? -1 : 1}>
            <motion.article
              whileHover={{ scale: 1.015, y: -4, boxShadow: "0 20px 60px -15px rgba(255,215,0,0.15)" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-6 rounded-xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-brand-yellow font-semibold">
                <span>{j.period}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MapPin size={10}/> {j.location}</span>
              </div>
              <h3 className="mt-2 font-display text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Briefcase className="text-brand-yellow" size={18}/> {j.role}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground font-semibold">{j.company}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {j.points.map((p) => (
                  <li key={p} className="pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-brand-yellow before:rounded-full">
                    {p}
                  </li>
                ))}
              </ul>
            </motion.article>
          </Reveal>
        ))}
      </section>
    </>
  );
}