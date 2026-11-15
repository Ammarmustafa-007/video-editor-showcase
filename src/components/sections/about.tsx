import { Download, Mail } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-about.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { HoloPortrait } from "@/components/site/HoloPortrait";

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Me" title="Storyteller behind the timeline" />
      <section className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-8 md:grid-cols-2 items-center">
        <Reveal y={12}>
          <HoloPortrait src={portrait} alt="Abdullah Qureshi" className="h-64 w-64 md:h-72 md:w-72 my-6" />
        </Reveal>
        <Reveal delay={0.08} y={12}>
          <p className="text-base text-muted-foreground leading-relaxed">
            Creative Video Editor Abdullah Qureshi specializing in storytelling and high-impact visuals. Experienced in
            <span className="text-brand-yellow font-semibold"> Adobe Premiere Pro</span>, creating engaging content
            for social media, commercials, and branded campaigns. Skilled in cinematic editing, smooth
            transitions, and delivering content that captures attention and drives results.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.a
              href="https://wa.me/+923003322338?text=Hello"
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-yellow px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#d9c2ff]"
            >
              <Mail size={16} strokeWidth={1.5}/> Hire me
            </motion.a>
            <motion.a
              href="https://drive.google.com/uc?export=download&id=1YN8cMRe_BasHMTezEF3rmvzcGKcnhnvJ"
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08]"
            >
              <Download size={16} strokeWidth={1.5}/> Download CV
            </motion.a>
          </div>
        </Reveal>
      </section>
    </>
  );
}