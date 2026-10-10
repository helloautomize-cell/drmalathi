import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type LeadField,
  phoneInputPattern,
} from "@/lib/lead-validation";

export type ConsultOption = { slug: string; name: string };
export type ConsultContact = {
  callHref: string;
  callLabel: string;
  whatsappHref: string;
};

export type ConsultValues = {
  name: string;
  phone: string;
  doctor: string;
  service: string;
  preferredTime: string;
  consent: boolean;
};

export const emptyConsultValues: ConsultValues = {
  name: "",
  phone: "",
  doctor: "any",
  service: "any",
  preferredTime: "any",
  consent: false,
};

const preferredTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

// The class strings below mirror the base classes hard-coded inside
// components/ui/select.tsx (SelectTrigger), ui/checkbox.tsx, ui/input.tsx
// and ui/label.tsx. They exist here so the pre-hydration placeholder can
// render the exact same look as plain HTML — importing the real primitives
// in static mode would ship their JS and hydrate them eagerly, defeating
// the deferred-hydration wrapper. If those files' base classes change,
// update these to match.
const selectTriggerStaticClass =
  "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[size=default]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full bg-white";
const checkboxStaticClass =
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none mt-0.5";
const inputStaticClass =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";
const labelStaticClass =
  "flex items-center gap-2 text-sm leading-none font-medium select-none";

function StaticSelectTrigger({
  id,
  text,
}: {
  id: string;
  text: string;
}) {
  return (
    <button
      type="button"
      id={id}
      data-slot="select-trigger"
      data-size="default"
      aria-haspopup="listbox"
      className={selectTriggerStaticClass}
    >
      <span
        data-slot="select-value"
        className="flex flex-1 items-center gap-1.5 text-left"
      >
        {text}
      </span>
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </button>
  );
}

type ConsultFormBodyProps = {
  values: ConsultValues;
  errors: Partial<Record<LeadField, string>>;
  isSubmitting: boolean;
  /** false renders the same look as plain HTML (SSR placeholder). */
  interactive: boolean;
  doctorOptions: ConsultOption[];
  serviceOptions: ConsultOption[];
  setField?: <K extends keyof ConsultValues>(
    key: K,
    value: ConsultValues[K]
  ) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

/**
 * Shared markup for the callback form. The interactive form passes
 * `interactive` with its handlers; the lazy wrapper's SSR placeholder passes
 * `interactive={false}` and gets plain HTML with identical classes, so the
 * page looks the same before the form chunk loads.
 */
export function ConsultFormBody({
  values,
  errors,
  isSubmitting,
  interactive,
  doctorOptions,
  serviceOptions,
  setField,
  onSubmit,
}: ConsultFormBodyProps) {
  const inputProps = (key: "name" | "phone") =>
    interactive
      ? {
          value: values[key],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setField?.(key, e.target.value),
        }
      : {};

  const fieldLabel = (htmlFor: string, text: string) =>
    interactive ? (
      <Label htmlFor={htmlFor}>{text}</Label>
    ) : (
      <label htmlFor={htmlFor} data-slot="label" className={labelStaticClass}>
        {text}
      </label>
    );

  const serviceLabel =
    values.service === "any" || !values.service
      ? "Not sure yet"
      : (serviceOptions.find((s) => s.slug === values.service)?.name ??
        "Not sure yet");
  const doctorLabel =
    values.doctor === "any" || !values.doctor
      ? "Any doctor"
      : (doctorOptions.find((d) => d.slug === values.doctor)?.name ??
        "Any doctor");
  const timeLabel =
    preferredTimes.find((t) => t.value === values.preferredTime)?.label ??
    "No preference";

  return (
    <form
      onSubmit={interactive ? onSubmit : undefined}
      className="space-y-4"
      noValidate
    >
      {/* Honeypot field: off-screen so bots fill it but real users and
          assistive tech never reach it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        {fieldLabel("qc-name", "Your name")}
        {interactive ? (
          <Input
            id="qc-name"
            name="name"
            placeholder="Full name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            {...inputProps("name")}
            aria-invalid={!!errors.name}
          />
        ) : (
          <input
            id="qc-name"
            name="name"
            placeholder="Full name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            data-slot="input"
            className={inputStaticClass}
          />
        )}
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {fieldLabel("qc-phone", "Phone number")}
        {interactive ? (
          <Input
            id="qc-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+91"
            autoComplete="tel"
            required
            pattern={phoneInputPattern}
            {...inputProps("phone")}
            aria-invalid={!!errors.phone}
          />
        ) : (
          <input
            id="qc-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+91"
            autoComplete="tel"
            required
            pattern={phoneInputPattern}
            data-slot="input"
            className={inputStaticClass}
          />
        )}
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {fieldLabel("qc-service", "Service (optional)")}
        {interactive ? (
          <Select
            value={values.service}
            onValueChange={(v) => setField?.("service", v ?? "any")}
          >
            <SelectTrigger id="qc-service" className="w-full bg-white">
              <SelectValue>{() => serviceLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Not sure yet</SelectItem>
              {serviceOptions.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <StaticSelectTrigger id="qc-service" text={serviceLabel} />
        )}
      </div>

      <div className="space-y-1.5">
        {fieldLabel("qc-doctor", "Preferred doctor")}
        {interactive ? (
          <Select
            value={values.doctor}
            onValueChange={(v) => setField?.("doctor", v ?? "any")}
          >
            <SelectTrigger id="qc-doctor" className="w-full bg-white">
              <SelectValue>{() => doctorLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any doctor</SelectItem>
              {doctorOptions.map((doctor) => (
                <SelectItem key={doctor.slug} value={doctor.slug}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <StaticSelectTrigger id="qc-doctor" text={doctorLabel} />
        )}
      </div>

      <div className="space-y-1.5">
        {fieldLabel("qc-time", "Preferred time of day")}
        {interactive ? (
          <Select
            value={values.preferredTime}
            onValueChange={(v) => setField?.("preferredTime", v ?? "any")}
          >
            <SelectTrigger id="qc-time" className="w-full bg-white">
              <SelectValue>{() => timeLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">No preference</SelectItem>
              {preferredTimes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <StaticSelectTrigger id="qc-time" text={timeLabel} />
        )}
      </div>

      <div className="flex items-start gap-2.5">
        {interactive ? (
          <Checkbox
            checked={values.consent}
            onCheckedChange={(checked) =>
              setField?.("consent", checked === true)
            }
            required
            aria-invalid={!!errors.consent}
            aria-labelledby="qc-consent-label"
            className="mt-0.5 shrink-0"
          />
        ) : (
          <button
            type="button"
            role="checkbox"
            aria-checked="false"
            aria-required="true"
            aria-labelledby="qc-consent-label"
            data-slot="checkbox"
            className={checkboxStaticClass}
          />
        )}
        <p className="text-sm leading-snug text-muted-foreground">
          <span id="qc-consent-label">
            I consent to the centre contacting me about my enquiry.
          </span>{" "}
          <Link href="/privacy" className="link whitespace-nowrap">
            Privacy Policy
          </Link>
        </p>
      </div>
      {errors.consent ? (
        <p className="text-sm text-destructive">{errors.consent}</p>
      ) : null}

      <button
        type={interactive ? "submit" : "button"}
        data-slot="button"
        data-variant="default"
        data-size="lg"
        disabled={interactive ? isSubmitting : undefined}
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full bg-primary text-white hover:bg-primary-hover"
        )}
      >
        {isSubmitting ? "Sending..." : "Book appointment"}
      </button>
    </form>
  );
}
