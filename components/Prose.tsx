import Link from "next/link";
import { SiteFooter } from "./SiteFooter";

/** Shell for text pages (guides, legal): cobalt title band, ruled sections. */
export function Prose({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-brand text-on-brand">
        <header className="flex items-center gap-5 px-4 md:px-14">
          <Link
            href="/"
            className="disp mr-auto flex min-h-11 items-center pt-2 text-sm [font-stretch:125%]"
          >
            Feed Prototype
          </Link>
          <Link
            href="/guias"
            className="hidden min-h-11 items-center px-2.5 sm:flex"
          >
            Guías
          </Link>
          <Link href="/try" className="btn btn-wht !min-h-11 !py-1.5 text-sm">
            Probar gratis
          </Link>
        </header>
        <h1 className="disp max-w-[16ch] px-4 pb-12 pt-14 text-[clamp(36px,7vw,80px)] md:px-14 md:pb-16 md:pt-20">
          {title}
        </h1>
      </div>
      <main className="mx-auto w-full max-w-[72ch] bg-paper px-4 py-10 md:py-14 [&_h2]:rule-t [&_h2]:mt-10 [&_h2]:pt-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:[font-stretch:110%] [&_li]:mt-1.5 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_h2:first-child]:mt-0">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
