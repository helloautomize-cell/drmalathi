# Windsurf prompt: Fellowship in the nav, CME in the gallery

Paste this after Windsurf has finished STEPs 1 to 7 of the fellowship prompt. If it is still working on those, wait until they are done.

---

Make these navigation and gallery changes. Match the existing components and styling exactly. Do not redesign anything else. Do not use em dashes anywhere in copy, code or comments. Do not commit.

## 1. Nav bar

- In `data/site.ts` `mainNav`, replace the "For doctors" dropdown (including the "Apply for training" item added earlier) with one plain link: `{ label: "Fellowship", href: "/fellowship" }`. Keep this order: About, Services, Patient Guides, Fellowship, Doctors, Gallery, Contact.
- In `components/site/site-header.tsx`, remove the `doctorLinks` dropdown code once nothing uses it. Check that the desktop nav renders Fellowship as a plain link with the same style, hover and focus ring as Doctors and Gallery.
- Active state: show Fellowship as active when the path starts with `/fellowship` or `/cme-activities`. Use whatever active-link logic the header already has, and add `aria-current="page"` only on an exact match.
- Mobile menu (`mobileLinks`): remove "CME Activities" and keep "Fellowship". Do not add "Apply for training".
- Footer: keep "Fellowship and Courses" and "CME Activities" as they are.

## 2. Gallery: new "CME and training" tab

- In `data/gallery.ts`, add a category `{ id: "cme", label: "CME and training" }` after "events". Keep "Events" for the clinic events (grand opening photos) and do not move or duplicate anything into it.
- Do not copy CME photos into `galleryImages`. In the gallery data layer, build the CME tab items from `cmeEvents` in `data/cme.ts`: every photo of every event, newest event first, with the event `id` and `title` attached to each item. Change the `GalleryImage` type as needed (for example an optional `eventId` and `eventTitle`). When a new event is added to `data/cme.ts`, it should show up in the gallery automatically.
- In `components/gallery/gallery-browser.tsx`, the CME tab uses the same grid and lightbox as the other tabs. Each CME photo shows its event title as a small caption, and the lightbox shows a "See event details" link to `/cme-activities#{eventId}`.
- On `/cme-activities`, give each event block `id={event.id}` and a `scroll-mt` value equal to the sticky header height, so the anchor links land correctly.
- Under the CME tab grid, add one line of text and a link: "Conclaves, workshops and hands-on training we have hosted for doctors." with the link "View all CME activities" to `/cme-activities`.
- Support `/gallery?tab=cme` so the tab can be linked directly. Validate the value against the category ids and fall back to the default tab. Update the gallery page intro to mention training events, for example: "A look at our reception, scan rooms, the spaces where we care for families, and the training events we host for doctors."

## 3. Linking the pages together

- `/fellowship`: the "From our training and CME events" section links to `/cme-activities`, with a second, smaller link "See photos in the gallery" to `/gallery?tab=cme`.
- `/cme-activities`: the existing "Train with us" banner at the bottom gets two buttons: "Explore the fellowship" (keep it) and a primary "Apply for training" linking to `/fellowship/apply`.

## 4. Checks

- Run typecheck, lint, tests and build, and fix all errors. Check that there are no em dashes in the changed files.
- Screenshot at 390px and 1440px: the header on `/`, `/fellowship` and `/cme-activities` (Fellowship active on the last two), the mobile menu, `/gallery?tab=cme` with the lightbox open, and one anchor jump from the lightbox to `/cme-activities`.
- Confirm that no CME photo appears in the "Events" tab and that no other gallery tab changed.
- STOP and give me the changed files list.
