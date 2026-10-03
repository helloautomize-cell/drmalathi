# Pre-launch audit report

**Site:** Trichy Fetal Medicine and Fertility Centre (`fmctrichy.com`)
**Date:** 3 October 2026
**Scope:** SEO, AEO, GEO, compliance (NMC, PCPNDT, DPDP), content quality, code hygiene, Core Web Vitals.
**Build audited:** `next build` with `INDEXABLE=1` and `NEXT_PUBLIC_SITE_URL=https://fmctrichy.com`, served locally via `next start` on port 3200. This file lives in `docs/` which is not in `app/` or `public/`, so it is excluded from the build and never served.

**This is a compliance checklist, not legal advice.** Every item under NMC, PCPNDT and DPDP is marked "for client counsel review".

## Method and tools

| Tool | How it was used |
|---|---|
| `next build` | Route table, static generation check (61 routes prerendered) |
| `scripts/audit-crawl.ts` (new) | Two-pass crawler over the production build: fetch pass for head/meta/schema/links on every sitemap URL + 10 probe URLs; headless-Chrome pass for LCP element, resource weights, visible word counts |
| `scripts/audit-lighthouse.mjs` (new) | Lighthouse 13.x, mobile emulation, 3 runs per route, median reported (6 representative routes) |
| `scripts/axe-all.mjs` (existing) | axe-core WCAG 2A/2AA/21A/21AA on 27 routes, desktop viewport |
| Puppeteer + Chrome | DOM word counts, LCP capture, resource timing, console errors |
| `sharp` 0.35 | Image metadata scan (substituted for exiftool, which is not installed on this machine) |
| ripgrep | Source scans for dashes, spellings, phone/date formats, banned phrases, dead code |
| `curl -I` | Response header inspection (local build + live `fmctrichy.com`) |

**Caveats and substitutions**
- Lighthouse numbers are lab/simulated-throttling figures from a local `next start`; they are directional, not field data (CrUX). Re-measure after deploy.
- `fmctrichy.com` currently serves the old site on LiteSpeed/BitNinja. securityheaders.com and Mozilla Observatory scans of that host would grade the old site; they are recorded as pending for the first preview deployment of this build.
- Google Rich Results Test and validator.schema.org have no offline API; JSON-LD was extracted from rendered HTML and validated locally for parse errors, required properties and absolute URLs. Manual submission is listed as pending.
- Word counts were taken from the rendered DOM inside `<main>`, excluding header, footer, the shared "Book your appointment" CTA band and the shared "Frequently asked questions" block. Service-specific FAQ accordions are counted as page content; closed accordions contribute only their trigger text.
- `/services/NIPT` returned 200 on this Windows host (case-insensitive file system); a Linux/Vercel deploy will 404 it. Canonical on the duplicate points to `/services/nipt`, so there is no SEO risk either way.
- First Load JS = gzip sum of the JS chunks each page's HTML requests (from `.next/static`), equivalent to the Next.js build "First Load JS" concept.

## Executive summary

**39 indexable routes** (plus `robots.txt`, `sitemap.xml`, RSS feed, favicon, generated OG images). All pages: canonical present, `index,follow`, exactly one H1, OG image present, JSON-LD parses cleanly. axe-core: **0 violations on all 27 routes tested**. No em dashes, en dashes, US spellings, US date formats or malformed phone numbers in rendered copy.

**4 Blockers, 9 High, 13 Medium, 11 Low** (37 findings total).

The worst issues are concentrated, not diffuse: four `placeholder-*` guide pages are live and indexable with "PLACEHOLDER:" rendering in titles and body copy on 13+ pages; both legal pages publicly state they are drafts; eight unlicensed stock images render sitewide; and the lead forms currently cannot deliver email in production.

| Severity | Count | Themes |
|---|---|---|
| Blocker | 4 | Placeholder guides live; visible "draft" on legal pages; unlicensed images; forms can't deliver leads |
| High | 9 | No security headers; 45-char title suffix; mobile LCP 4.6-5.9s + 420 kB JS; missing NMC reg numbers; unverified claims; testimonials; DPDP gaps; thin pages; unconfirmed WhatsApp number |
| Medium | 13 | Meta lengths; "program" vs "programme"; dynamic last-updated; placeholder doctor role; schema gaps; sitemap lastmod; minor a11y; third-party embeds; RSC payload; heavy PNGs; dead code; unconfirmed Saturday hours; Windows-only dup URL |
| Low | 11 | 404 index,follow; no llms.txt; lang en not en-IN; no web manifest; X-Powered-By; committed log file; filename typos; decorative alt=""; home FAQPage absent; unused `motion` dep; RSS missing language |

---

## 1. Route inventory

Columns: Words = rendered main-content word count (excl. chrome, CTA band, shared FAQ). In/Out = unique internal links inbound (incl. nav/footer) / outbound from `<main>`. JS = first-load JavaScript, gzip.

| URL | Title | Desc | H1 | Index | Words | In/Out | Schema (key types) | LCP element | JS |
|---|---|---|---|---|---|---|---|---|---|
| / | Fetal Medicine Specialists in Trichy (36) | 167 | 1 | yes | 1467 | 42/27 | MedicalClinic, Physician, Course | img `family-cutout.webp` | 429 kB |
| /about | About the Centre \| TFMC (61) | 141 | 1 | yes | 420 | 42/6 | BreadcrumbList | text block | 420 kB |
| /services | Services and Scans \| TFMC (63) | 175 | 1 | yes | 506 | 42/14 | BreadcrumbList | h1 text | 424 kB |
| /fellowship | Fellowship and Courses \| TFMC (67) | 126 | 1 | yes | 181 | 42/4 | BreadcrumbList | h1 text | 423 kB |
| /cme-activities | CME Activities \| TFMC (59) | 137 | 1 | yes | 81 | 42/3 | BreadcrumbList | p text | 422 kB |
| /doctors | Our Doctors \| TFMC (56) | 151 | 1 | yes | 111 | 42/4 | BreadcrumbList | img `malathi-cutout.png` | 420 kB |
| /gallery | Gallery \| TFMC (52) | 125 | 1 | yes | 20 | 42/1 | BreadcrumbList | img `banner1.webp` | 422 kB |
| /guides | Patient Guides \| TFMC (59) | 111 | 1 | yes | 171 | 42/12 | BreadcrumbList | text block | 421 kB |
| /contact | Contact and Appointments \| TFMC (69) | 158 | 1 | yes | 210 | 42/3 | BreadcrumbList | text block | 422 kB |
| /faq | Frequently Asked Questions \| TFMC (71) | 117 | 1 | yes | 143 | 42/1 | FAQPage, BreadcrumbList | text block | 422 kB |
| /due-date-calculator | Due Date Calculator \| TFMC (64) | 152 | 1 | yes | 88 | 42/1 | BreadcrumbList | p text | 432 kB |
| /international-patients | International Patients \| TFMC (67) | 160 | 1 | yes | 347 | 42/3 | BreadcrumbList, FAQPage | text block | 420 kB |
| /privacy | Privacy Policy \| TFMC (59) | 93 | 1 | yes | 220 | 42/1 | none | p text | 419 kB |
| /terms | Terms of Use \| TFMC (57) | 82 | 1 | yes | 203 | 42/1 | none | p text | 419 kB |
| /services/viability-scan | Viability Scan in Trichy \| TFMC (69) | 116 | 1 | yes | 576 | 42/8 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/downs-screening-oscar | Down's Screening (OSCAR) in Trichy \| TFMC (84) | 119 | 1 | yes | 548 | 42/8 | MedicalProcedure, FAQPage, Breadcrumb | text block | 421 kB |
| /services/first-trimester-anomaly-scan | First Trimester Anomaly Scan in Trichy \| TFMC (83) | 114 | 1 | yes | 510 | 42/7 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/anomaly-scan | Anomaly Scan in Trichy \| TFMC (67) | 93 | 1 | yes | 563 | 42/8 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/growth-scan-doppler | Growth Scan with Doppler in Trichy \| TFMC (79) | 100 | 1 | yes | 498 | 42/8 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/nipt | NIPT in Trichy \| TFMC (59) | 109 | 1 | yes | 476 | 42/8 | MedicalProcedure, FAQPage, Breadcrumb | text block | 421 kB |
| /services/fetal-echo | Fetal Echo in Trichy \| TFMC (65) | 95 | 1 | yes | 464 | 42/7 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/fetal-neurosonogram | Fetal Neurosonogram in Trichy \| TFMC (74) | 97 | 1 | yes | 456 | 5/6 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /services/second-opinion-scan | Second Opinion Scan in Trichy \| TFMC (74) | 97 | 1 | yes | 448 | 3/7 | MedicalProcedure, FAQPage, Breadcrumb | text block | 421 kB |
| /services/genetic-counselling | Genetic Counselling in Trichy \| TFMC (74) | 92 | 1 | yes | 454 | 5/7 | MedicalProcedure, FAQPage, Breadcrumb | img `hands-baby-feet-736.webp` | 421 kB |
| /services/fetal-postmortem | Fetal Postmortem in Trichy \| TFMC (71) | 105 | 1 | yes | 412 | 5/6 | MedicalProcedure, FAQPage, Breadcrumb | img `hands-baby-feet-736.webp` | 421 kB |
| /services/recurrent-miscarriages-clinic | Recurrent Miscarriages Clinic in Trichy \| TFMC (84) | 100 | 1 | yes | 398 | 5/7 | MedicalProcedure, FAQPage, Breadcrumb | img `hands-baby-feet-736.webp` | 421 kB |
| /services/twin-specialised-clinic | Twin Specialised Clinic in Trichy \| TFMC (78) | 65 | 1 | yes | 447 | 7/8 | MedicalProcedure, FAQPage, Breadcrumb | img service photo | 421 kB |
| /doctors/dr-malathi-g-prasad | Dr Malathi G. Prasad, Fetal Medicine Spec… (92) | 155 | 1 | yes | 100 | 18/3 | Physician, BreadcrumbList | img `malathi-cutout.png` | 419 kB |
| /doctors/dr-revathy-chandrasekharan | Dr Revathy Chandrasekharan, Fetal Medic… (98) | 160 | 1 | yes | 82 | 16/3 | Physician, BreadcrumbList | img `revathy-cutout.png` | 419 kB |
| /guides/anomaly-scan-what-to-expect | The anomaly scan: what to expect on the day… (88) | 144 | 1 | yes | 595 | 5/5 | Article, FAQPage, BreadcrumbList | text block | 422 kB |
| /guides/downs-screening-oscar | Down's screening (OSCAR): what it checks… (116) | 159 | 1 | yes | 681 | 5/5 | Article, FAQPage, BreadcrumbList | text block | 422 kB |
| /guides/placeholder-nipt-explained | PLACEHOLDER: NIPT explained \| TFMC (72) | 74 | 1 | yes | 197 | 6/5 | Article, BreadcrumbList | img service photo | 422 kB |
| /guides/placeholder-viability-scan | PLACEHOLDER: The viability scan \| TFMC (76) | 86 | 1 | yes | 179 | 4/5 | Article, BreadcrumbList | img service photo | 422 kB |
| /guides/placeholder-caring-for-twins | PLACEHOLDER: Caring for a twin pregnancy… (85) | 82 | 1 | yes | 111 | 3/4 | Article, BreadcrumbList | img service photo | 422 kB |
| /guides/placeholder-growth-scan | PLACEHOLDER: Your growth scan \| TFMC (74) | 83 | 1 | yes | 110 | 3/4 | Article, BreadcrumbList | img service photo | 422 kB |
| /guides/category/pregnancy-scans | Pregnancy scans: Patient Guides \| TFMC (76) | 50 | 1 | yes | 72 | 6/8 | BreadcrumbList | img card thumb | 421 kB |
| /guides/category/screening-and-tests | Screening and tests: Patient Guides \| TFMC (80) | 55 | 1 | yes | 81 | 6/8 | BreadcrumbList | img card thumb | 421 kB |
| /guides/category/twins-and-high-risk | Twins and high-risk pregnancy: Patient Gui… (90) | 61 | 1 | yes | 45 | 5/7 | BreadcrumbList | img card thumb | 421 kB |
| /guides/category/pregnancy-health | Pregnancy health: Patient Guides \| TFMC (77) | 46 | 1 | yes | 39 | 5/7 | BreadcrumbList | img card thumb | 421 kB |

(TFMC = full suffix `| Trichy Fetal Medicine and Fertility Centre`, 45 chars.)

### Probe URLs

| URL | Result | Notes |
|---|---|---|
| /design-system | 404 | Correct: `notFound()` in production (`app/design-system/page.tsx:63`); disallowed in robots.txt; absent from sitemap |
| /this-page-does-not-exist | 404 | Custom not-found page; emits `robots: index, follow` (L-01) |
| /services/nonexistent-scan | 404 | Correct via `notFound()` |
| /about/ | 308 → /about | Trailing slash redirect OK |
| /About | 404 | Case mismatch 404 (fine) |
| /services/NIPT | 200 | Windows host quirk only; canonical points to /services/nipt (M-13) |
| /guides/page/1 | 404 | `generateStaticParams` emits no paths while guides < 13; correct (no dup of /guides) |
| /guides/rss.xml | 200 | `application/rss+xml`; well-formed; **includes placeholder items** (B-01) |
| /favicon.ico | 200 | OK |
| /manifest.json | 404 | No web manifest (L-04) |

### Link graph

- No orphan pages: every sitemap URL has >= 3 inbound internal links.
- Footer + nav guarantee >= 42 inbound links on most pages; the 5 services beyond the footer's first-7 (`fetal-neurosonogram`, `second-opinion-scan`, `genetic-counselling`, `fetal-postmortem`, `recurrent-miscarriages-clinic`) rely on `/services` index + related-services + mega menu (still 5-7 inbound; healthy).
- `/docs/ISUOG-Trichy-Materno-Fetal-Conclave.pdf` is linked from /cme-activities and /about, not in sitemap (acceptable for a PDF asset).

---

## 2. Findings register

IDs are stable for tracking through the fix phases. "Client data?" = the fix needs facts only the client can supply.

| ID | Area | Severity | Evidence | Impact | Proposed fix | Client data? |
|---|---|---|---|---|---|---|
| B-01 | Content/SEO | **Blocker** | `/guides/placeholder-*` return 200 and `index,follow`; "PLACEHOLDER: NIPT explained" renders in titles/cards on /, /guides, related-guide rails on service pages and guides, category pages, and `/guides/rss.xml`. `data/guides.ts:208-305` (`placeholder: true`, titles prefixed "PLACEHOLDER:", body text "Placeholder content."); `lib/guides.ts:27` filters only on `publishedAt`; `app/sitemap.ts:40` includes them | Public placeholder content; indexable junk pages; trust + medical-credibility damage; 4 thin pages in sitemap | Remove the 4 placeholder guides (or gate them behind `placeholder` flag in `getAllGuides`/`generateStaticParams`/sitemap/RSS); confirm they 404 | No |
| B-02 | Compliance (DPDP) | **Blocker** | `/privacy` renders "This is a draft pending legal and client review." (`app/privacy/page.tsx:42-43`); `/terms` same (`app/terms/page.tsx:40-41`) | Visible "draft" on legal pages; violates the no-marker rule; weakens enforceability of both documents | Remove the sentences when counsel approves the text; until then do not launch | Counsel review |
| B-03 | Legal/Content | **Blocker** | 8 assets `"license": "placeholder"` in `data/image-sources.json`; they render sitewide: `family-bw-newborn` (CTA band, every page), `family-cutout` (home hero, the LCP element), `hands-baby-feet` (3 sensitive service pages), `doctor-glowing-fetus` (/doctors), `baby-overhead` (404, calculator), `pregnancy-test-stork` (services, calculator) | Copyright/licensing exposure on a public commercial site | Client supplies/licences replacements; `REQUIRE_LICENSED_IMAGES=1 npm run check:images` as deploy gate | Yes |
| B-04 | Engineering | **Blocker** | `RESEND_API_KEY`, `LEADS_EMAIL_TO`, `LEADS_EMAIL_FROM` unset; in production `requestAppointment`/`requestCourseEnquiry` return the fallback error (`app/actions/appointment.ts:107-121`, 218-229) | Every appointment and course enquiry silently fails; zero leads from the site at launch | Configure Resend + verified sender domain before launch; test end-to-end | Env/DNS |
| H-01 | Security | **High** | `curl -I` on the build: none of CSP, X-Frame-Options/frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy present; `X-Powered-By: Next.js` exposed; `next.config.ts:3-5` has no `headers()` | Clickjacking, MIME sniffing, referrer leakage, no CSP defence-in-depth; will score F on securityheaders.com | Add `headers()` in `next.config.ts` (nosniff, frame-ancestors/Deny or CSP, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, remove poweredByHeader); HSTS at CDN layer; re-run securityheaders.com + Observatory on preview | No |
| H-02 | SEO | **High** | Title template `%s \| Trichy Fetal Medicine and Fertility Centre` (`app/layout.tsx:43`) adds 45 ch; 30 of 39 titles >60 ch; worst: guide 116 ch, dr-revathy 98, dr-malathi 92, category twins-and-high-risk 90 | Titles truncate in SERPs, weakening CTR and keyword visibility | Shorten suffix to `\| FMC Trichy` (+12 ch) or `\| FMC` (+5); trim the longest page titles (guides, doctors, category pages) | No |
| H-03 | CWV | **High** | Lighthouse mobile medians (3 runs): perf 74-81; LCP 4.59-5.86s on all 6 tested routes (>2.5s threshold); TBT 158-234ms; CLS 0; "unused JavaScript" opportunity ~750-900ms on every route; First Load JS 419-432 kB gz sitewide; biggest chunk 562 kB raw (react-hook-form + zod + sonner + base-ui); lenis 94 kB; home HTML 501 kB (212 kB inline RSC) | Fails LCP on mobile; the shared bundle is the main lever (layout ships booking-form deps to every page) | Dynamic-import the booking sheet/form + Toaster; consider dropping lenis or lazy-loading it; re-measure on Vercel | No |
| H-04 | Compliance (NMC) | **High** | No medical council registration numbers anywhere (`rg "regist|council|nmc|tnmc"` over data/app/components: 0 hits). Doctor data has no field for it (`data/doctors.ts:9-24`) | NMC/State council registration display is expected for a medical practice site; absence is also a trust gap | Add `registration: { council: string; number: string } | null` to `Doctor`; render only when populated; source numbers from client | Yes + counsel |
| H-05 | Compliance (NMC)/Accuracy | **High** | "state-of-the-art" in `site.description` (`data/site.ts:16`) and desktop footer (`site-footer.tsx:182`); "First centre for fetoscopic procedures in south Tamil Nadu" (home meta desc `app/page.tsx:23`, About timeline); "first in Tamil Nadu" neurosonogram (`data/services.ts:528`); "first in the region" genetic counselling (`data/services.ts:630`); "13 years" vs "14 years" mismatch (`lib/site.ts:6`, foundedYear 2012 unconfirmed; `data/doctors.ts:33`) | Superlative/"first" claims need documentary substantiation under NMC advertising ethics; the year mismatch is a factual error waiting to be noticed | Counsel reviews each claim; client supplies evidence (or soften wording); confirm founding year, then recompute "years" everywhere | Yes + counsel |
| H-06 | Compliance (NMC) | **High** | Patient testimonials render on home + service-adjacent sections; `data/testimonials.ts` includes outcome claim "they saved my twins" | NMC Ethics Regulations restrict physician advertising and testimonials are a known risk area for Indian medical websites | Counsel decides keep/remove; if kept, get written consent on file and avoid outcome claims | Yes + counsel |
| H-07 | Compliance (DPDP) | **High** | `/privacy` lacks: grievance officer contact, data-retention statement, processor disclosure (Resend for email delivery, Google Maps embed on /contact which sets third-party cookies, WhatsApp), consent-withdrawal method, cross-border transfer note. Consent label covers only "contacting me about my enquiry" (`components/forms/booking-form.tsx:249`) | DPDP Act 2023 notice obligations are under-specified; processors undisclosed | Counsel drafts compliant policy; enumerate processors; widen or link consent wording | Counsel |
| H-08 | SEO/Content | **High** | Thin meta descriptions: guide categories 46-61 ch. Thin main content: /gallery 20 words, doctor profiles 82-100, /doctors 111, /cme-activities 81, category pages 39-81, /faq 143 | Weak snippets and thin pages underperform; categories are doorway-thin | Write 120-160 ch descriptions for categories; expand doctor profiles (needs approved bios); add intro copy to /gallery, /cme-activities, category pages | Partly (bios) |
| H-09 | Accuracy | **High** | WhatsApp lead number is an env default `917448939808` (`lib/site.ts:26`), label "+91 74489 39808" (`data/site.ts:32`); flagged unconfirmed in `.env.example` and TODO | Wrong number = leads go to a stranger | Client confirms number; set `NEXT_PUBLIC_WHATSAPP_NUMBER` (+ `..._INTL_NUMBER` if wanted) | Yes |
| M-01 | SEO | Medium | Meta description 167 ch on /, 175 on /services (Google truncates ~155-160) | Snippet truncation | Trim to <=155 ch | No |
| M-02 | Content | Medium | "program(s)" 12 occurrences in rendered copy: `app/fellowship/page.tsx` (eyebrow "The program", intro, 2 headings), `app/about/page.tsx` (meta + card title + text), `app/cme-activities/page.tsx` (intro + "View program (PDF)"), `data/courses.ts:56` (alt), `fellowship-highlight.tsx:220` | Indian-English convention is "programme" per project rules | s/program/programme in copy + alt text | No |
| M-03 | Compliance (DPDP)/Content | Medium | `Last updated: ${new Date()...}` on /privacy:32 and /terms:32 — renders the build month/year, not a real revision date | A "last updated" that changes every build is misleading | Hardcode a real date when counsel signs off | Counsel |
| M-04 | Content | Medium | `roleIsPlaceholder: true` only suppresses schema `jobTitle`; "Fetal Medicine Specialist" still renders on /doctors card + mini-cards (`data/doctors.ts:88`, `doctor-card.tsx:30`, `doctor-mini-card.tsx:33`) | An unconfirmed job title is publicly displayed | Confirm role with client (tracked in TODO); the flag pattern is right, the data is pending | Yes |
| M-05 | GEO/SEO | Medium | MedicalClinic JSON-LD lacks geo, hasMap, areaServed, sameAs, foundingDate (`lib/schema.ts:12-45`); provider/worksFor/author on non-home pages are bare `{"@id": .../#clinic}` refs without name/url (legal JSON-LD, but no entity info off-site); Article schema has no `publisher` Organization name/logo object | Weaker entity resolution for Google/AI engines; missed local-pack signals | Add geo coords + hasMap + areaServed once client confirms pin; include name/url alongside @id refs; publisher object on Article | Coords/URL |
| M-06 | SEO | Medium | `app/sitemap.ts` sets `lastModified: new Date()` on 35/39 entries — every deploy marks all pages changed | lastmod loses meaning for crawlers | Use real content dates (per-page constants or file mtimes), keep build date only where nothing better exists | No |
| M-07 | A11y | Medium | Lighthouse: `heading-order` on /doctors (h3 precedes h2 in DOM order); `link-text` non-descriptive links on /guides/downs-screening-oscar; `label-content-name-mismatch` on the placeholder guide card (self-resolves with B-01) | Minor WCAG conformance dents (desktop axe passes clean; these are Lighthouse rule-sets) | Fix heading sequence on /doctors; give guide card links descriptive text or remove redundant aria-label | No |
| M-08 | Privacy | Medium | `/contact` embeds Google Maps iframe (`app/contact/page.tsx:363-371`) — third-party cookies without disclosure (well-configured otherwise: lazy, title, referrerPolicy); WhatsApp is a processor for leads | Third-party data sharing not reflected in /privacy | Disclose embeds/processors in the policy (H-07 fix covers); consider click-to-load map | Counsel |
| M-09 | CWV | Medium | HTML weight: home 501 kB with 212 kB inline RSC scripts; service pages 213-237 kB (113-124 kB inline) | Parse/TTI cost on low-end Android, larger TTFB payload | Partly resolves with H-03 bundle work; revisit after | No |
| M-10 | Perf/Assets | Medium | Doctor cutouts are 562-742 kB PNGs (`public/images/doctors/*-cutout.png`); `public/images/misc/about.jpg`, `feature.jpg` unused and carry EXIF+XMP (Adobe tool/date metadata only, no GPS) | Wasted bytes; stale metadata in public assets | Convert cutout sources to webp; delete or strip unused images | No |
| M-11 | Hygiene | Medium | Dead code: `components/site/newsletter-form.tsx` + `app/actions/subscribe.ts` unused since Phase 3.6 (TODO.md:151-153) | Maintenance surface | Delete or wire it | No |
| M-12 | Accuracy | Medium | Hours state "Mon - Fri: 9:00 AM - 9:00 PM" (`lib/site.ts:34`) — copy and schema agree, but Saturday is unconfirmed (TODO) | If the centre opens Saturdays, the site understates hours (lost visits); if not, fine | Client confirms; single constant already drives copy + schema | Yes |
| M-13 | SEO | Medium | `/services/NIPT` 200 on Windows host (case-insensitive). Canonical → /services/nipt so harmless; a Linux prod host will 404 | None on Vercel; surprising if ever self-hosted on Windows | Verify behaviour on deploy target; optionally add a redirect | No |
| L-01 | SEO | Low | 404 page emits `robots: index, follow` | Cosmetic — Google won't index 404s | `noindex` on not-found metadata | No |
| L-02 | GEO | Low | No `/llms.txt` or `/humans.txt` | Missed (minor) AI-crawler signalling | Add llms.txt in Phase B if wanted | No |
| L-03 | i18n/GEO | Low | `<html lang="en">` — audience is Indian English | Negligible | `lang="en-IN"` | No |
| L-04 | PWA/SEO | Low | No `manifest.webmanifest` | Negligible for a clinic site | Optional | No |
| L-05 | Security | Low | `X-Powered-By: Next.js` exposed | Info disclosure | `poweredByHeader: false` (fold into H-01) | No |
| L-06 | Hygiene | Low | `.next-start.log` tracked in git (committed in "mobile view"); `.vscode/settings.json` tracked (acceptable); `qa-screenshots/` and `.playwright-mcp/` correctly ignored | Repo noise | Untrack the log, add to .gitignore | No |
| L-07 | Content | Low | Public filename typos: `downsscreeningoscor.webp` ("oscor"), `GeneticCounsellingwithExpertGenetecist.webp` ("Genetecist") — visible in image URLs and OG images | Slightly sloppy public URLs | Rename files + update `data/services.ts` refs (redirect not needed pre-launch) | No |
| L-08 | A11y | Low | `alt=""` on decorative images (CTA band background, second hero img, gallery-brand images) — verified intentional decoration | Correct as-is | None | No |
| L-09 | AEO | Low | Home page FAQ section emits no FAQPage JSON-LD (only /faq + service pages do) | Missed machine-readable FAQ on the most-linked page | Emit faqSchema for the shared faqs on / | No |
| L-10 | Hygiene | Low | `motion` v13 in package.json has zero imports | Dead dependency | Remove | No |
| L-11 | SEO | Low | RSS feed lacks a `<language>` element | Cosmetic | Add `en-IN` when touching the feed | No |

---

## 3. SEO section

**What is solid:** canonicals on all 39 pages; `index,follow`; clean robots guard (non-production builds emit `disallow: /`, so staging can never leak into indexes); sitemap contains all indexable URLs and nothing else; one H1 per page; OG image on every page (root generated card + per-service generated cards + guide cover images); per-page JSON-LD; RSS feed; sensible 404 with recovery links; trailing-slash redirects work; breadcrumbs in content and schema.

**Issues:**
- **H-02 title suffix** — the single biggest SEO lever. 30/39 titles exceed 60 ch.
- **M-01** two over-length descriptions (/, /services).
- **H-08** thin category descriptions (46-61 ch) and thin pages (gallery 20 words is effectively an image wall; doctor profiles <100 words; category hubs <80 words).
- **M-06** uniform `lastmod` reduces sitemap usefulness.
- **B-01** four indexable placeholder pages and placeholder card titles sitewide.
- **M-13** Windows-only duplicate URL (canonical saves it; note for deploy parity).
- **L-01** 404 `index,follow` — cosmetic.

**Notes:** `/design-system` correctly 404s + is disallowed. `/guides/page/[n]` generates nothing while guides < 13, so no /guides vs /guides/page/1 duplication. `/privacy` and `/terms` are indexable — acceptable, though some teams noindex legal pages; decide consciously rather than by accident.

## 4. AEO section

**What is solid:** FAQPage JSON-LD on /faq, all 13 service pages, /international-patients and both real guides — every one mirrors a visible accordion (parity, no schema-only content). Both real guides have `quickAnswer` blocks, H2-based TOCs, key takeaways, medically-reviewed-by attribution with reviewer name and qualifications — strong answer-engine formatting. Plain-language question headings throughout ("What it checks", "What to expect on the day", "Common questions").

**Issues:**
- **B-01** placeholder guides pollute the answer surface.
- **L-09** home FAQ section has no FAQPage markup (the same questions have it on /faq — cheap win).
- Note: Google restricted FAQ rich results to authority sites (Aug 2023), so FAQPage here is for AEO/voice/AI extraction, not SERP stars. Still correct to keep.
- Guide answer quality is genuinely good for AI extraction; the blocker is medical sign-off (TODO tracks `draft: true`), not structure.

## 5. GEO section

**What is solid:** `MedicalClinic` entity with stable `@id` (#clinic), address, telephones, openingHoursSpecification, employee Physicians with qualifications; `Article`/`MedicalWebPage` on guides with `reviewedBy` Physician and `lastReviewed`; `MedicalProcedure` per service; `Course` per course; consistent NAP across footer, contact page and schema; `en_IN` OG locale; generated OG images.

**Issues:**
- **M-05** entity enrichment: no `geo` coordinates, `hasMap`, `areaServed`, `sameAs`, `foundingDate` on the clinic; off-home `provider`/`author` are bare `@id` refs (name/url would strengthen entity stitching); Article `publisher` should be an Organization with `name` + `logo`.
- **L-02** no `llms.txt`/`humans.txt`; robots.txt makes no AI-crawler statement (they're allowed by default — fine, but a deliberate policy is better).
- **L-03** `lang="en"`, consider `en-IN`.
- Social profiles don't exist yet (`data/site.ts:45` `socials: []`) → no `sameAs` targets until client supplies them (needs client data).
- No Google Business rating/awards/affiliations data — `data/trust.ts` is correctly typed-nullable and hidden; populate when verified (needs client data).

## 6. Compliance section — NMC, PCPNDT, DPDP

**All items in this section: for client counsel review.**

### PCPNDT — strong coverage
- Sitewide disclaimer: desktop `DisclaimerBar` + mobile footer line (`site-footer.tsx:166`) — full statutory wording.
- Per-service disclaimer on every service page: booking card (`app/services/[slug]/page.tsx:141-144`) + mobile footnote (:489-493).
- Services index disclaimer (`app/services/page.tsx:43`); guide article footnote (`app/guides/[slug]/page.tsx:341-349`); Terms has a dedicated "No sex determination" clause (:61-67).
- No offering-type phrasing anywhere: banned phrases ("boy or girl", "gender of the baby", "sex determination" in offering context) checked across `data/`, `app/`, `components/` — hits only inside disclaimer text itself.
- **Gap:** `scripts/check-guides.mjs` enforces the banned-phrase + dash rules only on `data/guides.ts`. Extend the same gate to `services.ts`, `faqs.ts`, `courses.ts`, `cme.ts`, `testimonials.ts` in Phase B (low cost, real safety net as copy grows).

### NMC
- **H-04** no registration numbers — add typed field, collect from client.
- **H-05** unverified superlatives/"first" claims — counsel reviews each; keep only what the client can document.
- **H-06** patient testimonials — counsel call; "saved my twins" is an outcome claim.
- **M-04** placeholder doctor role displayed.
- Prices: none published — consistent with conservative medical-advertising practice (positive).
- `data/services.ts` copy explicitly avoids success rates/statistics — good discipline; keep it.

### DPDP
- **B-02** both legal pages publicly declare themselves drafts.
- **H-07** notice gaps: grievance officer, retention, processors, withdrawal, cross-border.
- **M-08** Google Maps embed (third-party cookies) and WhatsApp not disclosed.
- **M-03** cosmetic-but-wrong "last updated" from `new Date()`.
- **Good:** consent checkbox required + privacy link at point of collection; data minimisation respected (name/phone/preferences only, no medical fields); honeypot + 3-second minimum submit on both forms; dev-only PII logging is gated behind `NODE_ENV=development` (`appointment.ts:110-113`); forms degrade to phone/WhatsApp instructions rather than storing data.
- Email transport (Resend) is a processor — mention once configured (B-04).

## 7. Content quality section

- **B-01/B-02** visible placeholder/draft text — the only banned markers that render. Source scans show zero em/en dashes, zero US spellings in copy (`--color-*` CSS names are code, excluded), zero US-format dates, phones in `+91 XXXXX XXXXX` format throughout.
- **M-02** "program" ×12 → "programme".
- **H-08** thin pages listed above.
- **M-03** dynamic last-updated.
- **M-04** placeholder role.
- **L-07** filename typos in public URLs.
- Pending-client copy already tracked in TODO.md and confirmed live in this audit: 13-vs-14 years, Revathy surname variant, Dr Nivethitha role, course durations/intake, Saturday hours, WhatsApp numbers, socials, Google Maps listing URL, gallery categories + consultation-room photo, Rajesh translation approval, guide medical review (`draft: true` on both real guides), scan-schedule windows, about-timeline dates.
- Guide metadata dates: real guides carry `publishedAt`/`updatedAt` (sitemap uses them) — good; category/doctor/service pages use build dates (M-06).

## 8. Code hygiene section

- **M-11** dead code (newsletter form + subscribe action).
- **L-06** `.next-start.log` committed; `.vscode/` tracked (judgement call); proper ignores already in place for `qa-screenshots/`, `.playwright-mcp/`, `*.tsbuildinfo`, `.env*`.
- **L-10** `motion` dependency unused (0 imports).
- **M-10** unused `public/images/misc/*.jpg` with EXIF/XMP.
- `console.log` in server actions is dev-gated — clean. No `debugger`, no stray `console.*` in components.
- Strong existing hygiene worth noting: `lib/content-rules.ts` + prebuild gate; typed-null data pattern (`duration`, `intakeDate`, `showBrochure`, `trust`, `stats`, `socials`) already implements "renders nothing when empty" — extend it to reg numbers and the other pending facts rather than hardcoding.
- `next.config.ts` is nearly empty — no `headers()`, no `images` block needed (all local), `poweredByHeader` not disabled.
- `eslint.config.mjs` + TypeScript pass clean during build (typecheck 4.1s, no errors).

## 9. Core Web Vitals section

Lab numbers (Lighthouse mobile, simulated throttling, 3-run median, local `next start`):

| Route | Perf | a11y | BP | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| / | 74 | 100 | 100 | 100 | 5.86 s | 0.000 | 234 ms | 1.53 s |
| /services/anomaly-scan | 81 | 100 | 100 | 100 | 4.79 s | 0.000 | 160 ms | 1.22 s |
| /services/nipt | 78 | 100 | 100 | 100 | 5.19 s | 0.000 | 223 ms | 1.21 s |
| /doctors | 78 | 98 | 100 | 100 | 5.32 s | 0.000 | 163 ms | 1.22 s |
| /guides/downs-screening-oscar | 80 | 100 | 100 | 92 | 4.87 s | 0.000 | 158 ms | 1.21 s |
| /contact | 81 | 100 | 100 | 100 | 4.59 s | 0.000 | 177 ms | 1.22 s |

- **LCP fails everywhere** (>2.5s). LCP elements: hero `family-cutout.webp` on /, service photos on most service pages, `hands-baby-feet-736.webp` on the 3 sensitive pages, text blocks elsewhere. Local unthrottled LCP is 136-680ms, so this is weight/latency, not render-blocking markup — consistent with the ~420 kB gz JS + 500 kB HTML on a simulated mid-tier phone. The single "unused JavaScript" opportunity (~0.75-0.9s) is the fix's first target.
- **First Load JS ~419-432 kB gzip** on every route — dominated by the layout-level bundle: 562 kB raw chunk containing react-hook-form + zod + sonner + base-ui (booking form deps), 94 kB lenis, 89 kB base-ui, React/Next runtime. Route-level JS is minimal (0-33 kB). Recommendation: `next/dynamic` for `BookingSheet`/`Toaster`, defer lenis, consider whether sonner needs to be in the shared chunk.
- **CLS 0.000, a11y ~100, best-practices 100** — the base is excellent; this is a weight problem, not a stability problem.
- **M-09** HTML/RSC payload 213-237 kB on service pages, 501 kB home — worth a second look after JS diet.
- Fonts are self-hosted via `next/font` (Fraunces, Nunito Sans, Noto Sans Tamil) with `display: swap` — no external font blocking; images all via `next/image` or pre-sized static files with `sizes` attributes; hero uses `priority`.
- Re-run Lighthouse on the Vercel preview before/after the bundle diet; lab LCP locally cannot reflect CDN TTFB.

## 10. Pending external checks

| Check | Status |
|---|---|
| Google Rich Results Test (per template: home, service, doctor, guide, faq) | Pending — submit on preview URL; JSON-LD locally validated (parses, absolute URLs, required props present) |
| validator.schema.org | Pending — same pass |
| securityheaders.com | Pending preview URL (current fmctrichy.com = old LiteSpeed site; new build sends zero security headers → will score F until H-01 lands) |
| Mozilla Observatory | Pending preview URL |
| exiftool | Not installed — `sharp` metadata scan used instead (results in M-10) |
| CrUX/field CWV | N/A pre-launch — re-measure post-deploy |

## 11. Checks that passed (no action needed)

- axe-core: 0 violations, 27 routes, WCAG 2A/2AA/21A/21AA (`docs/axe-results.txt`).
- Zero console errors or hydration mismatches on all 39 pages (browser pass).
- Canonicals, robots meta, H1 count, OG images, JSON-LD parse: 100% pass.
- No em/en dashes, US spellings, US date formats, or non-`+91 XXXXX XXXXX` phone formats in rendered copy.
- No banned PCPNDT phrasing outside disclaimer text.
- Skip link, reduced-motion handling (lenis + reveals), form consent + honeypot + privacy link, lazy+titled maps iframe, `referrerPolicy` on embed, self-hosted fonts, correct RSS content-type, trailing-slash 308s, /design-system 404+disallow, no orphan pages, no missing service images, no EXIF GPS data in any image.


---

# ADDENDUM A1 (3 October 2026)

Corrected severities and the audit sections deferred from Phase A. Report only; no code changes.

## A. Severity changes

| ID | Severity | Finding | Evidence | Proposed fix |
|---|---|---|---|---|
| **B-05** | Blocker | Review-badge rendering is gated only on `guide.reviewedBy` being populated; there is no `draft`/`reviewStatus` check in the render path or in `getAllGuides`. The data file's own header comment instructs "set reviewedBy/reviewedAt before launch", so a draft guide will display "Medically reviewed by {name}", the reviewer card, and `MedicalWebPage` + `reviewedBy`/`lastReviewed` schema the moment those fields are filled. Today no guide sets them (badge not yet visible), but the gate is wrong by design: a review badge must require a completed review, not just two populated fields. | `app/guides/[slug]/page.tsx:93-95,115-132,235-243,352-377`; `data/guides.ts:5`; `types/guide.ts:46-48` | Add `reviewStatus: "pending" \| "reviewed"` to `Guide` (default `pending`). Render byline, reviewer card and review schema only when `reviewStatus === "reviewed"` AND `reviewedAt` is set. Draft/unreviewed guides show "Written by the FMC Trichy clinical team" + Article schema. (Service pages currently have no reviewer mechanism; the same gate applies if one is added.) |
| M-08 -> **High** | High | Google Maps iframe embed on `/contact` loads third-party trackers on page view; a privacy-policy disclosure is not sufficient for DPDP-grade minimisation. | `app/contact/page.tsx` (maps iframe); footer map link | Replace with a self-hosted static map image + "Get directions" external link, sharing one component with the footer. Zero third-party embeds after fix. *(for client counsel review)* |

## B1. Tool-artifact scan

Tracked config/doc files found: `.devin/config.json`, `.devin/mcp_config.json`, `AGENTS.md`, `CLAUDE.md`, `TODO.md`.
Not present: `.claude/`, `.cursor/`, `.cursorrules`, `.windsurfrules`, `.aider*`, `.github/copilot-instructions.md`, `prompts/`, `PLAN.md`, `NOTES.md`, `TASKS.md`, `PROGRESS.md`.

| Location | Hit | Classification |
|---|---|---|
| `.devin/config.json:11` | `"Exec(devin mcp)"` | AI-tool trace in a committed repo file (MCP allowlist entry). Client decision: keep or strip before launch. |
| `git log` | `Co-Authored-By: Devin <158243242+devin-ai-integration[bot]...>` on commit `6caac64` ("mobile view"), already pushed to `origin/main` | AI-tool trailer in public history. Removing it requires history rewrite - needs explicit approval. |
| `README.md:1` | "bootstrapped with create-next-app" + stock deploy text | Stock boilerplate, not an AI tool. Recommend a project-specific README rewrite (Low). |
| `next.config.ts:4` | `devIndicators: false` | False positive (Next.js API name). |
| `components/shared/brand-image.tsx:7` | "pre-generated" | False positive. |

Authors: `Rahul-Aitla <aitlarahul@gmail.com>` (all commits). Branches: `main`, `origin/main` - clean. No `claude`, `anthropic`, `openai`, `chatgpt`, `gpt-`, `copilot`, `windsurf`, `codeium`, `aider`, `ai-generated` matches in tracked source (earlier `cursor-*` hits were Tailwind classes, false positives).

## B4. Invisible characters and quote style

Scanned all copy/data/TSX files (excluding `lang="ta"` strings):

- Zero U+200B, U+200C, U+200D, U+2060, U+FEFF, U+00AD, U+00A0, U+202F and other non-standard spaces. No BOM anywhere.
- Apostrophes: straight `'` only (~148), curly count 0. Quotes: straight `"` only, curly count 0. Style is consistent - no mixing to fix.
- JSX `&apos;` entities used where an apostrophe sits inside JSX text; renders as `'` - consistent.

## B6. Tone audit (flagged; rewrite deferred to a later batch)

**Vocabulary hits in rendered copy** (code identifiers/comments excluded; `expertise:` field names, `navigate` in a lightbox comment, `devIndicators` etc. are not copy):

| Term | Locations |
|---|---|
| state-of-the-art | `data/site.ts:16` (renders in every page description built from it), `components/site/site-footer.tsx:182` |
| comprehensive | `data/courses.ts:37` |
| tailored | `data/services.ts:793` |
| dedicated | `data/faqs.ts:71`; `data/courses.ts:36`; `data/services.ts:477,528,736,739`; `app/international-patients/page.tsx:26,83`; `app/about/page.tsx:23,33,40,41`; `app/contact/page.tsx:352`; `components/home/why-choose-us.tsx:21`; `components/home/doctors-section.tsx:258` |
| expertise (as copy) | doctor profile "Expertise" headings + `data/doctors.ts` `expertise` labels render verbatim |

Zero hits for the rest of the list (seamless, delve, leverage, journey, empower, holistic, paramount, moreover, world-class, premier, renowned, game-changing, "in today's fast-paced world", "look no further", "rest assured", etc.).

**"X, not Y" constructions in copy**: `data/guides.ts:22` ("a screening test, not a diagnosis"), `data/services.ts:188` (same), `data/services.ts:558` ("a specialist second look, not a verdict"), `data/services.ts:631` ("a conversation, not a test"), `data/faqs.ts:41` ("sound waves, not radiation"), `components/home/visit-steps.tsx:16` ("specialist, not a technician alone"). Most are deliberate plain-English clarification rather than AI cadence; review in the tone batch. No "not just X, but Y" hits.

**Project phrases in copy**: `plain language` x10 (`app/about/page.tsx:117`, `app/doctors/page.tsx:36`, `app/services/page.tsx:29`, `data/services.ts:344,580,651`, `data/guides.ts:79,195`, `components/home/services-section.tsx:297`, `components/home/visit-steps.tsx:20`); `calm` x3 (`app/about/page.tsx:113`, `components/home/gallery-preview.tsx:57`, `components/home/visit-steps.tsx:37`); `unhurried` x2 (`data/services.ts:649`, `components/home/visit-steps.tsx:37`); `under one roof` x2 (`app/about/page.tsx:188`, `components/home/why-choose-us.tsx:33`); `in their words` x1 (`components/home/why-choose-us.tsx:46`); `every step` x1 (`app/about/page.tsx:120`); `close to home` x1 (`app/about/page.tsx:107`); `state-of-the-art` x2 (above); `at the heart of`, `time taken to explain` x0.

**Repeated 5-word phrases (rendered, 35 pages, `scripts/audit-phrases.mjs`)**: 392 raw cross-page phrases; after removing shared chrome (nav, CTA band, footer, PCPNDT disclaimer text, card boilerplate like "what it checks what to expect"), ~258 remain - nearly all are service-card descriptions that repeat wherever the same card renders (home, `/services`, related-service rails, category pages). That is intended copy reuse, not duplication drift. One real outlier: `"to be replaced before launch"` appears on 12 rendered pages - the live placeholder-guide excerpts (covered by B-01). Sibling service-card openings follow a repeated "A/An + noun" pattern ("An early pregnancy scan...", "A combined first trimester screening...", "A detailed early scan...", "A scan that tracks...", "A simple blood test...") - patterned but not identical; flag for the tone batch.

## Legacy URL inventory and redirect proposal

Old site at `fmctrichy.com` fully crawled: static Bootstrap/LiteSpeed site, **5 HTML pages, no sitemap, no robots.txt, 1 linked PDF, ~27 images**. Every URL and its proposed 301 target is in **`docs/REDIRECTS.md`**. Summary: `/index.html` + 5 `.html` pages map cleanly onto existing new routes (`/`, `/cme-activities`, `/contact`, `/doctors`, `/gallery`); old in-page anchors (`#about`, `#service`, `#doctors`, `#fellowship`, `#appoinment`) documented - fragments can't be 301'd server-side, covered by the path-level redirect. One decision needed: the linked CME PDF (`/img/gallery/ISUOGTrichy-Materno-Fetal-Conclave.pdf`) - preserve under `public/docs/` or redirect to `/cme-activities` (client decision). Old `/img/*` photos: 404 acceptable unless image-search traffic matters.

## Thin-content table (agreed thresholds)

Main-content words (chrome excluded), production build:

| Page | Type | Words | Threshold | Gap |
|---|---|---|---|---|
| `/services/recurrent-miscarriages-clinic` | service | 398 | 700 | 302 |
| `/services/fetal-postmortem` | service | 412 | 700 | 288 |
| `/services/twin-specialised-clinic` | service | 447 | 700 | 253 |
| `/services/second-opinion-scan` | service | 448 | 700 | 252 |
| `/services/genetic-counselling` | service | 454 | 700 | 246 |
| `/services/fetal-neurosonogram` | service | 456 | 700 | 244 |
| `/services/fetal-echo` | service | 464 | 700 | 236 |
| `/services/nipt` | service | 476 | 700 | 224 |
| `/services/growth-scan-doppler` | service | 498 | 700 | 202 |
| `/services/first-trimester-anomaly-scan` | service | 510 | 700 | 190 |
| `/services/anomaly-scan` | service | 563 | 700 | 137 |
| `/services/downs-screening-oscar` | service | 548 | 700 | 152 |
| `/services/viability-scan` | service | 576 | 700 | 124 |
| `/doctors/dr-revathy-chandrasekharan` | doctor | 82 | 300 | 218 |
| `/doctors/dr-malathi-g-prasad` | doctor | 100 | 300 | 200 |
| `/about` | about | 420 | 600 | 180 |
| `/doctors` (index) | index | 111 | - | thin (no agreed threshold) |
| `/cme-activities` | index | 81 | - | thin (no agreed threshold) |
| `/gallery` | index | 29 | - | thin (no agreed threshold) |
| `/guides/anomaly-scan-what-to-expect` | guide | 595 | 1000 | 405 |
| `/guides/downs-screening-oscar` | guide | 681 | 1000 | 319 |
| 4x `placeholder-*` guides | guide | 110-197 | 1000 | 803-890 (deleted in Batch 1) |

**Every** service page (13/13), both doctor profiles, `/about`, and both real guides are below threshold. Expansion is Batch 2/3 work - no medical claims may be invented to fill word counts.

## LCP root cause

Mechanism (`components/shared/reveal-provider.tsx` + `app/globals.css:119-137`):

- **Mobile (<768px):** `.reveal` elements render visible in server HTML (no opacity-0 SSR), then hydration sets `data-reveal-state="pending"` => `opacity: 0; translateY(8px)` until IntersectionObserver fires and a 250ms transition completes (plus per-element `--reveal-delay` stagger). So any LCP element inside `.reveal` is painted, hidden, then re-shown - LCP waits for hydration + observer + transition.
- **Desktop (>=768px):** CSS scroll-driven `animation-timeline: view()` (no JS needed) - not part of the measured problem.

Per-route result (local crawl + code inspection):

| Route | LCP element | Inside `.reveal`/opacity-0/transform ancestor? | Visibility timing |
|---|---|---|---|
| `/` | hero `family-cutout.webp` (`next/image`, `priority`) | No | SSR-visible; waits on image fetch |
| `/services/anomaly-scan` + 9 image services | service photo (`next/image fill`) | No | SSR-visible; waits on image fetch |
| `/services/genetic-counselling`, `/fetal-postmortem`, `/recurrent-miscarriages-clinic` | `hands-baby-feet` BrandImage | **Yes** - wrapper div gets `.reveal`; image is also lazy-loaded (no `priority`) | Hidden at hydration until IO + transition; local LCP ~500-512ms vs ~230ms on equivalent non-reveal service pages |
| `/doctors` | `malathi-cutout.png` | No | SSR-visible |
| Other tested routes (`/about`, `/services`, `/fellowship`, `/cme-activities`, `/gallery`, `/guides`, `/contact`, `/faq`, `/due-date-calculator`, `/international-patients`, `/privacy`, `/terms`, doctor profiles, guides, categories) | text blocks (h1/p) | No | SSR-visible |

**Lighthouse A/B, reveals disabled via `prefers-reduced-motion` (1 pass each, mobile):**

| Route | LCP default | LCP reduced | Delta |
|---|---|---|---|
| `/` | 5.9 s | 5.9 s | 0.0 s |
| `/services/anomaly-scan` | 4.8 s | 4.8 s | 0.0 s |
| `/services/genetic-counselling` | 5.2 s | 5.2 s | 0.0 s (perf score +3) |

Interpretation: at Lighthouse's simulated speeds, hydration completes before the throttled image fetch finishes, so the reveal-hiding adds no measurable lab LCP on these routes - the dominant cost remains ~420 kB gz shared JS + image weight. The reveal pattern is still wrong for above-the-fold content (a visible-then-hidden-then-revealed flash on real devices with slower JS, plus the 2x local-LCP elevation on the 3 sensitive pages). Fix in Batch 1 regardless: nothing above the fold should depend on hydration for visibility; reveals apply below the fold only. `hands-baby-feet` also needs `priority`.

## Compliance gap inventory (all items "for client counsel review")

| Item | Status |
|---|---|
| `/editorial-policy` page | **Missing.** Medical-content sites should state review process, authorship, update cadence. Add after counsel drafts it (Batch 2/3). |
| PCPNDT registration number field | **Missing.** No field in `lib/site.ts`/`data/site.ts`; disclaimers exist but no registration number rendered anywhere. Add typed-null field (Batch 1 structure) + client data. |
| Tamil Nadu clinical establishment registration field | **Missing.** Same typed-null treatment. |
| ART Act registration | **Missing - and the underlying question is unanswered:** the site is named "...and Fertility Centre" but no page states whether IUI/IVF/ART services are actually offered. If ART services exist, registration disclosure applies. **Client confirmation required** before any fertility-service content is written (see "Fertility" entity question below). |
| Telemedicine Practice Guidelines 2020 note on `/international-patients` | **Missing.** Page offers "remote report reviews" and a WhatsApp line - activities that sit near teleconsultation; no guideline reference or jurisdictional note. Counsel to draft. |
| Accessibility statement | **Missing.** Recommended: `/accessibility` page + footer link (WCAG 2.2 AA target is already met per axe). |
| Doctor fields | Present: name, role, qualifications (unstructured strings), highlights, trainedAt, expertise, photo, mentors, background. **Missing:** `registration {council, number}`, qualification years + institutions (structured), `experienceSinceYear`, `languages`, `memberships`. Add as typed-null fields (Batch 1 structure) + client data. |
| "Fertility" entity question | Unresolved. Name and metadata promise "Fertility Centre"; service catalogue is fetal medicine + screening only (`icsi-illustration` image is parked with note "Do not render anywhere until fertility services are confirmed"). **Client must confirm whether IUI/IVF is offered** - this gates ART registration, service-page scope, and the accuracy of the site name/description itself. |
| Grievance officer (DPDP) | Missing - typed field `site.grievanceOfficer` planned in Batch 1; name/designation/email/phone from client. |

## Image provenance

All 125 files under `public/images/` scanned for C2PA (`urn:c2pa`, `c2pa`) and AI-generator strings (midjourney, dall-e, stable-diffusion, SDXL, comfyui, "ai-generated", "synthesized", "generative", openai, adobe): **zero hits**. No content-credentials metadata present (absence of provenance data is not itself a problem, but worth noting - the placeholder-licence images below have no machine-readable provenance at all).

Placeholder-licence assets (`license: "placeholder"` in `data/image-sources.json`) and where each renders:

| Slug | Rendered? | Placement |
|---|---|---|
| `family-cutout` | **Yes** | **Home hero = LCP image on `/`** (`components/home/hero.tsx:74,93` via `/images/family-cutout.webp`); also flagged "baked checkerboard, no real alpha" in creditNote |
| `family-bw-newborn` | **Yes** | **CTA band on every page** (`components/cards/cta-band.tsx:112,127`); creditNote: photographer logo embedded top-right |
| `hands-baby-feet` | **Yes** | **LCP image on 3 sensitive service pages** (`app/services/[slug]/page.tsx:253-260`: genetic-counselling, fetal-postmortem, recurrent-miscarriages-clinic) |
| `baby-overhead` | Yes | `/due-date-calculator` + `/not-found` |
| `pregnancy-test-stork` | Yes | `/due-date-calculator` |
| `doctor-glowing-fetus` | Yes | `/doctors` |
| `family-airy-newborn` | Parked | Source missing; renders nothing |
| `icsi-illustration` | Parked | Withheld pending fertility-services confirmation |

6 of 8 placeholder-licence images are user-visible, including the home hero, the sitewide CTA band, and 3 service LCP images - reinforces B-03 (Blocker until replaced/licensed). The two parked entries are already safe.

## Addendum findings count

New: 1 Blocker (B-05). Upgraded: M-08 to High. Remaining work items filed under the sections above; no new Medium/Low IDs beyond the noted Low recommendations (README rewrite, `hands-baby-feet` priority flag - both folded into Batch 1).

---

# DEPLOYED-SITE MEASUREMENT (3 October 2026)

Target: `https://drmalathi.vercel.app` (production deploy of `pre-launch-audit`, merge commit `2b2eb47`). Verification: `/guides` returns 404, comparative claims absent from home/about/service HTML — production gates confirmed live.

## Lighthouse mobile vs public deployment (lab, single run per route)

Run against the Vercel edge, not localhost. Note: PageSpeed Insights API keyless quota was exhausted (HTTP 429, 0/day), so these are Lighthouse lab numbers on the deployed site, not PSI.

| Route | Perf | LCP | TBT | CLS | FCP | LCP element |
|---|---|---|---|---|---|---|
| `/` | 85 | 3.2 s | 350 ms | 0 | 1.1 s | `family-cutout.webp` (image) |
| `/services/anomaly-scan` | 89 | 2.9 s | 280 ms | 0 | 1.2 s | `AnomalyScan.webp` (image) |
| `/services/nipt` | 93 | 3.0 s | 130 ms | 0 | 1.2 s | `NIPT.webp` (image) |
| `/doctors` | 93 | 2.9 s | 150 ms | 0 | 1.2 s | `malathi-cutout.png` served as AVIF (image) |
| `/about` | 93 | 3.0 s | 130 ms | 0 | 1.2 s | `event8.webp` (image) |
| `/contact` | 94 | 2.9 s | 120 ms | 0 | 1.2 s | Intro paragraph (text) |

vs the same lab on localhost: LCP 3.8–4.4 s → **2.9–3.2 s**, Perf +1 to +6 on every route, FCP ~1.2 s everywhere, CLS 0. The localhost floor was the simulation, as suspected. TTFB at the edge: 26–45 ms. Remaining LCP cost is `elementRenderDelay` (265–900 ms, JS boot) plus `resourceLoadDelay` ~470–500 ms on `/services/nipt` and `/doctors` — worth a look only if PSI field data agrees.

## Structured data validation

validator.schema.org (API): home page **0 errors, 2 warnings** — non-standard `qualifications` and `jobTitle` on `Physician` (harmless, both are real content Google ignores). The other three page types were structural-checked locally (validator rate-limited the session): `/services/anomaly-scan` (BreadcrumbList + MedicalProcedure + FAQPage), `/doctors/dr-malathi-g-prasad` (Physician + BreadcrumbList), `/faq` (FAQPage + BreadcrumbList) — all parse, all required fields present, no issues.

Pending manual runs (no public API): Google Rich Results Test on `/`, one service, one doctor, `/faq`; validator.schema.org UI on the remaining three URLs.

## Security headers (live)

Present: `Strict-Transport-Security` (2y, preload — Vercel edge), `Content-Security-Policy-Report-Only` with `report-uri`/`report-to`, `Reporting-Endpoints`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. `X-Powered-By` absent.

securityheaders.com and Mozilla Observatory could not be run programmatically (Cloudflare challenge on the former; Observatory API returning 502s). Manual links in the runbook. Note for whoever runs them: CSP is report-only, so scanners that penalise report-only mode will flag it — that is intentional until the baseline is clean.

## Vercel Speed Insights

**Not enabled.** Two steps needed, one each side: (a) code — install `@vercel/speed-insights` and render `<SpeedInsights />` in `app/layout.tsx` (deferred intentionally until numbers are reviewed, per instruction — it adds ~1.5 kB to every page); (b) dashboard — Speed Insights tab → Enable on the `drmalathi` project. Field data only accumulates after both are done.

## Manual check links (for the user)

- PSI: `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdrmalathi.vercel.app%2F` (swap path per route)
- Rich Results: `https://search.google.com/test/rich-results?url=https%3A%2F%2Fdrmalathi.vercel.app%2F`
- validator.schema.org: `https://validator.schema.org/#url=https%3A%2F%2Fdrmalathi.vercel.app%2F`
- securityheaders: `https://securityheaders.com/?q=https%3A%2F%2Fdrmalathi.vercel.app&followRedirects=on`
- Observatory: `https://developer.mozilla.org/en-US/observatory/analyze?host=drmalathi.vercel.app`
