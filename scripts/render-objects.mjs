#!/usr/bin/env node
/**
 * Re-renders project object sprites from the dev-only /studio route.
 *
 *   pnpm dev                                  # in another terminal
 *   node scripts/render-objects.mjs           # all objects
 *   node scripts/render-objects.mjs key cap   # just these
 *
 * Writes public/objects/<kind>.png: a 16-frame, 1-bit transparent strip the
 * site uses as a CSS mask, and public/og/<slug>.png: frame 0 at 4x in the
 * project's ink, for its social card. Needs Google Chrome and a dev server on
 * :3000 (override with STUDIO_URL).
 */
import { spawn } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { crc32, deflateSync } from "node:zlib"

/** Minimal PNG writer: 1-bit palette, index 0 transparent, index 1 = ink (white by default). */
function png1bit(w, h, rows, ink = [255, 255, 255]) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(td) >>> 0)
    return Buffer.concat([len, td, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([1, 3, 0, 0, 0], 8) // bit depth 1, palette color
  const stride = Math.ceil(w / 8)
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++)
    rows.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("PLTE", Buffer.from([0, 0, 0, ...ink])),
    chunk("tRNS", Buffer.from([0, 255])),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

const ALL = [
  "grid",
  "layers",
  "cards",
  "toolbox",
  "cap",
  "key",
  "hourglass",
  "lens",
  "folder",
  "square",
  "scissors",
  "bubble",
  "bulb",
  "battery",
  "chip",
  "globe",
  "moon",
  "padlock",
]
const objs = process.argv.slice(2).length ? process.argv.slice(2) : ALL
const base = process.env.STUDIO_URL ?? "http://localhost:3000"
const chromeBin =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

// Card inks per stock (keep in sync with --ink-* in app/globals.css).
const INKS = { terracotta: [43, 13, 6], teal: [4, 32, 30], bone: [26, 23, 21], stone: [27, 24, 21] }
// slug, object and stock of every project, read straight from the content file
const projects = [
  ...readFileSync("lib/content/projects.ts", "utf8").matchAll(
    /slug: "([^"]+)",[\s\S]*?object: "([^"]+)",\s*stock: "([^"]+)"/g
  ),
].map(([, slug, object, stock]) => ({ slug, object, stock }))

/** Frame 0 of a strip, scaled up by `k` with hard pixel edges, as packed rows. */
function firstFrame(bits, k) {
  const { w, h } = bits
  const fw = h // frames are square
  const src = Buffer.from(bits.data, "base64")
  const sStride = Math.ceil(w / 8)
  const ow = fw * k
  const oStride = Math.ceil(ow / 8)
  const out = Buffer.alloc(oStride * h * k)
  for (let y = 0; y < h * k; y++)
    for (let x = 0; x < ow; x++) {
      const sx = Math.floor(x / k)
      const sy = Math.floor(y / k)
      if (src[sy * sStride + (sx >> 3)] & (0x80 >> (sx & 7))) out[y * oStride + (x >> 3)] |= 0x80 >> (x & 7)
    }
  return { w: ow, h: h * k, rows: out }
}

const port = 9200 + Math.floor(Math.random() * 500)
const profile = mkdtempSync(join(tmpdir(), "studio-"))
const chrome = spawn(
  chromeBin,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--headless",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" }
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let targets
for (let i = 0; i < 50 && !targets?.length; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
  } catch {
    await sleep(200)
  }
}
const ws = new WebSocket(
  targets.find((t) => t.type === "page").webSocketDebuggerUrl
)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d)
    pending.delete(d.id)
  }
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

try {
  for (const o of objs) {
    await send("Page.navigate", { url: `${base}/studio?obj=${o}` })
    let bits = null
    for (let i = 0; i < 80 && !bits; i++) {
      await sleep(250)
      bits = (
        await send("Runtime.evaluate", {
          expression: "window.__bits || null",
          returnByValue: true,
        })
      ).result?.result?.value
    }
    if (!bits) throw new Error(`studio did not render ${o}`)
    writeFileSync(
      join("public/objects", `${o}.png`),
      png1bit(bits.w, bits.h, Buffer.from(bits.data, "base64"))
    )
    console.log("wrote public/objects/%s.png", o)
    for (const p of projects.filter((p) => p.object === o)) {
      const f = firstFrame(bits, 4)
      writeFileSync(
        join("public/og", `${p.slug}.png`),
        png1bit(f.w, f.h, f.rows, INKS[p.stock])
      )
      console.log("wrote public/og/%s.png", p.slug)
    }
  }
} finally {
  ws.close()
  chrome.kill()
}
