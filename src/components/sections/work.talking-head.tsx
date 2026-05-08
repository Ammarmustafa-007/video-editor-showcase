import t1 from "@/assets/talking-1.jpg";
import t2 from "@/assets/talking-2.jpg";
import t3 from "@/assets/talking-3.jpg";
import t4 from "@/assets/talking-4.jpg";
import t5 from "@/assets/talking-5.jpg";
import t6 from "@/assets/talking-6.jpg";
import t7 from "@/assets/talking-7.jpg";
import t8 from "@/assets/talking-8.jpg";
import t9 from "@/assets/talking-9.jpg";
import t10 from "@/assets/talking-10.jpg";
import t11 from "@/assets/talking-11.jpg";
import t12 from "@/assets/talking-12.jpg";
import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";



const items: VideoItem[] = [
  { thumb: t1 }, { thumb: t2 }, { thumb: t3 }, { thumb: t4 }, { thumb: t5 }, { thumb: t6 },
  { thumb: t7 }, { thumb: t8 }, { thumb: t9 }, { thumb: t10 }, { thumb: t11 }, { thumb: t12 },
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