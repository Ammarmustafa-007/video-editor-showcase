import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CASES } from "@/lib/cases";

/** Case studies on the home page: one wide card per project, each opens its own page. */
export function CaseStudiesPage() {
  return (
    <>
      <PageHero eyebrow="Case Studies" title="Projects, start to finish" subtitle="What the client needed, what got in the way, and what changed" />
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-12 lg:px-8">
        {CASES.map((c) => (
          <Link
            key={c.slug}
            to="/work/$slug"
            params={{ slug: c.slug }}
            className="group grid gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#c9a6ff]/50 hover:bg-white/[0.04] md:grid-cols-[1fr_auto] md:items-center md:p-8"
          >
            <div className="min-w-0">
              <p className="font-mono text-[13px] text-white/50">{c.client}{c.location ? ` · ${c.location}` : ""}{c.status ? ` · ${c.status}` : ""}</p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground [text-wrap:balance]">{c.title}</h3>
              <p className="mt-2 max-w-2xl text-white/60">{c.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.services.map((s) => <span key={s} className="rounded-[6px] border border-white/10 px-2 py-1 text-[12px] text-white/70">{s}</span>)}
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-yellow">
              Read the case study <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
