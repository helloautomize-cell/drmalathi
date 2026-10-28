"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";

// Fallback matcher for CMS-rendered copy only: whole-word, case-insensitive.
// Deliberately narrow so "ebook", "Consultants" and "Our Doctors" never match.
const APPOINTMENT_TEXT =
  /\b(book appointment|book now|book a consultation|consult now|schedule)\b/i;

function linkLocation(el: Element): string {
  const tagged = el.closest("[data-ga-location]");
  const location = tagged?.getAttribute("data-ga-location");
  if (location) return location;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("nav")) return "nav";
  return "body";
}

// One click maps to at most one event; the first matching rule wins.
function classify(el: Element): { target: Element; event: string } | null {
  const interactive = el.closest("a, button, [data-ga='appointment']");
  if (!interactive) return null;

  const tagged = interactive.closest("[data-ga='appointment']");
  if (tagged) return { target: tagged, event: "appointment_click" };

  const anchor = interactive.closest("a");
  if (!anchor) return null;

  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("tel:"))
    return { target: anchor, event: "phone_click" };
  if (
    href.startsWith("whatsapp:") ||
    /(^|\/\/)(wa\.me|api\.whatsapp\.com)/.test(href)
  )
    return { target: anchor, event: "whatsapp_click" };
  if (href.startsWith("mailto:"))
    return { target: anchor, event: "email_click" };
  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/.test(href))
    return { target: anchor, event: "directions_click" };

  // CMS fallback: in-content links whose visible text is a booking CTA.
  if (
    anchor.closest("main") &&
    !anchor.closest("nav") &&
    APPOINTMENT_TEXT.test(anchor.textContent ?? "")
  )
    return { target: anchor, event: "appointment_click" };

  return null;
}

function send(event: string, params: Record<string, string>) {
  try {
    // sendGAEvent no-ops with a warning until <GoogleAnalytics /> has created
    // window.dataLayer, so clicks before hydration are simply dropped.
    sendGAEvent("event", event, params);
  } catch {
    // analytics must never break the page
  }
}

/**
 * Single document-level click listener for conversion events. Detects phone,
 * WhatsApp, email, directions and appointment CTA clicks. Never sends phone
 * numbers, email addresses or link text — only page_path and link_location.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const match = classify(e.target);
      if (!match) return;
      send(match.event, {
        page_path: window.location.pathname,
        link_location: linkLocation(match.target),
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
