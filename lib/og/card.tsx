import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

/**
 * Social cards in the same print language as the site: spec label, headline,
 * a density strip along the bottom, and the page's dithered art on the right.
 * Fonts are bundled (OFL) so cards render the same everywhere.
 */

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

const BG = "#1A1715"
const INK = "#EBE7E1"
const MUTED = "#A6A09A"
const BRAND = "#D9634A"

const fontsP = Promise.all([
  readFile(join(process.cwd(), "lib/og/fonts/HankenGrotesk.ttf")),
  readFile(join(process.cwd(), "lib/og/fonts/JetBrainsMono.ttf")),
])

async function dataUri(publicPath: string) {
  const buf = await readFile(join(process.cwd(), "public", publicPath))
  return `data:image/png;base64,${buf.toString("base64")}`
}

// 4x4 Bayer order, used to draw the density strip as real dithered tiles.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

function Tile({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", width: 16, height: 16 }}>
      {BAYER.map((b, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 4,
            background: b < level ? INK : "transparent",
          }}
        />
      ))}
    </div>
  )
}

export async function ogCard({
  eyebrow,
  title,
  subtitle,
  art,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  /** A PNG under /public, drawn on a stock-colored card, or bare when no stock. */
  art?: { src: string; stock?: string; width: number; height: number }
}) {
  const [hanken, mono] = await fontsP
  const artSrc = art ? await dataUri(art.src) : null

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: BG,
        padding: "64px 72px 56px",
        fontFamily: "Hanken",
        color: INK,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Mono",
            fontSize: 22,
            color: MUTED,
          }}
        >
          <span style={{ color: BRAND, marginRight: 14 }}>{"//"}</span>
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingRight: art ? 40 : 0,
          }}
        >
          <div
            style={{
              fontSize: title.length > 26 ? 64 : 84,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                marginTop: 22,
                fontSize: 30,
                lineHeight: 1.3,
                color: MUTED,
                maxWidth: 640,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[16, 14, 12, 10, 8, 6, 4, 2, 1].map((l) => (
            <Tile key={l} level={l} />
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: 18,
              fontFamily: "Mono",
              fontSize: 20,
              color: MUTED,
            }}
          >
            khaledsaeed.tech
          </div>
        </div>
      </div>

      {art && artSrc && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 490,
            height: "100%",
            background: art.stock ?? "transparent",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artSrc} width={art.width} height={art.height} alt="" />
        </div>
      )}
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Hanken", data: hanken, weight: 500, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    }
  )
}

export const stockHex: Record<string, string> = {
  terracotta: "#d9634a",
  teal: "#4f9590",
  bone: "#ebe7e1",
  stone: "#a6a09a",
}
