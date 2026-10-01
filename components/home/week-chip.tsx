import { Clock } from "lucide-react";
import {
  formatWeekWindow,
  SHOW_DRAFT_WEEK_WINDOWS,
  type WeekWindow,
} from "@/data/services";

export function WeekChip({
  weeks,
  surface = "light",
  className = "",
}: {
  weeks?: WeekWindow;
  surface?: "light" | "dark";
  className?: string;
}) {
  if (!SHOW_DRAFT_WEEK_WINDOWS || !weeks) return null;

  return (
    <span
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        surface === "dark"
          ? "bg-white/90 text-plum"
          : "bg-rose-tint text-plum"
      } ${className}`}
    >
      <Clock className="size-3.5" aria-hidden="true" />
      {formatWeekWindow(weeks)}
    </span>
  );
}
