import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { courses } from "@/data/courses";

export function FellowshipHighlight() {
  const confirmedCourses = courses.filter((course) => course.confirmed);

  return (
    <section className="relative overflow-hidden bg-plum py-16 text-white md:py-24">
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-accent-bright/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 text-sm font-bold tracking-[0.14em] uppercase text-accent-soft">
            Teaching and training
          </p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Fellowship and courses
          </h2>
          <p className="mt-4 text-white/75 md:text-lg">
            The centre trains doctors in fetal medicine and obstetric
            ultrasound, and regularly hosts CME programs and workshops.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <ol className="space-y-4">
            {confirmedCourses.map((course, i) => (
              <li
                key={course.title}
                className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <span className="font-heading text-3xl font-semibold text-accent-soft/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {course.title}
                  </h3>
                  <span className="mt-1.5 inline-block rounded-full bg-teal px-3 py-0.5 text-xs font-bold text-white">
                    {course.duration}
                  </span>
                </div>
              </li>
            ))}
            <li className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="outline"
                nativeButton={false}
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/fellowship" />}
              >
                About our programs
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/cme-activities" />}
              >
                See CME activities
                <ArrowRight aria-hidden="true" />
              </Button>
            </li>
          </ol>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <Image
              src="/images/courses/fetal-interventions-simulator.webp"
              alt="Fetal interventions simulator used for hands-on training at the centre"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/80 to-transparent px-5 pt-10 pb-4 text-sm font-medium text-white">
              Hands-on practice on a fetal interventions simulator
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
