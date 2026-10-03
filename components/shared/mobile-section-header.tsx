import { cn } from "cn";

export function MobileSectionHeader({
  eyebrow,
  title,
  subline,
  level: Level = "h2",
  className,
  desktopAlign = "center",
}: {
  eyebrow?: string;
  title: string;
  subline?: string;
  level?: "h1" | "h2";
  className?: string;
  desktopAlign?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-6 max-w-sm text-center md:mb-14 md:max-w-2xl",
        desktopAlign === "left" && "md:mx-0 md:text-left",
        className
      )}
    >
      {eyebrow ? (
        <p data-eyebrow className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase md:mb-3 md:text-sm md:font-bold">
          {eyebrow}
        </p>
      ) : null}
      <Level
        className={
          Level === "h1"
            ? "text-[34px]/[40px] font-semibold text-ink md:text-4xl"
            : "text-[26px]/[32px] font-semibold text-ink md:text-4xl"
        }
      >
        {title}
      </Level>
      {subline ? (
        <p className={cn("mx-auto mt-3 max-w-sm text-base/[26px] text-ink-muted text-pretty md:mt-4 md:max-w-2xl md:text-lg", desktopAlign === "left" && "md:mx-0")}>
          {subline}
        </p>
      ) : null}
    </div>
  );
}
