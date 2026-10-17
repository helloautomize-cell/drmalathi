import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { DisclaimerBar } from "@/components/site/disclaimer-bar";
import { StaticMap } from "@/components/site/static-map";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { foundedYear, yearsOfCare } from "@/lib/site";
import { hasPublishedGuides } from "@/lib/guides";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "All Services", href: "/services" },
  { label: "Patient Guides", href: "/guides" },
  { label: "Fellowship and Courses", href: "/fellowship" },
  { label: "CME Activities", href: "/cme-activities" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQs", href: "/faq" },
  { label: "International Patients", href: "/international-patients" },
  { label: "Contact", href: "/contact" },
];

// Patient Guides links hide while no guide is published (all drafts).
function visibleQuickLinks() {
  return quickLinks.filter(
    (l) => hasPublishedGuides() || l.href !== "/guides"
  );
}

function FooterMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "rounded-2xl bg-white/8 p-4 ring-1 ring-white/15" : "mt-6 rounded-2xl bg-white/8 p-4 ring-1 ring-white/15"}>
      <h3 className="text-sm font-semibold text-white">Find us</h3>
      <div className="mt-3">
        <StaticMap
          tone="dark"
          imageClassName="h-28 w-full object-cover md:h-32"
          sizes="(max-width: 767px) calc(100vw - 64px), 280px"
        />
      </div>
      <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
        <Clock className="size-4 shrink-0" aria-hidden="true" />
        {site.hours}
      </p>
    </div>
  );
}

function MobileFooter() {
  return (
    <div className="md:hidden">
      <Container className="py-10">
        <Link href="/" className="inline-block" aria-label={`${site.name} home`}>
          <Image
            src="/images/logo-transparent.png"
            alt={site.name}
            width={288}
            height={96}
            className="h-14 w-auto brightness-0 invert"
          />
        </Link>
        <p className="mt-3 text-base/[26px] text-white/75">
          Specialist fetal medicine care for families in Trichy since {foundedYear}.
        </p>

        <ul className="mt-5 divide-y divide-white/15 border-y border-white/15 text-sm/[20px] text-white/90">
          {site.phones.map((phone) => (
            <li key={phone.href}>
              <a href={phone.href} className="flex min-h-12 items-center gap-3 py-2">
                <Phone className="size-4 shrink-0 text-accent-soft" aria-hidden="true" />
                {phone.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.internationalPhone.href} className="flex min-h-12 items-center gap-3 py-2">
              <Globe className="size-4 shrink-0 text-accent-soft" aria-hidden="true" />
              {site.internationalPhone.label}
              <span className="text-white/60">International</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="flex min-h-12 items-center gap-3 py-2">
              <Mail className="size-4 shrink-0 text-accent-soft" aria-hidden="true" />
              {site.email}
            </a>
          </li>
        </ul>

        <div className="mt-6">
          <FooterMap compact />
        </div>

        <Accordion className="mt-6 border-y border-white/15">
          <AccordionItem value="services" className="border-white/15">
            <AccordionTrigger className="min-h-14 text-base font-semibold text-white hover:no-underline">
              Services
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 pb-3 text-sm/[20px] text-white/80">
                {services.slice(0, 7).map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="block py-2">
                      {service.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="block py-2 font-semibold text-accent-soft">
                    View all
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quick-links" className="border-0">
            <AccordionTrigger className="min-h-14 text-base font-semibold text-white hover:no-underline">
              Quick Links
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 pb-3 text-sm/[20px] text-white/80">
                {visibleQuickLinks().map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Container>

      <div className="border-t border-white/15 px-4 py-5 text-center text-xs/[18px] text-white/70">
        <p>© {new Date().getFullYear()} {site.shortName}. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-5">
          <Link href="/privacy" className="inline-flex min-h-11 min-w-11 items-center justify-center">Privacy</Link>
          <Link href="/terms" className="inline-flex min-h-11 min-w-11 items-center justify-center">Terms</Link>
        </div>
        <p className="mt-4">PCPNDT Act compliant. Fetal sex determination or disclosure is not performed.</p>
        <p className="mt-2">Website information is educational and does not replace professional medical advice.</p>
      </div>
    </div>
  );
}

function DesktopFooter() {
  return (
    <div className="hidden md:block">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link href="/" className="inline-block rounded-xl bg-white px-3 py-2" aria-label={`${site.name} home`}>
            <Image src="/images/logo-xs.webp" alt={site.name} width={288} height={96} className="h-10 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-white/75">
            A fetal medicine centre serving families in Trichy and across south Tamil Nadu for {yearsOfCare()} years.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            <li>
              <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 underline-offset-4 hover:underline">
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
                <Link href={`/services/${service.slug}`} className="underline-offset-4 hover:text-white hover:underline">
                  {service.name}
                </Link>
              </li>
            ))}
            <li><Link href="/services" className="font-semibold text-accent-soft underline-offset-4 hover:underline">View all services</Link></li>
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <h2 className="text-base font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {visibleQuickLinks().map((link) => (
              <li key={link.href}><Link href={link.href} className="underline-offset-4 hover:text-white hover:underline">{link.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-semibold">Questions?</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {site.phones.map((phone) => (
              <li key={phone.href}><a href={phone.href} className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><Phone className="size-4 shrink-0" aria-hidden="true" />{phone.label}</a></li>
            ))}
            <li><a href={site.internationalPhone.href} className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><Globe className="size-4 shrink-0" aria-hidden="true" />{site.internationalPhone.label} <span className="text-white/60">(international)</span></a></li>
            <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><Mail className="size-4 shrink-0" aria-hidden="true" />{site.email}</a></li>
          </ul>
          <FooterMap />
        </div>
      </Container>

      <div className="border-t border-white/15 py-5">
        <Container className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="underline-offset-4 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="underline-offset-4 hover:underline">Terms of Use</Link>
          </div>
        </Container>
      </div>
      <DisclaimerBar />
    </div>
  );
}

/**
 * Single agency credit rendered once for every breakpoint (the mobile and
 * desktop footers are separate trees, so it cannot live inside either).
 */
function AgencyCredit() {
  return (
    <div className="border-t border-white/15 py-4 text-center text-xs/[18px] text-white/70">
      <Container>
        Built &amp; Marketed by{" "}
        <a
          href="https://www.automizemedialabs.com/"
          target="_blank"
          rel="noopener nofollow"
          className="font-semibold text-accent-soft underline-offset-4 hover:underline"
        >
          Automize Media Labs
        </a>
      </Container>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-plum text-white">
      <MobileFooter />
      <DesktopFooter />
      <AgencyCredit />
    </footer>
  );
}
