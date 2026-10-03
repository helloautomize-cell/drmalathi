import { ChevronDown } from "lucide-react";

/**
 * Collapsible table of contents for legal/prose pages (mobile only; the
 * prose is short enough to scan on desktop).
 */
export function OnThisPage({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <details className="group rounded-2xl border border-rose-tint bg-white shadow-soft md:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
        On this page
        <ChevronDown
          className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="divide-y divide-rose-tint border-t border-rose-tint px-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block py-3 text-base/[26px] text-ink-muted"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
