import { Instagram, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-about.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

const cards = [
  { icon: Phone, label: "Phone", value: "+92 300 3322338", href: "tel:+923003322338" },
  { icon: Mail, label: "Email", value: "connect.qureshiiii@gmail.com", href: "mailto:connect.qureshiiii@gmail.com" },
  { icon: User, label: "Name", value: <>Abdullah <span className="text-brand-yellow">Qureshi</span></> },
  { icon: Instagram, label: "Instagram", value: "@art_by_qureshii", href: "https://instagram.com/art_by_qureshii" },
  { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, label: "LinkedIn", value: "Abdullah Qureshi", href: "https://www.linkedin.com/in/abdullahqureshiii/" },
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
              <img src={portrait} alt="Abdullah Qureshi" className="w-full max-w-[280px] h-auto object-contain block rounded-2xl group-hover:scale-105 transition-transform duration-700"/>
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
                  <c.icon className="text-brand-yellow" size={20}/>
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