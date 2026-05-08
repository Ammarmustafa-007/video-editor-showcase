import { createFileRoute } from "@tanstack/react-router";
import l1 from "@/assets/long-1.jpg";
import l2 from "@/assets/long-2.jpg";
import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";

export const Route = createFileRoute("/work/long-form")({
  head: () => ({
    meta: [
      { title: "Long Form — Showreel" },
      { name: "description", content: "Long-form video edits, documentaries and branded stories." },
    ],
  }),
  component: LongFormPage,
});

const items: VideoItem[] = [
  { thumb: l2, title: "Everyone talks about moving fast and..." },
  { thumb: l1, title: "Najam Knowledge — We pay for school" },
];

function LongFormPage() {
  return (
    <>
      <PageHero eyebrow="Long Form" title="Long-form storytelling." subtitle="Documentary, brand films and deep-dive edits." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={2} aspect="video"/>
      </section>
    </>
  );
}