import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  rotate?: number;
  scale?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Enhanced reveal animation with optional 3D transforms.
 * Supports directional entry (x/y), rotation, and scale.
 */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  x = 0,
  rotate = 0,
  scale = 1,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : y,
      x: reduce ? 0 : x,
      rotate: reduce ? 0 : rotate,
      scale: reduce ? 1 : scale,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}