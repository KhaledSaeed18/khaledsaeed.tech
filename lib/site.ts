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
  /** Cal.com booking link (open-source Calendly alternative). Replace with your own handle. */
  bookingUrl: "https://cal.com/khaledsaeed",
  /** ~155 chars, no em dashes, no emoji. */
  description:
    "Khaled Saeed is a full-stack engineer in Lebanon building software that explains itself: interfaces, backends and the developer tooling in between.",
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
    "Multi-Tenant Architecture",
    "PostgreSQL Row Level Security",
    "Swift",
    "SwiftUI",
    "Rust",
    "Linux",
    "eBPF",
    "macOS Development",
    "Developer Tools",
    "JSON Web Tokens",
    "Open Source",
  ],
} as const

/** Primary navigation. Order is the print order of the sheets. */
export const nav = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/writing", label: "writing" },
  { href: "/contact", label: "contact" },
] as const

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
