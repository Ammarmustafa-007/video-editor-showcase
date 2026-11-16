
/**
 * A photo of Abdullah set up like a small hologram: the picture floats on its own layer in front of a violet ring,
 * a thin orbit circles it on a tilted plane. The layers are set once in depth (no mouse tracking); the only motion is
 * the orbit and a slow CSS float.
 */
export function HoloPortrait({ src, alt, shape = "circle", className = "" }: { src: string; alt: string; shape?: "circle" | "card"; className?: string }) {
  const round = shape === "circle";
  const radius = round ? "rounded-full" : "rounded-[20px]";

  return (
    <div className={`relative mx-auto ${className}`} style={{ perspective: 900 }}>
      <div style={{ transform: "rotateX(6deg) rotateY(-8deg)", transformStyle: "preserve-3d" }} className="holo-float relative h-full w-full">
        {/* back ring, set behind the photo */}
        <div
          aria-hidden
          className={`absolute ${round ? "-inset-4" : "-inset-3"} ${radius} border border-[#c9a6ff]/35`}
          style={{ transform: "translateZ(-40px)" }}
        />
        {/* the photo */}
        <div className={`absolute inset-0 overflow-hidden ${radius} ring-1 ring-[#c9a6ff]/70`} style={{ transform: "translateZ(0px)" }}>
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
          {/* projection lines and a violet cast at the edges */}
          <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(201,166,255,0.08)_0_1px,transparent_1px_4px)]" />
          <div aria-hidden className={`absolute inset-0 ${radius} shadow-[inset_0_0_60px_rgba(76,40,160,0.55)]`} />
        </div>
        {/* tilted orbit in front */}
        {round && (
          <div aria-hidden className="pointer-events-none absolute -inset-10" style={{ transform: "translateZ(30px) rotateX(74deg)", transformStyle: "preserve-3d" }}>
            <div className="holo-orbit absolute inset-0 rounded-full border border-[#7fd8ff]/40">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
          </div>
        )}
        {/* corner ticks on the card version */}
        {!round &&
          ["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
            <span key={c} aria-hidden className={`absolute h-5 w-5 border-[#c9a6ff] ${c}`} style={{ transform: "translateZ(24px)" }} />
          ))}
      </div>
      {/* soft floor shadow */}
      <div aria-hidden className="absolute -bottom-8 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(120,80,230,0.35),transparent)]" />
    </div>
  );
}
