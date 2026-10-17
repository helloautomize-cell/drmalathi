// llms.txt / llms-full.txt content generators. Everything derives from the
// same data modules the pages render from, so these files can never drift
// from the site. No em/en dashes anywhere (content-rules).
//
// Format follows llmstxt.org: H1, blockquote summary, key facts, then H2
// sections of "- [Title](absolute url): description" lines.

import { courses, fellowshipProgram } from "@/data/courses";
import { doctors } from "@/data/doctors";
import { faqCategories, faqs } from "@/data/faqs";
import { legal } from "@/data/legal";
import { pageLastModified } from "@/data/content-dates";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  email,
  foundedYear,
  hours,
  internationalPhone,
  phones,
} from "@/lib/site";
import { getAllGuides } from "@/lib/guides";
import type { Guide, GuideBlock } from "@/types/guide";
import type { Service } from "@/data/services";

const U = site.url.replace(/\/$/, "");

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Only guides a doctor has signed off on; also gated by the publish rules. */
const reviewedGuides = (): Guide[] =>
  getAllGuides().guides.filter((g) => g.reviewStatus === "reviewed");

const reviewerName = (g: Guide): string | undefined =>
  g.reviewedBy ? doctors.find((d) => d.slug === g.reviewedBy)?.name : undefined;

const reviewedLine = (g: Guide): string | null => {
  if (!g.reviewedAt) return null;
  const name = reviewerName(g);
  return name
    ? `Medically reviewed by ${name} on ${dateLabel(g.reviewedAt)}`
    : `Medically reviewed on ${dateLabel(g.reviewedAt)}`;
};

const usualWindow = (s: Service): string | null => {
  if (!s.weeks) return null;
  return s.weeks.end
    ? `Usually ${s.weeks.start} to ${s.weeks.end} weeks.`
    : `Usually from ${s.weeks.start} weeks onward.`;
};

/** Relative site links inside guide copy become absolute fmctrichy.com URLs. */
const absolutize = (text: string) => text.replaceAll("](/", `](${U}/`);

const doctorLine = (d: (typeof doctors)[number]) =>
  `${d.name}, ${d.role}; ${d.qualifications.join(", ")}`;

function header(): string {
  const doctorList = doctors.map(doctorLine).join("; ");
  return `# ${site.name}

> Specialist fetal medicine centre in Thillai Nagar, Tiruchirappalli (Trichy), Tamil Nadu, India, founded in ${foundedYear}. It serves pregnant women and families across Trichy and neighbouring districts, and the obstetricians and doctors who refer to it.

Key facts:
- Address: ${site.address.lines.join(" ")}
- Phone: ${phones.map((p) => p.label).join(" and ")}
- International patients and course admissions: ${internationalPhone.label}
- WhatsApp: ${site.whatsapp.label}
- Email: ${email}
- Hours: ${hours}
- Founded: ${foundedYear}
- Doctors: ${doctorList}
- PCPNDT: in line with the PCPNDT Act, fetal sex is not determined or disclosed at this centre.
`;
}

const servicesIn = (category: string) =>
  services.filter((s) => s.category === category);

export function buildLlmsTxt(): string {
  const serviceSection = (title: string, category: string) => {
    const lines = servicesIn(category).map(
      (s) =>
        `- [${s.name}](${U}/services/${s.slug}): ${s.shortDescription}${
          usualWindow(s) ? ` ${usualWindow(s)}` : ""
        }`
    );
    return `## ${title}\n\n${lines.join("\n")}\n`;
  };

  const doctorLines = doctors
    .filter((d) => d.hasProfile)
    .map((d) => `- [${d.name}](${U}/doctors/${d.slug}): ${d.role}; ${d.qualifications.join(", ")}.`);

  const guideLines = reviewedGuides().map((g) => {
    const review = reviewedLine(g);
    return `- [${g.title}](${U}/guides/${g.slug}): ${g.excerpt}${review ? ` ${review}.` : ""}`;
  });

  const sections = [
    serviceSection("Scans and screening", "screening"),
    serviceSection("Diagnostics", "diagnostics"),
    serviceSection("Specialist clinics", "clinics"),
    `## Doctors\n\n${doctorLines.join("\n")}\n`,
    guideLines.length
      ? `## Patient guides\n\n${guideLines.join("\n")}\n`
      : "",
    `## Visit and contact\n\n- [Contact and appointments](${U}/contact): Book a scan or consultation; phones, WhatsApp, email and clinic hours.\n- [International patients](${U}/international-patients): Planning a visit from outside India; dedicated international line and coordination.\n- [Frequently asked questions](${U}/faq): Answers about scans, tests, visits and appointments.\n`,
    `## For doctors\n\n- [Fellowship programmes](${U}/fellowship): ${fellowshipProgram.programName} and structured fellowships in fetal medicine at the centre.\n- [CME activities](${U}/cme-activities): Workshops, master classes and CME events run by the team.\n`,
    `## Optional\n\n- [About the centre](${U}/about): The team, history and approach to fetal medicine.\n- [Gallery](${U}/gallery): Photos from the centre and its events.${
      legal.editorialPolicy.draftPendingReview
        ? ""
        : `\n- [Editorial policy](${U}/editorial-policy): How medical content on this site is written and reviewed.`
    }\n`,
  ];

  return `${header()}\n${sections.filter(Boolean).join("\n")}\nWebsite built and marketed by Automize Media Labs (https://www.automizemedialabs.com/)\n`;
}

// ------- llms-full.txt -------

function blockToMarkdown(block: GuideBlock): string {
  switch (block.type) {
    case "h2":
      return `## ${absolutize(block.text)}`;
    case "h3":
      return `### ${absolutize(block.text)}`;
    case "paragraph":
      return absolutize(block.text);
    case "list":
      return block.items
        .map((item, i) =>
          block.ordered ? `${i + 1}. ${absolutize(item)}` : `- ${absolutize(item)}`
        )
        .join("\n");
    case "quote":
      return `> ${absolutize(block.text)}`;
    case "image":
      return `![${block.alt}](${U}${block.src})${
        block.caption ? `\n\n*${block.caption}*` : ""
      }`;
    case "callout": {
      const label = block.title ??
        ({ note: "Note", tip: "Tip", important: "Important" } as const)[
          block.variant
        ];
      return `> **${label}:** ${absolutize(block.text)}`;
    }
    case "table": {
      const esc = (c: string) => absolutize(c).replaceAll("|", "/");
      const header = `| ${block.headers.map(esc).join(" | ")} |`;
      const sep = `| ${block.headers.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((r) => `| ${r.map(esc).join(" | ")} |`);
      return `${block.caption ? `*${esc(block.caption)}*\n\n` : ""}${[
        header,
        sep,
        ...rows,
      ].join("\n")}`;
    }
    case "cta":
      return "";
  }
}

function pageSection(opts: {
  title: string;
  path: string;
  lastUpdated: string;
  reviewLine?: string | null;
  body: string;
}): string {
  return [
    `# ${opts.title}`,
    `Source: ${U}${opts.path}`,
    `Last updated: ${opts.lastUpdated}`,
    ...(opts.reviewLine ? [opts.reviewLine] : []),
    "",
    opts.body,
  ].join("\n");
}

const list = (items: readonly string[]) =>
  items.map((i) => `- ${absolutize(i)}`).join("\n");

function servicePage(s: Service): string {
  const parts: string[] = [s.shortDescription];
  const win = usualWindow(s);
  if (win) parts.push(`**Usual window:** ${win}`);
  if (s.detail.length) parts.push(...s.detail.map(absolutize));
  if (s.timing) parts.push(`**Timing:** ${s.timing}`);
  if (s.preparation) parts.push(`**Preparation:** ${s.preparation}`);
  if (s.whoFor?.length)
    parts.push(`## Who it is for\n\n${list(s.whoFor)}`);
  if (s.whatItChecks?.length)
    parts.push(`## What it checks\n\n${list(s.whatItChecks)}`);
  if (s.steps?.length)
    parts.push(
      `## What happens during the visit\n\n${s.steps
        .map((st, i) => `${i + 1}. ${absolutize(st)}`)
        .join("\n")}`
    );
  if (s.reportAndNextSteps)
    parts.push(`## Report and next steps\n\n${absolutize(s.reportAndNextSteps)}`);
  if (s.visitNotes?.length)
    parts.push(`## Your visit\n\n${s.visitNotes.map(absolutize).join("\n\n")}`);
  if (s.resultsDetail?.length)
    parts.push(
      `## Results\n\n${s.resultsDetail.map(absolutize).join("\n\n")}`
    );
  if (s.limits?.length)
    parts.push(`## What it does not cover\n\n${s.limits.map(absolutize).join("\n\n")}`);
  if (s.followUp?.length)
    parts.push(`## Follow up\n\n${s.followUp.map(absolutize).join("\n\n")}`);
  if (s.faqs?.length)
    parts.push(
      `## Common questions\n\n${s.faqs
        .map((f) => `**${f.question}**\n\n${absolutize(f.answer)}`)
        .join("\n\n")}`
    );
  return pageSection({
    title: s.name,
    path: `/services/${s.slug}`,
    lastUpdated: s.lastModified,
    body: parts.join("\n\n"),
  });
}

function doctorPage(d: (typeof doctors)[number]): string {
  const parts: string[] = [`${d.role}. ${d.qualifications.join(", ")}.`];
  if (d.highlights.length) parts.push(`## Highlights\n\n${list(d.highlights)}`);
  if (d.trainedAt.length) parts.push(`## Trained at\n\n${list(d.trainedAt)}`);
  if (d.expertise.length)
    parts.push(`## Expertise\n\n${list(d.expertise.map((e) => e.label))}`);
  if (d.award) parts.push(`**Award:** ${d.award}`);
  if (d.mentors?.length)
    parts.push(`## Mentors\n\n${list(d.mentors)}`);
  if (d.background?.length)
    parts.push(`## Background\n\n${d.background.join("\n\n")}`);
  return pageSection({
    title: d.name,
    path: `/doctors/${d.slug}`,
    lastUpdated: d.lastModified,
    body: parts.join("\n\n"),
  });
}

function guidePage(g: Guide): string {
  const parts: string[] = [absolutize(g.excerpt)];
  if (g.quickAnswer) parts.push(`**Quick answer:** ${absolutize(g.quickAnswer)}`);
  parts.push(...g.content.map(blockToMarkdown).filter(Boolean));
  if (g.keyTakeaways?.length)
    parts.push(`## Key takeaways\n\n${list(g.keyTakeaways)}`);
  if (g.faqs?.length)
    parts.push(
      `## Common questions\n\n${g.faqs
        .map((f) => `**${f.question}**\n\n${absolutize(f.answer)}`)
        .join("\n\n")}`
    );
  if (g.sources?.length)
    parts.push(
      `## Sources\n\n${g.sources
        .map(
          (s) =>
            `- ${s.title}${s.publisher ? ` (${s.publisher})` : ""}${s.url ? `: ${s.url}` : ""}`
        )
        .join("\n")}`
    );
  return pageSection({
    title: g.title,
    path: `/guides/${g.slug}`,
    lastUpdated: g.updatedAt ?? g.publishedAt,
    reviewLine: reviewedLine(g),
    body: parts.join("\n\n"),
  });
}

export function buildLlmsFull(): string {
  const sections: string[] = [];

  sections.push(
    pageSection({
      title: "Home",
      path: "/",
      lastUpdated: pageLastModified["/"],
      body: `${site.description} The centre offers ${servicesIn("screening").length} screening scans, ${servicesIn("diagnostics").length} advanced diagnostics and ${servicesIn("clinics").length} specialist clinics, ${reviewedGuides().length} patient guides, and ${doctors.length} doctors. Contact details and hours are listed in the Contact section of this file.`,
    })
  );

  for (const s of services) sections.push(servicePage(s));
  for (const d of doctors.filter((x) => x.hasProfile))
    sections.push(doctorPage(d));
  for (const g of reviewedGuides()) sections.push(guidePage(g));

  sections.push(
    pageSection({
      title: "Frequently asked questions",
      path: "/faq",
      lastUpdated: pageLastModified["/faq"],
      body: faqCategories
        .map(
          (c) =>
            `## ${c.label}\n\n${faqs
              .filter((f) => f.category === c.id)
              .map((f) => `**${f.question}**\n\n${absolutize(f.answer)}`)
              .join("\n\n")}`
        )
        .join("\n\n"),
    })
  );

  sections.push(
    pageSection({
      title: "International patients",
      path: "/international-patients",
      lastUpdated: pageLastModified["/international-patients"],
      body: `Patients visiting from outside India are supported by a dedicated international line, ${internationalPhone.label}, and WhatsApp at ${site.whatsapp.label}. Reports and coordination are handled digitally where possible so families can plan travel around confirmed appointment slots.\n\n- International line: ${internationalPhone.label}\n- WhatsApp: ${site.whatsapp.label}\n- Email: ${email}\n- Address: ${site.address.lines.join(" ")}\n- Hours: ${hours}`,
    })
  );

  sections.push(
    pageSection({
      title: "Contact",
      path: "/contact",
      lastUpdated: pageLastModified["/contact"],
      body: `- Address: ${site.address.lines.join(" ")}\n- Phone: ${phones.map((p) => p.label).join(" and ")}\n- International line: ${internationalPhone.label}\n- WhatsApp: ${site.whatsapp.label}\n- Email: ${email}\n- Hours: ${hours}\n- Map: ${site.address.mapsUrl}`,
    })
  );

  sections.push(
    pageSection({
      title: "Fellowship",
      path: "/fellowship",
      lastUpdated: pageLastModified["/fellowship"],
      body: `${fellowshipProgram.programName} and structured fellowship programmes in fetal medicine, run at the centre.\n\n## Programmes\n\n${courses
        .map(
          (c) =>
            `- ${c.title}${c.durationConfirmed && c.duration ? ` (${c.duration})` : ""}${c.eligibility.length ? `, eligibility: ${c.eligibility.join(", ")}` : ""}`
        )
        .join("\n")}\n\n## Shared highlights\n\n${list(
          fellowshipProgram.sharedHighlights
        )}\n\n## Faculty\n\n${fellowshipProgram.faculty
          .map((f) => `- ${f.name}, ${f.role}; ${f.qualifications}`)
          .join("\n")}\n\n## Admissions\n\n${
          fellowshipProgram.admissions.process
        } Email ${fellowshipProgram.admissions.email} or call ${
          fellowshipProgram.admissions.phone
        }.`,
    })
  );

  return `${header()}\n\n${sections.join("\n\n")}\n\nWebsite built and marketed by Automize Media Labs (https://www.automizemedialabs.com/)\n`;
}
