import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

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
          }}
        >
          {site.shortName}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          {service.name}
        </div>
        {service.window ? (
          <div
            style={{
              marginTop: 28,
              display: "flex",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                color: "#3D0F2A",
                background: "#FBE1EA",
                borderRadius: 999,
                padding: "12px 28px",
              }}
            >
              {service.window}
            </div>
          </div>
        ) : null}
      </div>
    ),
    { ...size }
  );
}
