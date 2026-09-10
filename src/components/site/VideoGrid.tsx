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

  const hasDriveId = !!item.driveId;
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

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !hasDirectSrc) return;
    if (isVisible) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isVisible, videoReady, hasDirectSrc]);

  const previewActive =
    isVisible &&
    ((hasDriveId && videoReady) || (hasDirectSrc && videoReady));

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      style={{ transformStyle: "preserve-3d" }}
    >
      <TiltCard intensity={8} className="cursor-pointer">
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`group relative w-full ${aspectClass} rounded-xl overflow-hidden bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-all`}
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
              preload="metadata"
              onCanPlayThrough={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady && isVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/90 via-transparent to-transparent pointer-events-none" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.span
              initial={{ scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center shadow-glow"
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
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-wider text-white/80 font-semibold">
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
function Lightbox({
  item,
  aspect,
  onClose,
}: {
  item: VideoItem;
  aspect: "video" | "portrait" | "square";
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-3 right-3 md:top-6 md:right-6 z-[110] w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-500/80 hover:border-red-500 hover:scale-110 active:scale-95 transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title at top on mobile */}
        {item.title && (
          <div className="absolute top-3 left-3 right-14 md:hidden z-[100]">
            <p className="font-display font-bold text-sm text-white/80 truncate">
              {item.title}
            </p>
          </div>
        )}

        {/*
          Video container:
          - Mobile: nearly full screen (inset-2 equivalent) — no aspect ratio forced.
            The video/iframe fills as much as possible, object-contain keeps proportions.
          - Desktop: centered with proper aspect ratio constraint.
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={isMobile
            ? "absolute inset-2 top-12 bottom-8 rounded-lg overflow-hidden bg-black"
            : `relative overflow-hidden rounded-xl bg-black shadow-2xl ${getDesktopSize(aspect)}`
          }
        >
          {item.driveId ? (
            <DriveVideoPlayer
              fileId={item.driveId}
              controls
              containerClassName="absolute inset-0 w-full h-full"
              className="object-contain"
            />
          ) : item.src ? (
            <video
              src={item.src}
              controls
              autoPlay
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-navy-deep p-6 text-center">
              <img
                src={item.thumb}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative">
                <Play className="text-brand-yellow mx-auto" size={40} />
                <p className="mt-3 font-display text-lg font-bold text-foreground">
                  Video coming soon
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Add a Google Drive preview URL or MP4 link to play here.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Title below video — desktop only */}
        {item.title && (
          <p className="hidden md:block mt-4 font-display font-bold text-base text-white/90 text-center">
            {item.title}
          </p>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/** Desktop-only sizing with aspect ratio constraints */
function getDesktopSize(aspect: "video" | "portrait" | "square") {
  switch (aspect) {
    case "portrait":
      return "w-[35vw] max-w-[450px] aspect-[9/16]";
    case "square":
      return "w-[45vw] max-w-[600px] aspect-square";
    case "video":
    default:
      return "w-[75vw] max-w-[1000px] aspect-video";
  }
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
        style={{ perspective: 800 }}
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