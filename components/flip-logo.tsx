import type { CSSProperties } from "react"

type LogoState = "k" | "forward"

interface FlipLogoProps {
  /** Pixel size of the square mark. Defaults to 40. */
  size?: number
  /** Stroke color. Defaults to currentColor so it inherits text color. */
  color?: string
  /**
   * "hover"  — rests as K, flips to forward on hover/focus (default)
   * "k"      — static K
   * "forward"— static forward glyph
   */
  mode?: "hover" | LogoState
  /** Accessible label. */
  label?: string
  className?: string
  style?: CSSProperties
}

/**
 * Flip-bracket K mark. A fixed vertical stem with a detached chevron beside it.
 * At rest it reads as "|<" (the letter K); flipped it reads as "|>" (forward/run).
 * The chevron is a single polyline mirrored via scaleX(-1) about its own center,
 * so both states share identical geometry.
 */
export function FlipLogo({
  size = 40,
  color = "currentColor",
  mode = "hover",
  label = "Khaled Saeed",
  className,
  style,
}: FlipLogoProps) {
  const isStaticForward = mode === "forward"
  const interactive = mode === "hover"

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={className}
      style={style}
      data-interactive={interactive ? "" : undefined}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={38} y1={28} x2={38} y2={72} />
        <polyline
          points="71,28 51,50 71,72"
          className={interactive ? "flip-chevron" : undefined}
          // Static modes set the transform inline; interactive mode must drive
          // it from CSS so the :hover rule isn't outranked by an inline style.
          style={
            interactive
              ? undefined
              : {
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: isStaticForward ? "scaleX(-1)" : "scaleX(1)",
                }
          }
        />
      </g>
      {interactive && (
        <style>{`
          .flip-chevron {
            transform-box: fill-box;
            transform-origin: center;
            transform: scaleX(1);
            transition: transform 420ms cubic-bezier(0.65, 0, 0.35, 1);
          }
          svg[data-interactive]:hover .flip-chevron,
          svg[data-interactive]:focus-visible .flip-chevron { transform: scaleX(-1); }
          @media (prefers-reduced-motion: reduce) {
            .flip-chevron { transition: none; }
          }
        `}</style>
      )}
    </svg>
  )
}
