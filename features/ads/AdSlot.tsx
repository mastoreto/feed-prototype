"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// NEXT_PUBLIC_* must be referenced statically to be inlined by Next.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOTS = {
  dash: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASH,
  bar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR,
  "bar-m": process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR,
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT,
};
const SIZE = {
  dash: [300, 250],
  bar: [728, 90],
  "bar-m": [320, 50],
  content: [336, 280],
} as const;

export type AdKind = keyof typeof SIZE;

/**
 * One AdSense unit with its size reserved up front (no layout shift).
 * Without a publisher id / slot id (dev) it renders a labelled placeholder instead.
 * Never place this inside an exported surface.
 */
export function AdSlot({
  kind,
  className = "",
}: {
  kind: AdKind;
  className?: string;
}) {
  const [w, h] = SIZE[kind];
  const slot = SLOTS[kind];
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle ??= [];
      window.adsbygoogle.push({});
    } catch {
      /* blocked or not loaded: the AdBlockGate handles the blocked case */
    }
  }, [slot]);

  return (
    <div
      className={`ad-box ${className}`}
      style={{ width: w, height: h, maxWidth: "100%" }}
    >
      <span className="ad-tag">Publicidad</span>
      {CLIENT && slot ? (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: w, height: h }}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
        />
      ) : (
        <span className="font-mono text-[10px]">
          AdSense · {w}×{h}
        </span>
      )}
    </div>
  );
}
