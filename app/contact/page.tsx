import type { Metadata } from "next";
import {
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
import { QuickConsultForm } from "@/components/forms/quick-consult-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact and Appointments",
  description:
    "Book an appointment at Trichy Fetal Medicine and Fertility Centre, Thillai Nagar, Trichy. Call, WhatsApp, or request a callback. International line available.",
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
      <PageHeader
        eyebrow="Contact"
        title="Book your appointment"
        subtitle="Call us, message us on WhatsApp, or send a request and our team will call you back to fix a convenient time."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
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

          <div className="rounded-3xl border border-rose-tint bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-ink">
              Request a callback
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Share your details and we will call you back to fix a convenient
              time.
            </p>
            <QuickConsultForm />
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="Visit us"
            title="Getting here"
          />
          {/* TODO: client to confirm the official Google Maps listing, then
              update site.address.mapsEmbedUrl. */}
          <div className="overflow-hidden rounded-3xl border border-rose-tint shadow-soft">
            <iframe
              src={site.address.mapsEmbedUrl}
              title={`Map to ${site.name}, Thillai Nagar, Trichy`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/9] w-full border-0"
            />
          </div>
          {/* TODO: client to provide landmark directions (nearest junction,
              parking notes) for visitors. */}
          <p className="mt-4 text-sm text-muted-foreground">
            The centre is on Annamalai Nagar in Thillai Nagar, Trichy. Call us
            on {site.phones[0].label} if you need directions on the day.
          </p>

          <div className="mt-10 rounded-2xl border border-rose-tint bg-white p-6 shadow-soft">
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
        </Container>
      </Section>
    </>
  );
}
