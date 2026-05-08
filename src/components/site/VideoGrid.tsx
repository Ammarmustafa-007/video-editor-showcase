import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { TiltCard } from "@/components/site/TiltCard";
import { Reveal } from "@/components/site/Reveal";

export type VideoItem = {
  thumb: string;
  title?: string;
  /** Direct MP4 URL or Google Drive preview URL (e.g. https://drive.google.com/file/d/<ID>/preview) */
  src?: string;
};

type VideoGridProps = {
  items: VideoItem[];
  cols?: 2 | 3 | 4;
  aspect?: "video" | "portrait" | "square";
};

export function VideoGrid({ items, cols = 3, aspect = "portrait" }: VideoGridProps) {
  const [active, setActive] = useState<number | null>(null);
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const aspectClass =
    aspect === "video" ? "aspect-video" : aspect === "square" ? "aspect-square" : "aspect-[9/16]";

  return (
    <>
      <div className={`grid gap-5 ${colClass}`}>
        {items.map((it, i) => (
          <Reveal key={i} delay={(i % 6) * 0.05}>
            <TiltCard intensity={10} className="cursor-pointer">
              <button
                onClick={() => setActive(i)}
                className={`group relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-all`}
              >
                <img
                  src={it.thumb}
                  alt={it.title ?? `Project ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/90 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center shadow-glow">
                    <Play className="text-primary-foreground ml-1" size={24} fill="currentColor"/>
                  </span>
                </div>
                {it.title && (
                  <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-foreground line-clamp-2">
                    {it.title}
                  </p>
                )}
              </button>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* 3D popup lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-navy-deep/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActive(null)}
            style={{ perspective: 1200 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotateX: -25, y: 60 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateX: 15, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-card border border-border shadow-card"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-brand-navy-deep/80 text-foreground flex items-center justify-center hover:bg-brand-yellow hover:text-primary-foreground transition-colors"
                aria-label="Close"
              >
                <X size={18}/>
              </button>
              {items[active].src ? (
                items[active].src!.includes("drive.google.com") ? (
                  <iframe
                    src={items[active].src}
                    allow="autoplay"
                    allowFullScreen
                    className="w-full aspect-video bg-black"
                  />
                ) : (
                  <video
                    src={items[active].src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full aspect-video bg-black"
                  />
                )
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center bg-brand-navy-deep p-8 text-center">
                  <img src={items[active].thumb} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                  <div className="relative">
                    <Play className="text-brand-yellow mx-auto" size={48}/>
                    <p className="mt-4 font-display text-xl font-bold text-foreground">Video coming soon</p>
                    <p className="mt-2 text-sm text-muted-foreground">Add a Google Drive preview URL or MP4 link to play here.</p>
                  </div>
                </div>
              )}
              {items[active].title && (
                <div className="p-5 border-t border-border">
                  <p className="font-display font-bold text-foreground">{items[active].title}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}