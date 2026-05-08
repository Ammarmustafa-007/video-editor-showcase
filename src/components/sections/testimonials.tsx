import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { TiltCard } from "@/components/site/TiltCard";

const list = [
  { name: "Ahmed Raza", role: "Videographer", text: "Qureshi is a highly skilled video editor with a strong eye for detail. He understands creative direction quickly and delivers polished edits on time. His workflow is smooth, and the final output always meets professional standards." },
  { name: "Zainab Khan", role: "Creative Director", text: "Working with Qureshi has been a great experience. He brings ideas to life with precision and creativity. His sense of timing, color, and storytelling makes every project stand out." },
  { name: "Abdullah Al-Thani", role: "CEO, Media Agency", text: "Qureshi handled our projects with complete professionalism. From raw footage to final delivery, everything was managed efficiently. His editing quality and commitment to deadlines are impressive." },
  { name: "Omar Farooq", role: "Content Creator & Filmmaker", text: "Qureshi is a reliable and fast editor who knows how to enhance visuals effectively. His color grading and post-production skills add real value to content. I highly recommend him for any serious project." },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateY: -15, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Words from collaborators." />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-4 md:grid-cols-2"
        style={{ perspective: 1000 }}
      >
        {list.map((t) => (
          <motion.div key={t.name} variants={cardVariants} style={{ transformStyle: "preserve-3d" }}>
            <TiltCard intensity={6} className="h-full p-8 rounded-xl bg-card border border-border shadow-card group hover:border-brand-yellow/30 transition-colors">
              <motion.div whileHover={{ rotate: -10, scale: 1.15 }} transition={{ type: "spring" }}>
                <Quote className="text-brand-yellow" size={22}/>
              </motion.div>
              <p className="mt-3 text-sm text-foreground/90 leading-relaxed">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-brand-yellow">{t.role}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}