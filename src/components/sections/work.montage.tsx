import m1 from "@/assets/montage-1.jpg";
import m2 from "@/assets/montage-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";



import { VIDEOS } from "@/lib/videoConfig";

const items: VideoItem[] = [
  { thumb: m1, title: VIDEOS.montage[0]?.title, driveId: VIDEOS.montage[0]?.id },
  { thumb: m2, title: VIDEOS.montage[1]?.title, driveId: VIDEOS.montage[1]?.id },
];

export function MontagePage() {
  return (
    <>
      <PageHero eyebrow="Montage Reels" title="Brand & lifestyle montages." subtitle="Restaurant features, sports and brand edits with sharp pacing." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={4} aspect="square"/>
      </section>
    </>
  );
}