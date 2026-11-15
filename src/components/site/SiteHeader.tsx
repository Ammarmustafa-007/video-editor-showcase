import { scrollToY } from "@/lib/smoothScroll";
import { SECTIONS } from "@/lib/sections";
import { Link as RouterLink } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = SECTIONS.map((s) => ({ to: `#${s.id}`, label: s.label }));

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const handleScroll = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id.substring(1));
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        scrollToY(top);
      }
    }, 10);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-brand-navy-deep/80 border-b border-border"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-8 h-16">
        <button
          onClick={() => handleScroll("#home")}
          className="font-display font-semibold tracking-wide text-foreground text-sm md:text-base cursor-pointer"
        >
          ART BY <span className="text-brand-yellow">QURESHI</span>
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-foreground focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-brand-navy-deep border-t border-border absolute w-full shadow-2xl"
          >
            <div className="flex flex-col px-4 py-3 max-h-[80vh] overflow-y-auto">
              {links.map((l) => (
                <button
                  key={l.to}
                  onClick={() => handleScroll(l.to)}
                  className="py-3 text-left text-sm md:text-base text-muted-foreground hover:text-brand-yellow font-medium transition-colors border-b border-border/30 last:border-0"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}