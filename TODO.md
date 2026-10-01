# Launch TODO list

## Content requiring client review

- [ ] **DRAFT FOR MEDICAL REVIEW**: all service descriptions in `data/services.ts`
      are new plain-language copy. The medical team must approve before launch.
- [ ] **DRAFT FOR MEDICAL REVIEW**: all FAQ answers in `data/faqs.ts`.
- [ ] **DRAFT FOR CLIENT REVIEW**: Dr Nivethitha is not included on the current
      doctors page. Confirm her full bio, official role and areas of expertise;
      replace the temporary "Fetal Medicine Specialist" role, then set
      `hasProfile: true` when approved profile copy is available.
- [ ] **DRAFT FOR CLIENT REVIEW**: the home page describes the centre as "13
      years", while Dr Malathi's source bio states "14 years" in fetal medicine.
      Confirm both figures and their intended reference dates.
- [ ] **DRAFT FOR CLIENT REVIEW**: confirm Dr Revathy's surname spelling. The
      source site uses both "Chandrasekharan" and "chandrasekaran".
- [ ] Request current, professional, visually matching portraits for Dr Malathi,
      Dr Revathy and Dr Nivethitha.
- [ ] **DRAFT FOR CLIENT REVIEW**: confirm the duration of Fellowship in Fetal
      Medicine (course 1).
- [ ] **DRAFT FOR CLIENT REVIEW**: confirm that Fellowship in Advanced Obstetric
      Ultrasound and Fetal Echo (course 2) runs for 1 year.
- [ ] **DRAFT FOR CLIENT REVIEW**: confirm whether the requirement for 2 indexed
      research publications applies to all three fellowship courses.
- [ ] **DRAFT FOR CLIENT REVIEW**: provide the next fellowship intake date.
- [ ] Add `/images/fellowship-training.webp` with its source URL in `CREDITS.md`,
      then replace it with a real approved photo of the centre's simulator in use.
- [ ] Request a current course brochure before setting `showBrochure: true` in
      `data/courses.ts`.
- [ ] **DRAFT FOR MEDICAL REVIEW**: `window` chips on service cards in
      `data/services.ts` (e.g. "Viability 6 to 9 weeks" vs timing text
      "6 to 10 weeks" — resolve the discrepancy with the medical team).
- [ ] Rajesh testimonial is in Tamil. Confirm translation approach with client.
- [ ] Doctor bios: verify spellings of mentor names (Prof Kypros Nicolaides,
      Prof Gustavo Malinger) against client records.

## Decisions pending

- [ ] WhatsApp lead number: `NEXT_PUBLIC_WHATSAPP_NUMBER` currently defaults to
      917448939808 (the number the current site links to). Confirm with client.
- [ ] Appointment delivery: Resend not configured yet. Set `RESEND_API_KEY`,
      `LEADS_EMAIL_TO`, `LEADS_EMAIL_FROM` (verified sender domain) before launch.
- [ ] Social links: current site has empty social hrefs. Add real URLs to
      `socials` in `data/site.ts`; icons render only when URLs exist.
- [ ] GA4: set `NEXT_PUBLIC_GA4_ID` when the property exists.
- [ ] Google Maps URL in `data/site.ts` is a search URL. Replace with the
      business's official Google Maps listing link.

## Media

- [ ] **LICENSE REQUIRED**: all brand photos in `data/images.ts` are unlicensed
      placeholders (`license: "placeholder"` in `data/image-sources.json`).
      Replace each with a licensed asset before launch — `npm run check:images`
      lists them; deploy gate: `REQUIRE_LICENSED_IMAGES=1 npm run check:images`.
      - `hands-baby-feet` (why-fetal arch, sensitive service pages)
      - `baby-lifted-teddy` (why-choose us, /about)
      - `baby-overhead` (calculator accent, 404)
      - `pregnancy-test-stork` (services "start here", calculator)
      - `doctor-glowing-fetus` (doctors intro thumbnail)
      - `family-bw-newborn` (CTA band, plum duotone)
      - `family-airy-newborn` (unused now — spare)
      - `family-cutout` (hero cut-out; alpha was recovered from a checkerboard
        JPEG — replace with the client's real transparent PNG/WebP when
        available)
      - `icsi-illustration` (PARKED — not rendered until fertility services
        confirmed)
      - `couple-grey` (EXCLUDED — parked in `assets/parked`, not in manifest)
- [ ] Embedded photographer credits exist on `baby-lifted-teddy` (bottom-right)
      and `family-bw-newborn` (top-right). They are kept visible per licensing
      rules; final licensed replacements should carry proper credit terms.
- [ ] Hero portrait: replace `family-airy-newborn` placeholder when the
      client's cut-out portrait is supplied (drop into
      `assets/source-images/`, update manifest, re-run `process:images`).
      `family-airy-newborn` source file is missing — restore if ever needed.
- [ ] Dr Malathi portrait: the source is a low-resolution full-body event photo.
      Replace it with a current professional head-and-shoulders portrait.
- [ ] Doctor portrait backgrounds were removed with local segmentation and placed
      on a shared gradient. Request client-approved transparent PNG/WebP portraits
      for all three doctors to replace these generated cutouts.
- [ ] The transparent header PNG was derived from the supplied white-matte logo.
      Request the original transparent PNG or SVG brand asset from the client.
- [ ] Images were copied from the live site into `public/images/`. Verify the
      client has approved reuse and confirm which photos are current.
- [x] Favicon and mobile header icon generated from the logo mark
      (`app/icon.png`, `public/images/logo-icon.webp`).

## Engineering

- [x] Phase 4 inner pages built: about, services index + 13 detail pages,
      fellowship, cme-activities, doctors index + 2 profiles, gallery, contact,
      faq, due-date-calculator, international-patients, privacy, terms.
- [ ] **DRAFT FOR MEDICAL REVIEW**: scan timing windows in
      `data/scan-schedule.ts` drive the hero "Which scan do I need?" card and
      the due date calculator. Each window and note needs sign-off.
- [ ] **DRAFT FOR LEGAL REVIEW**: `/privacy` and `/terms` are boilerplate
      drafts pending client/legal approval.
- [ ] `baby-overhead` and `doctor-glowing-fetus` sources are only 236px wide.
      They are capped at ~181px display (`maxDisplayWidth` in the manifest) —
      never render them larger.
- [ ] Lighthouse mobile performance ~73-80 (varies run to run on this machine).
      LCP is the hero H1 under simulated throttling; real-device scores should
      be higher. Options if needed: shorter-URL hero image, font subset trim,
      or deferring footer form hydration.
- [ ] `/design-system` is dev-only (returns 404 in production) and disallowed in robots.
- [ ] Trust slots are wired but hidden (`data/trust.ts`, `components/shared/trust-slots.tsx`).
      Populate when real assets exist: Google rating badge (`googleRating`),
      awards/affiliations strip (`affiliations`), video testimonial
      (`videoTestimonial`), virtual tour (`virtualTour`).
- [ ] Stats band: real figures go in `data/trust.ts` `stats` — scans performed,
      fellows trained, CME events hosted. Hidden until populated.
- [ ] Newsletter: footer form removed in Phase 3.6 (replaced by a WhatsApp
      card). `newsletter-form.tsx` + `app/actions/subscribe.ts` are unused —
      delete or repurpose if newsletters are not needed.
- [ ] Video testimonial slot renders in the testimonials section when
      `trust.videoTestimonial` is set; needs a real video file + poster.
- [ ] Newsletter and appointment actions: honeypot + 3s minimum submit time.
      Add real rate limiting at the edge (Vercel) if abuse appears.
