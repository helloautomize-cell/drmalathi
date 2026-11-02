# NMC Compliance Audit — Trichy Fetal Medicine and Fertility Centre (fmctrichy.com)

Audit date: 2026-10-26
Scope: this repository (Next.js site) plus the live site at https://fmctrichy.com. The live site is a production build of this codebase — verified by fetching the live homepage, which renders the same hero, sections and footer as this repo. Production gating (`VERCEL_ENV=production`) means `showPending = false`: items flagged `consentOnFile: null` / `substantiated: null` / `roleIsPlaceholder` do **not** render on the live site but **do** render on preview deployments. Findings below state where each item actually appears.

No code or content was changed. This is an investigation only.

---

## Step 1 — Practice profile

| Field | Finding | Evidence |
|---|---|---|
| Practice type | **P4 — medical institution / specialty centre** (multi-doctor specialty centre performing in-house fetal procedures; gallery references "IVF and obstetric theatres"). Could be argued P3; C15 applies either way via the doctor directory. | `data/site.ts:12`, `data/gallery.ts:68`, `data/procedures.ts` |
| State / State Medical Council | Tamil Nadu — **Tamil Nadu State Medical Council (TNSMC), Chennai** | `lib/schema.ts:86` (`addressRegion: "Tamil Nadu"`) |
| Doctors named on site | Dr Malathi G. Prasad — MD, FRCOG (UK), Diploma in Fetal Medicine (FMF). Dr Revathy Chandrasekharan — MS (O&G), Fellowship in Fetal Medicine (ICOG), "Gold medal, ICOG Fetal Medicine Fellowship, 2022 batch". Dr Nivethitha — Fellowship in Fetal Medicine (role is a flagged placeholder). **No registration number shown for any doctor.** | `data/doctors.ts:62-165`; render gate at `app/doctors/[slug]/page.tsx:389-394` |
| Registration numbers shown? | **No.** `registration: null` on all three records; the render slot exists but is empty. Centre-level registrations (PCPNDT, TN Clinical Establishments Act, ART) are also all `null`. | `data/doctors.ts:92,131,157`; `data/site.ts:45-50` |
| Procedures/surgeries described? | **Yes.** Amniocentesis, CVS, fetal reduction, intrauterine transfusion, fetoscopic procedures, RF ablation for twin pregnancies; plus 13 service pages describing scans, NIPT and clinics. | `data/procedures.ts:4-11`, `data/services.ts` |

## Step 2 — Feature inventory

| # | Feature | Present? | Evidence |
|---|---|---|---|
| F1 | Testimonials / reviews / ratings | **Yes** — 3 named patient quotes staged; render on preview deploys, suppressed in production while consent is pending. Google-reviews CTA and video-testimonial slots exist but are empty/dormant. | `data/testimonials.ts:18-41`, `components/home/testimonials-section.tsx:17-20`, `data/trust.ts:7-19` |
| F2 | Review/rating schema | No — no `AggregateRating`/`Review` anywhere in `lib/schema.ts` or elsewhere. | grep across `lib/`, `app/`, `components/` |
| F3 | Case studies / patient stories | No. (Testimonials are quotes, not case narratives.) | — |
| F4 | Before/after or patient clinical images | No. Gallery is facility + grand-opening event photos only ("No patient-identifiable images are used"). | `data/gallery.ts:1-5` |
| F5 | Patient/surgery videos | No — `videoTestimonial` slot exists but is `null`; nothing renders. | `data/trust.ts:14-18` |
| F6 | Doctor photographs | **Yes** — home doctor cards, `/doctors`, `/doctors/[slug]`, guide reviewer avatars, doctor-page OG image, Person schema `image`. | `components/home/doctors-section.tsx`, `app/doctors/[slug]/page.tsx:42`, `lib/schema.ts:167` |
| F7 | Numbers / stats | **Yes** — "Since 2012" chip, "14 years" copy, "14 years in fetal medicine" highlight. Counter slots (scans performed etc.) exist but are all `null` and render nothing. | `components/home/firsts-strip.tsx:50-67`, `data/doctors.ts:72`, `data/trust.ts:25-28` |
| F8 | Awards / rankings / media | **Yes** — one award with body + year (compliant); "National faculty" highlight. No logo walls or "as seen on". Award/affiliation slots exist but empty. | `data/doctors.ts:72-75,127`, `data/trust.ts:11-12` |
| F9 | Equipment / facility descriptions | **Yes** — gallery (scan rooms, ultrasound machines), simulator-based training, "high-resolution equipment" in FAQ. | `data/gallery.ts`, `data/courses.ts:34`, `data/faqs.ts:23` |
| F10 | Fees / packages / cost pages | No — no fee or price anywhere. | grep `₹|Rs|fee|cost|price` over `app/ components/ data/ lib/` |
| F11 | Offers / discounts / camps / coupons | No. | same grep |
| F12 | Educational content | **Yes** — 60 patient guides (`/guides/*`), `/faq`, service education copy. | `data/guides-blogs.ts` (60 slugs, all `reviewStatus: "reviewed"`) |
| F13 | Forms / WhatsApp / chat / pop-ups | **Yes** — booking sheet on every CTA, `/book`, `/contact` callback form, international form, course-enquiry dialog, WhatsApp links + float, fixed mobile Call/WhatsApp/Book bar, printed-QR routes `/q/*`. No chatbot, **no pop-ups/exit-intent/countdowns**. | `components/booking/booking-sheet.tsx`, `components/site/*`, `app/q/[location]/route.ts` |
| F14 | AI content | **Yes** — hero image `family-cutout` documented as "Generated with ChatGPT (OpenAI), October 2026"; used on homepage hero and as the MedicalClinic schema image. | `data/image-sources.json:46`, `components/home/hero.tsx:76,91`, `lib/schema.ts:77` |
| F15 | Analytics / pixels / cookies | **Yes** — Vercel Speed Insights only (no cookies, disclosed in privacy policy). No ad pixels, GA, Meta, session recording. First-party QR `src` attribution. | `app/layout.tsx:14,83`, `app/privacy/page.tsx:75-78` |
| F16 | Third-party credits / links | **Yes** — "Built & Marketed by Automize Media Labs" in site footer (live) and at the tail of `llms.txt`/`llms-full.txt`. Processors (Resend, Google Sheet, Vercel, WhatsApp) disclosed in privacy policy. | `components/site/site-footer.tsx:244-258`, `lib/llms.ts:122,356` |
| F17 | Announcements / greetings | **Yes** — CME events page, grand-opening event photos (factual, professional). | `data/cme.ts`, `data/gallery.ts` |
| F18 | Doctor directory | **Yes** — `/doctors` listing + two profile pages. | `app/doctors/*` |
| F19 | Social media links | No — `site.socials` is empty; nothing renders. | `data/site.ts:41` |

## Step 3 — Applicability

| Check | Applies? | Reason |
|---|---|---|
| M1 Registration disclosure | **Applies — MISSING** | Always applies; no RMP registration number shown for any of the 3 doctors |
| M2 Privacy notice + consent | **Applies — PARTIAL** | F13/F15 true. Unticked required consent + linked policy present on all forms; but no named grievance officer (`site.grievanceOfficer: null`) and the retention section contradicts itself |
| M3 Risks and limitations | **Applies — MISSING** | Procedures/treatments described; no service page or procedures strip states risks or that outcomes vary (`limits` field never populated) |
| M4 AI disclosure | **Applies — MISSING** | F14 true (AI-generated hero image). No "AI-generated" label on the image; editorial policy has no AI-assistance section |
| M5 Medical disclaimer | **Applies — SATISFIED** | Per-guide disclaimer box on every guide + site-wide disclaimer bar + `/medical-disclaimer` page |
| C1 Claims and wording | **Applies** | All site copy scanned; "first"-type claims exist but are gated off in production |
| C2 Testimonials and reviews | **Applies** | F1 true |
| C3 Cases and patient stories | N/A | F3 false |
| C4 Patient images and video | N/A | F4/F5 false (video slot dormant, nothing renders) |
| C5 Doctor photos | **Applies** | F6 true |
| C6 Numbers, awards, media | **Applies** | F7/F8 true |
| C7 Equipment and facilities | **Applies** | F9 true — copy is factual; checked, no superiority claims found |
| C8 Fees and offers | N/A | F10/F11 false |
| C9 Educational content | **Applies** | F12 true |
| C10 Solicitation and CTAs | **Applies** | F13 true |
| C11 AI | **Applies** | F14 true |
| C12 Data protection | **Applies** | F13/F15 true — verified: no health data to ad platforms (none exist), consent enforced server-side, no personal data in logs/URLs in production |
| C13 Third parties and agency | **Applies** | F16 true |
| C14 Announcements | **Applies** | F17 true — CME/grand-opening items are factual and non-promotional; verified OK |
| C15 Institution rules | **Applies** | F18 true — directory is factual; every doctor fails M1 (see F-01) |
| C16 Off-site checklist | N/A | F19 false — no social/profile links on the site. (A Google-reviews link slot exists but is dormant; if a Google Business Profile exists off-site, apply this audit's rules to it manually.) |

## Executive summary

**Overall risk: High.** Nothing CRITICAL is live — no cure claims, inducements, identifiable patient data, or published reviews. But two HIGH items are on the live site today (no medical-council registration number for any doctor; a public "Built & Marketed by" agency credit that documents third-party marketing engagement), and a prohibited testimonial feature is fully built and staged to go live the moment a consent flag flips — consent does not make testimonials permissible under clause 6.2. Three unsubstantiated "first in Tamil Nadu" superlatives are one config flag away from production and already render on preview deploys.

Counts: **CRITICAL 0 · HIGH 3 · MEDIUM 7 · LOW 2** (12 findings).

Top 5 fixes: (1) add TNSMC registration numbers for all three doctors; (2) neutralise or remove the agency credit in the footer and llms.txt; (3) remove the testimonial feature and staged quotes outright; (4) add risks/limitation lines to all 13 service pages and the procedures strip; (5) keep the "first" claims permanently off unless independently documented, and add AI disclosure for the hero image plus an AI clause in the editorial policy.

---

## Findings

### HIGH

**F-01 · HIGH · M1 (Explanation III/IV) · Registration numbers absent for every doctor**
- Location: live `/doctors`, `/doctors/*`, home doctor cards, Person schema — repo: `data/doctors.ts:92,131,157` (`registration: null`), `app/doctors/[slug]/page.tsx:389-394` (renders only if set), `data/site.ts:45-50` (PCPNDT / Clinical Establishments / ART registration all `null`).
- Evidence: `registration: null` on all three doctor records; nothing renders anywhere on the site.
- Why it breaches: the guidelines require each named RMP's name, qualifications and SMR/NMR registration number with the council name; a multi-doctor institution must show it for every listed doctor.
- Compliant alternative: add to each doctor record, e.g. `registration: { council: "Tamil Nadu Medical Council", number: "<TNSMC reg. no.>" }`. The UI and `Person.identifier` schema slot already exist — populating the field renders "Registered with Tamil Nadu Medical Council, registration number ___" on each profile and in JSON-LD. Also add the same line to the footer and doctor cards, and fill `pcpndtRegistration` / `clinicalEstablishmentRegistration` / `artRegistration` once confirmed.
- SEO/AEO note: registration numbers strengthen the E-E-A-T/credential signal for `Person` entities; zero SEO cost.
- Client input needed: TNSMC registration number (and council name as printed on the certificate) for each of the three doctors; PCPNDT and Clinical Establishments registration numbers; whether the centre actually provides IUI/IVF (the name says "Fertility Centre" and a gallery caption mentions IVF theatres — if so, ART registration applies too).
- Effort: S.

**F-02 · HIGH · 8.1(ii) · C13 · Public agency marketing credit**
- Location: live footer on every page — `components/site/site-footer.tsx:244-258` (`AgencyCredit`), rendered at `:145` and `:224`; also the last line of `llms.txt` and `llms-full.txt` — `lib/llms.ts:122,356`.
- Evidence: `Built & Marketed by Automize Media Labs` linking to `https://www.automizemedialabs.com/`; `Website built and marketed by Automize Media Labs (https://www.automizemedialabs.com/)` in llms.txt.
- Why it breaches: an RMP/institution shall not engage a third party for marketing medical services, and nothing may be done indirectly that is prohibited directly (4.4). A public "Marketed by" credit states the arrangement openly on every page.
- Compliant alternative: remove the line, or reduce it to a neutral attribution: `Website: Automize Media Labs`. Delete the trailing credit line in `buildLlmsTxt()`/`buildLlmsFull()`.
- SEO/AEO note: the backlink has no SEO value to the clinic (it is an outbound link); removing it is neutral to positive.
- Client input needed: none for removal; if the agency contract requires a credit, use the neutral form only.
- Effort: S.

**F-03 · HIGH · 8.1(ii)/(xi)/(xii), 6.2 · C2 · Patient testimonials staged for publication**
- Location: `data/testimonials.ts:18-41` (three named patient quotes); `components/home/testimonials-section.tsx:17-20` (renders when `consentOnFile === true` or on preview deploys); quotes also embedded in `components/home/why-choose-us.tsx:14-49` (`consentedQuote` slots incl. "they saved my twins"); dormant `googleRating`, `googleReviewsUrl`, `videoTestimonial` slots in `data/trust.ts:6-19` render on `components/shared/trust-slots.tsx` and in the testimonials section (`:38-68`).
- Evidence: `"I am very happy because they saved my twins."` — Deva; `"மிக,மிக சிறப்பான மருத்துவமனை…"` — Rajesh; `"The doctors are absolutely kind and explained every single detail…"` — Manisha Margrete. All `consentOnFile: null`.
- Why it breaches: patient testimonials are prohibited for promotion in any form; consent does not make them permissible (6.2). "They saved my twins" is additionally an implied outcome claim. Currently suppressed on production, but visible on every preview deploy and one flag away from the live site; the section header "What families say about us" is already built.
- Compliant alternative: remove the feature entirely — delete `data/testimonials.ts` content, `TestimonialsSection`, the `consentedQuote` mechanism in `why-choose-us.tsx`, and the `googleRating`/`videoTestimonial`/`googleReviewsUrl` slots in `data/trust.ts` (or commit to never populating them). Do not solicit or republish reviews. A plain link to the Google Business Profile as a location is acceptable.
- SEO/AEO note: loses the review-quote content, but those words were never rankable assets; keeping the section risks the strongest available NMC sanction for zero gain.
- Client input needed: confirmation that no testimonial content will be published, and that no pending "consent" will be used to flip `consentOnFile` to `true`.
- Effort: S.

### MEDIUM

**F-04 · MEDIUM · 8.1(vi) · M3 · No risks or limitations stated for any described procedure**
- Location: all 13 service pages (`app/services/[slug]/page.tsx`, data in `data/services.ts`); procedures strip `data/procedures.ts:4-11` rendered on `/about` (`about/page.tsx:220-229`) and home (`why-choose-us.tsx:87-95`).
- Evidence: `grep` finds zero `limits:`, `visitNotes:`, `resultsDetail:`, `followUp:` values in `data/services.ts` — the "What it cannot show" section (`app/services/[slug]/page.tsx:454-470`) therefore never renders. Invasive procedures are listed bare: `"Fetal reduction"`, `"Intrauterine transfusion for Rh-negative mothers"`, `"Fetoscopic procedures"`, `"RF ablation for twin pregnancies"`, `"Amniocentesis"`, `"CVS"`.
- Why it breaches: where procedures/treatments are described, the description must state risks and that outcomes vary; invasive fetal procedures are listed with no risk information at all.
- Compliant alternative: populate the existing `limits` field per service with medical-team-approved lines, e.g. amniocentesis/CVS: "These are invasive tests and carry a small risk of miscarriage, which the specialist will explain before you decide."; scans: "No scan can detect every condition; a normal report does not guarantee a healthy baby." Add one line under the procedures strip: "All procedures carry risks and benefits that the specialist will discuss with you before any decision." Keep the existing tone — the field and UI slot already exist.
- SEO/AEO note: honest limitations improve answer-engine citability (balanced medical content) and map to the `MedicalProcedure` schema's expectations.
- Client input needed: doctor-approved risk wording per procedure.
- Effort: M.

**F-05 · MEDIUM · 7.2(c) · M4/C11 · AI-generated hero image with no label or policy disclosure**
- Location: `data/image-sources.json:46` (`family-cutout` — `"licenseSource": "Generated with ChatGPT (OpenAI), October 2026"`); rendered in the homepage hero (`components/home/hero.tsx:76,91`, live on fmctrichy.com) and as the `MedicalClinic` schema `image` (`lib/schema.ts:77`). Editorial policy (`app/editorial-policy/page.tsx`) contains no AI-assistance clause.
- Evidence: provenance file explicitly records the asset as ChatGPT-generated; no "AI-generated" label or caption exists anywhere in code.
- Why it breaches: material AI-generated imagery requires disclosure ("AI-generated" label on the asset and editorial-policy disclosure of AI assistance with doctor review).
- Compliant alternative: add a small "AI-generated illustration" label/caption where the image renders (hero and any OG reuse), and add an editorial-policy paragraph: "Some illustrations on this website are generated with AI tools to protect patient privacy; all medical content is written and reviewed by our clinical team." If any body copy was AI-drafted, the same disclosure must cover it — confirm authorship.
- SEO/AEO note: none negative; labelled synthetic media is increasingly favoured over unlabelled.
- Client input needed: confirm which site copy was AI-drafted so the disclosure scope is accurate.
- Effort: S.

**F-06 · MEDIUM · 8.1(ii), 5.1 · C9 · Promotional closers embedded inside all ~60 educational guides**
- Location: `data/guides-blogs.ts` (all 60 guides), rendered inside article body by `app/guides/[slug]/page.tsx:313` — e.g. the recurrent-miscarriage guide ends: `"Trichy Fetal Medicine and Fertility Centre runs a recurrent miscarriage clinic, and couples in and around Trichy can get in touch through the centre's website, https://fmctrichy.com/."`; dozens of guides end with `"Patients seeking fetal medicine consultation in Trichy can contact Trichy Fetal Medicine and Fertility Centre through the official website."` or `"Dr Malathi G. Prasad at Trichy Fetal Medicine and Fertility Centre in Trichy can explain which test suits your pregnancy…"` (58 occurrences of the centre name in the file).
- Why it breaches: educational content is protected only while it is genuinely educational; repeated solicitation lines and named-doctor pitches inside the body convert the article into promotion (and indirectly advertise the named RMP, which the guidelines close off).
- Compliant alternative: delete the boilerplate closer sentences inside article bodies. Each guide page already ends with a neutral disclaimer box, a related-service card and a standard CTA band outside the article body — those are sufficient and clearly separated. Optionally replace the closers with a single neutral line inside the existing disclaimer box: "For personal advice, consult your obstetrician or a fetal medicine specialist."
- SEO/AEO note: removing repeated promotional boilerplate reduces template-footprint detection and improves snippet quality; internal links already exist contextually elsewhere in the body.
- Client input needed: none beyond sign-off on the edit.
- Effort: M (mechanical sweep across 60 articles; verify each removal keeps the closing paragraph grammatical).

**F-07 · MEDIUM · 8.1(iii)/(ix), own editorial policy · C9 · "Reviewed" badges with no named reviewer**
- Location: `data/guides-blogs.ts` — all 60 guides carry `reviewStatus: "reviewed"` and a `reviewedAt` date, but `reviewedBy` is empty on every one; cards render a "Reviewed" badge (`components/guides/guide-card.tsx:79-84`, visible on the live homepage); article pages fall back to "Written and medically reviewed by the FMC Trichy clinical team" (`app/guides/[slug]/page.tsx:257`); `llms.txt` repeats "Medically reviewed on <date>" per guide (`lib/llms.ts:42-48`).
- Why it breaches: an unverifiable quality claim; it also contradicts the site's own editorial policy, which promises that "reviewed pages carry a review note naming the reviewer and the review date" (`app/editorial-policy/page.tsx:45-49`). If the doctors have not in fact reviewed all 60 guides line by line, the badge is misleading.
- Compliant alternative: populate `reviewedBy` per guide once a named doctor actually reviews it (the badge UI and `Person` attribution already exist); until then show review status only where a named reviewer exists, or change card text to a verifiable "Reviewed by our clinical team" only if that review genuinely happened.
- SEO/AEO note: named-reviewer bylines are the stronger E-E-A-T signal — the fix improves SEO as well as compliance.
- Client input needed: which doctor reviewed which guide (or a real review pass before launch).
- Effort: M (process, not code).

**F-08 · MEDIUM · 7.6, DPDP Act/Rules · M2/C12 · Grievance officer missing; retention section contradicts itself**
- Location: `app/privacy/page.tsx:196-209` (grievance-officer block renders only when `site.grievanceOfficer` is set — it is `null`, `data/site.ts:52-57`); `app/privacy/page.tsx:123-129` retention section says the period "is being confirmed… and will be stated here before launch" while `:113-114` already states appointment records are "kept for up to 12 months". The page also still carries the visible line "This is a draft pending legal and client review" (`:48-54`).
- Why it breaches: the notice obligations require a complete, non-contradictory notice (what, why, retention, grievance contact). A named grievance contact/officer and a final retention statement are needed; a live page announcing it is a draft undermines the notice.
- Compliant alternative: fill `site.grievanceOfficer` (name, designation, email, phone); reconcile the retention section with the 12-month figure (state per-record-type periods or keep the single 12-month line); remove the draft banner once counsel signs off. The rest of M2 is already compliant — unticked required consent checkbox and policy link on every form (`components/forms/booking-fields.tsx:360-396`, `lib/booking-schema.ts:110`), health-data warning on the notes field.
- SEO/AEO note: none; legal hygiene.
- Client input needed: grievance officer identity + contact; confirmed retention periods.
- Effort: S.

**F-09 · MEDIUM · 8.1(iii)/(ix), Explanation II · C1/C6 · "First in Tamil Nadu" superlatives staged behind a flag**
- Location: `data/claims.ts:26-55` — three claims, all `substantiated: null`: "First centre in South Tamil Nadu for fetoscopic procedures", "First in Tamil Nadu for fetal neurosonogram", "First in the region with in-house genetic counselling". Render paths: `components/home/firsts-strip.tsx:50-67,104` (chip + card claim text), `app/about/page.tsx:50-66` (timeline `claimTitle`), `data/services.ts:594-597` and `:726-729` (claim sentences injected into service copy), hero mobile carousel (`hero.tsx:106-130` renders `firsts` titles). `claimIsLive` (`claims.ts:61-65`) returns true whenever `showPending` — i.e. every preview deployment — or when `substantiated` flips to `true`.
- Why it breaches: "first/only" claims are permitted only when objectively verifiable through an independent, transparent method; all three are currently unevidenced. They are correctly hidden in production today, but they are live on every preview build and one data edit away from the public site with no verification gate beyond a flag.
- Compliant alternative: safest is to delete `claimText`/`claimTitle` strings and the claim plumbing so the claim-free descriptions are the only copy. If the client wants any claim kept, require written, independently verifiable evidence (e.g. a dated public record or registry showing firstness, the awarding/recording body and basis) before `substantiated` may be set `true`, and add the evidence note to `data/claims.ts`. "Since 2012" / "14 years" style factual copy stays.
- SEO/AEO note: factual equivalents ("Fetoscopic procedures at our Trichy centre") rank identically for local intent; the superlative added nothing citable.
- Client input needed: documentary evidence for each claim, or agreement to remove.
- Effort: S.

**F-10 · MEDIUM · 9.2 · C5 · Doctor portraits used in promotional card contexts and as share images** *(JUDGEMENT — low-risk interpretation recommended)*
- Location: home lead-doctor card — large portrait beside "Book with Dr Malathi" and highlight chips (`components/home/doctors-section.tsx:94-179`); team cards with portrait + "Book" buttons (`:181-232`); doctor profile page sets `openGraph.images` to the portrait (`app/doctors/[slug]/page.tsx:42`); `Person` schema `image` is the portrait (`lib/schema.ts:167`); reviewer avatars on every guide. Live site renders all of these.
- Why it breaches (JUDGEMENT): a plain photo on a profile/directory page for identification is low risk, but the same portraits are used as share/OG images and inside promotional booking cards — promotional publicity use of a doctor's photograph.
- Compliant alternative: keep one plain portrait on each profile page and the `/doctors` directory (identification). Remove the portrait from `openGraph.images` on doctor pages (use the default branded OG card from `app/opengraph-image.tsx`). Consider toning the home lead card toward credentials text rather than portrait-led promotion; keep the "Book" CTA as a plain appointment action, not paired with the portrait as an endorsement.
- SEO/AEO note: negligible; OG image change only affects share-preview appearance.
- Client input needed: none.
- Effort: S.

### LOW

**F-11 · LOW · 8.1(i)/(ii) · C10 · Always-on solicitation surfaces** *(JUDGEMENT — recommend keeping, documented)*
- Location: fixed mobile bottom bar with Call/WhatsApp/Book on every page (`components/site/mobile-bottom-bar.tsx`); floating WhatsApp button on desktop (`components/site/whatsapp-float.tsx`); booking sheet opens only on click (`components/booking/booking-sheet.tsx`). No pop-ups, exit-intent, countdowns or auto-opening chat exist — verified.
- Why flagged: persistent book/contact chrome sits at the edge of "solicitation"; the low-risk reading is that these are factual contact/appointment controls, which the guidelines allow.
- Compliant alternative: none required; if being conservative, the floating WhatsApp button could be removed (the bar already covers it on mobile and contact details are in the footer).
- Client input needed: none. · Effort: S if changed at all.

**F-12 · LOW · 8.1(iii) · C1/C6 · Unconfirmed factual anchors**
- Location: `lib/site.ts:6` (`foundedYear = 2012`, `foundedYearConfirmed = false`; the file's own TODO notes the copy has said both "13 years" and "14"); live copy renders "since 2012", "14 years of specialist scans…" (`hero.tsx:42-47`), "14 years in fetal medicine" (`doctors.ts:72`); hours render "Mon - Fri: 9:00 AM - 9:00 PM" while Saturday is "please call to confirm" (`contact/page.tsx:89-93`, `saturdayHoursConfirmed = false`).
- Why flagged: factual claims must be verifiable; the codebase itself flags the founding year and Saturday hours as unconfirmed.
- Compliant alternative: confirm founding year and weekly hours with the client, then set the confirmation flags; if unsure, drop "14 years"/"since 2012" to neutral wording until confirmed.
- Client input needed: founding year; weekly schedule. · Effort: S.

### Off-site checklist (C16)

N/A — no social-media or platform profiles are linked from the site (`site.socials` is empty). Note: the codebase contains a dormant `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` slot that would publish a "Read more reviews on Google" CTA; if the clinic's Google Business Profile, WhatsApp Business or any Practo/Justdial listing is managed separately, apply the same rules there manually (no testimonial solicitation, no before/after, no offers, registration number on profile posts, AI labels on AI content) — and do not add the review CTA to the site, as review solicitation is prohibited under C2.

---

## Verified compliant / not findings

- No `AggregateRating`/`Review` schema; `MedicalClinic`, `Person`, `MedicalProcedure`, `FAQPage`, `Course` schema are factual.
- Consent checkbox is unticked-by-default and required on every form; server-side enforcement (`z.literal(true)`); notes field warns against sharing health details; honeypot + rate limits; leads go to a private Google Sheet + Resend email, disclosed in the privacy policy.
- No ad pixels, GA, Meta, session recording or cookies beyond Vercel Speed Insights (disclosed).
- PCPNDT compliance statements in the footer, service booking cards, guide disclaimer boxes and disclaimer page.
- Per-guide "for information, not a substitute for consultation" box on all guides (M5 satisfied).
- Awards shown carry body + year (Gold medal, ICOG Fellowship 2022) — compliant as independently verifiable.
- CME/grand-opening content is factual announcement material (8.2-compliant).
- No fees, packages, discounts, free offers or camps anywhere.
- No patient images, before/after photos or patient videos.
- llms.txt lists doctors/services factually — except the agency credit line flagged in F-02.
