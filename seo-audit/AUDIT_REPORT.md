# SEO / AEO / GEO Audit — Trichy Fetal Medicine and Fertility Centre

**Site audited:** Next.js 16.3.7 (Turbopack), `E:\Automize\ivf`, canonical domain `https://fmctrichy.com`
**Method:** `INDEXABLE=1` production build served with `next start` on :3101; all 93 sitemap URLs + 9 extra paths fetched raw (no JS) with Googlebot, GPTBot, ClaudeBot, PerplexityBot (`seo-audit/crawl.mjs`, raw HTML in `seo-audit/html/`); source-level review of all templates and data files; live-domain spot checks on fmctrichy.com.
**Date:** 2026-10-24 (re-audit after PR #4 — "50 support guides and complete pillar metadata")
**Deployment status:** the new Next.js build is **live on fmctrichy.com** (verified: `_next/static` assets, new robots.txt, 93-URL sitemap, www→apex and http→https redirects all resolve on the public domain).

**Delta vs previous audit (score 66):** the pillar/cluster architecture is now complete (10 pillars × 5 supporting guides = 60 guides, all interlinked), every guide ships MedicalWebPage schema in a connected `@graph`, all 60 guides carry a Sources list with real citations, all 60 have Quick Answer cards, testimonial quotes are consent-gated, QR codes point at the production domain, and www correctly 308s to apex. The remaining gaps concentrate in **E-E-A-T** (still no named doctor on any of 60 articles, all doctor credential fields empty), **FAQ answer length** (274/362 answers outside the 40–60-word band), **metadata length ranges** (58/93 titles out of range), **in-body links to services and doctors** (zero across all 60 guides), and **AI-template fingerprints** in the new 50-guide batch (Title Case headings on 40 guides, "Final Thoughts" section on 50).

---

## 1. Scores

| Area | Score /100 | Δ vs prior |
|---|---|---|
| Crawling & AI-bot access | 92 | +4 |
| Technical (titles, meta, CWV, canonicals) | 74 | +4 |
| Schema | 74 | +18 |
| E-E-A-T | 48 | +6 |
| Pillar linking | 78 | +33 |
| FAQs | 58 | −6 |
| Entities & semantics | 66 | +8 |
| Keywords | 70 | +4 |
| Content humanness | 62 | −16 |
| AEO/GEO readiness | 74 | +6 |
| **Overall** | **70** | **+4** |

Architecture and markup are now genuinely strong. The score is held back by three things: the invisible human expert (every article is "reviewed" by nobody in particular), the templated feel of the new batch, and quotable specifics (no INR costs, only 5 comparison tables in 60 articles).

---

## 2. Checklist (PASS / FAIL / PARTIAL + evidence)

### Crawling and indexing
| # | Result | Evidence |
|---|---|---|
| 1 | **PASS** | `app/robots.ts` → `Allow: /`, `Disallow: /api/`, `Sitemap: https://fmctrichy.com/sitemap.xml`. Verified on local prod build **and** live domain. |
| 2 | **PASS** | All 11 bots explicitly named (`app/robots.ts:8-22`): GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot. 200s for every UA tested. |
| 3 | **PASS** | `proxy.ts` gates by host only. No 403/429/challenge for any bot UA; live domain verified. |
| 4 | **FAIL** | Sitemap (93 URLs) lists `/privacy` and `/terms`, both of which render `<meta name="robots" content="noindex">` (verified in raw HTML). Noindex URLs must not be in the sitemap. lastmod dates are real per-page/per-guide dates, not build date. Everything else in the sitemap returns 200 and is indexable. |
| 5 | **PASS** | `/llms.txt` summarises clinic, doctors, services and lists all 60 guides with review dates; `/llms-full.txt` (586 KB) carries full text — 375 internal guide links. |
| 6 | **PARTIAL** | Whole-site indexability still hinges on build-time `VERCEL_ENV=production`/`INDEXABLE=1` (`app/layout.tsx:39-44`, `app/robots.ts:4-5`). Verified correct **on the live deploy** today, but any non-Vercel/misconfigured redeploy silently ships `noindex` + `Disallow: /`. Intentional noindex on `/book` and the 5 draft legal pages is correct. |
| 7 | **PASS** | `metadataBase` set; every crawled page emits an absolute self-referencing canonical on fmctrichy.com. `/book` lacks canonical but is `noindex,nofollow` — acceptable. |
| 8 | **PASS** | Live verified: `http://` → 301 https, `www.` → 308 apex, uppercase paths 308 to lowercase. One host only. |
| 9 | **PASS** | `/nonexistent-page-xyz-404` → real 404; `/guides/page/1` → 404; unused `/guides/category/pregnancy-health` → 404. |

### Every word visible to Google and AI bots
| # | Result | Evidence |
|---|---|---|
| 10 | **PASS** | Raw HTML contains full copy, headings, byline, dates, breadcrumbs, internal links and JSON-LD on every page type (93 pages verified). |
| 11 | **PASS** | FAQ accordion answers are in the DOM server-side on every page (verified in raw HTML). Search/filter widgets SSR their content. |
| 12 | **PASS** | All navigation is real `<a href>`/next/link; `onClick` only on menu/lightbox controls. |

### On-page
| # | Result | Evidence |
|---|---|---|
| 13 | **PARTIAL** | Titles unique everywhere (0 duplicates) but **58/93 outside 50–60 chars** — mostly under (e.g. `NIPT in Trichy` 27, `Twin Pregnancy` 27, `Anomaly Scan in Trichy` 35; a few over, e.g. `Anomaly Scan vs Normal Pregnancy Ultrasound…` 73). Meta descriptions: **11/93 outside 140–160** (e.g. `/services/recurrent-miscarriages-clinic` 139, `twin-pregnancy` guide 177, category pages 120–122). Detail in `seo-audit/analysis.json`. |
| 14 | **PASS** | Exactly one `<h1>` on all 93 pages; clean h2→h3. |
| 15 | **PARTIAL** | Clean descriptive URLs (`/guides/tiffa-scan-pregnancy-when-to-get`), but flat — `/guides/<slug>` for pillars and supports alike; category URLs carry only thin listing pages, not pillar content in the URL hierarchy. |
| 16 | **PASS** | All images on all crawled pages have non-empty `alt` + `width`/`height` (or fill+sizes via next/image). Zero issues found. |
| 17 | **PARTIAL** | OG+Twitter tags on every page; `og:url` now present on guides. **Doctor pages lack `og:image`** (`summary_large_image` card with no image — dr-malathi, dr-revathy). Guide OG images are the raw webp covers, no 1200×630 card. |
| 18 | **PASS** | Visible breadcrumbs on every inner page (services, guides, categories, doctors, contact, faq, about). |
| 19 | **PARTIAL** | Prior lab run (localhost, mobile): LCP 3.7–4.6 s — over 2.5 s. Templates unchanged since (hero image already uses `priority`/`fetchPriority="high"`). **Now that the site is deployed, re-verify with PageSpeed Insights / CrUX on the live domain** — CDN edge caching may change the picture. |
| 20 | **PASS** | 101 unique internal links across 93 pages: all 200, zero broken, zero pointing at redirects. |

### Schema
| # | Result | Evidence |
|---|---|---|
| 21 | **PARTIAL** | Guide/service/doctor pages now emit **one connected `@graph`** with stable `@id`s (WebPage → #webpage, article → #article, clinic → #clinic, breadcrumb, FAQPage). **Home page still emits 7 separate scripts**: one graph (WebSite+WebPage+MedicalClinic+FAQPage) plus 3 loose `Person` and 3 loose `Course` scripts outside the graph. |
| 22 | **PARTIAL** | All 60 guides are `MedicalWebPage` with `datePublished`, `dateModified`, `lastReviewed`, `publisher`, `mainContentOfPage`, `isPartOf`. **But `about` falls back to `{MedicalWebPage, "Fetal medicine"}` on 50/60 guides** — `GUIDE_ABOUT` in `lib/schema.ts:326` maps only the 10 original slugs. `author`/`reviewedBy` are the org-level "clinical team", never a named Physician/Person. |
| 23 | **PARTIAL** | `Person` node on doctor pages has name/url/image/worksFor/alumniOf/hasCredential/knowsAbout. Missing everywhere: `identifier` (registration `null`), `memberOf`, `sameAs`, languages, `medicalSpecialty` — all fields exist but are empty in `data/doctors.ts:92-161`. |
| 24 | **PASS** | Service typing fixed: scans/blood-tests/diagnostics → `MedicalProcedure`, clinics → `Service` (`SERVICE_SCHEMA_TYPE`, `lib/schema.ts:319`). Verified in rendered HTML (anomaly-scan = MedicalProcedure; genetic-counselling, recurrent-miscarriages-clinic, twin-specialised-clinic = Service). No standalone MedicalCondition pages exist — conditions live inside guides (acceptable; condition typing belongs in the guide `about` node, see #22). |
| 25 | **PASS** | `BreadcrumbList` on every inner page; `FAQPage` on all 60 guides, all 13 services, /faq, home. |
| 26 | **PARTIAL** | All JSON-LD parses valid; FAQPage text generated from the same arrays as visible FAQs. Two mismatches: generic `about` on 50 guides (#22); schema says "medically reviewed" via `reviewedBy: clinical team` while no reviewer's name exists anywhere — technically consistent with the visible byline but thin for YMYL. |

### YMYL and E-E-A-T
| # | Result | Evidence |
|---|---|---|
| 27 | **PARTIAL** | 2 of 3 doctors have profile pages; Dr Nivethitha (`hasProfile: false`) still appears in /doctors, llms.txt and clinic `employee` schema. Profiles show photo + qualifications + trained-at, but registration number, experience year, memberships, languages, detailed quals all `null`/`[]`. **No doctor page lists articles they wrote or reviewed** (h2s on dr-malathi page: About + Book + footer only). |
| 28 | **FAIL** | All 60 guides render the anonymous `Written and medically reviewed by the FMC Trichy clinical team` linked only to `/doctors` (`app/guides/[slug]/page.tsx:253-266`). The named-reviewer branch exists in code but never executes: `reviewedBy` is unset on 60/60 guides despite `reviewStatus: "reviewed"` + `reviewedAt` on all. |
| 29 | **PARTIAL** | Footer now links About, Contact (address, phones, maps links), FAQs, Privacy, Terms, Editorial Policy, Medical Disclaimer. **But all 5 legal pages render "This is a draft pending legal and client review" on public URLs** — noindex keeps them out of search, yet patients can read unfinished legal text from the footer. `/accessibility` is orphaned: linked nowhere, noindex, draft, and correctly absent from sitemap. |
| 30 | **PASS** | All 60 guides carry a Sources list — 29 unique authoritative URLs (ISUOG ×6, NICE ×5, NHS ×9, RCOG, WHO ×2, SMFM ×2, ESHRE) rendered as real links. Spot-checks: ISUOG/SMFM/ESHRE/RCOG/WHO/NHS all resolve. **NICE links 403 to curl** — likely WAF bot-blocking, verify in a real browser before removing. |
| 31 | **PASS** | No cure/guarantee/superlative claims — every `guarantee` occurrence is a disclaimer. "Painless" appears only describing the scan experience (clinical description, not an outcome claim) — acceptable. Comparative claims gated behind `claimIsLive` (`data/claims.ts`). |
| 32 | **PASS** | Condition-type guides carry "When to get urgent care", "When to see a specialist", "When to speak to a fetal medicine specialist" sections (verified in H2 inventory). |
| 33 | **PARTIAL** | Strong Trichy/Tamil Nadu context and specialist voice. Still **zero INR cost figures anywhere** — the NIPT guide has an `NIPT test cost: why prices can differ` H2 with no numbers; no insurance or hospital names. |
| 34 | **PASS** | Name, address, phones identical across footer, contact, llms.txt and MedicalClinic schema. |

### Pillar and supporting content
| # | Result | Evidence |
|---|---|---|
| 35 | **PASS** | **10 pillars × 5 supporting = 60 guides** — the cluster architecture is complete. Mapping in §5. |
| 36 | **PASS** | Every pillar links to all 5 of its supporting guides in body copy (inline links + Related guides list — verified programmatically). |
| 37 | **PASS** (minor) | All 50 supporting guides link to their pillar in body copy + ≥2 siblings (exactly 5 guide links each). Pillar link position: block 0–4 on 45 guides; late on `diabetes-and-pregnancy-baby-extra-monitoring` (12/33), `can-genetic-problems-cause-recurrent-miscarriage` (9/33), `male-fertility-tests-semen-analysis` (21/24 — nearly last block). |
| 38 | **FAIL** | **Zero in-body links to `/services/*` and zero to `/doctors/*` across all 60 guides.** Service linkage exists only via the `relatedService` end-card (present on 45/60; missing on 15 — all 6 PCOS+fertility-cluster guides except the two pillars, plus what-makes-high-risk, high-risk-extra-scans, pregnancy-after-ivf, fertility-tests-women, male-fertility, amh, follicular-monitoring, ovulating). No guide links to a doctor page at all. |
| 39 | **PASS** | Anchors descriptive and varied ("anomaly scan guide", "fetal echocardiography", "recurrent miscarriage"); no click-here/read-more. |
| 40 | **PASS** | Every sitemap URL has inbound links; nothing indexable is orphaned. `/accessibility` is an intentional orphan (draft+noindex) — decide its fate (#29). |

### FAQs
| # | Result | Evidence |
|---|---|---|
| 41 | **PASS** | Guides: 5–8 FAQs each (18×5, 32×6, 10×8). All 13 services: exactly 4. /faq: 10. All unique per page. |
| 42 | **FAIL** | **274/362 FAQ answers fall outside the 40–60-word band — almost all under-length.** Worst: `get-pregnant-naturally-with-pcos` (6/6 out), `anomaly-found-20-week-scan-what-happens` (5/5, incl. a 23-word answer), `anomaly-scan-vs-normal-pregnancy-ultrasound` (5/5), `nipt-in-pregnancy-test-accuracy-high-risk-result` (4), `what-does-anomaly-scan-check` (4). Full per-page counts in `seo-audit/guide-checks.json`. |
| 43 | **PASS** | FAQ answers in raw HTML; FAQPage schema generated from the same arrays — word-for-word guaranteed. |

### Entities, keywords and semantic writing
| # | Result | Evidence |
|---|---|---|
| 44 | See §4 | Per-page entity coverage in the page table; systemic gaps: cost (0 pages give figures), insurance, named specialist. |
| 45 | **PASS** | `quickAnswer` card present on 60/60 guides — direct quotable definition near the top. |
| 46 | **PARTIAL** | Most H2s are literal patient questions naming the entity — excellent for AI extraction. Exceptions: `Final Thoughts` on **50 guides**, `Related guides`/`Sources` auto-H2s, `Medical Disclaimer` as an H2 on the anomaly pillar, and **205 Title Case H2s across 40 new-batch guides** (e.g. "What Is the "Vanishing Twin"?", "How Do Guidelines Define It?"). The 10 pillars use sentence case correctly. |
| 47 | **PASS** | Medical + plain terms paired on first mention throughout ("PCOS (polycystic ovary syndrome)", "nuchal translucency (NT) scan"). |
| 48 | **PASS** | Primary keyword in title/H1/URL/first-100/meta on guides and services; no stuffing. |
| 49 | **PARTIAL** | Cannibalisation watch-list (learn vs book intent, heavily overlapping titles): `/services/anomaly-scan` vs `anomaly-scan-tiffa-scan-pregnancy` vs `tiffa-scan-pregnancy-when-to-get` vs `what-does-anomaly-scan-check` vs `anomaly-scan-vs-normal-pregnancy-ultrasound` — 5 URLs chasing "anomaly scan" queries; same pattern for NIPT (service + pillar + nipt-vs + can-nipt-detect) and NT scan (service + pillar + best-time + nt-detect). Differentiation exists but titles need sharpening per intent. |
| 50 | **PARTIAL** | Quotable specifics: week windows everywhere, 5 comparison tables (all in the anomaly/nipt cluster), but **no INR figures, no sourced statistics, no timelines with numbers** outside gestational weeks. |

### AI writing and agent fingerprints
| # | Result | Evidence |
|---|---|---|
| 51 | **PARTIAL** | Clean of major vocabulary tells. Present: `Final Thoughts` H2 on 50/60 guides; Title Case headings on 40 (205 H2s); banned-phrase hits ×5 — `whether you're` (pcos pillar), `that said` (recurrent-miscarriage), `straightforward` (anomaly pillar), `genuinely` ×2 (anomaly-vs-normal, anomaly-found). |
| 52 | **PASS** | Zero em dashes (enforced by `lib/content-rules.ts`). Single "that said". |
| 53 | **PARTIAL** | Identical skeleton on all 60 (quick answer → H2 Q&A → key takeaways → FAQs → sources) — worse on the new batch which also shares: exactly 5 guide links, "Related guides" list, "Final Thoughts", Title Case H2s, ~5-6 short FAQs. A crawler or LLM comparing 50 pages will see one template. |
| 54 | **PASS** | QR base now `https://fmctrichy.com/q/website` (fixed). console.log dev-gated only. No lorem/placeholder/personal data. Residual: 5 legal pages render "draft" markers publicly (noindex). |

### Extra checks
| # | Result | Evidence |
|---|---|---|
| 55 | **PASS** | `lang="en-IN"`, favicon (`icon.png`), `manifest.webmanifest`, HTTPS everywhere, no mixed content. |
| 56 | **PARTIAL** | No city-swapped doorway pages. GBP name/address/phone match cannot be verified without the listing — **client item**. `/q/[location]` QR lander 307s to `/book` correctly. |
| 57 | **FAIL** | No `sameAs` links to Wikipedia/Wikidata/MeSH on any entity — `GUIDE_ABOUT` nodes carry only a name; clinic `sameAs`/`areaServed` empty pending client data. |
| 58 | **PARTIAL** | The 50 new guides are literally PAA-style questions — excellent coverage of "what/when/how/difference" queries. Missing: real cost answers (a "why prices differ" H2 with no ₹ range), insurance coverage, "which hospital/centre" answers. |
| 59 | **PASS** | Reading level ~grade 7–9, plain-language, short sentences. Facts checked against sources where cited; anything questionable flagged for the doctors to verify (client item). |
| 60 | **PASS** | Testimonial quotes render only when `consentOnFile === true` (`components/home/why-choose-us.tsx:16-19`) — currently all gated off. No AggregateRating/review schema anywhere. No stock/AI doctor photos — real portraits. |
| 61 | **PASS** | NMC/DMR-compliant: no cure or outcome claims; PCPNDT disclaimer site-wide. |
| 62 | **PASS** | Source citations are plain links; no sponsored/affiliate links exist. |
| 63 | See below | Per-query AEO readiness in §2b. |

### 2b. Top-5 AI-query readiness
| Query | Can an AI engine quote this site? | Missing |
|---|---|---|
| "NT scan timing pregnancy" | Yes — `best-time-for-nt-scan-pregnancy` quick answer: "11 weeks to 13 weeks 6 days" + pillar depth | Named doctor authority |
| "NIPT test cost in Trichy / India" | **No** — NIPT guide mentions cost variation with zero figures | Any ₹ range + what drives it |
| "Anomaly scan vs TIFFA scan difference" | Yes — dedicated vs-guide + table + quick answer | Schema `about` still generic |
| "What does a high-risk NIPT result mean" | Yes — dedicated guide, step-by-step next steps | Authoritative `sameAs` entity links |
| "Fetal medicine specialist Trichy" | Partially — home/about/services well-marked | Doctor registration numbers, GBP consistency check |

### 2c. AI-likeness scores
Per-page scores (0 = human, 100 = templated AI) and the 5 worst sentences per page are in `seo-audit/ai-likeness.json` (computed by `seo-audit/ai-likeness.mjs`). Summary: **10 pillars score 15–26 (clean), 50 new guides score 30–61** — driven by shared skeleton, Title Case H2s, "Final Thoughts", short FAQs. Site average 45. Worst: `how-many-miscarriages-recurrent-pregnancy-loss`, `can-genetic-problems-cause-recurrent-miscarriage`, `what-is-amh-fertility-test` (61 each).

---

## 3. Issues

### P0 — critical
*None.* The site is live, crawlable, indexable and fully SSR. (Prior P0s resolved: INDEXABLE gating verified live; consent-pending quotes now gated off.)

### P1 — high

**ISS-201 · sitemap lists noindex pages**
- Pages: `/privacy`, `/terms` (sitemap entries)
- Evidence: `<loc>https://fmctrichy.com/privacy</loc>` in sitemap.xml; page HTML emits `<meta name="robots" content="noindex">` — contradictory signals to Google.
- Fix: in `app/sitemap.ts` exclude any route whose page sets noindex (or drop the noindex once counsel approves the copy). Root cause: `draftPendingReview` controls noindex but the static route list adds `/privacy`,`/terms` unconditionally.

**ISS-202 · no named author or medical reviewer on any of 60 medical articles**
- Pages: all `/guides/*`
- Evidence: byline text "Written and medically reviewed by the FMC Trichy clinical team" links only to `/doctors` (`app/guides/[slug]/page.tsx:253-266`); `reviewedBy` unset on 60/60 (`data/guides-blogs.ts`); `reviewStatus: "reviewed"` + `reviewedAt` set everywhere, so the site claims review without naming a reviewer — worse for E-E-A-T than no claim.
- Fix: set `reviewedBy` to a doctor slug per guide once the doctors confirm who reviewed what (client item). The named byline, reviewer card, `/doctors/<slug>` link and `reviewedBy: Person` schema all activate automatically.

**ISS-203 · zero in-body links to service and doctor pages from guides**
- Pages: all 60 guides
- Evidence: programmatic scan of `data/guides-blogs.ts` — 0 `/services/*` and 0 `/doctors/*` links inside `content` blocks; the only service link is the `relatedService` end-card (present on 45/60).
- Fix: add contextual in-copy service links (e.g. "our anomaly scan service") and link the reviewer byline/doctor mention to `/doctors/<slug>`; fill `relatedService` on the 15 guides missing it.

**ISS-204 · `about` schema is a generic "Fetal medicine" fallback on 50 guides**
- Pages: 50/60 guides
- Evidence: `GUIDE_ABOUT` (`lib/schema.ts:326`) maps only the 10 original slugs; rendered JSON-LD on e.g. `/guides/tiffa-scan-pregnancy-when-to-get` emits `about: {"@type":"MedicalWebPage","name":"Fetal medicine"}` — a page type, not the medical entity.
- Fix: extend `GUIDE_ABOUT` (or move `about` into guide data) with the correct MedicalCondition/MedicalProcedure per guide; add `sameAs` to Wikipedia/MeSH where useful (fixes checklist 57).

**ISS-205 · 274/362 FAQ answers outside the 40–60-word band**
- Pages: 56/60 guides (worst listed in checklist #42)
- Evidence: `seo-audit/guide-checks.json` — e.g. `anomaly-found-20-week-scan-what-happens` has a 23-word answer; `get-pregnant-naturally-with-pcos` all 6 under 40.
- Fix: expand thin answers to a direct answer + one supporting detail (40–60 words); trim the few >60.

### P2 — medium

**ISS-206 · titles/meta outside target ranges at scale** — 58/93 titles (mostly under 50 chars), 11/93 descriptions outside 140–160. Evidence: `seo-audit/analysis.json`. Fix: extend `seo.title`/`seo.description` per page to hit ranges; keep uniqueness.

**ISS-207 · AI-template fingerprints across the 50-guide batch** — "Final Thoughts" H2 ×50, 205 Title Case H2s ×40 guides, uniform skeleton + exactly-5-links pattern, 5 banned-phrase hits. Evidence: `seo-audit/ai-likeness.json`. Fix: sentence-case all H2s, rename/delete the "Final Thoughts" section (or make it a real closing section with varied names), vary skeleton order slightly, remove the 5 flagged phrases.

**ISS-208 · doctor profiles are shells; no article lists** — `data/doctors.ts` registration/memberships/languages/experience all empty; doctor pages list no articles; Nivethitha listed everywhere but has no profile. Fix: fill typed-null fields (client item), add "Guides reviewed by Dr X" section (data exists via `reviewedBy` once ISS-202 lands), decide Nivethitha profile vs remove from listings.

**ISS-209 · five draft legal pages render publicly from footer links** — noindex keeps them out of Google but patients clicking footer links read "This is a draft pending legal and client review". Fix: counsel sign-off (client item) or temporarily remove footer links to the draft pages; resolve orphaned `/accessibility` the same way.

**ISS-210 · home page emits 7 JSON-LD scripts instead of one graph** — WebSite+WebPage+MedicalClinic+FAQPage in a graph, then 3 loose `Person` + 3 loose `Course` scripts. Fix: move Person/Course nodes into `pageGraph([...])` on `app/page.tsx`.

**ISS-211 · no INR costs, insurance or quotable specifics** — 0 guides mention ₹/INR; only 5 tables across 60 guides; the NIPT "cost" H2 has no figures. Fix: add real cost ranges and drivers where the client confirms pricing (client item for figures); add comparison tables to vs-style guides that lack them.

**ISS-212 · CWV unverified on the deployed site** — prior lab run showed LCP 3.7–4.6 s (localhost). Fix: run PageSpeed Insights on live home/pillar/service/doctor pages now that the site is on a CDN; the LCP element (hero image) already has `priority`.

### P3 — low

**ISS-213 · doctor pages missing `og:image`** — `summary_large_image` card with no image. Fix: emit `openGraph.images` (doctor photo or generated OG image) in `app/doctors/[slug]/page.tsx`.

**ISS-214 · NICE source links 403 to curl** — `nice.org.uk` WAF-blocks non-browser agents; all 5 NICE URLs may be fine for users. Fix: verify in a real browser; replace only if actually dead.

**ISS-215 · late pillar links on 3 guides** — `male-fertility-tests-semen-analysis` (block 21/24), `diabetes-and-pregnancy-baby-extra-monitoring` (12/33), `can-genetic-problems-cause-recurrent-miscarriage` (9/33). Fix: move/add a pillar mention in the intro blocks.

**ISS-216 · `/guides/page/2-5` indexable, self-canonical, not in sitemap** — consistent enough, but paginated listing pages add crawl surface with thin content. Fix (optional): keep as-is or set `robots: {index:false}` on page ≥2.

**ISS-217 · guide OG images are raw covers** — no 1200×630 branded card for guides (services have generated ones). Fix: add `opengraph-image` generator for `/guides/[slug]`.

### P3 — needs client input (cannot fix from the codebase)
- Doctors' medical-council registration numbers (unlocks Person `identifier` schema)
- `reviewedBy` ownership per guide (who reviewed which article) — unlocks ISS-202
- PCPNDT registration number; TN Clinical Establishments reg; ART reg (if IUI/IVF offered)
- DPDP grievance officer details; founding date; geo coordinates; social `sameAs` URLs; `areaServed` towns
- Saturday hours confirmation; founding-year consistency (2012 vs "14 years" copy)
- Landmark directions text for /contact (TODO at `app/contact/page.tsx:401`)
- WhatsApp lead number confirmation (+91 74489 39808)
- Nivethitha's confirmed role line; 2 course durations; 3 testimonial written consents; 3 comparative claims substantiation
- Google Business Profile name/address/phone for consistency check (checklist 56)
- Real cost figures if the client wants cost pages (ISS-211)
- Counsel sign-off on the 5 draft legal pages (ISS-209)

---

## 4. Page-by-page table

Generated from `seo-audit/page-table.json` (94 rows: every crawled indexable page + utility pages).
| URL | Type | Cluster | Title | Meta | Byline | FAQ | Schema | In | Out | AI |
|---|---|---|---|---|---|---|---|---|---|---|
| / | home |  | 49 | 143 | - | Y | WebSite+WebPage+MedicalClinic+FAQPage+Person+Course | 0 | 34 | - |
| /about | static |  | 54 | 141 | - | - | BreadcrumbList | 94 | 25 | - |
| /services | static |  | 55 | 149 | - | - | BreadcrumbList | 94 | 29 | - |
| /fellowship | static |  | 53 | 148 | - | - | BreadcrumbList | 94 | 24 | - |
| /cme-activities | static |  | 55 | 142 | - | - | BreadcrumbList | 94 | 23 | - |
| /doctors | static |  | 53 | 151 | - | - | BreadcrumbList | 94 | 26 | - |
| /gallery | static |  | 46 | 140 | - | - | BreadcrumbList | 94 | 22 | - |
| /contact | static |  | 60 | 149 | - | - | BreadcrumbList | 94 | 23 | - |
| /faq | static |  | 53 | 153 | - | Y | FAQPage+BreadcrumbList | 94 | 23 | - |
| /international-patients | static |  | 56 | 147 | - | Y | BreadcrumbList+FAQPage | 94 | 23 | - |
| /privacy | static |  | 55 | 143 | - | - |  | 94 | 22 | - |
| /terms | static |  | 42 | 149 | - | - |  | 94 | 22 | - |
| /guides | static |  | 61 | 153 | - | - | BreadcrumbList | 94 | 45 | - |
| /services/viability-scan | service |  | 37 | 157 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 25 | - |
| /services/downs-screening-oscar | service |  | 52 | 154 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 30 | - |
| /services/first-trimester-anomaly-scan | service |  | 51 | 147 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 25 | - |
| /services/anomaly-scan | service |  | 35 | 147 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 30 | - |
| /services/growth-scan-doppler | service |  | 47 | 153 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 32 | - |
| /services/nipt | service |  | 27 | 141 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 28 | - |
| /services/fetal-echo | service |  | 33 | 151 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 94 | 30 | - |
| /services/fetal-neurosonogram | service |  | 42 | 148 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 5 | 25 | - |
| /services/second-opinion-scan | service |  | 42 | 146 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 6 | 29 | - |
| /services/genetic-counselling | service |  | 42 | 140 | - | Y | WebPage+Service+BreadcrumbList+FAQPage | 10 | 33 | - |
| /services/fetal-postmortem | service |  | 39 | 143 | - | Y | WebPage+MedicalProcedure+BreadcrumbList+FAQPage | 5 | 27 | - |
| /services/recurrent-miscarriages-clinic | service |  | 52 | 139 | - | Y | WebPage+Service+BreadcrumbList+FAQPage | 10 | 33 | - |
| /services/twin-specialised-clinic | service |  | 46 | 140 | - | Y | WebPage+Service+BreadcrumbList+FAQPage | 13 | 35 | - |
| /doctors/dr-malathi-g-prasad | doctor |  | 60 | 143 | - | - | WebPage+Person+BreadcrumbList | 17 | 24 | - |
| /doctors/dr-revathy-chandrasekharan | doctor |  | 66 | 144 | - | - | WebPage+Person+BreadcrumbList | 15 | 31 | - |
| /guides/what-happens-after-abnormal-nt-scan | guide | screening-and-tests | 52 | 148 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 15 | 32 | 37 |
| /guides/nt-scan-vs-double-marker-test | guide | screening-and-tests | 71 | 140 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 15 | 30 | 31 |
| /guides/nt-scan-detect-down-syndrome | guide | screening-and-tests | 49 | 140 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 15 | 29 | 37 |
| /guides/nt-scan-pregnancy-timing-normal-range-down-syndrome | guide | screening-and-tests | 33 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 16 | 31 | 15 |
| /guides/best-time-for-nt-scan-pregnancy | guide | screening-and-tests | 63 | 148 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 29 | 37 |
| /guides/high-nt-measurement-meaning | guide | screening-and-tests | 50 | 154 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 10 | 30 | 35 |
| /guides/nipt-in-twin-pregnancy-reliability | guide | screening-and-tests | 52 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 33 | 55 |
| /guides/what-happens-after-positive-nipt-result | guide | screening-and-tests | 55 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 33 | 52 |
| /guides/nipt-vs-nt-scan-vs-double-marker-test | guide | screening-and-tests | 67 | 158 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 32 | 52 |
| /guides/what-does-high-risk-nipt-result-mean | guide | screening-and-tests | 52 | 159 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 33 | 55 |
| /guides/can-nipt-detect-down-syndrome | guide | screening-and-tests | 43 | 147 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 31 | 52 |
| /guides/nipt-in-pregnancy-test-accuracy-high-risk-result | guide | screening-and-tests | 30 | 146 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 14 | 35 | 23 |
| /guides/how-often-growth-scans-high-risk-pregnancy | guide | pregnancy-scans | 65 | 153 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 20 | 30 | 49 |
| /guides/why-doppler-scan-during-pregnancy | guide | pregnancy-scans | 57 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 20 | 29 | 52 |
| /guides/what-does-it-mean-if-baby-is-measuring-small | guide | pregnancy-scans | 58 | 155 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 19 | 29 | 49 |
| /guides/fetal-growth-restriction-causes-monitoring-treatment | guide | pregnancy-scans | 68 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 29 | 55 |
| /guides/growth-scan-doppler-pregnancy-fetal-growth-restriction | guide | pregnancy-scans | 49 | 151 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 32 | 21 |
| /guides/what-is-a-growth-scan-and-when-is-it-done | guide | pregnancy-scans | 55 | 163 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 28 | 46 |
| /guides/fetal-echo-vs-anomaly-scan-difference | guide | pregnancy-scans | 68 | 158 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 32 | 52 |
| /guides/can-fetal-echo-detect-heart-defects | guide | pregnancy-scans | 59 | 147 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 32 | 49 |
| /guides/fetal-echo-shows-heart-abnormality-next-steps | guide | pregnancy-scans | 64 | 140 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 5 | 33 | 58 |
| /guides/fetal-echocardiography-pregnancy | guide | pregnancy-scans | 35 | 169 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 14 | 35 | 15 |
| /guides/what-is-fetal-echo-and-when-is-it-done | guide | pregnancy-scans | 54 | 161 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 32 | 49 |
| /guides/why-doctor-recommends-fetal-echocardiogram | guide | pregnancy-scans | 65 | 153 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 32 | 49 |
| /guides/what-does-anomaly-scan-check | guide | pregnancy-scans | 57 | 153 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 32 | 35 |
| /guides/anomaly-found-20-week-scan-what-happens | guide | pregnancy-scans | 73 | 146 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 33 | 45 |
| /guides/tiffa-scan-pregnancy-when-to-get | guide | pregnancy-scans | 61 | 150 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 4 | 32 | 29 |
| /guides/anomaly-scan-vs-normal-pregnancy-ultrasound | guide | pregnancy-scans | 73 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 32 | 45 |
| /guides/anomaly-scan-detect-all-birth-defects | guide | pregnancy-scans | 58 | 145 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 32 | 33 |
| /guides/anomaly-scan-tiffa-scan-pregnancy | guide | pregnancy-scans | 38 | 155 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 15 | 35 | 17 |
| /guides/twin-pregnancy-complications-doctors-look-for | guide | twins-and-high-risk | 58 | 156 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 14 | 31 | 49 |
| /guides/how-often-scans-twin-pregnancy | guide | twins-and-high-risk | 61 | 151 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 14 | 30 | 55 |
| /guides/chorionicity-twin-pregnancy-why-it-matters | guide | twins-and-high-risk | 70 | 159 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 15 | 30 | 48 |
| /guides/monochorionic-vs-dichorionic-twins | guide | twins-and-high-risk | 72 | 149 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 32 | 43 |
| /guides/twin-pregnancy-scans-risks-monitoring | guide | twins-and-high-risk | 27 | 177 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 16 | 34 | 17 |
| /guides/when-can-twins-be-detected-on-ultrasound | guide | twins-and-high-risk | 57 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 31 | 58 |
| /guides/what-is-amh-fertility-test | guide | fertility-and-planning | 62 | 145 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 12 | 30 | 61 |
| /guides/follicular-monitoring-ovulation-scan | guide | fertility-and-planning | 61 | 159 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 12 | 30 | 55 |
| /guides/how-to-know-when-you-are-ovulating | guide | fertility-and-planning | 52 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 13 | 30 | 52 |
| /guides/fertility-testing-for-couples | guide | fertility-and-planning | 42 | 138 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 31 | 20 |
| /guides/fertility-tests-for-women-before-treatment | guide | fertility-and-planning | 64 | 158 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 8 | 30 | 52 |
| /guides/male-fertility-tests-semen-analysis | guide | fertility-and-planning | 62 | 158 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 4 | 29 | 55 |
| /guides/before-trying-to-conceive-after-miscarriage | guide | pregnancy-loss | 58 | 150 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 30 | 58 |
| /guides/pregnancy-after-recurrent-miscarriage-monitoring | guide | pregnancy-loss | 71 | 147 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 30 | 55 |
| /guides/how-many-miscarriages-recurrent-pregnancy-loss | guide | pregnancy-loss | 69 | 158 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 30 | 61 |
| /guides/tests-after-repeated-miscarriages | guide | pregnancy-loss | 61 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 30 | 58 |
| /guides/can-genetic-problems-cause-recurrent-miscarriage | guide | pregnancy-loss | 62 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 30 | 61 |
| /guides/recurrent-miscarriage-causes-tests-treatment | guide | pregnancy-loss | 34 | 159 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 32 | 25 |
| /guides/diabetes-and-pregnancy-baby-extra-monitoring | guide | twins-and-high-risk | 69 | 160 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 4 | 32 | 58 |
| /guides/when-to-see-a-fetal-medicine-specialist | guide | twins-and-high-risk | 61 | 141 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 33 | 49 |
| /guides/high-risk-pregnancy-extra-scans-and-tests | guide | twins-and-high-risk | 68 | 157 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 4 | 31 | 46 |
| /guides/pregnancy-after-ivf-extra-monitoring | guide | twins-and-high-risk | 66 | 160 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 3 | 32 | 58 |
| /guides/high-risk-pregnancy-fetal-medicine-specialist | guide | twins-and-high-risk | 32 | 148 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 36 | 15 |
| /guides/what-makes-a-pregnancy-high-risk | guide | twins-and-high-risk | 46 | 150 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 9 | 32 | 55 |
| /guides/tests-for-pcos-related-infertility | guide | fertility-and-planning | 54 | 160 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 32 | 55 |
| /guides/low-amh-vs-pcos-difference | guide | fertility-and-planning | 53 | 160 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 6 | 32 | 52 |
| /guides/when-to-see-fertility-specialist-pcos | guide | fertility-and-planning | 57 | 156 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 5 | 31 | 55 |
| /guides/pcos-and-pregnancy | guide | fertility-and-planning | 31 | 133 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 11 | 35 | 26 |
| /guides/get-pregnant-naturally-with-pcos | guide | fertility-and-planning | 54 | 159 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 7 | 31 | 52 |
| /guides/how-pcos-affects-ovulation-fertility | guide | fertility-and-planning | 53 | 152 | team | Y | WebPage+MedicalWebPage+BreadcrumbList+FAQPage | 3 | 31 | 55 |
| /guides/category/pregnancy-scans | category |  | 44 | 122 | - | - | BreadcrumbList | 24 | 46 | - |
| /guides/category/screening-and-tests | category |  | 48 | 121 | - | - | BreadcrumbList | 18 | 40 | - |
| /guides/category/twins-and-high-risk | category |  | 58 | 151 | - | - | BreadcrumbList | 18 | 40 | - |
| /guides/category/pregnancy-loss | category |  | 43 | 143 | - | - | BreadcrumbList | 12 | 34 | - |
| /guides/category/fertility-and-planning | category |  | 51 | 120 | - | - | BreadcrumbList | 18 | 40 | - |
| /book | static |  | 35 | 113 | - | - |  | 88 | 22 | - |

---

## 5. Cluster table

All 10 clusters verified programmatically: each pillar links to exactly its 5 supporting guides in body copy; each supporting guide links back to its pillar plus siblings.

| Pillar | Category | Its 5 supporting guides (mutually linked) |
|---|---|---|
| anomaly-scan-tiffa-scan-pregnancy | pregnancy-scans | tiffa-scan-pregnancy-when-to-get<br>anomaly-scan-vs-normal-pregnancy-ultrasound<br>anomaly-scan-detect-all-birth-defects<br>what-does-anomaly-scan-check<br>anomaly-found-20-week-scan-what-happens (5) |
| nt-scan-pregnancy-timing-normal-range-down-syndrome | screening-and-tests | best-time-for-nt-scan-pregnancy<br>high-nt-measurement-meaning<br>nt-scan-vs-double-marker-test<br>nt-scan-detect-down-syndrome<br>what-happens-after-abnormal-nt-scan (5) |
| nipt-in-pregnancy-test-accuracy-high-risk-result | screening-and-tests | nipt-vs-nt-scan-vs-double-marker-test<br>what-does-high-risk-nipt-result-mean<br>can-nipt-detect-down-syndrome<br>nipt-in-twin-pregnancy-reliability<br>what-happens-after-positive-nipt-result (5) |
| fetal-echocardiography-pregnancy | pregnancy-scans | what-is-fetal-echo-and-when-is-it-done<br>why-doctor-recommends-fetal-echocardiogram<br>fetal-echo-vs-anomaly-scan-difference<br>can-fetal-echo-detect-heart-defects<br>fetal-echo-shows-heart-abnormality-next-steps (5) |
| growth-scan-doppler-pregnancy-fetal-growth-restriction | pregnancy-scans | what-is-a-growth-scan-and-when-is-it-done<br>why-doppler-scan-during-pregnancy<br>what-does-it-mean-if-baby-is-measuring-small<br>fetal-growth-restriction-causes-monitoring-treatment<br>how-often-growth-scans-high-risk-pregnancy (5) |
| twin-pregnancy-scans-risks-monitoring | twins-and-high-risk | when-can-twins-be-detected-on-ultrasound<br>how-often-scans-twin-pregnancy<br>chorionicity-twin-pregnancy-why-it-matters<br>monochorionic-vs-dichorionic-twins<br>twin-pregnancy-complications-doctors-look-for (5) |
| high-risk-pregnancy-fetal-medicine-specialist | twins-and-high-risk | what-makes-a-pregnancy-high-risk<br>when-to-see-a-fetal-medicine-specialist<br>high-risk-pregnancy-extra-scans-and-tests<br>pregnancy-after-ivf-extra-monitoring<br>diabetes-and-pregnancy-baby-extra-monitoring (5) |
| recurrent-miscarriage-causes-tests-treatment | pregnancy-loss | how-many-miscarriages-recurrent-pregnancy-loss<br>tests-after-repeated-miscarriages<br>can-genetic-problems-cause-recurrent-miscarriage<br>before-trying-to-conceive-after-miscarriage<br>pregnancy-after-recurrent-miscarriage-monitoring (5) |
| pcos-and-pregnancy | fertility-and-planning | get-pregnant-naturally-with-pcos<br>how-pcos-affects-ovulation-fertility<br>tests-for-pcos-related-infertility<br>low-amh-vs-pcos-difference<br>when-to-see-fertility-specialist-pcos (5) |
| fertility-testing-for-couples | fertility-and-planning | fertility-tests-for-women-before-treatment<br>male-fertility-tests-semen-analysis<br>what-is-amh-fertility-test<br>follicular-monitoring-ovulation-scan<br>how-to-know-when-you-are-ovulating (5) |

**Supporting guides not mutually linked to any pillar:** none

## 6. Needs from client

See the client-input list under §3 P3. Short version: doctor registration numbers, per-guide reviewer ownership, legal sign-offs, PCPNDT/CEA/ART registrations, GBP details, social URLs, geo, WhatsApp number confirmation, testimonial consents, and cost figures if wanted.

---

## Audit artifacts

- `seo-audit/crawl.mjs` / `crawl-results.json` — crawler + raw signals (93 sitemap URLs + extras)
- `seo-audit/html/` — raw SSR HTML of every page for evidence
- `seo-audit/analyze.mjs` / `analysis.json` — checklist aggregation (titles, meta, h1, canonical, schema, links, orphans)
- `seo-audit/guides.mjs` / `guide-checks.json` — per-guide data checks (FAQs, links, banned words, title-case H2s)
- `seo-audit/ai-likeness.mjs` / `ai-likeness.json` — per-page AI-likeness score + worst sentences
- `seo-audit/audit.json` — machine-readable issues for the fix pass
