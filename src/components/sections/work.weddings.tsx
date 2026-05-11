import w1 from "@/assets/wedding-1.jpg";
import w2 from "@/assets/wedding-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";

import { VIDEOS, getDriveThumbnail } from "@/lib/videoConfig";

const items: VideoItem[] = VIDEOS.weddings.map((v, i) => ({
  thumb: getDriveThumbnail(v.id),
  fallbackThumb: i % 2 === 0 ? w1 : w2,
  title: v.title,
  driveId: v.id,
}));

export function WeddingsPage() {
  return (
    <>
      <PageHero eyebrow="Weddings" title="Selected wedding Projects." subtitle="Cinematic, emotional and timeless edits." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={2} aspect="video"/>
      </section>
    </>
  );
}