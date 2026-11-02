// Hidden trust slots. Populate with real, verifiable data and the sections
// appear automatically. Until then nothing renders.
// TODO: client to supply any awards or affiliations and a virtual tour link
// if available. Review and testimonial features were removed for NMC
// compliance and must not be re-added.

export const trust = {
  awards: [] as { title: string; org: string }[],
  affiliations: [] as string[],
  virtualTourUrl: null as string | null,
};

// Real-figure slots for the stats band. Populate with numbers the client can
// stand behind; each stat appears automatically once set.
// TODO: client to supply verified counts.
export const stats = {
  scansPerformed: null as { value: number; label: string } | null,
  fellowsTrained: null as { value: number; label: string } | null,
  cmeEventsHosted: null as { value: number; label: string } | null,
};
