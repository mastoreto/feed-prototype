export type Platform = "INSTAGRAM" | "LINKEDIN";
export type Format = "post" | "carousel" | "story" | "reel" | "doc";
/** What the canvas shows: one piece, or the whole campaign laid out (profile grid / timeline). */
export type View = "piece" | "overview";

/** A red-pen note anchored on the piece; x/y are percentages of the piece box. */
export type Pin = { id: string; x: number; y: number; text: string };

export type PostDraft = {
  id: string;
  format: Format;
  caption: string;
  hashtags: string;
  notes: string;
  /** "art:N" placeholder ids or resized JPEG data URLs */
  media: string[];
  pins: Pin[];
  scheduledAt: Date | null;
};

export type Profile = { name: string; handle: string; campaign: string };

export type FormatInfo = {
  id: Format;
  label: string;
  spec: string;
  size: [number, number];
};

export const NETWORK_NAME: Record<Platform, string> = {
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
};

export const FORMATS: Record<Platform, FormatInfo[]> = {
  INSTAGRAM: [
    { id: "post", label: "Post", spec: "4:5 · 1080×1350", size: [1080, 1350] },
    {
      id: "carousel",
      label: "Carrusel",
      spec: "4:5 · 1080×1350 · láminas",
      size: [1080, 1350],
    },
    {
      id: "story",
      label: "Historia",
      spec: "9:16 · 1080×1920",
      size: [1080, 1920],
    },
    { id: "reel", label: "Reel", spec: "9:16 · 1080×1920", size: [1080, 1920] },
  ],
  LINKEDIN: [
    { id: "post", label: "Post", spec: "1:1 · 1200×1200", size: [1200, 1200] },
    {
      id: "doc",
      label: "Documento",
      spec: "4:5 · 1080×1350 · PDF",
      size: [1080, 1350],
    },
  ],
};

export const OVERVIEW: Record<Platform, { label: string; spec: string }> = {
  INSTAGRAM: { label: "Grilla", spec: "perfil · 3 columnas" },
  LINKEDIN: { label: "Feed", spec: "timeline" },
};

export const formatInfo = (p: Platform, f: Format) =>
  FORMATS[p].find((x) => x.id === f) ?? FORMATS[p][0];
export const MAX_CAPTION: Record<Platform, number> = {
  INSTAGRAM: 2200,
  LINKEDIN: 3000,
};

export function newPost(n = 0): PostDraft {
  return {
    id: crypto.randomUUID(),
    format: "post",
    caption: "",
    hashtags: "",
    notes: "",
    media: [`art:${n % 6}`],
    pins: [],
    scheduledAt: null,
  };
}
