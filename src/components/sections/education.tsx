import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

const items = [
  { years: "2021 – 2022", school: "UNIQUE GROUP OF INSTITUTIONS", level: "High School – Matric", note: "Percentage: 79%" },
  { years: "2022 – 2023", school: "KIPS COLLEGE", level: "College – Intermediate Education", note: "Percentage: 82%" },
];

export function EducationPage() {
  return (
    <>
      <PageHero eyebrow="Education" title="Foundations & training." subtitle="Academic background that shaped a creative editor's eye for detail." />
      <section className="mx-auto max-w-3xl px-4 lg:px-8 py-10 md:py-16">
        <ol className="relative border-l border-border space-y-8 pl-8">
          {items.map((it, i) => (
            <Reveal as="li" key={it.school} delay={i * 0.15} x={30}>
              <motion.span
                className="absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-brand-yellow text-primary-foreground"
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <GraduationCap size={14}/>
              </motion.span>
              <p className="text-[10px] text-brand-yellow font-semibold uppercase tracking-wider">{it.years}</p>
              <h3 className="font-display text-xl font-bold text-foreground mt-1">{it.school}</h3>
              <p className="text-sm text-muted-foreground mt-1">{it.level}</p>
              <p className="text-xs text-foreground/80 mt-1.5">{it.note}</p>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}