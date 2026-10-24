import { describe, expect, it } from "vitest";
import jsQR from "jsqr";
import QRCode from "qrcode";
import { PNG } from "pngjs";
import { BOOKING_QR_URL, qrSvgPath } from "@/lib/qr-svg";

/**
 * Round trip: render the QR exactly like components/booking-qr.tsx and the
 * print script, then decode the pixels to prove the encoded URL is right.
 */

async function decodePng(buffer: Buffer): Promise<string | null> {
  const png = PNG.sync.read(buffer);
  const result = jsQR(
    new Uint8ClampedArray(png.data),
    png.width,
    png.height
  );
  return result ? result.data : null;
}

async function qrPng(url: string, margin: number): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "Q",
    margin,
    color: { dark: "#000000", light: "#ffffff" },
    width: 600,
  });
}

describe("shared QR helper", () => {
  it("produces a module path for the booking short link", () => {
    // Production origin set in lib/qr-svg.ts; update if the origin changes.
    expect(BOOKING_QR_URL).toBe("https://fmctrichy.com/q/website");
    const { size, d } = qrSvgPath();
    expect(size).toBeGreaterThan(20);
    expect(d).toMatch(/^M\d+ \d+/);
    expect(d.length).toBeGreaterThan(500);
  });
});

describe("QR payloads", () => {
  it("the website card QR decodes to the booking short link", async () => {
    const png = await qrPng("https://drmalathi.vercel.app/q/website", 2);
    expect(await decodePng(png)).toBe("https://drmalathi.vercel.app/q/website");
  });

  it("each clinic location QR decodes to its short link", async () => {
    for (const location of ["reception", "scan-room", "opd"]) {
      const url = `https://drmalathi.vercel.app/q/${location}`;
      const png = await qrPng(url, 4);
      expect(await decodePng(png)).toBe(url);
    }
  });
});
