import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Writing, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / writing",
    title: "Writing",
    subtitle:
      "Practical write-ups on authentication, rendering and architecture.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
