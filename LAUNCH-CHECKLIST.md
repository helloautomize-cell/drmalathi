# Launch Checklist

Generated from `npm run check:launch` (keep both in sync). A production
deploy must not ship while anything remains under **Blockers** —
`check:launch` exits non-zero when `VERCEL_ENV=production`.

Blockers are only things that ship broken or untrue. Parked and
production-hidden items live under Post-launch, so the gate is never
overridden for the wrong reason.

Every legal item below is **for client counsel review**; this is a
compliance checklist, not legal advice.

## Blockers

- [ ] `RESEND_API_KEY` env var set (appointment + course forms cannot deliver email)
- [ ] `LEADS_EMAIL_TO` env var set
- [ ] `LEADS_EMAIL_FROM` env var set
- [ ] WhatsApp lead number `+91 74489 39808` confirmed by the client (then set `whatsappNumberConfirmed = true` in `lib/site.ts`, or override with `NEXT_PUBLIC_WHATSAPP_NUMBER`)
- [ ] `app/privacy/page.tsx`: "draft pending legal and client review" line removed after counsel sign-off
- [ ] `app/terms/page.tsx`: "draft pending legal and client review" line removed after counsel sign-off
- [ ] `app/editorial-policy/page.tsx`: "draft pending legal and client review" line removed after counsel sign-off
- [ ] `app/accessibility/page.tsx`: "draft pending legal and client review" line removed after counsel sign-off
- [ ] Five placeholder-licence images in use replaced with licensed files (drop new source into `assets/source-images/`, set `license: "licensed"` + `licenseSource` in `data/image-sources.json`, run `npm run process:images`):
  - [ ] `family-cutout` (home hero LCP; also needs real alpha, source JPEG has a baked checkerboard)
  - [ ] `hands-baby-feet` (LCP image on genetic-counselling, recurrent-miscarriages-clinic, fetal-postmortem)
  - [ ] `baby-overhead`
  - [ ] `pregnancy-test-stork`
  - [ ] `doctor-glowing-fetus`

## Post-launch / client and counsel decisions

- [ ] `family-bw-newborn` stays parked (embedded photographer watermark; do not crop it out; replace or licence properly)
- [ ] `family-airy-newborn` parked (source file missing; restore to reuse)
- [ ] `icsi-illustration` stays parked until the client confirms whether IUI/IVF/ART services are offered
- [ ] Medical review of the two drafted guides (`downs-screening-oscar`, `anomaly-scan-what-to-expect`); they ship only when `reviewStatus: "reviewed"` + `reviewedBy` + `reviewedAt` are set. Until then the whole Guides section, nav links, sitemap entries and RSS stay hidden in production.
- [ ] Founding year: 2012 is used in copy; Dr Malathi's bio implies 14 years — confirm one figure (then `foundedYearConfirmed = true`)
- [ ] Saturday hours (`lib/site.ts` hours string; then `saturdayHoursConfirmed = true`)
- [ ] PCPNDT registration number (`site.pcpndtRegistration`)
- [ ] Tamil Nadu clinical establishment registration (`site.clinicalEstablishmentRegistration`)
- [ ] ART Act registration if IUI/IVF is offered (`site.artRegistration`) — counsel
- [ ] Whether "Fertility" in the name implies IUI/IVF services — confirm before any ART copy
- [ ] DPDP grievance officer (`site.grievanceOfficer`) — counsel
- [ ] Doctor NMC/State Council registration numbers (`Doctor.registration`) — counsel
- [ ] Clinic geo coordinates + `hasMap` (`site.geo`, `site.hasMap`)
- [ ] `areaServed` towns and `sameAs`/social profile URLs (`site.areaServed`, `site.sameAs`, `site.socials`)
- [ ] Exact `foundingDate` for schema (`site.foundingDate`)
- [ ] Dr Nivethitha's role line (`roleIsPlaceholder` in `data/doctors.ts`)
- [ ] Two course durations unconfirmed (`durationConfirmed` in `data/courses.ts`)
- [ ] Three testimonials awaiting written consent (`consentOnFile` in `data/testimonials.ts`) — NMC review
- [ ] Three comparative claims unsubstantiated (`data/claims.ts`) — counsel
- [ ] Testimonial use on a medical site at all — counsel
- [ ] Telemedicine Practice Guidelines 2020 note on `/international-patients` — counsel
- [ ] CSP: `Content-Security-Policy-Report-Only` reports to `/api/csp-report`; flip to `Content-Security-Policy` once the baseline is clean
- [ ] HSTS at the hosting layer once the domain moves
- [ ] Google Rich Results Test + securityheaders.com re-run on the live domain (audit had no public URL)

## Handover: fresh repository

When the site is handed to the client, consider a fresh repository so
tooling internals do not ship in the public history:

- `.devin/`, `AGENTS.md`, `CLAUDE.md` stay **until handover** (client decision: keep for ongoing agent work, or strip).
- `docs/AUDIT.md`, `docs/REDIRECTS.md`, `docs/CONTENT-REQUESTS.md`, this file and `TODO.md` move into the client handover pack.
- **Git history note:** existing history contains a `Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>` trailer (at least commit `6caac64`) and earlier AI-work commits. History is left untouched by design. If the client wants it removed, that requires a history rewrite (fresh `git init` or filter-repo) and is a separate, explicitly approved task.
- `README.md` no longer contains create-next-app boilerplate.
