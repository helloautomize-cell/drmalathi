import type { Course } from "@/data/courses";
import { doctors } from "@/data/doctors";
import type { Service } from "@/data/services";
import { site } from "@/data/site";

const telephones = [
  ...site.phones.map((p) => p.href.replace("tel:", "")),
  site.internationalPhone.href.replace("tel:", ""),
];

/**
 * Reference to the clinic entity. Schema consumers must include name and url
 * alongside @id so the reference is self-describing even if the entity node
 * is missing from the page.
 */
export function clinicRef() {
  return {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: site.name,
    url: site.url,
  };
}

/** Publisher for Article schema: Organization with name and logo. */
export function publisherRef() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/logo-transparent.png`,
    },
  };
}

/**
 * One JSON-LD script per page: a single connected @graph. Node builders below
 * return graph members (no @context); wrap them with pageGraph() so entities
 * link by stable @id instead of duplicating context per script.
 */
export function pageGraph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: publisherRef(),
  };
}

export function webPageNode(path: string, name: string, description?: string) {
  return {
    "@type": "WebPage",
    "@id": `${site.url}${path}#webpage`,
    url: `${site.url}${path}`,
    name,
    ...(description ? { description } : {}),
    isPartOf: { "@id": `${site.url}/#website` },
    about: clinicRef(),
  };
}

export function medicalClinicNode() {
  return {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: site.name,
    url: site.url,
    description: site.description,
    image: `${site.url}/images/brand/family-cutout-1024.webp`,
    logo: `${site.url}/images/logo-transparent.png`,
    telephone: telephones,
    email: site.email,
    medicalSpecialty: "Obstetric",
    address: {
      "@type": "PostalAddress",
      streetAddress: "73, C/9, Annamalai Nagar, Thillai Nagar",
      addressLocality: "Tiruchirappalli",
      addressRegion: "Tamil Nadu",
      postalCode: "620018",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "21:00",
    },
    ...(site.foundingDate ? { foundingDate: site.foundingDate } : {}),
    ...(site.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.latitude,
            longitude: site.geo.longitude,
          },
        }
      : {}),
    ...(site.hasMap ? { hasMap: site.hasMap } : {}),
    ...(site.areaServed.length
      ? { areaServed: site.areaServed }
      : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    employee: doctors.map((d) => personRef(d)),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function medicalClinicSchema() {
  return { "@context": "https://schema.org", ...medicalClinicNode() };
}

export function breadcrumbNode(items: { label: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${items[items.length - 1]?.href ?? "/"}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return { "@context": "https://schema.org", ...breadcrumbNode(items) };
}

type DoctorRecord = (typeof doctors)[number];

/** Stable @id for a doctor; guide reviewedBy and clinic employee point here. */
export function personId(doctor: DoctorRecord): string {
  return `${site.url}/doctors/${doctor.slug}#person`;
}

/** Compact Person reference used wherever the doctor is named, not described. */
export function personRef(doctor: DoctorRecord) {
  return {
    "@type": "Person",
    "@id": personId(doctor),
    name: doctor.name,
    ...(doctor.hasProfile ? { url: `${site.url}/doctors/${doctor.slug}` } : {}),
  };
}

/**
 * A doctor is a Person in schema.org (Physician is an organization type).
 * Optional fields render only when the underlying data is set: jobTitle
 * waits for a confirmed role, memberOf for memberships, identifier for the
 * medical council registration number.
 */
export function personNode(doctor: DoctorRecord) {
  return {
    "@type": "Person",
    "@id": personId(doctor),
    name: doctor.name,
    ...(doctor.hasProfile ? { url: `${site.url}/doctors/${doctor.slug}` } : {}),
    image: `${site.url}${doctor.photo}`,
    ...(!doctor.roleIsPlaceholder ? { jobTitle: doctor.role } : {}),
    worksFor: clinicRef(),
    ...(doctor.trainedAt.length
      ? {
          alumniOf: doctor.trainedAt.map((institution) => ({
            "@type": "EducationalOrganization",
            name: institution,
          })),
        }
      : {}),
    hasCredential: doctor.qualifications.map((qualification) => ({
      "@type": "EducationalOccupationalCredential",
      name: qualification,
    })),
    ...(doctor.expertise.length
      ? { knowsAbout: doctor.expertise.map((e) => e.label) }
      : {}),
    ...(doctor.memberships.length
      ? {
          memberOf: doctor.memberships.map((body) => ({
            "@type": "Organization",
            name: body,
          })),
        }
      : {}),
    ...(doctor.registration
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: doctor.registration.council,
            value: doctor.registration.number,
          },
        }
      : {}),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function personSchema(doctor: DoctorRecord) {
  return { "@context": "https://schema.org", ...personNode(doctor) };
}

export function courseNode(course: Course) {
  return {
    "@type": "Course",
    "@id": `${site.url}/fellowship#course-${course.slug}`,
    name: course.title,
    description: `${course.title} for ${course.eligibility.join(" or ")}.`,
    provider: clinicRef(),
    ...(course.educationalCredentialConfirmed
      ? { educationalCredentialAwarded: course.title }
      : {}),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function courseSchema(course: Course) {
  return { "@context": "https://schema.org", ...courseNode(course) };
}

// Scans and diagnostics are procedures; specialty clinics are services, not
// procedures, so they type as Service with a medical serviceType.
const SERVICE_SCHEMA_TYPE: Record<Service["kind"], string> = {
  scan: "MedicalProcedure",
  "blood-test": "MedicalProcedure",
  diagnostic: "MedicalProcedure",
  clinic: "Service",
};

export function serviceNode(service: Service) {
  const type = SERVICE_SCHEMA_TYPE[service.kind];
  return {
    "@type": type,
    "@id": `${site.url}/services/${service.slug}#${type === "Service" ? "service" : "procedure"}`,
    name: service.name,
    description: service.shortDescription,
    url: `${site.url}/services/${service.slug}`,
    ...(type === "MedicalProcedure"
      ? { bodyLocation: "Fetus and pregnancy" }
      : { serviceType: "Specialist fetal medicine clinic" }),
    ...(service.preparation ? { preparation: service.preparation } : {}),
    ...(service.reportAndNextSteps
      ? { followup: service.reportAndNextSteps }
      : {}),
    provider: clinicRef(),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function medicalProcedureSchema(service: Service) {
  return { "@context": "https://schema.org", ...serviceNode(service) };
}

export function faqNode(faqs: { question: string; answer: string }[], pagePath?: string) {
  return {
    "@type": "FAQPage",
    ...(pagePath ? { "@id": `${site.url}${pagePath}#faq` } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** @deprecated kept for callers until all pages move to pageGraph. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return { "@context": "https://schema.org", ...faqNode(faqs) };
}

/**
 * The medical entity a guide is about. Keys are guide slugs; names must only
 * restate what the guide itself covers — nothing is invented here.
 */
const GUIDE_ABOUT: Record<string, { "@type": string; name: string }> = {
  "pcos-and-pregnancy": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
  },
  "high-risk-pregnancy-fetal-medicine-specialist": {
    "@type": "MedicalCondition",
    name: "High-risk pregnancy",
  },
  "recurrent-miscarriage-causes-tests-treatment": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
  },
  "fertility-testing-for-couples": {
    "@type": "MedicalProcedure",
    name: "Fertility assessment",
  },
  "twin-pregnancy-scans-risks-monitoring": {
    "@type": "MedicalCondition",
    name: "Twin pregnancy",
  },
  "anomaly-scan-tiffa-scan-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan (TIFFA scan)",
  },
  "fetal-echocardiography-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
  },
  "growth-scan-doppler-pregnancy-fetal-growth-restriction": {
    "@type": "MedicalProcedure",
    name: "Growth scan with Doppler",
  },
  "nipt-in-pregnancy-test-accuracy-high-risk-result": {
    "@type": "MedicalProcedure",
    name: "Non-invasive prenatal testing (NIPT)",
  },
  "nt-scan-pregnancy-timing-normal-range-down-syndrome": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
  },
};

export function guideAboutNode(slug: string) {
  return GUIDE_ABOUT[slug] ?? { "@type": "MedicalWebPage", name: "Fetal medicine" };
}

type GuideSchemaInput = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageSrc: string;
  publishedAt: string;
  updatedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

/**
 * Guides are always MedicalWebPage: the site states they are medically
 * reviewed (reviewStatus + reviewedAt), so lastReviewed is factual. The named
 * reviewer is emitted only when a doctor slug is set; until then the
 * reviewer stays the clinical team (the organisation), matching the visible
 * byline exactly. Never emit a named review the data cannot back.
 */
export function guideArticleNode(guide: GuideSchemaInput) {
  const url = `${site.url}/guides/${guide.slug}`;
  const reviewerDoc = guide.reviewedBy
    ? doctors.find((d) => d.slug === guide.reviewedBy)
    : undefined;
  const clinicalTeam = {
    "@type": "MedicalOrganization",
    "@id": `${site.url}/#clinic`,
    name: `${site.name} clinical team`,
    url: site.url,
  };
  return {
    "@type": "MedicalWebPage",
    "@id": `${url}#article`,
    name: guide.title,
    headline: guide.title,
    description: guide.excerpt,
    url,
    mainContentOfPage: { "@id": `${url}#webpage` },
    image: `${site.url}${guide.coverImageSrc}`,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    about: guideAboutNode(guide.slug),
    author: clinicalTeam,
    publisher: publisherRef(),
    isPartOf: { "@id": `${site.url}/#website` },
    ...(guide.reviewedAt
      ? {
          lastReviewed: guide.reviewedAt,
          reviewedBy: reviewerDoc ? personRef(reviewerDoc) : clinicalTeam,
        }
      : {}),
  };
}
