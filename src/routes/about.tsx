import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Mail } from "lucide-react";
import portrait from "@/assets/portrait-about.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Abdullah Qureshi" },
      { name: "description", content: "Creative video editor specializing in storytelling and high-impact visuals using Adobe Premiere Pro." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Me" title="Storyteller behind the timeline." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
        <Reveal>
          <TiltCard className="rounded-3xl overflow-hidden shadow-card max-w-md">
            <img src={portrait} alt="Abdullah Qureshi" className="w-full h-auto block rounded-3xl" />
          </TiltCard>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Creative Video Editor specializing in storytelling and high-impact visuals. Experienced in
            <span className="text-brand-yellow font-semibold"> Adobe Premiere Pro</span>, creating engaging content
            for social media, commercials, and branded campaigns. Skilled in cinematic editing, smooth
            transitions, and delivering content that captures attention and drives results.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-yellow text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-[1.03] transition-transform">
              <Mail size={16}/> Hire Me
            </Link>
            <a href="#" className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:border-brand-yellow hover:text-brand-yellow transition-colors">
              <Download size={16}/> Download CV
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}