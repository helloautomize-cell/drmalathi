import { cn } from "cn";

export type SectionSurface = "white" | "blush";

export function SectionShell({
  surface = "white",
  id,
  className,
  children,
  overlapHero = false,
}: {
  surface?: SectionSurface;
  id?: string;
  className?: string;
  children: React.ReactNode;
  overlapHero?: boolean;
}) {
  return (
    <section
      id={id}
      data-section-shell
      data-surface={surface}
      className={cn(
        "py-12 max-md:py-12! md:py-24",
        surface === "blush" ? "bg-blush" : "bg-white",
        overlapHero && "relative z-10 -mt-6 rounded-t-3xl md:mt-0 md:rounded-none",
        className
      )}
    >
      {children}
    </section>
  );
}
