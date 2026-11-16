import { lazy, Suspense, useEffect, useRef, type RefObject } from "react";
import { scrollToY } from "@/lib/smoothScroll";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const HologramPortrait = lazy(() => import("@/components/HologramPortrait").then((m) => ({ default: m.HologramPortrait })));

/**
 * The hologram lives in the hero, in the box `slot` reserves for it. Once the hero scrolls away it flies down into the
 * bottom-right corner, just above the chat button, and stays there for the rest of the page, still watching the mouse.
 *
 * Only a transform moves it (translate + scale), so the WebGL canvas is never resized while it travels.
 */
export function DockingHologram({ slot }: { slot: RefObject<HTMLDivElement | null> }) {
  const box = useRef({ left: 0, top: 0, w: 640, h: 760 });
  const vp = useRef({ w: 1440, h: 900 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const s = useMotionValue(1);
  const docked = useMotionValue(0);
  const size = useMotionValue({ w: 640, h: 760 });
  const { scrollY } = useScroll();

  const place = (sy: number) => {
    const b = box.current;
    const { w: vw, h: vh } = vp.current;
    const small = vw < 768;
    const dockW = small ? 104 : 170;
    const scale = dockW / b.w;
    const dockH = b.h * scale;
    const dockX = vw - dockW - (small ? 12 : 22);
    const dockY = vh - dockH - (small ? 76 : 88);
    // starts leaving when a third of the hero has scrolled past, docked by the time the hero is gone
    const t = Math.min(1, Math.max(0, (sy - b.h * 0.3) / (b.h * 0.55)));
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const heroY = b.top - sy;
    x.set(b.left + (dockX - b.left) * e);
    y.set(heroY + (dockY - heroY) * e);
    s.set(1 + (scale - 1) * e);
    docked.set(e);
  };

  useEffect(() => {
    const measure = () => {
      const el = slot.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      box.current = { left: r.left, top: r.top + window.scrollY, w: r.width, h: r.height };
      vp.current = { w: window.innerWidth, h: window.innerHeight };
      size.set({ w: r.width, h: r.height });
      place(window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (slot.current) ro.observe(slot.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useMotionValueEvent(scrollY, "change", place);

  const width = useTransform(size, (v) => v.w);
  const height = useTransform(size, (v) => v.h);
  const pointer = useTransform(docked, (d) => (d > 0.98 ? "auto" : "none"));
  const ring = useTransform(docked, (d) => Math.max(0, (d - 0.85) / 0.15));

  return (
    <motion.div
      style={{ x, y, scale: s, width, height, pointerEvents: pointer }}
      className="fixed left-0 top-0 z-50 origin-top-left"
    >
      <button
        type="button"
        aria-label="Back to the top"
        onClick={() => scrollToY(0)}
        className="absolute inset-0 cursor-pointer rounded-[40px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a6ff]"
        tabIndex={-1}
      />
      {/* a faint base under the docked bust so it reads as an object, not a sticker */}
      <motion.span aria-hidden style={{ opacity: ring }} className="pointer-events-none absolute inset-x-[8%] bottom-[2%] h-[14%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(150,110,255,0.35),transparent)]" />
      <Suspense fallback={null}>
        <HologramPortrait docked={docked} className="pointer-events-none absolute inset-y-0 -left-[30%] -right-[30%]" />
      </Suspense>
    </motion.div>
  );
}
