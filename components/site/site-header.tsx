"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
      <Button
        size="lg"
        nativeButton={false}
        className="mt-4 bg-primary text-white hover:bg-primary-hover"
        render={<Link href="/contact" />}
      >
        <CalendarCheck aria-hidden="true" />
        Book Appointment
      </Button>
    </nav>
  );
}

export function SiteHeader() {
  const aboutLink = plainLinks[0];
  const restLinks = plainLinks.slice(1);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${site.name} home`}
        >
          {/* Compact mark on mobile: circular icon plus short name */}
          <Image
            src="/images/logo-icon.webp"
            alt=""
            width={36}
            height={36}
            priority
            className="size-10 sm:hidden"
          />
          <span className="ml-2.5 font-heading text-lg font-semibold text-plum sm:hidden">
            {site.shortName}
          </span>
          <Image
            src="/images/logo-xs.webp"
            alt={site.name}
            width={288}
            height={96}
            priority
            className="hidden h-14 w-auto sm:block lg:h-16"
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
          <Button
            size="lg"
            nativeButton={false}
            className="hidden bg-primary text-white hover:bg-primary-hover sm:inline-flex"
            render={<Link href="/contact" />}
          >
            <CalendarCheck aria-hidden="true" />
            Book Appointment
          </Button>
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
