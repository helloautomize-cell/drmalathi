import { site } from "@/data/site";
import { getAllGuides, getCategory } from "@/lib/guides";

export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function GET() {
  const items = getAllGuides()
    .guides.map(
      (g) => `    <item>
      <title>${escapeXml(g.title)}</title>
      <link>${site.url}/guides/${g.slug}</link>
      <guid isPermaLink="true">${site.url}/guides/${g.slug}</guid>
      <description>${escapeXml(g.excerpt)}</description>
      <category>${escapeXml(getCategory(g.category)?.name ?? g.category)}</category>
      <pubDate>${new Date(g.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)} patient guides</title>
    <link>${site.url}/guides</link>
    <description>${escapeXml(
      "Clear, practical guides from our fetal medicine team."
    )}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
