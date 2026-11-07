import Link from "next/link";
import { type FormEvent, type ReactNode, type RefObject } from "react";
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
import {
  prepNoteFor,
  reasonsFor,
  VISIT_TYPES,
} from "@/data/booking-options";
import { site } from "@/data/site";
import type { DayView } from "@/lib/google-sheets";
import { maskMobile } from "@/lib/booking-schema";

export type BookingLayout = "page" | "sheet";

export type BookingValues = {
  visitType: string;
  reason: string;
  /** YYYY-MM-DD. */
  date: string;
  /** "HH:mm" start of the chosen slot. */
  slotStart: string;
  name: string;
  mobile: string;
  notes: string;
  consent: boolean;
};

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

export const emptyBookingValues: BookingValues = {
  visitType: "",
  reason: "",
  date: "",
  slotStart: "",
  name: "",
  mobile: "",
  notes: "",
  consent: false,
};

/** Live availability state owned by the controller. */
export type AvailabilityState = {
  today: string;
  lastDate: string;
  /** Day views keyed by YYYY-MM-DD. */
  days: Record<string, DayView>;
  /** True while any availability request is in flight. */
  loading: boolean;
  /** The Sheet could not be reached; the call notice replaces the form. */
  offline: boolean;
};

/** "2026-11-12" -> "Thu 12 Nov" (same format the Sheet's emails use). */
export function prettyDate(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dow = days[new Date(`${ymd}T00:00:00Z`).getUTCDay()];
  return `${dow} ${Number(ymd.slice(8))} ${months[Number(ymd.slice(5, 7)) - 1]}`;
}

/** One label per day-strip button: Today, Tomorrow, then "Wed 12". */
export function dayStripLabel(date: string, today: string): string {
  const next = new Date(`${today}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const tomorrow = next.toISOString().slice(0, 10);
  if (date === today) return "Today";
  if (date === tomorrow) return "Tomorrow";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dow = days[new Date(`${date}T00:00:00Z`).getUTCDay()];
  return `${dow} ${Number(date.slice(8))}`;
}

/** Status line under a slot's time label; never colour alone. */
function slotStatus(slot: { capacity: number; left: number; open: boolean }): string {
  if (slot.open) return slot.left === 1 ? "1 left" : `${slot.left} left`;
  if (slot.capacity > 0 && slot.left === 0) return "Full";
  return "Closed";
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
  availability: AvailabilityState;
  /** Inline message near the slot grid (e.g. "that time just filled up"). */
  slotError?: string | null;
  /** Focus target for the slot area so errors move focus there. */
  slotRegionRef?: RefObject<HTMLFieldSetElement | null>;
  setField?: <K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K]
  ) => void;
  /** Called when a day-strip day or the More dates input changes. The
      controller fetches that day when it is outside the cached range. */
  onPickDate?: (date: string) => void;
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
  availability,
  slotError,
  slotRegionRef,
  setField,
  onPickDate,
  onSubmit,
  trailing,
  afterSubmit,
}: BookingFieldsProps) {
  const id = (part: string) => `${idPrefix}-${part}`;
  const reasonOptions = values.visitType ? reasonsFor(values.visitType) : [];
  const prepNote = values.visitType === "Test only" ? prepNoteFor(values.reason) : "";
  const pickedDay: DayView | undefined = values.date
    ? availability.days[values.date]
    : undefined;

  // Fourteen strip days starting at the server's today. Days the Sheet did
  // not return (outside the booking window) are skipped.
  const stripDates: string[] = [];
  if (availability.today) {
    for (let i = 0; i < 14 && stripDates.length < 14; i++) {
      const d = new Date(`${availability.today}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + i);
      const ymd = d.toISOString().slice(0, 10);
      if (ymd > availability.lastDate) break;
      const view = availability.days[ymd];
      // Hide Today when it has no open slot left.
      if (i === 0 && view && !view.slots.some((s) => s.open)) continue;
      stripDates.push(ymd);
    }
  }

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

  const visitTypeSection = (
    <fieldset className="min-w-0 space-y-2">
      <legend className="text-sm font-medium text-ink">
        What brings you in?
      </legend>
      <div className="grid gap-2 min-[420px]:grid-cols-2">
        {VISIT_TYPES.map((type) => {
          const checked = values.visitType === type.value;
          const input = (
            <input
              type="radio"
              name={id("visitType")}
              value={type.value}
              checked={interactive ? checked : undefined}
              defaultChecked={interactive ? undefined : false}
              onChange={
                interactive
                  ? () => {
                      setField?.("visitType", type.value);
                      setField?.("reason", "");
                    }
                  : undefined
              }
              className="peer sr-only"
            />
          );
          const cardClass = cn(
            "flex min-h-11 cursor-pointer flex-col gap-0.5 rounded-xl border border-rose-tint bg-white px-3.5 py-3 transition-colors",
            "peer-checked:border-primary peer-checked:bg-rose-tint/60 peer-checked:shadow-soft",
            "peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
            !interactive && "cursor-default"
          );
          return (
            <label key={type.value} className="min-w-0">
              {interactive ? (
                input
              ) : (
                <input type="radio" className="peer sr-only" disabled />
              )}
              <span className={cardClass}>
                <span className="text-sm font-semibold text-ink">
                  {type.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {type.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {errors.visitType ? (
        <p className="text-sm text-destructive">{errors.visitType}</p>
      ) : null}
    </fieldset>
  );

  const reasonSection = (
    <div className="min-w-0 space-y-1.5">
      {fieldLabel(
        id("reason"),
        values.visitType === "Test only" ? "Which test?" : "Reason for visit"
      )}
      {interactive ? (
        <Select
          value={values.reason}
          onValueChange={(v) => setField?.("reason", v ?? "")}
          disabled={!values.visitType}
        >
          <SelectTrigger
            id={id("reason")}
            className="h-12! w-full bg-white"
            aria-invalid={!!errors.reason}
          >
            <SelectValue className="min-w-0 truncate">
              {() =>
                values.reason ||
                (values.visitType
                  ? values.visitType === "Test only"
                    ? "Choose a test"
                    : "Choose a reason"
                  : "Choose what brings you in first")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {reasonOptions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <StaticSelectTrigger id={id("reason")} text="Choose a reason" />
      )}
      {errors.reason ? (
        <p className="text-sm text-destructive">{errors.reason}</p>
      ) : null}
      {prepNote ? (
        <p className="rounded-lg border border-teal/30 bg-teal-tint px-3 py-2 text-sm text-ink">
          {prepNote}
        </p>
      ) : null}
    </div>
  );

  const offlineNotice = (
    <div className="rounded-2xl border border-rose-tint bg-blush p-5" role="status">
      <p className="text-base font-semibold text-ink">
        Online booking is unavailable right now.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Please call {site.phones[0].label} and we will book you in.
      </p>
      <a
        href={site.phones[0].href}
        className={cn(
          buttonVariants({ size: "default" }),
          "mt-4 bg-primary text-white hover:bg-primary-hover"
        )}
      >
        <Phone aria-hidden="true" />
        Call {site.phones[0].label}
      </a>
    </div>
  );

  const dayTimeSection = (
    <fieldset className="min-w-0 space-y-2" ref={slotRegionRef} tabIndex={-1}>
      <legend className="text-sm font-medium text-ink">
        Choose a day and time
      </legend>

      {/* Fourteen days, horizontally scrollable. min-w-0 on the wrapper is
          what keeps the strip from widening a grid column. */}
      <div className="min-w-0">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Day"
        >
          {stripDates.map((date) => {
            const view = availability.days[date];
            const openCount = view?.slots.filter((s) => s.open).length ?? 0;
            const closed = view ? view.closed || openCount === 0 : false;
            const selected = values.date === date;
            return (
              <button
                key={date}
                type="button"
                disabled={closed}
                onClick={() => {
                  setField?.("date", date);
                  setField?.("slotStart", "");
                  onPickDate?.(date);
                }}
                aria-pressed={selected}
                title={closed && view?.reason ? view.reason : undefined}
                className={cn(
                  "flex min-h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-sm font-semibold transition-colors",
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-rose-tint bg-white text-ink hover:border-primary/40",
                  closed &&
                    "cursor-not-allowed border-border bg-blush text-muted-foreground line-through"
                )}
              >
                {dayStripLabel(date, availability.today)}
              </button>
            );
          })}
          <label className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-rose-tint bg-white px-3 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">More dates</span>
            {interactive ? (
              <input
                type="date"
                className="w-[8.5rem] bg-transparent text-sm text-ink outline-none"
                min={availability.today}
                max={availability.lastDate}
                value={
                  values.date && !stripDates.includes(values.date)
                    ? values.date
                    : ""
                }
                onChange={(e) => {
                  const d = e.target.value;
                  if (!d) return;
                  setField?.("date", d);
                  setField?.("slotStart", "");
                  onPickDate?.(d);
                }}
              />
            ) : (
              <input type="date" className="w-[8.5rem] bg-transparent text-sm" disabled />
            )}
          </label>
        </div>
      </div>

      <div aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {availability.loading
          ? "Loading times"
          : values.date && pickedDay && !pickedDay.closed
            ? `${pickedDay.slots.filter((s) => s.open).length} times available`
            : pickedDay?.closed
              ? pickedDay.reason || "Clinic closed"
              : ""}
      </div>

      {slotError ? (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {slotError}
        </p>
      ) : null}

      {values.date && pickedDay && !pickedDay.closed ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {pickedDay.slots.map((slot) => {
            const checked =
              values.slotStart === slot.start && values.date === pickedDay.date;
            return (
              <label key={slot.start} className="min-w-0">
                <input
                  type="radio"
                  name={id("slot")}
                  value={slot.start}
                  checked={interactive ? checked : undefined}
                  disabled={interactive ? !slot.open : true}
                  onChange={
                    interactive
                      ? () => setField?.("slotStart", slot.start)
                      : undefined
                  }
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-colors",
                    "peer-checked:border-primary peer-checked:bg-rose-tint/60 peer-checked:shadow-soft",
                    "peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
                    slot.open
                      ? "border-rose-tint bg-white"
                      : "border-border bg-blush text-muted-foreground"
                  )}
                >
                  <span className="text-sm font-semibold text-ink">
                    {slot.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      slot.open ? "text-muted-foreground" : "text-muted-foreground"
                    )}
                  >
                    {slotStatus(slot)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      ) : availability.loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl border border-rose-tint bg-blush"
            />
          ))}
        </div>
      ) : null}
      {errors.date || errors.slotStart ? (
        <p className="text-sm text-destructive">
          {errors.date ?? errors.slotStart}
        </p>
      ) : null}
    </fieldset>
  );

  const detailsSection = (
    <div className="min-w-0 space-y-4">
      <p className="text-sm font-medium text-ink">Your details</p>
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
        <div className="flex items-baseline justify-between gap-3">
          <p id={id("notes-help")} className="text-sm text-muted-foreground">
            Please do not share medical reports or health details here.
          </p>
          <p className="shrink-0 text-xs text-muted-foreground" aria-hidden="true">
            {values.notes.length}/300
          </p>
        </div>
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
            I agree that Trichy Fetal Medicine and Fertility Centre may call me
            about this request. I have read the
          </span>{" "}
          <Link href="/privacy" className="link whitespace-nowrap">
            Privacy policy
          </Link>
          .
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
      <p className="text-center text-xs text-muted-foreground">
        No advance payment. Pay at the clinic.
      </p>
      <p className="text-center text-xs text-muted-foreground">
        We confirm requests by phone during clinic hours.
      </p>
    </>
  );

  const honeypot = (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <input type="text" name="website_url2" tabIndex={-1} autoComplete="new-password" />
    </div>
  );

  const sections = availability.offline ? (
    <>
      {visitTypeSection}
      {reasonSection}
      {offlineNotice}
    </>
  ) : (
    <>
      {visitTypeSection}
      {reasonSection}
      {dayTimeSection}
      {detailsSection}
      {actions}
      {afterSubmit}
    </>
  );

  if (layout === "sheet") {
    return (
      <form
        onSubmit={interactive ? onSubmit : undefined}
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        noValidate
      >
        {honeypot}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
          <div className="space-y-4">
            {availability.offline ? (
              <>
                {visitTypeSection}
                {reasonSection}
                {offlineNotice}
              </>
            ) : (
              <>
                {visitTypeSection}
                {reasonSection}
                {dayTimeSection}
                {detailsSection}
              </>
            )}
          </div>
          {trailing ? <div className="mt-5">{trailing}</div> : null}
        </div>
        {!availability.offline ? (
          <div className="shrink-0 space-y-3 border-t border-border bg-popover px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {actions}
          </div>
        ) : null}
      </form>
    );
  }

  return (
    <form
      onSubmit={interactive ? onSubmit : undefined}
      className="min-w-0 space-y-4"
      noValidate
    >
      {honeypot}
      {sections}
    </form>
  );
}

/** Shared post-submit state for every booking surface. */
export function BookingSuccessCard({
  bookingId,
  mobile,
  date,
  slotLabel,
  visitType,
  reason,
  onBookAnother,
  onDone,
}: {
  bookingId?: string;
  mobile?: string;
  date?: string;
  slotLabel?: string;
  visitType?: string;
  reason?: string;
  onBookAnother?: () => void;
  onDone?: () => void;
}) {
  return (
    <div className="py-5 text-center" role="status">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-tint text-teal">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-ink">Request received</h3>
      <p className="mt-2 text-base text-muted-foreground">
        Not confirmed yet. We will call you during clinic hours.
      </p>
      {date && slotLabel ? (
        <p className="mt-3 text-base font-semibold text-ink">
          {prettyDate(date)}, {slotLabel}
        </p>
      ) : null}
      {visitType ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {visitType}
          {reason ? `: ${reason}` : ""}
        </p>
      ) : null}
      {mobile ? (
        <p className="mt-2 text-sm text-muted-foreground">
          We will call {maskMobile(mobile)}
        </p>
      ) : null}
      {bookingId ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Booking ID:{" "}
          <span className="font-mono font-semibold text-ink">{bookingId}</span>
        </p>
      ) : null}
      {onBookAnother ? (
        <button
          type="button"
          onClick={onBookAnother}
          className={cn(
            buttonVariants({ size: "default" }),
            "mt-5 bg-primary text-white hover:bg-primary-hover"
          )}
        >
          Book another
        </button>
      ) : null}
      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          className="mt-3 block w-full text-sm font-semibold text-primary underline underline-offset-4"
        >
          Close
        </button>
      ) : null}
    </div>
  );
}
