/**
 * About, education, credentials, open source and stack. Single source for the
 * about page, the home sections, JSON-LD and llms.txt.
 */

export const about = {
  /** Short bio used in llms.txt and structured data. */
  short:
    "Khaled Saeed is a full-stack software engineer from Lebanon, building in TypeScript across web, backend, mobile and desktop, and in Swift for native macOS tools, while completing an M.S. in Computer Engineering at the Lebanese International University.",
  paragraphs: [
    "My interest in software started as plain curiosity about how computers work. It turned into building real systems and solving practical problems with code, and it has not stopped since.",
    "I work across the full stack with TypeScript as the common language: backends in Node.js and NestJS, web apps in React and Next.js, mobile apps in React Native and desktop apps in Electron. When a tool belongs on my own Mac, I write it natively in Swift.",
    "I care about clean architecture, data that stays where it belongs, and interfaces that feel precise. Lately I am going deeper into AI and machine learning, and into how intelligent systems fit inside real products.",
  ],
}

export type Education = {
  school: string
  degree: string
  field: string
  start: string
  end: string
  /** ISO dates for structured data. */
  startISO: string
  endISO: string
  current?: boolean
  note?: string
}

export const education: Education[] = [
  {
    school: "Lebanese International University",
    degree: "Master of Science",
    field: "Computer Engineering",
    start: "Sep 2025",
    end: "2027",
    startISO: "2025-09",
    endISO: "2027",
    current: true,
    note: "MCCE program. I also built and maintain the program's independent study hub.",
  },
  {
    school: "Lebanese International University",
    degree: "Bachelor of Science",
    field: "Computer Engineering",
    start: "Oct 2021",
    end: "Jun 2025",
    startISO: "2021-10",
    endISO: "2025-06",
    note: "Senior project: Yalla Learn, an AI learning platform on web, mobile and desktop.",
  },
]

export type Credential = {
  name: string
  issuer: string
  date: string
  note?: string
  highlight?: boolean
}

export const credentials: Credential[] = [
  {
    name: "Web Development, Back End",
    issuer: "Multi-Aid Programs (MAPS)",
    date: "Mar 2026",
    note: "96 hours of backend training. Ranked 1st in the cohort and awarded a prize.",
    highlight: true,
  },
  {
    name: "Understanding Machine Learning",
    issuer: "DataCamp",
    date: "Sep 2026",
  },
  { name: "v0 Foundations", issuer: "Vercel", date: "May 2026" },
  {
    name: "MongoDB Node.js Developer Path",
    issuer: "MongoDB",
    date: "Apr 2026",
  },
  { name: "Claude 101", issuer: "Anthropic", date: "Mar 2026" },
  {
    name: "Programming with Python Professional Certificate",
    issuer: "OpenEDG Python Institute",
    date: "Feb 2026",
  },
  { name: "Learning Docker", issuer: "LinkedIn Learning", date: "Dec 2025" },
]

/** The datasheet on the home page: what sits at each layer of what I ship. */
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
    layer: "Data",
    items: ["PostgreSQL", "Prisma", "MongoDB", "SQLite", "MySQL"],
  },
  { layer: "Native", items: ["Swift", "SwiftUI", "React Native", "Electron"] },
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

export type Contribution = {
  repo: string
  /** Display name of the project. */
  project: string
  blurb: string
  prs: { number: number; title: string; kind: "fix" | "feat" }[]
}

/** Merged pull requests to other people's projects. */
export const contributions: Contribution[] = [
  {
    repo: "DavidHDev/react-bits",
    project: "React Bits",
    blurb: "A large open library of animated, interactive React components.",
    prs: [
      {
        number: 963,
        title: "Resync canvas size on browser zoom change in ElectricBorder",
        kind: "fix",
      },
      {
        number: 955,
        title: "Correct ComponentPropsProvider usage in 8 background demos",
        kind: "fix",
      },
      {
        number: 951,
        title:
          "Color pickers not updating preview or URL in ShinyText and 4 other demos",
        kind: "fix",
      },
      {
        number: 949,
        title:
          "Render the docs mobile menu through a portal to escape backdrop-filter",
        kind: "fix",
      },
      {
        number: 946,
        title: "Sync QuickStart selectors with InstallationContext",
        kind: "feat",
      },
    ],
  },
  {
    repo: "magicuidesign/magicui",
    project: "Magic UI",
    blurb: "Animated components for design engineers, built on shadcn/ui.",
    prs: [
      {
        number: 964,
        title: "Make tweet cards grid responsive on mobile screens",
        kind: "fix",
      },
    ],
  },
  {
    repo: "hackademix/noscript",
    project: "NoScript",
    blurb: "The browser security extension that blocks untrusted scripts.",
    prs: [
      {
        number: 545,
        title: "Restore icon256.png lost during the webp migration",
        kind: "fix",
      },
    ],
  },
  {
    repo: "DavidHDev/svelte-bits",
    project: "Svelte Bits",
    blurb: "The Svelte edition of React Bits.",
    prs: [
      { number: 2, title: "Add the CountUp text animation", kind: "feat" },
      {
        number: 11,
        title:
          "Replace placeholder SVGs with brand icons on the MCP server page",
        kind: "fix",
      },
    ],
  },
]

/** Fallback numbers used when the GitHub API is unavailable at build time. */
export const fallbackStars: Record<string, number> = {
  "DavidHDev/react-bits": 48000,
  "magicuidesign/magicui": 22000,
  "hackademix/noscript": 1100,
  "DavidHDev/svelte-bits": 370,
}
