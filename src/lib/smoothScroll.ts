import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth, weighted scrolling for the whole page (off for people who ask for reduced motion). */
export function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return () => {};
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
  let raf = 0;
  const loop = (t: number) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
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
