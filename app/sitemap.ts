import type { MetadataRoute } from "next";
import { pageLastModified } from "@/data/content-dates";
import { legal } from "@/data/legal";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  categoriesInUse,
  getAllGuides,
  hasPublishedGuides,
} from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/fellowship",
    "/cme-activities",
    "/doctors",
    "/gallery",
    "/contact",
    "/faq",
    "/international-patients",
    "/privacy",
    "/terms",
    // Draft pages enter the sitemap only after counsel sign-off.
    ...(legal.editorialPolicy.draftPendingReview ? [] : ["/editorial-policy"]),
    ...(legal.accessibility.draftPendingReview ? [] : ["/accessibility"]),
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: pageLastModified[path || "/"],
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: service.lastModified,
  }));

  const doctorRoutes = doctors
    .filter((doctor) => doctor.hasProfile)
    .map((doctor) => ({
      url: `${site.url}/doctors/${doctor.slug}`,
      lastModified: doctor.lastModified,
    }));

  // Guide routes enter the sitemap only while at least one guide is
  // published; with all guides in draft they stay out entirely.
  if (!hasPublishedGuides()) {
    return [...staticRoutes, ...serviceRoutes, ...doctorRoutes];
  }

  const guideRoutes = getAllGuides().guides.map((guide) => ({
    url: `${site.url}/guides/${guide.slug}`,
    lastModified: guide.updatedAt ?? guide.publishedAt,
  }));

  const guideCategoryRoutes = categoriesInUse().map((category) => ({
    url: `${site.url}/guides/category/${category.slug}`,
    lastModified: pageLastModified["/guides"],
  }));

  return [
    ...staticRoutes,
    { url: `${site.url}/guides`, lastModified: pageLastModified["/guides"] },
    ...serviceRoutes,
    ...doctorRoutes,
    ...guideRoutes,
    ...guideCategoryRoutes,
  ];
}
