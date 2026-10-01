import type { MetadataRoute } from "next";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";

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
    "/due-date-calculator",
    "/international-patients",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const doctorRoutes = doctors
    .filter((doctor) => doctor.hasProfile)
    .map((doctor) => ({
      url: `${site.url}/doctors/${doctor.slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...serviceRoutes, ...doctorRoutes];
}
