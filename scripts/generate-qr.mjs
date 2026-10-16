#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";

/**
 * Print-ready QR files for the clinic locations. Each encodes the short
 * link https://fmctrichy.com/q/<location>, which 307 redirects to
 * /book?src=<location>. Output goes to qr-output/ (gitignored): an SVG for
 * scaling in print and a 1200 px PNG. Level Q error correction plus a 4
 * module quiet zone keep the codes readable on laminated cards.
 */

const LOCATIONS = ["reception", "scan-room", "opd"];
// Preview domain while in development; switch to https://fmctrichy.com at
// launch (the launch gate blocks production builds until then).
const BASE = "https://drmalathi.vercel.app/q";
const OUT_DIR = join(process.cwd(), "qr-output");

const OPTIONS = {
  errorCorrectionLevel: "Q",
  margin: 4,
  color: { dark: "#000000", light: "#ffffff" },
};

mkdirSync(OUT_DIR, { recursive: true });

for (const location of LOCATIONS) {
  const url = `${BASE}/${location}`;
  const svg = await QRCode.toString(url, { ...OPTIONS, type: "svg" });
  writeFileSync(join(OUT_DIR, `${location}.svg`), svg);
  await QRCode.toFile(join(OUT_DIR, `${location}.png`), url, {
    ...OPTIONS,
    width: 1200,
  });
  console.log(`${location}: ${url}`);
}
