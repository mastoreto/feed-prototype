"use client";
import { useState } from "react";

export type ClientValues = {
  name: string;
  handle: string;
  industry?: string;
  brandColor: string;
};

export function ClientForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Omit<ClientValues, "industry">> & {
    industry?: string | null;
  };
  submitLabel: string;
  pending?: boolean;
  onSubmit: (v: ClientValues) => void;
  onCancel?: () => void;
}) {
  const [v, setV] = useState<ClientValues>({
    name: initial?.name ?? "",
    handle: initial?.handle ?? "",
    industry: initial?.industry ?? "",
    brandColor: initial?.brandColor ?? "#2B3BFF",
  });
  const set =
    (k: keyof ClientValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setV({ ...v, [k]: e.target.value });
  return (
    <form
      className="rule grid gap-4 bg-paper p-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...v, industry: v.industry || undefined });
      }}
    >
      <div className="grid gap-1">
        <label className="field-label" htmlFor="cn">
          Nombre
        </label>
        <input
          id="cn"
          required
          maxLength={80}
          className="field"
          value={v.name}
          onChange={set("name")}
          placeholder="Café Almanaque"
        />
      </div>
      <div className="grid gap-1">
        <label className="field-label" htmlFor="ch">
          Usuario de la marca
        </label>
        <input
          id="ch"
          required
          maxLength={40}
          className="field"
          value={v.handle}
          onChange={set("handle")}
          placeholder="cafealmanaque"
        />
      </div>
      <div className="grid gap-1">
        <label className="field-label" htmlFor="ci">
          Rubro (opcional)
        </label>
        <input
          id="ci"
          maxLength={60}
          className="field"
          value={v.industry}
          onChange={set("industry")}
          placeholder="Cafetería"
        />
      </div>
      <div className="grid gap-1">
        <label className="field-label" htmlFor="cc">
          Color de marca
        </label>
        <input
          id="cc"
          type="color"
          className="h-11 w-full cursor-pointer border-[1.5px] border-ink bg-transparent p-0.5"
          value={v.brandColor}
          onChange={set("brandColor")}
        />
      </div>
      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          className="btn btn-pri flex-1 md:flex-none"
          disabled={pending}
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
