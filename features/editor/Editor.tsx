"use client";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  GripVertical,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { AdSlot } from "@/features/ads/AdSlot";
import { ExportDialog } from "@/features/export/ExportDialog";
import { bgOf, coverOf, SCENE_COUNT } from "@/features/platforms/media";
import { hasSafeZones, Overview, Piece } from "@/features/platforms/render";
import {
  FORMATS,
  type Format,
  formatInfo,
  MAX_CAPTION,
  newPost,
  OVERVIEW,
  type Platform,
  type PostDraft,
  type Profile,
  type View,
} from "@/features/platforms/types";
import { cn } from "@/lib/cn";
import { fileToJpeg } from "./images";
import { useDesktop } from "./useDesktop";

type Tab = "copy" | "img" | "note";
const SLIDE_FORMATS: Format[] = ["carousel", "doc"];

const toLocalInput = (d: Date | null) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

type Props = {
  platform: Platform;
  posts: PostDraft[];
  onPosts: (p: PostDraft[]) => void;
  profile: Profile;
  /** Left part of the top bar (campaign name, network switch…) */
  toolbar: ReactNode;
};

export function Editor({ platform, posts, onPosts, profile, toolbar }: Props) {
  const desktop = useDesktop();
  const [sel, setSel] = useState(0);
  const [view, setView] = useState<View>("piece");
  const [safe, setSafe] = useState(true);
  const [tab, setTab] = useState<Tab>("copy");
  const [sheetOpen, setSheetOpen] = useState(false); // mobile: collapsed by default so the piece stays visible
  const [exporting, setExporting] = useState(false);
  const index = Math.min(sel, posts.length - 1);
  const post = posts[index];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const move = (from: number, to: number) => {
    if (to < 0 || to >= posts.length) return;
    onPosts(arrayMove(posts, from, to));
    setSel(to);
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id)
      move(
        posts.findIndex((p) => p.id === active.id),
        posts.findIndex((p) => p.id === over.id),
      );
  };
  const patch = (p: Partial<PostDraft>) =>
    onPosts(posts.map((x) => (x.id === post.id ? { ...x, ...p } : x)));
  const add = () => {
    onPosts([...posts, newPost(posts.length * 2 + 1)]);
    setSel(posts.length);
    setView("piece");
  };
  const remove = () => {
    onPosts(posts.filter((p) => p.id !== post.id));
    setSel(Math.max(0, index - 1));
  };

  async function addFiles(files: FileList | File[]) {
    const imgs = await Promise.all(
      [...files]
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => fileToJpeg(f)),
    );
    addMedia(imgs);
  }
  function addMedia(srcs: string[]) {
    if (!srcs.length) return;
    // slide formats append (max 10); single-image formats replace
    patch({
      media: SLIDE_FORMATS.includes(post.format)
        ? [...post.media.filter((m) => !m.startsWith("art:")), ...srcs].slice(
            0,
            10,
          )
        : [srcs[0]],
    });
  }

  // Both wrappers reserve their height in CSS, so the unit mounting after hydration causes no layout shift.
  const barDesktop = (
    <div className="hidden min-h-[107px] justify-center border-b border-hair bg-paper px-4 py-2 md:flex">
      {desktop && <AdSlot kind="bar" />}
    </div>
  );
  const barMobile = (
    <div className="order-3 flex min-h-[67px] justify-center border-b border-hair bg-paper px-3 py-2 md:hidden">
      {!desktop && <AdSlot kind="bar-m" />}
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="rule-b flex flex-wrap items-center gap-3 bg-paper px-3 py-2.5 md:px-4">
        <div className="mr-auto flex min-w-0 flex-1 flex-wrap items-center gap-3">
          {toolbar}
        </div>
        <button
          type="button"
          className="btn btn-pri"
          onClick={() => setExporting(true)}
          disabled={!posts.length}
        >
          <Download className="i" /> Exportar
        </button>
      </div>
      {barDesktop}

      <div className="flex min-h-[640px] flex-col md:grid md:grid-cols-[240px_minmax(0,1fr)_340px]">
        {/* pieces */}
        <aside
          className="rule-t md:rule-r order-2 grid content-start gap-2 bg-paper p-3 md:order-1 md:border-t-0 md:p-3.5"
          aria-label="Publicaciones"
        >
          <div className="flex items-center justify-between">
            <h3 className="field-label">Publicaciones ({posts.length})</h3>
            <button
              type="button"
              className="btn min-h-11 px-2.5 py-1 md:min-h-9"
              onClick={add}
            >
              <Plus className="i" />
              Añadir
            </button>
          </div>
          <DndContext
            id="pieces"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={posts.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1 md:grid md:overflow-visible">
                {posts.map((p, i) => (
                  <Item
                    key={p.id}
                    p={p}
                    i={i}
                    selected={i === index}
                    desktop={desktop}
                    count={posts.length}
                    onSelect={() => {
                      setSel(i);
                      setView("piece");
                    }}
                    onMove={(d) => move(i, i + d)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </aside>

        {/* canvas */}
        <section
          className="order-1 grid content-start justify-items-center gap-4 bg-desk pb-9 pt-3.5 md:order-2 md:p-5 md:pb-11"
          aria-label="Lienzo"
        >
          {post ? (
            <>
              <div className="flex w-full flex-nowrap items-center gap-3 overflow-x-auto px-3 md:w-auto md:flex-wrap md:justify-center md:px-0">
                <div className="seg shrink-0" role="group" aria-label="Formato">
                  {FORMATS[platform].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={view === "piece" && post.format === f.id}
                      onClick={() => {
                        setView("piece");
                        patch({ format: f.id });
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-pressed={view === "overview"}
                    onClick={() => setView("overview")}
                  >
                    {OVERVIEW[platform].label}
                  </button>
                </div>
                {view === "piece" && hasSafeZones(platform, post.format) && (
                  <label className="chip shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safe}
                      onChange={(e) => setSafe(e.target.checked)}
                    />{" "}
                    Zonas seguras
                  </label>
                )}
              </div>
              <div className="stage grid w-full justify-items-center md:block md:w-auto">
                <motion.div
                  key={`${view}-${post.id}-${post.format}`}
                  className="grid w-full justify-items-center md:block md:w-auto"
                  initial={{ opacity: 0, scale: 0.985, filter: "blur(2px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                >
                  {view === "piece" ? (
                    <Piece
                      platform={platform}
                      post={post}
                      profile={profile}
                      safe={safe}
                    />
                  ) : (
                    <Overview
                      platform={platform}
                      posts={posts}
                      profile={profile}
                      selected={index}
                    />
                  )}
                </motion.div>
                <i className="c1" />
                <i className="c2" />
                <span className="lab absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-ink2 md:block">
                  {view === "piece"
                    ? formatInfo(platform, post.format).spec
                    : OVERVIEW[platform].spec}
                </span>
              </div>
            </>
          ) : (
            <div className="rule m-6 grid max-w-sm gap-3 bg-paper p-6 text-center">
              <h3 className="text-xl font-bold">Empieza con una publicación</h3>
              <p className="text-ink2">
                Añade la primera pieza, carga su imagen y escribe el copy.
              </p>
              <button type="button" className="btn btn-pri" onClick={add}>
                <Plus className="i" />
                Añadir publicación
              </button>
            </div>
          )}
        </section>

        {barMobile}

        {/* inspector (bottom sheet on mobile) */}
        {post && (
          <aside
            className="rule-t md:rule-l order-4 sticky bottom-0 z-10 grid max-h-[38vh] content-start gap-3 overflow-auto bg-paper px-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_24px_-16px_rgba(0,0,0,.45)] md:static md:order-3 md:max-h-none md:gap-4 md:border-t-0 md:p-4 md:shadow-none"
            aria-label="Inspector"
          >
            <h3 className="field-label hidden md:block">
              Publicación {index + 1}
            </h3>
            <div
              className="rule-b sticky top-0 z-[1] -mx-3 flex items-stretch bg-paper px-3 md:hidden"
              role="tablist"
            >
              {(
                [
                  ["copy", "Copy"],
                  ["img", "Imagen"],
                  ["note", "Notas"],
                ] as const
              ).map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  className={cn(
                    "-mb-px min-h-11 flex-1 border-b-4 font-semibold",
                    tab === k && sheetOpen
                      ? "border-brand"
                      : "border-transparent",
                  )}
                  aria-selected={tab === k}
                  onClick={() => {
                    setTab(k);
                    setSheetOpen(true);
                  }}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                className="grid size-11 place-items-center"
                aria-label={sheetOpen ? "Contraer panel" : "Expandir panel"}
                aria-expanded={sheetOpen}
                onClick={() => setSheetOpen(!sheetOpen)}
              >
                {sheetOpen ? (
                  <ChevronDown className="i" />
                ) : (
                  <ChevronUp className="i" />
                )}
              </button>
            </div>

            <div
              className={cn(
                "gap-4",
                tab === "copy" && sheetOpen ? "grid" : "hidden",
                "md:grid",
              )}
            >
              <div className="grid gap-1">
                <label className="field-label" htmlFor="cap">
                  Copy
                </label>
                <textarea
                  id="cap"
                  className="field md:min-h-40"
                  rows={4}
                  value={post.caption}
                  onChange={(e) => patch({ caption: e.target.value })}
                />
                <div
                  className={cn(
                    "text-right font-mono text-[11px] text-ink2",
                    post.caption.length > MAX_CAPTION[platform] && "text-red",
                  )}
                >
                  {post.caption.length} /{" "}
                  {MAX_CAPTION[platform].toLocaleString("es")}
                </div>
              </div>
              <div className="grid gap-1">
                <label className="field-label" htmlFor="tags">
                  Hashtags
                </label>
                <input
                  id="tags"
                  className="field"
                  value={post.hashtags}
                  onChange={(e) => patch({ hashtags: e.target.value })}
                  placeholder="#marca #campaña"
                />
              </div>
            </div>

            <div
              className={cn(
                "gap-3",
                tab === "img" && sheetOpen ? "grid" : "hidden",
                "md:grid",
              )}
            >
              <span className="field-label">
                Imagen{SLIDE_FORMATS.includes(post.format) ? "s (láminas)" : ""}
              </span>
              {post.media.length > 0 && (
                <ul className="m-0 grid list-none grid-cols-5 gap-1.5 p-0">
                  {post.media.map((m, k) => (
                    <li
                      key={k}
                      className="relative aspect-[4/5]"
                      style={{
                        backgroundImage: bgOf(m),
                        backgroundSize: "cover",
                      }}
                    >
                      <button
                        type="button"
                        aria-label={`Quitar imagen ${k + 1}`}
                        className="absolute right-0 top-0 grid size-6 place-items-center bg-ink text-paper"
                        onClick={() =>
                          patch({ media: post.media.filter((_, j) => j !== k) })
                        }
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <label
                className="flex cursor-pointer items-center justify-center gap-2 border-[1.5px] border-dashed border-ink2 p-3 text-center text-ink2 focus-within:outline focus-within:outline-[3px] focus-within:outline-brand"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
              >
                <ImagePlus className="i" /> Arrastra imágenes o{" "}
                <u>sube archivos</u>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <div className="grid gap-1.5">
                <span className="field-label">Imágenes de muestra</span>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: SCENE_COUNT }, (_, k) => (
                    <button
                      key={k}
                      type="button"
                      aria-label={`Muestra ${k + 1}`}
                      className="aspect-[4/5] border-2 border-transparent bg-cover transition-transform active:scale-95"
                      style={{ backgroundImage: bgOf(`art:${k}`) }}
                      onClick={() => addMedia([`art:${k}`])}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "gap-4",
                tab === "note" && sheetOpen ? "grid" : "hidden",
                "md:grid",
              )}
            >
              <div className="grid gap-1">
                <label className="field-label" htmlFor="notes">
                  Nota para el cliente
                </label>
                <textarea
                  id="notes"
                  className="field !border-red"
                  rows={3}
                  value={post.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                  placeholder="Qué debe fijarse el cliente en esta pieza"
                />
              </div>
              <div className="grid gap-1">
                <label className="field-label" htmlFor="when">
                  Publicación sugerida
                </label>
                <input
                  id="when"
                  type="datetime-local"
                  className="field"
                  value={toLocalInput(post.scheduledAt)}
                  onChange={(e) =>
                    patch({
                      scheduledAt: e.target.value
                        ? new Date(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
              <button type="button" className="btn text-red" onClick={remove}>
                Eliminar publicación
              </button>
            </div>
          </aside>
        )}
      </div>

      <ExportDialog
        open={exporting}
        onClose={() => setExporting(false)}
        platform={platform}
        posts={posts}
        index={index}
        profile={profile}
        overview={view === "overview"}
      />
    </div>
  );
}

function Item({
  p,
  i,
  selected,
  desktop,
  count,
  onSelect,
  onMove,
}: {
  p: PostDraft;
  i: number;
  selected: boolean;
  desktop: boolean;
  count: number;
  onSelect: () => void;
  onMove: (d: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "w-[92px] shrink-0 border border-hair bg-paper md:w-auto",
        selected &&
          "border-ink shadow-[inset_0_3px_0_var(--blue)] md:shadow-[inset_3px_0_0_var(--blue)]",
        isDragging && "relative z-10 opacity-60",
      )}
    >
      <div className="flex items-center md:gap-1">
        <button
          type="button"
          aria-label={`Reordenar publicación ${i + 1}`}
          className="hidden touch-none cursor-grab self-stretch px-1 text-ink2 md:block"
          {...attributes}
          {...(desktop ? listeners : {})}
        >
          <GripVertical className="i" />
        </button>
        <button
          type="button"
          onClick={onSelect}
          aria-current={selected}
          className="grid min-w-0 flex-1 justify-items-center gap-1.5 p-1.5 text-left md:grid-cols-[38px_minmax(0,1fr)] md:items-center md:justify-items-stretch md:gap-2.5"
        >
          <i
            className="block aspect-[4/5] w-full bg-cover md:h-12 md:w-[38px]"
            style={{ backgroundImage: bgOf(coverOf(p)) }}
          />
          <span className="min-w-0 md:block">
            <b className="hidden truncate text-[13px] md:block">
              {p.caption.split(/[.\n]/)[0] || "Sin copy"}
            </b>
            <small className="text-[11px] text-ink2">
              {p.format} · {i + 1}
            </small>
          </span>
        </button>
      </div>
      {selected && (
        <div className="flex justify-center gap-1.5 p-1.5 pt-0 md:hidden">
          <button
            type="button"
            aria-label="Mover antes"
            className="rule grid size-11 shrink-0 place-items-center bg-paper disabled:opacity-40"
            disabled={i === 0}
            onClick={() => onMove(-1)}
          >
            <ChevronLeft className="i" />
          </button>
          <button
            type="button"
            aria-label="Mover después"
            className="rule grid size-11 shrink-0 place-items-center bg-paper disabled:opacity-40"
            disabled={i === count - 1}
            onClick={() => onMove(1)}
          >
            <ChevronRight className="i" />
          </button>
        </div>
      )}
    </li>
  );
}
