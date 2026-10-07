import type { MetadataRoute } from "next";

const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/clients", "/campaigns", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
