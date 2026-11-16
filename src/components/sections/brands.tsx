
import adidasLogo from "@/logos/adidas-sport-clothing-brand-logo-editorial-image-v.svg";
import mercedesLogo from "@/logos/mercedes-benz-9.svg";
import lenovoLogo from "@/logos/lenovo-2.svg";
import appleLogo from "@/logos/apple-13.svg";
import matwLogo from "@/logos/680ae7a0f646ac1f49be95dc_600600p532ednmain1240matw.svg";
import baseusLogo from "@/logos/PHOTO_2025_10_23_17_49_53_1761214373.svg";
import mclarenLogo from "@/logos/mclaren.svg";
import mclarenCafeLogo from "@/logos/mclaren-cafe.png";

const brands = [
  { id: "adidas", src: adidasLogo },
  { id: "apple", src: appleLogo },
  { id: "baseus", src: baseusLogo },
  { id: "matw", src: matwLogo },
  { id: "mercedes", src: mercedesLogo },
  { id: "lenovo", src: lenovoLogo },
  { id: "mclaren", src: mclarenLogo },
  { id: "McLaren Café", src: mclarenCafeLogo },
];

/**
 * The brands glide past on a strip, like clips moving along a timeline. Plain CSS (a looping transform on one row),
 * so it runs on the graphics card and costs nothing on the main thread. Hover pauses it.
 */
export function BrandsSection() {
  const items = [...brands, ...brands];
  return (
    <section aria-label="Brands" className="relative z-20 w-full overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <p className="font-mono text-[13px] text-white/50">Trusted by</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-[-0.025em] text-foreground [text-wrap:balance]">
          Brands whose stories I've cut
        </h2>
      </div>

      <div className="brand-strip relative mt-10 md:mt-14">
        <div className="brand-track flex w-max">
          {items.map((b, i) => (
            <div key={`${b.id}-${i}`} className="mr-4 md:mr-6 w-[130px] md:w-[170px] shrink-0" aria-hidden={i >= brands.length || undefined}>
              <div className="rounded-2xl border border-white/10 bg-[#171129] p-2">
                <div className="flex h-[72px] md:h-[96px] items-center justify-center overflow-hidden rounded-xl bg-white px-4">
                  <img src={b.src} alt={i < brands.length ? b.id : ""} loading="lazy" decoding="async" className="max-h-[70%] max-w-full object-contain" />
                </div>
              </div>
              {/* reflection */}
              <div aria-hidden className="mt-2 h-[34px] md:h-[44px] overflow-hidden rounded-xl opacity-20 [transform:scaleY(-1)] [mask-image:linear-gradient(to_top,#000,transparent_70%)]">
                <div className="flex h-[72px] md:h-[96px] items-center justify-center rounded-xl bg-white/90 px-4">
                  <img src={b.src} alt="" loading="lazy" decoding="async" className="max-h-[70%] max-w-full object-contain" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
