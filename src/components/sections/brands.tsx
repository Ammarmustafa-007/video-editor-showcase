import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useScroll, useTransform, useVelocity } from "framer-motion";

import adidasLogo from "@/logos/adidas-sport-clothing-brand-logo-editorial-image-v.svg";
import mercedesLogo from "@/logos/mercedes-benz-9.svg";
import lenovoLogo from "@/logos/lenovo-2.svg";
import appleLogo from "@/logos/apple-13.svg";
import matwLogo from "@/logos/680ae7a0f646ac1f49be95dc_600600p532ednmain1240matw.svg";
import baseusLogo from "@/logos/PHOTO_2025_10_23_17_49_53_1761214373.svg";
import mclarenLogo from "@/logos/mclaren.svg";

const brands = [
  { id: "adidas", src: adidasLogo },
  { id: "apple", src: appleLogo },
  { id: "baseus", src: baseusLogo },
  { id: "matw", src: matwLogo },
  { id: "mercedes", src: mercedesLogo },
  { id: "lenovo", src: lenovoLogo },
  { id: "mclaren", src: mclarenLogo },
];

/**
 * The brands stand on a slowly turning carousel, like holograms on a turntable. It turns on its own; scrolling pushes
 * it faster, hovering slows it down. Each logo card has its own reflection on the floor.
 */
export function BrandsSection() {
  const section = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [hover, setHover] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const tilt = useTransform(scrollYProgress, (v) => 18 - v * 26);
  const titleY = useTransform(scrollYProgress, (v) => (0.5 - v) * 80);

  useEffect(() => {
    const r = () => setNarrow(window.innerWidth < 700);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const items = [...brands, ...brands];
  const n = items.length;
  const cardW = narrow ? 120 : 170;
  const radius = Math.round((cardW + (narrow ? 26 : 40)) / 2 / Math.tan(Math.PI / n));

  useAnimationFrame((_, dt) => {
    if (reduced || !ring.current) return;
    const push = Math.min(4, Math.abs(velocity.get()) / 600);
    angle.current = (angle.current + (dt / 1000) * (hover ? 4 : 11 + push * 30)) % 360;
    ring.current.style.transform = `translateZ(${-radius}px) rotateY(${-angle.current}deg)`;
  });

  return (
    <section ref={section} aria-label="Brands" className="relative z-20 w-full overflow-hidden py-20 md:py-28">
      <div aria-hidden className="holo-floor absolute inset-x-0 bottom-0 h-[60%] opacity-60" />
      <motion.div style={{ y: titleY }} className="relative mx-auto max-w-4xl px-4 text-center">
        <p className="text-[12px] uppercase tracking-[0.4em] text-brand-yellow font-semibold">Trusted by</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold text-foreground [text-wrap:balance]">
          Brands whose stories I've cut
        </h2>
      </motion.div>

      <div className="relative mt-10 md:mt-14 h-[230px] md:h-[300px]" style={{ perspective: narrow ? 700 : 1100 }}>
        <motion.div style={{ rotateX: tilt, transformStyle: "preserve-3d" }} className="absolute left-1/2 top-1/2 h-0 w-0">
          <div ref={ring} style={{ transformStyle: "preserve-3d", transform: `translateZ(${-radius}px)` }} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            {items.map((b, i) => (
              <div
                key={`${b.id}-${i}`}
                className="absolute"
                style={{
                  width: cardW,
                  left: -cardW / 2,
                  top: narrow ? -50 : -64,
                  transform: `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="holo-panel group rounded-2xl p-2.5 transition-transform duration-300 hover:-translate-y-2" style={{ backfaceVisibility: "hidden" }}>
                  <div className="relative z-[2] flex h-[72px] md:h-[96px] items-center justify-center overflow-hidden rounded-xl bg-white px-4">
                    <img src={b.src} alt={b.id} className="max-h-[70%] max-w-full object-contain" />
                    <span aria-hidden className="holo-sheen absolute inset-0" />
                  </div>
                </div>
                {/* reflection */}
                <div aria-hidden className="mt-2 h-[40px] md:h-[52px] overflow-hidden rounded-xl opacity-25 [transform:scaleY(-1)] [mask-image:linear-gradient(to_top,#000,transparent_70%)]" style={{ backfaceVisibility: "hidden" }}>
                  <div className="flex h-[72px] md:h-[96px] items-center justify-center rounded-xl bg-white/90 px-4">
                    <img src={b.src} alt="" className="max-h-[70%] max-w-full object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
