"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // Debounced autosave, flushed immediately when the tab is hidden (tab switch, app switch).
  // ponytail: a hard tab close can still lose the last 900 ms; add a keepalive request if it matters.
  const latest = useRef({ posts, name });
  latest.current = { posts, name };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef(false);
  const flush = useCallback(() => {
    clearTimeout(timer.current);
    pending.current = false;
    const { posts, name } = latest.current;
    saveNow({
      id: campaign.id,
      name: name.trim() || campaign.name,
      posts: posts.map(({ id: _id, ...p }) => p),
    });
  }, [saveNow, campaign.id, campaign.name]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: posts/name changes are the trigger; values are read via `latest`
  useEffect(() => {
    if (!dirty.current) return;
    setStatus("saving");
    pending.current = true;
    timer.current = setTimeout(flush, 900);
    return () => clearTimeout(timer.current);
  }, [posts, name, flush]);

  useEffect(() => {
    const onHide = () =>
      document.visibilityState === "hidden" && pending.current && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

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
