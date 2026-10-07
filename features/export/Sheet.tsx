import {
  formatInfo,
  NETWORK_NAME,
  type Pin,
  type Platform,
  type PostDraft,
  type Profile,
} from "@/features/platforms/types";

const when = (d: Date | null) =>
  d
    ? d.toLocaleString("es", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Por definir";

/** The "extended description" that travels with the exported piece. */
export function Sheet({
  platform,
  post,
  profile,
  pins,
}: {
  platform: Platform;
  post: PostDraft;
  profile: Profile;
  pins: Pin[];
}) {
  const f = formatInfo(platform, post.format);
  return (
    <aside className="sheet">
      <div>
        <h4>{profile.campaign}</h4>
        <small className="mt-1.5 block text-[#5a6070]">
          {profile.name} · Propuesta de campaña
        </small>
      </div>
      <dl>
        <dt>Red</dt>
        <dd>{NETWORK_NAME[platform]}</dd>
        <dt>Formato</dt>
        <dd>{f.label}</dd>
        <dt>Medidas</dt>
        <dd>{f.spec.split(" · ").slice(0, 2).join(" · ")}</dd>
        <dt>Publicación sugerida</dt>
        <dd>{when(post.scheduledAt)}</dd>
      </dl>
      <div>
        <h5>Copy completo</h5>
        <p>{post.caption || "—"}</p>
      </div>
      {post.hashtags && (
        <div className="tags">
          {post.hashtags
            .split(/\s+/)
            .filter(Boolean)
            .map((t) => (
              <span key={t}>{t}</span>
            ))}
        </div>
      )}
      {post.notes && (
        <div className="note">
          <h5>Nota para el cliente</h5>
          <p>{post.notes}</p>
        </div>
      )}
      {pins.length > 0 && (
        <ol>
          {pins.map((q, i) => (
            <li key={q.id}>
              <b>{i + 1}</b>
              {q.text || "Sin texto"}
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
