import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/education", label: "Education" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/why-me", label: "Why Me" },
  { to: "/work/weddings", label: "Weddings" },
  { to: "/work/talking-head", label: "Talking Head" },
  { to: "/work/montage", label: "Montage" },
  { to: "/work/long-form", label: "Long Form" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 backdrop-blur-md bg-brand-navy-deep/80 border-b border-border"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-8 h-16">
        <Link to="/" className="font-display font-extrabold tracking-wide text-foreground text-sm md:text-base">
          ART BY <span className="text-brand-yellow">QURESHI</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-brand-yellow transition-colors uppercase tracking-wider"
              activeProps={{ className: "px-3 py-2 text-xs font-semibold text-brand-yellow uppercase tracking-wider" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-brand-navy-deep border-t border-border"
          >
            <div className="flex flex-col px-4 py-3">
              {links.slice(1).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-brand-yellow uppercase tracking-wider"
                  activeProps={{ className: "py-2 text-sm text-brand-yellow font-semibold uppercase tracking-wider" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}