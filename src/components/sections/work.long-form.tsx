import l1 from "@/assets/long-1.jpg";
import l2 from "@/assets/long-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";



import { VIDEOS } from "@/lib/videoConfig";

const items: VideoItem[] = [
  { thumb: l2, title: VIDEOS.longForm[0]?.title, driveId: VIDEOS.longForm[0]?.id },
  { thumb: l1, title: VIDEOS.longForm[1]?.title, driveId: VIDEOS.longForm[1]?.id },
];

export function LongFormPage() {
  return (
    <>
      <PageHero eyebrow="Long Form" title="Long-form storytelling." subtitle="Documentary, brand films and deep-dive edits." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={2} aspect="video"/>
      </section>
    </>
  );
}