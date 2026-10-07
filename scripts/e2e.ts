// End-to-end check against a RUNNING server (bun run build && bun run start) and the Docker DB: bun run e2e
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../server/routers/_app";

const base = "http://localhost:3000";
const email = `t${Date.now()}@example.com`;
const r = await fetch(`${base}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: base },
  body: JSON.stringify({ name: "Test User", email, password: "supersecret1" }),
});
console.log("signup", r.status);
const cookie = r.headers
  .getSetCookie()
  .map((c) => c.split(";")[0])
  .join("; ");
const mk = (ck: string) =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${base}/api/trpc`,
        transformer: superjson,
        headers: () => ({ cookie: ck }),
      }),
    ],
  });
const t = mk(cookie);
const anon = mk("");
try {
  await anon.client.list.query();
  console.log("anon list: UNEXPECTED OK");
} catch (e: any) {
  console.log("anon list ->", e.data?.code);
}
const c = await t.client.create.mutate({
  name: "Café Almanaque",
  handle: "@cafealmanaque",
  brandColor: "#2B3BFF",
});
console.log("client", c.handle);
const k = await t.campaign.create.mutate({
  clientId: c.id,
  name: "Cerro Alto",
  platform: "INSTAGRAM",
});
await t.campaign.savePosts.mutate({
  id: k.id,
  name: "Cerro Alto v2",
  posts: [
    {
      format: "post",
      caption: "uno",
      hashtags: "#a",
      notes: "n",
      media: ["art:0"],
      scheduledAt: new Date("2026-10-17T14:00:00Z"),
    },
    {
      format: "carousel",
      caption: "dos",
      hashtags: "",
      notes: "",
      media: ["art:1", "art:2"],
      scheduledAt: null,
    },
  ],
});
const got = await t.campaign.byId.query({ id: k.id });
console.log(
  "campaign",
  got.name,
  got.posts.map((p) => `${p.order}:${p.format}:${p.media.length}`).join(","),
  got.posts[0].scheduledAt instanceof Date,
);
// a second user must not see or modify it
const r2 = await fetch(`${base}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: base },
  body: JSON.stringify({
    name: "Other",
    email: `o${Date.now()}@example.com`,
    password: "supersecret1",
  }),
});
const o = mk(
  r2.headers
    .getSetCookie()
    .map((x) => x.split(";")[0])
    .join("; "),
);
try {
  await o.campaign.byId.query({ id: k.id });
  console.log("IDOR read: UNEXPECTED OK");
} catch {
  console.log("other user read -> blocked");
}
try {
  await o.campaign.savePosts.mutate({ id: k.id, name: "x", posts: [] });
  console.log("IDOR write: UNEXPECTED OK");
} catch {
  console.log("other user write -> blocked");
}
console.log("other user client list:", (await o.client.list.query()).length);
console.log(
  "page with session ->",
  (
    await fetch(`${base}/dashboard`, {
      headers: { cookie },
      redirect: "manual",
    })
  ).status,
);
console.log(
  "login with session ->",
  (await fetch(`${base}/login`, { headers: { cookie }, redirect: "manual" }))
    .status,
);
await t.client.delete.mutate({ id: c.id });
console.log(
  "cascade posts left:",
  await (await import("../lib/db")).db.post.count({
    where: { campaignId: k.id },
  }),
);
process.exit(0);
