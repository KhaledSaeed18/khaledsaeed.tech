import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} — ${siteConfig.role}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Static social card in the brand's dark palette, independent of viewer theme.
export default function OpengraphImage() {
  const bg = "#1A1715"
  const bone = "#F5F1EA"
  const accent = "#D9634A"
  const muted = "#8C8580"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="96" height="96" viewBox="0 0 100 100">
            <g
              fill="none"
              stroke={accent}
              strokeWidth={11}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1={38} y1={28} x2={38} y2={72} />
              <polyline points="70,28 50,50 70,72" />
            </g>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 600,
              color: bone,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 28,
              fontSize: 40,
              color: accent,
            }}
          >
            {siteConfig.role.toLowerCase()}
            <span style={{ color: muted, margin: "0 16px" }}>/</span>
            <span style={{ color: muted }}>{siteConfig.location}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid ${accent}`,
            paddingTop: 28,
            fontSize: 30,
            color: muted,
          }}
        >
          <span>{siteConfig.url.replace("https://", "")}</span>
          <span>TypeScript / Node.js / System Design</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
