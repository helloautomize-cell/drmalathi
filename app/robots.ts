import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const indexable =
  process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";

// AI answer/search crawlers are explicitly welcome alongside regular bots.
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/"],
          },
          ...aiBots.map((bot) => ({
            userAgent: bot,
            allow: "/",
            disallow: ["/api/"],
          })),
        ]
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
