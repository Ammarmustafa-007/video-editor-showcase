import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Wrench, Search, Users } from "lucide-react";
import portrait from "@/assets/portrait-circle.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/why-me")({
  head: () => ({
    meta: [
      { title: "Why hire me — Abdullah Qureshi" },
      { name: "description", content: "Creative storytelling, technical command of Premiere Pro, attention to detail and team collaboration." },
    ],
  }),
  component: WhyMePage,
});

const items = [
  { icon: Sparkles, title: "Creative Storytelling", desc: "I transform raw footage into engaging stories that capture attention and connect with the audience — for social, commercials and branded content." },
  { icon: Wrench, title: "Advanced Technical Skills", desc: "Strong command of Adobe Premiere Pro: clean edits, smooth transitions and high-quality visuals to professional standards." },
  { icon: Search, title: "Attention to Detail", desc: "Every cut, sound design choice and color decision is intentional — for a polished, seamless final output." },
  { icon: Users, title: "Team Collaboration", desc: "I work closely with clients and teams, value feedback, and ensure the final product aligns with the creative vision." },
];

function WhyMePage() {
  return (
    <>
      <PageHero eyebrow="Why Me" title="What you get when we work together." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 grid gap-12 lg:grid-cols-[auto_1fr] items-center">
        <Reveal>
          <TiltCard className="rounded-full overflow-hidden border-4 border-brand-yellow shadow-glow w-64 h-64 mx-auto">
            <img src={portrait} alt="Abdullah Qureshi" className="w-full h-full object-cover"/>
          </TiltCard>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors h-full">
                <it.icon className="text-brand-yellow" size={26}/>
                <h3 className="mt-3 font-display font-bold text-lg text-foreground">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}