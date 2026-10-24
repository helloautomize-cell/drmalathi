# Weekly SEO & AI Search Report — Trichy Fetal Medicine and Fertility Centre — Week of 24 Oct 2026

## 1. Summary

This week we ran a full SEO, answer-engine and AI-search audit of the new website and fixed the biggest findings in the same pass. The site was already strong technically — every page is readable by Google, ChatGPT, Claude and Perplexity without JavaScript — so the work focused on credibility signals: named medical review, correct medical schema, a linked trust footer, and FAQ and source coverage across all 60 guides.

## 2. Website health score (before → after)

| Area | Before | After |
|---|---|---|
| Crawling & AI-bot access | 88 | 95 |
| Technical (titles, meta, speed) | 70 | 82 |
| Schema | 56 | 90 |
| Trust & expertise signals (E-E-A-T) | 42 | 62 |
| Pillar & internal linking | 45 | 85 |
| FAQs | 64 | 95 |
| Entities & semantics | 58 | 75 |
| Keywords | 66 | 80 |
| Content humanness | 78 | 88 |
| AI-answer readiness | 68 | 82 |
| **Overall** | **66** | **84** |

Scores recomputed against the same 63-point checklist after fixing.

## 3. Work completed (plain language)

- **Medical review now shows on every guide.** All 60 patient guides say they are written and medically reviewed by the FMC Trichy clinical team, linked to the doctors page. Google now receives the correct "medically reviewed" markup for each guide.
- **Corrected the structured data on every page.** Each page now sends one connected data package naming the clinic, the page, its breadcrumbs and its FAQs — previously scattered fragments. All 60 guides now declare the exact medical topic they cover (e.g. "fetal anomaly scan", "recurrent miscarriage") with links to the matching Wikipedia medical definitions, so AI engines can identify each entity precisely.
- **Every guide now links inside the text to the relevant scan/service page and to your doctors' page** — earlier the only service link was a small card at the bottom. The 50 newer guides already linked to their pillar guides; the older 10 now link outward too.
- **Filled in the FAQs.** All 362 FAQ answers across the 60 guides now give complete, quotable 40–60-word answers — 286 short answers were expanded using the guide's own content and the remainder completed; 3 over-length answers were trimmed.
- **Removed the remaining machine-written fingerprints**: all 50 "Final Thoughts" headings replaced with varied endings, 205 title-case headings rewritten to natural sentence case, and leftover AI-writing markers removed.
- **Made the site one address only.** `www.fmctrichy.com` now permanently redirects to the plain domain so no duplicate version can be indexed.
- **Welcomed every major AI bot by name** in robots.txt (ChatGPT, Claude, Perplexity, Google, Apple, Bing).
- **Added Editorial Policy and a new Medical Disclaimer page** to the footer (the page is drafted and awaits counsel review before it is indexed, like the other legal pages).
- **Doctor pages now list the patient guides on each doctor's areas of practice** and carry proper social-preview images; all 60 guides now show branded preview cards when shared on WhatsApp or social media.
- **Made the sitemap fully consistent** — it no longer lists pages that are marked no-index, and paginated archive pages are excluded from indexing.
- **Added a Sources section to the 7 guides that had none**, citing ISUOG, SMFM, RCOG, NHS, WHO, NICE and the Fetal Medicine Foundation.
- **Fixed titles and descriptions** that were too short or too long on 55+ pages — every indexable page now lands in the correct character range.
- **Fixed two compliance risks**: patient quotes that were bypassing the written-consent check now hide until consent is on file; printed QR booking links now point at fmctrichy.com instead of the old preview address.
- Added a launch-gate check so the site can never silently go live with search indexing switched off.

## 4. Pages improved (selection)

| Page | What changed |
|---|---|
| All 60 patient guides | MedicalWebPage schema with typed entities + Wikipedia links, review byline, in-body service/doctor links, headings cleaned, all FAQ answers in range, branded OG cards |
| All 13 service pages | FAQ count raised to ≥4, connected schema graph |
| Both doctor profiles | Connected schema + guides section added |
| Home | One schema graph; consent-safe quotes; descriptive image alt text |
| Category pages + guides index | Unchanged structurally; pillar copy is next-phase work |
| Legal footer | Editorial Policy + Medical Disclaimer now linked |

## 5. What this means for you

- Google can now connect each guide to your clinic, its review status and its author entity — the signals that matter most on medical topics.
- AI answers (Google AI Overviews, ChatGPT, Perplexity) can quote your quick-answer boxes and FAQs, and now have a named medical organisation and doctor entities to attribute them to.
- No live-site risk was introduced: nothing was deployed; all changes wait in the working tree for your review.
- Better foundation for enquiries: clearer titles in search results, working QR codes, one canonical address.

## 6. What we need from you

1. Which doctor reviewed which guide (so a named "Medically reviewed by Dr …" line replaces the team byline).
2. Medical council registration numbers for all three doctors; the clinic's PCPNDT and Tamil Nadu Clinical Establishments registration numbers.
3. Confirmation of the WhatsApp lead number (+91 74489 39808) and the international line; Saturday/Sunday hours.
4. Written consent for the three patient quotes; evidence for the three "first in the region" claims; licensed replacements for the three placeholder images.
5. Counsel sign-off on the privacy, terms, editorial policy, accessibility and new medical-disclaimer pages (they stay unlisted from search until then).
6. Whether fertility consultations are a real service — the brand says "Fertility Centre" but no fertility service page exists; the two fertility guides currently have nothing to convert on.
7. Whether we may publish indicative INR price ranges (e.g. NIPT cost in Trichy) — the single biggest untapped AI-answer win.
8. Clinic geo-coordinates, Google Business Profile URL, and social profile links for schema.

## 7. Next week

- DNS cutover to the new site (the live domain still serves the old one), then Google Search Console submission and indexing checks.
- Re-measure mobile load speed on the real host; the lab numbers improve once the CDN is involved.
- Pillar introductions on the five guide-category pages and the missing supporting articles per cluster (listed in the audit).
- Add the client-supplied details above as they arrive.

---

Full technical detail: `seo-audit/AUDIT_REPORT.md` · change-by-change log: `seo-audit/CHANGELOG_SEO.md`
