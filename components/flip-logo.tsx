import type { CSSProperties } from "react"

type LogoState = "k" | "forward"

interface FlipLogoProps {
  /** Pixel size of the square mark. Defaults to 40. */
  size?: number
  /** Stroke color. Defaults to currentColor so it inherits text color. */
  color?: string
  /**
   * "hover"  — rests as K, flips to forward on hover/focus (default)
   * "auto"   — rests as K, automatically flips to forward every ~3s and returns
   * "k"      — static K
   * "forward"— static forward glyph
   */
  mode?: "hover" | "auto" | LogoState
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
  const auto = mode === "auto"

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
      data-auto={auto ? "" : undefined}
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
          className={interactive ? "flip-chevron" : auto ? "flip-chevron-auto" : undefined}
          // Static modes set the transform inline; interactive mode must drive
          // it from CSS so the :hover rule isn't outranked by an inline style.
          style={
            interactive || auto
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
      {auto && (
        <style>{`
          @keyframes logo-flip {
            0%   { transform: scaleX(1); }
            14%  { transform: scaleX(-1); }
            40%  { transform: scaleX(-1); }
            54%  { transform: scaleX(1); }
            100% { transform: scaleX(1); }
          }
          .flip-chevron-auto {
            transform-box: fill-box;
            transform-origin: center;
            transform: scaleX(1);
            animation: logo-flip 5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .flip-chevron-auto { animation: none; }
          }
        `}</style>
      )}
    </svg>
  )
}
