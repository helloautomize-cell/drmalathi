import Link from "next/link";
import { type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronDownIcon, Loader2, Phone } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  maskMobile,
  NO_PREFERENCE,
  PREFERRED_TIMES,
  UNSURE_SERVICE,
} from "@/lib/booking-schema";

export type BookingOption = { value: string; label: string };
export type BookingLayout = "page" | "sheet";

export type BookingValues = {
  name: string;
  mobile: string;
  service: string;
  doctor: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  consent: boolean;
};

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

export const emptyBookingValues: BookingValues = {
  name: "",
  mobile: "",
  service: "",
  doctor: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
  consent: false,
};

/**
 * Doctor select list used by every booking surface. Only these doctors take
 * online appointment requests; the last entry lets a visitor opt out.
 */
export const BOOK_DOCTOR_SLUGS = [
  "dr-malathi-g-prasad",
  "dr-revathy-chandrasekharan",
];

/** One option list for service and doctor, identical on every surface. */
export function bookingOptionLists(): {
  serviceOptions: BookingOption[];
  doctorOptions: BookingOption[];
} {
  return {
    serviceOptions: [
      ...services.map((s) => ({ value: s.name, label: s.name })),
      { value: UNSURE_SERVICE, label: UNSURE_SERVICE },
    ],
    doctorOptions: [
      ...doctors
        .filter((d) => BOOK_DOCTOR_SLUGS.includes(d.slug))
        .map((d) => ({ value: d.name, label: d.name })),
      { value: NO_PREFERENCE, label: NO_PREFERENCE },
    ],
  };
}

// The class strings below mirror the base classes inside components/ui
// (select trigger, checkbox, input). They let the non-interactive render
// show the exact same look as plain HTML, so the lazy placeholder on
// /contact matches the hydrated form. Update them if those files change.
const selectTriggerStaticClass =
  "flex items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none w-full bg-white h-12";
const checkboxStaticClass =
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none mt-0.5";
const inputStaticClass =
  "h-12 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";
const labelStaticClass =
  "flex items-center gap-2 text-sm leading-none font-medium select-none";

function StaticSelectTrigger({ id, text }: { id: string; text: string }) {
  return (
    <button
      type="button"
      id={id}
      data-slot="select-trigger"
      aria-haspopup="listbox"
      className={selectTriggerStaticClass}
    >
      <span
        data-slot="select-value"
        className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-left"
      >
        {text}
      </span>
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </button>
  );
}

type BookingFieldsProps = {
  /** "page" = stacked fields for /book and the contact callback card.
      "sheet" = fields scroll, consent + submit pin to the sheet bottom. */
  layout: BookingLayout;
  /** false renders identical plain-HTML markup with no handlers (the
      pre-hydration placeholder on /contact). */
  interactive: boolean;
  idPrefix: string;
  values: BookingValues;
  errors: BookingErrors;
  isSubmitting: boolean;
  serviceOptions: BookingOption[];
  doctorOptions: BookingOption[];
  minDate: string;
  maxDate: string;
  setField?: <K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K]
  ) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** Sheet only: appended at the end of the scrolling area (divider + tiles). */
  trailing?: ReactNode;
  /** Page only: rendered under the submit button (the call link on /book). */
  afterSubmit?: ReactNode;
};

/**
 * The single source of booking-form markup. Every booking surface renders
 * this: BookForm on /book, BookingForm in the sheet and QuickConsultForm on
 * /contact all wrap it with only a source and a layout. The lazy placeholder
 * renders the same component with interactive={false}.
 */
export function BookingFields({
  layout,
  interactive,
  idPrefix,
  values,
  errors,
  isSubmitting,
  serviceOptions,
  doctorOptions,
  minDate,
  maxDate,
  setField,
  onSubmit,
  trailing,
  afterSubmit,
}: BookingFieldsProps) {
  const id = (part: string) => `${idPrefix}-${part}`;

  const fieldLabel = (htmlFor: string, text: string) =>
    interactive ? (
      <Label htmlFor={htmlFor}>{text}</Label>
    ) : (
      <label htmlFor={htmlFor} data-slot="label" className={labelStaticClass}>
        {text}
      </label>
    );

  const textInput = (
    key: "name" | "mobile",
    extra: Record<string, unknown>
  ) =>
    interactive ? (
      <Input
        value={values[key]}
        onChange={(e) => setField?.(key, e.target.value)}
        aria-invalid={!!errors[key]}
        className="h-12"
        {...extra}
      />
    ) : (
      <input
        data-slot="input"
        className={inputStaticClass}
        {...extra}
      />
    );

  const selectControl = (
    key: "service" | "doctor" | "preferredTime",
    triggerId: string,
    placeholder: string,
    options: readonly BookingOption[]
  ) => {
    const label =
      options.find((o) => o.value === values[key])?.label ?? placeholder;
    return (
      <>
        {interactive ? (
          <Select
            value={values[key]}
            onValueChange={(v) => setField?.(key, v ?? "")}
          >
            <SelectTrigger
              id={triggerId}
              className="h-12! w-full bg-white"
              aria-invalid={!!errors[key]}
            >
              <SelectValue className="min-w-0 truncate">
                {() => label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <StaticSelectTrigger id={triggerId} text={label} />
        )}
        {errors[key] ? (
          <p className="text-sm text-destructive">{errors[key]}</p>
        ) : null}
      </>
    );
  };

  const fields = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        {fieldLabel(id("name"), "Your name")}
        {textInput("name", {
          id: id("name"),
          name: "name",
          placeholder: "Full name",
          autoComplete: "name",
          required: true,
          minLength: 2,
          maxLength: 60,
        })}
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {fieldLabel(id("mobile"), "Mobile number")}
        {textInput("mobile", {
          id: id("mobile"),
          name: "mobile",
          type: "tel",
          inputMode: "tel",
          placeholder: "10 digit mobile",
          autoComplete: "tel-national",
          required: true,
        })}
        {errors.mobile ? (
          <p className="text-sm text-destructive">{errors.mobile}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {fieldLabel(id("service"), "What do you need?")}
        {selectControl("service", id("service"), "Choose a service", serviceOptions)}
      </div>

      <div className="space-y-1.5">
        {fieldLabel(id("doctor"), "Preferred doctor")}
        {selectControl("doctor", id("doctor"), "Choose a doctor", doctorOptions)}
      </div>

      <div className="grid gap-3 min-[360px]:grid-cols-2">
        <div className="space-y-1.5">
          {fieldLabel(id("date"), "Preferred day")}
          {interactive ? (
            <Input
              id={id("date")}
              name="preferredDate"
              type="date"
              required
              min={minDate}
              max={maxDate}
              value={values.preferredDate}
              onChange={(e) => setField?.("preferredDate", e.target.value)}
              aria-invalid={!!errors.preferredDate}
              className="h-12"
            />
          ) : (
            <input
              id={id("date")}
              name="preferredDate"
              type="date"
              required
              min={minDate}
              max={maxDate}
              data-slot="input"
              className={inputStaticClass}
            />
          )}
          {errors.preferredDate ? (
            <p className="text-sm text-destructive">{errors.preferredDate}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          {fieldLabel(id("time"), "Preferred time")}
          {selectControl(
            "preferredTime",
            id("time"),
            "Choose a time",
            PREFERRED_TIMES.map((t) => ({ value: t, label: t }))
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {fieldLabel(id("notes"), "Anything else? (optional)")}
        {interactive ? (
          <Textarea
            id={id("notes")}
            name="notes"
            rows={3}
            maxLength={300}
            value={values.notes}
            onChange={(e) => setField?.("notes", e.target.value)}
            aria-invalid={!!errors.notes}
            aria-describedby={id("notes-help")}
          />
        ) : (
          <textarea
            id={id("notes")}
            name="notes"
            rows={3}
            maxLength={300}
            data-slot="textarea"
            aria-describedby={id("notes-help")}
            className="w-full min-w-0 rounded-lg border border-input bg-white px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground md:text-sm"
          />
        )}
        <p id={id("notes-help")} className="text-sm text-muted-foreground">
          Please do not share medical reports or health details here.
        </p>
        {errors.notes ? (
          <p className="text-sm text-destructive">{errors.notes}</p>
        ) : null}
      </div>
    </div>
  );

  const actions = (
    <>
      <div className="flex items-start gap-3">
        {interactive ? (
          <Checkbox
            checked={values.consent}
            onCheckedChange={(checked) =>
              setField?.("consent", checked === true)
            }
            required
            aria-invalid={!!errors.consent}
            aria-labelledby={id("consent-label")}
            className="mt-0.5 shrink-0"
          />
        ) : (
          <button
            type="button"
            role="checkbox"
            aria-checked="false"
            aria-required="true"
            aria-labelledby={id("consent-label")}
            data-slot="checkbox"
            className={checkboxStaticClass}
          />
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span id={id("consent-label")}>
            I agree that Trichy Fetal Medicine and Fertility Centre may store
            these details to contact me about my appointment.
          </span>{" "}
          <Link href="/privacy" className="link whitespace-nowrap">
            Privacy Policy
          </Link>
        </p>
      </div>
      {errors.consent ? (
        <p className="text-sm text-destructive">{errors.consent}</p>
      ) : null}
      {interactive ? (
        <button
          type="submit"
          data-slot="button"
          data-variant="default"
          data-size="lg"
          disabled={isSubmitting}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full whitespace-nowrap bg-primary text-white hover:bg-primary-hover"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Request appointment"
          )}
        </button>
      ) : (
        <button
          type="button"
          data-slot="button"
          data-variant="default"
          data-size="lg"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full whitespace-nowrap bg-primary text-white"
          )}
        >
          Request appointment
        </button>
      )}
    </>
  );

  const honeypot = (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );

  if (layout === "sheet") {
    return (
      <form
        onSubmit={interactive ? onSubmit : undefined}
        className="flex min-h-0 flex-1 flex-col"
        noValidate
      >
        {honeypot}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
          {fields}
          {trailing ? <div className="mt-5">{trailing}</div> : null}
        </div>
        <div className="shrink-0 space-y-3 border-t border-border bg-popover px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {actions}
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={interactive ? onSubmit : undefined}
      className="space-y-4"
      noValidate
    >
      {honeypot}
      {fields}
      {actions}
      {afterSubmit}
    </form>
  );
}

/** Shared post-submit state for every booking surface. */
export function BookingSuccessCard({
  bookingId,
  mobile,
  onDone,
}: {
  bookingId?: string;
  mobile?: string;
  onDone?: () => void;
}) {
  return (
    <div className="py-5 text-center" role="status">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-tint text-teal">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-ink">Request received</h3>
      <p className="mt-2 text-base text-muted-foreground">
        Thank you. Your request is received. Our team will call you on{" "}
        {mobile ? maskMobile(mobile) : "your number"} to confirm your
        appointment time.
      </p>
      {bookingId ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Booking ID:{" "}
          <span className="font-mono font-semibold text-ink">{bookingId}</span>
        </p>
      ) : null}
      <p className="mt-4 text-sm font-semibold text-ink">
        Anything urgent? Reach us directly:
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <a
          href={site.phones[0].href}
          className={cn(
            buttonVariants({ size: "default" }),
            "bg-primary text-white hover:bg-primary-hover"
          )}
        >
          <Phone aria-hidden="true" />
          Call {site.phones[0].label}
        </a>
        <a
          href={site.whatsapp.messageHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" })
          )}
        >
          <WhatsAppIcon aria-hidden="true" />
          WhatsApp us
        </a>
      </div>
      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          className="mt-5 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Close
        </button>
      ) : null}
    </div>
  );
}
