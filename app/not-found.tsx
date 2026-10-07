import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-[60ch] content-center gap-4 bg-paper px-4">
      <h1 className="disp text-[clamp(32px,6vw,56px)]">
        No encontramos esa página
      </h1>
      <p className="text-ink2">
        El enlace puede estar roto o la página ya no existe.
      </p>
      <Link href="/" className="btn btn-pri w-fit">
        Volver al inicio
      </Link>
    </main>
  );
}
