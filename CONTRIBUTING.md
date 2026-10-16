# Contributing

This repository powers [Khaled Saeed's personal portfolio](https://khaledsaeed.tech).
Bug fixes, accessibility improvements, performance improvements, broken-link reports, and
typo corrections are welcome. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Scope

Search the [existing issues](https://github.com/KhaledSaeed18/khaledsaeed.tech/issues) before
opening a new one. Use the bug-report form for website problems; a blank issue is available
for questions and suggestions.

Discuss substantial features, new dependencies, redesigns, and changes to personal writing,
biography, projects, or branding before implementing them. The portfolio owner decides its
content and design direction. Small fixes can go straight to a pull request.

Report vulnerabilities privately using [SECURITY.md](SECURITY.md). For work inquiries, use
the website's [contact page](https://khaledsaeed.tech/contact).

## Local setup

Fork and clone the repository, then use pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. Read [README.md](README.md) for the project structure and scripts
and [AGENTS.md](AGENTS.md) for the design rules. Use a Node.js version supported by the
installed Next.js release; its bundled documentation is in `node_modules/next/dist/docs/`.

`GITHUB_TOKEN` is optional for fetching public project star counts. Do not commit tokens or
local environment files. Article and star-count fetching can require network access.

## Make a focused change

- Preserve square corners, the shared page frame and rules, stacked headings, and existing
  motion patterns. Include reduced-motion behavior for motion changes.
- Keep keyboard navigation, visible focus, responsive layouts, and accessibility intact.
- Use the existing shared components and content sources. Avoid unrelated formatting or
  dependency updates; include lockfile changes when intentionally changing dependencies.
- Keep personal information and credentials out of issue attachments, logs, and patches.
- Review and understand any agent-generated code you submit.

For code changes, run:

```sh
pnpm lint
pnpm typecheck
pnpm build
```

For visual changes, also inspect affected pages on mobile and desktop, check keyboard and
reduced-motion behavior, and include screenshots. If print output is affected, inspect the
printed résumé. For documentation-only changes, check links, accuracy, and formatting.
Report any failed or skipped checks and why; do not describe unrun checks as passing.

## Open a pull request

Create a focused branch from `main` in your fork. Explain the problem, what changes for a
visitor or contributor, and how you verified it. Link the related issue if there is one.
A maintainer will review changes before merging; review and response times vary.

By contributing reusable code, you agree to license that contribution under the repository's
[MIT license](LICENSE). Personal content and assets are excluded as described in
[CONTENT_LICENSE.md](CONTENT_LICENSE.md). Submit only material you have the right to contribute.
