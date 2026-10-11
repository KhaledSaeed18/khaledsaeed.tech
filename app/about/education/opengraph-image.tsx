import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Education, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / about / education",
    title: "Education",
    subtitle:
      "M.S. and B.S. in Computer Engineering, Lebanese International University.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
