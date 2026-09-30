import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Open source, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / open source",
    title: "Open source",
    subtitle:
      "Fixes merged into React Bits, Magic UI, NoScript and Svelte Bits.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
