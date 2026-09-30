import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Say hello., Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / contact",
    title: "Say hello.",
    subtitle: "contact@khaledsaeed.tech",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
