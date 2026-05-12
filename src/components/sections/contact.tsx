import { Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-exp.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

const cards = [
  { icon: Phone, label: "Phone", value: "+92 300 3322338", href: "https://wa.me/+923003322338?text=Hello" },
  { icon: Mail, label: "Email", value: "connect.qureshiiii@gmail.com", href: "mailto:connect.qureshiiii@gmail.com" },
  { icon: User, label: "Name", value: <>Abdullah <span className="text-brand-yellow">Qureshi</span></> },
  { icon: ({ size = 20 }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)" />
    </svg>
  ), label: "Instagram", value: "@art_by_qureshii", href: "https://instagram.com/art_by_qureshii" },
  { icon: ({ size = 20 }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ), label: "LinkedIn", value: "Abdullah Qureshi", href: "https://www.linkedin.com/in/abdullahqureshiii/" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: 20 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact Me" title="Let's make something cinematic." subtitle="Available for freelance projects, brand collaborations and full-time roles." />
      <section className="mx-auto max-w-5xl px-4 lg:px-8 py-10 md:py-16 grid gap-8 lg:grid-cols-2 items-center">
        <Reveal scale={0.85} rotate={-3}>
          <TiltCard className="rounded-2xl overflow-hidden shadow-card max-w-sm group p-4 bg-card">
            <div className="relative overflow-hidden rounded-2xl w-full flex justify-center items-center">
              <img src={portrait} alt="Abdullah Qureshi" className="w-full max-w-[280px] h-auto object-cover object-top block rounded-2xl group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </TiltCard>
        </Reveal>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-3 sm:grid-cols-2"
          style={{ perspective: 800 }}
        >
          {cards.map((c) => {
            const inner = (
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -3, boxShadow: "0 15px 40px -10px rgba(255,215,0,0.15)" }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-5 rounded-xl bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-colors h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div whileHover={{ rotate: -15, scale: 1.2 }} transition={{ type: "spring" }}>
                  <c.icon className="text-brand-yellow" size={20} />
                </motion.div>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-display font-bold text-sm text-foreground break-words">{c.value}</p>
              </motion.div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block h-full">
                {inner}
              </a>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </motion.div>
      </section>
    </>
  );
}