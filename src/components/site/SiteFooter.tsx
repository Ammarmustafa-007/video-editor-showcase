import { Mail, Phone } from "lucide-react";

export function SiteFooter() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-brand-navy-deep mt-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display font-extrabold text-foreground">
            ART BY <span className="text-brand-yellow">QURESHI</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Creative video editor crafting cinematic stories for brands, weddings and creators.
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="text-foreground font-semibold mb-3">Get in touch</p>
          <a href="https://wa.me/+923003322338?text=Hello" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow"><Phone size={14}/> +92 300 3322338</a>
          <a href="mailto:connect.qureshiiii@gmail.com" className="flex items-center gap-2 hover:text-brand-yellow"><Mail size={14}/> connect.qureshiiii@gmail.com</a>
          <a href="https://instagram.com/art_by_qureshii" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="ig-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFDC80" />
                  <stop offset="25%" stopColor="#F77737" />
                  <stop offset="50%" stopColor="#E1306C" />
                  <stop offset="75%" stopColor="#C13584" />
                  <stop offset="100%" stopColor="#833AB4" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-footer)" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="url(#ig-footer)" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-footer)" />
            </svg>
            @art_by_qureshii
          </a>
          <a href="https://www.linkedin.com/in/abdullahqureshiii/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Abdullah Qureshi
          </a>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-foreground font-semibold mb-3">Explore</p>
          <div className="flex flex-col gap-1.5 text-muted-foreground">
            <button onClick={() => scrollTo("about")} className="text-left hover:text-brand-yellow transition-colors">About</button>
            <button onClick={() => scrollTo("weddings")} className="text-left hover:text-brand-yellow transition-colors">Showreels</button>
            <button onClick={() => scrollTo("testimonials")} className="text-left hover:text-brand-yellow transition-colors">Testimonials</button>
            <button onClick={() => scrollTo("contact")} className="text-left hover:text-brand-yellow transition-colors">Contact</button>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Abdullah Qureshi. All rights reserved.
      </div>
    </footer>
  );
}