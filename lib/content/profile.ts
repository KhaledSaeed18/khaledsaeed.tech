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
 * pin order. The datasheet draws it as one part, KS-<pins>, one pin per item,
 * in two packages: a quad flat pack where there is room (pin 1 at the top of
 * the left side, counter-clockwise round all four sides) and a DIP on phones
 * (down the left side, back up the right). Each layer is a contiguous run of
 * pins, so it can wrap round a corner; spare pins up to a multiple of four
 * are drawn as nc. Items are ordered by importance within a layer.
 */
export const stack: { layer: string; items: string[] }[] = [
  {
    layer: "Interface",
    items: [
      "React",
      "Next.js",
      "TanStack",
      "Tailwind CSS",
      "shadcn/ui",
      "Vite",
      "Redux",
      "Zustand",
      "Jotai",
      "React Hook Form",
      "Motion",
    ],
  },
  {
    layer: "Services",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "Hono",
      "FastAPI",
      "Bun",
      "Django",
      "GraphQL",
      "Apollo",
      "WebSockets",
      "BullMQ",
      "Zod",
      "Pydantic",
      "OpenAPI",
      "JWT",
      "Clerk",
      "Resend",
    ],
  },
  {
    layer: "Native",
    items: [
      "Swift",
      "SwiftUI",
      "Rust",
      "React Native",
      "Electron",
      "Expo",
      "Flutter",
      "Riverpod",
      "GNOME",
    ],
  },
  {
    layer: "Data",
    items: [
      "PostgreSQL",
      "Prisma",
      "MongoDB",
      "SQLite",
      "MySQL",
      "Redis",
      "Mongoose",
      "TypeORM",
      "SQLAlchemy",
      "Neon",
      "Supabase",
      "Payload CMS",
    ],
  },
  {
    layer: "Tooling",
    items: [
      "TypeScript",
      "Go",
      "Python",
      "Docker",
      "GitHub Actions",
      "JavaScript",
      "Dart",
      "C",
      "Git",
      "pnpm",
      "Turborepo",
    ],
  },
  {
    layer: "Intelligence",
    items: [
      "AI SDK",
      "Claude Code",
      "Transformers.js",
      "Hugging Face",
      "Claude",
      "OpenAI",
      "Gemini",
      "Mistral",
      "Qwen",
      "Ollama",
      "LangChain",
      "n8n",
      "GitHub Copilot",
      "Codex",
      "Cursor",
    ],
  },
  {
    layer: "Platform",
    items: [
      "Linux",
      "Vercel",
      "Cloudflare",
      "AWS",
      "Google Cloud",
      "Coolify",
      "Traefik",
      "Nginx",
      "Render",
      "Sentry",
      "PostHog",
      "Grafana",
      "Datadog",
    ],
  },
  {
    layer: "Quality",
    items: [
      "Vitest",
      "Playwright",
      "Jest",
      "MSW",
      "ESLint",
      "Prettier",
      "Biome",
      "Husky",
    ],
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
