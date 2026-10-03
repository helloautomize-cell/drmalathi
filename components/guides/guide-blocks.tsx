import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "cn";
import { imageBlurDataURL } from "@/lib/image-placeholder";
import { slugifyHeading } from "@/lib/guides";
import type { GuideBlock } from "@/types/guide";

const INLINE_RE =
  /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

/** Renders **bold**, *italic* and [links](href) inside paragraph text. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${match.index}`;
    if (match[2] !== undefined) {
      const href = match[3];
      const external = href.startsWith("http");
      const className =
        "font-medium text-primary underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
      nodes.push(
        external ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {match[2]}
          </a>
        ) : (
          <Link key={key} href={href} className={className}>
            {match[2]}
          </Link>
        )
      );
    } else if (match[4] !== undefined) {
      nodes.push(<strong key={key}>{match[4]}</strong>);
    } else {
      nodes.push(<em key={key}>{match[5]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const calloutStyles = {
  note: { icon: Info, classes: "bg-blush" },
  tip: { icon: Lightbulb, classes: "bg-teal-tint" },
  important: { icon: AlertTriangle, classes: "bg-amber-tint" },
} as const;

function GuideTable({ block }: { block: Extract<GuideBlock, { type: "table" }> }) {
  return (
    <figure className="mt-8">
      {/* Desktop: real table. Mobile: stacked labelled cards. */}
      <div className="hidden overflow-hidden rounded-2xl border border-rose-tint md:block">
        <table className="w-full border-collapse text-left text-base/[26px]">
          <caption className="border-b border-rose-tint bg-blush px-5 py-3 text-left text-sm font-semibold text-ink">
            {block.caption}
          </caption>
          <thead>
            <tr className="border-b border-rose-tint">
              {block.headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-sm font-semibold text-ink"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-blush/50"}
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 text-ink-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="sr-only md:hidden">{block.caption}</figcaption>
      <ul className="space-y-3 md:hidden" aria-label={block.caption}>
        {block.rows.map((row, i) => (
          <li
            key={i}
            className="rounded-2xl border border-rose-tint bg-white p-4"
          >
            {row.map((cell, j) => (
              <p key={j} className="text-base/[26px] text-ink">
                <span className="text-sm font-semibold text-primary">
                  {block.headers[j]}:{" "}
                </span>
                {cell}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] text-ink-muted md:hidden">{block.caption}</p>
    </figure>
  );
}

/** Renders a single rich-text block with article typography. */
export function GuideBlockRenderer({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id ?? slugifyHeading(block.text)}
          className="mt-12 scroll-mt-24 font-heading text-[24px]/[30px] font-semibold text-balance text-ink md:text-[28px]/[36px]"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 font-heading text-[20px]/[28px] font-semibold text-balance text-ink">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="mt-5 text-[17px]/[28px] text-pretty text-ink md:text-[18px]/[30px]">
          {renderInline(block.text)}
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "mt-5 space-y-3 text-[17px]/[28px] text-ink md:text-[18px]/[30px]",
            block.ordered
              ? "list-decimal marker:font-semibold marker:text-primary"
              : "list-disc marker:text-primary",
            "pl-6"
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="mt-8 border-l-4 border-rose pl-5 font-heading text-[20px]/[30px] text-pretty text-ink">
          {block.text}
        </blockquote>
      );
    case "image":
      return (
        <figure className="mt-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 1024px) 68ch, 100vw"
              placeholder="blur"
              blurDataURL={imageBlurDataURL}
              className="object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-center text-[13px]/[20px] text-ink-muted">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "callout": {
      const { icon: Icon, classes } = calloutStyles[block.variant];
      return (
        <aside
          className={cn(
            "mt-8 flex gap-4 rounded-2xl p-5",
            classes
          )}
        >
          <Icon className="mt-1 size-6 shrink-0 text-ink" aria-hidden="true" />
          <div>
            {block.title ? (
              <p className="font-heading text-[19px]/[26px] font-semibold text-ink">
                {block.title}
              </p>
            ) : null}
            <p className="mt-1 text-base/[26px] text-pretty text-ink">
              {renderInline(block.text)}
            </p>
          </div>
        </aside>
      );
    }
    case "table":
      return <GuideTable block={block} />;
    case "cta":
      return null; // rendered by the page via GuideCtaBlock (needs the service)
  }
}
