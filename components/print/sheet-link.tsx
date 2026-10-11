import Link from "next/link"

import { CropMarks } from "@/components/print/sheet"
import { cn } from "@/lib/utils"

/**
 * A link to another sheet, set as a cropped card: a mono eyebrow over the
 * sheet's name. Used for previous/next pagers and for pointers between
 * related pages.
 */
export function SheetLink({
  href,
  eyebrow,
  title,
  alignEnd = false,
}: {
  href: string
  eyebrow: string
  title: string
  alignEnd?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative border border-border p-6 transition-colors hover:border-brand/40",
        alignEnd && "sm:text-right"
      )}
    >
      <CropMarks />
      <span className="font-mono text-xs text-muted-foreground">{eyebrow}</span>
      <span className="mt-2 block font-heading text-2xl font-medium tracking-tight transition-colors group-hover:text-brand">
        {title}
      </span>
    </Link>
  )
}
