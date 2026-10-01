import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full border-rose-tint shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex size-12 items-center justify-center rounded-xl bg-teal-tint text-teal">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
