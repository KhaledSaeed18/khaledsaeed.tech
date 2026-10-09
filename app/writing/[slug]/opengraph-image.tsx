import { getArticles } from "@/lib/data/devto"
import { formatDate } from "@/lib/format"
import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Article by Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const a = (await getArticles()).find((x) => x.slug === slug)
  return ogCard({
    eyebrow: a
      ? `writing / ${formatDate(a.publishedAt).toLowerCase()} / ${a.readingMinutes} min`
      : "writing",
    title: a?.title ?? "Writing",
    subtitle: a?.tags.map((t) => `#${t}`).join("  "),
  })
}
