import content from "@/content/videos.json";

/**
 * The work sections and their videos. All of it lives in src/content/videos.json so it can be edited from the
 * Nova portal (Only you → Portfolio) without touching code: add a section, rename it, add or reorder videos.
 * Each video is a Google Drive file id and a title.
 */
export type VideoEntry = { id: string; title: string };
export type WorkLayout = "wide" | "reels" | "square";
export type WorkSection = { id: string; eyebrow: string; title: string; subtitle?: string; layout: WorkLayout; videos: VideoEntry[] };

export const WORK: WorkSection[] = (content.sections as WorkSection[]).filter((s) => s.videos.length > 0);

// Helper function to generate the direct download link from a file ID
export const getDriveDirectLink = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
};

// Helper function to fetch the auto-generated thumbnail from Google Drive
export const getDriveThumbnail = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};
