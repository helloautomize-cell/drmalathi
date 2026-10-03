"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = (cb: () => void) => {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 767px)"),
  ];
  queries.forEach((mq) => mq.addEventListener("change", cb));
  return () => queries.forEach((mq) => mq.removeEventListener("change", cb));
};
const isNativeScroll = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  window.matchMedia("(max-width: 767px)").matches;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const nativeScroll = useSyncExternalStore(subscribe, isNativeScroll, () => false);

  if (nativeScroll) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
