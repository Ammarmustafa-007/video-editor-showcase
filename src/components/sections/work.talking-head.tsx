import t1 from "@/assets/talking-1.jpg";
import t2 from "@/assets/talking-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";



import { VIDEOS } from "@/lib/videoConfig";

const items: VideoItem[] = [
  { thumb: t1, title: VIDEOS.talkingHead[0]?.title, driveId: VIDEOS.talkingHead[0]?.id }, 
  { thumb: t2, title: VIDEOS.talkingHead[1]?.title, driveId: VIDEOS.talkingHead[1]?.id }, 
];

export function TalkingHeadPage() {
  return (
    <>
      <PageHero eyebrow="Talking Head Reels" title="Short-form that converts." subtitle="Punchy edits, subtitles and motion designed to hold attention." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={4} aspect="portrait"/>
      </section>
    </>
  );
}