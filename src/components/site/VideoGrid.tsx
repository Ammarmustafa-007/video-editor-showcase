import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { TiltCard } from "@/components/site/TiltCard";
import { DriveVideoPlayer } from "@/components/ui/drive-video-player";
import { getDriveDirectLink } from "@/lib/videoConfig";

export type VideoItem = {
  thumb: string;
  title?: string;
  /** Direct MP4 URL or Google Drive preview URL (e.g. https://drive.google.com/file/d/<ID>/preview) */
  src?: string;
  driveId?: string;
};

type VideoGridProps = {
  items: VideoItem[];
  cols?: 2 | 3 | 4;
  aspect?: "video" | "portrait" | "square";
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 10 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Inline preview card with autoplay-on-scroll ─── */
function VideoCard({
  item,
  index,
  aspectClass,
  onOpen,
}: {
  item: VideoItem;
  index: number;
  aspectClass: string;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Get a playable video URL (direct MP4 or Google Drive direct link)
  const videoUrl = item.src ?? (item.driveId ? getDriveDirectLink(item.driveId) : "");

  // IntersectionObserver: start/stop video based on visibility
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play/pause based on visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isVisible) {
      vid.play().catch(() => {
        /* autoplay blocked — thumbnail stays visible */
      });
    } else {
      vid.pause();
    }
  }, [isVisible, videoReady]);

  return (
    <motion.div ref={cardRef} variants={itemVariants} style={{ transformStyle: "preserve-3d" }}>
      <TiltCard intensity={8} className="cursor-pointer">
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`group relative w-full ${aspectClass} rounded-xl overflow-hidden bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-all`}
        >
          {/* Thumbnail (always present as base layer) */}
          <img
            src={item.thumb}
            alt={item.title ?? `Project ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoReady && isVisible ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%2318181b'/%3E%3Cpath d='M40 35 L65 50 L40 65 Z' fill='%233f3f46'/%3E%3C/svg%3E";
            }}
          />

          {/* Inline video (loads in background, plays when scrolled into view) */}
          {videoUrl && !videoError && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlayThrough={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady && isVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/90 via-transparent to-transparent" />

          {/* Play button hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.span
              initial={{ scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center shadow-glow"
            >
              <Play className="text-primary-foreground ml-0.5" size={20} fill="currentColor" />
            </motion.span>
          </div>

          {/* Live indicator when video is playing */}
          {videoReady && isVisible && !videoError && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-wider text-white/80 font-semibold">Preview</span>
            </div>
          )}

          {item.title && (
            <p className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold text-foreground line-clamp-2">
              {item.title}
            </p>
          )}
        </motion.button>
      </TiltCard>
    </motion.div>
  );
}

export function VideoGrid({ items, cols = 3, aspect = "portrait" }: VideoGridProps) {
  const [active, setActive] = useState<number | null>(null);
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const aspectClass =
    aspect === "video" ? "aspect-video" : aspect === "square" ? "aspect-square" : "aspect-[9/16]";

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-30px" }}
        className={`grid gap-3 ${colClass}`}
        style={{ perspective: 800 }}
      >
        {items.map((it, i) => (
          <VideoCard
            key={i}
            item={it}
            index={i}
            aspectClass={aspectClass}
            onOpen={() => setActive(i)}
          />
        ))}
      </motion.div>

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
            {/* Screen-level Close Button */}
            <button
              onClick={() => setActive(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-[110] w-12 h-12 rounded-full bg-card/50 backdrop-blur-md border border-border text-foreground flex items-center justify-center hover:bg-brand-yellow hover:text-primary-foreground hover:scale-110 transition-all"
              aria-label="Close"
            >
              <X size={24}/>
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateX: -30, y: 80 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20, y: 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-xl overflow-hidden bg-card border border-border shadow-card"
              style={{ transformStyle: "preserve-3d" }}
            >

              {items[active].driveId ? (
                <DriveVideoPlayer fileId={items[active].driveId!} controls containerClassName="w-full aspect-video bg-black" />
              ) : items[active].src ? (
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
                <div className="aspect-video flex flex-col items-center justify-center bg-brand-navy-deep p-6 text-center">
                  <img src={items[active].thumb} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                  <div className="relative">
                    <Play className="text-brand-yellow mx-auto" size={40}/>
                    <p className="mt-3 font-display text-lg font-bold text-foreground">Video coming soon</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">Add a Google Drive preview URL or MP4 link to play here.</p>
                  </div>
                </div>
              )}
              {items[active].title && (
                <div className="p-4 border-t border-border">
                  <p className="font-display font-bold text-sm text-foreground">{items[active].title}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}