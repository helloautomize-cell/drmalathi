# Legacy URL redirect map (old LiteSpeed site -> new Next.js site)

Crawled: `https://fmctrichy.com` (static Bootstrap/LiteSpeed site, no robots.txt, no sitemap).
Every URL on the old site is listed below. Implement as permanent redirects (HTTP 308) in `next.config.ts` before the domain cutover.

## Pages

| Legacy URL | New target | Note |
| --- | --- | --- |
| `/` | `/` | Already maps. |
| `/index.html` | `/` | Canonicalised in the old nav. |
| `/index.html#about` | `/about` | Fragment is client-side; 308 to the page. |
| `/index.html#service` | `/services` | Old service section becomes the services index. |
| `/index.html#doctors` | `/doctors` | Old doctors section becomes the doctors index. |
| `/index.html#fellowship` | `/fellowship` | Old fellowship section maps to the new page. |
| `/index.html#appoinment` | `/contact` | Typo preserved from the old nav ("appoinment"). |
| `/cme-activities.html` | `/cme-activities` | Same name exists in the new site. |
| `/contact.html` | `/contact` | Same name exists in the new site. |
| `/doctors-details.html` | `/doctors` | Single page carried all three doctors. |
| `/doctors-details.html#malathi` | `/doctors/dr-malathi-g-prasad` | Anchor for Dr Malathi. |
| `/doctors-details.html#revathy` | `/doctors/dr-revathy-chandrasekharan` | Anchor for Dr Revathy. |
| `/gallery.html` | `/gallery` | Same name exists in the new site. |

Note: fragments (`#about`, `#malathi`, ...) never reach the server in an HTTP request, so they cannot be 301-matched server-side. The plain `/index.html` and `/doctors-details.html` redirects cover every fragment variant. These rows document intent for the client; only the path-level rows go into `next.config.ts`.

## Documents

| Legacy URL | New target | Note |
| --- | --- | --- |
| `/img/gallery/ISUOGTrichy-Materno-Fetal-Conclave.pdf` | `/cme-activities` | Only linked document on the old site. If the client wants it preserved, move the file to `public/docs/` and redirect to it instead (client decision). |

## Images

The old site referenced ~27 images under `/img/` (banner1-9.webp, service photos, doctor photos, about.jpg, feature.jpg, course1-3.webp). These are replaced by `public/images/` assets on the new site. No inbound image URLs need redirects unless image search indexing shows them; keep the old `/img/*` -> nothing (404 is acceptable) or map the five service photos to their closest `/images/services/*` equivalents if the client wants old image links to keep working.

## Proposed `next.config.ts` redirects (path-level only)

```ts
async redirects() {
  return [
    { source: "/index.html", destination: "/", permanent: true },
    { source: "/cme-activities.html", destination: "/cme-activities", permanent: true },
    { source: "/contact.html", destination: "/contact", permanent: true },
    { source: "/doctors-details.html", destination: "/doctors", permanent: true },
    { source: "/gallery.html", destination: "/gallery", permanent: true },
  ];
}
```
