import Link from "next/link";
import { SiteFooter } from "./SiteFooter";

/** Shell for text pages (guides, legal). */
export function Prose({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center gap-5 bg-ink px-4 py-3 text-paper md:px-14">
        <Link href="/" className="disp mr-auto text-sm [font-stretch:125%]">
          Feed Prototype
        </Link>
        <Link href="/guias" className="hidden sm:block">
          Guías
        </Link>
        <Link
          href="/try"
          className="font-semibold underline underline-offset-4"
        >
          Probar gratis
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[72ch] px-4 py-12 md:py-16 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:[font-stretch:110%] [&_li]:mt-1.5 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4">
        <h1 className="disp text-[clamp(32px,6vw,56px)]">{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
