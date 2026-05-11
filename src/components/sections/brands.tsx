import { motion } from "framer-motion";

const brands = [
  { id: "adidas", type: "icon" },
  { id: "apple", type: "icon" },
  { id: "mclaren", type: "icon" },
  { id: "baseus", type: "text", text: "BASEUS" },
  { id: "matw", type: "text", text: "MATW" },
  { id: "najam", type: "text", text: "NAJAM" },
  { id: "mercedes", type: "text", text: "MERCEDES" },
  { id: "lenovo", type: "icon" }
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
            <div key={`${brand.id}-${i}`} className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300">
              {brand.type === "icon" ? (
                <img 
                  src={`https://cdn.simpleicons.org/${brand.id}/white`} 
                  alt={brand.id} 
                  className="h-8 md:h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-widest">
                  {brand.text}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
