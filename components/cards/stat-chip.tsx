import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export function StatChip({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-rose-tint bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft",
        className
      )}
    >
      <Icon className="size-4 text-primary" strokeWidth={2} aria-hidden="true" />
      {label}
    </div>
  );
}
