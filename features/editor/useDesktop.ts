import { useSyncExternalStore } from "react";

const Q = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(Q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Matches Tailwind `md`. Used where we must render ONE variant (e.g. one ad unit), not hide with CSS. */
export const useDesktop = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(Q).matches,
    () => true,
  );
