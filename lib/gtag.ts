/**
 * Push a GA4 event onto window.dataLayer. Safe to call before gtag.js has
 * loaded — the library is loaded with strategy="lazyOnload" so entries
 * pushed earlier simply queue in the array and are sent once it executes.
 * Accepts the same (command, name, params) signature the events previously
 * sent through @next/third-parties' sendGAEvent.
 */
export function sendGAEvent(
  command: "event",
  name: string,
  params: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const w = window as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (w.gtag) {
      w.gtag(command, name, params);
    } else {
      // Same shape gtag() itself pushes: an arguments-like list read back
      // index-by-index by the library when it starts.
      (w.dataLayer ??= []).push([command, name, params]);
    }
  } catch {
    // analytics must never break the page
  }
}
