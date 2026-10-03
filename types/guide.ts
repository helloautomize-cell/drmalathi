export type GuideCategory = {
  slug: string;
  name: string;
  /** One-line description shown under the category hero. */
  description: string;
};

export type GuideBlock =
  | { type: "h2" | "h3"; text: string; id?: string }
  | {
      type: "paragraph";
      /** Supports simple inline markdown: **bold**, *italic*, [text](href). */
      text: string;
    }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "callout";
      variant: "note" | "tip" | "important";
      title?: string;
      text: string;
    }
  | {
      type: "table";
      caption: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "cta"; service: string };

export type Guide = {
  slug: string;
  title: string;
  /** Optional shorter title used on cards; the page H1 keeps `title`. */
  cardTitle?: string;
  /** One to two lines, used in cards and as the meta description fallback. */
  excerpt: string;
  coverImage: { src: string; alt: string; caption?: string };
  /** Category slug, see data/guide-categories.ts. */
  category: string;
  /** 40 to 70 words: the short, direct answer shown in a tinted card. */
  quickAnswer?: string;
  content: GuideBlock[];
  keyTakeaways?: string[];
  faqs?: { question: string; answer: string }[];
  /**
   * External references cited by the article; rendered as a Sources list.
   * Plain bibliography entries may omit publisher/url.
   */
  sources?: { title: string; publisher?: string; url?: string }[];
  /**
   * Review state. The "Medically reviewed" byline, reviewer card and
   * reviewedBy/lastReviewed schema render ONLY when this is "reviewed" AND
   * reviewedAt is set. Never show a review badge on an unreviewed page.
   */
  reviewStatus?: "pending" | "reviewed";
  /** Doctor slug from data/doctors.ts; ignored unless reviewStatus is "reviewed". */
  reviewedBy?: string;
  /** ISO date, required for a review badge to render. */
  reviewedAt?: string;
  /** Service slug from data/services.ts. */
  relatedService?: string;
  /** ISO date; guides with a future date stay hidden. */
  publishedAt: string;
  /** ISO date; when later than publishedAt the meta line says "Updated". */
  updatedAt?: string;
  featured?: boolean;
  /** Not yet medically reviewed; flagged in data for editors, not visitors. */
  draft?: boolean;
  /** Placeholder guides to be removed before launch. */
  placeholder?: boolean;
  seo?: { title?: string; description?: string };
};
