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
- The logo mark (`components/flip-logo.tsx` and `app/icon.svg`) uses `square` line caps and a `miter` join, never `round`. Both files share one geometry: stem at x 35.5, chevron `70.5,28 50.5,50 70.5,72`, stroke 11. The chevron must stay detached from the stem in both the `|<` and the flipped `|>` state, so check both if you change the geometry or the stroke. After editing `app/icon.svg`, re-render the PNGs: `rsvg-convert -w 180 -h 180 app/icon.svg -o app/apple-icon.png` and `rsvg-convert -w 512 -h 512 app/icon.svg -o public/icon-512.png`.

## Headings stack above their text

Section and page headings sit on their own line with the lede directly below, both at full container width. Do not put a heading and its description in side-by-side columns. `PageIntro` (`components/print/page-intro.tsx`) and `Sheet` (`components/print/sheet.tsx`) already do this; use them instead of hand-rolling a header.

## Page frame, rails and rules

Every page sits in one frame. Two dotted vertical rails mark its edges from the top of the window to the bottom, and section rules run the full screen width across them.

- Use the `frame` utility for every top-level container (and `frame-narrow` for a reading column, as on articles). Never hand-roll `mx-auto max-w-* px-*` for a page block. `frame` only works on blocks that span the page width, because its margins are percentages of the page.
- The numbers live in `app/globals.css` as tokens: `--frame-max` (72rem), `--frame-narrow` (48rem), `--gutter` (screen edge to rail: 16, 24, 32px at base, sm, lg) and `--frame-pad` (rail to content: 20, 32, 40px). Change them there, never per page.
- The rails are one fixed `.rails` element in `app/layout.tsx`. Nothing else draws them.
- `Rule` (`components/print/sheet.tsx`) is the horizontal perforation under every section label and the header. It always runs edge to edge, wherever it is placed. Use it for section-level lines only; lines inside content (list separators) stay `border-dashed` at content width.
- Every `Rule` draws a registration mark (+) where it crosses each rail. The marks are positioned from the rule's own box, so a `Rule` must sit directly on a `frame` content edge (not inside a narrower column or `frame-narrow`). A rule that spans the whole page, like the header's, uses `<Rule edge />`. If a layout needs a rule somewhere else, move the rule into a `frame` instead of adjusting the marks.
- Anything that needs to reach the rails, like a horizontal scroller on mobile, bleeds by exactly `--frame-pad` (`mx-[calc(var(--frame-pad)*-1)] px-(--frame-pad)`), never past the rails.
- `header`, `main` and `footer` clip horizontal overflow (`overflow-x: clip`), which keeps full-width rules from scrolling the page sideways. Do not move that clip to `html`: browsers treat it as `hidden` there, and phones zoom out to fit.

## Dev server gotcha

Turbopack dev does not hot-reload changes to the Tailwind theme in `app/globals.css`. Restart `pnpm dev` after editing it, or you will be looking at stale CSS.
