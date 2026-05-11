import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "home", label: "00:00:00" },
  { id: "about", label: "00:01:15" },
  { id: "education", label: "00:02:30" },
  { id: "skills", label: "00:03:45" },
  { id: "experience", label: "00:05:00" },
  { id: "testimonials", label: "00:06:15" },
  { id: "why-me", label: "00:07:30" },
  { id: "weddings", label: "00:08:45" },
  { id: "talking-head", label: "00:10:00" },
  { id: "montage", label: "00:11:15" },
  { id: "long-form", label: "00:12:30" },
  { id: "contact", label: "00:13:45" },
];

export function TimelineNavigation() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState("home");
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);

  // Measure track height for playhead positioning
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackHeight(trackRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Playhead pixel position constrained within the track
  const playheadTop = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const smoothPlayhead = useSpring(playheadTop, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.scrollY;
      let currentSection = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (pageYOffset >= offsetTop - 300) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-0 pointer-events-auto select-none">
      {/* Compact pill container */}
      <div className="relative bg-brand-navy-deep/70 backdrop-blur-md border border-white/10 rounded-xl py-3 px-2 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        {/* Track + Playhead container — this div is the reference for playhead bounds */}
        <div ref={trackRef} className="absolute left-[3px] top-3 bottom-3 w-[20px] pointer-events-none">
          {/* Visible track line */}
          <div className="absolute left-[8px] top-0 bottom-0 w-[2px] bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-brand-yellow origin-top"
              style={{ height: "100%", scaleY }}
            />
          </div>

          {/* Playhead — constrained via pixel offset inside trackRef */}
          <motion.div
            className="absolute left-0 w-[18px] h-[2px] bg-red-500 z-10 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)]"
            style={{ top: smoothPlayhead, y: "-50%" }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-l-[5px] border-t-transparent border-b-transparent border-l-red-500" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-[6px]">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                className="relative flex items-center gap-2 group cursor-pointer pl-5 pr-1 py-[2px]"
                onClick={() => scrollToSection(section.id)}
                aria-label={`Scroll to ${section.id.replace("-", " ")}`}
              >
                {/* Tick mark */}
                <div
                  className={`w-[8px] h-[1.5px] absolute left-[7px] transition-all duration-300 ${
                    isActive
                      ? "bg-brand-yellow w-[12px]"
                      : "bg-white/30 group-hover:bg-brand-yellow"
                  }`}
                />
                {/* Timecode label */}
                <span
                  className={`text-[9px] font-mono tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-brand-yellow font-bold"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {section.label}
                </span>
                {/* Section name tooltip — appears on hover to the left */}
                <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-white font-sans tracking-normal bg-black/70 px-2 py-0.5 rounded whitespace-nowrap backdrop-blur-sm pointer-events-none">
                  {section.id.replace("-", " ")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
