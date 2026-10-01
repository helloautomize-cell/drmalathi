import { Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { site } from "@/data/site";

export function UtilityBar() {
  return (
    <aside
      aria-label="Clinic contact information"
      className="hidden bg-plum text-white md:block"
    >
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-xs">
        <div className="flex items-center gap-5">
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            <span>{site.address.lines.join(" ")}</span>
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {site.hours}
          </span>
        </div>
        <div className="flex items-center gap-5">
          {site.phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {phone.label}
            </a>
          ))}
          {site.socials.length > 0 && (
            <nav aria-label="Social media" className="flex items-center gap-2">
              {/* TODO: render social icons once real URLs are added in data/site.ts */}
            </nav>
          )}
        </div>
      </Container>
    </aside>
  );
}
