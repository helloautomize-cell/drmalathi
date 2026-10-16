import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  FileText,
  Globe2,
  IdCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScanLine,
} from "lucide-react";
import { MobileIconTile } from "@/components/cards/mobile-cards";
import { BookingQr } from "@/components/booking-qr";
import { LazyQuickConsultForm } from "@/components/forms/lazy-quick-consult-form";
import {
  ConsultFormBody,
  emptyConsultValues,
} from "@/components/forms/quick-consult-form-body";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { StaticMap } from "@/components/site/static-map";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact and Appointments",
  description:
    "Book an appointment at Trichy Fetal Medicine and Fertility Centre, Thillai Nagar. Call, WhatsApp or request a callback. International line available.",
  alternates: { canonical: "/contact" },
};

const contactRows = [
  {
    icon: Phone,
    label: "Appointments",
    value: site.phones[0].label,
    href: site.phones[0].href,
    external: false,
  },
  {
    icon: Phone,
    label: "Alternate line",
    value: site.phones[1].label,
    href: site.phones[1].href,
    external: false,
  },
  {
    icon: Globe2,
    label: "International line",
    value: site.internationalPhone.label,
    href: site.internationalPhone.href,
    external: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.whatsapp.label,
    href: site.whatsapp.messageHref,
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
];

// Minimal option lists for the callback form; never ship the full data
// modules to the client for a couple of select lists.
const consultDoctorOptions = doctors.map((d) => ({
  slug: d.slug,
  name: d.name,
}));
const consultServiceOptions = services.map((s) => ({
  slug: s.slug,
  name: s.name,
}));
const consultContact = {
  callHref: site.phones[0].href,
  callLabel: site.phones[0].label,
  whatsappHref: site.whatsapp.messageHref,
};

// TODO: client to confirm Saturday and Sunday hours before launch.
const hoursRows = [
  { days: "Monday to Friday", hours: "9:00 AM to 9:00 PM" },
  { days: "Saturday", hours: "Please call to confirm" },
  { days: "Sunday", hours: "Please call to confirm" },
];

const bringItems = [
  {
    icon: ScanLine,
    text: "Previous scan reports and ultrasound images",
  },
  {
    icon: FileText,
    text: "Your referral letter, if your doctor gave you one",
  },
  {
    icon: IdCard,
    text: "A photo ID",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="Book your appointment"
        intro="Call us, message us on WhatsApp, or send a request and our team will call you back to fix a convenient time."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container>
          {/* Mobile flow: call/WhatsApp cards, form, hours. */}
          <div className="space-y-4 md:hidden">
            <div className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <MobileIconTile icon={Phone} />
                <div>
                  <p className="text-[19px]/[26px] font-semibold text-ink">
                    Call us
                  </p>
                  <a
                    href={site.phones[0].href}
                    className="text-base/[26px] font-semibold text-primary"
                  >
                    {site.phones[0].label}
                  </a>
                </div>
              </div>
              <a
                href={site.phones[1].href}
                className="mt-2 block min-h-11 text-sm/[20px] text-ink-muted underline-offset-4 hover:underline"
              >
                Alternate: {site.phones[1].label}
              </a>
            </div>

            <a
              href={site.whatsapp.messageHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal">
                <WhatsAppIcon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[19px]/[26px] font-semibold text-ink">
                  WhatsApp us
                </span>
                <span className="block text-base/[26px] text-ink-muted">
                  {site.whatsapp.label}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
            </a>

          </div>

          {/* The single callback form; one element rendered at every
              breakpoint so nothing hydrates twice. */}
          <div
            id="callback-form"
            className="mt-4 scroll-mt-28 rounded-3xl border border-rose-tint bg-white p-5 shadow-card md:mt-0 md:p-8"
          >
            <h2 className="text-xl font-semibold text-ink">
              Request a callback
            </h2>
            <p className="mt-1 mb-6 text-sm/[20px] text-ink-muted">
              Share your details and we will call you back to fix a convenient
              time.
            </p>
            <LazyQuickConsultForm
              doctorOptions={consultDoctorOptions}
              serviceOptions={consultServiceOptions}
              contact={consultContact}
              placeholder={
                <ConsultFormBody
                  interactive={false}
                  values={emptyConsultValues}
                  errors={{}}
                  isSubmitting={false}
                  doctorOptions={consultDoctorOptions}
                  serviceOptions={consultServiceOptions}
                />
              }
            />
          </div>

          <div className="mt-4 md:hidden">
            <div className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                Opening hours
              </h2>
              <dl className="mt-3 divide-y divide-border text-sm">
                {hoursRows.map((row) => (
                  <div
                    key={row.days}
                    className="flex items-center justify-between gap-4 py-2.5"
                  >
                    <dt className="text-muted-foreground">{row.days}</dt>
                    <dd className="font-semibold text-ink">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Desktop two-column layout, unchanged. */}
          <div className="mt-10 hidden gap-10 md:grid lg:grid-cols-2">
          <div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {contactRows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-start gap-4 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                    <row.icon
                      className="size-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      {row.label}
                    </p>
                    <a
                      href={row.href}
                      {...(row.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="link break-words text-sm text-muted-foreground"
                    >
                      {row.value}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-4 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-primary">
                  <MapPin
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Address</p>
                  <a
                    href={site.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm text-muted-foreground"
                  >
                    {site.address.lines.join(" ")}
                  </a>
                </div>
              </li>
            </ul>

            <BookingQr className="mt-6 hidden md:block" />

            <div className="mt-6 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                Opening hours
              </h2>
              <dl className="mt-3 divide-y divide-border text-sm">
                {hoursRows.map((row) => (
                  <div
                    key={row.days}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <dt className="text-muted-foreground">{row.days}</dt>
                    <dd className="font-semibold text-ink">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-rose-tint bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-ink">
              Request a callback
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your details and we will call you back to fix a convenient
              time. The form above takes less than a minute.
            </p>
            <div className="mt-6">
              <a
                href="#callback-form"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Book appointment
              </a>
            </div>
            <p className="mt-6 text-sm font-semibold text-ink">
              Prefer to reach us directly?
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={site.phones[0].href}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-rose-tint sm:flex-initial"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call {site.phones[0].label}
              </a>
              <a
                href={site.whatsapp.messageHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-teal px-4 py-2.5 text-sm font-semibold text-teal transition-colors hover:bg-teal-tint sm:flex-initial"
              >
                <WhatsAppIcon className="size-4" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
          </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container className="flex flex-col">
          <SectionHeader
            align="left"
            eyebrow="Visit us"
            title="Getting here"
            className="order-1"
          />

          {/* Mobile: what to bring comes before the map card. */}
          <div className="order-2 rounded-2xl border border-rose-tint bg-white p-5 shadow-soft md:order-3 md:mt-10 md:p-6">
            <h2 className="text-lg font-semibold text-ink">What to bring</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {bringItems.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-tint text-teal">
                    <item.icon
                      className="size-4.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="pt-1.5 text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile: static map card with a Get directions button. */}
          <div className="order-3 mt-6 rounded-2xl border border-rose-tint bg-white p-4 shadow-soft md:hidden">
            <StaticMap />
          </div>

          {/* Mobile: international patients as a ListRow. */}
          <Link
            href="/international-patients"
            className="order-4 mt-4 flex min-h-14 items-center gap-3 rounded-2xl border border-rose-tint bg-white px-4 py-3 shadow-soft md:hidden"
          >
            <MobileIconTile icon={Globe2} tone="teal" />
            <span className="min-w-0 flex-1">
              <span className="block text-base/[26px] font-semibold text-ink">
                International patients
              </span>
              <span className="block text-sm/[20px] text-ink-muted">
                International line: {site.internationalPhone.label}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
          </Link>

          {/* Desktop: self-hosted static map + directions link (no embeds). */}
          <div className="order-3 mt-6 md:order-2 md:mt-0">
          <div className="overflow-hidden rounded-3xl border border-rose-tint bg-white p-4 shadow-soft max-md:hidden">
            <StaticMap
              imageClassName="aspect-[16/9] w-full object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
          {/* TODO: client to provide landmark directions (nearest junction,
              parking notes) for visitors. */}
          <p className="mt-4 text-sm text-muted-foreground">
            The centre is on Annamalai Nagar in Thillai Nagar, Trichy. Call us
            on {site.phones[0].label} if you need directions on the day.
          </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
