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
    updatedAt: "2026-10-19",
    tagline:
      "Multi-tenant IT service management with isolation enforced by the database.",
    summary:
      "Patchgrid is a ticketing and operations platform for IT and security teams. Each company gets its own subdomain, and its data is isolated at the database level through five independent layers, not by remembering a WHERE clause. Twelve milestones in, it covers incidents, requests, problems and changes, SLA clocks, email intake, a knowledge base, assets, an operator back-office that never impersonates, signed webhooks and reports that answer in under 25 ms at 100,000 tickets.",
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
      "Redis",
      "BullMQ",
      "Turborepo",
      "Zod",
      "OpenTelemetry",
      "Playwright",
      "Docker",
    ],
    repo: "patchgrid",
    links: [
      { label: "Source", href: gh("patchgrid") },
      { label: "Decisions", href: `${gh("patchgrid")}/tree/main/docs/decisions` },
      {
        label: "Threat model",
        href: `${gh("patchgrid")}/blob/main/docs/THREAT-MODEL.md`,
      },
    ],
    status: "In active development",
    featured: true,
    platform: "Node.js 24, PostgreSQL 17 and Docker; runs locally by decision",
    audience: "IT and security teams, and engineers who want to see tenancy done at the database",
    plain:
      "Patchgrid is a help desk for company IT teams. Many companies share one system, but the database itself refuses to show one company another company's tickets, even if a programmer makes a mistake. Staff raise incidents and requests, agents work them against response-time clocks, and every change is approved by someone other than its author.",
    proof: [
      {
        value: "5",
        label: "isolation layers",
        note: "keys, credential, repository, prisma, postgres rls",
      },
      {
        value: "1,323",
        label: "api tests",
        note: "1,083 unit and 240 integration, plus 400 authorization and 50 tenancy assertions",
      },
      {
        value: "52",
        label: "architecture decision records",
        note: "5,618 lines of specification written before the code",
      },
      {
        value: "< 25 ms",
        label: "every report at 100,000 tickets",
        note: "from a dedicated read model, measured in the load check",
      },
      {
        value: "16",
        label: "security findings fixed",
        note: "three independent reviews at milestone 9, all fixed with tests",
      },
      {
        value: "660",
        label: "commits in 25 days",
        note: "22 sep to 17 oct 2026",
      },
    ],
    problem:
      "Multi-tenant apps usually trust every query to filter by tenant. One forgotten filter leaks another customer's tickets. I wanted a platform where a cross-tenant read is not a bug you can write.",
    approach: [
      {
        title: "Five layers of isolation",
        body: "Composite (orgId, id) foreign keys make a cross-tenant reference unrepresentable, because Postgres checks foreign keys with row security off. The tenant comes from the credential, never the host. Every repository method takes an explicit orgId. A Prisma client extension sets a transaction-local config and throws without context. Postgres enforces it all with forced row level security and an app role that cannot bypass it.",
      },
      {
        title: "Four ITIL records, four lifecycles",
        body: "Incidents, service requests, problems and changes are modeled as different things with their own states and one transition endpoint. Priority is computed from impact and urgency, and a client that sends one gets a 400. SLA clocks run around the clock, pause while waiting on the requester, and are swept per tenant.",
      },
      {
        title: "Everything a desk needs",
        body: "Mail to the workspace becomes a ticket if it passes DMARC, and replies thread onto it. A versioned knowledge base suggests articles while a requester types. Assets link to tickets. Uploads go straight to object storage on a separate domain and are checked by their bytes, not their names.",
      },
      {
        title: "A platform layer that cannot peek",
        body: "Operators work at admin. with their own login and second factor, see metadata and never content, and read a workspace only in an owner-granted, read-only, time-boxed support session written to that workspace's audit log. API tokens are service accounts whose scopes intersect a role. Deleting a workspace leaves a nameless tombstone after 30 days.",
      },
      {
        title: "Delivery you can replay",
        body: "A transactional outbox is read per tenant in transaction-id order below the snapshot horizon, so nothing is lost, repeated or skipped. Notifications, signed webhooks with retries and a circuit breaker, and reporting are its consumers. Reports come from their own read model so they never compete with the queues.",
      },
      {
        title: "Invariants you can run",
        body: "A tenancy suite asserts 13 catalog and 37 isolation invariants against a live database on every merge, a doctor script checks the roles and privileges, and every integration fixture creates two organizations so a leak fails a test. A Playwright suite drives two tenants through the browser, with negative cases.",
      },
      {
        title: "Reviewed before shipping",
        body: "A threat model with eleven trust boundaries, three independent read-only security reviews at milestone 9 that found 16 issues, all fixed in the same change set, and further reviews at each milestone since. Traces and metrics are labelled by tenant, so a Grafana board answers which tenant is slow.",
      },
    ],
    highlights: [
      "Subdomain per tenant across one monorepo: marketing, workspace, operator back-office and API",
      "Row level security forced on every tenant table, composite keys across tenants",
      "Priority derived from impact x urgency, four lifecycles behind one transition endpoint",
      "Email intake gated by DMARC, knowledge base, assets, presigned uploads",
      "No impersonation, ever: support sessions are granted, read-only, audited and time-boxed",
      "Transactional outbox, Standard Webhooks, reports under 25 ms at 100,000 tickets",
      "Member MFA with step-up, OpenTelemetry per tenant, CodeQL on every change",
    ],
    decisions: [
      {
        chose: "a shared schema with row level security and composite foreign keys",
        over: "a database or schema per tenant, or row level security alone",
        why: "Per-tenant databases make migrations and reporting expensive. Row level security alone leaves one hole: Postgres checks foreign keys with row security off, so a reference across tenants is still writable. Composite (orgId, id) keys close it. The cost is a wider key on every table and an explicit orgId on every repository method.",
      },
      {
        chose: "the tenant from the credential",
        over: "the tenant from the hostname",
        why: "A host header is attacker-controlled. The session or token names the tenant, and the origin is a cross-check that can refuse but never grant.",
      },
      {
        chose: "computing priority from impact and urgency",
        over: "a priority dropdown",
        why: "A typed priority is an argument, not a fact. Deriving it keeps queues honest at the price of a 400 for any client that tries to set it.",
      },
      {
        chose: "support sessions granted by the owner",
        over: "operator impersonation",
        why: "Impersonation is the feature every breach report mentions. A read-only, time-boxed session through the workspace's own routes gives operators what they need and leaves a line in the customer's audit log.",
      },
      {
        chose: "integration tests against the Compose Postgres",
        over: "Prisma mocks or Testcontainers",
        why: "Mocks give false confidence about the one thing that matters here, the database's behaviour. Testcontainers were slow to start. Every fixture creates two organizations so a leak is a failing test, not a finding.",
      },
      {
        chose: "not deploying publicly",
        over: "a hosted demo",
        why: "It is a learning and portfolio project, and what it teaches is the architecture. Everything can be read, run and tested locally. The trade-off is stated: certificate renewal, real mail authentication and proxy trust are designed but not proven in production.",
      },
    ],
    install: [
      {
        label: "bring up the whole stack with a demo seed",
        command: "pnpm install && pnpm local:up && pnpm dev",
        note: "node 24, pnpm 10 and docker; postgres, redis, minio and mailpit in compose",
      },
      {
        label: "assert the isolation invariants against the live database",
        command: "pnpm test:tenancy",
      },
      {
        label: "send a ticket in by email, or a forged one",
        command:
          "pnpm --filter @patchgrid/api run inbound:send -- --from rita@patchgrid.test --to acme",
        note: "add --dmarc fail to watch it refused",
      },
    ],
    timeline: [
      {
        date: "2026-09-22",
        title: "First commit and twelve decisions",
        body: "The foundation milestone: package scope, per-type state machines, SLA rules, cookie sessions, the error format and the testing strategy, decided before the code.",
      },
      {
        date: "2026-10",
        title: "Milestones 1 to 6",
        body: "Tenancy and identity, the incident lifecycle, notifications and live updates, the other three record types, attachments, assets, the knowledge base and email intake.",
      },
      {
        date: "2026-10-16",
        title: "Milestone 9, hardening",
        body: "Member MFA with step-up, the browser suite, OpenTelemetry per tenant, OpenAPI, a load check at 100,000 tickets and a security review with 16 findings fixed.",
      },
      {
        date: "2026-10-17",
        title: "Milestones 10 to 12",
        body: "The demo seed, marketing site and production images, the decision not to deploy, the transactional outbox and webhooks, then reports, saved views and bulk actions. Next: passkeys and per-tenant OpenID Connect.",
      },
    ],
    faq: [
      {
        q: "Is there a live demo?",
        a: "No, by decision. It runs locally with Docker Compose and one command, with a seeded demo covering two companies and an operator. The deployment design and production images exist and CI builds them, but nothing is hosted.",
      },
      {
        q: "How do you know one tenant cannot read another's data?",
        a: "Five layers, and proof for each: a tenancy suite with 50 assertions against a live database, a doctor script that checks the app role cannot bypass row level security, a browser test across two tenants, and integration fixtures that always create two organizations.",
      },
      {
        q: "Can a platform admin see customer tickets?",
        a: "No. The back-office sees workspace metadata, never content. Reading a workspace requires a support session the owner grants, which is read-only, time-boxed and written to that workspace's audit log.",
      },
      {
        q: "Why is the AI triage not built yet?",
        a: "Local ticket triage and a phishing-URL model are the last milestone because they need local models. The interfaces are in place; the models are not.",
      },
    ],
    related: ["team-flow", "node-authentication-template", "urljail"],
  },
  {
    slug: "node-express-boilerplate",
    name: "Express boilerplate",
    updatedAt: "2026-10-19",
    tagline:
      "A production-grade Express and TypeScript starter that other developers actually fork.",
    summary:
      "A fully wired Express 5, TypeScript 6 and Prisma 7 backend with layered clean architecture, a single dependency injection container, JWT and CSRF security, structured logging, OpenAPI docs, two test layers with enforced coverage, and security scanning on every change. It ships one AGENTS.md that six AI coding tools read through symlinks, plus slash commands that scaffold a new resource across all eight layers.",
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
      "Pino",
      "OpenAPI",
      "Vitest",
      "Docker",
    ],
    repo: "node-express-boilerplate",
    links: [
      { label: "Source", href: gh("node-express-boilerplate") },
      {
        label: "Changelog",
        href: `${gh("node-express-boilerplate")}/blob/main/CHANGELOG.md`,
      },
    ],
    featured: true,
    platform: "Node.js 22 or later, PostgreSQL 16, Docker for the database",
    audience: "developers starting a new API who do not want to wire auth, errors and CI again",
    plain:
      "Every web app needs a server behind it, and every new one starts with the same week of plumbing: logins, security checks, error handling, logging and automated tests. This is that week, done once and published so a developer can fork it and start on the actual product on day one.",
    proof: [
      {
        value: "36",
        label: "github stars",
        note: "counted on the repository on 19 oct 2026",
      },
      {
        value: "8",
        label: "forks",
        note: "developers starting new services from it",
      },
      {
        value: "12",
        label: "checks on every push",
        note: "format, lint, three type-checks, knip, audit, build, unit and integration tests, codeql, trufflehog",
      },
      {
        value: "6",
        label: "ai coding tools briefed",
        note: "one agents.md, every tool file a symlink to it",
      },
    ],
    problem:
      "Most Express starters stop at hello world. Teams then spend weeks wiring auth, errors, logging and pipelines, and every project does it slightly differently.",
    approach: [
      {
        title: "Layered by responsibility",
        body: "Routes, controllers, services and repositories each own one job and talk only to the layer below. A singleton container is the only place in the codebase where a repository, service or controller is constructed, so any layer can be swapped or tested alone.",
      },
      {
        title: "Security as defaults",
        body: "A 15-minute access token and a 7-day refresh token live in signed HttpOnly cookies and never appear in a response body. A double-submit CSRF token guards every mutating route, with Helmet headers and per-route rate limits on from the first request.",
      },
      {
        title: "Errors with a shape",
        body: "A typed error hierarchy and Prisma error mapping mean every failure leaves the API in the same predictable response format, with a correlation id in the structured log line that matches it.",
      },
      {
        title: "Two test layers with a floor",
        body: "Unit tests mock the repositories and finish in milliseconds. Integration tests drive the real app against a RAM-disk Postgres, and every one checks the valid case, bad input, no session, no CSRF token and not found. Coverage thresholds fail the build when they drop.",
      },
      {
        title: "Automation around the code",
        body: "Pre-commit hooks on staged files, conventional commits, CodeQL, TruffleHog on verified secrets only, dependency review and Dependabot run on every change. Swagger UI is generated at /api-docs.",
      },
      {
        title: "Agents that follow the rules",
        body: "One AGENTS.md teaches the hard rules, such as no process.env outside config and no raw error responses, and the files for Claude Code, Gemini, Codex, Cursor, Copilot and Windsurf are symlinks to it. Six slash commands scaffold a resource, a middleware, a test or an OpenAPI block the same way every time.",
      },
    ],
    highlights: [
      "36 stars and 8 forks from developers starting new services",
      "Clean architecture with one DI container and interfaces at every boundary",
      "Signed HttpOnly cookies for both tokens plus CSRF double-submit",
      "Unit and integration suites with coverage thresholds enforced in CI",
      "One AGENTS.md read by six AI coding tools, six scaffolding slash commands",
      "Revived in April 2026 onto Express 5, Prisma 7 and TypeScript 6",
    ],
    decisions: [
      {
        chose: "tokens in signed HttpOnly cookies",
        over: "a bearer token in the response body",
        why: "Script on the page cannot read a cookie, which removes the most common way a token leaks. The cost is CSRF, so a double-submit token is wired in from the start instead of being left for later.",
      },
      {
        chose: "a single construction site for every object",
        over: "importing singletons wherever they are needed",
        why: "When only the container calls new, the dependency graph is one file long and a test can hand any layer a fake. It takes a getter per object, which the scaffolding command writes for you.",
      },
      {
        chose: "integration tests against a RAM-disk Postgres",
        over: "an in-memory database or mocked Prisma",
        why: "Prisma's error codes and the constraints the app relies on only exist in Postgres. A tmpfs container is wiped on every restart and fast enough to run on every push.",
      },
      {
        chose: "one AGENTS.md with symlinks",
        over: "a file per AI tool",
        why: "Six copies of the same rules drift. Symlinks mean a rule changed once is changed everywhere, and the repository stays readable to every tool.",
      },
    ],
    install: [
      {
        label: "clone it and start the database",
        command:
          "git clone https://github.com/KhaledSaeed18/node-express-boilerplate.git && cd node-express-boilerplate && pnpm install && cp .env.example .env && docker compose up -d",
        note: "node 22 or later, pnpm, docker",
      },
      {
        label: "migrate, then run it",
        command: "pnpm prisma:migrate && pnpm prisma:generate && pnpm dev",
        note: "api at localhost:3000/api/v1, docs at /api-docs",
      },
      {
        label: "run both test layers",
        command: "pnpm test:all",
      },
    ],
    timeline: [
      {
        date: "2025-01-03",
        title: "First commit",
        body: "An Express, Prisma and TypeScript notes API with authentication, express-validator and morgan.",
      },
      {
        date: "2026-04-27",
        title: "Revival",
        body: "Resumed after a year: Zod replaces express-validator, Pino replaces morgan, CSRF, typed config, typed errors, Swagger, Docker, integration tests with thresholds, CI with CodeQL and the first agent instructions. Prisma 6 to 7, Express 4 to 5, TypeScript 5 to 6.",
      },
      {
        date: "2026-07",
        title: "Secrets and dead code",
        body: "TruffleHog on every push, knip for unused code and dependencies, and the openapi and security-audit slash commands.",
      },
      {
        date: "2026-09-28",
        title: "Latest merge",
        body: "Maintenance through the dev branch; Dependabot keeps npm and actions current without major bumps.",
      },
    ],
    faq: [
      {
        q: "Is this a framework or a starting point?",
        a: "A template to fork. Two example models, User and Note, show the full path through every layer, and the new-resource slash command scaffolds the next one across routes, controller, service, repository, schema, OpenAPI and tests.",
      },
      {
        q: "Does it rotate refresh tokens?",
        a: "No. The refresh endpoint verifies the refresh cookie and issues a new access token. For rotation with reuse detection, passkeys and OpenID Connect, see the Node auth template on this site.",
      },
      {
        q: "How do I run the tests without a development database?",
        a: "Unit tests need no database. Integration tests start a RAM-disk Postgres in Docker with one command, migrate it and run against the real app; CI does the same with a Postgres service.",
      },
      {
        q: "Which AI coding tools understand it?",
        a: "Claude Code, Gemini CLI, Codex, Cursor, GitHub Copilot and Windsurf, all reading the same AGENTS.md through symlinks, so the rules cannot drift between tools.",
      },
    ],
    related: ["node-authentication-template", "team-flow", "dotclaude"],
  },
  {
    slug: "team-flow",
    name: "TeamFlow",
    updatedAt: "2026-10-19",
    tagline:
      "A multi-tenant agile workspace API with sprints, RBAC and a full audit trail.",
    summary:
      "TeamFlow is a SaaS-style backend for organizations, projects, sprints and tasks. Organizations are isolated through membership, roles are enforced by guards, and every change lands in an immutable audit log. Started in a 96-hour backend program where I ranked first in the cohort, then grown over five months into 78 documented endpoints with notifications over Server-Sent Events and email.",
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
      "UploadThing",
      "Swagger",
      "Docker",
    ],
    repo: "team-flow",
    links: [
      { label: "Source", href: gh("team-flow") },
      {
        label: "API docs",
        href: "https://team-flow-tmtz.onrender.com/api/docs",
      },
    ],
    platform: "Node.js 22, PostgreSQL 16; hosted on Render's free tier",
    audience: "teams that want a Jira-like backend to put their own front end on",
    plain:
      "TeamFlow is the engine behind a team planning tool, like a simplified Jira. It keeps each company's projects, sprints and tasks separate, decides who may do what, tells people when their work changes, and keeps a permanent record of every change. It has no screens of its own; any web or mobile app can sit on top of it.",
    proof: [
      {
        value: "78",
        label: "documented endpoints",
        note: "13 modules, swagger generated from the decorators",
      },
      {
        value: "18",
        label: "database models",
        note: "with 12 enums and soft deletes on the five that matter",
      },
      {
        value: "37",
        label: "audited actions",
        note: "before and after snapshots, ip and user agent, secrets redacted",
      },
      {
        value: "13",
        label: "github stars",
        note: "counted on the repository on 19 oct 2026",
      },
    ],
    problem:
      "Agile tooling needs more than CRUD: tenant isolation, a real permission model, notifications that arrive on time, and a history nobody can quietly edit.",
    approach: [
      {
        title: "Organization as the boundary",
        body: "Every query is scoped through membership, a composite unique keeps one membership per person per organization, and a four-tier role hierarchy of owner, admin, member and viewer is enforced with guards. A global super admin role exists for operations.",
      },
      {
        title: "Work modeled properly",
        body: "Tasks carry priorities, story points, subtasks, dependencies, labels, attachments, watchers and threaded comments, get human-readable keys like PROJ-42, and keep an automatic activity timeline of every field change.",
      },
      {
        title: "Sessions that end",
        body: "Fifteen-minute access tokens and seven-day refresh tokens stored hashed; a refresh revokes the old token and issues a new pair, logout revokes, and a password reset revokes them all. Email verification by one-time code is required before the first login.",
      },
      {
        title: "Events that reach people",
        body: "One service persists each notification, pushes it over Server-Sent Events and emails it through eight branded templates. Four scheduled jobs expire invitations, warn about due and overdue tasks and purge old refresh tokens.",
      },
      {
        title: "Shipped as a container",
        body: "A multi-stage Alpine image runs the migrations on start and exposes a health check. Swagger is generated from the decorators and served live, and the pipeline type-checks, lints and builds on every push.",
      },
    ],
    highlights: [
      "Ranked 1st in the MAPS backend cohort with this project",
      "JWT access and refresh rotation with OTP email verification",
      "Immutable audit log with before and after snapshots",
      "Notifications over SSE and email, four scheduled jobs",
      "Live, documented REST API",
    ],
    decisions: [
      {
        chose: "isolation by membership scoping in the application",
        over: "row level security in the database",
        why: "Guards and a composite unique on membership were enough for the program's scope and kept the schema simple. Patchgrid, built after it, moves the same boundary into Postgres so a forgotten filter cannot leak.",
      },
      {
        chose: "rotating refresh tokens stored hashed",
        over: "a long-lived stateless refresh token",
        why: "A stored hash can be revoked, so logout and password reset actually end sessions. The price is a table to clean, which a nightly job handles.",
      },
      {
        chose: "soft deletes on users, organizations, projects, tasks and comments",
        over: "hard deletes",
        why: "Recovery without permanent loss, and the audit log keeps pointing at rows that still exist. Every query has to remember the deletedAt filter, which the services centralise.",
      },
    ],
    install: [
      {
        label: "clone it and start postgres",
        command:
          "git clone https://github.com/KhaledSaeed18/team-flow.git && cd team-flow && pnpm install && cp .env.example .env && docker compose up -d",
        note: "node 22, pnpm, docker; resend and uploadthing keys in .env",
      },
      {
        label: "migrate and run",
        command: "pnpm prisma:migrate && pnpm start:dev",
        note: "swagger at localhost:3000/api/docs",
      },
    ],
    timeline: [
      {
        date: "2026-02-21",
        title: "First commit",
        body: "The NestJS scaffold at the start of the backend program.",
      },
      {
        date: "2026-07-13",
        title: "Latest merge",
        body: "119 commits through pull requests from dev into main, deployed to Render after each green pipeline.",
      },
    ],
    faq: [
      {
        q: "How are tenants kept apart?",
        a: "Every resource is reached through an organization. A membership guard checks you belong, a roles guard checks your minimum role, and a composite unique keeps one membership per user per organization. It is application-level scoping, not database row security.",
      },
      {
        q: "Can I try it without deploying?",
        a: "Yes. The Swagger UI is live on a free tier, so the first request after a quiet period can take close to a minute. Locally it is Docker for Postgres, one migrate command and one start command.",
      },
      {
        q: "Is there a front end?",
        a: "No. It is a documented REST API meant to sit under any web, mobile or third-party client.",
      },
      {
        q: "Are there automated tests?",
        a: "Not yet. Jest is configured, and the pipeline type-checks, lints and builds on every push. Patchgrid, the successor, is where the testing discipline landed.",
      },
    ],
    related: ["patchgrid", "node-authentication-template", "node-express-boilerplate"],
  },
  {
    slug: "node-authentication-template",
    name: "Node auth template",
    updatedAt: "2026-10-19",
    tagline:
      "Passkeys, OpenID Connect and revocable sessions in an authentication backend ready to fork.",
    summary:
      "An Express 5 and TypeScript authentication API on PostgreSQL and Prisma 7, with passwordless passkeys, TOTP recovery codes and a headless OpenID Connect provider. Rotating tokens, account self-service, reliable email delivery and tracing cover the work around sign-in too. Version 3.2.0 is documented by nine decision records and a STRIDE threat model, and tested against a real PostgreSQL in CI.",
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
        label: "Decisions",
        href: `${gh("node-authentication-template")}/tree/main/docs/adr`,
      },
      {
        label: "Changelog",
        href: `${gh("node-authentication-template")}/blob/main/CHANGELOG.md`,
      },
    ],
    status: "v3.2.0 released",
    platform: "Node.js 24, PostgreSQL 18; Redis optional",
    audience: "teams that need sign-in done properly before the product exists",
    plain:
      "Every app needs a way to sign people in, and getting it wrong is how accounts get stolen. This is a ready-made sign-in service: passwords, fingerprint or face passkeys, two-factor codes, sign in with for other apps, and a page where people see and end their own sessions. Every risky step is logged and emailed to the account owner.",
    proof: [
      {
        value: "171",
        label: "tests against real postgresql",
        note: "22 files, the ci run for v3.2.0 on 9 oct 2026",
      },
      {
        value: "9",
        label: "decision records",
        note: "plus a stride threat model that lists its residual risks",
      },
      {
        value: "350 MB",
        label: "api image, down from 730",
        note: "runtime and migrate images from one dockerfile, amd64",
      },
      {
        value: "1",
        label: "required dependency",
        note: "postgresql; redis only for shared rate limits",
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
        body: "A headless OpenID Connect provider supports authorization code flow with PKCE, discovery, userinfo and consent for third-party clients, with token introspection and revocation on main. Access and ID tokens use rotating ES256 signing keys published through JWKS, so other services can verify them.",
      },
      {
        title: "Sessions you can actually end",
        body: "Opaque refresh tokens rotate on every use; reuse revokes the session, with a ten-second grace for two tabs refreshing at once. Every authenticated request checks that its server-side session is active. Users can list sessions, revoke one, log out everywhere and inspect a paginated login history.",
      },
      {
        title: "The whole account lifecycle",
        body: "Email verification, password reset and confirmed email changes use single-use codes stored as HMACs, with attempt limits and resend cooldowns. Users can edit their profile, export their account data and delete their account after re-authentication.",
      },
      {
        title: "Security at each boundary",
        body: "Argon2id replaces bcrypt, upgrading existing hashes on sign-in. Breached passwords are screened against Have I Been Pwned by k-anonymity, failed sign-ins trigger account lockout, and recovery endpoints avoid revealing whether an account exists. Rate limits can share a Redis store, with Helmet, strict CORS and validated configuration around the API.",
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
    decisions: [
      {
        chose: "server-side sessions with rotating opaque refresh tokens",
        over: "stateless refresh tokens or a denylist",
        why: "One indexed lookup per request buys immediate revocation, so logout means logout. Verifiers that only check the JWKS cannot see a revocation until the access token expires, which is why introspection exists for the cases that matter.",
      },
      {
        chose: "a modular monolith with one composition root",
        over: "a dependency injection container or NestJS",
        why: "Plain constructors keep the wiring readable in a single function. The cost is that the composition root grows with every module, which is visible rather than hidden.",
      },
      {
        chose: "PostgreSQL as the only required dependency",
        over: "a message broker and a cache",
        why: "The outbox uses row locks with skip-locked, concurrency uses conditional updates and advisory locks, and delivery is at least once so handlers are idempotent. Redis is optional and only shares rate-limit counters across instances. Delivery latency is up to a second.",
      },
      {
        chose: "ES256 tokens with rotating keys in JWKS",
        over: "HS256 shared secrets or RS256",
        why: "A shared secret means every verifier can also forge. RS256 tokens are bigger and EdDSA has weaker gateway support. Keys rotate every thirty days and the service fails closed if a key cannot be decrypted, so a misconfigured instance cannot retire the others' keys.",
      },
      {
        chose: "a headless OpenID Connect provider",
        over: "hosted login pages or a provider library",
        why: "The authorize endpoint hands an interaction id to your own front end, which signs the user in through the normal API. No implicit or hybrid flow, PKCE S256 is mandatory, and dynamic client registration and back-channel logout are deliberately not built.",
      },
    ],
    install: [
      {
        label: "run the whole stack",
        command:
          "export ENCRYPTION_KEY=$(openssl rand -base64 32) && docker compose up --build",
        note: "api at localhost:4000/api/v1, mailpit at localhost:8025",
      },
      {
        label: "run the tests against a real database",
        command:
          "docker compose up -d db && TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_test yarn test",
      },
      {
        label: "bring up grafana with traces and metrics",
        command:
          "docker compose -f compose.yaml -f compose.observability.yaml up --build",
        note: "grafana at localhost:3001",
      },
    ],
    timeline: [
      {
        date: "2025-03-09",
        title: "First commit",
        body: "A JWT authentication API on Express, Prisma and PostgreSQL.",
      },
      {
        date: "2026-10-09",
        title: "v2.0.0",
        body: "Reworked into modules: Argon2id, server-side sessions with rotating refresh tokens, 2FA recovery codes, lockout, HMAC codes, OpenAPI, Docker and CI.",
      },
      {
        date: "2026-10-09",
        title: "v3.0.0 and v3.1.0",
        body: "Passkeys, the transactional outbox, ES256 tokens with JWKS, the activity log and security alerts, OpenTelemetry, scans, decision records and the threat model, then the headless OpenID Connect provider.",
      },
      {
        date: "2026-10-09",
        title: "v3.2.0",
        body: "Confirmed email change, account deletion, data export, breached-password screening, and a separate migrate image that cut the API image from 730 MB to about 350 MB. Introspection and revocation followed on main.",
      },
    ],
    faq: [
      {
        q: "Can I run it without Redis?",
        a: "Yes. PostgreSQL is the only required service. Redis only shares rate-limit counters between instances when you scale out.",
      },
      {
        q: "How do my other services verify its tokens?",
        a: "Fetch the JWKS endpoint and verify the ES256 token by its key id. Offline verification cannot see a revocation until the token expires, at most fifteen minutes, so call the introspection endpoint when that matters.",
      },
      {
        q: "Does it render login pages for OpenID Connect?",
        a: "No. It is headless. The authorize endpoint redirects to your front end with an interaction id, your page signs the user in through the regular API, and completes the interaction.",
      },
      {
        q: "What happens if a refresh token is stolen?",
        a: "Tokens rotate on every use. Presenting an old one revokes the whole session and emails the owner, with a ten-second grace window so two tabs refreshing at once do not lock each other out.",
      },
      {
        q: "How are emails sent reliably?",
        a: "Each email is written to an outbox row in the same transaction as the change that caused it, then delivered by a worker with exponential backoff. The worker runs in-process or as a separate container.",
      },
    ],
    related: ["node-express-boilerplate", "sleep-track", "jwt-toolkit", "patchgrid"],
  },
  {
    slug: "sleep-track",
    name: "SleepTrack",
    updatedAt: "2026-10-19",
    tagline:
      "A sleep journal with an analytics engine: an async FastAPI service and a Next.js and daisyUI app.",
    summary:
      "SleepTrack turns logged nights into a nightly score, trends, a chronotype estimate, the habits that help or hurt your sleep and a weekly report. Version 2 is a ground-up rewrite: an async FastAPI service on PostgreSQL and Redis with a background worker, and a Next.js 16 app typed from the API's OpenAPI schema, with a one-click demo and a mock API so the whole interface runs offline.",
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
      {
        label: "Analytics formulas",
        href: `${gh("sleep-track-backend")}/blob/main/docs/analytics.md`,
      },
    ],
    platform: "Python 3.13 and Node.js 24, with PostgreSQL 17 and Redis 8 in Docker",
    audience: "anyone curious why some nights are better, and engineers reading a full-stack reference",
    plain:
      "SleepTrack is a diary for your nights. Tap a timer at bedtime or log a night in seconds, tag it with habits like caffeine or exercise, and it works out a score, your natural rhythm, how steady your schedule is and which habits help or hurt, then emails you a weekly report. Every night is kept in your own time zone, and you can try it with a click, no sign-up.",
    proof: [
      {
        value: "1,032",
        label: "backend tests",
        note: "run against real postgresql and redis in ci, 37 seconds",
      },
      {
        value: "98%",
        label: "test coverage",
        note: "line and branch, measured on the api service; the floor is 85%",
      },
      {
        value: "84",
        label: "client unit tests",
        note: "plus 16 playwright flows against the live api in ci",
      },
      {
        value: "90",
        label: "nights seeded by the demo",
        note: "one click, no sign-up; the account deletes itself after a day",
      },
    ],
    problem:
      "Logging sleep is the easy part. Making the log useful means knowing which night a session belongs to, which habits change your sleep and how steady your schedule really is, all in your own time zone and behind an account system you can trust with health data.",
    approach: [
      {
        title: "Analytics that respect the clock",
        body: "Bedtimes are averaged as angles, so 23:30 and 00:30 average to midnight instead of noon, and every night belongs to the date it began in the user's time zone. The API computes a weighted score from duration, quality, latency, awakenings and bedtime, plus consistency, sleep debt, streaks, chronotype and social jet lag, cached per user in Redis and invalidated by a version number.",
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
        body: "The Next.js app generates its types from the OpenAPI schema, keeps the access token in memory and refreshes it single-flight. A same-origin route handler streams /api to the service and forwards the client address, so rate limits see real users. It has two themes, a command menu with shortcuts for every page, a mobile dock, a year heatmap and charts with table views.",
      },
      {
        title: "Tested against the real thing",
        body: "Over a thousand backend tests run on real PostgreSQL and Redis, and Playwright drives sign-up with email confirmation, the journal, the timer and settings against the live API in CI. A mock API lets every page run offline, and a screenshot script visits every page in both themes and fails on any console error.",
      },
    ],
    highlights: [
      "Weighted sleep score with circular bedtime statistics, chronotype and tag impact",
      "Rotating refresh tokens with reuse detection and CSRF protection",
      "Overlapping nights rejected by a Postgres exclusion constraint",
      "Weekly email reports and bedtime reminders from a background worker",
      "Client types generated from the API's OpenAPI schema; mock API for offline work",
      "1,032 backend tests at 98% coverage plus Playwright end-to-end tests in CI",
    ],
    decisions: [
      {
        chose: "SQLAlchemy 2 async with Alembic",
        over: "the Tortoise ORM of version 1",
        why: "Repositories own queries and services own transactions, every relationship load is explicit because async forbids lazy loading, and the whole thing types under strict mypy. More verbose, and CI pays for it by running every migration up, check and down.",
      },
      {
        chose: "a session denylist in Redis that fails open",
        over: "checking the database on every request",
        why: "One Redis EXISTS per request keeps revocation immediate at almost no cost. If Redis is down, access tokens are honoured until they expire in fifteen minutes. The trade-off is written down in the decision record rather than hidden.",
      },
      {
        chose: "a route handler proxy in the Next.js app",
        over: "Next.js rewrites",
        why: "Rewrites do not add the forwarded client address, so the API would see one IP for every user and rate limits would break. The handler also reads the API address at runtime, so one image serves every environment.",
      },
      {
        chose: "the overlap rule enforced twice",
        over: "a check in the service alone",
        why: "The service gives a friendly error. The PostgreSQL exclusion constraint catches the race the service cannot see when two requests land at once.",
      },
      {
        chose: "ARQ behind a queue protocol",
        over: "Celery or a broker",
        why: "ARQ runs on the Redis already there, and an eager implementation runs jobs in-process for tests and single-container deployments. ARQ is in maintenance mode, which is accepted with the migration path contained to one adapter.",
      },
    ],
    install: [
      {
        label: "run the api, database, redis and mail catcher",
        command:
          "git clone https://github.com/KhaledSaeed18/sleep-track-backend.git && cd sleep-track-backend && docker compose up -d --build && make seed",
        note: "api docs at localhost:8000/api/v1/docs, mailpit at localhost:8025",
      },
      {
        label: "run the web app against it",
        command:
          "git clone https://github.com/KhaledSaeed18/sleep-track-frontend.git && cd sleep-track-frontend && pnpm install && cp .env.example .env.local && pnpm dev",
        note: "node 24 and pnpm 12; or set next_public_api_mocking=true for no backend at all",
      },
      {
        label: "run the backend suite",
        command: "make infra && make test",
      },
    ],
    timeline: [
      {
        date: "2025-06-15",
        title: "First commits",
        body: "A FastAPI service on Tortoise ORM and a Create Next App client, started the same day.",
      },
      {
        date: "2026-10-12",
        title: "v2.0.0",
        body: "Both sides rewritten from the ground up: SQLAlchemy async, Alembic, Argon2id, rotating sessions, the analytics engine and worker on one side; Next.js 16, React 19, daisyUI 5, typed client, command menu and Playwright on the other.",
      },
    ],
    faq: [
      {
        q: "Can I try it without signing up?",
        a: "Yes. One click creates a throw-away account with about ninety nights of tagged history. A scheduled job deletes demo accounts after twenty-four hours.",
      },
      {
        q: "How is the sleep score computed?",
        a: "A weighted sum of duration against your goal, quality, latency, awakenings and bedtime adherence, each clamped between zero and one. Inputs you did not log drop out and the remaining weights renormalise. The full formulas are in the analytics document.",
      },
      {
        q: "Why do 23:30 and 00:30 average to midnight?",
        a: "Bedtimes are treated as angles on a 24-hour circle and averaged with circular statistics, so the wrap past midnight does not drag the average to noon.",
      },
      {
        q: "What happens if two tabs refresh at once?",
        a: "Within a ten-second grace window the second presentation of a rotated refresh token is simply rejected. Outside it, reuse is treated as theft: the device session is revoked and the account owner gets an email.",
      },
      {
        q: "Can I run the interface without the backend?",
        a: "Yes. One environment flag switches the app to a stateful mock API in the browser with seeded nights, so every page works offline.",
      },
    ],
    related: ["node-authentication-template", "patchgrid"],
  },
  {
    slug: "deck-kit",
    name: "deck-kit",
    updatedAt: "2026-10-19",
    tagline:
      "HTML slides, a synced presenter view and one file that runs with Wi-Fi off.",
    summary:
      "A reusable presentation kit built with plain HTML, CSS and TypeScript. Write slides as small HTML files, present with step-aware notes and a pace timer, then ship a self-contained deck or PDF. Four portable agent skills guide research, writing, verification and design, with a review stop after each phase; since v1.2.0 they work with Codex, Claude Code and any agent that reads AGENTS.md.",
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
      { label: "v1.2.0 release", href: `${gh("deck-kit")}/releases/tag/v1.2.0` },
    ],
    status: "v1.2.0 released, MIT licensed",
    platform: "Node.js 22.12 or later to build; any browser to present",
    audience: "people who give talks and want them in a repository, not a cloud",
    plain:
      "A talk needs slides, a script, a shorter version for when time runs out, and a plan for the moment the venue Wi-Fi fails. deck-kit keeps all of that in one folder: slides are small web pages, the presenter screen shows your notes and pace, and the whole talk builds into a single file that opens from a USB stick. AI helpers can draft and fact-check the talk, but you approve every step.",
    proof: [
      {
        value: "1",
        label: "file to present offline",
        note: "deck.html includes the slides, assets and presenter view",
      },
      {
        value: "0",
        label: "network requests at runtime",
        note: "fonts, icons and images ship in the build; tests block external requests",
      },
      {
        value: "77",
        label: "browser tests, 77 unit tests",
        note: "v1.2.0 release run, chromium and webkit; four expected skips",
      },
      {
        value: "15 kB",
        label: "gzipped javascript for the starter deck",
        note: "no ui framework and no presentation library",
      },
    ],
    problem:
      "A talk needs more than slides: a script, a shorter cut, reliable presenter controls and a fallback when the network fails. I wanted to keep all of that in a repository, reuse the engine for the next talk and change the design without rewriting the content.",
    approach: [
      {
        title: "Content, theme and engine stay separate",
        body: "Each slide is an HTML partial with semantic markup, build steps and speaker notes. A deck manifest sets the order, timing and alternate profiles. CSS tokens and layouts own the design; the vanilla TypeScript engine handles navigation on a fixed 1920 by 1080 canvas, scaled to fit the screen, and tests enforce that the engine holds no visual literals.",
      },
      {
        title: "A presenter view that keeps up",
        body: "The presenter sees the current step, next slide, highlighted script and pace against target timings. Either window can advance the talk. BroadcastChannel sync has an opener fallback for local files; keyboard, clicker and touch controls share the same navigation, with overview and blackout a key away.",
      },
      {
        title: "A workflow with review built in",
        body: "Four skills create a talk, add slides, retheme it or prepare delivery. The new-deck workflow moves through brief, research, content, verification and design, pausing for review at each phase. Nothing on screen changes without approval: unapproved text is marked and fails the lint until resolved.",
      },
      {
        title: "Lint for slides",
        body: "A dev overlay and a check command flag too much prose per slide, em dashes, exclamation marks, emoji, inline styles and tables without captions. A live region announces slides, hidden slides are inert, and axe runs on every slide.",
      },
      {
        title: "Ready for the room, with a fallback",
        body: "Vite builds a static site or one deck.html that opens from a USB stick, including the presenter view. Export slides to PDF and notes to a printable script. Separate engine and deck browser suites check navigation, sync, slide fit, accessibility, print and offline behavior.",
      },
    ],
    highlights: [
      "Single-file offline delivery, static hosting and PDF export",
      "Two-way presenter sync with step-aware notes and a persistent timer",
      "Alternate talk profiles with their own slide order and target timings",
      "Keyboard and clicker controls, overview, blackout and touch navigation",
      "Portable agent skills with explicit review stages, AGENTS.md canonical",
      "Two complete talks with distinct themes on the same framework-free engine",
    ],
    decisions: [
      {
        chose: "a fixed 1920 by 1080 canvas scaled to the screen",
        over: "responsive slides that reflow",
        why: "Layouts never reflow, so what you rehearsed is what the room sees. The cost is letterboxing on screens with another aspect ratio.",
      },
      {
        chose: "no runtime network requests",
        over: "web fonts and hosted icons",
        why: "Fonts and icons are packages in the build and images live in the repository. The offline tests block every external request, so the day the venue Wi-Fi fails is a tested path.",
      },
      {
        chose: "one AGENTS.md with CLAUDE.md as a symlink",
        over: "per-agent instruction files",
        why: "Codex, Claude Code and any agent that reads the file get the same workflow and the same review stops. Windows needs symlinks enabled, and the docs say to fall back to plain files if they break.",
      },
      {
        chose: "shortcuts by physical key",
        over: "by letter",
        why: "The same keys work on AZERTY and Arabic layouts, and Ctrl, Cmd and Alt are left to the browser.",
      },
    ],
    install: [
      {
        label: "start a talk from the template",
        command: "pnpm install && pnpm dev",
        note: "after use this template on github; presenter view at /presenter.html",
      },
      {
        label: "build the one-file deck for a usb stick",
        command: "pnpm build:single",
        note: "dist-single/deck.html opens by double-click",
      },
      {
        label: "export slides to pdf",
        command: "pnpm pdf",
      },
    ],
    timeline: [
      {
        date: "2026-10-14",
        title: "v1.0.0",
        body: "The engine, presenter sync, profiles, slide lint, the single-file build, the browser suites and four Claude Code skills, with the wireless networks talk as the example.",
      },
      {
        date: "2026-10-14",
        title: "v1.1.0",
        body: "A second complete talk on introductory cryptography with its brief, plan, decisions and fact log published as a worked example.",
      },
      {
        date: "2026-10-14",
        title: "v1.2.0",
        body: "Portable workflows: AGENTS.md canonical, skills moved to a shared folder, tool-neutral instructions that disclose separate passes when an agent has no subagents.",
      },
    ],
    faq: [
      {
        q: "Does it work with Wi-Fi off?",
        a: "Yes. There are no runtime requests, and the single-file build produces one deck.html that runs from a USB stick, presenter view included.",
      },
      {
        q: "Do I need an AI agent to use it?",
        a: "No. Slides are HTML partials you can write by hand. The skills are there for Codex, Claude Code or any agent that reads AGENTS.md, and they stop for your review after each phase.",
      },
      {
        q: "Can one talk have a short version?",
        a: "Yes. A profile has its own slide order and target timings, and the PDF export produces each profile.",
      },
      {
        q: "What stops the AI from changing my facts?",
        a: "On-screen content never changes without approval. Text an agent is unsure about is marked, and a marked slide fails the lint until you resolve it.",
      },
    ],
    related: ["dotclaude", "mcce"],
  },
  {
    slug: "dotclaude",
    name: "dotclaude",
    updatedAt: "2026-10-19",
    tagline:
      "A registry of Claude Code skills, agents, commands and hooks, installable in one line.",
    summary:
      "My collection of Claude Code extensions for engineering, git, testing, security and research workflows: 136 items in 17 plugins, generated from one source tree and validated in CI. It is distributed as a shadcn GitHub registry and as installable plugins, with a searchable static catalog site.",
    year: 2026,
    group: "tools",
    kind: "AI developer tooling",
    object: "toolbox",
    stock: "terracotta",
    stack: ["TypeScript", "shadcn registry", "Claude Code", "Vitest", "GitHub Pages"],
    repo: "dotclaude",
    links: [
      { label: "Catalog", href: "https://dotclaude.khaledsaeed.tech/" },
      { label: "Source", href: gh("dotclaude") },
    ],
    platform: "Claude Code, or any project through the shadcn CLI",
    audience: "developers who want their AI coding assistant to follow a procedure, not a vibe",
    plain:
      "An AI coding assistant is only as careful as the instructions you give it, and good instructions end up scattered across projects. dotclaude is a shelf of ready-made procedures, helpers and safety checks you can add to Claude Code with one command, so it reviews code, writes tests, handles git or checks citations the same careful way every time.",
    proof: [
      {
        value: "136",
        label: "items in the registry",
        note: "86 skills, 17 agents, 18 commands and 15 hooks, counted from the source tree",
      },
      {
        value: "17",
        label: "installable plugins",
        note: "validated and smoke-installed in ci with a pinned claude code cli",
      },
      {
        value: "20",
        label: "skills for academic work",
        note: "the thesis plugin, from research question to latex",
      },
      {
        value: "116",
        label: "tests on the tooling",
        note: "the validator rejects stubs and descriptions without a trigger",
      },
    ],
    problem:
      "AI coding agents are only as good as the procedures you give them, and good procedures end up scattered across projects and dotfiles.",
    approach: [
      {
        title: "Four kinds of extension",
        body: "Skills load themselves when a request matches, agents take whole side tasks in their own context, commands run on demand, and hooks fire on every event with no model judgment: a command guard, a sensitive-file guard, a stop gate that runs the tests before Claude can stop, format on edit.",
      },
      {
        title: "Two ways to install",
        body: "Whole plugins through the Claude Code marketplace, where hooks activate on install, or single items through the shadcn CLI straight into a project's .claude folder.",
      },
      {
        title: "One source, everything else generated",
        body: "Each item is a folder with a manifest. The registry files, the README catalog, the plugin tree, the site data, one crawlable page per item, the sitemap and llms.txt are generated from it, and CI fails if a generated file is stale.",
      },
      {
        title: "A thesis toolkit",
        body: "One plugin covers a full research lifecycle: literature search, verified BibTeX, citation checking, statistics, methodology, LaTeX and Word output, with an examiner-style reviewer and a paper critic as agents.",
      },
    ],
    highlights: [
      "Catalog with search and filters at dotclaude.khaledsaeed.tech",
      "86 skills, 17 agents, 18 commands and 15 hooks across 15 categories",
      "Distributed as 17 plugins and as a shadcn GitHub registry",
      "Hooks are deterministic; advisory ones never block",
    ],
    decisions: [
      {
        chose: "a static catalog with no build step",
        over: "a site framework",
        why: "Pages are generated with everything else, so the site never needs editing when an item changes, and it deploys to GitHub Pages with no dependencies.",
      },
      {
        chose: "plugins and the shadcn registry both",
        over: "one distribution channel",
        why: "Plugins give namespaced commands and hooks that are live on install. shadcn copies one item into a project, but cannot edit settings, so a hook installed that way needs a block pasted by hand. The docs say which to pick.",
      },
      {
        chose: "rejecting descriptions without a trigger clause",
        over: "accepting any manifest",
        why: "A skill with a vague description either never loads or loads for everything. The validator fails CI on stubs and on descriptions that do not say when the skill applies.",
      },
    ],
    install: [
      {
        label: "add the marketplace in claude code",
        command: "/plugin marketplace add KhaledSaeed18/dotclaude",
      },
      {
        label: "install a plugin",
        command: "/plugin install security@dotclaude",
      },
      {
        label: "or copy one item with shadcn",
        command: "npx shadcn@latest add KhaledSaeed18/dotclaude/handoff",
        note: "lands in .claude/skills/handoff",
      },
    ],
    timeline: [
      {
        date: "2026-06-06",
        title: "First commit",
        body: "The registry layout, the first skills and the shadcn distribution.",
      },
      {
        date: "2026-07-04",
        title: "Stricter validation",
        body: "Stubs and descriptions without a trigger clause fail the build.",
      },
      {
        date: "2026-09-21",
        title: "The catalog site",
        body: "A page per item and per plugin, and the academic items: research design, statistics, systematic review.",
      },
      {
        date: "2026-10-14",
        title: "Latest push",
        body: "Plugins, hooks and site pages kept in step; 212 commits so far.",
      },
    ],
    faq: [
      {
        q: "What is the difference between a skill, an agent, a command and a hook?",
        a: "A skill loads itself when a request matches its description. An agent takes a side task in its own context. A command runs when you type its name. A hook runs on an event, with no model judgment at all.",
      },
      {
        q: "Plugin or shadcn?",
        a: "Plugins for bundles and for hooks, which activate on install. shadcn for one item you want to read and adapt in your own project.",
      },
      {
        q: "Can I use an item in every project?",
        a: "Items install into the project's .claude folder. Copy them to the one in your home directory to use them everywhere.",
      },
      {
        q: "How do I add my own item?",
        a: "A scaffold command creates the folder and manifest, a generate command rebuilds everything downstream, and CI validates it.",
      },
    ],
    related: ["deck-kit", "node-express-boilerplate", "wakehold"],
  },
  {
    slug: "mcce",
    name: "MCCE",
    updatedAt: "2026-10-19",
    tagline:
      "The study hub for my master's program: every course file, past exam and planner in one index.",
    summary:
      "An independent, student-built index for the LIU M.S. in Computer and Communication Engineering. It syncs shared Google Drive folders into one searchable site every week, 895 files across 16 courses at the last crawl, and adds the plan of study, a prerequisite roadmap, a GPA calculator, a tuition planner, a directory of 400 tools and an in-browser PDF editor. No sign-in, no tracking, no backend.",
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
      "Vitest",
      "PWA",
    ],
    repo: "mcce",
    links: [
      { label: "Live site", href: "https://mcce.khaledsaeed.tech" },
      { label: "Source", href: gh("mcce") },
    ],
    featured: true,
    platform: "Any browser; installable as a PWA; hosted on Cloudflare Workers",
    audience: "students of the LIU MCCE program, and anyone who runs a course on scattered files",
    plain:
      "Course files for a degree end up spread across a classroom app, chat groups and someone's drive, and past exams are the first thing to go missing. MCCE gathers all of it for one master's program into a single searchable site that updates itself every week, and adds the tools students actually need: a GPA calculator, a tuition planner and a map of which course needs which.",
    proof: [
      {
        value: "895",
        label: "files indexed",
        note: "28.8 gb across 276 folders, crawl of 12 oct 2026",
      },
      {
        value: "16",
        label: "courses over 4 semesters",
        note: "514 pdfs and 215 videos among them",
      },
      {
        value: "401",
        label: "tools in the directory",
        note: "plus 285 github repositories with licence and maintenance state",
      },
      {
        value: "606",
        label: "tests",
        note: "110 test files, run with typecheck and dead-code checks on every push",
      },
    ],
    problem:
      "Course material lived in three channels that each lost something: official slides with no past exams, and chat groups that were hard to search and not open to everyone.",
    approach: [
      {
        title: "Drive as the source of truth",
        body: "A scheduled GitHub Action crawls three shared Drive folders through a service account every Monday, classifies every file by semester, course and material type, and commits the index back as JSON. The site has no backend: the index is the data, cached in the browser after the first visit.",
      },
      {
        title: "The program on one screen",
        body: "Plan of study, a prerequisite roadmap drawn as a graph with credit totals, admissions tracks and tuition figures, with a planner that works a year of fees out in dollars and pounds, and a GPA calculator that projects the end of the program and shares a link.",
      },
      {
        title: "Mark up a PDF without touching it",
        body: "Any indexed file opens in an editor with drawing, text, shapes, page rotation and reordering. The markup stays in the browser and saves as a copy, so the shared file in Drive never changes.",
      },
      {
        title: "Everything else a student searches for",
        body: "A command palette with recents, past exams grouped by course and term, a feed of recent additions with RSS, and a directory of about 400 tools and 285 repositories by category, cost and licence, including a thesis toolkit by stage.",
      },
    ],
    highlights: [
      "Weekly automatic sync from Google Drive, link check the hour after",
      "Search with filters, command palette, course pages and past exams",
      "GPA projection, tuition planner and a prerequisite roadmap",
      "In-browser PDF editor for any indexed file",
      "Installable PWA that works offline, on Cloudflare Workers",
    ],
    decisions: [
      {
        chose: "a committed JSON index",
        over: "a database and an API",
        why: "The data changes once a week, so a crawl that commits its result is enough. The site ships as static assets on a worker, works offline from the cached index, and has no server to keep running or secure.",
      },
      {
        chose: "markup kept in the browser",
        over: "writing back to Drive",
        why: "A shared folder has one copy of every file. Editing locally and saving a marked-up copy keeps the shared file intact and needs no write permission on anyone's Drive.",
      },
      {
        chose: "no accounts",
        over: "sign-in and saved profiles",
        why: "GPA entries and saved files stay in the browser. Nothing to leak, nothing to maintain, and the site stays open to every student, not only members of a chat group.",
      },
    ],
    install: [
      {
        label: "use it",
        command: "open https://mcce.khaledsaeed.tech/search",
      },
      {
        label: "run it locally",
        command: "pnpm install && pnpm dev",
        note: "the committed index works without a drive key; syncing needs a service account",
      },
    ],
    timeline: [
      {
        date: "2026-08-10",
        title: "First commit",
      },
      {
        date: "2026-08-17",
        title: "First Drive crawl committed",
        body: "The baseline index that every weekly sync has been diffed against since.",
      },
      {
        date: "2026-09",
        title: "Course pages, exams, planners and the editor",
        body: "Then the resources hub with the tools directory and thesis toolkit.",
      },
      {
        date: "2026-10-12",
        title: "Latest index",
        body: "895 files across 16 courses; 872 commits by 19 October.",
      },
    ],
    faq: [
      {
        q: "Is this an official LIU site?",
        a: "No. It is independent and student-built, and says so on every page.",
      },
      {
        q: "Where do the files come from and how fresh are they?",
        a: "From shared Google Drive folders, crawled by a scheduled job every Monday morning. The recently added feed and its RSS show what changed.",
      },
      {
        q: "Does editing a PDF change the file in Drive?",
        a: "No. Markup is kept in your browser and you save a marked-up copy. The shared file is never written.",
      },
      {
        q: "Is my GPA data sent anywhere?",
        a: "No. Entries stay in the browser. A share link encodes them in the address so you can send it to someone.",
      },
    ],
    related: ["deck-kit", "freertos-riscv"],
  },
  {
    slug: "jwt-toolkit",
    name: "jwt-toolkit",
    tagline:
      "Inspect, compare and stress-test JWTs, with verification you can read.",
    summary:
      "A Python security CLI for debugging token changes, checking signatures and testing your own verifier. Version 1.1.0 adds token diffs, EdDSA and practical key inputs while tightening parsing, claim validation and scriptable errors. The JWS logic stays readable on top of cryptography, without pyjwt or python-jose.",
    year: 2026,
    updatedAt: "2026-10-19",
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
    platform: "Python 3.13 or later, any operating system",
    audience: "developers and security testers who need to know what a token really says",
    plain:
      "Websites recognise you with a small signed pass called a JWT. jwt-toolkit opens one up, shows what it claims and when it expires, checks whether it was signed safely, compares two of them, and shows a developer how an attacker would try to fake one, so they can make sure their own system refuses it. It runs on your machine and never sends tokens anywhere.",
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
      {
        value: "15",
        label: "signing algorithms",
        note: "hmac, rsa, rsa-pss, ecdsa and eddsa families; none is never accepted",
      },
      {
        value: "6",
        label: "pypi releases",
        note: "25 may to 17 oct 2026, each attested through trusted publishing",
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
    decisions: [
      {
        chose: "re-implementing JWS on top of cryptography",
        over: "pyjwt or python-jose",
        why: "Showing how signing works and where it breaks is the point of the tool, so the signature check has to be readable. The cost is owning every edge case, which is why the verifier's rules are written down and tested one by one.",
      },
      {
        chose: "the algorithm family from the key you supply",
        over: "the alg header in the token",
        why: "Trusting the header is the classic confusion attack: an RSA public key accepted as an HMAC secret. The key decides the family, and alg none is never accepted.",
      },
      {
        chose: "labelling header-only forge variants",
        over: "reporting every rejection as a pass",
        why: "If a verifier rejects a token with a tampered kid, that does not prove it is safe from kid injection; it may have failed for another reason. The report says which variants prove nothing by themselves.",
      },
      {
        chose: "stable error codes and an additive JSON schema",
        over: "free-form messages",
        why: "A CI gate needs to match on a code that will still exist next year. Codes are frozen and the JSON shape only ever gains fields.",
      },
    ],
    install: [
      {
        label: "install with pipx or uv",
        command: "pipx install jwt-toolkit",
        note: "python 3.13 or later; uv tool install jwt-toolkit also works",
      },
      {
        label: "try it without installing",
        command: "uvx jwt-toolkit audit \"$TOKEN\"",
      },
      {
        label: "gate a pipeline on a token's shape",
        command:
          'jwt-toolkit --quiet audit "$SERVICE_TOKEN" --strict --require iss,aud,exp --json > audit.json',
        note: "exit 0 clean, 1 findings, 2 unreadable",
      },
    ],
    timeline: [
      {
        date: "2026-05-25",
        title: "v0.1.0",
        body: "Decode, sign, verify with JWKS, audit, forge, crack, generate-secret and download-wordlists, published to PyPI the day after the first commit.",
      },
      {
        date: "2026-07-03",
        title: "v1.0.0",
        body: "First stable release with the public surface unchanged since 0.1.3 and the dependency advisories cleared.",
      },
      {
        date: "2026-10-17",
        title: "v1.1.0",
        body: "The diff command, EdDSA, secret and payload files, certificates and encrypted keys, the bundled wordlist with worker processes, stricter verification and stable JSON errors.",
      },
    ],
    faq: [
      {
        q: "Does decode verify the token?",
        a: "No. Decode and diff show what a token says without checking the signature. Use verify with the right key before trusting the contents.",
      },
      {
        q: "Is it safe to run crack?",
        a: "Only on tokens you own. It exits 1 when the secret is found, and not finding one with a wordlist does not prove the secret is strong.",
      },
      {
        q: "How do I keep secrets out of my shell history?",
        a: "Pass them as files with --secret-file, and generate new ones with generate-secret --raw straight into a file.",
      },
      {
        q: "Does it send tokens anywhere?",
        a: "No. The only network calls are fetching a JWKS you point it at and downloading wordlists over verified TLS. Tests never touch the network.",
      },
    ],
    related: ["node-authentication-template", "urljail", "dir-analysis-tool"],
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
    updatedAt: "2026-10-19",
    tagline:
      "Explore a codebase through architecture maps, hotspots, ownership and Git history, all on your machine.",
    summary:
      "Repo Scout turns a local Git repository into a navigable atlas of its code and history. A single binary with the interface embedded connects activity calendars, file ownership and bus factor, searchable source, architecture graphs, change coupling and duplicate code, backed by a Go scanner and SQLite with live scan progress. Version 1.0.0 adds a scan command for CI with SARIF output and quality gates, and nothing ever leaves the machine.",
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
      "Playwright",
      "GoReleaser",
    ],
    repo: "repo-scout",
    links: [
      { label: "Source", href: gh("repo-scout") },
      { label: "v1.0.0 release", href: `${gh("repo-scout")}/releases/tag/v1.0.0` },
      { label: "UI showcase", href: `${gh("repo-scout")}#see-it-in-action` },
    ],
    status: "v1.0.0 released",
    platform: "macOS, Linux and Windows, one binary per platform; git on the path",
    audience: "engineers joining an unfamiliar codebase, and teams that want a quality gate in CI",
    plain:
      "Point Repo Scout at a software project on your own computer and it reads the code and its change history, then shows in your browser how the project is built, which parts are complicated and keep changing, who knows which parts, and where the hidden connections are. It sends nothing to the internet, and the same tool can fail a build when a change makes things worse.",
    proof: [
      {
        value: "3,602",
        label: "files scanned",
        note: "tanstack query repository, the showcase scan",
      },
      { value: "5,524", label: "commits indexed", note: "same scan" },
      { value: "1,141", label: "contributors mapped", note: "same scan" },
      {
        value: "0",
        label: "bytes sent off the machine",
        note: "loopback only, no telemetry",
      },
      {
        value: "140",
        label: "go tests, 49 unit and 7 browser tests",
        note: "race detector on, run on linux, macos and windows in ci",
      },
      {
        value: "12",
        label: "languages counted, 11 with import graphs",
        note: "plus six dependency manifest formats",
      },
    ],
    problem:
      "Understanding an unfamiliar codebase means juggling five tools with five output formats, and some of them want your source uploaded.",
    approach: [
      {
        title: "An interface built for exploration",
        body: "A survey-map visual identity, a repository switcher and grouped navigation connect seventeen views: overview, activity, commits, contributors, knowledge, branches, files, search, metrics, hotspots, duplicates, architecture, change coupling, dependencies, portfolio and more. Light, dark and system themes, keyboard operation and layouts down to 390 pixels carry the same interface across screens.",
      },
      {
        title: "History with the right clock, and the right names",
        body: "Commit calendars, hour-of-week activity and streaks use each author's local time. Ownership is computed from the files each commit touched, following renames, with identities merged through .mailmap and bots never counted as owners. Knowledge pages show the bus factor and the largest files whose main author has gone quiet.",
      },
      {
        title: "Findings you can trace",
        body: "Architecture graphs collapse imports to folders at a chosen depth and flag cycles, unused folders and possibly dead files. Hotspots rank files by complexity times change frequency. Change coupling finds file pairs that keep changing together and explains each pair by an import, a shared package or a test, or flags it as a hidden dependency. Graphs export as SVG.",
      },
      {
        title: "A scan you can watch and control",
        body: "Eight ordered stages stream and batch-insert files, history, dependencies, imports, coupling and duplicate blocks, then build an FTS5 content index. Persisted jobs report progress over WebSocket, support pause, resume and cancel, and re-queue after a crash. Results are promoted in one transaction, so a failed rescan leaves the old ones, and only new commits are diffed on a rescan.",
      },
      {
        title: "The same engine in CI",
        body: "repo-scout scan prints text, JSON or SARIF for GitHub code scanning, with gates on complexity, duplicates, cycles and hidden coupling. With a base ref it judges a pull request instead of the whole repository: files added, complexity moved, cycles introduced or resolved, gated on the increase. Exit codes say which.",
      },
      {
        title: "Never leaves the machine",
        body: "No account, external APIs, telemetry or source uploads. The server binds to loopback, checks the Host header against DNS rebinding, accepts state changes as JSON only and holds the WebSocket to the same origin. Releases ship checksums, a software bill of materials and signed build provenance instead of a code signature.",
      },
    ],
    highlights: [
      "One binary for six platforms with the interface embedded, 70 days from first commit to v1.0.0",
      "Folder-level architecture maps, hotspots, bus factor and hidden coupling",
      "A scan command for CI with SARIF, quality gates and pull request comparison",
      "Atomic, incremental rescans with pause, resume, cancel and crash recovery",
      "Showcased on a real TanStack Query scan: 3,602 files, 5,524 commits and 1,141 contributors",
      "OpenAPI spec with contract tests, 31 paths",
    ],
    decisions: [
      {
        chose: "the git command line through os/exec",
        over: "a Go git library",
        why: "git already knows every edge case of its own history and is on every developer's machine. Output is streamed line by line into SQLite and cached, so the cost is a process boundary, not a second implementation of git.",
      },
      {
        chose: "pure-Go SQLite with CGO off",
        over: "the C SQLite binding",
        why: "No C toolchain means one build cross-compiles for six targets and the FTS5 content index still works. The price is some raw speed on huge repositories.",
      },
      {
        chose: "loopback only, with no authentication",
        over: "a login screen",
        why: "It is a single-user tool, and the database holds a full-text index of your source. Binding to localhost, checking the Host header and refusing cross-site form posts protect it better than a password would. The docs say what exposing the address would expose.",
      },
      {
        chose: "promoting scan results in one transaction",
        over: "updating rows in place",
        why: "A scan that fails halfway must not leave a half-truth. Results are written under a staging id and swapped in only when every stage succeeds.",
      },
      {
        chose: "unsigned binaries with signed provenance",
        over: "paying for code-signing certificates",
        why: "Checksums, a software bill of materials and GitHub build attestations let anyone verify what built the archive and from which commit. macOS asks you to clear the quarantine flag once.",
      },
    ],
    install: [
      {
        label: "download a release",
        command:
          "gh release download --repo KhaledSaeed18/repo-scout --pattern '*_darwin_arm64.tar.gz' && tar -xzf repo-scout_*_darwin_arm64.tar.gz && ./repo-scout",
        note: "serves localhost:8080; linux and windows archives on the release page",
      },
      {
        label: "verify what built it",
        command:
          "gh attestation verify repo-scout_*_darwin_arm64.tar.gz --repo KhaledSaeed18/repo-scout",
      },
      {
        label: "gate a pipeline",
        command:
          "repo-scout scan . --max-complexity 150 --max-duplicates 20 --fail-on cycles,hidden-coupling",
        note: "go install github.com/KhaledSaeed18/repo-scout/cmd/repo-scout@latest for ci",
      },
    ],
    timeline: [
      {
        date: "2026-08-01",
        title: "First commit",
      },
      {
        date: "2026-10-09",
        title: "The redesign",
        body: "New pages, a brand kit, loopback by default, contributing and security docs, and the TanStack Query showcase.",
      },
      {
        date: "2026-10-10",
        title: "v1.0.0",
        body: "The single binary for six targets, the scan command with SARIF and gates, pull request comparison, hotspots, knowledge, change coupling, portfolio, trends, atomic rescans, migrations, OpenAPI contract tests and signed provenance.",
      },
    ],
    faq: [
      {
        q: "Does any code or data leave my machine?",
        a: "No. There is no telemetry and no outbound access. Results live in a local SQLite file, and the server answers only on loopback. Treat that file as being as sensitive as the repositories you scan, because it holds a content index of them.",
      },
      {
        q: "Can I run it in CI without the web interface?",
        a: "Yes. Install the binary with go install and run the scan command with SARIF output, which uploads to GitHub code scanning. A failed gate exits with code 1.",
      },
      {
        q: "How does it judge a pull request rather than the whole repository?",
        a: "Pass the base ref. It extracts the base read-only with git archive and reports files added and removed, complexity that moved, cycles introduced or resolved and dependency changes, with gates on the increase.",
      },
      {
        q: "What happens if a rescan is interrupted?",
        a: "Nothing is lost. Results are promoted only when every stage succeeds, and a crash re-queues the job on the next launch.",
      },
      {
        q: "Can I go back to an older version?",
        a: "The database is migrated forward and an older version refuses to open it, so copy the database file before upgrading.",
      },
    ],
    related: ["dir-analysis-tool", "osreflog"],
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
    updatedAt: "2026-10-19",
    tagline:
      "Break reminders delivered by a small desktop character that knows when to stay quiet.",
    summary:
      "Instead of a notification you swipe away on reflex, a character slides in from a screen corner, says one short thing, and leaves. It holds reminders during calls, full screen video, a locked screen or a calendar event and delivers them one at a time once the moment clears. Reminders are typed in plain words: water every 45 minutes, stretch at 3pm on weekdays.",
    year: 2026,
    group: "macos",
    kind: "macOS app",
    object: "bubble",
    stock: "bone",
    stack: ["Swift", "SwiftUI", "AppKit", "EventKit", "Swift Testing"],
    repo: "baud",
    links: [{ label: "Source", href: gh("baud") }],
    platform: "macOS 14 or later, Apple Silicon or Intel",
    audience: "anyone who sits at a Mac for too long and ignores banners",
    plain:
      "Most break reminders are banners you dismiss without reading, and they arrive in the middle of a call. Baud is a tiny animated character that slides in at the corner of the screen to remind you to stand up, drink water or rest your eyes, and waits if you are on a call, watching something full screen or in a meeting. No streaks, no guilt.",
    proof: [
      {
        value: "85",
        label: "automated tests",
        note: "scheduler, preferences, the plain-words parser, suppression and presets",
      },
      {
        value: "5",
        label: "reasons to hold a reminder",
        note: "locked screen, camera or mic in use, full screen, away, and optionally a calendar event",
      },
      {
        value: "1",
        label: "permission it can ask for",
        note: "calendars, only if you turn on the meeting-aware hold",
      },
      {
        value: "0",
        label: "bytes sent anywhere",
        note: "the plain-words parser is deterministic and local; no ai, no network",
      },
    ],
    problem:
      "Break reminders are banners you dismiss without reading, and they interrupt at the worst moments. The apps that solve this with a character are paid and closed.",
    approach: [
      {
        title: "Never at a bad moment",
        body: "No reminders while the camera or microphone is in use, a window is full screen, the screen is locked or you are away, and optionally while a calendar event is on. Held reminders queue in order and drain one at a time; the queue is never flushed, because nobody wants four characters in a row after a meeting.",
      },
      {
        title: "The moment after",
        body: "When a long call or full-screen stretch ends, a reminder that was nearly due arrives right then. Coming back from a real break restarts every interval, so you are not told to move five minutes after you did.",
      },
      {
        title: "Reminders in plain words",
        body: "Press a global shortcut anywhere and type water every 45 minutes, call Tom at 3 or stretch at 3pm on weekdays. A deterministic on-device parser turns it into a repeating, one-time or weekday reminder with its own mood. Presets retune the four built-ins in one click.",
      },
      {
        title: "Never guilts you",
        body: "No streaks, no sad faces. Ignore it and it leaves on its own after a few seconds. Quiet hours, per-reminder active hours, snooze and a minimum gap between appearances keep it from nagging.",
      },
      {
        title: "Three layers, one seam",
        body: "The scheduler decides when and never touches AppKit, the presenter decides how it looks and never decides timing, and reminders are plain data in a documented JSON file you can hand-edit. The character, the app icon and the menu bar mark are drawn from the same geometry in code.",
      },
    ],
    highlights: [
      "Free and open source, unlike every comparable app with a character",
      "Plain-words quick add with a global shortcut, no AI and no network",
      "Holds for calls, full screen, lock, idle and optional calendar events",
      "One-time, weekday and repeating reminders, presets and quiet hours",
      "Native Swift, menu bar only, hand-editable reminders.json",
    ],
    decisions: [
      {
        chose: "holding reminders and draining them one at a time",
        over: "flushing the queue when a meeting ends",
        why: "This is the single behaviour the app is built around. A flush delivers four characters in a row; a queue keyed by original due time delivers one, then the next after the gap.",
      },
      {
        chose: "reading camera and microphone state",
        over: "asking for camera or microphone permission",
        why: "Baud never captures anything. It reads whether another app has a device running through CoreMediaIO and CoreAudio, so call detection works with no permission prompt.",
      },
      {
        chose: "a deterministic parser for quick add",
        over: "a language model",
        why: "Water every 45 minutes has a small grammar. A local parser is instant, private, testable with fifteen fixed cases and never wrong in a creative way.",
      },
      {
        chose: "a code-drawn character and icon",
        over: "an asset pipeline",
        why: "The character, the app icon and the menu bar template share one geometry, so there is nothing to keep in sync. Personality comes from motion: a 400 ms slide-in that becomes a fade under Reduce Motion.",
      },
    ],
    install: [
      {
        label: "build and run in xcode",
        command: "git clone https://github.com/KhaledSaeed18/baud.git && cd baud && open Baud.xcodeproj",
        note: "xcode 16 or later, macos 14 or later",
      },
      {
        label: "run the tests",
        command:
          "xcodebuild test -project Baud.xcodeproj -scheme Baud -destination 'platform=macOS'",
      },
    ],
    timeline: [
      {
        date: "2026-07-23",
        title: "First commit",
        body: "The reminder model, the scheduler, the character presenter and the hold-not-drop queue.",
      },
      {
        date: "2026-07-24",
        title: "Quick add and holds",
        body: "Settings, snooze, quiet hours, calendar hold, presets, one-time and weekday reminders, and the plain-words parser with its global shortcut.",
      },
      {
        date: "2026-07-25",
        title: "The moment after",
        body: "A nearly due reminder delivered when a bad moment clears, and preferences with injectable defaults.",
      },
    ],
    faq: [
      {
        q: "Does Baud need camera or microphone permission to detect calls?",
        a: "No. It does not capture anything. It reads whether another app has the camera or microphone running, which needs no permission.",
      },
      {
        q: "Does anything leave my Mac?",
        a: "No. There is no network use. The calendar is read on the device only when you enable the meeting-aware hold, and nothing is stored from it.",
      },
      {
        q: "Can I edit reminders by hand?",
        a: "Yes. They live in a JSON file under Application Support with a documented, stable schema. Quit Baud first so the editor does not overwrite your changes; a malformed file falls back to the built-ins without being overwritten.",
      },
      {
        q: "Is there a download?",
        a: "Not yet. Clone the repository, open the Xcode project and run it. It runs on Apple Silicon and Intel Macs on macOS 14 or later.",
      },
    ],
    related: ["wakehold", "sever", "gauge"],
  },
  {
    slug: "urljail",
    name: "urljail",
    updatedAt: "2026-10-19",
    tagline:
      "Opens a link you don't trust inside a throwaway microVM and reports what the page actually does.",
    summary:
      "urljail restores a Firecracker microVM from a snapshot, opens the URL in sandboxed Chrome and records the visit from two sides: the browser through the DevTools Protocol, and the host through eBPF, its own DNS resolver and the firewall. The report covers redirects, DNS, TLS SNI, forms, screenshots and phishing indicators scored against six blind held-out sets, then the VM is destroyed. It is in active development on my Linux machine.",
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
      {
        label: "Decisions",
        href: `${gh("urljail")}/tree/main/docs/decisions`,
      },
    ],
    status: "In active development",
    featured: true,
    platform: "Linux with KVM, cgroups v2 and BTF; developed on Fedora 44",
    audience: "security teams triaging reported links, and anyone who wants to see what a page does before a person does",
    plain:
      "Someone sends you a link and you are not sure it is safe. urljail opens it inside a tiny throwaway virtual computer that is destroyed afterwards, and writes down everything the page tried to do: where it redirected, what it asked for, what it looked like. You never have to open the link yourself, and the page cannot tell it is being watched.",
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
        value: "6,400",
        label: "stored runs replayed per rule",
        note: "every new indicator is checked against them for false alarms",
      },
      {
        value: "62%",
        label: "of phishing pages flagged, blind",
        note: "23 of 37 in the sixth held-out set, 7 false alarms on 91 others",
      },
      {
        value: "19",
        label: "decision records in 7 days",
        note: "132 commits from 10 to 16 oct 2026",
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
        body: "Each VM sits in its own network namespace with no route to the host, the LAN or cloud metadata addresses. Live traffic leaves only through a WireGuard tunnel in a separate namespace, so if the tunnel drops there is no route at all. The daemon refuses to serve until its own isolation self-test passes. During a two-minute tunnel outage, 93 URLs were refused, as designed.",
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
        body: "Browser countermeasures are switchable snapshot profiles, so the same URL opens under up to six of them at once. On 172 fresh candidates from Certificate Transparency logs, only the HeadlessChrome User-Agent ever changed what a site showed, and every case was infrastructure such as Cloudflare's bot challenge, not a phishing kit.",
      },
      {
        title: "Indicators scored against labels",
        body: "Report indicators flag details forms on free hosting, brand lures, fake human checks and phishing kits recognised by page structure. Each rule is scored against 498 labelled pages and six blind held-out sets from live feeds, then replayed across every stored run to count false alarms before it stays. A rule that fired on nothing was removed.",
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
      "Indicators held to blind sets: 62% of phishing pages flagged in the latest, kits matched 5 of 5",
      "In active development; the live gate and the control plane are done",
    ],
    decisions: [
      {
        chose: "restoring a snapshot on demand",
        over: "a pool of pre-warmed VMs",
        why: "A restore takes a quarter of a second, which made the pool and its bookkeeping unnecessary. Clone safety needed real work instead: the kernel clock and the VM generation id reseed each clone, and 25 of 25 TLS ClientHello randoms came out distinct.",
      },
      {
        chose: "TLS visibility through Chrome's key log",
        over: "a man-in-the-middle proxy",
        why: "A proxy changes the TLS fingerprint, and fingerprinting is exactly what cloaking looks at. The key log ships with the pcap, so traffic decrypts offline and the server saw a real Chrome.",
      },
      {
        chose: "a root daemon with unprivileged VMMs",
        over: "a rootless design",
        why: "Namespaces, nftables, eBPF and the jailer need root. The daemon keeps that privilege, every VMM runs as its own uid in a chroot, the report builder is an unprivileged child, and the parsers that face the guest are fuzzed.",
      },
      {
        chose: "a VPN exit in its own network namespace",
        over: "egress from the home connection",
        why: "The guest saw the VPN's address and never the home address, and when the tunnel is down there is no route at all. One datacenter exit is a known limit of the cloaking study.",
      },
      {
        chose: "indicators without a verdict",
        over: "a phishing classifier in the core",
        why: "The tool reports behaviour and scored heuristics; deciding is downstream. Every rule carries its in-sample and held-out numbers, and false alarms are listed rather than tuned away.",
      },
    ],
    install: [
      {
        label: "build the daemon and the cli",
        command: "make build && make test && make fuzz",
        note: "go 1.27, firecracker 1.17, kvm, clang, nft, unbound and wireguard tools",
      },
      {
        label: "open a link in a throwaway vm",
        command: "urljail detonate https://suspicious.example",
        note: "only after the isolation tests and the live gate pass on your machine",
      },
      {
        label: "bring up the dashboard, no root",
        command: "control-plane/scripts/setup.sh",
        note: "postgres and redis as podman quadlets; dashboard at 127.0.0.1:7800",
      },
    ],
    timeline: [
      {
        date: "2026-10-10",
        title: "First commit",
      },
      {
        date: "2026-10-12",
        title: "Live gate passed",
        body: "Hand boot, the vertical slice, the network layer with eBPF SNI capture, snapshot restore at 202 ms, the jailer and SELinux, then WireGuard-only egress with the development sudo rule removed.",
      },
      {
        date: "2026-10-13",
        title: "Cloaking study published",
        body: "172 fresh URLs under five or six profiles: only the User-Agent ever mattered.",
      },
      {
        date: "2026-10-14",
        title: "Control plane done",
        body: "NestJS, Postgres and BullMQ behind a Next.js dashboard, HAR export, perceptual-hash similarity and the first indicators.",
      },
      {
        date: "2026-10-16",
        title: "Six held-out sets",
        body: "Gate, lure and kit rules scored blind on four more sets, 137 kit references, 6,400 stored runs replayed per rule.",
      },
    ],
    faq: [
      {
        q: "Is it safe to run?",
        a: "It is designed to fail closed: each VM has no route to the host, the LAN or metadata addresses, live traffic leaves only through a WireGuard tunnel in another namespace, and the daemon refuses to serve until its isolation self-test passes. The README still says not to open live phishing until those tests pass on your machine.",
      },
      {
        q: "Does it need root?",
        a: "The daemon runs as root as a systemd service. Every VMM runs as its own unprivileged user in a chroot, the report builder is unprivileged, and the whole dashboard runs as you.",
      },
      {
        q: "Which hardware and distribution?",
        a: "Linux with KVM, cgroups v2 and BTF, on bare metal. It is developed on Fedora 44 with SELinux enforcing, on a four-core laptop with 7 GiB of memory running three VMs at once. It is built from source; there is no package yet.",
      },
      {
        q: "Can a page tell it is being watched?",
        a: "Measured rather than assumed. On 172 fresh candidates, only the HeadlessChrome User-Agent changed what a site showed, and the sites that reacted were infrastructure like Cloudflare, not phishing kits. One exit and one Chrome version are stated limits.",
      },
      {
        q: "Does it decide whether a link is phishing?",
        a: "No. It reports what the page did plus heuristic indicators with their blind-set scores. The verdict belongs to whoever reads the report.",
      },
    ],
    related: ["osreflog", "drainscope", "jwt-toolkit", "patchgrid"],
  },
  {
    slug: "osreflog",
    name: "osreflog",
    updatedAt: "2026-10-19",
    tagline:
      "A reflog for a Linux system: what changed, who changed it, and which change broke it.",
    summary:
      "osreflog records every change to a Fedora system together with its cause: the package transaction, service, command or app that made it. It rebuilds the system as it was at any point, bisects a regression down to a single cause by testing each step in a throwaway container, a VM or a one-shot reboot on real hardware, and undoes that cause file by file. Version 0.2.0 ships from COPR with a GNOME app, and the 48-hour soak is running.",
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
      "GTK",
      "libadwaita",
    ],
    repo: "osreflog",
    links: [
      { label: "Source", href: gh("osreflog") },
      {
        label: "Fedora COPR",
        href: "https://copr.fedorainfracloud.org/coprs/khaledsaeed18/osreflog/",
      },
      { label: "v0.2.0 release", href: `${gh("osreflog")}/releases/tag/v0.2.0` },
      { label: "Roadmap", href: `${gh("osreflog")}/blob/main/docs/roadmap.md` },
      {
        label: "Architecture",
        href: `${gh("osreflog")}/blob/main/docs/architecture.md`,
      },
      {
        label: "Validation",
        href: `${gh("osreflog")}/blob/main/docs/validation.md`,
      },
    ],
    status: "v0.2.0 on COPR, in active development",
    featured: true,
    platform: "Fedora 44, 45 or rawhide on x86_64 with the root filesystem on btrfs",
    audience: "Linux users and admins who know it worked last week, and want to know what changed",
    plain:
      "When a Linux computer breaks, you usually know one thing: it worked last week. osreflog keeps a running record of every change to the system and what caused it, so it can show the exact change responsible, test each suspect in a throwaway copy until it finds the one that broke things, and safely put that one back.",
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
      {
        value: "3 probes",
        label: "to find a real wi-fi regression on metal",
        note: "6 reboots, default boot entry checksummed untouched after each",
      },
      {
        value: "0.08%",
        label: "of one cpu at rest",
        note: "the daemon on 17 oct 2026; a checkpoint adds under a second to dnf",
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
        body: "log, show, diff, why, bisect and undo work on causes, and references read like git's reflog: c42, @{1}, @{boot-1}, @{yesterday}. Diffs are computed after each checkpoint and cached, so the diff after a real dnf transaction comes back in 6 ms.",
      },
      {
        title: "Bisect down to one cause, in three tiers",
        body: "Snapshots are coarse, so osreflog rebuilds the states between them by replaying causes into a writable clone. Each step is tested in a throwaway systemd-nspawn container in under a second, in a QEMU VM that boots the clone's own kernel over virtiofs in about 14 seconds, or, for regressions that only show on real hardware, by one reboot into a one-shot boot entry. Every replay says whether it was exact or approximate.",
      },
      {
        title: "Undo without rolling back",
        body: "osreflog undo reverts one cause path by path as a 3-way merge, leaving alone anything that changed since and refusing on conflict. Package causes are handed to dnf. Dry run is the default, a checkpoint is taken before every apply, replaced files go to an attic, and an undo can itself be undone. GNOME settings get the same treatment through dconf.",
      },
      {
        title: "Observe before touching",
        body: "Nothing wrote to the live root until a write gate passed: the full undo matrix in a contained scratch root, with symlink-swap races and magic links refused by openat2 resolution, 3,541 race runs and no escape. Metal probes waited for a boot gate tested in a nested VM first, with a boot doctor checking the default entry at every boot. Config parsers run in a sandboxed worker and were each fuzzed for an hour. Secrets are never stored and command lines are redacted.",
      },
      {
        title: "A desktop app, packaged and hardened",
        body: "A GTK and libadwaita app browses history, shows what changed since, previews an undo and walks a bisect, with search, coloured diffs and toasts. Signed COPR packages cover Fedora 44, 45 and rawhide, and were installed on a fresh Fedora 44 VM with every check passing. Version 0.2.0 added system call filters, a sandboxed user agent and an SELinux module; systemd rates the user agent's exposure at 1.0, down from 8.0.",
      },
      {
        title: "Cheap enough to leave on",
        body: "The daemon uses 0.08% of one CPU at rest and a checkpoint adds under a second to a dnf transaction. Memory sits around 41 MB just started and grows with big diffs, capped by a 768 MB unit limit. The ledger is local, root-only SQLite with a hash chain, so tampering is evident. A 48-hour soak started on 17 October; its result is not published yet.",
      },
    ],
    highlights: [
      "Every change to /etc and system state recorded with its cause",
      "A live fanotify and eBPF witness reconciled with btrfs send-stream diffs",
      "Cause-level bisect in containers, in VMs that boot the snapshot's kernel, or on real hardware",
      "3-way undo that refuses on conflict, dry run by default, undoable itself",
      "5 of 5 seeded regressions found within the probe bound; a real regression found on metal in 3 probes",
      "v0.2.0 installable from COPR on Fedora 44, 45 and rawhide, with a GNOME app",
    ],
    decisions: [
      {
        chose: "two witnesses that can disagree",
        over: "a live recorder alone, or snapshots alone",
        why: "A live recorder has silent gaps whenever it is stopped. Snapshots know what changed but not who. The send-stream diff is the truth for what and the fanotify and eBPF trace is the truth for who, and a disagreement is reported as a gap rather than hidden.",
      },
      {
        chose: "parsing the btrfs send stream in its own crate",
        over: "btrfs subvolume find-new",
        why: "find-new misses every deletion. The stream parser sees creates, deletes, renames and content, and diffs are computed eagerly after each checkpoint so a later query costs milliseconds.",
      },
      {
        chose: "undo per cause as a 3-way merge",
        over: "rolling the whole subvolume back",
        why: "A rollback also reverts logs, VM images and every unrelated change since. Reverting one cause path by path leaves later work alone and refuses on conflict. Package causes go to dnf, which needs the old packages to still be downloadable.",
      },
      {
        chose: "three bisect tiers, cheapest first",
        over: "always rebooting",
        why: "A container probe takes under a second and a VM probe about fourteen; a reboot takes minutes and touches the boot loader. The tool uses the cheapest tier that reproduces the problem, and every replay says whether it was exact.",
      },
      {
        chose: "a tamper-evident ledger",
        over: "a tamper-proof one",
        why: "A root attacker can rewrite anything on the machine, including a hash chain. The chain makes rewriting visible, which is the honest claim; the threat model says so in those words.",
      },
    ],
    install: [
      {
        label: "install from copr",
        command:
          "sudo dnf copr enable khaledsaeed18/osreflog && sudo dnf install osreflog osreflog-app",
        note: "fedora 44, 45 or rawhide, root on btrfs",
      },
      {
        label: "start the daemon and the boot doctor",
        command:
          "sudo systemctl enable --now osreflogd.service osreflog-boot-doctor.service && systemctl --user enable --now osreflog-user.service",
      },
      {
        label: "check the setup, then ask what changed",
        command: "osreflog doctor && osreflog log",
        note: "reading needs no password; checkpoint, undo and bisect ask through polkit",
      },
    ],
    timeline: [
      {
        date: "2026-10-14",
        title: "Planning closed",
        body: "Scope, the two-witness design and the gates written down before code.",
      },
      {
        date: "2026-10-15",
        title: "Witnesses, causes, undo and bisect",
        body: "The state witness, the live witness with cause attribution, semantic diffs, the write gate, undo, and bisect in containers and VMs, one phase after another.",
      },
      {
        date: "2026-10-16",
        title: "v0.1.0 and the boot gate",
        body: "Metal bisect behind a boot gate passed in a nested VM, then a real Wi-Fi power-save regression found on the laptop in three probes. First release on COPR for Fedora 44.",
      },
      {
        date: "2026-10-17",
        title: "v0.2.0",
        body: "The GNOME app grows search, headers, toasts and coloured diffs; system call filters, a sandboxed user agent and an SELinux module; CI and a release workflow. A 48-hour soak begins.",
      },
    ],
    faq: [
      {
        q: "Does it need root?",
        a: "The daemon runs as root with a capability bounding set, system call filters, a memory cap and no network at all. Reading history needs no password for the person at the machine. Checkpoint, undo and bisect ask for the admin password through polkit every time.",
      },
      {
        q: "Which systems does it support?",
        a: "Fedora 44, 45 and rawhide on x86_64 with the root filesystem on a btrfs subvolume, which is the Workstation default. Immutable systems like Silverblue, and anything not on btrfs, are out of scope. It warns if Snapper or Timeshift manage the same root.",
      },
      {
        q: "Can undo make things worse?",
        a: "It is a dry run by default. An apply takes and verifies a checkpoint first, never overwrites a file that changed since, refuses on conflict, moves replaced files to an attic, and can itself be undone. The write gate ran the full undo matrix in a scratch root with 3,541 race attempts and no escape.",
      },
      {
        q: "What happens to my secrets?",
        a: "They are never stored. Shadow, Wi-Fi and VPN credentials and private keys are recorded as changed with a hash only, password-style keys and command-line secrets are redacted, and nothing leaves the machine.",
      },
      {
        q: "What is not validated yet?",
        a: "A real week of history in the app, the 48-hour soak result, replay soundness in edge cases, and hardware other than one Intel laptop. The validation document lists each of these.",
      },
    ],
    related: ["drainscope", "urljail", "repo-scout"],
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
