// TODO: client to confirm event details, dates and photo descriptions before
// launch. Dates are taken from the printed event banners and posters.
// Alt text is descriptive draft copy pending client approval.

import type { LightboxImage } from "@/components/shared/lightbox";

export type CmeEvent = {
  id: string;
  title: string;
  /** Human-readable date line, e.g. "23 to 24 August 2025". */
  dateLabel: string;
  /** Year used to group events on the page. */
  year: number;
  venue: string;
  partner?: string;
  /** Optional programme PDF under /public. */
  pdf?: string;
  blurb: string;
  photos: LightboxImage[];
};

export const cmeEvents: CmeEvent[] = [
  {
    id: "isuog-tmfc-2025",
    title: "ISUOG Trichy Materno-Fetal Conclave",
    dateLabel: "23 to 24 August 2025",
    year: 2025,
    venue: "Courtyard by Marriott, Trichy",
    partner: "ISUOG",
    pdf: "/docs/ISUOG-Trichy-Materno-Fetal-Conclave.pdf",
    blurb:
      "A two-day regional conclave on maternal-fetal medicine, hosted in association with ISUOG.",
    photos: [
      {
        src: "/images/cme/tmfc1.webp",
        alt: "Welcome banners at the conclave entrance",
        width: 1600,
        height: 1066,
      },
      {
        src: "/images/cme/tmfc3.webp",
        alt: "Delegates attending a fetal imaging lecture at the conclave",
        width: 1600,
        height: 900,
      },
      {
        src: "/images/cme/tmfc4.webp",
        alt: "A session in progress at the Materno-Fetal Conclave",
        width: 1600,
        height: 1066,
      },
      {
        src: "/images/cme/tmfc5.webp",
        alt: "Faculty and delegates at the Materno-Fetal Conclave",
        width: 1600,
        height: 1200,
      },
      {
        src: "/images/cme/tmfc6.webp",
        alt: "The conclave hall during a lecture session",
        width: 1600,
        height: 1066,
      },
    ],
  },
  {
    id: "fetal-usg-intervention-2025",
    title: "Fetal Ultrasound Intervention: Hands-on Training",
    dateLabel: "13 to 14 December 2025",
    year: 2025,
    venue: "ONElearning Academy, at the centre",
    blurb:
      "A two-day hands-on workshop on fetal ultrasound interventions for practicing doctors.",
    photos: [
      {
        src: "/images/cme/cme3.webp",
        alt: "A specialist lecturing on fetal imaging at the centre",
        width: 563,
        height: 750,
      },
      {
        src: "/images/cme/cme2.webp",
        alt: "Delegates at a fetal medicine teaching session",
        width: 1000,
        height: 750,
      },
      {
        src: "/images/cme/cme6.webp",
        alt: "A hands-on session during the training workshop",
        width: 1000,
        height: 750,
      },
      {
        src: "/images/cme/cme7.webp",
        alt: "Faculty demonstrating a technique at the workshop",
        width: 1000,
        height: 750,
      },
      {
        src: "/images/cme/cme8.webp",
        alt: "A trainee at a workstation during the workshop",
        width: 536,
        height: 750,
      },
      {
        src: "/images/cme/simulator-workshop.webp",
        alt: "Poster for the simulator-based workshop at the centre",
        width: 841,
        height: 628,
      },
    ],
  },
];

export function cmeYears(): { year: number; events: CmeEvent[] }[] {
  const byYear = new Map<number, CmeEvent[]>();
  for (const event of cmeEvents) {
    byYear.set(event.year, [...(byYear.get(event.year) ?? []), event]);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, events]) => ({ year, events }));
}
