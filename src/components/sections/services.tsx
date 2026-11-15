import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { MAIN_SERVICES } from "@/lib/services";

/** What I edit, one card per service; each opens its own page (those pages are what Google ranks for each kind of work). */
export function ServicesPage() {
  const [first, ...rest] = MAIN_SERVICES;
  return (
    <>
      <PageHero eyebrow="Services" title="What I can edit for you" subtitle="Specialized in AI video editing, for brands, creators and filmmakers worldwide" />
      <section className="mx-auto grid max-w-5xl gap-3 px-4 py-12 md:grid-cols-3 lg:px-8">
        <Link to="/services/$slug" params={{ slug: first.slug }} className="group flex flex-col gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-[#c9a6ff]/50 md:col-span-3 md:p-8">
          <p className="font-mono text-[13px] text-white/50">{first.nav}</p>
          <h3 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground [text-wrap:balance]">{first.h1}</h3>
          <p className="max-w-2xl text-white/60">{first.intro}</p>
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-brand-yellow">See how I work <ArrowUpRight size={16} strokeWidth={1.5} /></span>
        </Link>
        {rest.map((s) => (
          <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group flex flex-col gap-2 rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#c9a6ff]/50">
            <p className="font-mono text-[13px] text-white/50">{s.nav}</p>
            <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-foreground [text-wrap:balance]">{s.h1}</h3>
            <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-medium text-brand-yellow">Read more <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </Link>
        ))}
      </section>
    </>
  );
}
