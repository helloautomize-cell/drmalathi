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

/**
 * Reference to the organisation entity. Same self-describing convention as
 * clinicRef: @id plus name and url.
 */
export function orgRef() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
  };
}

/** Publisher for Article schema: Organization with name and logo. */
export function publisherRef() {
  return {
    ...orgRef(),
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/logo-transparent.png`,
    },
  };
}

/** Reference to the website entity for isPartOf-style links. */
export function webSiteRef() {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
  };
}

/**
 * One JSON-LD script per page: a single connected @graph. Node builders below
 * return graph members (no @context); wrap them with pageGraph() so entities
 * link by stable @id instead of duplicating context per script.
 *
 * The canonical clinic and organisation nodes are appended to every graph so
 * every page carries the complete entity (partial refs like clinicRef merge
 * into it by @id), and nodes are deduplicated by @id so callers may also
 * pass the canonical builders explicitly.
 */
export function pageGraph(nodes: object[]) {
  const all = [...nodes, medicalClinicNode(), organizationNode()];
  const seen = new Set<string>();
  const graph = all.filter((node) => {
    const id = (node as { "@id"?: unknown })["@id"];
    if (typeof id !== "string") return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return { "@context": "https://schema.org", "@graph": graph };
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
    isPartOf: webSiteRef(),
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
    // No consultation fee is published on the site; "₹₹" is a neutral
    // price-level indicator until the client confirms a fee range.
    priceRange: "₹₹",
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

/**
 * Canonical organisation node. Carries the same verified address and phone
 * numbers as the clinic so every reference to /#org resolves to a complete
 * entity on the page.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/logo-transparent.png`,
    },
    image: `${site.url}/images/brand/family-cutout-1024.webp`,
    telephone: telephones,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "73, C/9, Annamalai Nagar, Thillai Nagar",
      addressLocality: "Tiruchirappalli",
      addressRegion: "Tamil Nadu",
      postalCode: "620018",
      addressCountry: "IN",
    },
    ...(site.foundingDate ? { foundingDate: site.foundingDate } : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
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
    ...(doctor.qualifications.length
      ? {
          hasCredential: doctor.qualifications.map((qualification) => ({
            "@type": "EducationalOccupationalCredential",
            name: qualification,
          })),
        }
      : {}),
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
 * `sameAs` links the entity to its Wikipedia article where a canonical one
 * exists, so answer engines can resolve the entity.
 */
const GUIDE_ABOUT: Record<
  string,
  { "@type": string; name: string; sameAs?: string[] }
> = {
  "pcos-and-pregnancy": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
    sameAs: ["https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome"],
  },
  "high-risk-pregnancy-fetal-medicine-specialist": {
    "@type": "MedicalCondition",
    name: "High-risk pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/High-risk_pregnancy"],
  },
  "recurrent-miscarriage-causes-tests-treatment": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Recurrent_miscarriage"],
  },
  "fertility-testing-for-couples": {
    "@type": "MedicalTest",
    name: "Fertility assessment",
    sameAs: ["https://en.wikipedia.org/wiki/Infertility"],
  },
  "twin-pregnancy-scans-risks-monitoring": {
    "@type": "MedicalCondition",
    name: "Twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Multiple_birth"],
  },
  "anomaly-scan-tiffa-scan-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan (TIFFA scan)",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "fetal-echocardiography-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "growth-scan-doppler-pregnancy-fetal-growth-restriction": {
    "@type": "MedicalProcedure",
    name: "Growth scan with Doppler",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_growth_restriction"],
  },
  "nipt-in-pregnancy-test-accuracy-high-risk-result": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: ["https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing"],
  },
  "nt-scan-pregnancy-timing-normal-range-down-syndrome": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
    sameAs: ["https://en.wikipedia.org/wiki/Nuchal_scan"],
  },
  "tiffa-scan-pregnancy-when-to-get": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan (TIFFA scan)",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "anomaly-scan-vs-normal-pregnancy-ultrasound": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "anomaly-scan-detect-all-birth-defects": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "what-does-anomaly-scan-check": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "anomaly-found-20-week-scan-what-happens": {
    "@type": "MedicalProcedure",
    name: "Fetal anomaly scan",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "get-pregnant-naturally-with-pcos": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
    sameAs: ["https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome"],
  },
  "how-pcos-affects-ovulation-fertility": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
    sameAs: ["https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome"],
  },
  "tests-for-pcos-related-infertility": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
    sameAs: ["https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome"],
  },
  "low-amh-vs-pcos-difference": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome and low AMH",
    sameAs: [
      "https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome",
      "https://en.wikipedia.org/wiki/Anti-M%C3%BCllerian_hormone",
    ],
  },
  "when-to-see-fertility-specialist-pcos": {
    "@type": "MedicalCondition",
    name: "Polycystic ovary syndrome (PCOS)",
    sameAs: ["https://en.wikipedia.org/wiki/Polycystic_ovary_syndrome"],
  },
  "best-time-for-nt-scan-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
    sameAs: ["https://en.wikipedia.org/wiki/Nuchal_scan"],
  },
  "high-nt-measurement-meaning": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
    sameAs: ["https://en.wikipedia.org/wiki/Nuchal_scan"],
  },
  "nt-scan-vs-double-marker-test": {
    "@type": "MedicalTest",
    name: "First-trimester combined screening",
    sameAs: [
      "https://en.wikipedia.org/wiki/Nuchal_scan",
      "https://en.wikipedia.org/wiki/Down_syndrome",
    ],
  },
  "nt-scan-detect-down-syndrome": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
    sameAs: [
      "https://en.wikipedia.org/wiki/Nuchal_scan",
      "https://en.wikipedia.org/wiki/Down_syndrome",
    ],
  },
  "what-happens-after-abnormal-nt-scan": {
    "@type": "MedicalProcedure",
    name: "Nuchal translucency (NT) scan",
    sameAs: ["https://en.wikipedia.org/wiki/Nuchal_scan"],
  },
  "nipt-vs-nt-scan-vs-double-marker-test": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: ["https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing"],
  },
  "what-does-high-risk-nipt-result-mean": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: ["https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing"],
  },
  "can-nipt-detect-down-syndrome": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: [
      "https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing",
      "https://en.wikipedia.org/wiki/Down_syndrome",
    ],
  },
  "nipt-in-twin-pregnancy-reliability": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: ["https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing"],
  },
  "what-happens-after-positive-nipt-result": {
    "@type": "MedicalTest",
    name: "Non-invasive prenatal testing (NIPT)",
    sameAs: ["https://en.wikipedia.org/wiki/Non-invasive_prenatal_testing"],
  },
  "what-is-fetal-echo-and-when-is-it-done": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "why-doctor-recommends-fetal-echocardiogram": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "fetal-echo-vs-anomaly-scan-difference": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "can-fetal-echo-detect-heart-defects": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "fetal-echo-shows-heart-abnormality-next-steps": {
    "@type": "MedicalProcedure",
    name: "Fetal echocardiography",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_echocardiography"],
  },
  "what-is-a-growth-scan-and-when-is-it-done": {
    "@type": "MedicalProcedure",
    name: "Growth scan",
    sameAs: ["https://en.wikipedia.org/wiki/Obstetric_ultrasonography"],
  },
  "why-doppler-scan-during-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Doppler ultrasound in pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Doppler_ultrasonography"],
  },
  "what-does-it-mean-if-baby-is-measuring-small": {
    "@type": "MedicalCondition",
    name: "Fetal growth restriction",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_growth_restriction"],
  },
  "fetal-growth-restriction-causes-monitoring-treatment": {
    "@type": "MedicalCondition",
    name: "Fetal growth restriction",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_growth_restriction"],
  },
  "how-often-growth-scans-high-risk-pregnancy": {
    "@type": "MedicalProcedure",
    name: "Growth scan in high-risk pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Fetal_growth_restriction"],
  },
  "what-makes-a-pregnancy-high-risk": {
    "@type": "MedicalCondition",
    name: "High-risk pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/High-risk_pregnancy"],
  },
  "when-to-see-a-fetal-medicine-specialist": {
    "@type": "MedicalCondition",
    name: "High-risk pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/High-risk_pregnancy"],
  },
  "high-risk-pregnancy-extra-scans-and-tests": {
    "@type": "MedicalCondition",
    name: "High-risk pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/High-risk_pregnancy"],
  },
  "pregnancy-after-ivf-extra-monitoring": {
    "@type": "MedicalEntity",
    name: "Pregnancy after IVF",
    sameAs: ["https://en.wikipedia.org/wiki/In_vitro_fertilisation"],
  },
  "diabetes-and-pregnancy-baby-extra-monitoring": {
    "@type": "MedicalCondition",
    name: "Diabetes in pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Gestational_diabetes"],
  },
  "how-many-miscarriages-recurrent-pregnancy-loss": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Recurrent_miscarriage"],
  },
  "tests-after-repeated-miscarriages": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Recurrent_miscarriage"],
  },
  "can-genetic-problems-cause-recurrent-miscarriage": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Recurrent_miscarriage"],
  },
  "before-trying-to-conceive-after-miscarriage": {
    "@type": "MedicalCondition",
    name: "Miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Miscarriage"],
  },
  "pregnancy-after-recurrent-miscarriage-monitoring": {
    "@type": "MedicalCondition",
    name: "Recurrent miscarriage",
    sameAs: ["https://en.wikipedia.org/wiki/Recurrent_miscarriage"],
  },
  "when-can-twins-be-detected-on-ultrasound": {
    "@type": "MedicalCondition",
    name: "Twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Multiple_birth"],
  },
  "how-often-scans-twin-pregnancy": {
    "@type": "MedicalCondition",
    name: "Twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Multiple_birth"],
  },
  "chorionicity-twin-pregnancy-why-it-matters": {
    "@type": "MedicalEntity",
    name: "Chorionicity in twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Chorionicity"],
  },
  "monochorionic-vs-dichorionic-twins": {
    "@type": "MedicalEntity",
    name: "Chorionicity in twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Chorionicity"],
  },
  "twin-pregnancy-complications-doctors-look-for": {
    "@type": "MedicalCondition",
    name: "Twin pregnancy",
    sameAs: ["https://en.wikipedia.org/wiki/Multiple_birth"],
  },
  "fertility-tests-for-women-before-treatment": {
    "@type": "MedicalTest",
    name: "Female fertility tests",
    sameAs: ["https://en.wikipedia.org/wiki/Infertility"],
  },
  "male-fertility-tests-semen-analysis": {
    "@type": "MedicalTest",
    name: "Semen analysis",
    sameAs: ["https://en.wikipedia.org/wiki/Semen_analysis"],
  },
  "what-is-amh-fertility-test": {
    "@type": "MedicalTest",
    name: "Anti-Müllerian hormone (AMH) test",
    sameAs: ["https://en.wikipedia.org/wiki/Anti-M%C3%BCllerian_hormone"],
  },
  "follicular-monitoring-ovulation-scan": {
    "@type": "MedicalTest",
    name: "Follicular monitoring",
    sameAs: ["https://en.wikipedia.org/wiki/Ovulation"],
  },
  "how-to-know-when-you-are-ovulating": {
    "@type": "MedicalEntity",
    name: "Ovulation",
    sameAs: ["https://en.wikipedia.org/wiki/Ovulation"],
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
  // The byline names the clinical team, which is the organisation; the ref
  // merges into the canonical /#org node in the same @graph.
  const clinicalTeam = orgRef();
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
    isPartOf: webSiteRef(),
    ...(guide.reviewedAt
      ? {
          lastReviewed: guide.reviewedAt,
          reviewedBy: reviewerDoc ? personRef(reviewerDoc) : clinicalTeam,
        }
      : {}),
  };
}
