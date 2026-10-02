import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { serviceCategories, type Service } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const accent =
    serviceCategories.find((c) => c.id === service.category)?.accent ??
    "bg-rose-tint text-primary";

  return (
    <Card className="group h-full border-rose-tint shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-12 items-center justify-center rounded-xl ${accent}`}
          >
            <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-tint bg-blush px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
            <Clock className="size-3" aria-hidden="true" />
            {service.window ?? "When: on referral or as advised"}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {service.shortDescription}
          </p>
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Learn more
          <span className="sr-only"> about {service.name}</span>
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </CardContent>
    </Card>
  );
}
