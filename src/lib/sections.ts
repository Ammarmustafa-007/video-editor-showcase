import { WORK } from "@/lib/videoConfig";

/**
 * Every section of the page in order, with its place on the site's timeline (a timecode every 1 min 15 s).
 * The header menu, the timeline on the right and each section's label all read from this one list.
 */
const before = [
  { id: "home", label: "My Portfolio" },
  { id: "about", label: "About Me" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experiences" },
  { id: "testimonials", label: "Testimonials" },
  { id: "why-me", label: "Why Me" },
];
const after = [{ id: "contact", label: "Contact Me" }];

function tc(i: number) {
  const s = i * 75;
  const p = (v: number) => String(v).padStart(2, "0");
  return `00:${p(Math.floor(s / 60))}:${p(s % 60)}`;
}

export const SECTIONS = [...before, ...WORK.map((w) => ({ id: w.id, label: w.eyebrow })), ...after].map((s, i) => ({ ...s, timecode: tc(i) }));

export const timecodeFor = (label: string) => SECTIONS.find((s) => s.label === label)?.timecode;
