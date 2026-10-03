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
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/logo-transparent.png`,
    },
  };
}

export function medicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: site.name,
    url: site.url,
    description: site.description,
    image: `${site.url}/images/family-cutout.webp`,
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

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };
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
export function personSchema(doctor: DoctorRecord) {
  return {
    "@context": "https://schema.org",
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

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: `${course.title} for ${course.eligibility.join(" or ")}.`,
    provider: clinicRef(),
    ...(course.educationalCredentialConfirmed
      ? { educationalCredentialAwarded: course.title }
      : {}),
  };
}

export function medicalProcedureSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name,
    description: service.shortDescription,
    url: `${site.url}/services/${service.slug}`,
    bodyLocation: "Fetus and pregnancy",
    ...(service.preparation ? { preparation: service.preparation } : {}),
    ...(service.reportAndNextSteps
      ? { followup: service.reportAndNextSteps }
      : {}),
    provider: clinicRef(),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
