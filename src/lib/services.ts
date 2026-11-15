import content from "@/content/services.json";

export type Service = {
  slug: string; keyword: string; nav: string; title: string; h1: string; intro: string; sections: string[];
  points: string[]; process: string[]; faq: [string, string][]; group?: "main" | "more" | "region";
};
export const SERVICES: Service[] = content.services as Service[];
/** Shown as cards on the home page; the rest are linked from the footer only. */
export const MAIN_SERVICES = SERVICES.filter((s) => (s.group ?? "main") === "main");
export const MORE_SERVICES = SERVICES.filter((s) => s.group === "more");
export const REGION_PAGES = SERVICES.filter((s) => s.group === "region");
export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
