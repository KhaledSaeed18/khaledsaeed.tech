/**
 * Employment, single-sourced for /experience, the /about specifications, the
 * printed résumé, JSON-LD and llms.txt. Newest first. Dates are ISO
 * ("2024-09-01" or "2025-05", as precise as the record) and formatted where
 * they are shown. Client and project names are deliberately left out: the
 * work was for clients and stays theirs.
 */

export type Role = {
  title: string
  start: string
  end?: string
  /** One line under the title: how the chapter began. */
  lede: string
  /** What the chapter was, two to four lines. */
  body: string[]
}

export type Company = {
  /** Anchor on /experience. */
  slug: string
  name: string
  url?: string
  /** What the company is, in a line, for the facts strip and search. */
  kind: string
  location: string
  mode: "hybrid" | "remote" | "on-site"
  /** Two or three sentences: the lede of the company's sheet. */
  summary: string
  /** One line for the run log on /about and the résumé. */
  note: string
  /** The chapters at the company, oldest first. */
  roles: Role[]
  /** The kinds of systems built there, as the client would describe them. */
  domains: string[]
  /** The stack as it was used in that job, not the general one. */
  stack: string[]
  /** What the job changed about how I work. */
  learned: string
}

/** Recorded date of the last meaningful change to this content. */
export const experienceUpdatedAt = "2026-10-12"

export const experience: Company[] = [
  {
    slug: "jss-technology",
    name: "JSS Technology",
    url: "https://www.jss.technology",
    kind: "Software company",
    location: "Lebanon",
    mode: "remote",
    summary:
      "A software company in Lebanon that builds web, mobile, desktop and AI products for clients worldwide, from requirements to delivery. I joined straight from 3E Tech and work across the whole run of a project: scoping and technical decisions, the services and the clients on top of them, and the servers underneath.",
    note: "Web, mobile, desktop and AI products for clients, from requirements to delivery.",
    roles: [
      {
        title: "Software Engineer",
        start: "2025-05",
        lede: "Joined the engineering team as the company took on larger, multi-platform builds.",
        body: [
          "Build client products across the stack: Next.js and React on the web, React Native and Flutter on mobile, Electron on the desktop, with NestJS and Node.js services behind them.",
          "Take part in the decisions around the code: scoping with clients, picking the stack for each project, and weighing timelines against what can be built well.",
          "Run deployment as well as development, on self-managed servers with Coolify alongside Vercel and AWS.",
          "Work directly with clients and colleagues from outside engineering, where a clear explanation of a trade-off is part of the delivery.",
        ],
      },
    ],
    domains: [
      "Travel and transportation: a multi-tenant booking platform connecting agencies, operators and travellers",
      "Events: ticketing with real-time seat selection and QR entry, built for 5,000+ concurrent users",
      "E-commerce and delivery apps on mobile and web",
      "Online shops and websites for established businesses",
      "AI features inside client products",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "NestJS",
      "Node.js",
      "React Native",
      "Flutter",
      "Electron",
      "Prisma",
      "PostgreSQL",
      "MongoDB",
      "Coolify",
      "Vercel",
      "AWS",
    ],
    learned:
      "Every project is a different problem, so the stack is a decision each time, not a habit. And most of the work that matters happens with people who do not write code, so explaining a trade-off well is as much the job as building it.",
  },
  {
    slug: "3e-tech",
    name: "3E Tech",
    kind: "Software startup",
    location: "Beirut, Lebanon",
    mode: "hybrid",
    summary:
      "The software arm of 3E Softwares, a long-established Lebanese telecom and communications company. The startup built large systems for clients rather than brochure sites. I started as an intern, stayed on as a full-stack developer, and left in May 2025 for JSS Technology.",
    note: "Internship, then full-stack developer on large client systems: HR, real estate, education, e-commerce.",
    roles: [
      {
        title: "Software Engineering Intern",
        start: "2024-09-01",
        end: "2024-11-30",
        lede: "Three months, hybrid, on the Beirut team.",
        body: [
          "Came in with a working background from the degree and self-taught projects, so instead of a learning rotation I was on real project work within the first month.",
          "Shipped features on production systems in TypeScript, React, React Native and Express, against MongoDB and PostgreSQL.",
          "Worked to real deadlines inside a team for the first time: planning, stand-ups and reviews with people above and below me.",
        ],
      },
      {
        title: "Full-Stack Developer",
        start: "2024-12-01",
        end: "2025-05-31",
        lede: "Hired at the end of the internship, the day after it closed.",
        body: [
          "Took a larger part in project decisions, technical and otherwise, on the systems I had joined as an intern.",
          "Became the person the following intern batches worked with: guiding them, reviewing their work and teaching alongside my own delivery.",
          "Kept shipping across web and mobile on the same TypeScript stack, deployed to Vercel, Render and AWS.",
        ],
      },
    ],
    domains: [
      "Human resources: internal systems for job management that replaced manual work",
      "Real estate: a platform built on third-party API integrations",
      "Education: a learning system at large scale",
      "E-commerce and business systems",
    ],
    stack: [
      "TypeScript",
      "React",
      "React Native",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "Vercel",
      "Render",
      "AWS",
      "GitHub",
    ],
    learned:
      "Deadlines and time management, and how to work in a team: with seniors, with juniors, and with clients and colleagues from industries where nobody else writes code.",
  },
]

/** The first day of all of it. */
export const careerStart = experience.at(-1)!.roles[0].start

/** The current employer, if any, else the latest. */
export const currentCompany =
  experience.find((c) => c.roles.some((r) => !r.end)) ?? experience[0]

/** The role held now. */
export const currentRole = currentCompany.roles.at(-1)!

/** First and last dates of a company's chapters. */
export const spanOf = (c: Company) => ({
  start: c.roles[0].start,
  end: c.roles.at(-1)!.end,
})

/** "2024-09-01" -> months since year 0, at the month's start. */
const monthIndex = (iso: string) =>
  Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7)) - 1

/** Whole months from `start` to `end` (today when open), counting both ends. */
export function monthsBetween(start: string, end?: string) {
  const now = new Date()
  const to = end
    ? monthIndex(end)
    : now.getUTCFullYear() * 12 + now.getUTCMonth()
  return Math.max(1, to - monthIndex(start) + 1)
}

/** "3 months", "1 year 2 months", "2 years". */
export function formatTenure(months: number) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} ${y === 1 ? "year" : "years"}`)
  if (m) parts.push(`${m} ${m === 1 ? "month" : "months"}`)
  return parts.join(" ")
}

/** Every company, once each, for structured data. */
export const employers = experience.map((c) => ({
  name: c.name,
  ...(c.url ? { url: c.url } : {}),
}))

/** A role with its month range, for the strips that draw the run. */
export type Chapter = {
  company: Company
  role: Role
  /** Months since year 0, inclusive. */
  from: number
  to: number
}

/** "2024-09-01" -> months since year 0. */
export const monthOf = (iso: string) =>
  Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7)) - 1

/**
 * This month, in the same count. Read when a page renders, so a page that
 * revalidates daily keeps the open chapter and the tenure current.
 */
export const thisMonth = () =>
  new Date().getUTCFullYear() * 12 + new Date().getUTCMonth()

/** Every chapter, oldest first, with its month range. The open one runs to this month. */
export const chaptersOfRun = (): Chapter[] =>
  [...experience].reverse().flatMap((company) =>
    company.roles.map((role) => ({
      company,
      role,
      from: monthOf(role.start),
      to: role.end ? monthOf(role.end) : thisMonth(),
    }))
  )

/** How many chapters there are, across every company. */
export const chapterCount = experience.reduce((n, c) => n + c.roles.length, 0)

/** Dither level for a chapter: older ones print lighter, the current one in solid ink. */
export const inkOf = (i: number) => [5, 10, 16].at(i - chapterCount) ?? 16

/** One record per month of the run, oldest first, with the chapter it belongs to (-1 for none). */
export function monthsOfRun() {
  const chapters = chaptersOfRun()
  const first = monthOf(careerStart)
  const last = thisMonth()
  return Array.from({ length: last - first + 1 }, (_, i) => {
    const m = first + i
    return {
      m,
      year: Math.floor(m / 12),
      month: m % 12,
      // a month shared by two chapters belongs to the later one
      chapter: chapters.findLastIndex((c) => c.from <= m && m <= c.to),
    }
  })
}
