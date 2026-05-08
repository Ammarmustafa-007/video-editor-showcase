import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Abdullah Qureshi" },
      { name: "description", content: "What clients and collaborators say about working with Abdullah Qureshi." },
    ],
  }),
  component: TestimonialsPage,
});

const list = [
  { name: "Ahmed Raza", role: "Videographer", text: "Qureshi is a highly skilled video editor with a strong eye for detail. He understands creative direction quickly and delivers polished edits on time. His workflow is smooth, and the final output always meets professional standards." },
  { name: "Zainab Khan", role: "Creative Director", text: "Working with Qureshi has been a great experience. He brings ideas to life with precision and creativity. His sense of timing, color, and storytelling makes every project stand out." },
  { name: "Abdullah Al-Thani", role: "CEO, Media Agency", text: "Qureshi handled our projects with complete professionalism. From raw footage to final delivery, everything was managed efficiently. His editing quality and commitment to deadlines are impressive." },
  { name: "Omar Farooq", role: "Content Creator & Filmmaker", text: "Qureshi is a reliable and fast editor who knows how to enhance visuals effectively. His color grading and post-production skills add real value to content. I highly recommend him for any serious project." },
];

function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Words from collaborators." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 grid gap-6 md:grid-cols-2">
        {list.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <TiltCard intensity={6} className="h-full p-8 rounded-2xl bg-card border border-border shadow-card">
              <Quote className="text-brand-yellow" size={28}/>
              <p className="mt-4 text-foreground/90 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-display font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-brand-yellow">{t.role}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </section>
    </>
  );
}