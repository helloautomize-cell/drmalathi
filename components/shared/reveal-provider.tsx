"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!elements.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    elements.forEach((element) => {
      const siblings = Array.from(element.parentElement?.querySelectorAll(":scope > .reveal") ?? []);
      const index = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${index * 40}ms`);
      element.dataset.revealState = "pending";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealState = "visible";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    const fallback = window.setTimeout(() => {
      elements.forEach((element) => {
        element.dataset.revealState = "visible";
      });
    }, 1500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
