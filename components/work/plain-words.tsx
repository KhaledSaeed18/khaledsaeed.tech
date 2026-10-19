import { CropMarks } from "@/components/print/sheet"

/**
 * The project for someone who does not write software: a cropped card with
 * the explanation set large, and who it is for underneath. Sits between the
 * fact strip and the technical sections so a non-technical reader gets the
 * point before the stack appears.
 */
export function PlainWords({
  text,
  audience,
}: {
  text: string
  audience?: string
}) {
  return (
    <div className="relative border border-border p-6 sm:p-8">
      <CropMarks />
      <p className="font-mono text-xs text-muted-foreground">
        <span className="text-brand">{"//"}</span>
        <span className="ml-2">in plain words</span>
      </p>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-pretty sm:text-xl">
        {text}
      </p>
      {audience && (
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          <span className="text-foreground/70">for </span>
          {audience}
        </p>
      )}
    </div>
  )
}
