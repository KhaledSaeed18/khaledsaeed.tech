/**
 * Projects, single-sourced for the home page, /work, each case study, the
 * sitemap, JSON-LD and llms.txt. Copy follows the brand rules: sentence case,
 * no em dashes, no emoji.
 */

export type ObjectKind =
  | "tenants"
  | "pipeline"
  | "cards"
  | "toolbox"
  | "cap"
  | "key"
  | "hourglass"
  | "lens"
  | "folder"
  | "square"
  | "scissors"
  | "bubble"
  | "bulb"
  | "battery"
  | "chip"
  | "globe"
  | "moon"
  | "padlock"
  | "presentation"
  | "cage"
  | "bisect"

/** Card stock a project is printed on. Ink is always a near-black of the same hue. */
export type Stock = "terracotta" | "teal" | "bone" | "stone"

export type ProjectGroup = "platforms" | "tools" | "macos" | "systems" | "web"

export type Project = {
  slug: string
  name: string
  /** One line, used on cards and in meta descriptions. */
  tagline: string
  /** Two or three sentences for the case study lede and search snippets. */
  summary: string
  year: number
  /** ISO date of a significant case study update, used by the sitemap and JSON-LD. */
  updatedAt?: string
  group: ProjectGroup
  kind: string
  object: ObjectKind
  stock: Stock
  stack: string[]
  /** GitHub repository name under KhaledSaeed18, used for live stars. */
  repo: string
  links: { label: string; href: string }[]
  problem: string
  approach: { title: string; body: string }[]
  highlights: string[]
  status?: string
  /** A headline number for the case study fact strip, shown instead of GitHub stars. */
  stat?: { label: string; value: string }
  /**
   * Measured numbers for the proof strip on the case study and the printed
   * sheet. Only figures that were actually measured or counted; never
   * estimates. `note` says where the number comes from.
   */
  proof?: Proof[]
  featured?: boolean
  /**
   * The project explained to someone who does not write software: what it
   * is for and why it matters, in two or three plain sentences. No stack.
   */
  plain?: string
  /** How to get it running, as copyable commands. Only for things that ship. */
  install?: Install[]
  /** Engineering decisions worth defending: what was chosen, what it cost. */
  decisions?: Decision[]
  /** The project's printings: releases and milestones, oldest first. */
  timeline?: Milestone[]
  /** Questions a reader is likely to ask, answered from the docs. */
  faq?: Faq[]
  /** Slugs of case studies that share a lineage, a stack or a problem. */
  related?: string[]
  /** Where it runs, for structured data: "macOS 14 or later", "Linux (Fedora 44+)". */
  platform?: string
  /** Who it is for, in a few words: "teams running IT support", "anyone with a Mac". */
  audience?: string
}

export type Install = {
  /** What the command does, lowercase: "install from pypi". */
  label: string
  command: string
  /** A requirement or caveat, lowercase: "needs python 3.11 or later". */
  note?: string
}

export type Decision = {
  /** What was chosen: "Postgres row level security". */
  chose: string
  /** What it was chosen over: "filtering every query by tenant in code". */
  over: string
  /** Why, and what it cost. One or two sentences. */
  why: string
}

export type Milestone = {
  /** ISO date, or a month: "2026-10-14", "2026-07". */
  date: string
  /** "v1.0.0" or a milestone name: "first commit", "live gate done". */
  title: string
  body?: string
}

export type Faq = {
  q: string
  a: string
}

export type Proof = {
  /** The number, as printed: "1,032", "98%", "0.28%". */
  value: string
  /** What it counts, lowercase: "backend tests". */
  label: string
  /** How or where it was measured, lowercase. */
  note?: string
}

export const groups: Record<ProjectGroup, { title: string; blurb: string }> = {
  platforms: {
    title: "Platforms and backends",
    blurb:
      "Multi-tenant systems, APIs and the plumbing that keeps data where it belongs.",
  },
  tools: {
    title: "Developer tools",
    blurb:
      "CLIs, registries, analyzers and presentation tools I built for my own work first.",
  },
  macos: {
    title: "macOS apps",
    blurb:
      "Small native utilities in Swift and SwiftUI. Menu bar first, no Dock icon, no Electron.",
  },
  systems: {
    title: "Systems",
    blurb:
      "Close to the kernel: a microVM sandbox for links you don't trust, a change history with bisect for the whole system, a least-privilege energy monitor for the Linux desktop, and a real-time OS brought up on RISC-V.",
  },
  web: {
    title: "Web",
    blurb: "Products people use in a browser.",
  },
}

const gh = (repo: string) => `https://github.com/KhaledSaeed18/${repo}`

export const projects: Project[] = [
  {
    slug: "patchgrid",
    name: "Patchgrid",
    tagline:
      "Multi-tenant IT service management with isolation enforced by the database.",
    summary:
      "Patchgrid is a ticketing and operations platform for IT and security teams. Each company gets its own subdomain, and its data is isolated at the database level through five independent layers, not by remembering a WHERE clause.",
    year: 2026,
    group: "platforms",
    kind: "SaaS platform",
    object: "tenants",
    stock: "teal",
    stack: [
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Turborepo",
      "Zod",
      "Docker",
    ],
    repo: "patchgrid",
    links: [{ label: "Source", href: gh("patchgrid") }],
    status: "In active development",
    featured: true,
    proof: [
      {
        value: "5",
        label: "isolation layers",
        note: "keys, credential, repository, prisma, postgres rls",
      },
      {
        value: "4",
        label: "itil record types",
        note: "incident, request, problem, change",
      },
      {
        value: "1",
        label: "subdomain per tenant",
        note: "marketing, workspace and api in one monorepo",
      },
    ],
    problem:
      "Multi-tenant apps usually trust every query to filter by tenant. One forgotten filter leaks another customer's tickets. I wanted a platform where a cross-tenant read is not a bug you can write.",
    approach: [
      {
        title: "Five layers of isolation",
        body: "Composite (orgId, id) foreign keys make a cross-tenant reference unrepresentable. The tenant comes from the credential, never the host. Every repository method takes an explicit orgId. A Prisma client extension sets a transaction-local config and throws without context. Postgres enforces it all with FORCE ROW LEVEL SECURITY and an app role that holds no BYPASSRLS.",
      },
      {
        title: "Four ITIL records, four lifecycles",
        body: "Incidents, service requests, problems and changes are modeled as different things with their own states. Priority is computed from impact and urgency, never typed into a dropdown.",
      },
      {
        title: "Invariants you can run",
        body: "A db:doctor script asserts the isolation guarantees actually hold against a live database, so the architecture is tested, not just described.",
      },
    ],
    highlights: [
      "Subdomain per tenant across a Turborepo monorepo: marketing site, tenant workspace and API",
      "Row level security forced on every tenant table",
      "Priority derived from impact x urgency",
      "CI with CodeQL analysis on every change",
    ],
  },
  {
    slug: "node-express-boilerplate",
    name: "Express boilerplate",
    tagline:
      "A production-grade Express and TypeScript starter that other developers actually fork.",
    summary:
      "A fully wired Express, TypeScript and Prisma backend with layered clean architecture, dependency injection, JWT and CSRF security, structured logging, automated security scanning and CI/CD. It also ships AI agent instructions so coding tools understand the codebase from day one.",
    year: 2025,
    group: "platforms",
    kind: "Open source template",
    object: "pipeline",
    stock: "terracotta",
    stack: [
      "Express",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Zod",
      "Vitest",
      "Docker",
    ],
    repo: "node-express-boilerplate",
    links: [{ label: "Source", href: gh("node-express-boilerplate") }],
    featured: true,
    proof: [
      {
        value: "30+",
        label: "github stars",
        note: "counted on the repository",
      },
      {
        value: "8",
        label: "forks",
        note: "developers starting new services from it",
      },
      {
        value: "5",
        label: "checks on every change",
        note: "pre-commit, conventional commits, codeql, trufflehog, dependency review",
      },
    ],
    problem:
      "Most Express starters stop at hello world. Teams then spend weeks wiring auth, errors, logging and pipelines, and every project does it slightly differently.",
    approach: [
      {
        title: "Layered by responsibility",
        body: "Routes, controllers, services and repositories each own one job, wired through a small DI container so any layer can be swapped or tested in isolation.",
      },
      {
        title: "Security as defaults",
        body: "Access and refresh tokens in hardened cookies, a CSRF double-submit pattern, security headers and rate limiting are on from the first request.",
      },
      {
        title: "Errors with a shape",
        body: "A typed error hierarchy and Prisma error mapping mean every failure leaves the API in the same predictable response format.",
      },
      {
        title: "Automation around the code",
        body: "Pre-commit hooks, conventional commits, CodeQL static analysis, TruffleHog secret scanning and dependency review run on every change.",
      },
    ],
    highlights: [
      "30+ stars and 8 forks from developers starting new services",
      "Clean architecture with a DI container",
      "JWT with refresh rotation plus CSRF protection",
      "Agent instructions so AI coding tools follow the conventions",
    ],
  },
  {
    slug: "team-flow",
    name: "TeamFlow",
    tagline:
      "A multi-tenant agile workspace API with sprints, RBAC and a full audit trail.",
    summary:
      "TeamFlow is a SaaS-style backend for organizations, projects, sprints and tasks. Organizations are fully isolated, roles are enforced by guards, and every change lands in an immutable audit log. Built during a 96-hour backend program where I ranked first in the cohort.",
    year: 2026,
    group: "platforms",
    kind: "Backend API",
    object: "cards",
    stock: "bone",
    stack: [
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "JWT",
      "SSE",
      "Resend",
      "Swagger",
    ],
    repo: "team-flow",
    links: [
      { label: "Source", href: gh("team-flow") },
      {
        label: "API docs",
        href: "https://team-flow-tmtz.onrender.com/api/docs",
      },
    ],
    problem:
      "Agile tooling needs more than CRUD: tenant isolation, a real permission model, notifications that arrive on time, and a history nobody can quietly edit.",
    approach: [
      {
        title: "Organization as the boundary",
        body: "Every query is scoped through membership, and a four-tier role hierarchy (owner, admin, member, viewer) is enforced with NestJS guards.",
      },
      {
        title: "Work modeled properly",
        body: "Tasks carry priorities, story points, subtasks, dependencies, labels, attachments and threaded comments, with an automatic activity timeline per task.",
      },
      {
        title: "Events that reach people",
        body: "Notifications stream over Server-Sent Events and email, and scheduled jobs expire stale invitations on their own.",
      },
    ],
    highlights: [
      "Ranked 1st in the MAPS backend cohort with this project",
      "JWT access and refresh rotation with OTP email verification",
      "Immutable audit log of all platform activity",
      "Live, documented REST API",
    ],
  },
  {
    slug: "node-authentication-template",
    name: "Node auth template",
    updatedAt: "2026-10-10",
    tagline:
      "Passkeys, OpenID Connect and revocable sessions in an authentication backend ready to fork.",
    summary:
      "An Express 5 and TypeScript authentication API on PostgreSQL and Prisma 7, with passwordless passkeys, TOTP recovery codes and a headless OpenID Connect provider. Rotating tokens, account self-service, reliable email delivery and tracing cover the work around sign-in too.",
    year: 2025,
    group: "platforms",
    kind: "Authentication service",
    object: "padlock",
    stock: "teal",
    stack: [
      "Node.js",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Zod",
      "WebAuthn",
      "OpenID Connect",
      "Argon2id",
      "Redis",
      "OpenTelemetry",
      "Vitest",
      "Docker",
    ],
    repo: "node-authentication-template",
    links: [
      { label: "Source", href: gh("node-authentication-template") },
      {
        label: "Architecture",
        href: `${gh("node-authentication-template")}/blob/main/docs/architecture.md`,
      },
      {
        label: "Changelog",
        href: `${gh("node-authentication-template")}/blob/main/CHANGELOG.md`,
      },
    ],
    problem:
      "Authentication is more than issuing a token. People need passwordless sign-in, a way to recover a second factor, control over their sessions and their data, and an identity other apps can trust. The starter should handle those lifecycles together.",
    approach: [
      {
        title: "Passkeys and a recoverable second factor",
        body: "WebAuthn passkeys support sign-in without typing an email or password, with user verification, single-use challenges and clone detection. Password sign-in can require a short-lived TOTP challenge, with encrypted secrets, replay protection and ten one-time recovery codes.",
      },
      {
        title: "An identity other apps can use",
        body: "A headless OpenID Connect provider supports authorization code flow with PKCE, discovery, userinfo and consent for third-party clients, plus token introspection and revocation endpoints. Access and ID tokens use rotating ES256 signing keys published through JWKS, so other services can verify them.",
      },
      {
        title: "Sessions you can actually end",
        body: "Opaque refresh tokens rotate on every use; reuse revokes the session. Every authenticated API request checks that its server-side session is active. Users can list sessions, revoke one, log out everywhere and inspect a paginated login history.",
      },
      {
        title: "The whole account lifecycle",
        body: "Email verification, password reset and confirmed email changes use single-use codes stored as HMACs, with attempt limits and resend cooldowns. Users can edit their profile, export their account data and delete their account after re-authentication.",
      },
      {
        title: "Security at each boundary",
        body: "Argon2id replaces bcrypt, upgrading existing hashes on sign-in. Breached password screening uses k-anonymity, failed sign-ins trigger account lockout, and recovery endpoints avoid revealing whether an account exists. Rate limits can share a Redis store, with Helmet, strict CORS and validated configuration around the API.",
      },
      {
        title: "Delivery and operations built in",
        body: "A PostgreSQL outbox commits email and security notices with the change that caused them, then retries delivery through workers. OpenTelemetry traces and business metrics, redacted structured logs, health checks and OpenAPI docs make the service inspectable. Integration tests use a real database; CI scans code and container images.",
      },
    ],
    highlights: [
      "Passwordless WebAuthn passkeys and TOTP with one-time recovery codes",
      "OpenID Connect with PKCE, consent and rotating ES256 keys",
      "Refresh token reuse detection and immediate session revocation in the API",
      "Confirmed email changes, account data export and self-service deletion",
      "Transactional email outbox, security alerts and an account activity log",
      "OpenTelemetry, OpenAPI, database integration tests and container security scans",
    ],
  },
  {
    slug: "sleep-track",
    name: "SleepTrack",
    updatedAt: "2026-10-12",
    tagline:
      "A sleep journal with an analytics engine: an async FastAPI service and a Next.js and daisyUI app.",
    summary:
      "SleepTrack turns logged nights into a nightly score, trends, a chronotype estimate, the habits that help or hurt your sleep and a weekly report. Version 2 is a ground-up rewrite: an async FastAPI service on PostgreSQL and Redis with a background worker, and a Next.js 16 app typed from the API's OpenAPI schema.",
    year: 2025,
    group: "platforms",
    kind: "Full-stack app",
    object: "moon",
    stock: "stone",
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Redis",
      "ARQ",
      "TypeScript",
      "Next.js",
      "daisyUI",
      "TanStack Query",
      "Playwright",
      "Docker",
    ],
    repo: "sleep-track-backend",
    stat: { label: "tests", value: "1,032 at 98% coverage" },
    links: [
      { label: "API source", href: gh("sleep-track-backend") },
      { label: "Client source", href: gh("sleep-track-frontend") },
      {
        label: "Architecture",
        href: `${gh("sleep-track-backend")}/blob/main/docs/architecture.md`,
      },
    ],
    proof: [
      {
        value: "1,032",
        label: "backend tests",
        note: "run against real postgresql and redis in ci",
      },
      {
        value: "98%",
        label: "test coverage",
        note: "measured on the api service",
      },
      {
        value: "15 min",
        label: "access token lifetime",
        note: "with rotating, hashed refresh tokens",
      },
      {
        value: "90",
        label: "nights seeded by the demo",
        note: "one click, no sign-up",
      },
    ],
    problem:
      "Logging sleep is the easy part. Making the log useful means knowing which night a session belongs to, which habits change your sleep and how steady your schedule really is, all in your own time zone and behind an account system you can trust with health data.",
    approach: [
      {
        title: "Analytics that respect the clock",
        body: "Bedtimes are averaged as angles, so 23:30 and 00:30 average to midnight instead of noon, and every night belongs to the date it began in the user's time zone. The API computes a weighted score from duration, quality, latency, awakenings and bedtime, plus consistency, sleep debt, streaks, chronotype and social jet lag, cached per user in Redis.",
      },
      {
        title: "Insights in plain language",
        body: "A rule engine behind a pluggable provider compares nights with and without each tag and ranks findings such as caffeine lowering your sleep quality. An ARQ worker emails weekly reports in each user's time zone, sends optional bedtime reminders and clears out demo accounts.",
      },
      {
        title: "Sessions built to be trusted",
        body: "Argon2id passwords, 15-minute access tokens and hashed refresh tokens that rotate on every use: reuse revokes the device, with a short grace window for two tabs refreshing at once. CSRF protection, Redis rate limits, device management, an audit log, email verification and optional Google sign-in with PKCE sit around it.",
      },
      {
        title: "Rules the database enforces",
        body: "PostgreSQL rejects overlapping nights with an exclusion constraint, allows one running timer per user through a partial unique index and searches notes with a trigram index. Every error leaves the API as an RFC 9457 problem document with a stable code.",
      },
      {
        title: "A client typed from the schema",
        body: "The Next.js app generates its types from the OpenAPI schema, keeps the access token in memory and refreshes it single-flight. A same-origin route handler streams /api to the service and forwards the client address, so rate limits see real users. It has two themes, a command menu, a mobile dock and charts with table views.",
      },
      {
        title: "Tested against the real thing",
        body: "Over a thousand backend tests run on real PostgreSQL and Redis, and Playwright drives sign-up with email confirmation, the journal, the timer and settings against the live API in CI. Both repos ship Docker images, a Compose stack and GitHub Actions, and a one-click demo seeds 90 nights.",
      },
    ],
    highlights: [
      "Weighted sleep score with circular bedtime statistics, chronotype and tag impact",
      "Rotating refresh tokens with reuse detection and CSRF protection",
      "Overlapping nights rejected by a Postgres exclusion constraint",
      "Weekly email reports and bedtime reminders from a background worker",
      "Client types generated from the API's OpenAPI schema",
      "1,032 backend tests at 98% coverage plus Playwright end-to-end tests in CI",
    ],
  },
  {
    slug: "deck-kit",
    name: "deck-kit",
    tagline:
      "HTML slides, a synced presenter view and one file that runs with Wi-Fi off.",
    summary:
      "A reusable presentation kit built with plain HTML, CSS and TypeScript. Write slides as small HTML files, present with step-aware notes and a pace timer, then ship a self-contained deck or PDF. Four portable agent skills guide research, writing, verification and design, with a review stop after each phase.",
    year: 2026,
    group: "tools",
    kind: "Presentation toolkit",
    object: "presentation",
    stock: "bone",
    stack: [
      "TypeScript",
      "Vite",
      "HTML",
      "CSS",
      "Vitest",
      "Playwright",
      "Biome",
    ],
    repo: "deck-kit",
    links: [
      { label: "Source and template", href: gh("deck-kit") },
      {
        label: "Authoring guide",
        href: `${gh("deck-kit")}/blob/main/docs/authoring.md`,
      },
      { label: "Example decks", href: `${gh("deck-kit")}/tree/main/examples` },
    ],
    status: "Open source, MIT licensed",
    proof: [
      {
        value: "1",
        label: "file to present offline",
        note: "deck.html includes the slides, assets and presenter view",
      },
      {
        value: "4",
        label: "portable agent skills",
        note: "new-deck, add-slide, retheme and ship-deck",
      },
      {
        value: "2",
        label: "complete example talks",
        note: "wireless networks and introductory cryptography",
      },
    ],
    problem:
      "A talk needs more than slides: a script, a shorter cut, reliable presenter controls and a fallback when the network fails. I wanted to keep all of that in a repository, reuse the engine for the next talk and change the design without rewriting the content.",
    approach: [
      {
        title: "Content, theme and engine stay separate",
        body: "Each slide is an HTML partial with semantic markup, build steps and speaker notes. A deck manifest sets the order, timing and alternate profiles. CSS tokens and layouts own the design; the vanilla TypeScript engine handles navigation on a fixed 1920 by 1080 canvas, scaled to fit the screen.",
      },
      {
        title: "A presenter view that keeps up",
        body: "The presenter sees the current step, next slide, highlighted script and pace against target timings. Either window can advance the talk. BroadcastChannel sync has an opener fallback for local files; keyboard, clicker and touch controls share the same navigation, with overview and blackout a key away.",
      },
      {
        title: "A workflow with review built in",
        body: "Four skills create a talk, add slides, retheme it or prepare delivery. The new-deck workflow moves through brief, research, content, verification and design, pausing for review at each phase. Shared instructions work with Codex, Claude Code and other compatible agents; slides can also be written by hand.",
      },
      {
        title: "Ready for the room, with a fallback",
        body: "Vite builds a static site or one deck.html that opens from a USB stick, including the presenter view. Export slides to PDF and notes to a printable script. Separate engine and deck browser suites check navigation, sync, slide fit, accessibility, print and offline behavior, with external requests blocked.",
      },
    ],
    highlights: [
      "Single-file offline delivery, static hosting and PDF export",
      "Two-way presenter sync with step-aware notes and a persistent timer",
      "Alternate talk profiles with their own slide order and target timings",
      "Keyboard and clicker controls, overview, blackout and touch navigation",
      "Portable agent skills with explicit review stages",
      "Two complete talks with distinct themes on the same framework-free engine",
    ],
  },
  {
    slug: "dotclaude",
    name: "dotclaude",
    tagline:
      "A registry of Claude Code skills, agents, commands and hooks, installable in one line.",
    summary:
      "My collection of Claude Code extensions for engineering, git, testing, security and research workflows. It is distributed as a shadcn GitHub registry and as installable plugins, with a searchable catalog site.",
    year: 2026,
    group: "tools",
    kind: "AI developer tooling",
    object: "toolbox",
    stock: "terracotta",
    stack: ["TypeScript", "shadcn registry", "Claude Code", "Next.js"],
    repo: "dotclaude",
    links: [
      { label: "Catalog", href: "https://dotclaude.khaledsaeed.tech/" },
      { label: "Source", href: gh("dotclaude") },
    ],
    problem:
      "AI coding agents are only as good as the procedures you give them, and good procedures end up scattered across projects and dotfiles.",
    approach: [
      {
        title: "Four kinds of extension",
        body: "Skills load themselves when a request matches, agents take whole side tasks in their own context, commands run on demand, and hooks fire on every event with no model judgment.",
      },
      {
        title: "Two ways to install",
        body: "Whole plugins through Claude Code, or single items through the shadcn CLI straight into a project's .claude folder.",
      },
      {
        title: "A thesis toolkit",
        body: "One plugin covers a full research lifecycle: literature search, verified citations, synthesis, methodology, LaTeX and an examiner-style reviewer.",
      },
    ],
    highlights: [
      "Catalog with search and filters at dotclaude.khaledsaeed.tech",
      "Skills, agents, commands and hooks across nine categories",
      "Distributed as a shadcn GitHub registry",
    ],
  },
  {
    slug: "mcce",
    name: "MCCE",
    tagline:
      "The study hub for my master's program: every course file, past exam and planner in one index.",
    summary:
      "An independent, student-built index for the LIU M.S. in Computer and Communication Engineering. It syncs shared Google Drive folders into one searchable site, and adds the plan of study, a prerequisite roadmap, a GPA calculator, a tuition planner and an in-browser PDF editor.",
    year: 2026,
    group: "web",
    kind: "Web app",
    object: "cap",
    stock: "teal",
    stack: [
      "TanStack Start",
      "React",
      "TypeScript",
      "Cloudflare Workers",
      "Google Drive API",
      "PWA",
    ],
    repo: "mcce",
    links: [
      { label: "Live site", href: "https://mcce.khaledsaeed.tech" },
      { label: "Source", href: gh("mcce") },
    ],
    featured: true,
    problem:
      "Course material lived in three channels that each lost something: official slides with no past exams, and chat groups that were hard to search and not open to everyone.",
    approach: [
      {
        title: "Drive as the source of truth",
        body: "A scheduled sync indexes the shared Drive folders by semester, course and material type, so the site tracks what is actually shared without anyone maintaining it by hand.",
      },
      {
        title: "The program on one screen",
        body: "Plan of study, prerequisite roadmap, admissions flow and tuition figures, with a planner that works a year of fees out from them.",
      },
      {
        title: "Works offline",
        body: "An installable PWA with saved files, RSS updates and exports to PDF, CSV and JSON.",
      },
    ],
    highlights: [
      "Weekly automatic sync from Google Drive",
      "In-browser PDF editor for any indexed file",
      "Runs on Cloudflare Workers",
    ],
  },
  {
    slug: "jwt-toolkit",
    name: "jwt-toolkit",
    tagline:
      "Inspect, compare and stress-test JWTs, with verification you can read.",
    summary:
      "A Python security CLI for debugging token changes, checking signatures and testing your own verifier. Version 1.1.0 adds token diffs, EdDSA and practical key inputs while tightening parsing, claim validation and scriptable errors. The JWS logic stays readable on top of cryptography, without pyjwt or python-jose.",
    year: 2026,
    updatedAt: "2026-10-17",
    group: "tools",
    kind: "Security CLI",
    object: "key",
    stock: "bone",
    stack: ["Python", "cryptography", "Click", "Rich", "PyPI"],
    repo: "jwt-toolkit",
    links: [
      { label: "PyPI", href: "https://pypi.org/project/jwt-toolkit/" },
      {
        label: "v1.1.0 release",
        href: `${gh("jwt-toolkit")}/releases/tag/v1.1.0`,
      },
      { label: "Source", href: gh("jwt-toolkit") },
    ],
    status: "v1.1.0 released",
    proof: [
      {
        value: "583",
        label: "passing tests",
        note: "v1.1.0, local pytest run on 17 oct 2026",
      },
      {
        value: "93.94%",
        label: "test coverage",
        note: "same run, statements and branches; startup banner excluded",
      },
    ],
    problem:
      "A decoded token can look convincing while its verifier accepts an invalid expiry, ignores a critical header or trusts the wrong algorithm. Debugging those failures also means comparing claims, handling real keys and getting dependable results into CI.",
    approach: [
      {
        title: "Make verification boundaries explicit",
        body: "Verification matches algorithm names case-sensitively, rejects unsupported crit headers and non-finite or non-numeric time claims, and expires a token at its exp second. Headers and payloads must be JSON objects. These fixes close acceptance edge cases and turn malformed input into a reported error instead of a crash.",
      },
      {
        title: "Explain what changed between tokens",
        body: "The new diff command walks nested headers and payloads with JSON Pointer paths, highlighting identity, permission and lifetime fields. It preserves array order and JSON types, and distinguishes encoding-only changes from changed claims. JSON output and an optional failure exit code make it useful for regression checks; comparison does not verify either token.",
      },
      {
        title: "Work with the keys applications use",
        body: "Ed25519, Ed448 and EdDSA join HMAC, RSA, RSA-PSS and ECDSA, including OKP keys from JWKS. X.509 certificates and encrypted private keys reduce key-conversion work. Secret files keep HMAC values out of command arguments, while payload files, relative lifetimes and raw secret output make test fixtures easier to script.",
      },
      {
        title: "Crack the candidates you actually supplied",
        body: "Wordlist lines retain spaces, leading # characters and non-UTF-8 bytes, so valid candidates are no longer silently changed or skipped. Bounded batches run in worker processes to bypass CPython's GIL, preserving the first match in wordlist order. Small lists avoid process startup costs, and a bundled list makes the command usable immediately after installation.",
      },
      {
        title: "Keep security findings honest",
        body: "Keyless audits flag risky headers, missing claims and weak configurations; --require now checks every named claim, including custom ones. Forge produces attack-shaped tokens for your own verifier and labels header-only variants whose rejection cannot rule out the named flaw. Untrusted text renders literally, preventing crafted claims from crashing or restyling terminal reports.",
      },
      {
        title: "Ship a CLI that automation can trust",
        body: "Every --json failure path returns an error document with a stable code. Wordlist downloads stay on verified TLS and use the installed release's tag. Before PyPI publication, the tagged commit must pass tests, coverage, lint, types and security checks, and its tag must match the package version. Trusted Publishing adds distribution attestations.",
      },
    ],
    highlights: [
      "v1.1.0 released on 17 October 2026, installable with pipx or uv",
      "Token diffs with JSON Pointer paths and CI exit codes",
      "EdDSA, JWKS, certificates and encrypted private keys",
      "UTC and relative timestamps for decoded time claims",
      "Bundled wordlist and bounded process-based cracking",
      "Stable JSON errors and a validated PyPI publishing workflow",
    ],
  },
  {
    slug: "wakehold",
    name: "Wakehold",
    updatedAt: "2026-10-19",
    tagline:
      "Keeps a Mac awake exactly as long as the work is alive, then lets it sleep.",
    summary:
      "A session-aware wake controller for macOS: a menu bar app, a CLI and a local control endpoint over a Unix socket. A running process, a listening port, a wrapped command, a coding agent's session, a chosen app or a timer each hold the machine open, and the hold releases itself when the last one ends. When it does, the Mac can notify you, sleep or shut down.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "hourglass",
    stock: "stone",
    stack: ["Swift", "SwiftUI", "IOKit", "Swift Testing"],
    repo: "wakehold",
    links: [
      { label: "Source", href: gh("wakehold") },
      { label: "Agent hooks", href: `${gh("wakehold")}#agent-hooks` },
    ],
    platform: "macOS 14 or later, Apple Silicon or Intel",
    audience: "anyone who runs builds, servers or coding agents on a Mac",
    plain:
      "Macs go to sleep after a few idle minutes, which kills a long download, a build or an AI agent working overnight. The usual fix is a switch you flip on and forget. Wakehold instead watches the thing you care about and keeps the Mac awake only while it is running, then lets it sleep or shuts it down for you.",
    proof: [
      {
        value: "6",
        label: "kinds of session",
        note: "timer, process, port, command, agent and app",
      },
      {
        value: "97",
        label: "automated tests",
        note: "swift testing, 81 in the kit and 16 in the app",
      },
      {
        value: "0",
        label: "network ports opened",
        note: "the control endpoint is a unix socket, mode 0600",
      },
      {
        value: "602 KB",
        label: "cli binary",
        note: "release build, arm64, measured on 19 oct 2026",
      },
    ],
    problem:
      "Keep-awake tools are a switch you flip on and forget to flip off. They model a timer, not the thing you actually care about: the build, the dev server, the agent that will finish at some point in the night.",
    approach: [
      {
        title: "Sessions, not switches",
        body: "Tell it what to watch: a build, a dev server on :3000, a process id, an app, a Claude Code or Codex session, or just twenty minutes. Every session is one type conforming to one protocol, and the Mac is awake exactly while at least one is active. Nothing toggles the power assertion directly; one reconcile step derives it from the sessions.",
      },
      {
        title: "Leases, not goodbyes",
        body: "Agent hooks open a lease keyed by the session id and renew it on every event. A crash or a kill never sends an end hook, so the lease's expiry is the source of truth, not the goodbye. The hooks are no-ops when the app is not running, so they never block the agent.",
      },
      {
        title: "Cleans up after itself",
        body: "When the last session ends it can notify, sleep the display, sleep the Mac, shut down or restart. Each action is armed per occasion, shown in the menu and cancelable. Run the agent overnight, shut down when it finishes.",
      },
      {
        title: "Guardrails for the battery",
        body: "A hold can release itself on battery, below a chosen charge or in Low Power Mode. The display stays on by default, with one switch to let it sleep while the system stays awake. The system-level assertion that fights the lid is never used.",
      },
      {
        title: "Legible",
        body: "The menu lists every reason the Mac is awake, including other apps' power assertions like a call, audio or a stray caffeinate, named by their owning process. Wakehold's own holds show up in pmset like everyone else's.",
      },
      {
        title: "A socket, not a port",
        body: "The CLI and hooks talk to the app over HTTP on a Unix domain socket under Application Support, mode 0600 with a peer check. A localhost port would be reachable from a browser and any local process; a socket is scoped by the filesystem, and curl still works.",
      },
    ],
    highlights: [
      "Menu bar app, CLI and a control endpoint over a Unix socket",
      "Watches processes, ports, commands, agents, apps and timers",
      "Hooks for Claude Code, Codex, Gemini CLI and Cursor with crash-safe leases",
      "Post-session sleep, shutdown, restart or notify; battery guardrails",
      "Localised in English and Arabic, with mirrored layout",
      "Native Swift with IOKit power assertions, no Electron",
    ],
    decisions: [
      {
        chose: "a Unix domain socket for the control endpoint",
        over: "an HTTP server on a localhost port",
        why: "A port is reachable from any local process and, through DNS rebinding or a form POST, from a web page. A socket file with mode 0600 and a peer-uid check is scoped by the filesystem. It cost a hand-written HTTP/1.1 parser, since NWListener cannot bind a socket, but curl --unix-socket still works.",
      },
      {
        chose: "expiring leases for agent sessions",
        over: "trusting start and end hooks",
        why: "End hooks never fire when an agent crashes or is killed, which would leave the Mac awake all night. A lease renewed on every event releases on its own when the agent goes quiet.",
      },
      {
        chose: "preventing idle display sleep",
        over: "the system-wide PreventSystemSleep assertion",
        why: "The system assertion only applies on AC power and fights the user closing the lid. Keeping the lid-closed case out of scope avoids a root helper and keeps every action in user space.",
      },
      {
        chose: "no App Sandbox",
        over: "a sandboxed, store-ready build",
        why: "Watching arbitrary processes and ports and wrapping commands needs access the sandbox forbids. The app is built from source instead of distributed through the App Store.",
      },
    ],
    install: [
      {
        label: "build the menu bar app",
        command: "git clone https://github.com/KhaledSaeed18/wakehold && cd wakehold && open Wakehold.xcodeproj",
        note: "xcode 16 or later, macos 14 or later",
      },
      {
        label: "build the cli",
        command:
          "swift build --package-path WakeholdKit -c release --product wakehold",
      },
      {
        label: "hold while a command runs",
        command: "wakehold -- pnpm build",
        note: "the app must be running",
      },
    ],
    timeline: [
      {
        date: "2026-07-21",
        title: "First commit",
        body: "The kit, the IOKit assertion, the socket endpoint, the CLI, agent leases, post-session actions and guardrails, most of it in one day.",
      },
      {
        date: "2026-07-22",
        title: "Arabic localisation",
        body: "Menu, settings and duration plurals in a second language, with a mirrored layout.",
      },
      {
        date: "2026-07-23",
        title: "Other holds in the menu",
        body: "Every process's sleep assertion read from IOKit and listed with its reason.",
      },
    ],
    faq: [
      {
        q: "Does Wakehold need Accessibility or Screen Recording permission?",
        a: "No. The only system prompt is Automation for System Events, and only if you arm shut down or restart as a post-session action. The notify action asks for notification permission.",
      },
      {
        q: "Does the CLI work without the app running?",
        a: "No. The CLI and the agent hooks talk to the running app over its socket. The hooks do nothing when the app is absent, so an agent is never blocked by them.",
      },
      {
        q: "Does it keep the Mac awake with the lid closed?",
        a: "Not without an external display. That needs the system-level assertion or a root helper, which Wakehold deliberately avoids.",
      },
      {
        q: "Is there a download or a Homebrew formula?",
        a: "Not yet. Build the app from the Xcode project and the CLI with Swift Package Manager; both are a single command. It runs on Apple Silicon and Intel Macs on macOS 14 or later.",
      },
    ],
    related: ["sever", "baud", "gauge", "dotclaude"],
  },
  {
    slug: "repo-scout",
    name: "Repo Scout",
    updatedAt: "2026-10-10",
    tagline:
      "Explore a codebase through architecture maps, searchable files and Git history, all on your machine.",
    summary:
      "Repo Scout turns a local Git repository into a navigable atlas of its code and history. A redesigned React interface connects activity calendars, file ownership, searchable source, architecture graphs and duplicate code, backed by a Go scanner and SQLite with live scan progress.",
    year: 2026,
    group: "tools",
    kind: "Analytics platform",
    object: "lens",
    stock: "terracotta",
    stack: [
      "Go",
      "SQLite",
      "React",
      "TypeScript",
      "Vite",
      "TanStack Query",
      "React Flow",
      "WebSocket",
    ],
    repo: "repo-scout",
    links: [
      { label: "Source", href: gh("repo-scout") },
      { label: "UI showcase", href: `${gh("repo-scout")}#see-it-in-action` },
    ],
    proof: [
      {
        value: "3,602",
        label: "files scanned",
        note: "tanstack query repository, the showcase scan",
      },
      { value: "5,517", label: "commits indexed", note: "same scan" },
      { value: "1,141", label: "contributors mapped", note: "same scan" },
      {
        value: "0",
        label: "bytes sent off the machine",
        note: "loopback only, no telemetry",
      },
    ],
    problem:
      "Understanding an unfamiliar codebase means juggling five tools with five output formats, and some of them want your source uploaded.",
    approach: [
      {
        title: "An interface built for exploration",
        body: "A survey-map visual identity, a repository switcher and grouped navigation connect dedicated views for overview, activity, commits, contributors, branches, files, search, metrics, dependencies and duplicates. Light, dark and system themes, keyboard-accessible repository picking and a mobile menu carry the same interface across screens.",
      },
      {
        title: "History with the right clock",
        body: "Commit calendars, hour-of-week activity and streaks use each author's local time. A paginated commit log links to contributors and file ownership, while a lazy file tree and sortable table expose per-file size, complexity and history.",
      },
      {
        title: "Findings you can trace",
        body: "Architecture graphs collapse imports to folders at a chosen depth, lay out importers beside their dependencies and let you select a node to trace its connections. Cycle and potentially dead-file findings, duplicate code samples with linked locations, and highlighted search matches lead back to the source. Graphs export as SVG.",
      },
      {
        title: "A scan you can watch and control",
        body: "The Go pipeline streams and batch-inserts files, history, dependencies, imports and duplicate blocks, then builds a SQLite FTS5 content index. Persisted background jobs report progress over WebSocket, support pause, resume and cancel, and re-queue interrupted scans after a crash. Completing a scan refreshes the open views.",
      },
      {
        title: "Never leaves the machine",
        body: "No account, external APIs, telemetry or source uploads. The API binds to loopback by default, the frontend talks to localhost, and WebSocket connections are limited to the same origin. Files, commits and contributors export as CSV or JSON.",
      },
    ],
    highlights: [
      "Redesigned interface with dedicated code and history views, light and dark themes and mobile navigation",
      "Folder-level architecture maps with traceable imports and SVG export",
      "Indexed source search, linked duplicate samples and per-file ownership",
      "Live scan progress with pause, resume, cancel and crash recovery",
      "Showcased on a real TanStack Query scan: 3,602 files, 5,517 commits and 1,141 contributors",
    ],
  },
  {
    slug: "dir-analysis-tool",
    name: "dir-analysis-tool",
    updatedAt: "2026-10-19",
    tagline:
      "Find out what is taking up space: largest folders, duplicates, stale files and size budgets for CI, in one pass.",
    summary:
      "dat is a memory-bounded directory analyzer for the terminal and for CI. It walks a tree once and reports the largest folders and files, duplicated content, empty and stale files and a breakdown by type, then prints it as a table, JSON, Markdown, CSV or a single-file HTML report. Version 3 adds directory diffs, a watch mode, size budgets that fail a build, and a typed library API that returns exactly what the CLI prints.",
    year: 2025,
    group: "tools",
    kind: "npm CLI",
    object: "folder",
    stock: "bone",
    stack: [
      "TypeScript",
      "Node.js",
      "Commander",
      "Vitest",
      "tsdown",
      "semantic-release",
      "GitHub Actions",
      "npm",
    ],
    repo: "dir-analysis-tool",
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/dir-analysis-tool" },
      { label: "Source", href: gh("dir-analysis-tool") },
      {
        label: "v3.0.0 release",
        href: `${gh("dir-analysis-tool")}/releases/tag/v3.0.0`,
      },
      {
        label: "Changelog",
        href: `${gh("dir-analysis-tool")}/blob/main/CHANGELOG.md`,
      },
    ],
    status: "v3.0.0 released",
    platform: "Node.js 22.12 or later on macOS, Linux and Windows",
    audience: "developers with a full disk, and teams that want a build to fail when a folder grows",
    plain:
      "When a disk fills up, the hard part is finding out why. dat looks through a folder and tells you which sub-folders and files take the most room, which files are exact copies of each other and what has not been touched in years. It can also watch a folder, compare two folders, and refuse to let a project ship if its output grows past a limit you set.",
    proof: [
      {
        value: "28,660",
        label: "files scanned in 0.13 s",
        note: "this site's node_modules, 442 mib, warm cache, measured on 19 oct 2026",
      },
      {
        value: "0.5 s",
        label: "with duplicate detection",
        note: "same tree: 1,559 duplicate groups, 6.3 mib reclaimable",
      },
      {
        value: "162",
        label: "tests, 94.6% statements",
        note: "vitest, thresholds enforced in ci on 3 operating systems and 3 node versions",
      },
      {
        value: "1,149",
        label: "npm downloads in a year",
        note: "api.npmjs.org, year to 16 oct 2026",
      },
    ],
    problem:
      "Disk audits either load everything into memory or give you a wall of output you cannot act on or pipe anywhere. The ones that are fast tend to lie a little: they count hard links twice, follow symlink cycles, or skip unreadable paths without saying so.",
    approach: [
      {
        title: "One walk, bounded memory",
        body: "Every file is stat'ed exactly once. Top-N lists live in bounded heaps, one concurrency limiter covers every filesystem call so wide trees cannot exhaust handles, and depth-first scheduling keeps the queue small. The author's benchmark holds about 9 MB for 140,000 files.",
      },
      {
        title: "Duplicates in three stages",
        body: "Files are grouped by size first. Candidates over 256 KiB are then compared by a SHA-256 sample of their first and last 64 KiB, and only survivors get a full streaming hash with reused buffers. Most files are never read in full, which made duplicates about four times faster than version 2.",
      },
      {
        title: "Answers that point somewhere",
        body: "The headline is the largest folders, and a folder that is 95% one child folds into it so the list points at where the data lives instead of repeating parents. Large, stale, empty and duplicate files come with totals you can act on, and ordering is by size then path, never discovery order.",
      },
      {
        title: "Budgets, diffs and a watch",
        body: "Rules like size<=2MB or duplicates=0 fail a build with exit code 2 and name the rule. dat compare lists what was added, removed and changed between two trees, by content on request. dat watch follows a folder with native filesystem events and streams NDJSON.",
      },
      {
        title: "Five outputs, one shape",
        body: "Pretty, JSON with a versioned schema, Markdown for a pull request summary, CSV with a section column and neutralised formula cells, and an HTML report in a single file with inline charts and a content security policy that blocks all network access. Progress and warnings go to stderr; stdout carries only the report.",
      },
      {
        title: "A library that is the CLI",
        body: "analyze, compare and every renderer are exported as typed ESM, and the library's return value is exactly what --format json prints. Releases are cut by semantic-release from conventional commits with npm provenance, after a matrix of three operating systems and three Node versions passes.",
      },
    ],
    highlights: [
      "Largest folders, largest files, duplicates, stale and empty files, type breakdown",
      "Size budgets for CI that exit 2, directory diffs and a watch mode",
      "Pretty, JSON, Markdown, CSV and single-file HTML output",
      "Hard links counted once, symlink cycles detected, unreadable paths reported",
      "Typed library API with the same results as the CLI",
      "Published with npm provenance after tests on macOS, Linux and Windows",
    ],
    decisions: [
      {
        chose: "staged SHA-256 duplicate detection",
        over: "hashing every file in full",
        why: "Grouping by size and sampling 128 KiB of large candidates rules out most files before any full read. Duplicates got about four times faster on a 140,000-file tree, at the cost of a third code path and tests for every stage.",
      },
      {
        chose: "largest folders as the headline",
        over: "largest files",
        why: "A full disk is usually a folder problem: caches, build output, old exports. Folding a folder into a child that holds 95% of it keeps the list short, though it hides the parent's name until you expand the tree.",
      },
      {
        chose: "binary units by default",
        over: "decimal units",
        why: "Finder, Explorer and du disagree with each other; KiB and MiB match what the filesystem allocates. The --si flag switches, and a bare 100 still means 100 MiB so version 2 scripts keep working.",
      },
      {
        chose: "one exclude pattern per flag",
        over: "a comma-separated list",
        why: "A list argument kept swallowing the directory argument that followed it. Repeating the flag is more typing but never ambiguous, and gitignore syntax covers most of what people were listing anyway.",
      },
      {
        chose: "stdout for the report only",
        over: "mixing progress into the output",
        why: "Piping dat into jq or a step summary has to work without flags. Progress, warnings and status go to stderr and the progress line only draws when stderr is a terminal.",
      },
    ],
    install: [
      {
        label: "run it on a folder without installing",
        command: "npx dir-analysis-tool ~/Downloads",
        note: "node 22.12 or later",
      },
      {
        label: "find duplicates and files untouched for two years",
        command: "dat . -d --stale 2y",
      },
      {
        label: "fail a build when the output grows",
        command: 'dat dist -b "size<=2MB" -b "duplicates=0" -f markdown',
        note: "exit code 2 when a budget fails",
      },
      {
        label: "use it from code",
        command: "npm install dir-analysis-tool",
      },
    ],
    timeline: [
      {
        date: "2025-06-20",
        title: "v1.0.0",
        body: "An interactive directory analyzer with a progress bar and a tree view, published to npm the same day.",
      },
      {
        date: "2026-04-28",
        title: "v2.0.5",
        body: "A rewrite with a streaming engine and subcommands, a dat binary, and semantic-release cutting versions from conventional commits.",
      },
      {
        date: "2026-07-03",
        title: "v2.0.7",
        body: "A new README with a banner and badges; the npm page stays current because documentation commits ship as patches.",
      },
      {
        date: "2026-10-18",
        title: "v3.0.0",
        body: "Engine and CLI rewritten: largest folders, compare, watch, budgets, Markdown output, a library API, a versioned JSON schema and staged SHA-256 duplicates. Old flag names still work with a warning.",
      },
    ],
    faq: [
      {
        q: "Why does the total differ from du?",
        a: "du reports allocated blocks. dat's headline is the sum of file lengths, and its on-disk line matches du. It also skips .git and node_modules unless you pass --all, and counts hard-linked data once.",
      },
      {
        q: "Is it safe to run on a huge directory?",
        a: "Memory does not grow with the number of files unless you ask for a listing report, filesystem concurrency is capped, unreadable paths are reported instead of aborting the scan, and Ctrl+C exits cleanly with code 130.",
      },
      {
        q: "Does it change anything on disk?",
        a: "No. It only reads. The only files it writes are the reports you ask for with --output, --html or --csv, and the config file created by dat init.",
      },
      {
        q: "How do I use it in CI?",
        a: "Run it with one or more -b budgets and the markdown format, and append the output to the job summary. A failed budget exits with code 2 and names the rule that failed.",
      },
      {
        q: "Will my version 2 scripts break?",
        a: "Mostly not. Old flag names and config keys are still read with a deprecation warning. The JSON shape moved to schema version 3 and units are binary by default, so check anything that parses the output.",
      },
    ],
    related: ["repo-scout", "jwt-toolkit"],
  },
  {
    slug: "gauge",
    name: "Gauge",
    updatedAt: "2026-10-19",
    tagline:
      "Pixel-precise rulers, guides, a measuring tape, a color sampler and a loupe over the whole macOS desktop.",
    summary:
      "A native macOS overlay that gives every display physical-pixel rulers and persistent guides, measures any region or any two points, reads the color under the pointer and magnifies it, while every click outside a tool passes straight through to the app underneath.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "square",
    stock: "teal",
    stack: ["Swift", "AppKit", "SwiftUI", "ScreenCaptureKit"],
    repo: "gauge",
    links: [{ label: "Source", href: gh("gauge") }],
    platform: "macOS 14 or later, Apple Silicon or Intel",
    audience: "designers and front-end developers checking that things line up",
    plain:
      "When you build a screen, things need to line up and be the right size, but the ruler in one app cannot reach into another. Gauge draws see-through rulers and guide lines over the whole Mac screen, measures any distance, picks up the colour under the pointer and magnifies pixels, so you can check any app against any mockup.",
    proof: [
      {
        value: "6",
        label: "tools in one overlay",
        note: "rulers, guides, measure, crosshair, color sampler and loupe",
      },
      {
        value: "5",
        label: "clipboard formats",
        note: "dimensions, plain, with units, css and with position",
      },
      {
        value: "1.1 MB",
        label: "release binary",
        note: "arm64, built on 19 oct 2026; no dependencies outside the system frameworks",
      },
      {
        value: "0",
        label: "permissions for the core tools",
        note: "screen recording only for the sampler and loupe",
      },
    ],
    problem:
      "Ruler tools live inside one browser tab or one design app, so you cannot line up a native window against a design mockup, or measure the gap between two things that belong to different programs.",
    approach: [
      {
        title: "Real pixels",
        body: "Tick labels respect each screen's backing scale factor, so 100 means 100 actual display pixels on any screen. Guides are stored in physical pixels per display, and a small core library owns every point-to-pixel conversion so the arithmetic is unit tested without a screen.",
      },
      {
        title: "Out of the way",
        body: "Transparent, non-activating panels sit over each display. They ignore mouse events except on the two ruler strips while guide placement is on, and while measure, crosshair, sampler or loupe owns the pointer. Everything else clicks through.",
      },
      {
        title: "Measure, then take it with you",
        body: "Drag a box for width by height, or Option-drag two points for distance and angle. Measurements stay held on screen, click one to remove it, and the size copies in any of five formats including CSS, with optional position and aspect-ratio badges.",
      },
      {
        title: "Read the screen itself",
        body: "The color sampler reads the pixel under the pointer as hex and RGB through ScreenCaptureKit, excluding Gauge's own windows from the capture. The loupe magnifies the same feed with a pixel grid, the exact coordinate and its color.",
      },
      {
        title: "Guides that stay put",
        body: "Guides survive a restart, get numbered V1, H1 from their sorted position rather than a stored name, can be placed at an exact pixel from the settings, and are listed with counts in a remove window with select all and remove selected.",
      },
    ],
    highlights: [
      "Rulers, guides, measure, crosshair, color sampler and loupe on every display",
      "Five global shortcuts without Accessibility permission",
      "Two-point measurement with distance and angle",
      "Copy a size as dimensions, plain, units, CSS or with position",
      "Pure Swift Package Manager project, Swift 6 language mode",
    ],
    decisions: [
      {
        chose: "ScreenCaptureKit for the sampler and loupe",
        over: "the older CoreGraphics capture calls",
        why: "The legacy APIs only return the desktop on current macOS, so the colour under a window came back wrong. ScreenCaptureKit returns the real composite and can exclude Gauge's own overlays, at the cost of a Screen Recording prompt for those two tools only.",
      },
      {
        chose: "Carbon hot keys for the global shortcuts",
        over: "an event tap",
        why: "RegisterEventHotKey works without Accessibility permission, which keeps the install to a single open command. The in-mode keys use a global monitor instead, which may need Input Monitoring; the menu bar is the fallback.",
      },
      {
        chose: "guide numbers derived from position",
        over: "stored names",
        why: "Deleting or moving a guide would leave gaps or stale names. Sorting at render time keeps V1 the leftmost guide whatever happened before.",
      },
    ],
    install: [
      {
        label: "build and run in xcode",
        command: "git clone https://github.com/KhaledSaeed18/gauge && cd gauge && open Package.swift",
        note: "xcode 16 or later, macos 14 or later",
      },
      {
        label: "or assemble an app bundle from the terminal",
        command: "./Scripts/make-app.sh && open Build/Gauge.app",
      },
    ],
    timeline: [
      {
        date: "2026-08-05",
        title: "First commit",
        body: "The menu bar shell, the physical-pixel ruler overlay and a build workflow.",
      },
      {
        date: "2026-08-08",
        title: "Measure and crosshair",
        body: "Guide numbering, selective removal, separate axis colours, multiple global hot keys and a settings sidebar.",
      },
      {
        date: "2026-08-09",
        title: "Color sampler and loupe",
        body: "Two-point lines, copy formats, exact-pixel guides, a tested geometry core and the switch to ScreenCaptureKit.",
      },
    ],
    faq: [
      {
        q: "Does Gauge need Screen Recording permission?",
        a: "Only for the color sampler and the loupe, which read the screen through ScreenCaptureKit. Grant it once in Privacy and Security, then reopen Gauge. Rulers, guides, measure and crosshair work without it.",
      },
      {
        q: "Does the overlay block my clicks?",
        a: "No, except on the two ruler strips while guide placement is on, and while measure, crosshair, sampler or loupe is active. Toggle the tool off and the desktop is click-through again.",
      },
      {
        q: "Do guides survive a restart?",
        a: "Yes. They are saved per display in physical pixels. Measurements are kept for the session only.",
      },
      {
        q: "Is there a signed download?",
        a: "Not yet. Build it from the Swift package in Xcode, or run the bundled script that assembles an app from a release build. It runs on Apple Silicon and Intel Macs on macOS 14 or later.",
      },
    ],
    related: ["wakehold", "sever", "baud"],
  },
  {
    slug: "sever",
    name: "Sever",
    updatedAt: "2026-10-19",
    tagline:
      "Every running process and open port on your Mac, one click from the menu bar.",
    summary:
      "A menu bar app that lists processes and open network ports side by side, refreshed every few seconds, filtered as you type, and lets you end either by PID: gracefully by default and forcefully one right-click away. It always tells you why something would not die.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "scissors",
    stock: "terracotta",
    stack: ["Swift", "SwiftUI", "Swift Testing"],
    repo: "sever",
    links: [{ label: "Source", href: gh("sever") }],
    platform: "macOS 14 or later, Apple Silicon or Intel",
    audience: "developers with a dev server that will not let go of its port",
    plain:
      "Sometimes a program on your Mac keeps running when you want it gone, or holds on to a network port your new program needs. Sever shows everything that is running and every port in use in a small menu bar panel, and stops any of them with one click, politely first and forcefully if you insist, always saying whether it worked.",
    proof: [
      {
        value: "825",
        label: "lines of swift",
        note: "the app and its kit, tests excluded; the smallest app on this site",
      },
      {
        value: "23",
        label: "automated tests",
        note: "parsers checked against captured ps and lsof output, no process spawned",
      },
      {
        value: "4",
        label: "outcomes every attempt reports",
        note: "severed, denied, already gone, or the errno by name",
      },
      {
        value: "27 min",
        label: "from repository creation to last push",
        note: "29 commits on 21 aug 2026",
      },
    ],
    problem:
      "Killing a stray dev server means kill -9 $(lsof -ti:3000) or three windows of Activity Monitor, and neither tells you why a process survived.",
    approach: [
      {
        title: "Two lists, one action",
        body: "Processes with CPU, memory and user, and ports with their process, protocol and bind address, share one control. SIGTERM by default; SIGKILL is a separate affordance behind a right-click or a hover, never the default button, so a slip of the mouse cannot force-kill anything.",
      },
      {
        title: "Never fails silently",
        body: "Every attempt reports what happened: severed, denied because the process is root-owned or protected, already gone, or a readable error. Already gone is treated as success, since the goal was for it to stop.",
      },
      {
        title: "Fresh enough, and pausable",
        body: "Both lists poll every three seconds off the main thread, pause on request, refresh on demand and stop when the panel closes. One search field matches name, PID, address, port or protocol, and processes sort by CPU, memory, name or PID.",
      },
      {
        title: "Honest about its sources",
        body: "Today the lists come from ps and lsof, parsed by pure functions that are tested against captured output. Both listers sit behind protocols so a libproc implementation can drop in later without touching the interface. Killing calls kill(2) directly.",
      },
    ],
    highlights: [
      "No Dock icon, no permissions requested, no App Sandbox",
      "Live refresh every three seconds, search as you type, sortable",
      "SIGTERM by default, SIGKILL one right-click away",
      "Honest error reporting, including processes it is not allowed to kill",
      "Monospaced, dense and scannable",
    ],
    decisions: [
      {
        chose: "shelling out to ps and lsof",
        over: "libproc and the socket APIs",
        why: "Simple, observable and fast enough at a refresh interval of a few seconds. The parsers are pure functions behind protocols, so a native implementation is a drop-in later without changing the interface.",
      },
      {
        chose: "a timer-driven poll",
        over: "an event source",
        why: "macOS has no cheap system-wide notification for a process starting or a port opening. A three-second poll that pauses and stops with the panel is bounded and predictable, which matters more here than sub-second freshness.",
      },
      {
        chose: "reporting permission denied",
        over: "a privileged helper",
        why: "Root-owned processes reject the signal and show blank fields from an unprivileged lsof. Sever says so instead of pretending. A launchd helper is a later step with its own security surface.",
      },
    ],
    install: [
      {
        label: "build and run in xcode",
        command: "git clone https://github.com/KhaledSaeed18/sever && cd sever && open Sever.xcodeproj",
        note: "xcode 16 or later, macos 14 or later",
      },
      {
        label: "run the kit tests",
        command: "swift test --package-path SeverKit",
      },
    ],
    timeline: [
      {
        date: "2026-08-21",
        title: "Built and published in one sitting",
        body: "Kit, parsers, kill controller with typed results, the panel, tests, CI and docs, in 29 commits over 27 minutes of pushes.",
      },
    ],
    faq: [
      {
        q: "Does Sever need Accessibility or any other permission?",
        a: "No. It runs ps and lsof and calls kill as your user. Its Info.plist declares no usage strings.",
      },
      {
        q: "Can it kill root or system processes?",
        a: "No. Those return permission denied, and Sever shows that instead of failing silently. It ships no privileged helper on purpose.",
      },
      {
        q: "Does it use CPU in the background?",
        a: "It polls every three seconds while the panel is open and stops when it closes. You can pause the poll from the header.",
      },
      {
        q: "Which ports does it show?",
        a: "Listening TCP sockets and active UDP sockets, with the process name, protocol and bind address.",
      },
    ],
    related: ["wakehold", "gauge", "baud"],
  },
  {
    slug: "baud",
    name: "Baud",
    tagline:
      "Break reminders delivered by a small desktop character that knows when to stay quiet.",
    summary:
      "Instead of a notification you swipe away on reflex, a character slides in from a screen corner, says one short thing, and leaves. It holds reminders during calls and full screen video and delivers them once the moment clears.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "bubble",
    stock: "bone",
    stack: ["Swift", "SwiftUI"],
    repo: "baud",
    links: [{ label: "Source", href: gh("baud") }],
    problem:
      "Break reminders are banners you dismiss without reading, and they interrupt at the worst moments.",
    approach: [
      {
        title: "Never at a bad moment",
        body: "No reminders during a call, a presentation or full screen video, or while you are away. They wait, then arrive.",
      },
      {
        title: "Never guilts you",
        body: "No streaks, no sad faces. Ignore it and it leaves on its own.",
      },
    ],
    highlights: [
      "Free and open source, unlike every comparable app",
      "Native Swift, menu bar only",
      "Custom reminders",
    ],
  },
  {
    slug: "urljail",
    name: "urljail",
    updatedAt: "2026-10-15",
    tagline:
      "Opens a link you don't trust inside a throwaway microVM and reports what the page actually does.",
    summary:
      "urljail restores a Firecracker microVM from a snapshot, opens the URL in sandboxed Chrome and records the visit from two sides: the browser through the DevTools Protocol, and the host through eBPF, its own DNS resolver and the firewall. The report covers redirects, DNS, TLS SNI, forms, screenshots and phishing indicators, then the VM is destroyed. It is in active development on my Linux machine.",
    year: 2026,
    group: "systems",
    kind: "Phishing URL sandbox",
    object: "cage",
    stock: "bone",
    stack: [
      "Go",
      "Firecracker",
      "KVM",
      "eBPF",
      "C",
      "nftables",
      "WireGuard",
      "Chrome DevTools Protocol",
      "gRPC",
      "SELinux",
      "NestJS",
      "Next.js",
      "PostgreSQL",
    ],
    repo: "urljail",
    links: [
      { label: "Source", href: gh("urljail") },
      { label: "Roadmap", href: `${gh("urljail")}/blob/main/docs/roadmap.md` },
      {
        label: "Architecture",
        href: `${gh("urljail")}/blob/main/docs/architecture.md`,
      },
      {
        label: "Cloaking study",
        href: `${gh("urljail")}/blob/main/docs/research/r1-results.md`,
      },
    ],
    status: "In active development",
    featured: true,
    proof: [
      {
        value: "242 ms",
        label: "snapshot restore to navigation",
        note: "p50 under the jailer, p95 306 ms, on the development laptop",
      },
      {
        value: "123 MiB",
        label: "memory per running microvm",
        note: "three clones running chrome at once, host memory measured",
      },
      {
        value: "172",
        label: "fresh urls under every profile",
        note: "certificate transparency candidates, the cloaking study",
      },
      {
        value: "5,385",
        label: "stored runs replayed per rule",
        note: "every new indicator is checked against them for false alarms",
      },
    ],
    problem:
      "You get a link you don't trust. Static checks look at the URL string, the domain's age or a blocklist, which is exactly what attackers optimize against, and they say nothing about what the page does. Hosted scanners answer part of it but are black boxes: you can't see how the browser was set up, how traffic was captured, or how often the page lied to the scanner. Opening it on your own machine is the one thing you must not do.",
    approach: [
      {
        title: "A fresh microVM for every link",
        body: "Each URL gets a Firecracker microVM restored from a snapshot with Chrome already running, about a quarter of a second before navigation starts. A guest agent drives Chrome over a DevTools Protocol pipe and streams the evidence back over vsock. When the visit ends, the VM is destroyed and nothing survives except the evidence.",
      },
      {
        title: "Two witnesses",
        body: "The browser reports requests, redirects, forms and the DOM from inside. The host watches from outside: an eBPF program on the VM's TAP device records flows and the TLS ClientHello SNI, a resolver logs DNS, the firewall logs blocked attempts and a pcap is written. The report reconciles both views, and a disagreement between them is itself a finding.",
      },
      {
        title: "Fails closed",
        body: "Each VM sits in its own network namespace with no route to the host, the LAN or cloud metadata addresses. Live traffic leaves only through a WireGuard tunnel in a separate namespace, so if the tunnel drops there is no route at all. The daemon refuses to serve until its own isolation self-test passes.",
      },
      {
        title: "Jailed and confined",
        body: "Every Firecracker process runs under the jailer as its own unprivileged user, in a chroot with seccomp, cgroup limits on memory, tasks and CPU, rate-limited network and disk, and an SELinux policy module. The guest is treated as hostile, so reports are built by an unprivileged helper and everything the guest says is evidence, not truth.",
      },
      {
        title: "No proxy in the middle",
        body: "There is no man-in-the-middle proxy, so servers see a real Chrome TLS fingerprint. Chrome's key log ships back with the capture so traffic can be decrypted offline, and every report comes with a HAR export.",
      },
      {
        title: "Cloaking measured, not assumed",
        body: "Browser countermeasures are switchable snapshot profiles, so the same URL opens under six of them at once. On 172 fresh candidates from Certificate Transparency logs, only the HeadlessChrome User-Agent ever changed what a site showed, and every case was infrastructure such as Cloudflare's bot challenge, not a phishing kit.",
      },
      {
        title: "Indicators scored against labels",
        body: "Report indicators flag details forms on free hosting, brand lures, fake human checks and phishing kits recognised by page structure. Each rule is scored against labelled runs and held-out sets from live feeds, then replayed across every stored run to count false alarms before it stays.",
      },
      {
        title: "A dashboard on top",
        body: "A NestJS service with Postgres and a BullMQ queue talks gRPC to the daemon, and a Next.js dashboard submits URLs, lists runs and renders the redirect chain, network graph and screenshot. Hostile data is shown as text and never linked, and the daemon stays the only privileged component.",
      },
    ],
    highlights: [
      "A Firecracker microVM per URL, restored from a snapshot in about 0.24 s",
      "Host-side eBPF capture of flows and TLS SNI, reconciled with the browser's view",
      "WireGuard-only egress that fails closed, gated by an isolation self-test",
      "Every VMM jailed as its own user, with seccomp, cgroups and SELinux",
      "A cloaking study across six browser profiles on fresh phishing candidates",
      "In active development; the live gate and the control plane are done",
    ],
  },
  {
    slug: "osreflog",
    name: "osreflog",
    updatedAt: "2026-10-15",
    tagline:
      "A reflog for a Linux system: what changed, who changed it, and which change broke it.",
    summary:
      "osreflog records every change to a Fedora system together with its cause: the package transaction, service, command or app that made it. It rebuilds the system as it was at any point, bisects a regression down to a single cause by testing each step in a throwaway container or VM, and undoes that cause file by file. It is in active development on my Linux machine.",
    year: 2026,
    group: "systems",
    kind: "Change history for Linux",
    object: "bisect",
    stock: "stone",
    stack: [
      "Rust",
      "btrfs",
      "fanotify",
      "eBPF",
      "systemd",
      "D-Bus",
      "polkit",
      "SQLite",
      "QEMU",
      "KVM",
      "dnf5",
    ],
    repo: "osreflog",
    links: [
      { label: "Source", href: gh("osreflog") },
      { label: "Roadmap", href: `${gh("osreflog")}/blob/main/docs/roadmap.md` },
      {
        label: "Architecture",
        href: `${gh("osreflog")}/blob/main/docs/architecture.md`,
      },
      {
        label: "Bisect design",
        href: `${gh("osreflog")}/blob/main/docs/bisect.md`,
      },
    ],
    status: "In active development",
    featured: true,
    proof: [
      {
        value: "5 of 5",
        label: "seeded regressions bisected",
        note: "each found within log2(n) + 1 probes",
      },
      {
        value: "0.9 s",
        label: "slowest container probe",
        note: "nspawn; vm probes boot the snapshot's kernel in 14 s or less",
      },
      {
        value: "87 of 87",
        label: "config changes attributed",
        note: "a scripted workload of about 22 real admin tools",
      },
      {
        value: "0",
        label: "parser crashes under fuzzing",
        note: "8 targets, an hour each, about 3.05 billion inputs",
      },
    ],
    problem:
      "When a Linux desktop breaks, you know one thing: it worked last week. Package history covers packages only, the journal shows events but not state, and snapshot tools show the whole system at a moment but not what changed between two snapshots, who changed it, or which change broke things. There is no git bisect for an operating system.",
    approach: [
      {
        title: "Two witnesses",
        body: "A live witness records who changes each file as it happens, with a filesystem-wide fanotify mark and eBPF tracing every write back to its process and package transaction. A state witness proves what changed between read-only btrfs snapshots from the send stream. When they disagree, for example a change made while the daemon was stopped, the gap is reported instead of smoothed over.",
      },
      {
        title: "Causes, not files",
        body: "Changes are grouped into causes: a dnf transaction, a systemd service, a terminal command, an app writing a setting. Writes a daemon makes on someone's behalf over D-Bus, from tools like timedatectl or nmcli, are credited to the caller. osreflog why shows who changed a file and a readable diff of what it means.",
      },
      {
        title: "Git's vocabulary on purpose",
        body: "log, show, diff, blame, bisect and undo work on causes, and references read like git's reflog: c42, @{1}, @{boot-1}, @{yesterday}. Diffs are computed after each checkpoint and cached, so the diff after a real dnf transaction comes back in 6 ms.",
      },
      {
        title: "Bisect down to one cause",
        body: "Snapshots are coarse, so osreflog rebuilds the states between them by replaying causes into a writable clone. Each step is tested in a throwaway systemd-nspawn container in under a second, or in a QEMU VM that boots the clone's own kernel over virtiofs in about 14 seconds. Every replay says whether it was exact or approximate.",
      },
      {
        title: "Undo without rolling back",
        body: "osreflog undo reverts one cause path by path as a 3-way merge, leaving alone anything that changed since and refusing on conflict. Package causes are handed to dnf. Dry run is the default, a checkpoint is taken before every apply, and an undo can itself be undone. GNOME settings get the same treatment through dconf.",
      },
      {
        title: "Observe before touching",
        body: "Nothing wrote to the live root until a write gate passed: the full undo matrix in a contained scratch root, with symlink-swap races and magic links refused by openat2 resolution. Config parsers run in a sandboxed worker and were each fuzzed for an hour. Secrets are never stored and command lines are redacted.",
      },
      {
        title: "Cheap enough to leave on",
        body: "The idle daemon used 0.0% CPU and 26 MB of memory on the development laptop, and a checkpoint adds under a second to a dnf transaction. The ledger is local, root-only SQLite with a hash chain, so tampering is evident.",
      },
      {
        title: "Metal bisect next",
        body: "Some regressions only show on real hardware. The next phase reboots once into a disposable clone, with the default boot entry checked untouched after every probe, and it stays behind a boot gate tested in a nested VM first. A GTK and libadwaita app and COPR packaging, like drainscope's, come last.",
      },
    ],
    highlights: [
      "Every change to /etc and system state recorded with its cause",
      "A live fanotify and eBPF witness reconciled with btrfs send-stream diffs",
      "Cause-level bisect in nspawn containers or VMs that boot the snapshot's kernel",
      "3-way undo that refuses on conflict, dry run by default",
      "5 of 5 seeded regressions found within the probe bound",
      "In active development on Fedora 44; metal bisect is next",
    ],
  },
  {
    slug: "drainscope",
    name: "drainscope",
    updatedAt: "2026-10-14",
    tagline:
      "See where your Linux laptop's battery goes, by app, terminal command and service.",
    summary:
      "drainscope measures energy from hardware counters and the battery, then estimates each app's share, including time in use and in the background. A GNOME Quick Settings extension, desktop app and CLI show local history, sleep loss, battery health, wakeups and network activity. Version 1.0.0 is the first stable release, backed by failure testing and a 48-hour soak test on the development laptop.",
    year: 2026,
    group: "systems",
    kind: "Energy monitor for Linux",
    object: "battery",
    stock: "teal",
    stack: [
      "Rust",
      "eBPF",
      "systemd",
      "D-Bus",
      "SQLite",
      "SELinux",
      "GNOME Shell",
      "GTK",
      "libadwaita",
      "TypeScript",
    ],
    repo: "drainscope",
    links: [
      { label: "Source", href: gh("drainscope") },
      {
        label: "Fedora COPR",
        href: "https://copr.fedorainfracloud.org/coprs/khaledsaeed18/drainscope/",
      },
      {
        label: "v1.0.0 release",
        href: `${gh("drainscope")}/releases/tag/v1.0.0`,
      },
      {
        label: "Architecture",
        href: `${gh("drainscope")}/blob/v1.0.0/docs/architecture.md`,
      },
      {
        label: "Measurements",
        href: `${gh("drainscope")}/blob/v1.0.0/docs/performance.md`,
      },
      {
        label: "Install and setup",
        href: `${gh("drainscope")}/blob/v1.0.0/docs/install.md`,
      },
    ],
    status: "v1.0.0 stable, packaged for Fedora",
    featured: true,
    proof: [
      {
        value: "0.18%",
        label: "average daemon cpu",
        note: "of one cpu, 48-hour soak on the development laptop",
      },
      {
        value: "14.1 MB",
        label: "peak daemon memory",
        note: "same soak test; sampler and probe measured separately",
      },
      {
        value: "48 h",
        label: "soak test",
        note: "v0.1.7, the code shipped as 1.0; no service warnings",
      },
      {
        value: "0",
        label: "components running as root",
        note: "one capability on the sampler, three on the optional probe",
      },
    ],
    problem:
      "A battery percentage says how much charge is left, but not which app spent it or whether it was working in the background. Linux exposes energy and activity counters across the kernel and desktop, with different permissions and gaps in hardware support. I wanted to turn those readings into a useful account of where the battery went, without running a monitor as root.",
    approach: [
      {
        title: "Measure the total, explain each share",
        body: "RAPL counters and battery readings provide the measured energy. A user service combines cgroup v2 CPU time and GPU time from DRM fdinfo to estimate each consumer's share above a learned idle floor. Model v4 also shares energy by CPU time when RAPL is unavailable. Network softirq and threaded interrupt work follow the apps' measured traffic, while Idle and Display & devices remain visible parts of the total.",
      },
      {
        title: "In use or in the background",
        body: "The GNOME extension reports the focused app's ID, never its window title. The daemon uses focused time to split each app's energy into in use, background and unknown, shown in app details, CLI reports and exports. Without focus data, the split stays unknown; terminal tabs and services are not classified. In a controlled test with two equal loads, in-use energy shares matched focused-time shares within 0.6 percentage points.",
      },
      {
        title: "Three ways into the same history",
        body: "GNOME 50 and 51 get a Quick Settings tile showing the top consumers since unplugging. The GTK and libadwaita app adds a stacked timeline, per-consumer detail and views for the last hour, 24 hours or 7 days. The CLI adds live power and reports filtered by period, consumer kind or power source. Lists stay stable as readings change, and the app follows daemon stops and restarts with clear status messages.",
      },
      {
        title: "Activity, sleep and battery wear",
        body: "The optional eBPF probe counts per-app CPU wakeups and network bytes, excluding loopback traffic. Sleep history records battery loss and reports wake reasons only when reliable. Daily battery-health records track capacity against design and charge cycles. Attribution pauses across suspend, and the since-unplugged session resets after charging while the machine was off.",
      },
      {
        title: "Least privilege and local history",
        body: "No component runs as root or opens a network socket. The sampler and optional probe run as dedicated users with one and three Linux capabilities respectively, confined by systemd sandboxes and SELinux where enabled. polkit restricts counter access to the active local session; readings are rate-limited and coarsened. Energy and focus history stay in the user's local SQLite database.",
      },
      {
        title: "Keep measuring when parts fail",
        body: "The daemon can start without writable history, using in-memory storage, and keeps measuring when the disk fills. Missing sampler or probe services degrade the available readings instead of stopping collection. It recovers from an unreadable database, stops safely on a newer schema, and handles counter resets after service restarts. A documented failure checklist covers denied permissions, missing services, full disks and desktop restarts; drainscope doctor explains what needs attention.",
      },
      {
        title: "A stable release with measured overhead",
        body: "Sampling slows to every 15 seconds when no view is watching and returns to 5 seconds while a view is open. Batched readings, faster history queries and a once-a-minute refresh for the 7-day view keep the cost down. Across a 48-hour soak of the code shipped as 1.0, the daemon averaged 0.179% of one CPU and peaked at 14.1 MB on the development laptop, with no service warnings, extension errors or SELinux denials. These are daemon figures, not the cost of all components combined.",
      },
      {
        title: "Reports you can take with you",
        body: "Summary, report, sleep, health, wakeups and network views export every row as CSV or JSON in joules, watts and Unix seconds. Reports include foreground, background and unknown energy plus focused time; JSON includes the period, measured coverage and model version. Unknown readings stay distinct from zero, including history recorded before focus tracking existed.",
      },
      {
        title: "Packaged, documented and upgradeable",
        body: "The first stable release ships signed COPR packages for Fedora 44, 45 and rawhide, with installation checked on Fedora 44 and 45. Updates arrive through dnf and restart the daemon. Release downloads also include Fedora 44 RPMs and the extension zip. Architecture, installation, troubleshooting and contribution guides accompany the release; the extensions.gnome.org listing is still awaiting review.",
      },
      {
        title: "Make the limits visible",
        body: "Validation uses recorded trace replays and real measurements on an Intel i7-8550U laptop with i915 graphics. AMD Zen support is expected from fixtures but has not been tested on real hardware; its integrated-GPU energy is split by CPU time, and Intel xe GPU energy is not yet split per app. Light, bursty work remains undercharged by proportional sharing. The published model and validation explain these limits rather than presenting per-app estimates as direct measurements.",
      },
    ],
    highlights: [
      "First stable release, v1.0.0, published on October 14, 2026",
      "Foreground and background energy in app details, CLI reports and exports, with unknown time kept explicit",
      "Model v4 supports battery-only attribution alongside CPU, GPU and network activity accounting",
      "Per-app wakeups and traffic, suspend loss and daily battery-health history",
      "48-hour soak test with 0.18% average daemon CPU and 14.1 MB peak daemon memory on the development laptop",
      "Failure recovery checked across missing services, permission denials, full disks and restarts",
      "Signed Fedora 44, 45 and rawhide packages; GNOME 50 and 51 support",
      "Local history, no network access and no component running as root",
    ],
  },
  {
    slug: "freertos-riscv",
    name: "FreeRTOS on RISC-V",
    tagline:
      "FreeRTOS ported to 64-bit RISC-V and booted on QEMU, from the startup code and linker script up.",
    summary:
      "A port of the FreeRTOS kernel to RV64 on QEMU's virt machine: bare-metal startup in assembly, a linker script that lays out RAM from 0x80000000, machine-mode timer interrupts driving a 1 kHz tick, and two preemptive tasks that prove the scheduler. Built for the CENG507 embedded systems course.",
    year: 2026,
    group: "systems",
    kind: "Embedded systems project",
    object: "chip",
    stock: "stone",
    stack: [
      "C",
      "RISC-V assembly",
      "FreeRTOS",
      "QEMU",
      "GNU toolchain",
      "Make",
    ],
    repo: "CENG507-Project",
    links: [{ label: "Source", href: gh("CENG507-Project") }],
    proof: [
      {
        value: "1 kHz",
        label: "scheduler tick",
        note: "machine-mode timer via mtime and mtimecmp",
      },
      {
        value: "64 KB",
        label: "stack laid out by the linker script",
        note: "ram from 0x80000000 on qemu virt",
      },
      {
        value: "0",
        label: "lines of bios",
        note: "assembly startup jumps straight to c",
      },
    ],
    problem:
      "A real-time OS hides the hardware from applications, but first someone has to tame the hardware: start the core with no firmware, lay out memory, take the timer interrupt and save every register on a context switch. The goal was to do that by hand on an open instruction set.",
    approach: [
      {
        title: "Bare metal, from the reset vector",
        body: "An assembly startup file sets up the stack and jumps to C with no BIOS at all. A linker script places code, data and a 64 KB stack in RAM from 0x80000000 on QEMU's virt machine.",
      },
      {
        title: "The timer drives the scheduler",
        body: "The machine-mode timer, through MTIME and MTIMECMP, raises a 1 kHz tick. mtvec points at the FreeRTOS trap handler, which saves the context in assembly and lets the kernel preempt.",
      },
      {
        title: "Proven by tasks, checked in the disassembly",
        body: "Two tasks with different periods interleave under preemption. The build emits an ELF with symbols, a raw binary and a full disassembly listing, targeting rv64imac_zicsr with the lp64 ABI.",
      },
    ],
    highlights: [
      "Boots with no firmware on QEMU's virt machine",
      "Preemptive scheduling on a 1 kHz tick, stack overflow checks on",
      "RV64IMAC with Zicsr, medany code model",
      "Course project for CENG507, Embedded Systems",
    ],
  },
  {
    slug: "multilingual-translation",
    name: "Multilingual translation",
    tagline:
      "Translation between 200 languages that runs entirely in the browser, with no server and no API key.",
    summary:
      "A React app that runs Meta's NLLB-200 model, distilled to 600M parameters, in the browser through Transformers.js and WebAssembly. The model loads in a Web Worker, is cached after the first download, and streams translations back as they are generated.",
    year: 2025,
    group: "web",
    kind: "Browser ML app",
    object: "globe",
    stock: "terracotta",
    stack: [
      "React",
      "Transformers.js",
      "Web Workers",
      "WebAssembly",
      "Vite",
      "Tailwind CSS",
    ],
    repo: "multilingual-translation-Transformers.js",
    links: [
      {
        label: "Live demo",
        href: "https://huggingface.co/spaces/KhaledSaeed18/multilingual-translation",
      },
      { label: "Source", href: gh("multilingual-translation-Transformers.js") },
    ],
    proof: [
      {
        value: "200",
        label: "languages",
        note: "nllb-200, including low-resource ones",
      },
      {
        value: "600M",
        label: "parameters in the browser",
        note: "distilled model over transformers.js and webassembly",
      },
      {
        value: "0",
        label: "servers and api keys",
        note: "model cached after the first visit, runs offline",
      },
    ],
    problem:
      "Translation usually means sending your text to someone else's server. For quick, private use, the model itself can come to the user instead.",
    approach: [
      {
        title: "The model comes to you",
        body: "NLLB-200 distilled to 600M parameters runs through Transformers.js on WebAssembly. The first visit downloads it once and the browser caches it, so later translations run fully offline from the page.",
      },
      {
        title: "Never block the page",
        body: "Inference runs in a Web Worker and talks to the interface by messages, so typing and scrolling stay smooth while the model loads and works.",
      },
      {
        title: "Stream as it translates",
        body: "Output streams back progressively instead of arriving all at once, so long passages start reading immediately.",
      },
    ],
    highlights: [
      "200+ languages, including low-resource ones",
      "No backend: inference runs in a Web Worker",
      "Live on Hugging Face Spaces",
    ],
  },
  {
    slug: "yalla-learn",
    name: "Yalla Learn",
    tagline:
      "My final year project: an AI learning platform across web, mobile, desktop and API.",
    summary:
      "The senior project for my B.S. in Computer Engineering. A learning and productivity platform with AI chat over PDFs and images, mind maps, flashcards, study plans and quizzes, delivered as a web app, a mobile app, a desktop app and a shared backend.",
    year: 2025,
    group: "web",
    kind: "Final year project",
    object: "bulb",
    stock: "stone",
    stack: [
      "Next.js",
      "React Native",
      "Electron",
      "Node.js",
      "AI SDK",
      "TypeScript",
    ],
    repo: "yalla-learn",
    links: [{ label: "Source", href: gh("yalla-learn") }],
    status: "Archived",
    problem:
      "Students juggle a dozen tools to study one subject. The goal was one place that turns material into practice.",
    approach: [
      {
        title: "Four clients, one backend",
        body: "Web, mobile and desktop apps share a single TypeScript API, so every feature ships everywhere at once.",
      },
      {
        title: "AI where it helps",
        body: "Chat with PDFs and images, generate mind maps, flashcards, quizzes and study plans from any topic.",
      },
    ],
    highlights: [
      "Web, mobile, desktop and API in TypeScript",
      "AI-powered study tools",
      "Delivered as my B.S. senior project",
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

/** The order groups appear in on /work. */
export const groupOrder: ProjectGroup[] = [
  "platforms",
  "tools",
  "macos",
  "systems",
  "web",
]

/**
 * Every project in catalogue order (by group, then as listed above). Job
 * numbers on /work, case study numbers and previous/next all follow it.
 */
export const catalog = groupOrder.flatMap((g) =>
  projects.filter((p) => p.group === g)
)

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

/**
 * Projects referenced from other content (a degree, a certification). An
 * unknown slug is a content bug, so it fails the build instead of rendering
 * a gap.
 */
export function projectsBySlug(slugs: readonly string[]) {
  return slugs.map((slug) => {
    const p = getProject(slug)
    if (!p) throw new Error(`Unknown project slug: ${slug}`)
    return p
  })
}

/** A project's kind mid-sentence: "Open source template" becomes "open source template", acronyms stay. */
export function kindPhrase(kind: string) {
  // only a plain capitalised first word: "SaaS", "AI", "macOS" stay as they are
  return /^[A-Z][a-z]*([\s-]|$)/.test(kind)
    ? kind[0].toLowerCase() + kind.slice(1)
    : kind
}

/** "a" or "an" before a kind, by sound: "an npm CLI", "a SaaS platform". */
export function withArticle(phrase: string) {
  // mass nouns take no article: "AI developer tooling by ..."
  if (/tooling$/.test(phrase)) return phrase
  return `${/^([aeiou]|npm|AI)/i.test(phrase) && !/^(SaaS|use)/.test(phrase) ? "an" : "a"} ${phrase}`
}
