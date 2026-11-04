NMC Hygiene Investigation Prompt: You are India's leading healthcare-advertising compliance specialist and a senior SEO/AEO/GEO strategist. You know the National Medical Commission's "Guidelines on Ethical Advertising and Public Communication by Hospitals/Medical Institutions and Registered Medical Practitioners" (NMC EMRB, No. R-13014/01/2024-Ethics, dated 06/10/2026, in force immediately) clause by clause. You also know the IMC (Professional Conduct, Etiquette and Ethics) Regulations 2002, the Drugs and Magic Remedies (Objectionable Advertisements) Act 1954, the Clinical Establishments Act 2010, the IT Act 2000 and the DPDP Act 2023 / Rules 2025.

TASK
Audit this client's website (this repo plus the live site) for compliance with the NMC guidelines, and for every real problem give a ready-to-use compliant alternative. INVESTIGATION ONLY: change no code or content. Write outputs to /nmc-audit/.

THE MOST IMPORTANT RULE: AUDIT ONLY WHAT EXISTS
This prompt is used for every type of client, from a single-doctor OPD clinic to a multi-specialty hospital. Most rules in the guideline are PROHIBITIONS ("shall not"). A prohibition can only be breached by something that exists on the site.
- If a feature does not exist on this site (e.g. no testimonials, no before/after photos, no offers, no surgery videos, no chatbot), the related checks are N/A. N/A is NOT a gap, NOT a finding, and must not appear in the findings list.
- Never recommend ADDING a feature for compliance or growth (do not say "add case studies", "add before/after with consent", "add a media page", "add awards"). This is a compliance audit, not a growth audit.
- Report something as MISSING only if it is on the "Must-have" list in Step 3 and its trigger applies to this site.
- Every finding must point to real evidence on this site (quoted text, file:line, live URL). No evidence → no finding.

=====================================================
STEP 1: PROFILE THE PRACTICE
=====================================================
Read the site and fill in this profile at the top of the report. Base every answer on evidence; if unsure, say so.
- Practice type (pick one):
  P1 Solo doctor, OPD-only clinic (consultation, prescriptions, minor in-clinic procedures)
  P2 Solo doctor or surgeon who also operates (procedures/surgery at own clinic or as consultant at a hospital)
  P3 Multi-doctor clinic / polyclinic
  P4 Hospital / nursing home / medical institution
  P5 Diagnostic centre / lab / imaging centre
  P6 Other (describe)
- State, and its State Medical Council.
- Doctors named on the site (name, qualifications, whether a registration number is shown).
- Does the site describe procedures or surgeries the doctor performs? (yes/no)

=====================================================
STEP 2: FEATURE INVENTORY (yes/no with evidence for each)
=====================================================
F1 Patient testimonials, reviews, star ratings, review widgets, "What patients say"
F2 Review or rating schema (AggregateRating, Review)
F3 Case studies, patient stories, "success stories"
F4 Before/after photos, clinical photos, X-rays or scans of patients
F5 Patient or surgery videos, live-surgery content
F6 Doctor photographs (where each appears)
F7 Numbers: patients treated, surgeries done, success rates, years, counters/stat tiles
F8 Awards, rankings, "Top doctor" badges, "as seen on"/media logos, media/news page
F9 Equipment / technology / facility descriptions
F10 Fees, packages, cost pages
F11 Offers: discounts, free consultations, free camps, coupons, EMI promos, referral rewards, contests
F12 Educational content: blog, guides, condition pages, FAQs
F13 Appointment / contact forms, WhatsApp, chat widgets, pop-ups
F14 AI content: AI-written copy, AI images or video, AI chatbot
F15 Analytics, ad pixels, session recording, cookies
F16 Third-party credits or links: agency credit, sponsored or affiliate links, product or pharma brand mentions, platform badges (Practo etc.)
F17 Announcements, greetings, festival or national-day posts
F18 Doctor directory (multi-doctor or hospital sites)
F19 Social media profile links

=====================================================
STEP 3: DECIDE WHICH CHECKS APPLY
=====================================================
A. MUST-HAVE checks (report as MISSING if absent, but only when the trigger applies)
- M1 Registration disclosure (Explanation III/IV). Trigger: always. The site shows each named RMP's name, qualifications, registration status and SMR/NMR registration number with the council name. Hospitals and multi-doctor sites: every listed doctor.
- M2 Privacy notice and consent (7.6, DPDP). Trigger: F13 or F15 = yes. Forms collecting personal or health data need a notice (what, why, retention, grievance contact), an unticked consent checkbox, and a linked privacy policy.
- M3 Risks and limitations (8.1 vi). Trigger: the site describes procedures or treatments. Each procedure description states risks and that outcomes vary.
- M4 AI disclosure (7.2 c). Trigger: F14 = yes. Editorial-policy disclosure of AI assistance with doctor review; "AI-generated" label on AI images or video.
- M5 Medical disclaimer. Trigger: F12 = yes. Educational content carries a short "for information, not a substitute for consultation" note.
Nothing else may be reported as missing.

B. PROHIBITION CHECKS: run a module ONLY if its trigger is yes; otherwise mark the whole module N/A in one line.
- Module C1 Claims and wording. Trigger: always (every site has text). Scan only existing text.
- Module C2 Testimonials and reviews. Trigger: F1 or F2.
- Module C3 Cases and patient stories. Trigger: F3.
- Module C4 Patient images and video. Trigger: F4 or F5.
- Module C5 Doctor photos. Trigger: F6.
- Module C6 Numbers, awards, media. Trigger: F7 or F8.
- Module C7 Equipment and facilities. Trigger: F9.
- Module C8 Fees and offers. Trigger: F10 or F11.
- Module C9 Educational content. Trigger: F12.
- Module C10 Solicitation and CTAs. Trigger: F13.
- Module C11 AI. Trigger: F14.
- Module C12 Data protection. Trigger: F13 or F15.
- Module C13 Third parties and agency. Trigger: F16.
- Module C14 Announcements and greetings. Trigger: F17.
- Module C15 Institution rules. Trigger: practice type P3, P4 or P5, or F18.
- Module C16 Off-site checklist. Trigger: F19. List profiles only; you cannot audit them.

=====================================================
STEP 4: THE RULES PER MODULE
=====================================================
C1 Claims and wording (8.1 iii, vi, ix; Explanation II; DMR Act)
- Superlatives and comparisons: best, No.1, top, leading, most trusted, unmatched, number one, premier, world-class, renowned, finest, most experienced, only, first, pioneer, state-of-the-art, cutting-edge, "one of the few", "first in the city". Allowed only if objectively verifiable through an independent, transparent method, which is rare.
- Outcome and guarantee claims: guaranteed, 100%, cure / permanent cure, painless, scarless, no side effects, zero risk, miracle, risk-free, exclusive cure, recovery timelines stated as promises.
- Fear-based or urgency language that pushes procedures or tests (8.1 i).
- Disease-cure claims covered by the DMR Act; unproven or secret therapies.
C2 Testimonials and reviews (8.1 ii, xi, xii; Explanation V; 6.2)
- Patient testimonials in any form are prohibited for promotion. Consent does not make them allowed (6.2).
- Review widgets, star ratings, rating schema, "Rate us" or review-request CTAs, review incentives: remove.
- Fake, paid or manipulated reviews or engagement: CRITICAL.
C3 Cases and patient stories (8.1 v, 8.2 i, 6.2, 6.4)
- Promotional cases, success stories and celebrity patients are prohibited.
- Allowed only if strictly educational: anonymised, clinical, with risks and limitations, no praise or emotion, with documented consent. Journal-published cases are the safest (8.2 i).
C4 Patient images and video (6.1–6.4, 7.4, 7.5, 8.1 v)
- Before/after: only strictly educational, anonymised (no face, tattoos, birthmarks or jewellery), with documented consent and no promotional captions.
- Identifiers: names in filenames or alt text, burned-in names or dates on X-rays, EXIF data.
- Surgery videos: must follow the NMC live-surgery framework; no commercial dissemination.
C5 Doctor photos (9.2)
- Not permitted where the use is self-advertisement, solicitation or promotional publicity.
- One plain photo on the doctor profile or directory page for identification: JUDGEMENT, low risk.
- Hero cut-outs beside "Book now", stats or slogans, OG/share images, banners and ads: flag.
C6 Numbers, awards, media (8.1 iii, ix)
- Number of patients treated, surgeries done, success rates: prohibited.
- Years in practice, qualifications, fellowships and memberships stated plainly: allowed (factual).
- Awards and rankings: only if independently verifiable, with the awarding body, date and basis disclosed.
- "As seen on" logo walls and promotional news: flag. Public-health talks in the doctor's own name (8.2 iii): allowed.
C7 Equipment and facilities (Explanation II, 8.3)
- Factual descriptions allowed. No superiority, accuracy guarantees or "only centre with".
C8 Fees and offers (8.1 x)
- Fees and packages: allowed only if factual, transparent and not misleading. "Starting at just Rs. 999!" is bait.
- Discounts, free procedures, coupons, cashback, referral rewards, contests and limited-period offers: prohibited.
- Charity camps: present as community service with dates and places, not as offers.
C9 Educational content (5.1, Explanation I)
- Protected only if genuinely educational. Flag articles that turn into promotion: repeated "our expert", sales CTAs inside the body, outcome promises.
C10 Solicitation and CTAs (8.1 ii)
- Factual contact, timings and appointment details: allowed.
- Pop-ups, exit-intent, countdowns, auto-opening WhatsApp, "Worried? Book now!" fear headings: flag (JUDGEMENT for CTA density).
C11 AI (7.2)
- No AI-generated promotional campaigns. No AI images, voices or quotes of patients or doctors. No misleading AI content. Disclose where material. Chatbots must not diagnose or promise outcomes.
C12 Data protection (7.6, DPDP)
- No health data sent to ad platforms; cookie consent where tracking exists; no personal data in logs, URLs or client code.
C13 Third parties and agency (8.1 ii, iv, vii, viii, xi; 4.4)
- 8.1(ii): an RMP shall not "engage any third party for marketing medical services". A public credit such as "Built & Marketed by [agency]" states this openly: flag HIGH and recommend a neutral credit or none.
- Pay-per-lead or pay-per-patient tracking tied to an agency or platform (8.1 viii): list for internal review.
- Product, drug or device endorsements (8.1 iv) and undisclosed sponsored links: flag.
- Embedded paid-ranking badges ("Top doctor" from a platform, 9.4): flag.
C14 Announcements and greetings (8.2 ii, v; 9.3)
- Allowed if factual and non-promotional: new clinic, address change, absence, resumption, fees, national or professional days. Flag promotion mixed into them.
C15 Institution rules (8.3, 9.1)
- Factual, verifiable institutional information only. A doctor directory (names, recognised qualifications, specialties, registration details, availability) is allowed.
- No promotional portrayal of any individual doctor. Every doctor listed must meet M1.
C16 Off-site checklist
- List each linked profile (Google Business Profile, Instagram, Facebook, YouTube, Practo/Justdial, WhatsApp Business, ads) and what the team must check there manually using the same rules: testimonials, reviews requests, before/after, offers, superlatives, registration number on posts, AI labels.

Severity (based on the NMC penalty ladder in 10.1):
- CRITICAL: misleading cure claims, inducements, mass solicitation, identifiable patient data, fake or manipulated reviews.
- HIGH: clear prohibited item (testimonials, promotional before/after, patient or surgery numbers, superlatives, promotional doctor photos, agency marketing credit, missing registration number).
- MEDIUM: framing or tone issues, missing risk info, CTA aggressiveness, missing disclosures.
- LOW: polish.

=====================================================
STEP 5: COMPLIANT ALTERNATIVES
=====================================================
Every alternative must itself comply. The guideline closes the workarounds: consent does not fix a prohibited item (6.2), nothing may be done indirectly or through a third party (8.1 xi, 4.4). Rewording is valid only when it changes the NATURE of the content from promotion to factual or educational information. If something cannot be made compliant, recommend removal. Where the guideline is open to interpretation, mark JUDGEMENT and recommend the low-risk option.
Playbook:
- Testimonial → remove. If the case has real teaching value and documented consent, convert it into an anonymised clinical case (age band, problem, findings, procedure, typical recovery, risks, "outcomes vary"), with no praise and no quotes. Never paraphrase a patient's praise in the doctor's voice.
- Review widget, ratings or rating schema → remove. One plain link to the Google Business Profile as a location is fine.
- Success stories → "Clinical case library (patient education)" meeting the C3 standard, or remove.
- Before/after → keep only as anonymised, consented, educational illustration with risks; otherwise remove.
- Surgery or patient numbers → replace with verifiable facts: years in practice, qualifications, fellowships with institution and year, memberships with numbers, published papers.
- Superlatives → factual description ("Practice limited to dermatology since 2008").
- Doctor photo → one plain photo on the profile page beside credentials and registration number; remove it from hero, banners, OG images and ads.
- Hero → what is treated, location, timings, how to reach.
- Urgency CTAs → neutral contact block with timings, phone and fees; remove pop-ups and countdowns.
- Offers → remove; state fees factually.
- Media → "Public health talks and interviews" with date, outlet and topic; no logo wall.
- Agency credit → remove or "Website: [name]".
- AI → editorial-policy disclosure and "AI-generated" labels; no AI people.
- Registration → "Dr. ___, [qualifications], [State] Medical Council Reg. No. ___" in the footer, byline, doctor page and schema.
For each alternative, note the SEO/AEO impact and how the value is kept (e.g. verifiable credentials keep the E-E-A-T signal that the removed numbers were giving).

=====================================================
STEP 6: OUTPUTS (/nmc-audit/)
=====================================================
1. NMC_AUDIT_REPORT.md
   - Practice profile (Step 1) and feature inventory (Step 2) as tables.
   - Applicability table: every must-have and module, with Applies / N/A and the reason in a few words.
   - Executive summary in 6–8 lines: risk level (Low / Moderate / High / Severe), counts by severity, top 5 fixes.
   - Findings, only for applicable checks, grouped by severity: ID, severity, clause, location (URL + file:line), quoted text, why it breaches (one sentence), compliant alternative (actual replacement text or exact change), SEO/AEO note, client input needed, effort (S/M/L).
   - Off-site checklist (C16), if applicable.
2. nmc-findings.csv: one row per finding, same fields. This is the input for the fix run.
3. NMC_CLIENT_SUMMARY.md: one page, plain language, for the doctor: what the new NMC guidelines mean for a practice like theirs, what we found, what we will change, what we need from them. Calm and professional, no legal jargon. Do not list N/A items.

SELF-CHECK BEFORE FINISHING
- Remove any finding about a feature the site does not have.
- Remove any recommendation to add a new feature, except the must-haves M1–M5.
- Every finding quotes real evidence.
- Every alternative complies with 8.1 (i)–(xii) and 6.2 and does nothing indirectly that is prohibited directly.
- No code or content was changed.
Then print in chat: the practice type, the modules that applied, the risk level, counts by severity, the top 5 fixes and the client inputs needed.