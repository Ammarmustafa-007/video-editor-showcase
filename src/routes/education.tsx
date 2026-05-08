import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education — Abdullah Qureshi" },
      { name: "description", content: "Academic background and qualifications of Abdullah Qureshi." },
    ],
  }),
  component: EducationPage,
});

const items = [
  { years: "2021 – 2022", school: "UNIQUE GROUP OF INSTITUTIONS", level: "High School – Matric", note: "Percentage: 79%" },
  { years: "2022 – 2023", school: "KIPS COLLEGE", level: "College – Intermediate Education", note: "Percentage: 82%" },
];

function EducationPage() {
  return (
    <>
      <PageHero eyebrow="Education" title="Foundations & training." subtitle="Academic background that shaped a creative editor's eye for detail." />
      <section className="mx-auto max-w-4xl px-4 lg:px-8 py-16 md:py-24">
        <ol className="relative border-l border-border space-y-10 pl-8">
          {items.map((it, i) => (
            <Reveal as="li" key={it.school} delay={i * 0.1}>
              <span className="absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-brand-yellow text-primary-foreground">
                <GraduationCap size={14}/>
              </span>
              <p className="text-sm text-brand-yellow font-semibold uppercase tracking-wider">{it.years}</p>
              <h3 className="font-display text-2xl font-bold text-foreground mt-1">{it.school}</h3>
              <p className="text-muted-foreground mt-1">{it.level}</p>
              <p className="text-sm text-foreground/80 mt-2">{it.note}</p>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}