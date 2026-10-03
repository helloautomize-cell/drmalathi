"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { site } from "@/data/site";

/** Share on WhatsApp, copy link, and native share (mobile where available). */
export function ShareRow({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}${path}`;

  // navigator.share exists only on the client; server snapshot stays false.
  const canShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled
    }
  };

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-ink">Share this guide</span>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal px-4 text-sm font-semibold text-teal transition-colors hover:bg-teal-tint"
      >
        <WhatsAppIcon className="size-4" aria-hidden="true" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-tint px-4 text-sm font-semibold text-ink transition-colors hover:bg-blush"
      >
        {copied ? (
          <Check className="size-4 text-teal" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare ? (
        <button
          type="button"
          onClick={share}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-tint px-4 text-sm font-semibold text-ink transition-colors hover:bg-blush"
        >
          <Share2 className="size-4" aria-hidden="true" />
          Share
        </button>
      ) : null}
    </div>
  );
}
