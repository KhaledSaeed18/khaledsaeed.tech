"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface RollingTextProps {
  items: readonly string[]
  /** Milliseconds each word stays before rolling to the next. */
  interval?: number
  className?: string
}

/**
 * A vertical "spinner" of words. The active word rolls up and out while the
 * next rolls in from below. The full list is rendered for assistive tech and
 * crawlers via a visually-hidden node, and the animation is marked decorative.
 *
 * Respects prefers-reduced-motion: words still cycle, but without the slide.
 */
export function RollingText({
  items,
  interval = 2200,
  className,
}: RollingTextProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (items.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [items.length, interval])

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* Full list for screen readers and crawlers. */}
      <span className="sr-only">{items.join(", ")}</span>

      <span
        aria-hidden="true"
        className="relative inline-block h-[1.25em] overflow-hidden align-bottom"
      >
        {/* Invisible sizer keeps the box exactly as wide as the longest word. */}
        <span className="invisible block whitespace-nowrap font-medium">
          {items.reduce((a, b) => (a.length >= b.length ? a : b), "")}
        </span>

        <span
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
          style={{ transform: `translateY(-${index * 1.25}em)` }}
        >
          {items.map((item, i) => (
            <span
              key={item}
              className={cn(
                "flex h-[1.25em] items-center whitespace-nowrap font-medium text-brand transition-opacity duration-500 motion-reduce:transition-none",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              {item}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
