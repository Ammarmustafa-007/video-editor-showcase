import { Mail, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function SiteFooter() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative mt-24 border-t border-brand-yellow/20 overflow-hidden">
      {/* Background glow and gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-deep to-[#020408] z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-50 z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-brand-yellow/10 blur-[100px] z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
        {/* Massive CTA Section */}
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold text-foreground mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-amber-500">elevate</span> your content?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's create something extraordinary together. Whether it's a wedding film or a high-converting brand campaign, I'm here to bring your vision to life.
          </p>
          <button 
            onClick={() => scrollTo("contact")}
            className="group inline-flex items-center gap-2 bg-brand-yellow text-brand-navy-deep font-bold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all transform hover:scale-105 text-lg"
          >
            Start a Project <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid gap-12 md:grid-cols-4 border-t border-white/10 pt-12">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-extrabold text-foreground mb-4">
              ART BY <span className="text-brand-yellow">QURESHI</span>
            </p>
            <p className="text-base text-muted-foreground max-w-sm mb-6">
              Creative video editor crafting cinematic stories for brands, weddings, and top-tier creators.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/art_by_qureshii" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-yellow/20 hover:border-brand-yellow/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/abdullahqureshiii/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-yellow/20 hover:border-brand-yellow/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-4 text-base">
            <p className="text-foreground font-bold tracking-wide uppercase text-sm mb-6">Explore</p>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <button onClick={() => scrollTo("home")} className="text-left hover:text-brand-yellow hover:translate-x-1 transition-all">Home</button>
              <button onClick={() => scrollTo("about")} className="text-left hover:text-brand-yellow hover:translate-x-1 transition-all">About</button>
              <button onClick={() => scrollTo("weddings")} className="text-left hover:text-brand-yellow hover:translate-x-1 transition-all">Showreels</button>
              <button onClick={() => scrollTo("testimonials")} className="text-left hover:text-brand-yellow hover:translate-x-1 transition-all">Testimonials</button>
            </div>
          </div>

          <div className="space-y-4 text-base text-muted-foreground">
            <p className="text-foreground font-bold tracking-wide uppercase text-sm mb-6">Get in touch</p>
            <a href="https://wa.me/+923003322338?text=Hello" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand-yellow transition-colors group">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-yellow/20"><Phone size={14}/></div>
              +92 300 3322338
            </a>
            <a href="mailto:connect.qureshiiii@gmail.com" className="flex items-center gap-3 hover:text-brand-yellow transition-colors group break-all">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-yellow/20"><Mail size={14}/></div>
              connect.qureshiiii@gmail.com
            </a>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 border-t border-white/5 bg-black/20 py-6 text-center text-sm text-muted-foreground/60">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Abdullah Qureshi. All rights reserved.</p>
          <p>Designed for cinematic excellence.</p>
        </div>
      </div>
    </footer>
  );
}