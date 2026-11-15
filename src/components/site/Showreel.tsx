import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import site from "@/content/site.json";
import { timecodeFor } from "@/lib/sections";
import { asset } from "@/lib/videoConfig";

/**
 * The 70-second intro, standing in the page like a phone held up to the camera. It plays muted while it's on screen;
 * "Play with sound" restarts it from the top with audio. The phone leans toward the mouse and straightens as you
 * scroll it into view.
 */
export function Showreel() {
  const reel = site.showreel;
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "center center"] });
  const lean = useTransform(scrollYProgress, (v) => (reduced ? 0 : 28 * (1 - Math.min(1, v))));
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const rotateX = useTransform([lean, rx] as never, ([a, b]: number[]) => a + b);

  // play only while on screen
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !paused) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [paused]);

  const withSound = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setPaused(false);
    v.play().catch(() => {});
  };
  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <section ref={section} id="showreel" aria-label="Showreel" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 lg:px-12">
        <div
          className="relative mx-auto w-[min(78vw,340px)]"
          style={{ perspective: 1100 }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
        >
          <motion.div style={{ rotateX, rotateY: ry, transformStyle: "preserve-3d", transformOrigin: "50% 100%" }} className="relative">
            {/* the phone */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-black p-2 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]">
              <div className="relative overflow-hidden rounded-[28px]">
                <video
                  ref={video}
                  src={asset(reel.src)}
                  poster={asset(reel.poster)}
                  muted={muted}
                  loop
                  playsInline
                  preload="metadata"
                  className="block aspect-[9/16] w-full bg-black object-cover"
                  aria-label={reel.title}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3 font-mono text-[11px] text-white/80">
                  <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-[#ff5c8a]" />REC</span>
                  <span>{reel.length}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                  <button type="button" onClick={togglePlay} aria-label={paused ? "Play" : "Pause"} className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70">
                    {paused ? <Play size={16} strokeWidth={1.5} /> : <Pause size={16} strokeWidth={1.5} />}
                  </button>
                  <button type="button" onClick={toggleMute} aria-label={muted ? "Sound on" : "Sound off"} className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70">
                    {muted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </div>
            {/* the phone's reflection on the floor */}
            <div aria-hidden className="absolute -bottom-10 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(120,80,230,0.4),transparent)]" />
          </motion.div>
        </div>

        <div className="text-center md:text-left">
          <p className="mb-4 font-mono text-[13px] text-white/50">
            <span className="text-brand-yellow">{timecodeFor("Showreel")}:00</span>&nbsp;&nbsp;Showreel
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium leading-[1.08] tracking-[-0.025em] text-foreground [text-wrap:balance]">{reel.title}</h2>
          <p className="mt-4 max-w-md text-base md:text-lg text-white/60 md:mx-0 mx-auto">{reel.text}</p>
          <button
            type="button"
            onClick={withSound}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-yellow px-5 text-sm font-medium text-primary-foreground transition-[transform,background-color] duration-150 hover:bg-[#d9c2ff] active:scale-[0.98]"
          >
            <Volume2 size={16} strokeWidth={1.5} /> Play with sound
          </button>
        </div>
      </div>
    </section>
  );
}
