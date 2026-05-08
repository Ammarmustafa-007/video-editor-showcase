import { Sparkles, Wrench, Search, Users } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-circle.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

const items = [
  { icon: Sparkles, title: "Creative Storytelling", desc: "I transform raw footage into engaging stories that capture attention and connect with the audience — for social, commercials and branded content." },
  { icon: Wrench, title: "Advanced Technical Skills", desc: "Strong command of Adobe Premiere Pro: clean edits, smooth transitions and high-quality visuals to professional standards." },
  { icon: Search, title: "Attention to Detail", desc: "Every cut, sound design choice and color decision is intentional — for a polished, seamless final output." },
  { icon: Users, title: "Team Collaboration", desc: "I work closely with clients and teams, value feedback, and ensure the final product aligns with the creative vision." },
];

export function WhyMePage() {
  return (
    <>
      <PageHero eyebrow="Why Me" title="What you get when we work together." />
      <section className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-8 lg:grid-cols-[auto_1fr] items-center">
        <Reveal scale={0.8} rotate={5}>
          <TiltCard className="rounded-full overflow-hidden border-4 border-brand-yellow shadow-glow w-48 h-48 mx-auto group">
            <img src={portrait} alt="Abdullah Qureshi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
          </TiltCard>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.1} x={i % 2 === 0 ? -20 : 20} rotate={i % 2 === 0 ? -2 : 2}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 15px 40px -10px rgba(255,215,0,0.12)" }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-5 rounded-xl bg-card border border-border shadow-card hover:border-brand-yellow/50 transition-colors h-full"
              >
                <motion.div whileHover={{ rotate: 20, scale: 1.2 }} transition={{ type: "spring" }}>
                  <it.icon className="text-brand-yellow" size={22}/>
                </motion.div>
                <h3 className="mt-2 font-display font-bold text-base text-foreground">{it.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{it.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}