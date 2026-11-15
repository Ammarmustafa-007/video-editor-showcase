import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check, Download, Film, Scissors, Sparkles } from "lucide-react";
import m1 from "@/assets/montage-1.jpg";
import m3 from "@/assets/montage-3.jpg";
import m5 from "@/assets/montage-5.jpg";
import m8 from "@/assets/montage-8.jpg";
import t1 from "@/assets/talking-1.jpg";
import t4 from "@/assets/talking-4.jpg";
import w1 from "@/assets/wedding-1.jpg";
import l1 from "@/assets/long-1.jpg";

/**
 * A scroll-driven trip through an edit.
 *
 * Scroll in: an editing window tilts up from the floor and fills the screen. Keep scrolling: the playhead runs along
 * the timeline, the monitor shows whatever clip it's on, keyframes light up as it passes. Then the window drops away,
 * an Export button comes up, gets pressed, and the render bar fills as you scroll. When it hits 100 % the work starts.
 */

type Clip = { at: number; len: number; img?: string; label: string };

// positions are in % of the sequence
const V1: Clip[] = [
  { at: 0, len: 16, img: t1, label: "Scene_01" },
  { at: 16, len: 14, img: m1, label: "Hook_cut" },
  { at: 30, len: 19, img: w1, label: "Scene_03" },
  { at: 49, len: 13, img: m5, label: "Scene_04" },
  { at: 62, len: 20, img: t4, label: "Interview" },
  { at: 82, len: 18, img: l1, label: "Closing" },
];
const V2: Clip[] = [
  { at: 8, len: 10, img: m3, label: "B-roll" },
  { at: 40, len: 12, img: m8, label: "B-roll" },
  { at: 70, len: 9, img: m3, label: "Insert" },
];
const V3: Clip[] = [
  { at: 2, len: 11, label: "Hook title" },
  { at: 33, len: 14, label: "Lower third" },
  { at: 86, len: 12, label: "End card" },
];
const KEYS = [5, 12, 21, 27, 36, 44, 53, 58, 66, 74, 79, 88, 95];
const DURATION = 90; // seconds in the sequence

// deterministic "audio" so the waveform is the same on every load
function wave(n: number, seed: number, smooth = false) {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out: number[] = [];
  let prev = 0.5;
  for (let i = 0; i < n; i++) {
    const v = smooth ? prev * 0.7 + r() * 0.3 : 0.15 + r() * 0.85 * (0.5 + 0.5 * Math.sin(i / 7));
    prev = v;
    out.push(v);
  }
  return out;
}
const VOICE = wave(140, 7);
const MUSIC = wave(140, 21, true);

function tc(sec: number) {
  const f = Math.floor((sec % 1) * 24);
  const s = Math.floor(sec) % 60;
  const m = Math.floor(sec / 60);
  const p = (v: number) => String(v).padStart(2, "0");
  return `00:${p(m)}:${p(s)}:${p(f)}`;
}

const k = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

function Track({ name, tone, children }: { name: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 items-stretch border-b border-white/[0.06]">
      <div className="flex w-12 md:w-16 shrink-0 items-center gap-1.5 border-r border-white/[0.06] bg-white/[0.02] px-2">
        <span className={`h-2 w-2 rounded-sm ${tone}`} />
        <span className="font-mono text-[10px] md:text-[11px] text-white/60">{name}</span>
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function Waveform({ data, color }: { data: number[]; color: string }) {
  const w = data.length;
  const d = data.map((v, i) => `M${i + 0.5} ${12 - v * 11}V${12 + v * 11}`).join("");
  return (
    <svg viewBox={`0 0 ${w} 24`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <path d={d} stroke={color} strokeWidth={0.6} />
    </svg>
  );
}

export function EditTimeline() {
  const section = useRef<HTMLElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"edit" | "export" | "done">("edit");
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // 0 → 0.14 the window rises from the floor and fills the screen
  const winScale = useTransform(p, (v) => (reduced ? 1 : 0.5 + 0.5 * easeOut(k(v, 0, 0.14)) - 0.35 * easeIn(k(v, 0.64, 0.75))));
  const winRotX = useTransform(p, (v) => (reduced ? 0 : 58 * (1 - easeOut(k(v, 0, 0.14))) - 28 * easeIn(k(v, 0.64, 0.75))));
  const winRotZ = useTransform(p, (v) => (reduced ? 0 : -6 * (1 - easeOut(k(v, 0, 0.14)))));
  const winY = useTransform(p, (v) => `${(reduced ? 0 : 18 * (1 - easeOut(k(v, 0, 0.14)))) + 70 * easeIn(k(v, 0.64, 0.75))}vh`);
  const winOpacity = useTransform(p, (v) => k(v, 0, 0.05) * (1 - k(v, 0.66, 0.74)));
  // 0.16 → 0.64 the playhead runs along the sequence
  const head = useTransform(p, (v) => k(v, 0.16, 0.64) * 100);
  const headLeft = useTransform(head, (v) => `${v}%`);
  // the timeline zooms in on the middle of the edit, then back out (the "pinch zoom" in a real timeline)
  const tlZoom = useTransform(p, (v) => 1 + 0.9 * Math.sin(Math.PI * k(v, 0.3, 0.56)));
  const tlWidth = useTransform(tlZoom, (z) => `${z * 100}%`);
  // keep the playhead on the same spot of the screen while the lanes stretch (translate % is of the stretched width)
  const tlShift = useTransform([head, tlZoom] as MotionValue<number>[], ([h, z]: number[]) => `${-(h * (z - 1)) / z}%`);
  // export
  const exOpacity = useTransform(p, (v) => k(v, 0.75, 0.8));
  const exScale = useTransform(p, (v) => 0.7 + 0.3 * easeOut(k(v, 0.74, 0.82)));
  const exRotY = useTransform(p, (v) => (reduced ? 0 : -35 * (1 - easeOut(k(v, 0.74, 0.84)))));
  const render = useTransform(p, (v) => k(v, 0.84, 0.97));
  const renderW = useTransform(render, (v) => `${v * 100}%`);
  const renderPct = useTransform(render, (v) => `${Math.round(v * 100)}%`);
  const intro = useTransform(p, (v) => 1 - k(v, 0.06, 0.13));

  useMotionValueEvent(head, "change", (h) => {
    if (timecode.current) timecode.current.textContent = tc((h / 100) * DURATION);
    const i = V1.findIndex((c) => h >= c.at && h < c.at + c.len);
    setActive((a) => (i === -1 ? a : i === a ? a : i));
  });
  useMotionValueEvent(p, "change", (v) => setPhase(v < 0.83 ? "edit" : v < 0.97 ? "export" : "done"));

  const clip = V1[active];

  return (
    <section ref={section} id="timeline" aria-label="Inside the edit" className="relative" style={{ height: reduced ? "220vh" : "560vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: 1400 }}>
        {/* grid floor the window rises from */}
        <div aria-hidden className="holo-floor absolute inset-x-0 bottom-0 h-[55vh]" />

        <motion.div style={{ opacity: intro }} className="pointer-events-none absolute inset-x-0 top-[12vh] z-20 px-4 text-center">
          <p className="text-[12px] uppercase tracking-[0.4em] text-brand-yellow font-semibold">Inside the edit</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold text-foreground [text-wrap:balance]">
            Every project starts on a timeline.
          </h2>
        </motion.div>

        {/* the editing window */}
        <motion.div
          style={{ scale: winScale, rotateX: winRotX, rotateZ: winRotZ, y: winY, opacity: winOpacity, transformStyle: "preserve-3d" }}
          className="absolute left-3 right-3 md:left-[5vw] md:right-[5vw] lg:right-[112px] top-[9vh] bottom-[8vh] origin-bottom"
        >
          <div className="holo-panel flex h-full flex-col overflow-hidden rounded-2xl">
            {/* title bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-2.5">
              <span className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b9a]/80" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#ffc56b]/80" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#6bffc6]/80" />
              </span>
              <span className="font-mono text-[11px] text-white/55 truncate">Client_Project_FINAL_v7 · Sequence 01</span>
              <span className="ml-auto hidden sm:flex items-center gap-4 text-[11px] text-white/45">
                <span className="text-white/85">Edit</span><span>Color</span><span>Effects</span><span>Audio</span>
              </span>
            </div>

            {/* monitors */}
            <div className="grid min-h-0 flex-[1.15] grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-px bg-white/[0.04]">
              <div className="hidden md:flex flex-col bg-[#0d0820]/90 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Effect controls</p>
                <div className="mt-3 space-y-2.5 font-mono text-[11px]">
                  {[["Scale", "112.0"], ["Position", "960, 540"], ["Opacity", "100 %"], ["Lumetri", "Teal / Lilac"], ["Speed", "100 % · ramp"]].map(([a, b], i) => (
                    <div key={a} className="flex items-center justify-between gap-2">
                      <span className="text-white/50">{a}</span>
                      <span className="flex items-center gap-2 text-white/85">
                        {b}
                        <span className={`h-2 w-2 rotate-45 ${i % 2 ? "bg-[#7fd8ff]" : "bg-[#c9a6ff]"}`} />
                      </span>
                    </div>
                  ))}
                </div>
                {/* a value graph, like the After Effects graph editor */}
                <svg viewBox="0 0 200 70" className="mt-auto w-full">
                  <path d="M0 62 C 50 62, 60 8, 100 8 S 150 62, 200 40" fill="none" stroke="#ff8ad8" strokeWidth="1.5" />
                  <path d="M0 50 C 40 50, 80 30, 120 34 S 170 14, 200 12" fill="none" stroke="#7fd8ff" strokeWidth="1" opacity="0.7" />
                  {[0, 100, 200].map((x) => <rect key={x} x={x - 3} y={x === 100 ? 5 : x ? 37 : 59} width="6" height="6" transform={`rotate(45 ${x} ${x === 100 ? 8 : x ? 40 : 62})`} fill="#fff" />)}
                </svg>
              </div>
              <div className="relative flex flex-col bg-black/60 p-3 min-h-0">
                <div className="relative mx-auto aspect-video h-full max-h-full max-w-full overflow-hidden rounded-md bg-black">
                  {V1.map((c, i) => (
                    <img key={c.label} src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: i === active ? 1 : 0 }} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-white/80">{clip.label}</span>
                  <span className="absolute right-2 top-2 flex items-center gap-1 font-mono text-[10px] text-[#ff6b9a]"><i className="h-1.5 w-1.5 rounded-full bg-[#ff6b9a] animate-pulse" />REC</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                  <span ref={timecode} className="text-[#c9a6ff] tabular-nums">00:00:00:00</span>
                  <span className="text-white/40">Fit · 1/2 · 4K 23.976</span>
                </div>
              </div>
            </div>

            {/* timeline */}
            <div className="relative flex min-h-0 flex-1 flex-col bg-[#0b0619]/95">
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-3 py-1.5 text-white/45">
                <Scissors size={13} /><Sparkles size={13} /><Film size={13} />
                <span className="ml-auto font-mono text-[10px]">Sequence 01 · 01:30</span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-5 overflow-hidden border-b border-white/[0.06] pl-12 md:pl-16">
                  <div className="relative h-full overflow-hidden">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      {/* ruler */}
                      <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 2.5%)", backgroundSize: "100% 45%", backgroundRepeat: "no-repeat", backgroundPosition: "bottom" }} />
                    </Lane>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-5 bottom-0 grid grid-rows-5">
                  <Track name="V3" tone="bg-[#ff8ad8]">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      {V3.map((c) => (
                        <div key={c.label} className="absolute inset-y-1 rounded-[4px] border border-[#ff8ad8]/50 bg-[#ff8ad8]/25 px-1.5 text-[9px] md:text-[10px] leading-[1.6] text-white/90 truncate" style={{ left: `${c.at}%`, width: `${c.len}%` }}>
                          {c.label}
                        </div>
                      ))}
                    </Lane>
                  </Track>
                  <Track name="V2" tone="bg-[#7fd8ff]">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      {V2.map((c, i) => (
                        <div key={i} className="absolute inset-y-1 overflow-hidden rounded-[4px] border border-[#7fd8ff]/50 bg-[#7fd8ff]/20" style={{ left: `${c.at}%`, width: `${c.len}%` }}>
                          <span className="absolute inset-0 opacity-60" style={{ backgroundImage: `url(${c.img})`, backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
                        </div>
                      ))}
                    </Lane>
                  </Track>
                  <Track name="V1" tone="bg-[#c9a6ff]">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      {V1.map((c, i) => (
                        <div key={c.label} className={`absolute inset-y-1 flex overflow-hidden rounded-[4px] border bg-[#8b5cf6]/30 transition-colors ${i === active ? "border-white/80" : "border-[#c9a6ff]/45"}`} style={{ left: `${c.at}%`, width: `${c.len}%` }}>
                          <span className="absolute inset-0 opacity-80" style={{ backgroundImage: `url(${c.img})`, backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
                          <span className="absolute left-1 top-0.5 rounded bg-black/40 px-1 text-[9px] text-white/90 truncate">{c.label}</span>
                        </div>
                      ))}
                      {KEYS.map((x) => (
                        <span key={x} className="absolute bottom-0.5 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/80" style={{ left: `${x}%` }} />
                      ))}
                    </Lane>
                  </Track>
                  <Track name="A1" tone="bg-[#6bffc6]">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      <div className="absolute inset-y-1 left-0 right-[4%] overflow-hidden rounded-[4px] border border-[#6bffc6]/35 bg-[#6bffc6]/10">
                        <Waveform data={VOICE} color="#6bffc6" />
                      </div>
                    </Lane>
                  </Track>
                  <Track name="A2" tone="bg-[#ffc56b]">
                    <Lane zoom={tlWidth} shift={tlShift}>
                      <div className="absolute inset-y-1 left-[2%] right-0 overflow-hidden rounded-[4px] border border-[#ffc56b]/35 bg-[#ffc56b]/10">
                        <Waveform data={MUSIC} color="#ffc56b" />
                      </div>
                    </Lane>
                  </Track>
                </div>
                {/* playhead */}
                <div className="pointer-events-none absolute inset-y-0 left-12 right-0 md:left-16 overflow-hidden">
                  <Lane zoom={tlWidth} shift={tlShift}>
                    <motion.div style={{ left: headLeft }} className="absolute inset-y-0 w-px bg-[#ff5c8a] shadow-[0_0_12px_2px_rgba(255,92,138,0.6)]">
                      <span className="absolute -left-[5px] top-0 h-3 w-[11px] bg-[#ff5c8a] [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]" />
                    </motion.div>
                  </Lane>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* export */}
        <motion.div
          style={{ opacity: exOpacity, scale: exScale, rotateY: exRotY }}
          className="absolute inset-0 z-30 flex items-center justify-center px-4"
        >
          <div className="holo-panel w-full max-w-md rounded-3xl p-6 md:p-8">
            <p className="text-[12px] uppercase tracking-[0.35em] text-brand-yellow font-semibold">Export</p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-extrabold text-foreground">Ready for the world</h3>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[12px]">
              <dt className="text-white/45">Format</dt><dd className="text-right text-white/85">H.264</dd>
              <dt className="text-white/45">Resolution</dt><dd className="text-right text-white/85">3840 × 2160</dd>
              <dt className="text-white/45">Frame rate</dt><dd className="text-right text-white/85">23.976 fps</dd>
              <dt className="text-white/45">Audio</dt><dd className="text-right text-white/85">AAC · 320 kbps</dd>
            </dl>
            <div className="mt-6">
              {phase === "edit" && (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-yellow py-3 font-semibold text-primary-foreground shadow-glow">
                  <Download size={16} /> Export
                </div>
              )}
              {phase !== "edit" && (
                <div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div style={{ width: renderW }} className="h-full rounded-full bg-[linear-gradient(90deg,#7fd8ff,#c9a6ff,#ff8ad8)]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px]">
                    <span className="text-white/60">{phase === "done" ? "Export complete" : "Rendering…"}</span>
                    <motion.span className="font-mono tabular-nums text-white/85">{renderPct}</motion.span>
                  </div>
                  {phase === "done" && (
                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-sm text-foreground">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#6bffc6]/20 text-[#6bffc6]"><Check size={14} /></span>
                      Here's what came out of it. Keep scrolling.
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One track's lane, zoomed and shifted together with the ruler. */
function Lane({ zoom, shift, children }: { zoom: MotionValue<string>; shift: MotionValue<string>; children: React.ReactNode }) {
  return (
    <motion.div style={{ width: zoom, x: shift }} className="absolute inset-y-0 left-0">
      {children}
    </motion.div>
  );
}

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number) { return t * t * t; }
