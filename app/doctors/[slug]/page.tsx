import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarCheck, MessageCircle } from "lucide-react";
import { CTABand } from "@/components/cards/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";
import { breadcrumbSchema, physicianSchema } from "@/lib/schema";

export function generateStaticParams() {
  return doctors.filter((d) => d.hasProfile).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug && d.hasProfile);
  if (!doctor) return {};
  return {
    title: `${doctor.name}, Fetal Medicine Specialist`,
    description: `${doctor.name}, ${doctor.role ?? "fetal medicine specialist"} at ${site.name}. ${doctor.credentials.join(", ")}.`,
    alternates: { canonical: `/doctors/${doctor.slug}` },
  };
}

export default async function DoctorDetailPage({
  params,
}: PageProps<"/doctors/[slug]">) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor || !doctor.hasProfile) notFound();

  return (
    <>
      <JsonLd data={physicianSchema(doctor)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name, href: `/doctors/${doctor.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={doctor.role ?? "Fetal medicine specialist"}
        title={doctor.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={doctor.image}
                alt={`${doctor.name}, fetal medicine specialist`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="bg-teal-tint text-teal">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                {doctor.badge}
              </Badge>
              {doctor.credentials.map((c) => (
                <Badge key={c} variant="outline" className="border-rose-tint text-ink-muted">
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-ink">About {doctor.name}</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              {doctor.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                className="bg-primary text-white hover:bg-primary-hover"
                render={<Link href="/contact" />}
              >
                <CalendarCheck aria-hidden="true" />
                Book with {doctor.name.split(" ")[0]} {doctor.name.split(" ")[1]}
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
                render={
                  <a
                    href={site.whatsapp.messageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <CTABand />
      </Section>
    </>
  );
}
