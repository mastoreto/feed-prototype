"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdSlot } from "@/features/ads/AdSlot";
import { AppShell } from "@/features/app/AppShell";
import { ClientForm } from "@/features/app/ClientForm";
import { bgOf } from "@/features/platforms/media";
import { NETWORK_NAME } from "@/features/platforms/types";
import { useTRPC } from "@/lib/trpc";

export default function DashboardPage() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const clients = useQuery(trpc.client.list.queryOptions());
  const create = useMutation(
    trpc.client.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.list.queryKey() });
        setAdding(false);
      },
    }),
  );

  return (
    <AppShell>
      <div className="grid gap-10 p-4 md:grid-cols-[minmax(0,1fr)_300px] md:p-8">
        <div className="grid content-start gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="disp text-[clamp(34px,5vw,56px)]">Clientes</h1>
            <button
              type="button"
              className="btn btn-pri max-md:flex-1"
              onClick={() => setAdding(true)}
            >
              <Plus className="i" />
              Nuevo cliente
            </button>
          </div>
          {adding && (
            <ClientForm
              submitLabel="Crear cliente"
              pending={create.isPending}
              onSubmit={(v) => create.mutate(v)}
              onCancel={() => setAdding(false)}
            />
          )}
          {create.error && (
            <p className="text-red" role="alert">
              No se pudo crear el cliente. Revisa los datos e inténtalo de
              nuevo.
            </p>
          )}

          {clients.isPending && (
            <p className="lab text-ink2" role="status">
              Cargando…
            </p>
          )}
          {clients.error && (
            <p className="text-red" role="alert">
              No se pudieron cargar tus clientes.
            </p>
          )}
          {clients.data?.length === 0 && !adding && (
            <div className="rule grid gap-3 p-6">
              <h2 className="text-xl font-bold">Crea tu primer cliente</h2>
              <p className="max-w-[48ch] text-ink2">
                Un cliente agrupa sus campañas. Después elige la red y monta las
                piezas.
              </p>
              <button
                type="button"
                className="btn btn-pri w-fit"
                onClick={() => setAdding(true)}
              >
                <Plus className="i" />
                Nuevo cliente
              </button>
            </div>
          )}
          <ul className="rule-t m-0 list-none p-0">
            {clients.data?.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/clients/${c.id}`}
                  className="rule-b grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-1.5 py-3.5 transition-colors md:hover:bg-ink md:hover:text-paper"
                >
                  <span
                    className="av size-10"
                    style={{ background: c.brandColor }}
                  >
                    {c.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate text-lg font-bold [font-stretch:112%]">
                      {c.name}
                    </b>
                    <small className="opacity-70">
                      @{c.handle} · {c.campaigns.length} campañas
                    </small>
                  </span>
                  <span className="hidden gap-0.5 md:flex">
                    {c.campaigns.slice(0, 3).map((k) => (
                      <i
                        key={k.id}
                        className="block h-[38px] w-[30px] bg-hair bg-cover"
                        style={
                          k.posts[0]?.media[0]
                            ? { backgroundImage: bgOf(k.posts[0].media[0]) }
                            : undefined
                        }
                      />
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {!!clients.data?.some((c) => c.campaigns.length) && (
            <>
              <h2 className="mt-4 text-xl font-bold [font-stretch:108%]">
                Campañas recientes
              </h2>
              <ul className="rule-t m-0 list-none p-0">
                {clients.data
                  .flatMap((c) =>
                    c.campaigns.map((k) => ({ ...k, client: c.name })),
                  )
                  .sort((a, b) => +b.updatedAt - +a.updatedAt)
                  .slice(0, 5)
                  .map((k) => (
                    <li key={k.id}>
                      <Link
                        href={`/campaigns/${k.id}`}
                        className="rule-b grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-1.5 py-3 transition-colors md:hover:bg-ink md:hover:text-paper"
                      >
                        <span className="min-w-0">
                          <b className="block truncate font-bold">{k.name}</b>
                          <small className="opacity-70">{k.client}</small>
                        </span>
                        <span className="chip">{NETWORK_NAME[k.platform]}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
        <aside className="grid content-start gap-4">
          <AdSlot kind="dash" className="max-md:mx-auto" />
          <p className="rule p-3.5 text-ink2">
            <b className="text-ink">Un espacio, no más.</b> Solo mostramos
            publicidad aquí y bajo la barra del editor. Nunca sobre tu lienzo ni
            en la imagen que descargas.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
