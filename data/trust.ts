// Hidden trust slots. Populate with real, verifiable data and the sections
// appear automatically. Until then nothing renders.
// TODO: client to supply a Google Business profile rating, any awards or
// affiliations, a virtual tour link, and a video testimonial if available.

export const trust = {
  googleRating: null as { score: number; count: number; url: string } | null,
  awards: [] as { title: string; org: string }[],
  affiliations: [] as string[],
  virtualTourUrl: null as string | null,
  videoTestimonial: null as {
    poster: string;
    src: string;
    caption: string;
  } | null,
};

// Real-figure slots for the stats band. Populate with numbers the client can
// stand behind; each stat appears automatically once set. Until then only
// "13 years" and "3 regional firsts" render.
// TODO: client to supply verified counts.
export const stats = {
  scansPerformed: null as { value: number; label: string } | null,
  fellowsTrained: null as { value: number; label: string } | null,
  cmeEventsHosted: null as { value: number; label: string } | null,
};
