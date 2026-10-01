import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

export const alt = `${site.name}, fetal medicine specialists in Trichy`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/images/logo-transparent.png"));
const logoDataUrl = `data:image/png;base64,${logo.toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#3D0F2A",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "white",
            borderRadius: 24,
            padding: "24px 40px",
            marginBottom: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} alt="" width={480} />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          Specialist care for your baby, before birth
        </div>
      </div>
    ),
    { ...size }
  );
}
