import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { imageBlurDataURL } from "@/lib/image-placeholder";

type IconType = ComponentType<{
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}>;

export function MobileIconTile({
  icon: Icon,
  tone = "scan",
}: {
  icon: IconType;
  tone?: "scan" | "blood" | "teal";
}) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl",
        tone === "scan" ? "bg-rose-tint text-primary" : "bg-teal-tint text-teal"
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden={true} />
    </span>
  );
}

export function ImageTile({
  src,
  alt,
  icon,
  tone,
  chip,
  title,
  description,
  href,
  actionLabel = "Learn more",
  children,
}: {
  src: string;
  alt: string;
  icon: IconType;
  tone?: "scan" | "blood";
  chip?: string;
  title: string;
  description: string;
  href: string;
  actionLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <article data-mobile-card="image" className="overflow-hidden rounded-2xl border border-rose-tint bg-plum shadow-soft">
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 85vw, 33vw"
          placeholder="blur"
          blurDataURL={imageBlurDataURL}
          className="object-cover"
        />
      </div>
      <div className="bg-gradient-to-b from-plum to-[#260819] p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <MobileIconTile icon={icon} tone={tone} />
          {chip ? (
            <span className="rounded-full border border-white/25 px-3 py-1 text-[13px]/[20px] font-semibold">
              {chip}
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-[19px]/[26px] font-semibold text-white">{title}</h3>
        <p className="mt-2 line-clamp-1 text-base/[26px] text-white/80">{description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          {children}
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm/[20px] font-semibold text-white">
            {actionLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function InfoCard({
  icon,
  tone,
  chip,
  title,
  children,
  href,
  linkLabel = "Learn more",
  surface = "white",
  className,
}: {
  icon: IconType;
  tone?: "scan" | "blood";
  chip?: string;
  title: string;
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
  surface?: "white" | "blush";
  className?: string;
}) {
  return (
    <article
      data-mobile-card="info"
      className={cn(
        "flex flex-col rounded-2xl border border-rose-tint p-5 shadow-soft",
        surface === "white" ? "bg-white" : "bg-blush",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <MobileIconTile icon={icon} tone={tone} />
        {chip ? (
          <span className="rounded-full bg-rose-tint px-3 py-1 text-[13px]/[20px] font-semibold text-plum">
            {chip}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-[19px]/[26px] font-semibold text-ink">{title}</h3>
      <div className="mt-2 text-base/[26px] text-ink-muted text-pretty">{children}</div>
      {href ? (
        <Link href={href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm/[20px] font-semibold text-primary max-md:min-h-11">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}

export function ListRow({
  label,
  href,
  meta,
  icon: Icon,
  current = false,
  onClick,
  className,
}: {
  label: string;
  href: string;
  meta?: string;
  icon?: IconType;
  current?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      data-mobile-card="list-row"
      className={cn(
        "flex min-h-14 w-full items-center gap-3 border-b border-rose-tint px-1 py-3 text-left text-base/[26px] font-semibold text-ink",
        current && "border-l-4 border-l-primary pl-3 text-primary",
        className
      )}
    >
      {Icon ? <Icon className="size-5 shrink-0 text-primary" aria-hidden={true} /> : null}
      <span className="min-w-0 flex-1">{label}</span>
      {meta ? <span className="text-[13px]/[20px] font-normal text-ink-muted">{meta}</span> : null}
      <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
    </Link>
  );
}

export function PlumCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article data-mobile-card="plum" className={cn("rounded-3xl bg-plum p-5 text-white shadow-card", className)}>
      <h3 className="text-[19px]/[26px] font-semibold text-white">{title}</h3>
      <div className="mt-3 text-base/[26px] text-white/80 text-pretty">{children}</div>
    </article>
  );
}
