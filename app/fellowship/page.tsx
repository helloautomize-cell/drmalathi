import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Clock, GraduationCap, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { courses, fellowshipProgram } from "@/data/courses";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Fellowship and Courses",
  description:
    "Fetal medicine, advanced obstetric ultrasound, fetal echo, and obstetric ultrasound fellowship training for doctors in Trichy.",
  alternates: { canonical: "/fellowship" },
};

export default function FellowshipPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Fellowship", href: "/fellowship" },
        ])}
      />
      <PageHeader
        eyebrow="Fellowship and courses"
        title="Training the next generation of fetal medicine specialists"
        subtitle="Structured, hands-on training programs run at our centre in Trichy. Applications are handled directly with the centre."
        crumbs={[{ label: "Home", href: "/" }, { label: "Fellowship" }]}
      />

      <Section>
        <Container>
          <SectionHeader
            align="left"
            title="Current programs"
            subtitle="Details confirmed from the centre's published course information."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.title}
                className="h-full overflow-hidden border-rose-tint pt-0 shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="relative aspect-[4/3] w-full bg-blush">
                  <Image
                    src={fellowshipProgram.image}
                    alt={fellowshipProgram.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-tint text-primary">
                      <GraduationCap className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">
                        {course.title}
                      </h3>
                      {course.durationConfirmed ? (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="size-4" aria-hidden="true" />
                          {course.duration}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-blush">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-6"
              title="Hands-on simulation training"
              subtitle="Training at the centre includes practice on a fetal interventions simulator, so skills are built before they are needed."
            />
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                className="bg-primary text-white hover:bg-primary-hover"
                render={<Link href="/contact" />}
              >
                <CalendarCheck aria-hidden="true" />
                Enquire about courses
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <Image
              src={fellowshipProgram.image}
              alt={fellowshipProgram.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
