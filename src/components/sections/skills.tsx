import { Film, Music2, Palette, Users, Sparkles, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

const skills = [
  { icon: Film, title: "Video Editing", desc: "Cinematic cuts, pacing and rhythm in Adobe Premiere Pro." },
  { icon: Music2, title: "Sound Design", desc: "Layered audio, SFX and clean mixes for emotional impact." },
  { icon: Palette, title: "Color Grading", desc: "Cinematic looks, skin-tone correction, mood-driven palettes." },
  { icon: Users, title: "Collaboration", desc: "Clear comms with directors, brands and remote teams." },
  { icon: Sparkles, title: "Motion Graphics", desc: "Type animations, logo reveals, kinetic overlays." },
  { icon: ListChecks, title: "Project Management", desc: "End-to-end workflows from raw footage to delivery." },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 15, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SkillsPage() {
  return (
    <>
      <PageHero eyebrow="Skills" title="The toolkit." subtitle="A focused stack tuned for cinematic output and fast turnaround." />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: 800 }}
      >
        {skills.map((s) => (
          <motion.div key={s.title} variants={cardVariants} style={{ transformStyle: "preserve-3d" }}>
            <TiltCard intensity={10} className="h-full p-8 rounded-xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors group">
              <div className="flex flex-col justify-center items-center text-center w-full h-full">
                <motion.div whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <s.icon className="text-brand-yellow" size={26}/>
                </motion.div>
                <h3 className="mt-3 font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}