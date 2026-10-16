import QRCode from "qrcode";

/**
 * Shared QR payload for the website booking QR. QRCode.create is synchronous
 * and dependency free, so the same module matrix can be rendered on the
 * server (the /contact card ships no client JavaScript) or inside the lazy
 * booking sheet chunk.
 */
// Development: codes point at the preview deployment until the production
// domain is attached. The launch gate blocks a production deploy while this
// still says drmalathi.vercel.app; switch to https://fmctrichy.com at launch.
export const BOOKING_QR_ORIGIN = "https://drmalathi.vercel.app";
export const BOOKING_QR_URL = `${BOOKING_QR_ORIGIN}/q/website`;

export type QrSvg = { /** viewBox width/height in modules */ size: number; d: string };

/** Dark modules as a single SVG path, on a margin-wide quiet zone. */
export function qrSvgPath(url: string = BOOKING_QR_URL, margin = 2): QrSvg {
  const qr = QRCode.create(url, { errorCorrectionLevel: "Q" });
  const { size, data } = qr.modules;
  let d = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (data[row * size + col]) {
        d += `M${col + margin} ${row + margin}h1v1h-1z`;
      }
    }
  }
  return { size: size + margin * 2, d };
}
