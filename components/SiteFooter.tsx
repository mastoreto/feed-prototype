import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-wrap gap-5 bg-bar px-4 py-5 text-on-bar md:px-14">
      <span className="mr-auto">© 2026 Feed Prototype</span>
      <Link href="/guias" className="inline-block py-2.5">
        Guías
      </Link>
      <Link href="/privacidad" className="inline-block py-2.5">
        Privacidad y cookies
      </Link>
      <Link href="/terminos" className="inline-block py-2.5">
        Términos
      </Link>
    </footer>
  );
}
