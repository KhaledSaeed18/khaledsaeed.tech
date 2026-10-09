import type * as React from "react"

import { OBJECT_CELLS, OBJECT_FRAMES } from "@/lib/content/objects"
import type { ObjectKind, Stock } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * A project's dithered object: a pre-rendered 1-bit turntable sprite
 * (public/objects, rendered by the dev studio) used as a CSS mask and filled
 * with the card's ink. No WebGL, a few KB each, crisp at whole-pixel scales.
 */
export function DitherObject({
  kind,
  stock,
  dot = 2,
  play = false,
  label,
  fluid = false,
  className,
}: {
  kind: ObjectKind
  stock: Stock
  /** CSS pixels per dither cell. Whole numbers stay crisp. */
  dot?: number
  /** Loop continuously instead of only on hover. */
  play?: boolean
  label?: string
  /** Shrink to fit the nearest size container (`[container-type:size]`). */
  fluid?: boolean
  className?: string
}) {
  const px = OBJECT_CELLS * dot
  const w = fluid ? `min(${px}px, 100cqw, 100cqh)` : `${px}px`
  const size = `calc(var(--obj-w) * ${OBJECT_FRAMES}) var(--obj-w)`
  const style = {
    "--obj-w": w,
    width: "var(--obj-w)",
    height: "var(--obj-w)",
    backgroundColor: `var(--ink-${stock})`,
    maskImage: `url(/objects/${kind}.png)`,
    WebkitMaskImage: `url(/objects/${kind}.png)`,
    maskSize: size,
    WebkitMaskSize: size,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "0 0",
    WebkitMaskPosition: "0 0",
    imageRendering: "pixelated",
  } as React.CSSProperties
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-play={play ? "" : undefined}
      className={cn("dither-object block shrink-0", className)}
      style={style}
    />
  )
}
