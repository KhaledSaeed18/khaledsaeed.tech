/**
 * Projects, single-sourced for the home page, /work, each case study, the
 * sitemap, JSON-LD and llms.txt. Copy follows the brand rules: sentence case,
 * no em dashes, no emoji.
 */

export type ObjectKind =
  | "grid"
  | "layers"
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
  featured?: boolean
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
      "CLIs, registries and analyzers I built because I wanted them on my own machine first.",
  },
  macos: {
    title: "macOS apps",
    blurb:
      "Small native utilities in Swift and SwiftUI. Menu bar first, no Dock icon, no Electron.",
  },
  systems: {
    title: "Systems",
    blurb:
      "Close to the hardware: a least-privilege energy monitor for the Linux desktop, and a real-time OS brought up on RISC-V.",
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
    object: "grid",
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
    object: "layers",
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
    tagline:
      "Sleep logging with weekly analytics: a FastAPI service and a retro-styled Next.js client.",
    summary:
      "A FastAPI and PostgreSQL API that logs sleep sessions with quality ratings and computes statistics, a timeline and weekly summaries with a consistency score, paired with a retro-styled Next.js client that charts them.",
    year: 2025,
    group: "platforms",
    kind: "Full-stack app",
    object: "moon",
    stock: "stone",
    stack: [
      "FastAPI",
      "PostgreSQL",
      "Tortoise ORM",
      "JWT",
      "Next.js",
      "Zustand",
      "Chart.js",
    ],
    repo: "sleep-track-backend",
    links: [
      { label: "API source", href: gh("sleep-track-backend") },
      { label: "Client source", href: gh("sleep-track-frontend") },
    ],
    problem:
      "Logging sleep is easy. Turning the log into something you can act on, like how consistent your week was, takes analysis on the server and an account system that holds up.",
    approach: [
      {
        title: "A typed, documented API",
        body: "FastAPI with Tortoise ORM on PostgreSQL, schema migrations with Aerich, and interactive OpenAPI documentation at /docs and /redoc out of the box.",
      },
      {
        title: "Analytics on the server",
        body: "Statistics, a timeline and a weekly summary with average hours, quality and a consistency score are computed by the API, so the client only has to draw them.",
      },
      {
        title: "A client with character",
        body: "A Next.js client in a retro DaisyUI theme, with Zustand for state and Chart.js for the weekly charts, behind JWT authentication with bcrypt password hashing.",
      },
    ],
    highlights: [
      "Interactive OpenAPI docs generated from the code",
      "Schema migrations with Aerich",
      "JWT authentication with bcrypt hashing",
      "Weekly consistency score computed server-side",
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
      "A CLI that shows exactly how JWT signing works, and where it breaks.",
    summary:
      "A Python command-line toolkit for inspecting, verifying, cracking and securing JSON Web Tokens. The JWS logic is implemented in the open on top of cryptography, with no dependency on pyjwt, so you can read exactly how verification works.",
    year: 2026,
    group: "tools",
    kind: "Security CLI",
    object: "key",
    stock: "bone",
    stack: ["Python", "cryptography", "Click", "Rich", "PyPI"],
    repo: "jwt-toolkit",
    links: [
      { label: "PyPI", href: "https://pypi.org/project/jwt-toolkit/" },
      { label: "Source", href: gh("jwt-toolkit") },
    ],
    featured: true,
    problem:
      "JWT bugs hide in the details: alg=none, algorithm confusion, weak HMAC secrets, keys smuggled in the header. Most libraries hide those details on purpose.",
    approach: [
      {
        title: "Audit without a key",
        body: "Static checks flag alg=none, weak HMAC, jwk in the header and other CVE-referenced misconfigurations before you even have the secret.",
      },
      {
        title: "Attack your own verifier",
        body: "Forge attack-shaped variants such as alg=none and algorithm confusion, then point them at your own service to prove it rejects them.",
      },
      {
        title: "Honest cryptography",
        body: "Constant-time signature comparison, JWKS verification of standard claims, a streamed multi-threaded wordlist cracker and strong secret generation.",
      },
    ],
    highlights: [
      "Published on PyPI, installable with pipx or uv",
      "Decode, audit, verify, sign, forge, crack, generate",
      "JSON output for scripting",
    ],
  },
  {
    slug: "wakehold",
    name: "Wakehold",
    tagline:
      "Keeps a Mac awake exactly as long as the work is alive, then lets it sleep.",
    summary:
      "A session-aware wake controller for macOS: a menu bar app, a CLI and a local control endpoint. A running process, a listening port, a wrapped command, an agent session or a timer each hold the machine open, and the hold releases itself when the last one ends.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "hourglass",
    stock: "stone",
    stack: ["Swift", "SwiftUI", "IOKit"],
    repo: "wakehold",
    links: [{ label: "Source", href: gh("wakehold") }],
    featured: true,
    problem:
      "Keep-awake tools are a switch you flip on and forget to flip off. They model a timer, not the thing you actually care about.",
    approach: [
      {
        title: "Sessions, not switches",
        body: "Tell it what to watch: a build, a dev server on :3000, a Claude Code session, an app. It stays awake while that thing runs.",
      },
      {
        title: "Cleans up after itself",
        body: "When the last session ends it can sleep the display, sleep the Mac, shut down, restart or notify. Run the agent overnight, shut down when it finishes.",
      },
      {
        title: "Legible",
        body: "The menu lists every reason the Mac is awake, including other apps' power assertions like a call or audio playing.",
      },
    ],
    highlights: [
      "Menu bar app, CLI and local HTTP control endpoint",
      "Watches processes, ports, commands, agents and timers",
      "Native Swift with IOKit power assertions",
    ],
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
    tagline:
      "A single-pass, streaming CLI for finding what is eating your disk.",
    summary:
      "dat walks a directory once, streams file hashes without loading files into memory, and reports the largest files, duplicated content, empty files and a breakdown by type, with a shareable HTML report.",
    year: 2025,
    group: "tools",
    kind: "npm CLI",
    object: "folder",
    stock: "bone",
    stack: ["TypeScript", "Node.js", "GitHub Actions", "npm"],
    repo: "dir-analysis-tool",
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/dir-analysis-tool" },
      { label: "Source", href: gh("dir-analysis-tool") },
    ],
    problem:
      "Disk audits either load everything into memory or give you a wall of output you cannot act on or pipe anywhere.",
    approach: [
      {
        title: "One walk, constant memory",
        body: "A single filesystem traversal with streaming MD5 hashing stays flat on multi-gigabyte trees.",
      },
      {
        title: "Actionable, not just accurate",
        body: "Duplicates come with wasted-space totals, plus large and empty file detection and a top-N list.",
      },
      {
        title: "Plays well with others",
        body: "Clean ANSI-free JSON, a progress bar that disables itself outside a TTY, CSV exports and a self-contained HTML report.",
      },
    ],
    highlights: [
      "1,100+ npm downloads in the last year",
      "Streaming duplicate detection",
      "Automated releases with GitHub Actions",
    ],
  },
  {
    slug: "gauge",
    name: "Gauge",
    tagline:
      "Pixel-precise rulers and alignment guides over the whole macOS desktop.",
    summary:
      "A native macOS overlay that gives every display physical-pixel rulers and persistent guides, while every click passes straight through to the app underneath.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "square",
    stock: "teal",
    stack: ["Swift", "AppKit", "SwiftUI"],
    repo: "gauge",
    links: [{ label: "Source", href: gh("gauge") }],
    problem:
      "Ruler tools live inside one browser tab or one design app, so you cannot line up a native window against a design mockup.",
    approach: [
      {
        title: "Real pixels",
        body: "Tick labels respect each screen's backing scale factor, so 100 means 100 actual display pixels on any screen.",
      },
      {
        title: "Out of the way",
        body: "The overlay ignores mouse events unless you are placing a guide, measuring or using the crosshair.",
      },
    ],
    highlights: [
      "Measure any region and copy the size",
      "Global shortcuts for rulers, measure and crosshair",
      "Works across every connected display",
    ],
  },
  {
    slug: "sever",
    name: "Sever",
    tagline:
      "Every running process and open port on your Mac, one click from the menu bar.",
    summary:
      "A menu bar app that lists processes and open network ports side by side and lets you end either by PID, gracefully by default and forcefully one right-click away. It always tells you why something would not die.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "scissors",
    stock: "terracotta",
    stack: ["Swift", "SwiftUI"],
    repo: "sever",
    links: [{ label: "Source", href: gh("sever") }],
    problem:
      "Killing a stray dev server means kill -9 $(lsof -ti:3000) or three windows of Activity Monitor.",
    approach: [
      {
        title: "Two lists, one action",
        body: "Processes and ports share one control. SIGTERM by default, SIGKILL when you mean it.",
      },
      {
        title: "Never fails silently",
        body: "Every attempt reports what happened: severed, denied because the process is protected, already gone, or a readable error.",
      },
    ],
    highlights: [
      "No Dock icon, tiny footprint",
      "Monospaced, dense and scannable",
      "Honest error reporting",
    ],
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
    slug: "drainscope",
    name: "drainscope",
    updatedAt: "2026-10-10",
    tagline:
      "Per-app battery and energy usage for the Linux desktop, measured from hardware counters.",
    summary:
      "drainscope measures energy from RAPL counters and the battery and estimates each app, terminal workload and system service's share. Local history appears in a CLI, GNOME's quick settings and a desktop app, with CSV and JSON exports. The v0.1.3 release improves network attribution and reduces the monitor's own CPU use; no component runs as root.",
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
        label: "Releases",
        href: "https://github.com/KhaledSaeed18/drainscope/releases",
      },
    ],
    status: "v0.1.3, packaged for Fedora",
    featured: true,
    problem:
      "Windows, macOS and Android have told you which app drained the battery for years. Linux hasn't. The counters exist, but they are root-only, they measure the whole machine, and nothing attributes them to the apps that spent the energy.",
    approach: [
      {
        title: "Measure, then attribute",
        body: "A user service reads RAPL energy counters, the batteries, cgroup v2 CPU time and GPU time from DRM fdinfo. Energy above the machine's learned idle floor goes to whoever was active, reconciled against the battery over 10 second windows, so apps, terminal workloads and systemd services each get their share.",
      },
      {
        title: "Least privilege, by construction",
        body: "No component runs as root. A sandboxed sampler with a single capability reads the root-only counters and serves them over D-Bus only to the active local session, rate-limited and quantized against the Platypus side channel. An optional eBPF probe counts CPU wakeups and per-app network bytes without ever seeing addresses or contents. Both are confined by SELinux and exit when idle.",
      },
      {
        title: "Where you already look",
        body: "History stays on your machine. A CLI answers the questions people actually ask: since unplugged, the last 24 hours, live power, battery lost in suspend, CPU wakeups, network traffic and battery wear. GNOME's quick settings shows the same numbers, and a libadwaita desktop app draws a stacked timeline. Short-lived apps, commands and services get explicit labels.",
      },
      {
        title: "Charge network work to the app",
        body: "Model v3 assigns network softirq and threaded interrupt-handler CPU time to apps by their measured traffic. Hardware trace replays and battery validation keep that estimate testable. Optional network readings can fail without stopping collection, and an older probe remains usable through a compatibility fallback.",
      },
      {
        title: "A monitor with a smaller footprint",
        body: "The daemon samples every 15 seconds while nobody is watching and every 5 seconds while a view is open. One timer wakeup, batched probe readings and a leaner cgroup walk reduce overhead; the extension subscribes to ticks only while its menu is open. On the development laptop, idle CPU use on battery fell from 0.82–1.0% to 0.28% of one CPU.",
      },
      {
        title: "History you can take with you",
        body: "The summary, report, sleep, health, wakeups and network commands export every row as CSV or JSON in joules, watts and Unix seconds. JSON includes the period, measured coverage and model version, with unknown amounts kept distinct from zero.",
      },
    ],
    highlights: [
      "No component runs as root; sampler and probe each hold only the capabilities they need",
      "Signed RPMs for Fedora 44, 45 and rawhide on COPR",
      "Adaptive sampling lowered measured idle CPU use to 0.28% of one CPU on the development laptop",
      "Model v3 attributes network interrupt work to the apps generating traffic",
      "CSV and JSON exports across six CLI views, with coverage and model version in JSON",
      "Validated against real hardware, with recorded traces replayed in tests",
      "Nothing leaves the machine; no component uses the network",
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
