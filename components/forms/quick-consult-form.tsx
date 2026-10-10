"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { requestAppointment } from "@/app/actions/appointment";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import {
  ConsultFormBody,
  emptyConsultValues,
  type ConsultContact,
  type ConsultOption,
  type ConsultValues,
} from "@/components/forms/quick-consult-form-body";
import {
  type LeadField,
  validateLead,
} from "@/lib/lead-validation";

export function QuickConsultForm({
  doctorOptions,
  serviceOptions,
  contact,
}: {
  doctorOptions: ConsultOption[];
  serviceOptions: ConsultOption[];
  contact: ConsultContact;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [startedAt] = useState(() => new Date().toISOString());
  const [values, setValues] = useState<ConsultValues>(emptyConsultValues);
  const [errors, setErrors] = useState<
    Partial<Record<LeadField, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof ConsultValues>(
    key: K,
    value: ConsultValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key as LeadField] ? { ...e, [key]: undefined } : e));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the form now: currentTarget is null after the synthetic event
    // finishes, which is past the dynamic imports below.
    const form = event.currentTarget;
    const parsed = validateLead(values, {
      doctorSlugs: doctorOptions.map((d) => d.slug),
      serviceSlugs: serviceOptions.map((s) => s.slug),
    });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { toast } = await import("sonner");
      const formData = new FormData(form);
      formData.set("doctor", parsed.data.doctor);
      formData.set("service", parsed.data.service);
      formData.set("preferredTime", parsed.data.preferredTime);
      formData.set("source", "contact-page");
      formData.set("consent", values.consent ? "on" : "");
      formData.set("startedAt", startedAt);

      const result = await requestAppointment(formData);
      if (result.ok) {
        setSubmitted(true);
        setValues(emptyConsultValues);
      } else if (result.deliveryFailed) {
        setFailedMessage(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (failedMessage) {
    return <ContactFallbackPanel message={failedMessage} />;
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl bg-blush p-6">
        <p className="flex items-center gap-2 text-lg font-semibold text-ink">
          <CheckCircle2 className="size-5 text-teal" aria-hidden="true" />
          Request received
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Our team will call you back on the number you shared.</li>
          <li>We will confirm a convenient time and doctor for your visit.</li>
          <li>Keep your phone nearby during opening hours.</li>
        </ul>
        <p className="mt-4 text-sm font-semibold text-ink">
          Need us sooner? Reach us directly:
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            className="bg-primary text-white hover:bg-primary-hover"
            render={<a href={contact.callHref} />}
          >
            <Phone aria-hidden="true" />
            Call {contact.callLabel}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            className="border-teal text-teal hover:bg-teal-tint hover:text-teal"
            render={
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <WhatsAppIcon aria-hidden="true" />
            WhatsApp us
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ConsultFormBody
      interactive
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      doctorOptions={doctorOptions}
      serviceOptions={serviceOptions}
      setField={setField}
      onSubmit={onSubmit}
    />
  );
}
