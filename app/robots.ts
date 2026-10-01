import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const indexable =
  process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/design-system", "/api/"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
