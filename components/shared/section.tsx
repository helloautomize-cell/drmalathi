import { cn } from "cn";
import {
  SectionShell,
  type SectionSurface,
} from "@/components/shared/section-shell";

export function Section({
  id,
  className,
  children,
  surface,
  overlapHero,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  surface?: SectionSurface;
  overlapHero?: boolean;
}) {
  return (
    <SectionShell
      id={id}
      surface={surface ?? (className?.includes("bg-blush") ? "blush" : "white")}
      overlapHero={overlapHero}
      className={cn("md:py-24", className)}
    >
      {children}
    </SectionShell>
  );
}
