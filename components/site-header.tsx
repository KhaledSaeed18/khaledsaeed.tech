"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { FlipLogo } from "@/components/flip-logo"
import { Rule } from "@/components/print/sheet"
import { nav, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Fixed masthead, closed off by a full-width rule. Mono labels on desktop; on small screens a menu button opens
 * a full-screen sheet of large numbered links that prints in with the dither.
 * Pinned with its own view-transition name so it stays still while pages
 * dissolve underneath.
 */
export function SiteHeader() {
  const pathname = usePathname()
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = React.useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null)
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "bg-background/85 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="frame flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="-ml-1 inline-flex items-center p-1 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <FlipLogo size={36} color="var(--brand)" mode="auto" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 font-mono text-xs">
            {nav.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group inline-flex items-center gap-1.5 px-2.5 py-2 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 transition-colors",
                        active
                          ? "bg-brand"
                          : "bg-transparent group-hover:bg-muted-foreground/50"
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="px-2 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:hidden"
        >
          {open ? "close" : "menu"}
        </button>
      </div>
      <Rule edge />

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="fixed inset-x-0 top-[calc(4rem+1px)] bottom-0 overflow-y-auto bg-background pt-8 pb-12 md:hidden"
        >
          <ul className="frame flex flex-col">
            {[{ href: "/", label: "home" }, ...nav].map((item, i) => (
              <li
                key={item.href}
                data-reveal
                data-shown
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="border-b border-border"
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="font-mono text-xs text-brand tabular-nums">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-3xl font-medium tracking-tight">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
