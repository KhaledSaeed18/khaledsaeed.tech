export type SocialLink = {
  /** Stable key used for icon mapping. */
  key: "github" | "linkedin" | "x" | "instagram" | "devto" | "discord" | "email"
  /** Human label, e.g. for aria-label and tooltips. */
  label: string
  /** Handle shown on hover / for screen readers. */
  handle: string
  href: string
}

export const siteConfig = {
  name: "Khaled Saeed",
  /** Short role used in the title tag and OG. */
  role: "Full-Stack Engineer",
  url: "https://khaledsaeed.tech",
  location: "Lebanon",
  twitterHandle: "@KhaleddSaeed18",
  /** ~155 chars, no em dashes, no emoji. */
  description:
    "Khaled Saeed is a full-stack engineer from Lebanon building pixel-perfect interfaces, backend systems, and developer tooling in TypeScript and Node.js.",
  intro:
    "I build across the full stack: pixel-perfect interfaces on the frontend, solid backend systems, and developer tooling in TypeScript and Node.js. I care about clean design on both sides of the wire.",
  /** Roles cycled by the rolling text. Sentence case, lowercase per brand. */
  roles: [
    "full-stack engineer",
    "frontend engineer",
    "backend engineer",
    "open-source developer",
  ],
  /** Topics surfaced for search engines and answer engines (GEO). */
  knowsAbout: [
    "Software Engineering",
    "Full-Stack Development",
    "Frontend Engineering",
    "Backend Architecture",
    "System Design",
    "TypeScript",
    "Node.js",
    "React",
    "NestJS",
    "PostgreSQL",
    "REST APIs",
    "Open Source",
  ],
} as const

export const socialLinks: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    handle: "KhaledSaeed18",
    href: "https://github.com/KhaledSaeed18",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "khaled-s-saeed",
    href: "https://www.linkedin.com/in/khaled-s-saeed/",
  },
  {
    key: "x",
    label: "X",
    handle: "@KhaleddSaeed18",
    href: "https://x.com/KhaleddSaeed18",
  },
  {
    key: "devto",
    label: "DEV",
    handle: "khaledsaeed18",
    href: "https://dev.to/khaledsaeed18",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "khaledd.saeed",
    href: "https://www.instagram.com/khaledd.saeed",
  },
  {
    key: "discord",
    label: "Discord",
    handle: "khaledsaeed18",
    href: "https://discord.com/users/1496301841774805004",
  },
  {
    key: "email",
    label: "Email",
    handle: "contact@khaledsaeed.tech",
    href: "mailto:contact@khaledsaeed.tech",
  },
]

/** Same-as URLs for structured data (GEO/SEO). */
export const sameAs = socialLinks
  .filter((l) => l.key !== "email")
  .map((l) => l.href)
