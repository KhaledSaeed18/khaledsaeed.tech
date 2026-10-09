import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "About, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / about",
    title: "About",
    subtitle:
      "Full-stack engineer from Lebanon. M.S. Computer Engineering, LIU.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
