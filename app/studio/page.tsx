import { notFound } from "next/navigation"

import { ObjectStudio } from "@/components/studio/object-studio"
import { OBJECTS } from "@/lib/content/objects"
import type { ObjectKind } from "@/lib/content/projects"

// Dev-only tool for rendering project object sprites (see scripts/render-objects.mjs).
export const metadata = { robots: { index: false, follow: false } }

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ obj?: string; shade?: string }>
}) {
  if (process.env.NODE_ENV === "production") notFound()
  const { obj, shade } = await searchParams
  const list =
    obj && OBJECTS.includes(obj as ObjectKind) ? [obj as ObjectKind] : OBJECTS
  return (
    <div className="space-y-6 bg-black px-4 pt-24 pb-8">
      {list.map((o) => (
        <div key={o}>
          <p className="mb-2 font-mono text-xs text-white/60">{o}</p>
          <ObjectStudio obj={o} shade={shade !== undefined} />
        </div>
      ))}
    </div>
  )
}
