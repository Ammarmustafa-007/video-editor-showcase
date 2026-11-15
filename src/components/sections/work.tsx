import w1 from "@/assets/wedding-1.jpg";
import w2 from "@/assets/wedding-2.jpg";
import t1 from "@/assets/talking-1.jpg";
import t2 from "@/assets/talking-2.jpg";
import m1 from "@/assets/montage-1.jpg";
import m2 from "@/assets/montage-2.jpg";

import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";
import { getDriveThumbnail, type WorkSection } from "@/lib/videoConfig";

const LAYOUT = {
  wide: { cols: 2, aspect: "video", fallback: [w1, w2] },
  reels: { cols: 4, aspect: "portrait", fallback: [t1, t2] },
  square: { cols: 3, aspect: "square", fallback: [m1, m2] },
} as const;

/** One section of work (weddings, reels, long form, or any section added from the portal). */
export function WorkPage({ section }: { section: WorkSection }) {
  const l = LAYOUT[section.layout] ?? LAYOUT.wide;
  const items: VideoItem[] = section.videos.map((v, i) => ({
    thumb: getDriveThumbnail(v.id),
    fallbackThumb: l.fallback[i % 2],
    title: v.title,
    driveId: v.id,
  }));
  return (
    <>
      <PageHero eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={l.cols} aspect={l.aspect} />
      </section>
    </>
  );
}
