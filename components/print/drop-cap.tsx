/**
 * A paragraph that opens on a dithered terracotta drop cap two lines deep.
 * The letter stays in the text flow, so it reads normally aloud.
 */
export function DropCap({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <p className={className}>
      <span
        className="float-left mt-1.5 mr-3 font-heading text-[4.1em] leading-[0.72] font-medium text-brand"
        style={{
          maskImage: "var(--dither-12)",
          WebkitMaskImage: "var(--dither-12)",
          maskSize: "var(--dither-tile)",
          WebkitMaskSize: "var(--dither-tile)",
        }}
      >
        {text[0]}
      </span>
      {text.slice(1)}
    </p>
  )
}
