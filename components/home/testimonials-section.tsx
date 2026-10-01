import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials } from "@/data/testimonials";
import { trust } from "@/data/trust";

export function TestimonialsSection() {
  const video = trust.videoTestimonial;
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Patient stories"
          title="What families say about us"
          subtitle="Real words from families we have cared for."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
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
