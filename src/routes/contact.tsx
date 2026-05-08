import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, Phone, User } from "lucide-react";
import portrait from "@/assets/portrait-contact.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Abdullah Qureshi" },
      { name: "description", content: "Get in touch with Abdullah Qureshi for video editing projects." },
    ],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, label: "Phone", value: "+92 300 3322338", href: "tel:+923003322338" },
  { icon: Mail, label: "Email", value: "connect.qureshiiii@gmail.com", href: "mailto:connect.qureshiiii@gmail.com" },
  { icon: User, label: "Name", value: "Abdullah Qureshi" },
  { icon: Instagram, label: "Instagram", value: "@art_by_qureshii", href: "https://instagram.com/art_by_qureshii" },
];

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact Me" title="Let's make something cinematic." subtitle="Available for freelance projects, brand collaborations and full-time roles." />
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 grid gap-12 lg:grid-cols-2 items-center">
        <Reveal>
          <TiltCard className="rounded-3xl overflow-hidden shadow-card max-w-md">
            <img src={portrait} alt="Abdullah Qureshi" className="w-full h-auto block rounded-3xl"/>
          </TiltCard>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => {
            const inner = (
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card hover:border-brand-yellow/60 transition-colors h-full">
                <c.icon className="text-brand-yellow" size={24}/>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-display font-bold text-foreground break-words">{c.value}</p>
              </div>
            );
            return (
              <Reveal key={c.label} delay={i * 0.08}>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block h-full">{inner}</a>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}