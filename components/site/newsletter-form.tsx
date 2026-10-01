"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/app/actions/subscribe";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterForm() {
  const [pending, setPending] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await subscribeNewsletter(formData);
    setPending(false);
    if (result.ok) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-3">
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot field, hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="newsletter-website">Website</Label>
        <Input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Label htmlFor="newsletter-email" className="sr-only">
        Email address
      </Label>
      <Input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="border-white/25 bg-white/10 text-white placeholder:text-white/50"
      />
      <div className="flex items-start gap-2.5">
        <Checkbox
          id="newsletter-consent"
          name="consent"
          required
          className="mt-0.5 shrink-0 border-white/40 data-checked:bg-primary"
        />
        <p className="text-xs leading-snug text-white/70">
          <label htmlFor="newsletter-consent" className="cursor-pointer">
            I agree to receive updates from the centre.
          </label>{" "}
          <Link
            href="/privacy"
            className="whitespace-nowrap text-white underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white hover:bg-primary-hover"
      >
        {pending ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
