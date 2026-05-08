import { createFileRoute } from "@tanstack/react-router";
import { Film, Music2, Palette, Users, Sparkles, ListChecks } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Abdullah Qureshi" },
      { name: "description", content: "Video editing, sound design, color grading, motion graphics, and more." },
    ],
  }),
  component: SkillsPage,
});

const skills = [
  { icon: Film, title: "Video Editing", desc: "Cinematic cuts, pacing and rhythm in Adobe Premiere Pro." },
  { icon: Music2, title: "Sound Design", desc: "Layered audio, SFX and clean mixes for emotional impact." },
  { icon: Palette, title: "Color Grading", desc: "Cinematic looks, skin-tone correction, mood-driven palettes." },
  { icon: Users, title: "Collaboration", desc: "Clear comms with directors, brands and remote teams." },
  { icon: Sparkles, title: "Motion Graphics", desc: "Type animations, logo reveals, kinetic overlays." },
  { icon: ListChecks, title: "Project Management", desc: "End-to-end workflows from raw footage to delivery." },
];

function SkillsPage() {
  return (
    <>
      <PageHero eyebrow="Skills" title="The toolkit." subtitle="A focused stack tuned for cinematic output and fast turnaround." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.07}>
            <TiltCard intensity={8} className="h-full p-8 rounded-2xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors">
              <s.icon className="text-brand-yellow" size={32}/>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </TiltCard>
          </Reveal>
        ))}
      </section>
    </>
  );
}