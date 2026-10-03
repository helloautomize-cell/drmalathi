import Image from "next/image";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import { imageBlurDataURL } from "@/lib/image-placeholder";

/**
 * Self-hosted static map + "Get directions" external link. Replaces the old
 * Google Maps iframe embed (no third-party requests on page load). Shared by
 * the footer and the /contact page; `tone` switches text colours only.
 */
export function StaticMap({
  tone = "light",
  imageClassName = "h-36 w-full object-cover",
  sizes = "(max-width: 767px) calc(100vw - 64px), 600px",
}: {
  tone?: "light" | "dark";
  imageClassName?: string;
  sizes?: string;
}) {
  const text = tone === "dark" ? "text-white/70" : "text-ink-muted";
  const button =
    tone === "dark"
      ? "bg-white text-plum hover:bg-rose-tint"
      : "border border-primary text-primary hover:bg-rose-tint";
  return (
    <>
      <a
        href={site.address.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block overflow-hidden rounded-xl ${tone === "dark" ? "ring-1 ring-white/15" : ""}`}
      >
        <Image
          src="/images/map-trichy.png"
          alt={`Map showing ${site.name}, ${site.address.lines.join(" ")}`}
          width={600}
          height={300}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className={imageClassName}
        />
      </a>
      <p className={`mt-1.5 text-right text-xs ${text}`}>
        © OpenStreetMap contributors
      </p>
      <p className={`mt-2 flex items-start gap-2 text-sm ${text}`}>
        <MapPin
          className={`mt-0.5 size-4 shrink-0 ${tone === "light" ? "text-primary" : ""}`}
          aria-hidden="true"
        />
        {site.address.lines.join(" ")}
      </p>
      <a
        href={site.address.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold ${button}`}
      >
        <MapPin className="size-4" aria-hidden="true" />
        Get directions
      </a>
    </>
  );
}
