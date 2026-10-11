import { siteConfig } from "@/lib/site"

/**
 * About, stack and principles. Single source for the about page, the home
 * sections, JSON-LD and llms.txt. Degrees live in ./education and
 * certifications in ./certifications.
 */

export const about = {
  /** Short bio used in llms.txt and structured data. */
  short: `${siteConfig.name}, known online as ${siteConfig.username}, is a full-stack software engineer from Lebanon, building in TypeScript across web, backend, mobile and desktop, and in Swift and Rust for native macOS and Linux tools, while completing an M.S. in Computer Engineering at the Lebanese International University.`,
  paragraphs: [
    "My interest in software started as plain curiosity about how computers work. It turned into building real systems and solving practical problems with code, and it has not stopped since.",
    "I work across the full stack with TypeScript as the common language: backends in Node.js and NestJS, web apps in React and Next.js, mobile apps in React Native and desktop apps in Electron. When a tool belongs on my own Mac, I write it natively in Swift; on Linux, in Rust.",
    "I care about clean architecture, data that stays where it belongs, and interfaces that feel precise. Lately I am going deeper into AI and machine learning, and into how intelligent systems fit inside real products.",
  ],
}

/**
 * The datasheet on the home page: what sits at each layer of what I ship, in
 * pin order: the datasheet draws it as a DIP part,
 * so the first half of the items runs down the left side and the second
 * half back up the right.
 */
export const stack: { layer: string; items: string[] }[] = [
  {
    layer: "Interface",
    items: ["React", "Next.js", "TanStack", "Tailwind CSS", "shadcn/ui"],
  },
  {
    layer: "Services",
    items: ["Node.js", "NestJS", "Express", "Hono", "FastAPI"],
  },
  {
    layer: "Native",
    items: ["Swift", "SwiftUI", "Rust", "React Native", "Electron"],
  },
  {
    layer: "Data",
    items: ["PostgreSQL", "Prisma", "MongoDB", "SQLite", "MySQL"],
  },
  {
    layer: "Tooling",
    items: ["TypeScript", "Go", "Python", "Docker", "GitHub Actions"],
  },
  {
    layer: "Intelligence",
    items: ["AI SDK", "Claude Code", "Transformers.js", "Hugging Face"],
  },
]

export const principles: { title: string; body: string }[] = [
  {
    title: "Make the wrong thing unrepresentable",
    body: "If a bug can be prevented by the schema, the type system or the database, it should never reach a code review.",
  },
  {
    title: "Boring infrastructure, sharp edges",
    body: "Pick proven tools for the foundation so the time goes into the details people actually touch.",
  },
  {
    title: "Legible software",
    body: "Tools should explain themselves: why a process would not die, why a Mac is awake, why a token is unsafe.",
  },
  {
    title: "Ship, then keep it working",
    body: "CI, security scanning and invariants you can run matter as much as the first release.",
  },
]
