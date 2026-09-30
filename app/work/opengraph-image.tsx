import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Work, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / work",
    title: "Work",
    subtitle:
      "13 open source projects: platforms, developer tools and native macOS apps.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
