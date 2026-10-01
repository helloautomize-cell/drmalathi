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
