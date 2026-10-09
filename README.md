# khaledsaeed.tech

Personal portfolio site, built with Next.js, React, TypeScript, and Tailwind CSS.

## What it is

This project powers [khaledsaeed.tech](https://khaledsaeed.tech). The whole site is designed as a 1-bit print run: every section is a "sheet" with a spec label and crop marks, pages print in and dissolve through a 4x4 Bayer dither, and each project is printed on colored card stock with its own dithered 3D object.

- `/` hero with the live dithered self-portrait, selected work, stack datasheet, writing, contact
- `/work` and `/work/[slug]` a case study per project
- `/about` background, education, credentials, principles
- `/writing` and `/writing/[slug]` articles pulled from DEV (canonical links point back to DEV)
- `/contact`
- `/llms.txt`, `/writing/rss.xml`, `/sitemap.xml` for answer engines, readers and crawlers

## Tech Stack

- Next.js 16 (App Router, view transitions)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint and Prettier

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `pnpm dev` start the local dev server
- `pnpm build` build the production app
- `pnpm start` start the production server
- `pnpm lint` run ESLint
- `pnpm format` format TypeScript files with Prettier
- `pnpm typecheck` run the TypeScript compiler without emitting output

## Content

Everything on the site is single-sourced in `lib/content`:

- `projects.ts` projects and case study copy
- `profile.ts` bio, education, credentials, stack, principles

Live data is fetched at build time and revalidated daily: articles from the DEV API (`lib/data/devto.ts`) and project star counts from GitHub (`lib/data/github.ts`). Set `GITHUB_TOKEN` for a higher GitHub rate limit; without it star counts are simply omitted.

## The dither system

- `app/dither.css` holds the 17 Bayer mask levels, the print-in reveal (`data-reveal`), the page-to-page dissolve and the object sprite animation.
- `components/dither-character.tsx` is the portrait: a signed distance field raymarched in one fragment shader, with adaptive quality tiers and a static fallback (`public/character.png`) when WebGL2 or hardware acceleration is missing.

### Project objects

Each project's object is a 16-frame, 1-bit sprite in `public/objects`, rendered from signed distance fields in the dev-only `/studio` route (`components/studio/object-studio.tsx`). To change or add one, edit the SDF there, then with `pnpm dev` running:

```bash
node scripts/render-objects.mjs          # all objects
node scripts/render-objects.mjs key cap  # only these
```

Useful dev-only query params on the home page: `?shade` (no dither), `?zoom` (head close-up), `?still` (skip the print-in), `?fallback` (the no-WebGL image), `?q=0|1|2` (force a quality tier).
