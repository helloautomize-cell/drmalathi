import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Tamil, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileBottomBar } from "@/components/site/mobile-bottom-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { UtilityBar } from "@/components/site/utility-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { site } from "@/data/site";

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

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
});

// Index only the production deployment. Preview/non-production hosts build
// with noindex so staging URLs never reach search results.
const indexable =
  process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: { index: indexable, follow: indexable },
  title: {
    default: `${site.name} | Fetal Medicine Specialists in Trichy`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} ${notoTamil.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-plum focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <TooltipProvider>
          <UtilityBar />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileBottomBar />
          <WhatsAppFloat />
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
