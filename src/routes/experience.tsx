import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Abdullah Qureshi" },
      { name: "description", content: "Freelance and on-site video editing roles in Qatar and Lahore." },
    ],
  }),
  component: ExperiencePage,
});

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

function ExperiencePage() {
  return (
    <>
      <PageHero eyebrow="Experiences" title="Where I've shaped stories." />
      <section className="mx-auto max-w-5xl px-4 lg:px-8 py-16 md:py-24 space-y-8">
        {jobs.map((j, i) => (
          <Reveal key={j.company} delay={i * 0.1}>
            <article className="p-8 rounded-2xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-brand-yellow font-semibold">
                <span>{j.period}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MapPin size={12}/> {j.location}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-3">
                <Briefcase className="text-brand-yellow" size={22}/> {j.role}
              </h3>
              <p className="mt-1 text-muted-foreground font-semibold">{j.company}</p>
              <ul className="mt-5 space-y-2 text-muted-foreground">
                {j.points.map((p) => (
                  <li key={p} className="pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-2 before:h-2 before:bg-brand-yellow before:rounded-full">
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}