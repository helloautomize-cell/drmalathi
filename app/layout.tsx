import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Tamil, Nunito_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AnalyticsEvents } from "@/components/analytics-events";
import { LazyToaster } from "@/components/shared/lazy-toaster";
import { RevealProvider } from "@/components/shared/reveal-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileBottomBar } from "@/components/site/mobile-bottom-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { UtilityBar } from "@/components/site/utility-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { site } from "@/data/site";
import { hasPublishedGuides } from "@/lib/guides";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

// Tamil glyphs appear only in testimonial quotes below the fold; skip the
// global preload and let the browser fetch it on demand.
const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
  preload: false,
});

// Index only the production deployment. Preview/non-production hosts build
// with noindex so staging URLs never reach search results.
const indexable =
  process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: { index: indexable, follow: indexable },
  title: {
    default: `${site.shortName} | Fetal Medicine Specialists in Trichy`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "sBnPD8YKUx6UcEMOxZXBabFP5IeFF3QEdlFYyYV33aA",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${nunito.variable} ${notoTamil.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-plum focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <TooltipProvider>
          <RevealProvider />
          <UtilityBar />
          <SiteHeader showGuides={hasPublishedGuides()} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileBottomBar />
          <WhatsAppFloat />
          <LazyToaster />
        </TooltipProvider>
        <SpeedInsights />
        <AnalyticsEvents />
      </body>
      <GoogleAnalytics gaId="G-LSMJ8P7HBT" />
    </html>
  );
}
