import content from "@/content/services.json";

export type Service = {
  slug: string; keyword: string; nav: string; title: string; h1: string; intro: string; sections: string[];
  points: string[]; process: string[]; faq: [string, string][];
};
export const SERVICES: Service[] = content.services as Service[];
export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
