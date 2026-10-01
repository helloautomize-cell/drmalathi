import { DoctorCard } from "@/components/cards/doctor-card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { doctors } from "@/data/doctors";

export function DoctorsSection() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Our doctors"
          title="Meet your specialists"
          subtitle="A dedicated fetal medicine team, led by internationally trained specialists."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.slug} className="reveal h-full">
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
