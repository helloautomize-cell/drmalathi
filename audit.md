# SEO / AEO / GEO Audit & Fix Prompts — Automize Media Labs

Oct 24, 2026 · @Mayank Chansouria

Run Prompt 1 in the client's repo, then Prompt 2 in the same repo.

## Prompt 1: Investigation

```markdown
You are a world-class SEO, AEO and GEO expert who audits YMYL medical websites built in Next.js. You miss no micro detail. This website is already built and already contains the doctors, credentials, registration numbers, services and contact details. Your job is to find every SEO, AEO and GEO gap in how that existing content is structured, written, linked, marked up and exposed to Google and AI bots.

Do not change any code in this step. Only investigate and write the report. If something only the client can supply is missing from the site (for example a doctor's registration number or photo), do not stop: log it as a P3 "Needs client input" item and continue. Every finding must include evidence: file path and line, URL, or a raw HTML snippet.

HOW TO CHECK
- Run the production build (npm run build && npm run start) or use the live URL.
- Fetch pages with curl, without JavaScript, using these user agents: Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Applebot. What is not in the raw HTML is invisible to AI bots.
- Audit every pillar page, every supporting article, every service page, every doctor page, and the home, about and contact pages.

CHECKLIST (mark each PASS / FAIL / PARTIAL with evidence)

Crawling and indexing
1. robots.txt exists, references the sitemap, and does not block content, CSS, JS or images.
2. AI bots are allowed: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot.
3. No middleware, Cloudflare or Vercel firewall rule returns 403, 429 or a challenge to these bots.
4. sitemap.xml lists every indexable page with absolute production URLs and real lastmod dates (not the build date), and nothing that redirects, 404s or is noindex.
5. llms.txt exists and summarises the site, doctors, services and key pages.
6. No accidental noindex in metadata, headers or middleware. Preview/vercel.app URLs are noindex.
7. metadataBase is set. Every page has a self-referencing absolute canonical on the production domain.
8. One version of the site only (https, www or non-www, trailing slash), all others 301/308 to it. No redirect chains.
9. Unknown URLs return a real 404.

Every word visible to Google and AI bots
10. Main content, headings, FAQs, author/doctor byline, dates, internal links and schema are all in the raw server HTML.
11. No content loaded only on the client (useEffect fetches, accordions or tabs that are not in the DOM, read-more that renders later).
12. All internal links are real <a href> via next/link, not onClick navigation.

On-page
13. Unique title (50–60 characters) and meta description (140–160 characters) on every page.
14. One H1 per page, clean H2/H3 hierarchy.
15. Clean, descriptive URLs that reflect the pillar > supporting hierarchy.
16. Every image has descriptive alt text, width/height, and uses next/image.
17. Open Graph and Twitter tags on every page.
18. Visible breadcrumbs on every inner page.
19. Core Web Vitals on mobile: LCP under 2.5s, INP under 200ms, CLS under 0.1 (Lighthouse on home, a pillar, an article, a doctor page).
20. No broken internal links and no internal links pointing to redirects.

Schema
21. One connected @graph per page with stable @id values: Organization / MedicalClinic / MedicalOrganization, WebSite, WebPage.
22. Articles use MedicalWebPage or Article with author, reviewedBy, datePublished, dateModified, lastReviewed, about (the medical condition or procedure), publisher.
23. Doctor pages use Physician / Person with qualifications, registration number, specialty, affiliation, image and sameAs, taken from what the page already shows.
24. Service pages use MedicalProcedure / MedicalTherapy / Service; condition pages use MedicalCondition.
25. BreadcrumbList on every inner page; FAQPage wherever FAQs exist.
26. Schema matches visible content exactly. No duplicate, conflicting, placeholder or hardcoded copy-paste schema. Valid JSON.

YMYL and E-E-A-T
27. Every doctor has a dedicated, crawlable profile page showing photo, qualifications, registration number, experience, specialties and affiliations, linked from every article they wrote or reviewed.
28. Every medical article shows "Written by" and "Medically reviewed by" (both linked to the doctor page), plus published and last updated dates, near the top.
29. Trust pages exist and are linked in the footer: About, Contact (with address, phone, map), Editorial Policy, Medical Disclaimer, Privacy Policy, Terms.
30. Medical claims cite authoritative sources (PubMed, WHO, ICMR, NIH, specialty guidelines) and every cited link works.
31. No risky claims: "100% cure", "guaranteed", "painless", "best doctor in the city", unsourced statistics.
32. Condition and symptom pages include "when to see a doctor" guidance.
33. Content shows first-hand clinical experience and Indian context (INR costs, local hospitals, insurance), not generic encyclopedia text.
34. Clinic name, address and phone are identical across the site and schema.

Pillar and supporting content
35. Every pillar has 5 supporting articles. List each cluster.
36. The pillar links to all 5 supporting articles inside the body copy.
37. Each supporting article links back to its pillar early in the content, and to at least 2 sibling articles.
38. Pillar and supporting articles link to the relevant service page and doctor page.
39. Anchor text is descriptive and varied. No "click here" or "read more".
40. No orphan pages; every important page is within 3 clicks of home.

FAQs
41. Every pillar, supporting, service and condition page has 4–8 FAQs that are real patient questions and unique to that page.
42. FAQ answers start with a direct answer and are 40–60 words.
43. FAQs are in the raw HTML and match the FAQPage schema word for word.

Entities, keywords and semantic writing
44. For each page, name the primary entity and the related entities a top-ranking page covers (symptoms, causes, risk factors, tests, treatments, recovery, cost, specialist). List the missing ones.
45. The primary entity is defined in the first 100 words with a direct, quotable answer.
46. Each H2 answers one clear question and names the entity again, so the section makes sense if an AI quotes it alone.
47. Medical term and plain term are used together on first mention (e.g. "myocardial infarction (heart attack)").
48. Primary keyword appears naturally in title, H1, URL, first 100 words, one H2 and meta description. No stuffing.
49. No keyword cannibalisation (two pages targeting the same keyword and intent).
50. Content includes quotable specifics for AI answers: numbers with sources, INR costs, timelines, comparison tables.

AI writing and agent fingerprints
51. ChatGPT tells: delve, tapestry, realm, landscape, navigate, embark, journey, unlock, elevate, empower, seamless, robust, pivotal, crucial, vital, myriad, testament, holistic, game-changer, in today's fast-paced world, it's important to note, when it comes to, whether you're X or Y, comprehensive guide; "It's not just X, it's Y"; groups of three; every bullet starting with a bold label and colon; "In conclusion"; Title Case headings; emoji.
52. Claude tells: heavy em dashes, "Here's the thing", "That said", "The reality is", "genuinely", "nuanced", "straightforward", "The bottom line", hedging on every point.
53. General AI tells: uniform sentence and paragraph length, same intro template on every page, same section order on every article, no specific numbers or names, US spelling and US context.
54. Devin / Windsurf fingerprints: Lorem ipsum, John Doe, example.com, placeholder phone numbers, TODO/FIXME comments, console.log, mock data in production, "Create Next App" metadata, test/demo pages that are indexable, identical meta descriptions, FAQs, alt text or schema copied across pages, hydration or build warnings.

Extra checks
55. html lang="en-IN", favicon and manifest present, HTTPS everywhere with no mixed content.
56. Service and location pages are unique (not city-name-swapped copies), mention the city or area naturally, and match the Google Business Profile name, address and phone.
57. Key medical entities are linked to Wikipedia, Wikidata or MeSH through schema sameAs where useful, and the same term is used for the same thing across all pages.
58. Each page answers the People Also Ask, cost and "X vs Y" questions for its topic. List the missing questions per page.
59. Reading level is grade 7–9. Flag any medical fact that looks outdated or wrong for a doctor to check.
60. No self-serving review or rating schema, no fake testimonials, no stock or AI images used as doctor photos.
61. No claims that conflict with NMC advertising ethics or the Drugs and Magic Remedies Act (cure claims, guaranteed results).
62. External source links are normal links; sponsored or affiliate links use rel="sponsored".
63. For the 5 most important queries, state what an AI answer engine (Google AI Overviews, ChatGPT, Perplexity, Claude) would need to quote this site, and what is missing.
Give every content page an AI-likeness score from 0 to 100 and quote its 5 worst sentences.

OUTPUT
Create /seo-audit/AUDIT_REPORT.md with:
1. Overall score out of 100 and a score per area: Crawling & AI-bot access, Technical, Schema, E-E-A-T, Pillar linking, FAQs, Entities & semantics, Keywords, Content humanness, AEO/GEO readiness.
2. The checklist table with PASS / FAIL / PARTIAL and evidence.
3. Every issue with: ID, priority (P0 critical, P1 high, P2 medium, P3 low), affected pages/files, evidence, and the exact fix.
4. A page-by-page table: URL, page type, cluster, primary keyword, has byline, has dates, has FAQ, schema present, internal links in/out, AI-likeness score.
5. A cluster table: pillar, its supporting articles, and which required links are missing.
6. Needs from client (lowest priority): a short list of anything missing from the site that only the client can provide, such as a registration number or doctor photo.

Also save /seo-audit/audit.json with the same issues so the fix step can use it. Finish with a short chat summary: overall score, number of P0 and P1 issues, and the top 5 fixes.
```

## Prompt 2: Fix everything + weekly client report

```markdown
You are a world-class SEO, AEO and GEO engineer and senior medical content editor. Read /seo-audit/AUDIT_REPORT.md and /seo-audit/audit.json and fix every issue in this Next.js website, P0 first, then P1, P2, P3.

The website already contains the doctors, credentials, registration numbers, services, addresses and phone numbers. Use that existing data for bylines, doctor pages, schema and llms.txt. Do not invent any medical fact, statistic, review, testimonial or citation. If something only the client can supply is missing (for example a registration number), skip that one field, put nothing fake in its place, note it for the report, and carry on. It must never block the other fixes.

HOW TO WORK
- Create a git branch seo-fixes/<date>. Commit per category with the issue IDs in the message.
- After each category run lint, typecheck and build, and fix any errors before moving on.
- Do not change existing URLs. If a URL must change, add a permanent redirect and update the sitemap and internal links.
- Keep a running log in /seo-audit/CHANGELOG_SEO.md so work can continue in a new chat if needed.

WHAT TO FIX

1. Crawling and AI-bot access
- app/robots.ts allowing Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended. Block only /api and admin. Link the sitemap.
- Remove anything in middleware or headers that blocks these bots. If the block is in Cloudflare or Vercel settings, note the exact setting in the report.
- app/sitemap.ts generated from real content with real lastmod dates and only indexable, canonical URLs.
- metadataBase on the production domain, absolute self-canonical on every page, noindex on preview deployments, one host version with permanent redirects, real 404s.
- Create /llms.txt from the site's own data: what the clinic does, doctors with credentials, services, location, links to pillar, service and doctor pages.

2. Every word visible to Google and AI bots
- Move content out of client-only rendering into Server Components. Render tabs, accordions and FAQs in the HTML and only toggle visibility with CSS or details/summary.
- Replace onClick navigation with next/link.
- Confirm with curl (Googlebot, GPTBot, ClaudeBot) that content, FAQs, byline, dates, links and schema are in the raw HTML.

3. Schema
- Build one reusable schema module that outputs a single @graph per page with stable @ids: Organization / MedicalClinic, WebSite, WebPage, BreadcrumbList.
- Articles: MedicalWebPage with author, reviewedBy, datePublished, dateModified, lastReviewed, about, publisher, citation.
- Doctor pages: Physician with qualifications, registration number, specialty, affiliation, image, sameAs, from the doctor data already on the site.
- Service pages: MedicalProcedure / Service. Condition pages: MedicalCondition.
- FAQPage generated from the same data that renders the visible FAQs.
- Remove duplicate, conflicting, placeholder and copy-pasted schema. Validate every template.

4. E-E-A-T
- Doctor profile pages showing the existing photo, qualifications, registration number, experience, specialties and affiliations, plus a list of their articles.
- Byline at the top of every article: Written by and Medically reviewed by (linked to the doctor pages), published date and last updated date.
- Make sure About, Contact, Editorial Policy, Medical Disclaimer, Privacy and Terms pages exist and are linked in the footer.
- Add a Sources section with working citations to authoritative sources. Remove broken or unrelated citations.
- Remove risky claims ("100% cure", "guaranteed", "painless", "best doctor"). Add "when to see a doctor" on condition and symptom pages.
- Make clinic name, address and phone identical everywhere.

5. Pillar and supporting linking
- Pillar links to all 5 supporting articles inside the body copy.
- Each supporting article links to its pillar early in the content, to at least 2 siblings, and to the relevant service and doctor page.
- Breadcrumbs Home > Pillar > Supporting. Add a related-articles block at the end of each supporting article.
- Descriptive, varied anchors. Fix broken links, links to redirects and orphan pages.
- If a pillar has fewer than 5 supporting articles, list the missing topics in the report as next content; do not write them now.

6. FAQs
- 4–8 unique, real patient FAQs on every pillar, supporting, service and condition page. Direct answer first, 40–60 words, consistent with the page.

7. Entities, keywords and semantic writing
- Define the primary entity in the first 100 words with a direct, quotable answer.
- Add the missing related entities from the audit as proper sections, using the site's existing medical facts or cited sources.
- Each H2 answers one question and names the entity again. Use medical and plain terms together on first mention. Add comparison tables and numbered steps where useful.
- Primary keyword in title, H1, first 100 words, one H2 and meta description, naturally. Fix cannibalisation as the audit recommends.
- Unique titles (50–60 characters) and meta descriptions (140–160 characters). Open Graph and Twitter tags on every page.

8. Remove the AI sound
Rewrite every page the audit flagged so it reads like an experienced Indian doctor talking to a patient: warm, direct, specific.
- Remove every word and pattern listed in checklist items 51–53 of the audit, including em dashes, emoji, Title Case headings, bold-label bullets, "In conclusion" endings and identical intros.
- Vary sentence length. Short paragraphs. Use "you". Indian English, INR, Indian context.
- Keep every medical fact. Do not add new medical claims without a cited source.
- After rewriting, scan again: zero banned words allowed.

9. Codebase clean-up
- Remove placeholders, mock data, TODO comments, console.log, unused and duplicate components, default Next.js metadata, and indexable test/demo pages.
- Descriptive alt text on every image. Fix hydration and build warnings.

10. Performance
- next/image with width/height and priority on the LCP image, next/font, next/script for third-party scripts, "use client" only where needed. Fix CLS.
- Re-run Lighthouse mobile on the same pages as the audit.

11. Extra checks
- Fix everything from audit items 55–63: lang="en-IN", favicon and manifest, mixed content, unique local and service pages, entity sameAs links and consistent terms, missing People Also Ask, cost and "vs" questions (as sections or FAQs), reading level, self-serving ratings and fake testimonials removed, non-compliant claims removed, correct rel attributes, and the quotable passages needed for the top 5 AI queries.

VERIFY
Re-run the full audit checklist on the fixed build and recompute every score the same way the audit did.

WEEKLY CLIENT REPORT
Create /seo-audit/WEEKLY_REPORT_<date>.md, written for a busy doctor or clinic owner, in plain language, 1–2 pages, using only real numbers from the changelog:

Weekly SEO & AI Search Report — <Client name> — Week of <date>
1. Summary: 4–5 lines on what we did this week and the biggest improvement.
2. Website health score: table of each area with Before → After out of 100, plus the overall score Before → After.
3. Work completed: grouped in plain language with counts, for example "Made all 48 pages fully readable to Google, ChatGPT, Claude and Perplexity", "Added doctor bylines and review dates to 31 articles", "Linked 6 topic guides to their 30 supporting articles", "Rewrote 14 articles to sound like your doctors, not AI".
4. Pages improved: table of page, link and what changed in one line.
5. What this means for you: 3–5 points on outcomes (more trust from Google on medical topics, better chance of being quoted in AI answers, better patient experience, more enquiries over time). No ranking guarantees.
6. What we need from you: a short, specific list of the details missing from the website (for example "Dr. X's medical council registration number"), so we can add them next week.
7. Next week: Google Search Console submission and indexing, monitoring, adding the details you send, and the next content to create.

Finish with a chat summary: overall score before → after, issues fixed, issues remaining and why, and the path to the weekly report.
```