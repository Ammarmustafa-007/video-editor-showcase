import { useEffect, useRef, useState, type RefObject } from "react";
import { WORK } from "@/lib/videoConfig";

/**
 * The opening of the home page: the site assembles itself like a project being built.
 *
 *  1. Layout guides draw across the screen (a 12-column grid, like guides in an editor).
 *  2. Wireframe boxes appear where each hero block will sit, each tagged like a layer in a timeline.
 *  3. Pixels lift off the whole page and stream into the hologram box, where the 3D bust takes over.
 *  4. A small build log in the corner counts frames up to "ready", then everything fades and the real page remains.
 *
 * Hero blocks opt in with `data-build="label"`. Nothing here is interactive (pointer-events: none) and it removes
 * itself after ~3 s. Skipped entirely for people who prefer reduced motion.
 */

const TOTAL = 3200; // ms until the overlay is gone
const LOG = [
  ["00:00:00:04", "layout", "12-col grid"],
  ["00:00:00:12", "type", "Montserrat, Inter"],
  ["00:00:00:21", "hologram", "compiling points"],
  ["00:00:01:02", "media", `showreel, ${WORK.reduce((n, w) => n + w.videos.length, 0)} clips`],
  ["00:00:01:14", "render", "ready"],
] as const;

type Box = { label: string; x: number; y: number; w: number; h: number; delay: number };

export function BuildIntro({ slot }: { slot: RefObject<HTMLDivElement | null> }) {
  const [on, setOn] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [line, setLine] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);

  // measure the blocks the page is about to show
  useEffect(() => {
    if (!on) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    const b: Box[] = els.map((el, i) => {
      const r = el.getBoundingClientRect();
      return { label: el.dataset.build || "", x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12, delay: 0.35 + i * 0.12 };
    });
    const s = slot.current?.getBoundingClientRect();
    if (s) b.push({ label: "hologram.render", x: s.left + s.width * 0.12, y: s.top + 8, w: s.width * 0.76, h: s.height - 16, delay: 0.3 });
    setBoxes(b);
    const steps = LOG.map((_, i) => setTimeout(() => setLine(i + 1), 250 + i * 380));
    const end = setTimeout(() => setOn(false), TOTAL);
    return () => { steps.forEach(clearTimeout); clearTimeout(end); };
  }, [on, slot]);

  // pixels from the whole page flying into the hologram
  useEffect(() => {
    if (!on) return;
    const c = canvas.current;
    const s = slot.current?.getBoundingClientRect();
    if (!c || !s) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const N = W < 768 ? 420 : 1100;
    const cx = s.left + s.width / 2, cy = s.top + s.height * 0.42;
    const colors = ["#c9a6ff", "#a983ff", "#7fd8ff", "#f3eaff", "#ff8ad8"];
    const P = Array.from({ length: N }, () => {
      // start anywhere on the page, a little more often near the edges
      const edge = Math.random() < 0.35;
      const sx = edge ? (Math.random() < 0.5 ? Math.random() * W * 0.15 : W - Math.random() * W * 0.15) : Math.random() * W;
      const sy = Math.random() * H;
      // land somewhere inside the bust's outline (an ellipse over the head and shoulders)
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random());
      const tx = cx + Math.cos(a) * r * s.width * 0.3, ty = cy + Math.sin(a) * r * s.height * 0.36;
      // curve sideways a little on the way in
      const mx = (sx + tx) / 2 + (Math.random() - 0.5) * 260, my = (sy + ty) / 2 + (Math.random() - 0.5) * 200;
      return { sx, sy, mx, my, tx, ty, d: 0.15 + Math.random() * 1.2, dur: 0.9 + Math.random() * 0.8, sz: 1 + Math.random() * 1.8, col: colors[(Math.random() * colors.length) | 0], px: sx, py: sy };
    });
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      let alive = 0;
      for (const p of P) {
        const k = (t - p.d) / p.dur;
        if (k < 0 || k > 1) continue;
        alive++;
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const u = 1 - e;
        const x = u * u * p.sx + 2 * u * e * p.mx + e * e * p.tx;
        const y = u * u * p.sy + 2 * u * e * p.my + e * e * p.ty;
        const alpha = Math.min(1, k * 5) * (1 - Math.max(0, (k - 0.75) / 0.25));
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = p.col;
        ctx.lineWidth = p.sz * 0.6;
        // a short streak behind the pixel, never longer than 14px whatever the frame rate
        const dx = x - p.px, dy = y - p.py, len = Math.hypot(dx, dy) || 1, k2 = Math.min(1, 14 / len);
        ctx.beginPath(); ctx.moveTo(x - dx * k2, y - dy * k2); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = p.col;
        ctx.fillRect(x - p.sz / 2, y - p.sz / 2, p.sz, p.sz);
        p.px = x; p.py = y;
      }
      if (alive || t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [on, slot]);

  if (!on) return null;
  const cols = Array.from({ length: 13 }, (_, i) => i);
  return (
    <div aria-hidden className="build-intro pointer-events-none fixed inset-0 z-[45]">
      {/* layout guides */}
      <div className="absolute inset-0 mx-auto max-w-[88rem] px-4 md:px-8 lg:px-12">
        <div className="relative h-full">
          {cols.map((i) => (
            <span key={i} className="build-guide-v" style={{ left: `${(i / 12) * 100}%`, animationDelay: `${i * 0.03}s` }} />
          ))}
        </div>
      </div>
      {["22%", "50%", "78%"].map((top, i) => (
        <span key={top} className="build-guide-h" style={{ top, animationDelay: `${0.1 + i * 0.08}s` }} />
      ))}

      {/* wireframes where each block lands */}
      {boxes.map((b) => (
        <div key={b.label + b.x} className="build-box" style={{ left: b.x, top: b.y, width: b.w, height: b.h, animationDelay: `${b.delay}s` }}>
          <span className="build-tag">{b.label}</span>
        </div>
      ))}

      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      {/* build log */}
      <div className="build-log absolute bottom-6 left-4 md:left-8 hidden md:block font-mono text-[11px] leading-5 text-white/55">
        {LOG.slice(0, line).map(([tc, k, v], i) => (
          <div key={k} className="build-log-line">
            <span className="text-brand-yellow">{tc}</span>&nbsp;&nbsp;{k.padEnd(9, " ")}
            <span className={i === LOG.length - 1 ? "text-[#7fd8ff]" : "text-white/40"}>{v}</span>
          </div>
        ))}
        <div className="mt-2 h-px w-48 bg-white/10">
          <div className="build-progress h-px bg-brand-yellow" />
        </div>
      </div>
    </div>
  );
}
