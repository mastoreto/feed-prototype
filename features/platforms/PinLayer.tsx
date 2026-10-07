"use client";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { Pin } from "./types";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

type Props = {
  pins: Pin[];
  /** Editor mode: pins can be selected and dragged. Without it pins are plain markup (export, landing). */
  interactive?: boolean;
  /** Clicking an empty spot of the piece adds a pin. */
  annotating?: boolean;
  active?: string | null;
  onAdd?: (x: number, y: number) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onSelect?: (id: string) => void;
  /** Editing bubble next to the active pin. */
  onText?: (id: string, text: string) => void;
  onRemove?: (id: string) => void;
  onClose?: () => void;
};

function PinNote({
  pin,
  n,
  onText,
  onRemove,
  onClose,
}: {
  pin: Pin;
  n: number;
  onText?: Props["onText"];
  onRemove?: Props["onRemove"];
  onClose?: Props["onClose"];
}) {
  const input = useRef<HTMLInputElement>(null);
  // preventScroll: the piece must stay in view while the note is typed
  useEffect(() => input.current?.focus({ preventScroll: true }), []);
  return (
    <div
      className="pointer-events-auto absolute z-[5] flex w-[230px] max-w-[72vw] items-center gap-1 border-[1.5px] border-red bg-paper p-1 text-ink"
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: `translate(${pin.x > 55 ? "calc(-100% + 12px)" : "-12px"}, 20px)`,
      }}
    >
      <input
        ref={input}
        className="field !min-h-10 min-w-0 flex-1 !border-0 !px-1 !text-[15px]"
        aria-label={`Texto de la nota ${n}`}
        value={pin.text}
        maxLength={300}
        placeholder="Qué debe mirar el cliente"
        onChange={(e) => onText?.(pin.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            onClose?.();
          }
        }}
      />
      <button
        type="button"
        className="grid size-10 shrink-0 place-items-center text-red"
        aria-label={`Quitar nota ${n}`}
        onClick={() => onRemove?.(pin.id)}
      >
        <X className="i" />
      </button>
    </div>
  );
}

/** Red-pen notes drawn over a piece. Must sit in a `relative` box that has exactly the piece's size. */
export function PinLayer({
  pins,
  interactive,
  annotating,
  active,
  onAdd,
  onMove,
  onSelect,
  onText,
  onRemove,
  onClose,
}: Props) {
  const layer = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; moved: boolean } | null>(null);

  const at = (e: { clientX: number; clientY: number }) => {
    const r = layer.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100),
    };
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: pointer shortcut; the keyboard path is the "Añadir nota" button in the inspector
    <div
      ref={layer}
      className={cn(
        "absolute inset-0 z-[3]",
        annotating ? "cursor-crosshair" : "pointer-events-none",
      )}
      onClick={(e) => {
        if (annotating && e.target === e.currentTarget) {
          const { x, y } = at(e);
          onAdd?.(x, y);
        }
      }}
    >
      {interactive && active && pins.some((q) => q.id === active) && (
        <PinNote
          pin={pins.find((q) => q.id === active) as Pin}
          n={pins.findIndex((q) => q.id === active) + 1}
          onText={onText}
          onRemove={onRemove}
          onClose={onClose}
        />
      )}
      {pins.map((p, i) =>
        interactive ? (
          <button
            key={p.id}
            type="button"
            className="pin pin-edit"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-label={`Nota ${i + 1}${p.text ? `: ${p.text}` : ""}`}
            aria-current={active === p.id}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { id: p.id, moved: false };
            }}
            onPointerMove={(e) => {
              if (drag.current?.id !== p.id) return;
              drag.current.moved = true;
              const { x, y } = at(e);
              onMove?.(p.id, x, y);
            }}
            onPointerUp={() => {
              if (drag.current && !drag.current.moved) onSelect?.(p.id);
              drag.current = null;
            }}
            onKeyDown={(e) => {
              // keyboard: arrows nudge the active pin by 1%
              const d = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
              }[e.key];
              if (d) {
                e.preventDefault();
                onMove?.(p.id, clamp(p.x + d[0]), clamp(p.y + d[1]));
              } else if (e.key === "Enter" || e.key === " ") onSelect?.(p.id);
            }}
          >
            {i + 1}
          </button>
        ) : (
          <span
            key={p.id}
            className="pin"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {i + 1}
          </span>
        ),
      )}
    </div>
  );
}
