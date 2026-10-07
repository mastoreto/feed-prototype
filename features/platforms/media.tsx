import type { PostDraft } from "./types";

// Placeholder "photography": inline SVG scenes so the tool has realistic content before any upload.
const SCENES = [
  `<rect width="400" height="500" fill="#E6D3BC"/><circle cx="200" cy="250" r="158" fill="#4E3222"/><circle cx="200" cy="250" r="132" fill="#8B5E3C"/><circle cx="200" cy="250" r="100" fill="#D8B185"/><path d="M200 175c34 30 34 80 0 150-34-70-34-120 0-150z" fill="#F4E6D2"/><path d="M200 190v120" stroke="#8B5E3C" stroke-width="5"/>`,
  `<rect width="400" height="500" fill="#BCD6DE"/><circle cx="290" cy="150" r="58" fill="#F7C95C"/><path d="M0 330c90-90 170-70 240-20s120 20 160-30v220H0z" fill="#6E9D74"/><path d="M0 410c110-70 200-30 290 10 40 18 80 10 110-10v90H0z" fill="#3D6B4F"/>`,
  `<rect width="400" height="500" fill="#1F3B4D"/><rect x="150" y="90" width="100" height="340" rx="22" fill="#F1EBE0"/><rect x="172" y="60" width="56" height="48" rx="8" fill="#D8B185"/><rect x="150" y="230" width="100" height="110" fill="#E9632E"/><circle cx="200" cy="285" r="26" fill="#F1EBE0"/>`,
  `<rect width="400" height="500" fill="#EE6A4D"/><path d="M-50 380 280-60l90 0L40 500z" fill="#F7B5A0"/><path d="M110 560 440 120v110L190 560z" fill="#2B2B3A"/><circle cx="110" cy="130" r="46" fill="#FFE3B3"/>`,
  `<rect width="400" height="500" fill="#D7E3CE"/><path d="M40 500V260a80 80 0 0 1 160 0v240z" fill="#F0B9B0"/><path d="M200 500V200a80 80 0 0 1 160 0v300z" fill="#9DBD9B"/><circle cx="120" cy="150" r="30" fill="#FFF3D6"/>`,
  `<rect width="400" height="500" fill="#2B2B3A"/><path d="M110 130h180l24 300H86z" fill="#E9C46A"/><path d="M135 130c0-50 130-50 130 0" fill="none" stroke="#E9C46A" stroke-width="10"/><rect x="146" y="250" width="108" height="90" rx="6" fill="#2B2B3A"/><circle cx="200" cy="295" r="22" fill="#E9C46A"/>`,
];

export const SCENE_COUNT = SCENES.length;

/** CSS background-image for "art:N" placeholders or an uploaded data URL. */
export function bgOf(src: string) {
  if (src.startsWith("art:")) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='xMidYMid slice'>${SCENES[Number(src.slice(4)) % SCENES.length]}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  return `url("${src}")`;
}

export function Photo({
  src,
  ratio = "4/5",
  label = "Imagen de la publicación",
}: {
  src: string;
  ratio?: string;
  label?: string;
}) {
  return (
    <div
      className="ph"
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio, backgroundImage: bgOf(src) }}
    />
  );
}

const hash = (s: string) =>
  [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Cover image for a post (first media, or a deterministic placeholder). */
export const coverOf = (p: PostDraft) =>
  p.media[0] ?? `art:${hash(p.id) % SCENES.length}`;

/** Slides for carousel/document formats: real media, topped up with placeholders to at least `min`. */
export function slidesOf(p: PostDraft, min = 3) {
  const out = [...p.media];
  for (let k = 0; out.length < min; k++)
    out.push(`art:${(hash(p.id) + k + 1) % SCENES.length}`);
  return out;
}
