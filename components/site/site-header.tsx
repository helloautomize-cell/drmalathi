"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { BookingCta } from "@/components/booking/booking-sheet";
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
import { Container } from "@/components/shared/container";
import { servicesByCategory, serviceCategories } from "@/data/services";
import { mainNav, site } from "@/data/site";

const plainLinks = mainNav.filter((item) => !("mega" in item && item.mega));

function MegaMenuContent() {
  return (
    <div className="grid w-[min(92vw,44rem)] grid-cols-1 gap-6 p-6 sm:grid-cols-3">
      {serviceCategories.map((category) => (
        <div key={category.id}>
          <p className="mb-2 text-xs font-bold tracking-[0.12em] uppercase text-primary">
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

function MobileNav() {
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-1 p-4 pt-0">
      {mainNav.map((item) =>
        "mega" in item && item.mega ? (
          <Accordion key={item.href}>
            <AccordionItem value="services" className="border-b-0">
              <AccordionTrigger className="text-base font-semibold text-ink hover:no-underline">
                Services
              </AccordionTrigger>
              <AccordionContent className="h-auto pb-4 [&_a]:no-underline">
                <div className="flex flex-col gap-3">
                  {serviceCategories.map((category) => (
                    <div key={category.id}>
                      <p className="mb-1 text-xs font-bold tracking-[0.12em] uppercase text-primary">
                        {category.label}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {servicesByCategory(category.id).map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-1 py-2.5 text-base font-semibold text-ink hover:bg-muted hover:text-primary"
          >
            {item.label}
          </Link>
        )
      )}
      <BookingCta
        source="mobile-nav"
        label="Book Appointment"
        size="lg"
        className="mt-4"
      />
    </nav>
  );
}

export function SiteHeader() {
  const aboutLink = plainLinks[0];
  const restLinks = plainLinks.slice(1);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${site.name} home`}
        >
          <Image
            src="/images/logo-transparent.png"
            alt={site.name}
            width={288}
            height={96}
            priority
            className="h-10 w-auto sm:h-14 lg:h-16"
          />
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href={aboutLink.href} />}
                className={navigationMenuTriggerStyle()}
              >
                {aboutLink.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem value="services">
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuContent />
              </NavigationMenuContent>
            </NavigationMenuItem>
            {restLinks.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  render={<Link href={item.href} />}
                  className={navigationMenuTriggerStyle()}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <BookingCta
              source="header"
              label="Book Appointment"
              size="lg"
            />
          </div>
          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-muted lg:hidden"
                />
              }
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 gap-0 p-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="font-heading text-lg">
                  {site.shortName}
                </SheetTitle>
              </SheetHeader>
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
