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
    <Card data-mobile-card="info" className="group h-full border-rose-tint shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <CardContent className="flex h-full flex-col gap-3 p-5 md:gap-4 md:p-6">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-11 items-center justify-center rounded-xl md:size-12 ${accent}`}
          >
            <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-tint bg-blush px-2.5 py-1 text-[13px]/[20px] font-semibold text-ink-muted md:text-[11px]">
            <Clock className="size-3" aria-hidden="true" />
            {service.window ?? "When: on referral or as advised"}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
          <p className="mt-2 text-base text-muted-foreground md:text-sm">
            {service.shortDescription}
          </p>
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline max-md:min-h-11"
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
