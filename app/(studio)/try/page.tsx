"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Editor } from "@/features/editor/Editor";
import { samplePosts, sampleProfile } from "@/features/platforms/sample";
import {
  NETWORK_NAME,
  type Platform,
  type PostDraft,
} from "@/features/platforms/types";

const KEY = "fp:draft:v1";
type Drafts = Record<Platform, PostDraft[]>;

// Anonymous editor: the draft lives in this browser only (localStorage), nothing is sent to the server.
export default function TryPage() {
  const [platform, setPlatform] = useState<Platform>("INSTAGRAM");
  const [drafts, setDrafts] = useState<Drafts>(samplePosts);
  const [name, setName] = useState(sampleProfile.name);
  const [handle, setHandle] = useState(sampleProfile.handle);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const revive = (l: PostDraft[]) =>
          l.map((p) => ({
            ...p,
            pins: p.pins ?? [], // drafts saved before pins existed
            scheduledAt: p.scheduledAt ? new Date(p.scheduledAt) : null,
          }));
        setDrafts({
          INSTAGRAM: revive(s.drafts.INSTAGRAM),
          LINKEDIN: revive(s.drafts.LINKEDIN),
        });
        setName(s.name);
        setHandle(s.handle);
      }
    } catch {
      /* corrupt draft: keep the sample */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ drafts, name, handle }));
    } catch {
      /* quota exceeded with large images: the session still works, it just won't persist */
    }
  }, [drafts, name, handle, loaded]);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="flex items-center gap-4 bg-bar px-4 py-2.5 text-on-bar">
        <Link
          href="/"
          className="disp flex min-h-11 items-center whitespace-nowrap text-sm [font-stretch:125%]"
        >
          Feed Prototype
        </Link>
        <Link
          href="/signup"
          className="btn btn-wht ml-auto !min-h-11 !py-1.5 text-sm whitespace-nowrap"
        >
          <span className="sm:hidden">Crear cuenta</span>
          <span className="max-sm:hidden">Guardar en mi cuenta</span>
        </Link>
      </header>
      <Editor
        platform={platform}
        posts={drafts[platform]}
        onPosts={(p) => setDrafts((d) => ({ ...d, [platform]: p }))}
        profile={{ name, handle, campaign: sampleProfile.campaign }}
        toolbar={
          <>
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
            <div className="flex w-full gap-3 md:contents">
              <input
                aria-label="Nombre del cliente"
                className="field min-w-0 flex-1 !min-h-11 !py-1 md:!min-h-9 md:max-w-40 md:flex-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                aria-label="Usuario"
                className="field min-w-0 flex-1 !min-h-11 !py-1 md:!min-h-9 md:max-w-32 md:flex-none"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              />
            </div>
          </>
        }
      />
    </div>
  );
}
