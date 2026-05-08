import w1 from "@/assets/wedding-1.jpg";
import w2 from "@/assets/wedding-2.jpg";
import { PageHero } from "@/components/site/PageHero";
import { VideoGrid, type VideoItem } from "@/components/site/VideoGrid";



// Replace `src` with Google Drive preview URLs (https://drive.google.com/file/d/<ID>/preview) or direct MP4s.
const items: VideoItem[] = [
  { thumb: w1, title: "FSW Presents — Wedding Film" },
  { thumb: w2, title: "Cinematic Wedding Reel" },
];

export function WeddingsPage() {
  return (
    <>
      <PageHero eyebrow="Weddings" title="Selected wedding films." subtitle="Cinematic, emotional and timeless edits." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <VideoGrid items={items} cols={2} aspect="video"/>
      </section>
    </>
  );
}