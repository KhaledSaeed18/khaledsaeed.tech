import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Uses, and now, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / uses",
    title: "Uses, and now",
    subtitle: "What I am working on, and the setup behind it.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
