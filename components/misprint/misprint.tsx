"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** How close counts as "in register", in CSS pixels. */
const SNAP = 4

const plate = (level: number) =>
  ({
    maskImage: `var(--dither-${level})`,
    WebkitMaskImage: `var(--dither-${level})`,
    maskSize: "var(--dither-tile)",
    WebkitMaskSize: "var(--dither-tile)",
  }) as React.CSSProperties

/** A registration mark in the current color. */
function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute top-1/2 size-5 -translate-y-1/2", className)}
      style={{
        background:
          "linear-gradient(currentColor, currentColor) center / 1px 100% no-repeat, linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat",
      }}
    />
  )
}

/**
 * A misprint: the same word printed from two plates, the terracotta one
 * knocked out of register. Drag it (or use the arrow keys) until its marks
 * sit on the teal ones; within a few pixels it snaps home and both plates
 * print as one.
 */
export function Misprint({ text }: { text: string }) {
  // starts convincingly off; the same on server and client
  const [o, setOff] = React.useState({ x: 34, y: -19 })
  const drag = React.useRef<{ x: number; y: number } | null>(null)
  const dist = Math.round(Math.hypot(o.x, o.y))
  const done = dist === 0

  const move = (x: number, y: number) => {
    setOff(Math.hypot(x, y) <= SNAP ? { x: 0, y: 0 } : { x, y })
  }

  const word = (
    <span className="block font-heading text-[clamp(6rem,24vw,16rem)] leading-none font-medium tracking-tighter">
      {text}
    </span>
  )

  return (
    <div>
      <div className="relative inline-block px-10 select-none sm:px-14">
        {/* teal plate, fixed */}
        <div
          aria-hidden="true"
          className={cn(
            "relative transition-colors duration-300",
            done ? "text-foreground" : "text-teal"
          )}
        >
          <Mark className="-left-10 sm:-left-14" />
          <div style={plate(done ? 12 : 10)}>{word}</div>
          <Mark className="-right-10 sm:-right-14" />
        </div>

        {/* terracotta plate, draggable */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Misregistered plate. Drag it, or use the arrow keys, to bring it back into register. Off by ${dist} pixels.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.max(0, 100 - dist)}
          onPointerDown={(e) => {
            if (done) return
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { x: e.clientX - o.x, y: e.clientY - o.y }
          }}
          onPointerMove={(e) => {
            if (!drag.current) return
            move(e.clientX - drag.current.x, e.clientY - drag.current.y)
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={(e) => {
            if (done) return
            const step = e.shiftKey ? 10 : 2
            const d: Record<string, [number, number]> = {
              ArrowLeft: [-step, 0],
              ArrowRight: [step, 0],
              ArrowUp: [0, -step],
              ArrowDown: [0, step],
            }
            if (!d[e.key]) return
            e.preventDefault()
            move(o.x + d[e.key][0], o.y + d[e.key][1])
          }}
          className={cn(
            "absolute inset-0 touch-none px-10 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-14",
            done
              ? "pointer-events-none text-foreground"
              : "cursor-grab text-brand active:cursor-grabbing"
          )}
          style={{
            transform: `translate(${o.x}px, ${o.y}px)`,
            mixBlendMode: done ? "normal" : "screen",
          }}
        >
          <Mark className="left-0" />
          <div aria-hidden="true" style={plate(done ? 12 : 10)}>
            {word}
          </div>
          <Mark className="right-0" />
        </div>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "mt-6 font-mono text-xs",
          done ? "text-brand" : "text-muted-foreground"
        )}
      >
        {done
          ? "in register. thanks for fixing the press."
          : `off register by ${dist}px. drag the terracotta plate, or use the arrow keys.`}
      </p>
    </div>
  )
}
