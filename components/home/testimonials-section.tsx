import { ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Container } from "@/components/shared/container";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import { trust } from "@/data/trust";
import { showPending } from "@/lib/env";

export function TestimonialsSection() {
  const video = trust.videoTestimonial;
  const googleReviewsUrl = trust.googleReviewsUrl;
  // Production shows only testimonials with written consent on file; previews
  // also show pending-consent ones so editors can review them.
  const visible = testimonials.filter(
    (t) => t.consentOnFile === true || (showPending && t.consentOnFile === null)
  );
  if (!visible.length && !video && !googleReviewsUrl) return null;
  return (
    <Section surface="white" className="md:bg-white">
      <Container>
        <SectionHeader
          eyebrow="Patient stories"
          title="What families say about us"
          subtitle="Real words from families we have cared for."
        />
        <MobileCarousel
          label="Patient testimonials"
          className="md:grid md:grid-cols-3 md:gap-6"
          items={visible.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        />
        {/* Renders only when NEXT_PUBLIC_GOOGLE_REVIEWS_URL is set. Never show
            a rating or count here unless it comes from that live listing. */}
        {googleReviewsUrl ? (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Read more reviews on Google
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
        {video ? (
          <div className="mt-8 overflow-hidden rounded-3xl shadow-card">
            {/* TODO: wire a real video player when the client supplies media */}
            <video
              controls
              preload="none"
              poster={video.poster}
              className="aspect-video w-full"
            >
              <source src={video.src} />
            </video>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
