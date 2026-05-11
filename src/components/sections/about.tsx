import { Download, Mail } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-about.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Me" title="Storyteller behind the timeline." />
      <section className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-8 md:grid-cols-2 items-center">
        <Reveal x={-40} rotate={-3}>
          <TiltCard className="rounded-2xl overflow-hidden shadow-card max-w-sm p-4 bg-card">
            <div className="relative group overflow-hidden rounded-2xl w-full flex justify-center items-center">
              <img src={portrait} alt="Abdullah Qureshi" className="w-full max-w-[280px] h-auto object-contain block rounded-2xl group-hover:scale-105 transition-transform duration-700" />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.15} x={40}>
          <p className="text-base text-muted-foreground leading-relaxed">
            Creative Video Editor specializing in storytelling and high-impact visuals. Experienced in
            <span className="text-brand-yellow font-semibold"> Adobe Premiere Pro</span>, creating engaging content
            for social media, commercials, and branded campaigns. Skilled in cinematic editing, smooth
            transitions, and delivering content that captures attention and drives results.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,215,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-brand-yellow/10 backdrop-blur-md border border-brand-yellow/50 text-brand-yellow font-semibold px-5 py-2.5 rounded-full shadow-glow text-sm"
            >
              <Mail size={14}/> Hire Me
            </motion.button>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, borderColor: "rgba(255,215,0,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-foreground font-semibold px-5 py-2.5 rounded-full transition-all text-sm hover:bg-white/10"
            >
              <Download size={14}/> Download CV
            </motion.a>
          </div>
        </Reveal>
      </section>
    </>
  );
}