# FMC Trichy website

Marketing site for **Trichy Fetal Medicine and Fertility Centre**
(`fmctrichy.com`). Next.js App Router, TypeScript, Tailwind CSS 4,
static-first pages with lead forms that email via Resend.

## Commands

```bash
npm run dev            # local dev server
npm run build          # production build (runs prebuild checks first)
npm start              # serve the production build
npm run lint           # eslint
npm run check:guides   # guide editorial rules (dashes, PCPNDT phrases)
npm run check:content  # same rules across all copy, plus markers
npm run check:launch   # launch gate: BLOCKERS / POST-LAUNCH lists
npm run process:images # rebuild image variants + data/images.generated.json
npm run check:images   # manifest/source sanity for image data
```

## Before you edit copy

- Read `LAUNCH-CHECKLIST.md` first: anything listed there must not be
  invented or guessed (registration numbers, roles, durations, consent).
- Editorial rules live in `lib/content-rules.ts` and run on every build:
  no em/en dashes, no sex-determination phrasing (PCPNDT), no invisible
  characters, no PLACEHOLDER/TODO/DRAFT markers in rendered copy.
- Medical review badges only render when a guide has
  `reviewStatus: "reviewed"` plus `reviewedAt`; drafts never show a
  reviewer.
- Facts pending client confirmation are typed-null fields
  (`data/site.ts`, `data/doctors.ts`, `data/claims.ts`) and render
  nothing while empty. Preview deploys show pending content; production
  hides it (`lib/env.ts`).

## Images

`data/image-sources.json` records where every brand image came from and
its licence. `license: "placeholder"` entries are launch blockers.
Parked images render nothing. To replace an image: drop the new source
into `assets/source-images/`, update the entry (source, `license`,
`licenseSource`, unpark), then `npm run process:images`.

## Deploy

Vercel. Production indexing requires `INDEXABLE=1` at build time;
previews are `noindex`. `npm run check:launch` fails a production build
while any blocker is open. See `docs/` for the audit, redirect map and
content requests.
