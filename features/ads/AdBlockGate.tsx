"use client";
import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const FLAG = process.env.NEXT_PUBLIC_ADBLOCK_GATE;
// On in production once AdSense is configured; "on" forces it in dev, "off" disables it.
const ENABLED =
  !!CLIENT &&
  (FLAG === "on" || (FLAG !== "off" && process.env.NODE_ENV === "production"));

/** true when an ad blocker is hiding ad-looking elements or blocking Google's ad script. */
async function isBlocked() {
  const bait = document.createElement("div");
  bait.className = "adsbox ad-banner ad-placement textads banner-ads";
  bait.style.cssText =
    "position:absolute;left:-9999px;top:0;width:10px;height:10px";
  document.body.appendChild(bait);
  await new Promise((r) => setTimeout(r, 120));
  const cs = getComputedStyle(bait);
  const hidden =
    bait.offsetHeight === 0 ||
    cs.display === "none" ||
    cs.visibility === "hidden";
  bait.remove();
  if (hidden) return true;
  try {
    await fetch(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      { method: "HEAD", mode: "no-cors", cache: "no-store" },
    );
    return false;
  } catch {
    return true;
  }
}

type State = "checking" | "ok" | "blocked";

// ponytail: client-side only, so it can be bypassed; it stops casual use, not a determined user.
export function AdBlockGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(ENABLED ? "checking" : "ok");
  const [retried, setRetried] = useState(false);

  const check = useCallback(async () => {
    setState("checking");
    setState((await isBlocked()) ? "blocked" : "ok");
  }, []);

  useEffect(() => {
    if (ENABLED) check();
  }, [check]);

  if (state === "ok") return children;
  if (state === "checking")
    return (
      <div
        className="grid min-h-dvh place-items-center lab text-ink2"
        role="status"
      >
        Comprobando…
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-[var(--scrim)] md:place-items-center md:p-6"
      role="alertdialog"
      aria-labelledby="gate-h"
    >
      <div className="rule grid w-full max-w-[580px] gap-5 bg-paper p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-9">
        <h2 id="gate-h" className="disp text-[clamp(26px,5vw,38px)]">
          Desactiva tu bloqueador para usar Feed Prototype
        </h2>
        <p className="text-ink2">
          La herramienta es gratis porque se paga con anuncios. Detectamos un
          bloqueador activo en este sitio.
        </p>
        <ol className="rule-t m-0 list-none p-0">
          {[
            "Abre el icono de tu bloqueador en la barra del navegador.",
            "Elige «Pausar en este sitio» o añade este sitio a la lista de permitidos.",
            "Vuelve aquí y pulsa el botón.",
          ].map((t, i) => (
            <li key={t} className="rule-b flex gap-3.5 py-3">
              <b className="lab pt-0.5 text-red">{i + 1}</b>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="flex gap-2.5 text-[13px] text-ink2">
          <ShieldCheck className="i mt-0.5 text-brand" />
          Dos espacios de anuncios en total. Ninguno sobre tu lienzo ni en el
          PNG que descargas.
        </p>
        <div>
          <button
            type="button"
            className="btn btn-pri btn-lg w-full"
            onClick={async () => {
              setRetried(true);
              await check();
            }}
          >
            Ya lo desactivé
          </button>
          {retried && (
            <p className="mt-2 min-h-5 text-[13px] text-red" role="status">
              Seguimos detectando el bloqueo. Recarga la página tras
              desactivarlo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
