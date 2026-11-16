import { type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** kept so existing callers don't change; the card no longer tilts */
  intensity?: number;
};

/**
 * A card that lifts a little on hover. Pure CSS (see .lift-card in styles.css): no mouse tracking and no 3D, so it
 * costs nothing while the page scrolls.
 */
export function TiltCard({ children, className = "" }: TiltCardProps) {
  return <div className={`lift-card ${className}`}>{children}</div>;
}
