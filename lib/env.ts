/**
 * Deployment environment gates.
 *
 * `isProduction` is true only on the real production deployment (Vercel
 * VERCEL_ENV=production) or on a local build run with INDEXABLE=1, which is
 * the production-equivalent test mode used by the audit scripts.
 *
 * `showPending` is the inverse: content flagged as unconfirmed (pending
 * consent, placeholder roles, unconfirmed durations) renders on preview
 * deploys so editors can check it, and never reaches production.
 */
export const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";

export const showPending = !isProduction;
