# SEO fix changelog — 2026-10-24

Issue IDs reference `seo-audit/audit.json`. All changes left uncommitted per project rules (no branch/commits).

## P0
- ISS-001: Added indexing-verification step to LAUNCH-CHECKLIST.md blockers — `VERCEL_ENV`/`INDEXABLE` gating can silently ship `noindex` + `Disallow: /` on non-Vercel deploys.
- ISS-002: `components/home/why-choose-us.tsx` — patient quotes now derive from `data/testimonials.ts` and render only when `consentOnFile === true`. Verified: quotes absent from production HTML until consent is confirmed.

## Crawling & AI-bot access
- `app/robots.ts`: explicit allow rules added for ChatGPT-User, Claude-SearchBot, Claude-User, Perplexity-User, Bingbot (were covered by `*`; now named).
- `proxy.ts`: `www.fmctrichy.com` now 308-redirects to apex — one host version only.
- `lib/qr-svg.ts` + `scripts/generate-qr.mjs`: QR base switched `drmalathi.vercel.app` → `fmctrichy.com`. Regenerate printed QRs before launch.
- `app/sitemap.ts`: `/medical-disclaimer` added (conditional on counsel sign-off like other legal pages).

## Schema (one @graph per page)
- `lib/schema.ts` rewritten: `pageGraph()`, `webSiteNode`, `webPageNode`, `medicalClinicNode`, `breadcrumbNode`, `personNode`, `courseNode`, `serviceNode`, `faqNode`, `guideArticleNode`, `guideAboutNode`.
- Guides emit `MedicalWebPage` (was `Article`): `about` = real MedicalCondition/MedicalProcedure per guide (GUIDE_ABOUT map), `author`/`reviewedBy` = clinical-team MedicalOrganization until a named doctor is supplied, `datePublished`/`dateModified`/`lastReviewed` present.
- Services: `MedicalProcedure` for scans/diagnostics, `Service` for specialty clinics (was MedicalProcedure for all).
- Home: WebSite + WebPage + MedicalClinic + FAQPage in one graph (was 16 separate scripts).
- Doctors: Person + WebPage + BreadcrumbList in one graph.
- Verified via curl: single `@graph`, all types present, valid JSON.

## E-E-A-T
- Guide byline now reads "Written and medically reviewed by the FMC Trichy clinical team", linked to /doctors.
- Doctor pages: new "Patient guides on <name>'s areas of practice" section (guides matched via expertise serviceSlugs).
- Footer: Editorial Policy + Medical Disclaimer links added (mobile + desktop).
- New page: `app/medical-disclaimer/page.tsx` (noindex until counsel review, same as other legal pages; added to check-content.mjs + check-launch.mjs lists).
- Sources added to 7 guides that had none (ISUOG/SMFM/RCOG/NHS/WHO/NICE/FMF entries; URLs reused only where already verified in codebase).

## FAQs
- Services: +13 FAQs so every service has ≥4 (was 2–3 on 10 of 13).
- Guides: 22 short FAQ answers (10–34 words) extended to ~40–60 words across anomaly, growth-scan and NIPT guides, using only facts already in each guide.
- NIPT guide: `quickAnswer` added (was the only guide without one).

## AI-tell cleanup
- Removed "Final Thoughts"/"final thoughts" headings from 8 guides (closing paragraph kept).
- Sentence-cased Title-Case H2s: 9 on fetal-echo guide, 16 on NIPT guide.
- No banned vocabulary present anywhere (em-dash rule enforced by content check).

## On-page / technical
- Titles re-ranged to ~50–60 chars on 16 pages (Gallery, Doctors, Terms, Privacy, Guides index, About, Editorial Policy, CME, Contact, FAQ, home, International Patients, Fellowship, Services index, doctor profile template).
- Over-length guide description trimmed (PCOS 165→~150); accessibility + editorial-policy descriptions extended into range.
- `og:url` added on guide/service/doctor pages.
- 3 empty-alt service images on home now descriptive (`components/home/services-section.tsx`).

## Verified
- `npx tsc --noEmit` clean; `INDEXABLE=1 npm run build` clean (72 routes, 0 content violations).

## Not fixed (needs client input or deployment)
- ISS-106 LCP (re-measure on real host), ISS-104 named reviewer (which doctor reviewed each guide), ISS-208 INR pricing, registration numbers/PCPNDT/TN-CEA/ART, geo/sameAs/areaServed, Sat/Sun hours, WhatsApp + intl number confirmation, 3 testimonial consents, 3 claims substantiation, 3 placeholder-licence images, GBP NAP check, founding date, grievance officer, fertility-service question, DNS cutover from LiteSpeed site.
