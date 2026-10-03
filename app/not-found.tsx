import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";

const links = [
  { label: "Services", href: "/services", hint: "All scans and tests" },
  { label: "Contact", href: "/contact", hint: "Call, WhatsApp, or visit" },
  { label: "Home", href: "/", hint: "Back to the start" },
];

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-16 text-center md:py-28">
      <BrandImage
        slug="baby-overhead"
        variant="circle"
        decorative
        reveal={false}
        sizes="112px"
        className="w-28 shadow-soft"
      />
      <h1 className="mt-8 text-balance text-[34px]/[40px] font-semibold text-ink md:text-4xl">
        We cannot find that page
      </h1>
      <p className="mt-3 max-w-md text-pretty text-muted-foreground">
        The page you are looking for does not exist or may have moved. These
        links will get you back on track.
      </p>

      {/* Mobile: ListRows for the key destinations. */}
      <div className="mt-8 w-full max-w-sm divide-y divide-rose-tint rounded-2xl border border-rose-tint bg-white text-left shadow-soft md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-14 items-center gap-3 px-4 py-3"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-base/[26px] font-semibold text-ink">
                {link.label}
              </span>
              <span className="block text-sm/[20px] text-ink-muted">
                {link.hint}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="mt-8 hidden flex-wrap justify-center gap-3 md:flex">
        <Button
          size="lg"
          nativeButton={false}
          className="bg-primary text-white hover:bg-primary-hover"
          render={<Link href="/" />}
        >
          Back to home
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="bg-white"
          render={<Link href="/services" />}
        >
          Browse services
          <ArrowRight aria-hidden="true" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="bg-white"
          render={<Link href="/contact" />}
        >
          Contact us
        </Button>
      </div>
    </Container>
  );
}
