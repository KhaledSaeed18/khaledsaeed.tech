"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A WebGL field of the brand chevron. Each cell holds one ">" mark (the logo's
 * detached chevron); the marks rotate along an animated flow field and bend
 * toward the pointer. Strokes are drawn in the theme's foreground tone with a
 * scatter of terracotta accents, fading out toward the edges.
 *
 * No geometry buffers beyond a full-screen triangle — the field is entirely a
 * fragment shader, so there are zero per-instance draw calls and no heavy deps.
 * Falls back silently (renders nothing) where WebGL is unavailable, and renders
 * a single static frame under prefers-reduced-motion.
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;     // pixels, origin top-left; large negative when idle
uniform float u_dpr;
uniform vec3 u_fg;
uniform vec3 u_accent;
uniform vec3 u_teal;

#define PI 3.14159265359

// Distance to a line segment.
float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_res;            // 0..1
  float aspect = u_res.x / u_res.y;

  // Cell grid sized in CSS pixels so density is stable across DPR.
  float cell = 46.0 * u_dpr;
  vec2 gid = floor(frag / cell);
  vec2 gpos = (gid + 0.5) * cell;    // cell center in pixels
  vec2 local = (frag - gpos) / cell; // -0.5..0.5

  // Flow field: a slow drifting angle per cell.
  float t = u_time * 0.18;
  float fx = sin(gid.x * 0.45 + t) + cos(gid.y * 0.38 - t * 0.8);
  float fy = sin(gid.y * 0.5 - t * 1.1) + cos(gid.x * 0.33 + t * 0.6);
  float angle = atan(fy, fx);

  // Pointer bends nearby chevrons to point away from the cursor and lifts them.
  vec2 toM = gpos - u_mouse;
  float md = length(toM) / (220.0 * u_dpr);
  float infl = exp(-md * md * 2.2);
  float aMouse = atan(toM.y, toM.x);
  angle = mix(angle, aMouse, infl * 0.92);

  // Rotate local space so the chevron opens along +x.
  float ca = cos(-angle), sa = sin(-angle);
  vec2 p = mat2(ca, -sa, sa, ca) * local;

  // The brand chevron ">" as two segments meeting at the left vertex.
  float s = 0.30;
  vec2 a = vec2(-s * 0.7,  s);
  vec2 b = vec2( s * 0.9,  0.0);
  vec2 c = vec2(-s * 0.7, -s);
  float d = min(sdSeg(p, a, b), sdSeg(p, b, c));

  // Stroke with crisp anti-aliased edges.
  float lw = 0.052 + infl * 0.012;
  float aa = 1.2 / cell;
  float mask = 1.0 - smoothstep(lw - aa, lw + aa, d);

  // Accent scatter. Terracotta (the logo's K color) carries the field; teal is
  // a sparse secondary; the rest are neutral foreground strokes.
  float r = hash(gid);
  vec3 stroke = u_fg;
  float baseAlpha = 0.18;
  if (r > 0.66) { stroke = u_accent; baseAlpha = 0.5; }
  else if (r > 0.56) { stroke = u_teal; baseAlpha = 0.32; }

  // Pointer proximity brightens and warms the field.
  stroke = mix(stroke, u_accent, infl * 0.5);
  float alpha = baseAlpha + infl * 0.5;

  // Gentle per-cell shimmer keeps it alive without strobing.
  alpha *= 0.78 + 0.22 * sin(u_time * 0.7 + r * 6.28);

  // Broad, near-uniform coverage that only dissolves at the outer edges so the
  // field reads as a full-page backdrop rather than ending in a hard rectangle.
  vec2 ce = (uv - 0.5) * vec2(aspect, 1.0);
  float edge = smoothstep(1.3, 0.62, length(ce));
  alpha *= edge;

  outColor = vec4(stroke, mask * alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ]
}

// Brand tokens from the logo system, kept in sync with globals.css.
const PALETTE = {
  fg: hexToRgb("#F5F1EA"),
  accent: hexToRgb("#D9634A"),
  teal: hexToRgb("#2E6B68"),
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  return sh
}

export function ChevronField({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  function init(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Touch / coarse-pointer screens get the field as a static backdrop only:
    // no hover bloom, since there is no real cursor to follow.
    const interactive = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // Full-screen triangle.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const loc = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const u = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
      fg: gl.getUniformLocation(program, "u_fg"),
      accent: gl.getUniformLocation(program, "u_accent"),
      teal: gl.getUniformLocation(program, "u_teal"),
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * dpr
      // Flip Y: GL origin is bottom-left.
      mouse.y = (rect.height - (e.clientY - rect.top)) * dpr
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    function render(now: number) {
      gl.uniform2f(u.res, canvas.width, canvas.height)
      gl.uniform1f(u.time, reduced ? 8.0 : now / 1000)
      gl.uniform2f(u.mouse, mouse.x, mouse.y)
      gl.uniform1f(u.dpr, dpr)
      gl.uniform3fv(u.fg, PALETTE.fg)
      gl.uniform3fv(u.accent, PALETTE.accent)
      gl.uniform3fv(u.teal, PALETTE.teal)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    let running = false
    function loop(now: number) {
      render(now)
      raf = requestAnimationFrame(loop)
    }
    function start() {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced || !running) render(performance.now())
    })
    ro.observe(canvas)

    // Pause when scrolled out of view or tab hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    function onVisibility() {
      if (document.hidden) stop()
      else if (!reduced) start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    if (interactive) {
      window.addEventListener("pointermove", onPointer, { passive: true })
      canvas.addEventListener("pointerleave", onLeave)
    }

    resize()
    render(performance.now())
    if (!reduced) start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onPointer)
      canvas.removeEventListener("pointerleave", onLeave)
      gl.deleteProgram(program)
      gl.deleteBuffer(buf)
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })
    if (!gl) return

    // Bind the (now non-null) handles so nested closures keep their types.
    return init(canvas, gl)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block h-full w-full", className)}
    />
  )
}
