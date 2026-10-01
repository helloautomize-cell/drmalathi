import { cn } from "cn";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  level: Level = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold tracking-[0.14em] uppercase text-primary">
          {eyebrow}
        </p>
      ) : null}
      <Level className="text-3xl font-semibold text-ink md:text-4xl">
        {title}
      </Level>
      {subtitle ? (
        <p className="mt-4 text-muted-foreground md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
