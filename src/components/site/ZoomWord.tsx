import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import collage from "@/assets/reel-collage.jpg";
import site from "@/content/site.json";

/**
 * The page "zoomed into" a frame of footage. Scrolling zooms out: the footage turns out to be inside the letters of one
 * huge word. Then the rest of the line arrives and the page moves on.
 *
 * Built as an SVG mask (a full-screen panel with the word cut out of it) so the word stays sharp at any zoom, and the
 * footage underneath never gets stretched.
 */
export function ZoomWord() {
  const section = useRef<HTMLElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const [origin, setOrigin] = useState({ x: 720, y: 450 });
  const [fontsReady, setFontsReady] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const { word, before, after, line } = site.zoom;

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // exponential zoom feels even: 46× → 1× over the first 55 % of the section
  const scale = useTransform(scrollYProgress, (p) => (reduced ? 1 : Math.pow(46, Math.max(0, 1 - Math.min(1, p / 0.55)))));
  // function transforms on purpose: framer's "accelerated" scroll animations mis-map this section's offsets
  const k = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const footage = useTransform(scrollYProgress, (p) => 1.25 - 0.25 * k(p, 0, 0.6));
  const extraOpacity = useTransform(scrollYProgress, (p) => (reduced ? 1 : k(p, 0.52, 0.66)));
  const extraY = useTransform(scrollYProgress, (p) => (reduced ? 0 : 30 * (1 - k(p, 0.52, 0.66))));
  const exitY = useTransform(scrollYProgress, (p) => `${-18 * k(p, 0.84, 1)}vh`);
  const exitOpacity = useTransform(scrollYProgress, (p) => 1 - k(p, 0.86, 1));
  const hint = useTransform(scrollYProgress, (p) => (reduced ? 0 : 1 - k(p, 0, 0.08)));

  useEffect(() => {
    const r = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    r();
    document.fonts?.ready.then(() => setFontsReady(true));   // measure again once Montserrat has loaded
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // zoom origin = the middle of the thickest stroke (the "I"), so the starting view is filled with footage
  useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return;
    try {
      const idx = Math.max(0, word.toUpperCase().indexOf("I"));
      const a = t.getStartPositionOfChar(idx);
      const b = t.getEndPositionOfChar(idx);
      const box = t.getBBox();
      setOrigin({ x: (a.x + b.x) / 2, y: box.y + box.height * 0.55 });
    } catch {
      setOrigin({ x: size.w / 2, y: size.h / 2 });
    }
  }, [size, word, fontsReady]);

  const apply = (s: number) => {
    groupRef.current?.setAttribute("transform", `translate(${origin.x} ${origin.y}) scale(${s}) translate(${-origin.x} ${-origin.y})`);
  };
  useMotionValueEvent(scale, "change", apply);
  useEffect(() => apply(scale.get()), [origin]); // eslint-disable-line react-hooks/exhaustive-deps

  const fontSize = Math.min(size.w * (size.w < 700 ? 0.25 : 0.2), size.h * 0.4);

  return (
    <section ref={section} id="showreel-word" className="relative" style={{ height: reduced ? "100vh" : "320vh" }} aria-label={`${before} ${word} ${after}`}>
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden" style={{ y: exitY, opacity: exitOpacity }}>
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: `url(${collage})`, backgroundSize: "cover", backgroundPosition: "center", scale: footage }}
        />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(120,70,220,.25), rgba(40,10,90,.35))", mixBlendMode: "color" }} />
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <mask id="zw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <rect width={size.w} height={size.h} fill="white" />
              <g ref={groupRef}>
                <text
                  ref={textRef}
                  x={size.w / 2}
                  y={size.h / 2 + fontSize * 0.36}
                  textAnchor="middle"
                  fontFamily="Montserrat, Inter, sans-serif"
                  fontWeight={900}
                  fontSize={fontSize}
                  letterSpacing={-fontSize * 0.02}
                  fill="black"
                >
                  {word}
                </text>
              </g>
            </mask>
            <linearGradient id="zw-edge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d0820" />
              <stop offset="1" stopColor="#120a2a" />
            </linearGradient>
          </defs>
          <rect width={size.w} height={size.h} fill="url(#zw-edge)" mask="url(#zw-mask)" />
        </svg>

        <motion.p
          className="absolute left-0 right-0 text-center font-display font-bold uppercase tracking-[0.5em] text-brand-yellow"
          style={{ top: `calc(50% - ${fontSize * 0.62}px)`, opacity: extraOpacity, y: extraY, fontSize: Math.max(14, fontSize * 0.09) }}
        >
          {before}
        </motion.p>
        <motion.div
          className="absolute left-0 right-0 text-center px-6"
          style={{ top: `calc(50% + ${fontSize * 0.5}px)`, opacity: extraOpacity, y: extraY }}
        >
          <p className="font-display font-extrabold text-foreground" style={{ fontSize: Math.max(22, fontSize * 0.2) }}>{after}</p>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">{line}</p>
        </motion.div>
        <motion.p style={{ opacity: hint }} className="absolute bottom-8 left-0 right-0 text-center text-[11px] uppercase tracking-[0.35em] text-white/70">
          Keep scrolling
        </motion.p>
      </motion.div>
    </section>
  );
}
