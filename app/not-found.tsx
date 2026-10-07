import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-none px-4 md:px-14 grid min-h-dvh max-w-[60ch] content-center gap-4 bg-brand px-4 text-on-brand">
      <h1 className="disp text-[clamp(32px,6vw,56px)]">
        No encontramos esa página
      </h1>
      <p className="">El enlace puede estar roto o la página ya no existe.</p>
      <Link href="/" className="btn btn-wht w-fit">
        Volver al inicio
      </Link>
    </main>
  );
}
