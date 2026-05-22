"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { site } from "@/content/site";
import { SiteLogo } from "./SiteLogo";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  // Close the drawer when the URL changes (back/forward, programmatic nav).
  // Adjust-state-during-render is the React-recommended pattern; using
  // useEffect would trigger a cascading-render lint warning.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus management:
  //  - On open: focus the first focusable inside the drawer.
  //  - While open: trap Tab within the drawer; Escape closes.
  //  - On close (only after a previous open): restore focus to the trigger.
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        triggerRef.current?.focus();
        wasOpen.current = false;
      }
      return;
    }
    wasOpen.current = true;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = Array.from(
      drawer.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-[var(--elev-1)]"
          : "bg-background border-b border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 -mx-1 px-1 rounded-md hover:opacity-90 transition-opacity"
        >
          <SiteLogo compactOnMobile />
        </Link>

        <nav
          aria-label="ניווט ראשי"
          className="hidden md:flex items-center gap-0.5"
        >
          {site.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3 py-1.5 text-[14.5px] font-medium rounded-full transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-foreground/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/articles"
            aria-label="חיפוש כתבות"
            className="hidden sm:inline-grid place-items-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Search size={18} />
          </Link>
          <Link
            href={site.cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-4 h-9 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
          >
            {site.cta.label}
          </Link>
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-grid place-items-center h-9 w-9 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            // Dynamic viewport height avoids iOS Safari URL-bar collapse jumps.
            className="md:hidden fixed top-16 inset-x-0 z-30 bg-background"
            style={{ height: "calc(100dvh - 4rem)" }}
          >
            <motion.nav
              ref={drawerRef}
              id="mobile-drawer"
              aria-label="ניווט נייד"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              className="border-t border-border h-full overflow-y-auto"
            >
              <Container className="py-4">
                <ul className="flex flex-col divide-y divide-border">
                  {site.nav.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="flex items-center justify-between py-4 text-lg"
                        >
                          <span
                            className={cn(
                              active
                                ? "text-foreground font-semibold"
                                : "text-foreground/80"
                            )}
                          >
                            {item.label}
                          </span>
                          <span aria-hidden className="text-muted-foreground">
                            ‹
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href={site.cta.href}
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand text-white h-12 text-base font-semibold shadow-[var(--elev-1)]"
                >
                  {site.cta.label}
                </Link>
              </Container>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
