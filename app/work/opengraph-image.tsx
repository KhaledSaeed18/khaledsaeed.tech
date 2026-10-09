import { projects } from "@/lib/content/projects"
import { ogCard, ogContentType, ogSize } from "@/lib/og/card"

export const alt = "Work, Khaled Saeed"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: "khaledsaeed.tech / work",
    title: "Work",
    subtitle: `${projects.length} open source projects: platforms, developer tools, and native apps for macOS and Linux.`,
    art: { src: "character.png", width: 374, height: 423 },
  })
}
