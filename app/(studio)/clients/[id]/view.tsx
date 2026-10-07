"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/features/app/AppShell";
import { ClientForm } from "@/features/app/ClientForm";
import { NETWORK_NAME, type Platform } from "@/features/platforms/types";
import { useTRPC } from "@/lib/trpc";

export function ClientView({ id }: { id: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();
  const q = useQuery(trpc.client.byId.queryOptions({ id }));
  const [editing, setEditing] = useState(false);
  const [askDel, setAskDel] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>("INSTAGRAM");
  const refresh = () => {
    qc.invalidateQueries({ queryKey: trpc.client.byId.queryKey({ id }) });
    qc.invalidateQueries({ queryKey: trpc.client.list.queryKey() });
  };

  const update = useMutation(
    trpc.client.update.mutationOptions({
      onSuccess: () => {
        refresh();
        setEditing(false);
      },
    }),
  );
  const del = useMutation(
    trpc.client.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: trpc.client.list.queryKey() });
        router.push("/dashboard");
      },
    }),
  );
  const create = useMutation(
    trpc.campaign.create.mutationOptions({
      onSuccess: (c) => {
        refresh();
        router.push(`/campaigns/${c.id}`);
      },
    }),
  );
  const delCampaign = useMutation(
    trpc.campaign.delete.mutationOptions({ onSuccess: refresh }),
  );

  const c = q.data;
  return (
    <AppShell>
      <div className="grid gap-6 p-4 md:p-8">
        <Link
          href="/dashboard"
          className="lab flex w-fit items-center gap-1 text-ink2"
        >
          <ChevronLeft className="i" />
          Clientes
        </Link>
        {q.isPending && (
          <p className="lab text-ink2" role="status">
            Cargando…
          </p>
        )}
        {q.error && (
          <p className="text-red" role="alert">
            No encontramos este cliente.
          </p>
        )}
        {c && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="disp text-[clamp(32px,5vw,52px)]">{c.name}</h1>
                <p className="mt-2 text-ink2">
                  @{c.handle}
                  {c.industry ? ` · ${c.industry}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => setEditing(!editing)}
              >
                Editar cliente
              </button>
            </div>
            {editing && (
              <ClientForm
                initial={c}
                submitLabel="Guardar"
                pending={update.isPending}
                onSubmit={(v) => update.mutate({ ...v, id })}
                onCancel={() => setEditing(false)}
              />
            )}

            <form
              className="rule grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate({ clientId: id, name, platform });
              }}
            >
              <div className="grid gap-1">
                <label className="field-label" htmlFor="kn">
                  Nueva campaña
                </label>
                <input
                  id="kn"
                  required
                  maxLength={80}
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lanzamiento de temporada"
                />
              </div>
              <div className="seg" role="group" aria-label="Red social">
                {(["INSTAGRAM", "LINKEDIN"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={platform === p}
                    onClick={() => setPlatform(p)}
                  >
                    {NETWORK_NAME[p]}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="btn btn-pri"
                disabled={create.isPending}
              >
                Crear campaña
              </button>
            </form>

            {c.campaigns.length === 0 ? (
              <p className="text-ink2">
                Aún no hay campañas para este cliente.
              </p>
            ) : (
              <ul className="rule-t m-0 list-none p-0">
                {c.campaigns.map((k) => (
                  <li
                    key={k.id}
                    className="rule-b flex items-center gap-3 px-1.5 py-3"
                  >
                    <Link
                      href={`/campaigns/${k.id}`}
                      className="min-w-0 flex-1"
                    >
                      <b className="block truncate text-lg font-bold [font-stretch:112%]">
                        {k.name}
                      </b>
                      <small className="text-ink2">
                        {k._count.posts} piezas
                      </small>
                    </Link>
                    <span className="chip">{NETWORK_NAME[k.platform]}</span>
                    <button
                      type="button"
                      className="btn text-red"
                      onClick={() => {
                        if (confirm("¿Eliminar la campaña y sus piezas?"))
                          delCampaign.mutate({ id: k.id });
                      }}
                      aria-label={`Eliminar ${k.name}`}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="rule-t pt-4">
              {askDel ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span>Se eliminarán también sus campañas.</span>
                  <button
                    type="button"
                    className="btn text-red"
                    onClick={() => del.mutate({ id })}
                  >
                    Sí, eliminar cliente
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setAskDel(false)}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn text-red"
                  onClick={() => setAskDel(true)}
                >
                  Eliminar cliente
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
