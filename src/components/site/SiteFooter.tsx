import { Instagram, Mail, Phone } from "lucide-react";

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
          <a href="tel:+923003322338" className="flex items-center gap-2 hover:text-brand-yellow"><Phone size={14}/> +92 300 3322338</a>
          <a href="mailto:connect.qureshiiii@gmail.com" className="flex items-center gap-2 hover:text-brand-yellow"><Mail size={14}/> connect.qureshiiii@gmail.com</a>
          <a href="https://instagram.com/art_by_qureshii" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow"><Instagram size={14}/> @art_by_qureshii</a>
          <a href="https://www.linkedin.com/in/abdullahqureshiii/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> Abdullah Qureshi
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