"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// sonner (and its next-themes dep) stay out of the shared layout chunk; the
// toaster mounts on the first idle tick after hydration instead.
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false }
);

export function LazyToaster() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 1500);
    return () => {
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, []);
  return ready ? <Toaster richColors position="top-center" /> : null;
}
