import { createFileRoute } from "@tanstack/react-router";
import m1 from "@/assets/montage-1.jpg";
import m2 from "@/assets/montage-2.jpg";
import m3 from "@/assets/montage-3.jpg";
import m4 from "@/assets/montage-4.jpg";
import m5 from "@/assets/montage-5.jpg";
import m6 from "@/assets/montage-6.jpg";
import m7 from "@/assets/montage-7.jpg";
import m8 from "@/assets/montage-8.jpg";
import m9 from "@/assets/montage-9.jpg";
import m10 from "@/assets/montage-10.jpg";
import m11 from "@/assets/montage-11.jpg";
import m12 from "@/assets/montage-12.jpg";
import m13 from "@/assets/montage-13.jpg";
import m14 from "@/assets/montage-14.jpg";
import m15 from "@/assets/montage-15.jpg";
import m16 from "@/assets/montage-16.jpg";
import m17 from "@/assets/montage-17.jpg";
import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";

export const Route = createFileRoute("/work/montage")({
  head: () => ({
    meta: [
      { title: "Montage Reels — Showreel" },
      { name: "description", content: "Restaurant, sports and brand montage edits with sharp pacing." },
    ],
  }),
  component: MontagePage,
});

const items: VideoItem[] = [m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16,m17].map((thumb) => ({ thumb }));

function MontagePage() {
  return (
    <>
      <PageHero eyebrow="Montage Reels" title="Brand & lifestyle montages." subtitle="Restaurant features, sports and brand edits with sharp pacing." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={4} aspect="square"/>
      </section>
    </>
  );
}