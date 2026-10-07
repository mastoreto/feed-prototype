"use client";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Globe,
  Heart,
  Layers,
  LayoutGrid,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { bgOf, coverOf, Photo, slidesOf } from "./media";
import type { Format, Platform, PostDraft, Profile } from "./types";

const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "··";

function Trunc({ text, n = 96 }: { text: string; n?: number }) {
  return text.length > n ? (
    <>
      {text.slice(0, n).trim()}… <span className="m">más</span>
    </>
  ) : (
    <>{text || <span className="m">Escribe el copy de la publicación…</span>}</>
  );
}

function Carousel({
  slides,
  ratio = "4/5",
}: {
  slides: string[];
  ratio?: string;
}) {
  const [i, setI] = useState(0);
  const at = Math.min(i, slides.length - 1);
  return (
    <div className="car" style={{ aspectRatio: ratio }}>
      <div className="track" style={{ transform: `translateX(${-100 * at}%)` }}>
        {slides.map((s, k) => (
          <Photo key={k} src={s} ratio={ratio} label={`Lámina ${k + 1}`} />
        ))}
      </div>
      <span className="cn">
        {at + 1}/{slides.length}
      </span>
      {at > 0 && (
        <button
          type="button"
          className="pv"
          aria-label="Anterior"
          onClick={() => setI(at - 1)}
        >
          <ChevronLeft className="i" />
        </button>
      )}
      {at < slides.length - 1 && (
        <button
          type="button"
          className="nx"
          aria-label="Siguiente"
          onClick={() => setI(at + 1)}
        >
          <ChevronRight className="i" />
        </button>
      )}
    </div>
  );
}

/* ---------- Instagram ---------- */
const IgHead = ({ pr }: { pr: Profile }) => (
  <header>
    <div className="av" style={{ width: 34, height: 34 }}>
      {initials(pr.name)}
    </div>
    <div>
      <b>{pr.handle}</b>
      <small>{pr.name}</small>
    </div>
    <MoreHorizontal className="i" />
  </header>
);
const IgActs = () => (
  <div className="acts">
    <Heart className="i" />
    <MessageCircle className="i" />
    <Send className="i" />
    <span className="sp" />
    <Bookmark className="i" />
  </div>
);
const IgFoot = ({ p, pr }: { p: PostDraft; pr: Profile }) => (
  <>
    <div className="b">
      <b>1.284 Me gusta</b>
    </div>
    <p className="b">
      <b>{pr.handle}</b> <Trunc text={p.caption} />
    </p>
    {p.hashtags && <span className="tg">{p.hashtags}</span>}
    <div className="mt">
      <span>Ver los 48 comentarios</span>
      <span>HACE 2 HORAS</span>
    </div>
  </>
);

function IgPost({
  p,
  pr,
  carousel,
}: {
  p: PostDraft;
  pr: Profile;
  carousel?: boolean;
}) {
  return (
    <article className="ig sim">
      <IgHead pr={pr} />
      {carousel ? (
        <Carousel slides={slidesOf(p)} />
      ) : (
        <Photo src={coverOf(p)} />
      )}
      <IgActs />
      <IgFoot p={p} pr={pr} />
    </article>
  );
}

function IgGrid({
  posts,
  pr,
  selected,
}: {
  posts: PostDraft[];
  pr: Profile;
  selected: number;
}) {
  const tiles = posts.length
    ? Array.from({ length: Math.max(9, posts.length) }, (_, k) => ({
        p: posts[k % posts.length],
        real: k < posts.length,
        k,
      }))
    : [];
  return (
    <article className="ig sim">
      <div className="prof">
        <div className="top">
          <div className="av">{initials(pr.name)}</div>
          <div className="st">
            <div>
              <b>{posts.length}</b>
              <span>publicaciones</span>
            </div>
            <div>
              <b>12,4 mil</b>
              <span>seguidores</span>
            </div>
            <div>
              <b>318</b>
              <span>seguidos</span>
            </div>
          </div>
        </div>
        <p>
          <b>{pr.name}</b>
          <br />@{pr.handle}
        </p>
        <div className="fl">
          <span className="f">Seguir</span>
          <span>Mensaje</span>
        </div>
      </div>
      <div className="hl">
        {["Origen", "Menú", "Sedes"].map((t, k) => (
          <div key={t}>
            <i style={{ backgroundImage: bgOf(`art:${k * 2}`) }} />
            {t}
          </div>
        ))}
      </div>
      <div className="gt">
        <LayoutGrid className="i" />
        <Clapperboard className="i" />
        <Layers className="i" />
      </div>
      <div className="gr">
        {tiles.map(({ p, real, k }) => (
          <i
            key={k}
            className={real && k === selected ? "sel" : ""}
            style={{
              backgroundImage: bgOf(coverOf(p)),
              opacity: real ? 1 : 0.55,
            }}
          />
        ))}
      </div>
    </article>
  );
}

const Safe = ({ bottom }: { bottom: string }) => (
  <div className="safe">
    <i className="t" />
    <i className="b" />
    <span style={{ top: 6 }}>zona de interfaz</span>
    <span style={{ bottom: 6 }}>{bottom}</span>
  </div>
);

function IgStory({
  p,
  pr,
  safe,
}: {
  p: PostDraft;
  pr: Profile;
  safe?: boolean;
}) {
  return (
    <div className="tall sim" style={{ backgroundImage: bgOf(coverOf(p)) }}>
      <div className="pg">
        <i />
        <i />
        <i />
      </div>
      <div className="hd">
        <div className="av">{initials(pr.name)}</div>
        <b>{pr.handle}</b>
        <span style={{ opacity: 0.8 }}>2 h</span>
      </div>
      {p.hashtags && (
        <div className="st">
          {p.hashtags.split(/\s+/)[0]}
          <small>Toca para ver más</small>
        </div>
      )}
      <div className="rp">
        <span>Enviar mensaje</span>
        <Heart className="i" />
      </div>
      {safe && <Safe bottom="zona de respuesta" />}
    </div>
  );
}

function IgReel({
  p,
  pr,
  safe,
}: {
  p: PostDraft;
  pr: Profile;
  safe?: boolean;
}) {
  return (
    <div className="tall sim" style={{ backgroundImage: bgOf(coverOf(p)) }}>
      <div className="rl">
        {[
          [Heart, "8,2 mil"],
          [MessageCircle, "312"],
          [Send, "1,1 mil"],
          [MoreHorizontal, ""],
        ].map(([Ic, t], k) => {
          const I = Ic as typeof Heart;
          return (
            <div
              key={k}
              style={{ display: "grid", gap: 3, justifyItems: "center" }}
            >
              <I className="i" />
              <span>{t as string}</span>
            </div>
          );
        })}
      </div>
      <div className="bt">
        <b>{pr.handle}</b>
        <span>
          <Trunc text={p.caption} n={60} />
        </span>
        <span className="au">
          <Music2 className="i" /> Sonido original
        </span>
      </div>
      {safe && <Safe bottom="zona de caption" />}
    </div>
  );
}

/* ---------- LinkedIn ---------- */
const LiHead = ({ pr }: { pr: Profile }) => (
  <header>
    <div className="av">{initials(pr.name)}</div>
    <div>
      <b>{pr.name}</b>
      <small>3.412 seguidores</small>
      <small>
        2 h ·{" "}
        <Globe
          className="i"
          style={{ width: 12, height: 12, verticalAlign: -2 }}
        />
      </small>
    </div>
    <span className="more">
      <MoreHorizontal className="i" />
    </span>
  </header>
);
const LiText = ({ p }: { p: PostDraft }) => (
  <div className="tx">
    {p.caption.length > 150 ? (
      <>
        {p.caption.slice(0, 150).trim()}… <span className="m">ver más</span>
      </>
    ) : (
      p.caption || (
        <span className="m">Escribe el texto de la publicación…</span>
      )
    )}
    {p.hashtags && (
      <>
        {"\n"}
        <span className="h">{p.hashtags}</span>
      </>
    )}
  </div>
);
const LiRx = () => (
  <>
    <div className="rx">
      <span className="e">
        <i />
        <i />
        &nbsp;238
      </span>
      <span>14 comentarios · 6 veces compartido</span>
    </div>
    <div className="ab">
      <span>
        <ThumbsUp className="i" />
        Recomendar
      </span>
      <span>
        <MessageCircle className="i" />
        Comentar
      </span>
      <span>
        <Repeat2 className="i" />
        Compartir
      </span>
      <span>
        <Send className="i" />
        Enviar
      </span>
    </div>
  </>
);
function LiPost({ p, pr, doc }: { p: PostDraft; pr: Profile; doc?: boolean }) {
  const hasImage = p.media.length > 0;
  return (
    <article className="li sim">
      <LiHead pr={pr} />
      <LiText p={p} />
      {doc ? (
        <div className="doc">
          <Carousel slides={slidesOf(p, 4)} />
          <div className="bar">
            <b>{pr.campaign}.pdf</b>
            <span>{p.media.length || 4} páginas</span>
          </div>
        </div>
      ) : (
        hasImage && <Photo src={coverOf(p)} ratio="1/1" />
      )}
      <LiRx />
    </article>
  );
}

/* ---------- public API ---------- */
export function Piece({
  platform,
  post,
  profile,
  safe,
}: {
  platform: Platform;
  post: PostDraft;
  profile: Profile;
  safe?: boolean;
}) {
  const f: Format = post.format;
  if (platform === "INSTAGRAM") {
    if (f === "story") return <IgStory p={post} pr={profile} safe={safe} />;
    if (f === "reel") return <IgReel p={post} pr={profile} safe={safe} />;
    return <IgPost p={post} pr={profile} carousel={f === "carousel"} />;
  }
  return <LiPost p={post} pr={profile} doc={f === "doc"} />;
}

export function Overview({
  platform,
  posts,
  profile,
  selected,
}: {
  platform: Platform;
  posts: PostDraft[];
  profile: Profile;
  selected: number;
}) {
  if (platform === "INSTAGRAM")
    return <IgGrid posts={posts} pr={profile} selected={selected} />;
  return (
    <div style={{ display: "grid", gap: 8, width: "min(500px,100%)" }}>
      {posts.slice(0, 3).map((p) => (
        <LiPost key={p.id} p={p} pr={profile} doc={p.format === "doc"} />
      ))}
    </div>
  );
}

export const hasSafeZones = (platform: Platform, f: Format) =>
  platform === "INSTAGRAM" && (f === "story" || f === "reel");
