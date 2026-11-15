import { useEffect, useRef } from "react";

/**
 * The night behind the page: a still field of faint stars, drawn once on a 2D canvas (redrawn only on resize).
 * No WebGL and no animation loop, so the first load stays light.
 */
export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      // seeded so the sky is the same on every visit
      let seed = 11;
      const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const n = Math.round((w * h) / 2600);
      for (let i = 0; i < n; i++) {
        const x = r() * w;
        const y = r() * h;
        const big = r() > 0.94;
        const a = big ? 0.55 + r() * 0.35 : 0.12 + r() * 0.3;
        const tint = r();
        ctx.fillStyle = tint > 0.85 ? `rgba(201,166,255,${a})` : tint > 0.75 ? `rgba(160,215,255,${a})` : `rgba(235,232,245,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, big ? 1.1 : 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(draw, 150);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_0%,#160e2e_0%,#0c0818_55%,#08060f_100%)]">
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
