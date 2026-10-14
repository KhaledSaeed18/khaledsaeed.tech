import type { Proof } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * Measured numbers, printed large in hairline cells like the readings on a
 * proof sheet: the figure, what it counts, and where it was measured.
 */
export function ProofStrip({
  proof,
  className,
}: {
  proof: Proof[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {proof.map((m, k) => (
        <div
          key={m.label}
          data-reveal
          className="bg-background p-6 sm:p-8"
          style={{ "--reveal-delay": k } as React.CSSProperties}
        >
          <dd className="font-heading text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
            {m.value}
          </dd>
          <dt className="mt-3 text-sm text-foreground">{m.label}</dt>
          {m.note && (
            <dd className="mt-1.5 font-mono text-xs text-muted-foreground">
              {m.note}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}
