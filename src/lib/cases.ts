import content from "@/content/cases.json";

export type CaseStudy = {
  slug: string; client: string; location?: string; title: string; summary: string; services: string[]; status?: string;
  challenge: string[]; approach: string[]; results: string[]; videos: { id: string; title: string; file?: string; poster?: string }[]; cover?: string;
};
export const CASES: CaseStudy[] = content.cases as CaseStudy[];
export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
