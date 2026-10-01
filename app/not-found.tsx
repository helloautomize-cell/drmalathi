import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/shared/brand-image";
import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-20 text-center md:py-28">
      <BrandImage
        slug="baby-overhead"
        variant="circle"
        decorative
        reveal={false}
        sizes="112px"
        className="w-28 shadow-soft"
      />
      <h1 className="mt-8 text-3xl font-semibold text-ink md:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </div>
    </Container>
  );
}
