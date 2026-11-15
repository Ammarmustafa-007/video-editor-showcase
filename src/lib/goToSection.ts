import type { AnyRouter } from "@tanstack/react-router";
import { scrollToY } from "@/lib/smoothScroll";

let pending: string | null = null;

/** Read (and clear) the section a link asked for while the home page was opening. Used by the scroll memory in __root. */
export function takePendingSection() {
  const p = pending;
  pending = null;
  return p;
}

/** Scroll to a home-page section. From any other page, open the home page first; the scroll memory then glides there. */
export function goToSection(router: AnyRouter, id: string) {
  const el = document.getElementById(id);
  if (router.state.location.pathname === "/" && el) {
    scrollToY(id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY - 80);
    return;
  }
  pending = id === "home" ? null : id;
  void router.navigate({ to: "/" });
}
