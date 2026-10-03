import type { Guide, GuideBlock } from "@/types/guide";

/**
 * Editorial rules for rendered copy. Enforced by scripts/check-guides.mjs
 * (guides) and scripts/check-content.mjs (all data files and app copy),
 * both run before every build.
 *
 * 1. No em dashes or en dashes anywhere in rendered copy.
 * 2. No sex-determination language (PCPNDT Act, 1994).
 * 3. No invisible characters or unusual spaces in rendered copy.
 * 4. No PLACEHOLDER, TODO or DRAFT markers in rendered strings.
 */

export const BANNED_DASHES = /[—–]/;

// Zero-width characters, word joiners, BOM, soft hyphen, non-breaking and
// narrow spaces. U+00A0 is included: copy uses regular spaces throughout.
export const INVISIBLE_CHARS =
  /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u00A0\u202F]/;

// Markers that must never reach rendered output. Match case-insensitively on
// whole words so "draft" in prose is caught too; comments are stripped by the
// checker before scanning.
export const MARKER_WORDS = /\b(placeholder|todo|draft|coming soon|lorem)\b/i;

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
