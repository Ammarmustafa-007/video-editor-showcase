import Lenis from "lenis";
import { isLite, onLite } from "@/lib/perf";

let lenis: Lenis | null = null;

/**
 * Smooth, weighted scrolling for the whole page. Off in lite mode (weaker machines, reduced motion): there the
 * browser's own scrolling is the smoothest thing available. Tuned close to native so it never feels floaty.
 */
export function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return () => {};
  if (isLite()) return () => {};
  lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 0.9, smoothWheel: true, anchors: true });
  const off = onLite(() => stop());
  let raf = 0;
  const loop = (t: number) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const stop = () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
    off();
  };
  return stop;
}

/** Scroll to a page position, through Lenis when it runs so the two never fight. */
export function scrollToY(y: number) {
  // the page may have just changed height (a new route); let Lenis re-measure before it clamps the target
  if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.2, force: true }); }
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Jump to a position at once (page changes, going back). */
export function jumpToY(y: number) {
  if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); }
  else window.scrollTo(0, y);
}
