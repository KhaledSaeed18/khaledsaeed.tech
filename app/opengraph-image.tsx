import { ogCard, ogContentType, ogSize } from "@/lib/og/card"
import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name}, ${siteConfig.role}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogCard({
    eyebrow: `${siteConfig.role.toLowerCase()} / ${siteConfig.location.toLowerCase()}`,
    title: siteConfig.name,
    subtitle:
      "Full-stack systems in TypeScript, native tools in Swift, printed in 1-bit.",
    art: { src: "character.png", width: 374, height: 423 },
  })
}
