"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@/features/editor/Editor";
import {
  type Format,
  NETWORK_NAME,
  type Platform,
  type PostDraft,
} from "@/features/platforms/types";
import { useTRPC } from "@/lib/trpc";

type Loaded = {
  id: string;
  name: string;
  platform: Platform;
  client: { id: string; name: string; handle: string };
  posts: {
    id: string;
    format: string;
    caption: string;
    hashtags: string;
    notes: string;
    media: string[];
    scheduledAt: Date | null;
  }[];
};

export function CampaignView({ id }: { id: string }) {
  const trpc = useTRPC();
  const q = useQuery({
    ...trpc.campaign.byId.queryOptions({ id }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  if (q.isPending)
    return (
      <p className="lab p-8 text-ink2" role="status">
        Cargando…
      </p>
    );
  if (q.error || !q.data)
    return (
      <p className="p-8 text-red" role="alert">
        No encontramos esta campaña.
      </p>
    );
  return <CampaignEditor campaign={q.data} />;
}

function CampaignEditor({ campaign }: { campaign: Loaded }) {
  const trpc = useTRPC();
  const [posts, setPosts] = useState<PostDraft[]>(() =>
    campaign.posts.map((p) => ({ ...p, format: p.format as Format })),
  );
  const [name, setName] = useState(campaign.name);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const dirty = useRef(false);
  const { mutate: saveNow } = useMutation(
    trpc.campaign.savePosts.mutationOptions({
      onSuccess: () => setStatus("saved"),
      onError: () => setStatus("error"),
    }),
  );

  // Debounced autosave. ponytail: no flush on tab close; add a beforeunload/sendBeacon flush if edits get lost in practice.
  useEffect(() => {
    if (!dirty.current) return;
    setStatus("saving");
    const t = setTimeout(
      () =>
        saveNow({
          id: campaign.id,
          name: name.trim() || campaign.name,
          posts: posts.map(({ id: _id, ...p }) => p),
        }),
      900,
    );
    return () => clearTimeout(t);
  }, [posts, name, campaign.id, campaign.name, saveNow]);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="flex items-center gap-4 bg-ink px-4 py-2.5 text-paper">
        <Link
          href={`/clients/${campaign.client.id}`}
          className="flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeft className="i" />
          {campaign.client.name}
        </Link>
        <span className="lab ml-auto" role="status">
          {status === "saving"
            ? "Guardando…"
            : status === "error"
              ? "Error al guardar"
              : "Guardado"}
        </span>
      </header>
      <Editor
        platform={campaign.platform}
        posts={posts}
        onPosts={(p) => {
          dirty.current = true;
          setPosts(p);
        }}
        profile={{
          name: campaign.client.name,
          handle: campaign.client.handle,
          campaign: name,
        }}
        toolbar={
          <>
            <input
              aria-label="Nombre de la campaña"
              maxLength={80}
              className="field max-w-72 !min-h-9 !py-1 text-lg font-bold"
              value={name}
              onChange={(e) => {
                dirty.current = true;
                setName(e.target.value);
              }}
            />
            <span className="chip">{NETWORK_NAME[campaign.platform]}</span>
          </>
        }
      />
    </div>
  );
}
