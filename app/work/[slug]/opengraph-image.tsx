import { getProject, projects } from "@/lib/content/projects"
import { ogCard, ogContentType, ogSize, stockHex } from "@/lib/og/card"

export const alt = "Project case study by Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = getProject(slug)!
  return ogCard({
    eyebrow: `work / ${p.kind.toLowerCase()}`,
    title: p.name,
    subtitle: p.tagline,
    art: {
      src: `og/${p.slug}.png`,
      stock: stockHex[p.stock],
      width: 448,
      height: 448,
    },
  })
}
