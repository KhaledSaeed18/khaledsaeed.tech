import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Experience, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / experience",
    title: "Experience",
    subtitle:
      "Software engineer at JSS Technology, after an internship and a full-stack role at 3E Tech in Beirut.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
