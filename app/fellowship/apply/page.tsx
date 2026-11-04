import type { Metadata } from "next";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { TrainingApplicationForm } from "@/components/fellowship/training-application-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { courses, fellowshipProgram } from "@/data/courses";
import { site } from "@/data/site";
import { preferredStartOptions } from "@/lib/training-schema";
import {
  breadcrumbNode,
  pageGraph,
  webPageNode,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Apply for Fellowship Training",
  description:
    "Apply online for a fellowship or ultrasound training programme at our Trichy centre. Upload your CV; shortlisted candidates are called for a personal interview.",
  alternates: { canonical: "/fellowship/apply" },
};

export default async function FellowshipApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  // An unknown course value simply means no preselection.
  const { course } = await searchParams;
  const initialCourse = courses.find((item) => item.slug === course)?.slug;

  return (
    <>
      <JsonLd
        data={pageGraph([
          webPageNode(
            "/fellowship/apply",
            metadata.title as string,
            metadata.description as string
          ),
          breadcrumbNode([
            { label: "Home", href: "/" },
            { label: "Fellowship", href: "/fellowship" },
            { label: "Apply", href: "/fellowship/apply" },
          ]),
        ])}
      />
      <PageHero
        eyebrow="Fellowship training"
        title="Apply for Fellowship Training"
        intro="Fill in your details and upload your CV. Shortlisted candidates are called for a personal interview."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Fellowship", href: "/fellowship" },
          { label: "Apply" },
        ]}
      />
      <Section>
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft sm:p-8">
              <TrainingApplicationForm
                initialCourse={initialCourse}
                preferredStartOptions={preferredStartOptions()}
              />
            </div>
            <aside className="space-y-6">
              <div className="rounded-2xl border border-rose-tint bg-blush p-5">
                <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Eligibility
                </h2>
                <ul className="mt-3 space-y-4">
                  {courses.map((item) => (
                    <li key={item.slug}>
                      <p className="text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.eligibility.map((entry) => (
                          <span
                            key={entry}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink"
                          >
                            {entry}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-tint bg-white p-5 shadow-soft">
                <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Questions about applying
                </h2>
                <ul className="mt-3 space-y-2.5 text-sm">
                  <li>
                    <a
                      href={fellowshipProgram.admissions.phoneHref}
                      className="flex min-h-11 items-center gap-2 font-semibold text-ink"
                    >
                      <Phone
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {fellowshipProgram.admissions.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${fellowshipProgram.admissions.email}`}
                      className="flex min-h-11 items-center gap-2 font-semibold text-ink"
                    >
                      <Mail
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {fellowshipProgram.admissions.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.whatsapp.messageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-2 font-semibold text-ink"
                    >
                      <WhatsAppIcon
                        className="size-4 shrink-0 text-teal"
                        aria-hidden="true"
                      />
                      WhatsApp us
                    </a>
                  </li>
                </ul>
                <p className="mt-3 flex items-start gap-2 text-sm text-ink-muted">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-teal"
                    aria-hidden="true"
                  />
                  You can also email your CV directly if the form does not work
                  for you.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
