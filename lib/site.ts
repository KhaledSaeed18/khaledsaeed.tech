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
  /** Primary public handle, also used as the person's alternate name. */
  username: "KhaledSaeed18",
  /** Recorded date of a meaningful update to the home and about profile. */
  profileUpdatedAt: "2026-10-28",
  /** Short role used in the title tag and OG. */
  role: "Full-Stack Engineer",
  url: "https://khaledsaeed.tech",
  location: "Lebanon",
  twitterHandle: "@KhaleddSaeed18",
  /** Cal.com booking link (open-source Calendly alternative). Replace with your own handle. */
  bookingUrl: "https://cal.com/khaledsaeed",
  /** ~155 chars, no em dashes, no emoji. */
  description:
    "Khaled Saeed (KhaledSaeed18) is a full-stack engineer in Lebanon building interfaces, backends and open-source developer tools.",
  /** Topics surfaced for search engines and answer engines (GEO). */
  knowsAbout: [
    "Software Engineering",
    "Full-Stack Development",
    "Frontend Engineering",
    "Backend Architecture",
    "System Design",
    "Computer Engineering",
    "TypeScript",
    "Python",
    "Go",
    "Node.js",
    "React",
    "Next.js",
    "React Native",
    "Electron",
    "NestJS",
    "PostgreSQL",
    "REST APIs",
    "Data Structures and Algorithms",
    "Docker",
    "Multi-Tenant Architecture",
    "PostgreSQL Row Level Security",
    "Swift",
    "SwiftUI",
    "Rust",
    "Linux",
    "eBPF",
    "macOS Development",
    "Developer Tools",
    "Machine Learning",
    "JSON Web Tokens",
    "Open Source",
  ],
} as const

/** Shared identity in page titles and social previews. */
export const siteIdentity = `${siteConfig.name} (${siteConfig.username})`

/** Primary navigation. Order is the print order of the sheets. */
export const nav = [
  { href: "/work", label: "work" },
  { href: "/experience", label: "experience" },
  { href: "/about", label: "about" },
  { href: "/writing", label: "writing" },
  { href: "/contact", label: "contact" },
] as const

/** Pages that live under a primary page, listed beneath it in the footer. */
export const subPages: Partial<
  Record<(typeof nav)[number]["href"], { href: string; label: string }[]>
> = {
  "/about": [
    { href: "/about/education", label: "education" },
    { href: "/about/certifications", label: "certifications" },
  ],
}

export const socialLinks: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    handle: siteConfig.username,
    href: `https://github.com/${siteConfig.username}`,
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
