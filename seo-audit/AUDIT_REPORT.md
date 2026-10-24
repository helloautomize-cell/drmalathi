# SEO / AEO / GEO Audit — Trichy Fetal Medicine and Fertility Centre

**Site audited:** Next.js 16.3.7 build (Turbopack), `E:\Automize\ivf`, canonical domain `https://fmctrichy.com`
**Method:** `INDEXABLE=1` production build served with `next start`, pages fetched raw (no JS) with Googlebot / GPTBot / ClaudeBot etc. via `Host: fmctrichy.com` simulation; source-level review of all templates and data files; Lighthouse mobile lab runs on 4 page types.
**Date:** 2026-10-24
**Important context:** the live domain `fmctrichy.com` still serves the old LiteSpeed site. This audit covers the new Next.js build that is not yet deployed.

---

## 1. Scores

| Area | Score /100 |
|---|---|
| Crawling & AI-bot access | 88 |
| Technical (titles, meta, CWV, canonicals) | 70 |
| Schema | 56 |
| E-E-A-T | 42 |
| Pillar linking | 45 |
| FAQs | 64 |
| Entities & semantics | 58 |
| Keywords | 66 |
| Content humanness | 78 |
| AEO/GEO readiness | 68 |
| **Overall** | **66** |

The foundation is unusually strong: real SSR content, working robots/sitemap/llms.txt, breadcrumbs, canonicals, FAQ schema, clean URLs, genuine plain-language copy. The big gaps are all in E-E-A-T (no named doctor on any article, registration numbers empty), schema depth (Article instead of MedicalWebPage, no connected @graph), content architecture (no pillar pages), and LCP.

---

## 2. Checklist (PASS / FAIL / PARTIAL + evidence)

### Crawling and indexing
| # | Result | Evidence |
|---|---|---|
| 1 | **PASS** | `app/robots.ts` returns `Allow: /`, `Disallow: /api/`, `Sitemap: https://fmctrichy.com/sitemap.xml`. Verified via curl on canonical host. |
| 2 | **PASS** (note) | `app/robots.ts:8-15` names GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended explicitly. ChatGPT-User, Claude-SearchBot, Claude-User, Perplexity-User and Bingbot are not named but are covered by the `*` allow rule. All 9 test UAs got 200 on every page. |
| 3 | **PASS** | `proxy.ts` only gates by host (non-canonical hosts get disallow-all robots + `X-Robots-Tag: noindex`). No 403/429/challenge for any bot UA on the canonical host. |
| 4 | **PASS** | `app/sitemap.ts` — 42 URLs, absolute production URLs, per-page `lastModified` from `data/content-dates.ts` + per-item dates on services/doctors/guides. Crawled every sitemap URL: all 200, none redirect, none noindex. Static pages all share `2026-10-03` — accurate but uniform; bump per-edit. |
| 5 | **PASS** | `/llms.txt` (`app/llms.txt/route.ts` + `lib/llms.ts`) — full clinic summary, doctors, services, hours, PCPNDT note, guide links. `/llms-full.txt` also exists (274 KB). Exemplary. |
| 6 | **PARTIAL** | Indexable pages get `index, follow` only when `VERCEL_ENV=production` or `INDEXABLE=1` at **build** time (`app/layout.tsx:39-44`, `app/robots.ts:4-5`). A non-Vercel or misconfigured production deploy silently ships `noindex,nofollow` + `Disallow: /` site-wide with zero errors. Legal pages are intentionally `noindex` while `draftPendingReview` (`data/legal.ts`). |
| 7 | **PASS** | `metadataBase` set from `site.url` (`app/layout.tsx:43`); every page emits `alternates.canonical`; verified absolute self-canonicals on all 30+ fetched pages. |
| 8 | **FAIL** | `proxy.ts:6` accepts **both** `fmctrichy.com` and `www.fmctrichy.com` as canonical hosts — www serves 200 with identical content, no 301 to apex. On the current live LiteSpeed domain the problem is worse: `http://`, `https://` apex and `https://www` return three different sites (40 KB vs 534 KB payloads), and `/robots.txt` 404s there. |
| 9 | **PASS** | Unknown URL returns real 404 (`/nonexistent-page-xyz` → 404); `/guides/category/pregnancy-health` (empty category) correctly 404s; `/guides/page/1` 404s (page 1 is `/guides`). |

### Every word visible to Google and AI bots
| # | Result | Evidence |
|---|---|---|
| 10 | **PASS** | Raw HTML (GPTBot UA) contains full article copy, headings, byline, dates, internal links, breadcrumbs and JSON-LD on every page type tested. |
| 11 | **PASS** | Base-UI accordion panels render FAQ answers in SSR HTML (verified: all 10 home FAQs + all guide FAQ answers present in raw HTML). Client components (`FaqBrowser`, `GuideBrowser`, `ServiceBrowser`, `MobileCarousel`) all SSR their content; search/filter only enhances. Contact + booking forms render full `<form>` markup server-side. |
| 12 | **PASS** | Zero `onClick`-only navigation links found; all nav/footer/card links are real `<a href>` / `next/link`. `onClick` used only for menu-close and lightbox controls. |

### On-page
| # | Result | Evidence |
|---|---|---|
| 13 | **PARTIAL** | Every page has a unique title + description, but the 50–60 / 140–160 ranges fail broadly. Titles: `Gallery` 20, `Our Doctors` 24, `Terms of Use` 25, `NIPT in Pregnancy` 30, `PCOS and Pregnancy` 31, `Dr Malathi G. Prasad` 33 — nearly all pages are under 50 chars. Descriptions out of range: `/accessibility` 99, `/editorial-policy` 119, `/guides/category/*` 120–122, `pcos` 165, `fetal-echo` 169, `twin-pregnancy` 177. |
| 14 | **PASS** | Exactly one `<h1>` on every fetched page; h2→h3 nesting clean (accordion triggers are h3-wrapped buttons — acceptable). |
| 15 | **PARTIAL** | URLs are clean (`/services/anomaly-scan`, `/guides/nt-scan-...`), but flat: no pillar→supporting URL hierarchy; category pages exist but carry only a card grid. |
| 16 | **PARTIAL** | All images use `next/image` with dimensions. 3 images on the home page ship `alt=""` on content images: `viabilityscan.webp`, `NIPT.webp`, `AnomalyScan.webp` (service thumbs in `ServicesSection`). |
| 17 | **PARTIAL** | OG + Twitter tags render on every page; service pages get generated `opengraph-image`. `og:url` is absent everywhere; guide OG images are the webp cover (no 1200×630 card). |
| 18 | **PASS** | Visible breadcrumbs on every inner page (verified on services, guides, doctors, contact, faq, about, category pages). |
| 19 | **FAIL** | Lighthouse mobile lab (localhost prod build): LCP **4.6 s** home, **4.3 s** guide, **4.5 s** service, **3.7 s** doctor — all fail <2.5 s. TBT 90–280 ms, CLS 0, SEO 100, a11y 100. Note: lab figures on localhost overstate vs a CDN deploy, but the LCP element (hero image) should be re-verified post-deploy. |
| 20 | **PASS** | Crawled all internal links across 47 fetched pages: 44 unique internal URLs, all 200, zero pointing at redirects. |

### Schema
| # | Result | Evidence |
|---|---|---|
| 21 | **PARTIAL** | Stable `@id`s exist (`/#clinic`, `/doctors/<slug>#person`), but every `JsonLd` emits a **separate** `<script>` with its own `@context` — no connected `@graph`, no `WebSite` node, no `WebPage` node on any page. Home alone ships 16 ld+json scripts. |
| 22 | **FAIL** | Guides emit `Article` (never `MedicalWebPage`) because `reviewedBy` is unset on all 10 guides (`data/guides.ts` comment admits this). In the `Article` fallback `author` = clinic and `about` = clinic (`app/guides/[slug]/page.tsx:146-156`) — `about` should be the medical condition/procedure, not the clinic. No `datePublished`/`lastReviewed` in the MedicalWebPage branch either. |
| 23 | **PARTIAL** | `Person` schema on doctor pages has name, url, image, jobTitle, worksFor, alumniOf, hasCredential, knowsAbout (`lib/schema.ts:120`). Missing: registration `identifier` (all `null`), `sameAs`, `medicalSpecialty`, memberships, languages — all fields exist but are empty in `data/doctors.ts`. |
| 24 | **PARTIAL** | Every service page gets `MedicalProcedure` — including non-procedures (`genetic-counselling`, `twin-specialised-clinic`, `recurrent-miscarriages-clinic`, `fetal-postmortem`), which are clinics/services not procedures. No `MedicalCondition` pages exist. |
| 25 | **PASS** | `BreadcrumbList` on every inner page; `FAQPage` on home, /faq, every guide and every service that has FAQs. |
| 26 | **PASS** (minor notes) | All ld+json parses as valid JSON; FAQPage text is generated from the same data that renders the visible FAQs (verified); no duplicates or hardcoded schema. Issue is coverage/typing, not validity. |

### YMYL and E-E-A-T
| # | Result | Evidence |
|---|---|---|
| 27 | **PARTIAL** | 2 of 3 doctors have profile pages (`hasProfile`); Dr Nivethitha has none (`data/doctors.ts:156`) yet appears on /doctors, llms.txt and in MedicalClinic `employee` schema. Profiles show photo + qualifications + trained-at, but registration number, experience year, memberships, languages, detailed quals are all `null`/`[]`, and **no doctor page lists the articles they wrote or reviewed**. |
| 28 | **FAIL** | Every guide renders only `Written by the FMC Trichy clinical team` — unlinked, unnamed (`app/guides/[slug]/page.tsx:263-265`). The `Medically reviewed by <doctor>` byline + card exist in code but never render because `reviewedBy` is unset on all 10 guides despite `reviewStatus: "reviewed"`. |
| 29 | **PARTIAL** | Footer links About, Contact, FAQs, Privacy, Terms (`site-footer.tsx`). **Editorial Policy is not linked anywhere in the footer** and is `noindex` + renders "This is a draft pending legal and client review." No dedicated Medical Disclaimer page exists (only the disclaimer bar + per-guide note). All four legal pages (`privacy`, `terms`, `editorial-policy`, `accessibility`) carry `draftPendingReview: true` — noindex, draft copy live on public URLs. |
| 30 | **PARTIAL** | Only 3/10 guides have a `sources` list (anomaly 5, twin 2, nipt 2 — ISUOG, SMFM, NHS). 7 guides cite nothing. Zero authoritative citations anywhere else. |
| 31 | **PASS** | No "100% cure/guaranteed/painless/best doctor" claims — every `guarantee` occurrence is a disclaimer ("cannot guarantee"). Superlative "first in Tamil Nadu" claims are gated behind `claimIsLive` and do not render. PCPNDT disclaimers on every service page + footer. |
| 32 | **PASS** | Condition-style guides include "When should you see a specialist" / "When to get urgent care" sections. |
| 33 | **PARTIAL** | Strong Trichy/Tamil Nadu local context and specialist voice. But: zero INR costs anywhere (the NIPT guide has a "why prices differ" section with no figures), no insurance mention, no hospital names, no first-person clinical anecdotes ("In my practice…"). |
| 34 | **PASS** | Name, address, phones identical in footer, contact page, llms.txt and `MedicalClinic` schema. Schema hours (Mon–Fri 09:00–21:00) match the site copy ("Saturday/Sunday: please call to confirm"). |

### Pillar and supporting content
| # | Result | Evidence |
|---|---|---|
| 35 | **FAIL** | No pillar pages exist. 10 flat guides across 5 used categories; `/guides/category/*` are listing pages, not pillar content. Nearest cluster mapping in §5. |
| 36 | **FAIL** | No pillar → supporting in-body links exist. |
| 37 | **PARTIAL** | Sibling cross-links in body copy: twin 5, anomaly/fetal-echo/growth/nipt 4, high-risk 3, pcos 3, nt-scan 2, **fertility-testing 1, recurrent-miscarriage 1** — below the "≥2 siblings + pillar" rule. |
| 38 | **PARTIAL** | Guide→service: `relatedService` CTA card on 7/10 guides + a service InfoCard; guides also carry 7–8 service links but those are header/footer nav, not body copy. Guide→doctor: **zero links on all 10 guides**. |
| 39 | **PASS** | Anchor text descriptive ("NT scan in pregnancy", "Visit the Twin Specialised Clinic"); no "click here"/"read more" anchors found. |
| 40 | **PASS** | All 42 sitemap URLs are linked from crawled pages; guides reachable via /guides, category pages, related-guides and service pages. Nothing deeper than 3 clicks. |

### FAQs
| # | Result | Evidence |
|---|---|---|
| 41 | **PARTIAL** | All 10 guides have exactly 8 unique FAQs. Service pages: only 3/13 meet the 4–8 range (viability 4, oscar 4, anomaly 4); the rest have 2–3. `/faq` has 10 global FAQs. |
| 42 | **PARTIAL** | Guide FAQ answer word counts: pcos 47–59 ✓, high-risk 41–54 ✓, recurrent 54–64 ✓, fertility 41–61 ✓, twin 54–62 ✓, fetal-echo 47–55 ✓, nt-scan 31–59 ~; **anomaly 27–42, growth 18–34, nipt 10–32** — below the 40–60 target. |
| 43 | **PASS** | FAQ answers are in raw HTML and generated from the same arrays that feed `faqSchema` — word-for-word match guaranteed by construction. |

### Entities, keywords and semantic writing
| # | Result | Evidence |
|---|---|---|
| 44 | See §4 | Per-page entity coverage listed in the page table; gaps noted per page. |
| 45 | **PARTIAL** | `quickAnswer` boxes give a direct quotable definition on 9/10 guides — **missing on `nipt-in-pregnancy...`**. First paragraphs on fetal-echo, growth-scan, nipt open with scene-setting rather than a definition; the entity is defined by the quick-answer card instead. |
| 46 | **PARTIAL** | Most H2s are literal patient questions naming the entity — excellent for extraction. Exceptions: `Final Thoughts` (8 guides), `Medical Disclaimer` as an H2 (anomaly guide), and Title-Case H2s on fetal-echo (9) and nipt (16). |
| 47 | **PASS** | "PCOS (polycystic ovary syndrome)", "NT scan … nuchal translucency", "NIPT is a blood test…screen for chromosome conditions" — medical + plain terms paired on first mention throughout. |
| 48 | **PASS** | Primary keyword present in title/H1/URL/first-100/meta on guides and services; no stuffing detected. |
| 49 | **PARTIAL** | Potential cannibalisation pairs to monitor: `/services/anomaly-scan` vs `/guides/anomaly-scan-tiffa-scan-pregnancy`; `/services/nipt` vs the NIPT guide; `/services/growth-scan-doppler` vs the growth guide; `/services/downs-screening-oscar` vs the NT-scan guide; `/services/twin-specialised-clinic` vs the twin guide. Intents differ (book vs learn) but titles overlap heavily. |
| 50 | **PARTIAL** | Quotable specifics: week windows (e.g. "18 to 22 weeks"), comparison tables exist in guide blocks. Missing: any INR cost figures, success-rate stats with sources, timelines with numbers for most services. |

### AI writing and agent fingerprints
| # | Result | Evidence |
|---|---|---|
| 51 | **PARTIAL** | Clean of the major vocabulary tells (no delve/tapestry/landscape/embark/robust/pivotal…). Present: `Final Thoughts` heading in 8/10 guides, Title-Case headings on 2 guides (25 total H2s), "Here's what helps / Here's what that means" ×2, "Comprehensive Guide" pattern in the anomaly title ("Complete Guide to the 20-Week / TIFFA Scan"). |
| 52 | **PARTIAL** | "That said" once (recurrent-miscarriage). No heavy em-dash usage (enforced by `lib/content-rules.ts`). Otherwise clean. |
| 53 | **PARTIAL** | Uniform article skeleton on all 10 guides (quick answer → H2 Q&A → key takeaways → common questions → sources → identical disclaimer box). Exactly 8 FAQs everywhere looks templated. Intros do vary in voice; Indian context present. |
| 54 | **PARTIAL** | No lorem/JohnDoe/example.com. `console.log` exists but dev-gated (`app/actions/appointment.ts:71`, `lib/booking-pipeline.ts:119`). TODO comments in code only. **QR link base still `https://drmalathi.vercel.app`** (`lib/qr-svg.ts:12`, `scripts/generate-qr.mjs:17`). Draft markers render publicly on 4 noindex legal pages. |

### Extra checks
| # | Result | Evidence |
|---|---|---|
| 55 | **PASS** | `<html lang="en-IN">`; favicon.ico + icon.png + `/manifest.webmanifest` all 200; no http:// resources in HTML. |
| 56 | **PARTIAL** | Single-location site — no doorway pages; Trichy/Thillai Nagar named naturally throughout. Cannot verify GBP NAP match from the repo (client item). |
| 57 | **FAIL** | No `sameAs` to Wikipedia/Wikidata/MeSH anywhere; `site.sameAs` and `areaServed` empty; doctor `sameAs` none. |
| 58 | **PARTIAL** | "vs" coverage exists (NT vs NIPT, NIPT vs double marker, fetal echo vs anomaly scan, growth scan vs Doppler, low AMH vs PCOS). Cost questions addressed rhetorically, never numerically. PAA-style coverage is strong via Q-format H2s. |
| 59 | **PASS** | Copy reads at ~grade 7–9: short sentences, "you", plain terms. No obviously outdated medical fact spotted; week windows flagged in-code as draft pending medical review (`SHOW_DRAFT_WEEK_WINDOWS`). |
| 60 | **FAIL** | No review/rating schema (good) — BUT: two patient quotes (`"explained every single detail" — Manisha`, `"they saved my twins" — Deva`) are **hardcoded** in `components/home/why-choose-us.tsx:16,22` and render unconditionally, bypassing the `consentOnFile` gate that keeps them out of the testimonials section. |
| 61 | **PASS** | PCPNDT disclaimers on service pages, footer, llms.txt; no cure/guarantee/sex-selection content. |
| 62 | **PASS** | External source links are plain `rel="noopener"` links; no sponsored/affiliate links exist. |
| 63 | See §7 | Top-5 AI-query quotability analysis below. |

---

## 3. Issue list (P0 → P3)

### P0 — critical
| ID | Issue | Affected | Evidence | Fix |
|---|---|---|---|---|
| ISS-001 | **Whole-site indexing silently depends on build env.** If this app is ever deployed off Vercel or `VERCEL_ENV` is absent, every page ships `noindex,nofollow` and robots.txt becomes `Disallow: /` — with no error anywhere. | Entire site | `app/layout.tsx:39-44`, `app/robots.ts:4-5`, `proxy.ts:10-20`. Verified: default local `next start` serves `Disallow: /` + noindex meta on all pages. | Add an explicit production check in CI/deploy: assert `curl /robots.txt` shows `Allow: /` and a page has `index,follow` on the real host; document `INDEXABLE=1` requirement in LAUNCH-CHECKLIST for non-Vercel hosts. |
| ISS-002 | **Consent-pending patient quotes render in production.** The testimonials section correctly gates `consentOnFile: null` quotes — but two of those same quotes are hardcoded into `WhyChooseUs` proof cards and render unconditionally. | Home page | `components/home/why-choose-us.tsx:16,22` hardcodes `"explained every single detail" — Manisha` and `"they saved my twins" — Deva`; `data/testimonials.ts` marks both `consentOnFile: null`. Verified rendering in production-mode HTML. | Route the proof-card quotes through `testimonials`/`claimIsLive`-style gating, or remove them until written consent lands. |

### P1 — high
| ID | Issue | Affected | Evidence | Fix |
|---|---|---|---|---|
| ISS-101 | **No named author or reviewer is ever rendered.** All 10 guides say only "Written by the FMC Trichy clinical team" (unlinked). `reviewedBy` is `undefined` on every guide so the MedicalWebPage + reviewer-card code path is dead. | All 10 guides | `data/guides.ts:4-6` ("no named reviewer, so no badge renders"); `app/guides/[slug]/page.tsx:104-107,263`. | Set `reviewedBy` to a real doctor slug per guide once the doctors confirm which articles each reviewed. Then bylines, reviewer card and MedicalWebPage schema activate automatically. |
| ISS-102 | **Doctor pages are missing the fields YMYL needs most:** registration number, memberships, languages, experience year, detailed qualifications — all exist in the data model but are `null`/`[]`. No doctor page lists their articles. | `/doctors/*` | `data/doctors.ts:92-99,131-138` (all null/empty); doctor page has no articles section (`app/doctors/[slug]/page.tsx`). | Data fields → client (P3 list). Code: add an "Articles by Dr X" section on doctor pages (query `reviewedBy`/`relatedService`). |
| ISS-103 | **No pillar/cluster architecture.** 10 flat `/guides/[slug]` articles; categories are thin listing pages. No pillar covers a topic end-to-end with links to its supporting set. | Guides | Route list: only `guides/[slug]`, `guides/category/[slug]`, `guides/page/[n]`. | Either promote category pages into real pillar content (intro + sections + links to all cluster articles) or add pillar guides. See §5 cluster table for the gaps. |
| ISS-104 | **Schema is fragmented and mis-typed on articles.** Separate scripts instead of one `@graph`; no `WebSite` node; `Article` used for all guides; `about` = the clinic (should be the condition/procedure); `author` = the clinic (should be a Person). | All pages | `lib/schema.ts`, `app/guides/[slug]/page.tsx:134-156`; parsed ld+json output. | Build a single `@graph` per page: `MedicalClinic#clinic` + `WebSite#website` + `WebPage`/`MedicalWebPage` + `BreadcrumbList` + `FAQPage`, linked by `@id`. Set `about` to a `MedicalCondition`/`MedicalProcedure` node, `author`/`reviewedBy` to the doctor Person. |
| ISS-105 | **Trust pages exist but are noindex, draft-marked and footer-unlinked.** Editorial Policy is `noindex` + renders "draft pending legal and client review" copy; Privacy/Terms/Accessibility same state; no Medical Disclaimer page at all. | Legal pages | `data/legal.ts` all `draftPendingReview: true`; footer links only Privacy + Terms (`site-footer.tsx:225-226`). | Finish counsel review, flip `draftPendingReview`, add Editorial Policy + Medical Disclaimer (a dedicated page or a clearly-scoped section) to the footer. |
| ISS-106 | **Mobile LCP 3.7–4.6 s in Lighthouse lab** on home, guide, service, doctor pages (target <2.5 s). | Key templates | `lh-*.json` audits; LCP element = hero image; ~23 KB unused JS; perf 81–84. | Re-audit on the real CDN host (localhost inflates); then trim hero image weight (already `priority`+`fetchPriority=high`), check `sizes` accuracy, preload, and cut unused JS on the critical path. |
| ISS-107 | **QR booking links point at the old preview domain.** Printed QR codes resolve `drmalathi.vercel.app/q/*`. | Printed material → `/q/*` | `lib/qr-svg.ts:12`, `scripts/generate-qr.mjs:17`. | Switch base to `https://fmctrichy.com` before launch and regenerate QR assets (the `/q/[location]` route itself is correct: 307 → `/book?src=`). |
| ISS-108 | **Live domain is still the old LiteSpeed site** with no robots.txt (404), and `http://`/`https://`/apex/`www` serving divergent content. | fmctrichy.com production | curl: apex https 200 (40 KB old template), www 200 (534 KB different page), robots.txt LiteSpeed 404. | Deployment task: cut over DNS to the Next.js app, 301 http→https and www→apex, then verify robots.txt + sitemap serve on the canonical host. |

### P2 — medium
| ID | Issue | Affected | Evidence | Fix |
|---|---|---|---|---|
| ISS-201 | Titles mostly under 50 chars; several descriptions outside 140–160. | Sitewide | Title/desc table above: e.g. `Gallery` 20 chars, `NIPT in Pregnancy` 30; desc `accessibility` 99, `editorial-policy` 119, `twin-pregnancy` guide 177, `pcos` 165. | Expand titles toward `Primary keyword — qualifier | FMC Trichy`; re-range the ~8 out-of-bounds descriptions in `seoDescription`/`seo.description`. |
| ISS-202 | Service pages carry only 2–3 FAQs; target is 4–8 unique patient questions. | 10 of 13 services | `data/services.ts` faq counts: fetal-echo 2, fetal-neurosonogram 2, second-opinion 2, first-trimester 3, growth 3, nipt 3, genetic-counselling 3, fetal-postmortem 3, recurrent-miscarriages 3, twin-clinic 3. | Write 1–4 more unique FAQs per service (real front-desk questions; keep 40–60-word direct answers). |
| ISS-203 | Guide FAQ answers below the 40–60-word target on three guides; NIPT guide lacks `quickAnswer`. | anomaly (27–42w), growth (18–34w), nipt (10–32w) | Word-count audit of `data/guides-blogs.ts`. | Expand thin answers to a direct 40–60-word answer; add `quickAnswer` to the NIPT guide. |
| ISS-204 | 7 of 10 guides cite zero sources. | pcos, high-risk, recurrent, fertility, fetal-echo, growth, nt-scan | `sources:` present only on anomaly (5), twin (2), nipt (2). | Add a Sources section per guide citing ISUOG/SMFM/RCOG/FMF/WHO/guideline pages — verify each link resolves. |
| ISS-205 | 3 content images ship `alt=""` on the home page service cards. | Home | `<img alt="">` on `viabilityscan.webp`, `NIPT.webp`, `AnomalyScan.webp`. | Descriptive alts (e.g. "Ultrasound image shown during a first trimester scan"). |
| ISS-206 | `og:url` absent on every page; guide OG images are content webps, not 1200×630 cards. | Sitewide | Meta audit of all fetched pages. | Emit `openGraph.url` = canonical per page; consider a generated `opengraph-image` for guides. |
| ISS-207 | Gestational week windows render in production while still marked draft-for-review. | All service pages + home WeekRail | `data/services.ts:75` `SHOW_DRAFT_WEEK_WINDOWS = true` — chip copy is explicitly "must be confirmed by the medical team". | Medical team signs off (or flips the flag off) before launch. |
| ISS-208 | Zero INR cost / insurance / quoted statistics anywhere — the highest-value AEO content for Indian medical queries is missing. | Guides + services | grep for ₹/INR/Rs across rendered pages = nothing; NIPT guide has "why prices differ" with no numbers. | If client permits, add indicative INR ranges ("typically ₹X–₹Y in Trichy") with disclaimers — biggest single GEO win available. |
| ISS-209 | `MedicalProcedure` applied to clinic-type services. | genetic-counselling, twin-specialised-clinic, recurrent-miscarriages-clinic, fetal-postmortem | `lib/schema.ts:178-191` single type for all services. | Type clinics as `MedicalTherapy`/`Service` (or `MedicalClinic` sub-service) instead of `MedicalProcedure`. |
| ISS-210 | Thin category pages — a heading, one-line description and a card grid. | `/guides/category/*` ×5 | `app/guides/category/[slug]/page.tsx`. | Add 200–400 words of pillar-style copy per category + links to relevant services. |
| ISS-211 | "Fertility Centre" in the brand name but no fertility service pages exist — fertility guides have nothing to convert on (`pcos-and-pregnancy`, `fertility-testing-for-couples` have no `relatedService`). | Brand/IA | `data/services.ts` — 13 services, none fertility; guides exist for the topic. | Confirm with client whether fertility consults are offered; if yes add a service page, if no, reviews of brand naming. |

### P3 — low / needs client input
| ID | Issue | Evidence |
|---|---|---|
| ISS-301 | Medical council registration numbers for all 3 doctors (`data/doctors.ts` — `registration: null` ×3). Blocks Person `identifier` + visible reg line. | client input |
| ISS-302 | PCPNDT registration no., TN Clinical Establishments Act no., ART registration — all typed-null (`data/site.ts:46-50`). | client input |
| ISS-303 | Clinic `geo` coordinates, `hasMap` URL, `areaServed` towns, `sameAs` profiles, social URLs, exact `foundingDate`, DPDP grievance officer — all null/empty in `data/site.ts`. | client input |
| ISS-304 | Dr Nivethitha: real role line, qualifications detail, and whether she gets a profile page (`hasProfile: false`, `roleIsPlaceholder: true`). | client input |
| ISS-305 | Saturday/Sunday hours (site says "please call to confirm"; schema lists Mon–Fri only). | client input |
| ISS-306 | WhatsApp lead number +91 74489 39808 unconfirmed (prebuild gate); international number confirm. | client input |
| ISS-307 | 3 testimonials awaiting written consent; 3 comparative "first" claims awaiting substantiation; 2 course durations unconfirmed; 3 images on placeholder licence (`hands-baby-feet`, `baby-overhead`, `pregnancy-test-stork` — currently rendering). | client input |
| ISS-308 | Google Business Profile name/address/phone — verify it matches the site NAP exactly. | client input |

---

## 4. Page-by-page table

| URL | Type | Cluster | Primary keyword | Byline | Dates | FAQ | Schema | Links out (body) | AI-likeness |
|---|---|---|---|---|---|---|---|---|---|
| / | home | — | fetal medicine specialists Trichy | n/a | n/a | 10 | MedicalClinic+FAQ | services, guides, doctors | 20 |
| /about | trust | — | fetal medicine centre Trichy | n/a | n/a | — | Breadcrumb | fellowship, cme, doctors | 20 |
| /services | index | — | scans and services Trichy | n/a | n/a | — | Breadcrumb | all 13 services | 15 |
| /services/viability-scan | service | scans | viability scan Trichy | — | — | 4 | MedProc+BC+FAQ | doctors | 20 |
| /services/downs-screening-oscar | service | screening | OSCAR screening Trichy | — | — | 4 | MedProc+BC+FAQ | doctors | 20 |
| /services/first-trimester-anomaly-scan | service | scans | first trimester anomaly scan | — | — | 3 | MedProc+BC+FAQ | doctors | 20 |
| /services/anomaly-scan | service | scans | anomaly scan Trichy | — | — | 4 | MedProc+BC+FAQ | doctors, guide | 20 |
| /services/growth-scan-doppler | service | scans | growth scan doppler Trichy | — | — | 3 | MedProc+BC+FAQ | doctors, guide | 20 |
| /services/nipt | service | screening | NIPT Trichy | — | — | 3 | MedProc+BC+FAQ | doctors, guide | 20 |
| /services/fetal-echo | service | diagnostics | fetal echo Trichy | — | — | 2 | MedProc+BC+FAQ | doctors | 20 |
| /services/fetal-neurosonogram | service | diagnostics | fetal neurosonogram Trichy | — | — | 2 | MedProc+BC+FAQ | doctors | 20 |
| /services/second-opinion-scan | service | diagnostics | second opinion scan Trichy | — | — | 2 | MedProc+BC+FAQ | doctors | 20 |
| /services/genetic-counselling | service | clinics | genetic counselling Trichy | — | — | 3 | MedProc+BC+FAQ | doctors | 20 |
| /services/fetal-postmortem | service | clinics | fetal postmortem Trichy | — | — | 3 | MedProc+BC+FAQ | doctors | 20 |
| /services/recurrent-miscarriages-clinic | service | clinics | recurrent miscarriage clinic Trichy | — | — | 3 | MedProc+BC+FAQ | doctors, guide | 20 |
| /services/twin-specialised-clinic | service | clinics | twin pregnancy clinic Trichy | — | — | 3 | MedProc+BC+FAQ | doctors, guide | 20 |
| /doctors | index | — | fetal medicine doctors Trichy | n/a | n/a | — | Breadcrumb+Person | doctor profiles | 15 |
| /doctors/dr-malathi-g-prasad | doctor | — | Dr Malathi G Prasad | n/a | — | — | Person+BC | services | 15 |
| /doctors/dr-revathy-chandrasekharan | doctor | — | Dr Revathy Chandrasekharan | n/a | — | — | Person+BC | services | 15 |
| /guides | index | — | patient guides | n/a | n/a | — | Breadcrumb | all 10 guides | 15 |
| /guides/pcos-and-pregnancy | guide | fertility | PCOS and pregnancy | generic | ✓ | 8 | Article+BC+FAQ | 3 guides | 25 |
| /guides/high-risk-pregnancy-fetal-medicine-specialist | guide | high-risk | high-risk pregnancy specialist | generic | ✓ | 8 | Article+BC+FAQ | 3 guides | 20 |
| /guides/recurrent-miscarriage-causes-tests-treatment | guide | pregnancy-loss | recurrent miscarriage causes | generic | ✓ | 8 | Article+BC+FAQ | 1 guide | 15 |
| /guides/fertility-testing-for-couples | guide | fertility | fertility testing couples | generic | ✓ | 8 | Article+BC+FAQ | 1 guide | 30 |
| /guides/twin-pregnancy-scans-risks-monitoring | guide | twins | twin pregnancy scans | generic | ✓ | 8 | Article+BC+FAQ | 4 guides | 20 |
| /guides/anomaly-scan-tiffa-scan-pregnancy | guide | scans | anomaly scan TIFFA | generic | ✓ | 8 | Article+BC+FAQ | 3 guides + 7 service | 35 |
| /guides/fetal-echocardiography-pregnancy | guide | scans | fetal echocardiography | generic | ✓ | 8 | Article+BC+FAQ | 3 guides | 45 |
| /guides/growth-scan-doppler-pregnancy-fetal-growth-restriction | guide | scans | growth scan doppler FGR | generic | ✓ | 8 | Article+BC+FAQ | 3 guides | 30 |
| /guides/nipt-in-pregnancy-test-accuracy-high-risk-result | guide | screening | NIPT in pregnancy | generic | ✓ | 8 | Article+BC+FAQ | 3 guides | 50 |
| /guides/nt-scan-pregnancy-timing-normal-range-down-syndrome | guide | screening | NT scan pregnancy | generic | ✓ | 8 | Article+BC+FAQ | 2 guides | 25 |
| /guides/category/* (5) | index | — | category name | n/a | n/a | — | Breadcrumb | cluster guides | 15 |
| /contact | trust | — | contact FMC Trichy | n/a | n/a | — | Breadcrumb | — | 15 |
| /faq | trust | — | fetal medicine FAQ | n/a | n/a | 10 | FAQPage+BC | — | 15 |
| /international-patients | trust | — | international patients | n/a | n/a | — | Breadcrumb | — | 20 |
| /fellowship | course | — | fetal medicine fellowship | n/a | n/a | — | Breadcrumb+Course×3 | — | 20 |
| /cme-activities | info | — | fetal medicine CME | n/a | n/a | — | Breadcrumb | — | 20 |
| /gallery | info | — | centre photos | n/a | n/a | — | Breadcrumb | — | 10 |
| /privacy, /terms, /editorial-policy, /accessibility | legal | — | — | n/a | n/a | — | none | — | noindex+draft |
| /book | utility | — | — | n/a | n/a | — | none | — | noindex ✓ |

**Worst sentences/patterns per flagged page** (AI-likeness basis):
- nipt guide (50): Title-Case H2s ("What Is Positive Predictive Value?", "Does NIPT Detect Every Genetic Condition?"), no quick-answer card, 10-word FAQ answers, longest/most uniform Q&A cadence of the set.
- fetal-echo guide (45): "Hearing the words 'fetal echo' after an ultrasound can leave parents with a lot of questions. Why is another scan needed? Did the earlier scan show something abnormal? Is there a problem with the baby?" — triple rhetorical opener; 9 Title-Case H2s.
- anomaly guide (35): "It is usually carried out in the second trimester, when the baby has developed enough for many important anatomical structures to be examined in detail." — passive encyclopedic register; `Medical Disclaimer` as an H2.
- fertility-testing (30): "If pregnancy has not happened despite trying, the next step is not always another pregnancy test or another month of waiting." — repeated "not X but Y" constructions across the page.
- All guides: `Final Thoughts` closing H2 (8/10), identical skeleton (quick answer → H2s → key takeaways → common questions → sources → disclaimer).

---

## 5. Cluster table (no real pillars exist — categories are the closest analogue)

| Category (pillar candidate) | Guides in cluster | Guide→cluster links | Guide→service | Guide→doctor | Missing to reach 5 supporting |
|---|---|---|---|---|---|
| pregnancy-scans | anomaly-scan-tiffa, fetal-echocardiography, growth-scan-doppler (3) | 3–4 each | via relatedService CTA | **0** | +2 (e.g. "3D/4D scan", "viability/dating scan") |
| screening-and-tests | nipt, nt-scan (2) | 2–4 | CTA on both | **0** | +3 (e.g. "double marker", "CVS vs amniocentesis", "OSCAR") |
| twins-and-high-risk | high-risk-pregnancy, twin-pregnancy (2) | 3–5 | CTA on twin only | **0** | +3 (e.g. "TTTS", "cervical length", "diabetes in pregnancy") |
| pregnancy-loss | recurrent-miscarriage (1) | 1 | CTA ✓ | **0** | +4 (e.g. "after a miscarriage", "fetal postmortem explained", "genetic testing after loss", "next pregnancy") |
| fertility-and-planning | pcos, fertility-testing (2) | 1–3 | **none** (no fertility service exists) | **0** | +3 + a fertility service page to anchor the cluster |
| pregnancy-health | 0 — category defined but unused | — | — | — | +5, or delete the category |

Missing everywhere: pillar↔supporting in-body links, and guide→doctor links.

---

## 6. Needs from client (all P3 unless noted)

1. Medical council registration numbers for all three doctors — unblocks `Person.identifier`, the visible reg line, and NMC compliance signalling.
2. PCPNDT registration number, TN Clinical Establishments Act number, ART registration (if IVF/IUI offered).
3. Confirm whether fertility consultations are a real service — brand says "Fertility Centre" but no service page exists (ISS-211).
4. Doctor profile data: memberships, languages, experience start year, detailed qualifications, Dr Nivethitha's role/photo/profile.
5. Confirm WhatsApp lead number +91 74489 39808 and the international line (prebuild gate).
6. Saturday/Sunday hours (schema currently Mon–Fri only).
7. Written consent for the 3 testimonials — also unblocks ISS-002 fix.
8. Evidence for the 3 "first in region" claims; licensed replacements for 3 placeholder-licence images.
9. Google Business Profile NAP, clinic geo-coordinates, hasMap URL, areaServed list, social/sameAs URLs, exact founding date, DPDP grievance officer.
10. Counsel sign-off on privacy / terms / editorial-policy / accessibility copy (currently draft + noindex).
11. Policy on publishing indicative INR price ranges — biggest untapped AEO win (ISS-208).

---

## 7. GEO readiness — the 5 queries that matter most

1. **"anomaly scan / TIFFA scan in Trichy"** — AI engines need: a quotable definition (present in quickAnswer), a named specialist (missing — generic byline), a cost anchor (missing), a service page to cite alongside the guide (present). Gap: byline + INR figure.
2. **"NIPT test cost / accuracy Trichy"** — the guide covers accuracy, PPV and "why prices differ" but gives no number and no named expert. Most-asked question on the topic stays unanswered.
3. **"fetal medicine specialist in Trichy"** — the doctor pages exist but carry no registration number, no memberships, no article history — weak entity for an AI to vouch for.
4. **"twin pregnancy scans / twin specialist Trichy"** — strong guide + clinic service page; lacks the specialist byline and any cost/schedule specifics.
5. **"recurrent miscarriage treatment Trichy"** — good guide + clinic page; only 1 internal link in, no sources, no named reviewer — the page most in need of E-E-A-T support.

Common requirement across all five: a named, credentialed doctor entity (Person schema + byline + registration number) and at least one quotable numeric fact per page. The content quality is already good enough to be quoted; the attribution layer is what's missing.

---

*Generated for the fix step — see `audit.json` for the machine-readable issue list. No code was changed during this audit.*
