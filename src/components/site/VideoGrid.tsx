import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TiltCard } from "@/components/site/TiltCard";
import { DriveVideoPlayer } from "@/components/ui/drive-video-player";
import { useIsMobile } from "@/hooks/useIsMobile";

export type VideoItem = {
  thumb: string;
  fallbackThumb?: string;
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

// cards rise in one after another (flat: opacity and a short lift only, which the GPU does on its own)
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─── Inline preview card with autoplay-on-scroll ─── */
function VideoCard({
  item,
  index,
  aspectClass,
  onOpen,
  isMobile,
}: {
  item: VideoItem;
  index: number;
  aspectClass: string;
  onOpen: () => void;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

    const hasDirectSrc = !!item.src && !item.src.includes("drive.google.com");

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // the clip previews while the mouse is on the card (not every card at once: keeps the page light)
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !hasDirectSrc) return;
    if (isVisible && hover) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isVisible, hover, videoReady, hasDirectSrc]);

  const previewActive = isVisible && hover && hasDirectSrc && videoReady;

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
    >
      <TiltCard intensity={8} className="cursor-pointer">
        <motion.button
          onClick={onOpen}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`group relative w-full ${aspectClass} rounded-xl overflow-hidden bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-colors`}
        >
          {/* Thumbnail */}
          <img
            src={item.thumb}
            alt={item.title ?? `Project ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              previewActive ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
            onError={(e) => {
              if (
                item.fallbackThumb &&
                !e.currentTarget.src.includes(item.fallbackThumb)
              ) {
                e.currentTarget.src = item.fallbackThumb;
              } else {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%2318181b'/%3E%3Cpath d='M40 35 L65 50 L40 65 Z' fill='%233f3f46'/%3E%3C/svg%3E";
              }
            }}
          />

          {/* Direct MP4 inline preview — desktop only */}
          {hasDirectSrc && !videoError && !isMobile && (
            <video
              ref={videoRef}
              src={item.src}
              muted
              loop
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
              preload={hover ? "auto" : "none"}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                previewActive ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/90 via-transparent to-transparent pointer-events-none" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.span
              initial={{ scale: 0.5 }}
              className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center"
            >
              <Play
                className="text-primary-foreground ml-0.5"
                size={20}
                fill="currentColor"
              />
            </motion.span>
          </div>

          {/* Live preview badge */}
          {previewActive && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[11px] text-white/80 font-medium">
                Preview
              </span>
            </div>
          )}

          {item.title && (
            <p className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold text-foreground line-clamp-2 z-10">
              {item.title}
            </p>
          )}
        </motion.button>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Lightbox ─── */
// The video floats over the page (dimmed and blurred behind it) in its own shape: no black bars at the sides.
// Click anywhere outside the video, or press Escape, to close it.
function Lightbox({
  item,
  aspect,
  onClose,
}: {
  item: VideoItem;
  aspect: "video" | "portrait" | "square";
  onClose: () => void;
}) {
  const [ratio, setRatio] = useState(aspect === "portrait" ? 9 / 16 : aspect === "square" ? 1 : 16 / 9);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const local = item.src && !item.src.includes("drive.google.com");
  // the box takes the video's own shape and fits inside the screen with a margin
  const box = { width: `min(92vw, calc((100dvh - 7rem) * ${ratio}))`, aspectRatio: String(ratio) };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08060f]/70 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-label={item.title ?? "Video"}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute right-4 top-4 z-[110] grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={box}
          className="relative overflow-hidden rounded-[16px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
        >
          {local ? (
            <video
              src={item.src}
              poster={item.thumb}
              controls
              autoPlay
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
              onLoadedMetadata={(e) => { const v = e.currentTarget; if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight); }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : item.driveId ? (
            <DriveVideoPlayer
              fileId={item.driveId}
              controls
              containerClassName="absolute inset-0 w-full h-full"
              className="object-contain"
            />
          ) : (
            <img src={item.thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </motion.div>
        {item.title && (
          <p className="mt-4 max-w-[90vw] truncate text-center text-sm font-medium text-white/80" onClick={(e) => e.stopPropagation()}>
            {item.title}
          </p>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function VideoGrid({ items, cols = 3, aspect = "portrait" }: VideoGridProps) {
  const [active, setActive] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  // Mobile-first column classes:
  // - portrait/square with 3-4 cols → 2 cols on mobile, full on desktop
  // - video with 2 cols → 1 col on mobile, 2 on desktop
  const colClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-2 lg:grid-cols-3";

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
      ? "aspect-square"
      : "aspect-[9/16]";

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-30px" }}
        className={`grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 ${colClass}`}
      >
        {items.map((it, i) => (
          <VideoCard
            key={i}
            item={it}
            index={i}
            aspectClass={aspectClass}
            onOpen={() => setActive(i)}
            isMobile={isMobile}
          />
        ))}
      </motion.div>

      {/* Lightbox */}
      {typeof document !== "undefined" && active !== null && (
        <Lightbox
          item={items[active]}
          aspect={aspect}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}