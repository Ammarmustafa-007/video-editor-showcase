import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { StarField } from "@/components/site/StarField";
import { ChatWidget } from "@/components/site/ChatWidget";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";
import { caseBySlug, type CaseStudy } from "@/lib/cases";
import { asset, getDriveThumbnail } from "@/lib/videoConfig";
import site from "@/content/site.json";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const c = caseBySlug(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.client} case study: ${loaderData.title} | ${site.hero.first} ${site.hero.last}`.slice(0, 90) }, { name: "description", content: loaderData.summary }] : [],
  }),
  component: CasePage,
});

function Block({ n, title, items }: { n: string; title: string; items: string[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className="grid gap-4 border-t border-white/[0.08] py-10 md:grid-cols-[200px_1fr]"
    >
      <p className="font-mono text-[13px] text-white/50"><span className="text-brand-yellow">{n}</span>&nbsp;&nbsp;{title}</p>
      <ul className="flex flex-col gap-3">
        {items.map((t) => (
          <li key={t} className="max-w-2xl text-base md:text-lg leading-relaxed text-white/80">{t}</li>
        ))}
      </ul>
    </motion.section>
  );
}

function CasePage() {
  const c: CaseStudy = Route.useLoaderData();
  const items: VideoItem[] = c.videos.map((v) => ({
    thumb: v.poster ? asset(v.poster) : getDriveThumbnail(v.id),
    title: v.title,
    src: v.file ? asset(v.file) : undefined,
    driveId: v.id,
  }));
  return (
    <>
      <StarField />
      <ChatWidget />
      <article className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-28 md:px-8">
        <Link to="/" hash="case-studies" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={16} strokeWidth={1.5} /> All work
        </Link>
        <p className="mt-10 font-mono text-[13px] text-white/50">
          <span className="text-brand-yellow">Case study</span>&nbsp;&nbsp;{c.client}{c.location ? ` · ${c.location}` : ""}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl font-medium leading-[1.04] tracking-[-0.03em] text-foreground [text-wrap:balance]">{c.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">{c.summary}</p>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div><dt className="text-[13px] text-white/50">Client</dt><dd className="mt-1 text-foreground">{c.client}</dd></div>
          {c.location && <div><dt className="text-[13px] text-white/50">Where</dt><dd className="mt-1 text-foreground">{c.location}, remote</dd></div>}
          <div className="col-span-2"><dt className="text-[13px] text-white/50">What I did</dt><dd className="mt-1 text-foreground">{c.services.join(", ")}</dd></div>
        </dl>
        <div className="mt-16">
          <Block n="01" title="The problem" items={c.challenge} />
          <Block n="02" title="What we did" items={c.approach} />
          <Block n="03" title="What happened" items={c.results} />
        </div>
        {items.length > 0 && (
          <section className="mt-12">
            <p className="mb-6 font-mono text-[13px] text-white/50">Edits from this project</p>
            <VideoGrid items={items} cols={3} aspect="portrait" />
          </section>
        )}
        <div className="mt-20 flex flex-col items-start gap-4 rounded-[20px] border border-white/[0.08] bg-[#120d22]/70 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <p className="font-display text-xl md:text-2xl font-medium text-foreground">Want results like this for your brand?</p>
            <p className="mt-1 text-white/60">Tell me about your page and your footage.</p>
          </div>
          <a href={site.links.call} target="_blank" rel="noreferrer" className="md:ml-auto inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-yellow px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#d9c2ff]">
            <CalendarDays size={16} strokeWidth={1.5} /> Book a 30-minute call <ArrowUpRight size={16} strokeWidth={1.5} />
          </a>
        </div>
      </article>
    </>
  );
}
