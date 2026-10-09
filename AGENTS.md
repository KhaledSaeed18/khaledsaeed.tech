<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design rules

## Square corners only

The site is a 1-bit print run, and paper is cut straight. Nothing has a border radius: cards, buttons, inputs, tooltips, code blocks, images, focus rings, OG images and icons are all square.

- Every radius token in `app/globals.css` (`--radius` and `--radius-xs` through `--radius-4xl`, in both `@theme inline` and `:root`) is `0`. Keep them at `0`; that is what keeps stock shadcn components square.
- Do not write `rounded-*` classes, `border-radius` in CSS, or `borderRadius` in inline styles and `next/og` images. Delete them from shadcn components you add (`pnpm dlx shadcn add ...` ships `rounded-lg`, `rounded-md` and similar).
- `rounded-full` and circular shapes are not allowed either. A dot or marker is a small square.
- App icons (`app/icon.svg`, `app/apple-icon.png`, `public/icon-512.png`) are full-bleed squares with no transparent corners. The OS may round them; we don't.

## Headings stack above their text

Section and page headings sit on their own line with the lede directly below, both at full container width. Do not put a heading and its description in side-by-side columns. `PageIntro` (`components/print/page-intro.tsx`) and `Sheet` (`components/print/sheet.tsx`) already do this; use them instead of hand-rolling a header.

## Dev server gotcha

Turbopack dev does not hot-reload changes to the Tailwind theme in `app/globals.css`. Restart `pnpm dev` after editing it, or you will be looking at stale CSS.
