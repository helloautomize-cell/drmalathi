import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getAllGuides, getCategory, getGuideBySlug } from "@/lib/guides";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllGuides().guides.map((guide) => ({ slug: guide.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const category = getCategory(guide.category);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#3D0F2A",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#E080A0",
            marginBottom: 24,
            display: "flex",
          }}
        >
          {site.shortName} · Patient guide{category ? ` · ${category.name}` : ""}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.15,
            display: "flex",
          }}
        >
          {guide.seo?.title ?? guide.title}
        </div>
      </div>
    ),
    { ...size }
  );
}
