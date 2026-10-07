"use client";
import { Folder, Layers, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Clientes", Icon: Folder },
  { href: "/try", label: "Probar", Icon: Layers },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const signOut = () =>
    authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  const item =
    "flex items-center gap-2.5 opacity-60 transition-opacity hover:opacity-100 aria-[current=page]:opacity-100";

  return (
    <div className="flex min-h-dvh flex-col md:grid md:grid-cols-[200px_minmax(0,1fr)]">
      <nav
        aria-label="Principal"
        className="order-2 sticky bottom-0 z-20 flex justify-around bg-ink pb-[env(safe-area-inset-bottom)] text-paper md:order-1 md:static md:flex-col md:justify-start md:gap-0.5 md:py-4"
      >
        <Link
          href="/"
          className="disp hidden px-[18px] pb-6 pt-1 text-sm [font-stretch:125%] md:block"
        >
          Feed Prototype
        </Link>
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={path.startsWith(href) ? "page" : undefined}
            className={cn(
              item,
              "min-h-14 flex-1 flex-col justify-center gap-0.5 px-1 text-[11px] aria-[current=page]:shadow-[inset_0_3px_0_var(--red)] md:min-h-0 md:flex-none md:flex-row md:justify-start md:gap-2.5 md:px-[18px] md:py-3 md:text-[15px] md:font-medium md:aria-[current=page]:bg-brand md:aria-[current=page]:text-on-brand md:aria-[current=page]:shadow-none",
            )}
          >
            <Icon className="size-[22px] md:size-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={signOut}
          className={cn(
            item,
            "min-h-14 flex-1 flex-col justify-center gap-0.5 px-1 text-[11px] md:mt-auto md:min-h-0 md:flex-none md:flex-row md:justify-start md:gap-2.5 md:px-[18px] md:py-3 md:text-[15px]",
          )}
        >
          <LogOut className="size-[22px] md:size-5" />
          Salir
        </button>
        {data?.user && (
          <div
            className="hidden truncate border-t border-paper/25 px-[18px] py-3.5 text-[13px] md:block"
            title={data.user.email}
          >
            {data.user.name}
          </div>
        )}
      </nav>
      <main className="order-1 min-w-0 bg-paper md:order-2">{children}</main>
    </div>
  );
}
