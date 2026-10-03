import { cn } from "cn";

/**
 * Vertical stepper: numbered circles (primary on rose-tint) joined by a 2px
 * rose line. Shared by the home visit steps, service "what to expect",
 * the About timeline and the international-patients steps.
 */
export function StepsList({
  steps,
  className,
}: {
  steps: readonly { title?: string; text: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("mx-auto max-w-md", className)}>
      {steps.map((step, i) => (
        <li key={step.title ?? step.text} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 ? (
            <span
              className="absolute top-11 bottom-0 left-[21px] w-0.5 bg-rose-tint"
              aria-hidden="true"
            />
          ) : null}
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-tint font-heading text-base font-semibold text-primary">
            {i + 1}
          </span>
          <div className="min-w-0 pt-1.5">
            {step.title ? (
              <h3 className="text-[19px]/[26px] font-semibold text-ink text-balance">
                {step.title}
              </h3>
            ) : null}
            <p className="mt-1 text-base/[26px] text-pretty text-ink-muted">
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
