import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronDown } from "lucide-react";
import { StarField } from "@/components/site/StarField";
import { ChatWidget } from "@/components/site/ChatWidget";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";
import { MAIN_SERVICES, serviceBySlug, type Service } from "@/lib/services";
import { CASES } from "@/lib/cases";
import { WORK, asset, getDriveThumbnail } from "@/lib/videoConfig";
import site from "@/content/site.json";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = serviceBySlug(params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.title} | ${site.hero.first} ${site.hero.last}` }, { name: "description", content: loaderData.intro.slice(0, 158) }] : [],
  }),
  component: ServicePage,
});

const rise = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  style: { transformPerspective: 1200 },
};

function ServicePage() {
  const s: Service = Route.useLoaderData();
  const pool = s.sections.flatMap((id) => WORK.find((w) => w.id === id)?.videos ?? []);
  const reels = s.sections[0] && WORK.find((w) => w.id === s.sections[0])?.layout === "reels";
  const items: VideoItem[] = (s.group === "region" ? s.sections.flatMap((id) => (WORK.find((w) => w.id === id)?.videos ?? []).slice(0, 2)) : pool).slice(0, reels ? 8 : 6).map((v) => ({
    thumb: v.poster ? asset(v.poster) : getDriveThumbnail(v.id),
    title: v.title,
    src: v.file ? asset(v.file) : undefined,
    driveId: v.id,
  }));
  const cases = ["video-editor", "commercial-video-editor", "short-form-video-editor", "video-editor-uae-gulf"].includes(s.slug) ? CASES : [];

  return (
    <>
      <StarField />
      <ChatWidget />
      <article className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-28 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={16} strokeWidth={1.5} /> {site.hero.first} {site.hero.last}
        </Link>
        <p className="mt-10 font-mono text-[13px] text-white/50"><span className="text-brand-yellow">Service</span>&nbsp;&nbsp;{s.nav}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl md:text-6xl font-medium leading-[1.04] tracking-[-0.03em] text-foreground [text-wrap:balance]">{s.h1}</h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">{s.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.links.call} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-yellow px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#d9c2ff]">
            <CalendarDays size={16} strokeWidth={1.5} /> Book a 30-minute call
          </a>
          <a href="#work" className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08]">See the work</a>
        </div>
        <dl className="mt-10 flex flex-wrap gap-8">
          {site.hero.stats.map((st) => (
            <div key={st.label}><dd className="font-display text-3xl font-medium tabular-nums text-foreground">{st.value}</dd><dt className="text-[13px] text-white/50">{st.label}</dt></div>
          ))}
        </dl>

        <motion.section {...rise} className="mt-16 grid gap-6 border-t border-white/[0.08] pt-10 md:grid-cols-[220px_1fr]">
          <h2 className="font-mono text-[13px] font-normal text-white/50">What you get</h2>
          <ul className="flex flex-col gap-3">
            {s.points.map((p) => (
              <li key={p} className="flex gap-3 text-base md:text-lg text-white/80"><Check size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-brand-yellow" />{p}</li>
            ))}
          </ul>
        </motion.section>

        {items.length > 0 && (
          <section id="work" className="mt-16 scroll-mt-24">
            <h2 className="mb-6 font-display text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground">Recent {s.nav.toLowerCase()} work</h2>
            <VideoGrid items={items} cols={reels ? 4 : 3} aspect={reels ? "portrait" : "video"} />
          </section>
        )}

        <motion.section {...rise} className="mt-16 grid gap-6 border-t border-white/[0.08] pt-10 md:grid-cols-[220px_1fr]">
          <h2 className="font-mono text-[13px] font-normal text-white/50">How it works</h2>
          <ol className="flex flex-col gap-4">
            {s.process.map((p, i) => (
              <li key={p} className="flex gap-4 text-base md:text-lg text-white/80"><span className="font-mono text-sm text-brand-yellow tabular-nums">{String(i + 1).padStart(2, "0")}</span>{p}</li>
            ))}
          </ol>
        </motion.section>

        {cases.length > 0 && (
          <motion.section {...rise} className="mt-16 border-t border-white/[0.08] pt-10">
            <h2 className="mb-4 font-mono text-[13px] font-normal text-white/50">Case study</h2>
            {cases.slice(0, 2).map((c) => (
              <Link key={c.slug} to="/work/$slug" params={{ slug: c.slug }} className="group flex items-center gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-[#c9a6ff]/50">
                <div className="min-w-0"><p className="text-[13px] text-white/50">{c.client}{c.location ? ` · ${c.location}` : ""}</p><p className="font-display text-xl font-medium text-foreground">{c.title}</p></div>
                <ArrowUpRight size={18} strokeWidth={1.5} className="ml-auto shrink-0 text-brand-yellow" />
              </Link>
            ))}
          </motion.section>
        )}

        <motion.section {...rise} className="mt-16 border-t border-white/[0.08] pt-10">
          <h2 className="mb-6 font-display text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground">Questions</h2>
          <div className="flex flex-col gap-2">
            {s.faq.map(([q, a]) => (
              <details key={q} className="group rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-5 py-4 open:bg-white/[0.04]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">{q}<ChevronDown size={18} strokeWidth={1.5} className="shrink-0 text-white/50 transition-transform group-open:rotate-180" /></summary>
                <p className="mt-3 max-w-2xl text-white/70">{a}</p>
              </details>
            ))}
          </div>
        </motion.section>

        <section className="mt-16 border-t border-white/[0.08] pt-10">
          <h2 className="mb-4 font-mono text-[13px] font-normal text-white/50">Other services</h2>
          <div className="flex flex-wrap gap-2">
            {MAIN_SERVICES.filter((x) => x.slug !== s.slug).map((x) => (
              <Link key={x.slug} to="/services/$slug" params={{ slug: x.slug }} className="rounded-[10px] border border-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#c9a6ff]/60 hover:text-white">{x.nav}</Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
