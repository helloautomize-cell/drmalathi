import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { DisclaimerBar } from "@/components/site/disclaimer-bar";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { services } from "@/data/services";
import { site } from "@/data/site";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "All Services", href: "/services" },
  { label: "Fellowship and Courses", href: "/fellowship" },
  { label: "CME Activities", href: "/cme-activities" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQs", href: "/faq" },
  { label: "Due Date Calculator", href: "/due-date-calculator" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-plum pb-16 text-white md:pb-0">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link
            href="/"
            className="inline-block rounded-xl bg-white px-3 py-2"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/images/logo-xs.webp"
              alt={site.name}
              width={288}
              height={96}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm text-white/75">
            A state-of-the-art fetal medicine centre serving families in Trichy
            and across south Tamil Nadu for 13 years.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            <li>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 underline-offset-4 hover:underline"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{site.address.lines.join(" ")}</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              {site.hours}
            </li>
          </ul>
        </div>

        <nav aria-label="Services">
          <h2 className="text-base font-semibold">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {services.slice(0, 7).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="font-semibold text-accent-soft underline-offset-4 hover:underline"
              >
                View all services
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <h2 className="text-base font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-semibold">Stay in touch</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <a
                  href={phone.href}
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  {phone.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.internationalPhone.href}
                className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <Globe className="size-4 shrink-0" aria-hidden="true" />
                {site.internationalPhone.label}{" "}
                <span className="text-white/60">(international)</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {site.email}
              </a>
            </li>
          </ul>
          <h3 className="mt-6 text-sm font-semibold">Newsletter</h3>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/15 py-5">
        <Container className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms of Use
            </Link>
          </div>
        </Container>
      </div>

      <DisclaimerBar />
    </footer>
  );
}
