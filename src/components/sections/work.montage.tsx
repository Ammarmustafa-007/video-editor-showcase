import m1 from "@/assets/montage-1.jpg";
import m2 from "@/assets/montage-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";

import { VIDEOS, getDriveThumbnail } from "@/lib/videoConfig";

const items: VideoItem[] = VIDEOS.montage.map((v, i) => ({
  thumb: getDriveThumbnail(v.id),
  fallbackThumb: i % 2 === 0 ? m1 : m2,
  title: v.title,
  driveId: v.id,
}));

export function MontagePage() {
  return (
    <>
      <PageHero eyebrow="Montage Reels" title="Brand & lifestyle montages." subtitle="Restaurant features, sports and brand edits with sharp pacing." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={3} aspect="square" />
      </section>
    </>
  );
}