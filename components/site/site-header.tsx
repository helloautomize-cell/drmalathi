"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Clock, Globe2, Menu, Phone } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
import { ListRow } from "@/components/cards/mobile-cards";
import { Container } from "@/components/shared/container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { servicesByCategory, serviceCategories } from "@/data/services";
import { mainNav, site } from "@/data/site";

type NavLinkItem = Extract<(typeof mainNav)[number], { href: string }>;
const plainLinks = mainNav.filter(
  (item): item is NavLinkItem =>
    "href" in item && !("mega" in item && item.mega)
);
const doctorLinks = mainNav.find((item) => "children" in item)?.children ?? [];
const mobileLinks = [
  { label: "About", href: "/about" },
  { label: "Patient Guides", href: "/guides" },
  { label: "Fellowship", href: "/fellowship" },
  { label: "CME Activities", href: "/cme-activities" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "International Patients", href: "/international-patients" },
  { label: "Contact", href: "/contact" },
];

function MegaMenuContent() {
  return (
    <div className="grid w-[min(92vw,44rem)] grid-cols-1 gap-6 p-6 sm:grid-cols-3">
      {serviceCategories.map((category) => (
        <div key={category.id}>
          <p className="mb-2 text-xs font-bold tracking-[0.12em] text-primary uppercase">
            {category.label}
          </p>
          <ul className="space-y-0.5">
            {servicesByCategory(category.id).map((service) => (
              <li key={service.slug}>
                <NavigationMenuLink
                  render={<Link href={`/services/${service.slug}`} />}
                  className="block text-sm"
                >
                  {service.name}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="sm:col-span-3">
        <NavigationMenuLink
          render={<Link href="/services" />}
          className="inline-flex items-center text-sm font-semibold text-primary"
        >
          View all services
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function MobileNav({
  pathname,
  onNavigate,
  showGuides,
}: {
  pathname: string;
  onNavigate: () => void;
  showGuides: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="pt-4 pb-3" data-ga-location="nav">
        <BookingCta
          source="mobile-nav"
          label="Book appointment"
          trigger={
            <button
              type="button"
              onClick={onNavigate}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-white"
            >
              <CalendarCheck className="size-5" aria-hidden="true" />
              Book appointment
            </button>
          }
        />
      </div>
      <nav aria-label="Mobile" className="border-t border-rose-tint">
        <ListRow label="About" href="/about" current={pathname === "/about"} onClick={onNavigate} className="text-lg" />
        <Accordion>
          <AccordionItem value="services" className="border-b border-rose-tint">
            <AccordionTrigger
              className={`min-h-14 px-1 text-lg font-semibold hover:no-underline ${pathname.startsWith("/services") ? "border-l-4 border-l-primary pl-3 text-primary" : "text-ink"}`}
            >
              Services
            </AccordionTrigger>
            <AccordionContent className="h-auto pb-4">
              <div className="space-y-4 pl-3">
                {serviceCategories.map((category) => (
                  <div key={category.id}>
                    <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      {category.label}
                    </p>
                    <div>
                      {servicesByCategory(category.id).map((service) => (
                        <ListRow
                          key={service.slug}
                          label={service.name}
                          href={`/services/${service.slug}`}
                          current={pathname === `/services/${service.slug}`}
                          onClick={onNavigate}
                          className="min-h-12 text-base font-medium"
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <ListRow label="View all" href="/services" current={pathname === "/services"} onClick={onNavigate} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {mobileLinks
          .slice(1)
          .filter((l) => showGuides || l.href !== "/guides")
          .map((item) => (
          <ListRow
            key={item.href}
            label={item.label}
            href={item.href}
            current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))}
            onClick={onNavigate}
            className="text-lg"
          />
        ))}
      </nav>
      <div className="mt-6 rounded-2xl bg-blush p-3">
        <ListRow label="Call" meta={site.phones[0].label} href={site.phones[0].href} icon={Phone} onClick={onNavigate} />
        <ListRow label="WhatsApp us" meta={site.whatsapp.label} href={site.whatsapp.messageHref} icon={WhatsAppIcon} onClick={onNavigate} />
        <ListRow label="International line" meta={site.internationalPhone.label} href={site.internationalPhone.href} icon={Globe2} onClick={onNavigate} />
        <div className="flex items-start gap-3 px-1 pt-4 text-sm/[20px] text-ink-muted">
          <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>{site.hours}</span>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ showGuides = true }: { showGuides?: boolean }) {
  const aboutLink = plainLinks[0];
  // "Patient Guides" is dropped everywhere while no guide is published;
  // the gate is hasPublishedGuides() in lib/guides.ts.
  const restLinks = plainLinks
    .slice(1)
    .filter((l) => showGuides || l.href !== "/guides");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 4);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? "border-b border-border shadow-soft" : "border-b border-transparent md:border-border"}`}
    >
      <Container className="flex h-[60px] items-center justify-between gap-4 md:h-16 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
          <Image
            src="/images/logo-transparent.png"
            alt={site.name}
            width={288}
            height={96}
            priority
            className="h-14 w-auto lg:h-16"
          />
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href={aboutLink.href} />} className={navigationMenuTriggerStyle()}>
                {aboutLink.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem value="services">
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuContent />
              </NavigationMenuContent>
            </NavigationMenuItem>
            {restLinks.map((item) =>
              item.label === "Patient Guides" ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink render={<Link href={item.href} />} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : null
            )}
            <NavigationMenuItem value="for-doctors">
              <NavigationMenuTrigger>For doctors</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-56 space-y-1 p-4">
                  {doctorLinks.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-blush"
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {restLinks.map((item) =>
              item.label === "Patient Guides" ? null : (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink render={<Link href={item.href} />} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <BookingCta source="header" label="Book appointment" size="lg" />
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-11 items-center justify-center rounded-xl text-ink transition-colors lg:hidden"
                />
              }
            >
              <Menu className="size-6" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent mobileSide="right" side="right" className="w-full gap-0 bg-white p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border px-4 py-3">
                <SheetTitle className="font-heading text-lg">{site.shortName}</SheetTitle>
              </SheetHeader>
              <MobileNav
                pathname={pathname}
                onNavigate={() => setMenuOpen(false)}
                showGuides={showGuides}
              />
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
