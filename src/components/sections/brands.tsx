import { motion } from "framer-motion";

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

export function BrandsSection() {
  return (
    <section className="py-12 bg-brand-navy-deep border-y border-white/5 overflow-hidden w-full relative z-20 shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60 font-semibold">Trusted by innovative brands</p>
      </div>
      <div className="relative flex w-full overflow-hidden">
        {/* Gradients for fade effect on left and right edges */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-brand-navy-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-brand-navy-deep to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-16 md:gap-24 px-8 md:px-12"
          style={{ width: "max-content" }}
        >
          {/* Quadruple the list for a seamless, perfectly smooth infinite scroll */}
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center">
                <img
                  src={brand.src}
                  alt={brand.id}
                  className="h-10 md:h-12 w-auto max-w-[100px] md:max-w-[130px] object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
