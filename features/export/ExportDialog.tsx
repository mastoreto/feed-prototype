"use client";
import { toPng } from "html-to-image";
import { Download, ShieldCheck, X } from "lucide-react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PinLayer } from "@/features/platforms/PinLayer";
import { hasSafeZones, Overview, Piece } from "@/features/platforms/render";
import type { Platform, PostDraft, Profile } from "@/features/platforms/types";
import { Sheet } from "./Sheet";

type What = "piece" | "overview" | "all";

/** Scales its child down to fit the available width. The child itself stays full size (that node is what we export). */
function Scaled({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ s: 1, h: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current || !inner.current) return;
      const s = Math.min(
        1,
        box.current.clientWidth / inner.current.scrollWidth,
      );
      setFit({ s, h: inner.current.scrollHeight * s });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={box}
      className="w-full overflow-hidden"
      style={{ height: fit.h || undefined }}
    >
      <div
        ref={inner}
        style={{
          width: "max-content",
          transform: `scale(${fit.s})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Surface({
  node,
  platform,
  post,
  posts,
  profile,
  what,
  sheet,
  index,
}: {
  node: RefObject<HTMLDivElement | null>;
  platform: Platform;
  post: PostDraft;
  posts: PostDraft[];
  profile: Profile;
  what: What;
  sheet: boolean;
  index: number;
}) {
  const tall = post.format === "story" || post.format === "reel";
  const width =
    what === "overview"
      ? platform === "INSTAGRAM"
        ? 390
        : 500
      : platform === "LINKEDIN"
        ? 500
        : tall
          ? 270
          : 320;
  return (
    // Export surface: plain markup, no ads, no app UI.
    <div
      ref={node}
      className="flex items-start gap-6 bg-white p-6 text-[#111]"
      style={{ width: "fit-content" }}
    >
      <div className="relative" style={{ width }}>
        {what === "overview" ? (
          <Overview
            platform={platform}
            posts={posts}
            profile={profile}
            selected={index}
          />
        ) : (
          <Piece
            platform={platform}
            post={post}
            profile={profile}
            safe={false}
          />
        )}
        {sheet && what !== "overview" && <PinLayer pins={post.pins} />}
      </div>
      {sheet && what !== "overview" && (
        <Sheet
          platform={platform}
          post={post}
          profile={profile}
          pins={post.pins}
        />
      )}
    </div>
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "feed";
const frame = () =>
  new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );

export function ExportDialog({
  open,
  onClose,
  platform,
  posts,
  index,
  profile,
  overview,
}: {
  open: boolean;
  onClose: () => void;
  platform: Platform;
  posts: PostDraft[];
  index: number;
  profile: Profile;
  overview: boolean;
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  const node = useRef<HTMLDivElement>(null);
  const [what, setWhat] = useState<What>("piece");
  const [sheet, setSheet] = useState(true);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState<string | null>(null);
  const [cur, setCur] = useState(index);
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      setWhat(overview ? "overview" : "piece");
      setCur(index);
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open, overview, index]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the surface layout changes
  useEffect(() => {
    if (!open || !node.current) return;
    const el = node.current;
    const ro = new ResizeObserver(() =>
      setSize([el.offsetWidth, el.offsetHeight]),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, what, cur, sheet]);

  const post = posts[Math.min(cur, posts.length - 1)];
  if (!post) return <dialog ref={dlg} className="dlg" onClose={onClose} />;

  async function save(name: string) {
    if (!node.current) return;
    const url = await toPng(node.current, {
      pixelRatio: scale,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.png`;
    a.click();
  }

  async function download() {
    const base = `${slug(profile.campaign)}-${platform.toLowerCase()}`;
    try {
      if (what === "all") {
        for (let i = 0; i < posts.length; i++) {
          setBusy(`Generando ${i + 1} de ${posts.length}…`);
          setCur(i);
          await frame();
          await save(`${base}-${i + 1}`);
        }
        setCur(index);
      } else {
        setBusy("Generando imagen…");
        await save(`${base}-${what === "overview" ? "feed" : index + 1}`);
      }
    } finally {
      setBusy(null);
    }
  }

  const opts: [What, string][] = [
    ["piece", "Pieza actual"],
    [
      "overview",
      platform === "INSTAGRAM" ? "Grilla de perfil" : "Feed completo",
    ],
    ["all", "Todas las piezas (una imagen cada una)"],
  ];

  return (
    <dialog ref={dlg} className="dlg" onClose={onClose} aria-label="Exportar">
      <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(0,.65fr)]">
        <div className="grid min-h-[320px] min-w-0 content-start bg-desk p-4 md:min-h-[540px] md:p-7">
          <div className="rule w-full min-w-0 bg-white">
            <Scaled>
              <Surface
                node={node}
                platform={platform}
                post={post}
                posts={posts}
                profile={profile}
                what={what}
                sheet={sheet}
                index={index}
              />
            </Scaled>
          </div>
        </div>
        <div className="rule-t md:rule-l grid content-start gap-5 p-4 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="disp text-[30px]">Exportar</h2>
            <button
              type="button"
              className="btn"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <X className="i" />
            </button>
          </div>
          <fieldset className="grid border-0 p-0">
            <legend className="field-label mb-1.5">Qué descargar</legend>
            {opts.map(([v, t], i) => (
              <label
                key={v}
                className={`rule-t flex min-h-12 cursor-pointer items-center gap-3 px-1 py-2.5 font-semibold transition-colors has-[:checked]:bg-brand has-[:checked]:px-2.5 has-[:checked]:text-on-brand ${i === opts.length - 1 ? "rule-b" : ""}`}
              >
                <input
                  type="radio"
                  name="what"
                  className="size-4 accent-[var(--ink)]"
                  checked={what === v}
                  onChange={() => setWhat(v)}
                />{" "}
                {t}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center justify-between gap-3">
            <span>
              <b>Hoja ampliada</b>
              <br />
              <small className="text-ink2">
                Copy completo, medidas y notas
              </small>
            </span>
            <input
              type="checkbox"
              className="size-5 accent-[var(--blue)]"
              checked={sheet && what !== "overview"}
              disabled={what === "overview"}
              onChange={(e) => setSheet(e.target.checked)}
            />
          </label>
          <div className="grid gap-1.5">
            <span className="field-label">Escala</span>
            <div className="seg w-fit" role="group">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={scale === s}
                  onClick={() => setScale(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
          <div className="rule-t sticky bottom-0 z-10 -mx-4 bg-paper px-4 py-3 md:static md:mx-0 md:border-0 md:p-0">
            <button
              type="button"
              className="btn btn-pri btn-lg w-full"
              onClick={download}
              disabled={!!busy}
            >
              <Download className="i" />{" "}
              {busy ?? (
                <>
                  Descargar PNG ·{" "}
                  <span className="font-mono text-[12.5px]">
                    {size[0] * scale}×{size[1] * scale}
                  </span>
                </>
              )}
            </button>
          </div>
          <p className="flex gap-2 text-[12.5px] text-ink2">
            <ShieldCheck className="i" />
            La imagen no incluye anuncios ni datos de tu cuenta.
          </p>
          {hasSafeZones(platform, post.format) && (
            <p className="text-[12.5px] text-ink2">
              Las zonas seguras no se incluyen en la imagen exportada.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
