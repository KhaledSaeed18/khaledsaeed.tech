import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The site's own icon set. Every glyph is drawn on a 24 unit grid with a
 * square-capped, mitred 1.5 stroke, so it is cut as straight as the logo.
 *
 * Each one is printed from two plates, like the misprint on the home page:
 * the ink plate in the current color and a teal plate under it. At rest they
 * sit in register. When the glyph (or the `group` it sits in) is hovered or
 * focused, the teal plate slips out of register and the glyph makes one
 * small move of its own (an envelope opens, a shutter turns, a cat looks up).
 * The motion lives in app/glyphs.css.
 */
function Glyph({
  name,
  className,
  children,
}: {
  name: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      data-glyph={name}
      className={cn("glyph shrink-0", className)}
    >
      <g className="glyph-plate">{children}</g>
      <g className="glyph-ink">{children}</g>
    </svg>
  )
}

/** A filled square, the site's only kind of dot. */
function Dot({
  x,
  y,
  size = 1.5,
  className,
}: {
  x: number
  y: number
  size?: number
  className?: string
}) {
  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill="currentColor"
      stroke="none"
      className={className}
    />
  )
}

type GlyphProps = { className?: string }

/** A cut-paper octocat: ears up, tail out. Hovered, it looks up and wags. */
export function GithubGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="github" className={className}>
      <g className="g-head">
        <path d="M6 4 L9 6.5 H15 L18 4 V9.5 L19 11.5 V14 L15.5 17.5 H8.5 L5 14 V11.5 L6 9.5 Z" />
        <g className="g-eyes">
          <Dot x={8.75} y={11} />
          <Dot x={13.75} y={11} />
        </g>
      </g>
      <path d="M9.5 17.5 V21 M14.5 17.5 V21" />
      <path className="g-tail" d="M9.5 19.25 H7 L5 17.25" />
    </Glyph>
  )
}

/** The "in" set in a square frame. Hovered, the tittle hops. */
export function LinkedinGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="linkedin" className={className}>
      <rect x={3.75} y={3.75} width={16.5} height={16.5} />
      <Dot x={7.25} y={7} className="g-tittle" />
      <path d="M8 11 V16.75 M11.5 16.75 V11 M11.5 12.5 L13 11 H15 L16.5 12.5 V16.75" />
    </Glyph>
  )
}

/** The X: a heavy bar crossed by a hairline. Hovered, the hairline parts. */
export function XGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="x" className={className}>
      <path d="M4.5 4.5 H8.75 L19.5 19.5 H15.25 Z" />
      <path className="g-hair-up" d="M19 4.5 L13.6 10.4" />
      <path className="g-hair-down" d="M10.4 13.6 L5 19.5" />
    </Glyph>
  )
}

/** DEV set in a slug. Hovered, the type lifts off the bed. */
export function DevtoGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="devto" className={className}>
      <rect x={2.75} y={5.25} width={18.5} height={13.5} />
      <path
        className="g-type"
        d="M5.5 9.5 V14.5 H7.25 L8.5 13.25 V10.75 L7.25 9.5 Z M12.5 9.5 H10.25 V14.5 H12.5 M10.25 12 H12 M14.5 9.5 L16.25 14.5 L18 9.5"
      />
    </Glyph>
  )
}

/**
 * A square camera with a square lens. Hovered, the lens focuses in, the
 * aperture opens up and the flash fires.
 */
export function InstagramGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="instagram" className={className}>
      <rect x={3.75} y={3.75} width={16.5} height={16.5} />
      <rect className="g-lens" x={8.25} y={8.25} width={7.5} height={7.5} />
      <Dot x={11.25} y={11.25} className="g-aperture" />
      <Dot x={16.25} y={6.25} className="g-flash" />
    </Glyph>
  )
}

/** The Discord face, cut from card. Hovered, it tilts and smiles with its eyes. */
export function DiscordGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="discord" className={className}>
      <g className="g-face">
        <path d="M8.5 5.5 L9.5 7 H14.5 L15.5 5.5 L19 6.75 L21 15.5 L17 18.5 L15.75 16.5 H8.25 L7 18.5 L3 15.5 L5 6.75 Z" />
        <g className="g-eyes">
          <Dot x={8.5} y={11} size={2} />
          <Dot x={13.5} y={11} size={2} />
        </g>
      </g>
    </Glyph>
  )
}

/** An envelope. Hovered, the flap opens and a letter rises out of it. */
export function MailGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="mail" className={className}>
      <g className="g-letter">
        <rect x={7} y={1.5} width={10} height={6} />
        <path d="M9.5 4.5 H14.5" />
      </g>
      <rect x={3.75} y={6.75} width={16.5} height={11.5} />
      <path className="g-flap" d="M3.75 6.75 L12 12.5 L20.25 6.75" />
    </Glyph>
  )
}

/** A desk calendar, ticked. Hovered, the rings lift and the tick is stamped. */
export function CalendarGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="calendar" className={className}>
      <rect x={3.75} y={5.25} width={16.5} height={15} />
      <path className="g-rings" d="M8 3 V7.25 M16 3 V7.25" />
      <path d="M3.75 9.75 H20.25" />
      <path className="g-tick" d="M8.5 15 L11 17.25 L15.5 12.75" />
    </Glyph>
  )
}

/**
 * Two sheets, one over the other. Hovered, the top sheet slides off the
 * copy below it; once `done`, a tick is printed on it.
 */
export function CopyGlyph({
  className,
  done = false,
}: GlyphProps & { done?: boolean }) {
  return (
    <Glyph name="copy" className={cn(done && "is-done", className)}>
      <path d="M14.75 8 V3.75 H3.75 V14.75 H8" />
      <g className="g-sheet">
        <rect x={8.75} y={8.75} width={11.5} height={11.5} />
        <path className="g-tick" d="M11.75 14.75 L13.75 16.75 L17.25 13.25" />
      </g>
    </Glyph>
  )
}

/** An arrow into a tray. Hovered, the arrow drops in. */
export function SaveGlyph({ className }: GlyphProps) {
  return (
    <Glyph name="save" className={className}>
      <path d="M3.75 14.5 V20.25 H20.25 V14.5" />
      <path
        className="g-arrow"
        d="M12 3.75 V14.25 M7.75 10 L12 14.25 L16.25 10"
      />
    </Glyph>
  )
}
