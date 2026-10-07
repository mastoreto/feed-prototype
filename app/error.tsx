"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-none px-4 md:px-14 grid min-h-dvh max-w-[60ch] content-center gap-4 bg-brand px-4 text-on-brand">
      <h1 className="disp text-[clamp(32px,6vw,56px)]">Algo salió mal</h1>
      <p className="">
        No pudimos cargar esta página. Inténtalo de nuevo; si el problema sigue,
        recarga o vuelve más tarde.
      </p>
      <button type="button" className="btn btn-wht w-fit" onClick={reset}>
        Reintentar
      </button>
    </main>
  );
}
