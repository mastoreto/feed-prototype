import type { MetadataRoute } from "next";

const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/try", "/guias", "/privacidad", "/terminos"].map((p) => ({
    url: `${base}${p}`,
  }));
}
