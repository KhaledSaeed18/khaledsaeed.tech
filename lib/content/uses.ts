/**
 * /uses and the "now" note. Only tools confirmed by the owner, plus things
 * provable from public repos. Update `now.updated` when the note changes.
 */

export const now = {
  updated: "2026-09",
  items: [
    "Second year of an M.S. in Computer Engineering at the Lebanese International University.",
    "Building Patchgrid, a multi-tenant service desk that isolates tenants inside Postgres itself.",
    "Keeping the MCCE study hub in sync for this semester's courses.",
    "Going deeper into machine learning, and into how AI features fit inside real products.",
  ],
}

export type UseItem = { name: string; note: string; href?: string }

export const uses: { group: string; items: UseItem[] }[] = [
  {
    group: "Hardware",
    items: [
      {
        name: "MacBook Air, M4",
        note: "Everything, everywhere. Fanless and quiet.",
      },
    ],
  },
  {
    group: "Editor and terminal",
    items: [
      {
        name: "Zed",
        note: "Fast, native, and out of the way.",
        href: "https://zed.dev",
      },
      {
        name: "Ghostty",
        note: "GPU-rendered terminal with sane defaults.",
        href: "https://ghostty.org",
      },
    ],
  },
  {
    group: "AI",
    items: [
      {
        name: "Claude Code",
        note: "My daily pair. I keep my skills, agents and hooks for it in dotclaude.",
        href: "https://claude.com/claude-code",
      },
    ],
  },
  {
    group: "Stack defaults",
    items: [
      {
        name: "TypeScript",
        note: "One language from the database schema to the pixels.",
      },
      { name: "pnpm", note: "Fast installs and strict dependency boundaries." },
      {
        name: "PostgreSQL and Prisma",
        note: "Where the data lives, and how it is typed.",
      },
      {
        name: "Docker",
        note: "Every service runs the same on my Mac and in CI.",
      },
      {
        name: "GitHub Actions",
        note: "CI, CodeQL and releases on every repository.",
      },
    ],
  },
]

/** Tools I wrote because I wanted them on my own machine. Slugs point to /work. */
export const madeForMyself = [
  "wakehold",
  "sever",
  "gauge",
  "baud",
  "dotclaude",
  "dir-analysis-tool",
]
