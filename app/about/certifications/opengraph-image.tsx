import { certifications } from "@/lib/content/certifications"
import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Certifications, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / about / certifications",
    title: "Certifications",
    subtitle: `${certifications.length} certificates in AI, backend, frontend, languages and DevOps.`,
    art: { src: "character.png", width: 374, height: 423 },
  })
}
