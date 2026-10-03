import type { Guide, GuideBlock } from "@/types/guide";

/**
 * Editorial rules for guide copy. Enforced by scripts/check-guides.mjs
 * (run before every build) and reusable by any future CMS hook.
 *
 * 1. No em dashes or en dashes anywhere in guide content.
 * 2. No sex-determination language (PCPNDT Act, 1994).
 */

export const BANNED_DASHES = /[—–]/;

// Case-insensitive substring match. Keep plain-language phrases editors are
// likely to reach for, not the medical terms themselves.
export const BANNED_PHRASES = [
  "gender of the baby",
  "gender of your baby",
  "boy or girl",
  "sex of the baby",
  "sex determination",
  "gender determination",
];

function blockText(block: GuideBlock): string[] {
  switch (block.type) {
    case "h2":
    case "h3":
    case "paragraph":
    case "quote":
      return [block.text];
    case "list":
      return block.items;
    case "image":
      return [block.alt, block.caption ?? ""];
    case "callout":
      return [block.title ?? "", block.text];
    case "table":
      return [block.caption, ...block.headers, ...block.rows.flat()];
    case "cta":
      return [];
  }
}

export function collectGuideText(guide: Guide): string[] {
  return [
    guide.title,
    guide.excerpt,
    guide.coverImage.alt,
    guide.coverImage.caption ?? "",
    guide.quickAnswer ?? "",
    ...guide.content.flatMap(blockText),
    ...(guide.keyTakeaways ?? []),
    ...(guide.faqs ?? []).flatMap((f) => [f.question, f.answer]),
    guide.seo?.title ?? "",
    guide.seo?.description ?? "",
  ];
}

export function findGuideViolations(guide: Guide): string[] {
  const violations: string[] = [];
  const text = collectGuideText(guide).join("\n");
  if (BANNED_DASHES.test(text)) {
    violations.push("contains an em dash or en dash; replace it");
  }
  for (const phrase of BANNED_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      violations.push(`contains banned phrase "${phrase}" (PCPNDT)`);
    }
  }
  return violations;
}
