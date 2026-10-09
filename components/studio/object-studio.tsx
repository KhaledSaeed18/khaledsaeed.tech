"use client"

import * as React from "react"

import { OBJECT_CELLS, OBJECT_FRAMES, OBJECTS } from "@/lib/content/objects"
import type { ObjectKind } from "@/lib/content/projects"

/**
 * Dev-only: renders a project's object as a 1-bit turntable sprite strip.
 * Each frame is CELLS x CELLS dither cells; frame f is the object turned
 * f/FRAMES of a full revolution. The strip is exported (scripts/objects) as
 * a PNG mask and shipped as a static asset, so production never runs WebGL
 * for these.
 *
 * Ink = 1 (white here). The card stock shows through everywhere else.
 */

const CELLS = OBJECT_CELLS
const FRAMES = OBJECT_FRAMES

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform int u_obj;
uniform float u_cells;
uniform float u_frames;
uniform int u_shade;   // 1 = continuous preview instead of dither

#define PI 3.14159265

float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
float bayer4(vec2 p) { return bayer2(0.5 * p) * 0.25 + bayer2(p) + 0.03125; }

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float sdRBox(vec3 p, vec3 b, float r) { return sdBox(p, b - r) - r; }
float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
float sdCyl(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / k1; }
float sdRoundCone(vec3 p, float r1, float r2, float h) {
  vec2 q = vec2(length(p.xz), p.y);
  float b = (r1 - r2) / h; float a = sqrt(1.0 - b * b); float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}
// 2D helpers for extrusions
float sd2Tri(vec2 p, vec2 a, vec2 b, vec2 c) {
  vec2 e0 = b - a, e1 = c - b, e2 = a - c;
  vec2 v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                   vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                   vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
float extrude(vec3 p, float d2, float h) { vec2 w = vec2(d2, abs(p.z) - h); return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)); }

// ------------------------------------------------------------------ objects
// Each fits roughly inside a unit sphere, resting around the origin.

float oGrid(vec3 p) {
  float d = 1e5;
  for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) {
    vec2 c = vec2(float(i) - 1.0, float(j) - 1.0) * 0.56;
    float lift = (i == 1 && j == 1) ? 0.26 : 0.0;
    d = min(d, sdRBox(p - vec3(c.x, lift - 0.1, c.y), vec3(0.24, 0.22, 0.24), 0.06));
  }
  return d;
}

float oLayers(vec3 p) {
  float d = 1e5;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec3 q = p - vec3(0.0, -0.54 + fi * 0.34, 0.0);
    q.xz = rot(fi * 0.18 - 0.25) * q.xz;
    q.xz -= vec2(0.05 * fi - 0.08, 0.0);
    d = min(d, sdRBox(q, vec3(0.78, 0.1, 0.58), 0.07));
  }
  return d;
}

float oCards(vec3 p) {
  // an upright kanban board: three columns of cards, fewer toward "done"
  vec3 q = p;
  q.yz = rot(-0.22) * q.yz;
  float d = sdRBox(q, vec3(0.92, 0.66, 0.05), 0.04);
  for (int c = 0; c < 3; c++) {
    int n = 3 - c;
    for (int r = 0; r < 3; r++) {
      if (r >= n) break;
      vec3 k = q - vec3(-0.6 + float(c) * 0.6, 0.42 - float(r) * 0.36, 0.09);
      d = min(d, sdRBox(k, vec3(0.24, 0.13, 0.035), 0.025));
    }
  }
  return d;
}

float oToolbox(vec3 p) {
  vec3 q = p - vec3(0.0, -0.2, 0.0);
  float body = sdRBox(q, vec3(0.85, 0.42, 0.45), 0.08);
  // lid seam
  body = max(body, -sdBox(q - vec3(0.0, 0.22, 0.0), vec3(0.9, 0.012, 0.5)));
  // latch
  body = min(body, sdRBox(q - vec3(0.0, 0.2, 0.46), vec3(0.12, 0.08, 0.04), 0.02));
  // handle: half torus standing up
  vec3 h = q - vec3(0.0, 0.42, 0.0);
  float handle = sdTorus(h.xzy, vec2(0.34, 0.06));
  handle = max(handle, -h.y);
  return min(body, handle);
}

float oCap(vec3 p) {
  vec3 q = p - vec3(0.0, 0.1, 0.0);
  vec3 r = q; r.xz = rot(PI * 0.25) * r.xz;
  float board = sdRBox(r - vec3(0.0, 0.16, 0.0), vec3(0.85, 0.035, 0.85), 0.02);
  float skull = sdCyl(q - vec3(0.0, -0.08, 0.0), 0.46, 0.22) - 0.04;
  float btn = sdCyl(q - vec3(0.0, 0.22, 0.0), 0.07, 0.03);
  // tassel cord to the corner, then hanging
  vec3 corner = vec3(0.0, 0.2, 0.0) + vec3(rot(-PI * 0.25) * vec2(0.8, 0.0), 0.0).xzy;
  float cord = sdCapsule(q, vec3(0.0, 0.22, 0.0), corner, 0.025);
  cord = min(cord, sdCapsule(q, corner, corner - vec3(0.0, 0.5, 0.0), 0.03));
  float tassel = sdRoundCone(q - (corner - vec3(0.0, 0.72, 0.0)), 0.09, 0.03, 0.22);
  return min(min(board, skull), min(min(btn, cord), tassel));
}

float oKey(vec3 p) {
  vec3 q = p;
  q.xy = rot(0.5) * q.xy;
  float ring = sdTorus((q - vec3(-0.55, 0.0, 0.0)).xzy, vec2(0.3, 0.09));
  float shaft = sdRBox(q - vec3(0.3, 0.0, 0.0), vec3(0.58, 0.08, 0.07), 0.03);
  float teeth = sdRBox(q - vec3(0.62, -0.17, 0.0), vec3(0.07, 0.12, 0.06), 0.02);
  teeth = min(teeth, sdRBox(q - vec3(0.4, -0.14, 0.0), vec3(0.05, 0.09, 0.06), 0.02));
  teeth = min(teeth, sdRBox(q - vec3(0.8, -0.12, 0.0), vec3(0.05, 0.07, 0.06), 0.02));
  float collar = sdCyl((q - vec3(-0.22, 0.0, 0.0)).yxz, 0.13, 0.05) - 0.02;
  return min(min(ring, shaft), min(teeth, collar));
}

float oHourglass(vec3 p) {
  vec3 q = p;
  float top = sdCyl(q - vec3(0.0, 0.78, 0.0), 0.62, 0.06) - 0.03;
  float bot = sdCyl(q - vec3(0.0, -0.78, 0.0), 0.62, 0.06) - 0.03;
  vec3 m = vec3(q.x, abs(q.y), q.z);
  float glass = sdRoundCone(m - vec3(0.0, 0.08, 0.0), 0.08, 0.42, 0.52);
  float posts = 1e5;
  for (int i = 0; i < 3; i++) {
    float a = float(i) * 2.0 * PI / 3.0 + 0.3;
    vec3 c = vec3(cos(a) * 0.52, 0.0, sin(a) * 0.52);
    posts = min(posts, sdCapsule(q, c + vec3(0.0, -0.75, 0.0), c + vec3(0.0, 0.75, 0.0), 0.05));
  }
  return min(min(top, bot), min(glass, posts));
}

float oLens(vec3 p) {
  vec3 q = p;
  q.xy = rot(-0.6) * q.xy;
  vec3 c = q - vec3(0.0, 0.3, 0.0);
  float ring = sdTorus(c.xzy, vec2(0.46, 0.08));
  float glass = sdCyl(c.xzy, 0.44, 0.025);
  float handle = sdCapsule(q, vec3(0.0, -0.22, 0.0), vec3(0.0, -0.95, 0.0), 0.1);
  float neck = sdCyl(q - vec3(0.0, -0.22, 0.0), 0.08, 0.06);
  return min(min(ring, glass), min(handle, neck));
}

float oFolder(vec3 p) {
  vec3 q = p;
  float back = sdRBox(q - vec3(0.0, 0.0, -0.08), vec3(0.8, 0.58, 0.04), 0.03);
  float tab = sdRBox(q - vec3(-0.42, 0.62, -0.08), vec3(0.3, 0.08, 0.04), 0.03);
  float paper = sdRBox(q - vec3(0.05, 0.06, 0.0), vec3(0.68, 0.52, 0.015), 0.01);
  vec3 f = q - vec3(0.0, -0.56, 0.02);
  f.yz = rot(-0.38) * f.yz;
  float front = sdRBox(f - vec3(0.0, 0.5, 0.0), vec3(0.8, 0.5, 0.04), 0.03);
  return min(min(back, tab), min(paper, front));
}

float oSquare(vec3 p) {
  vec3 q = p;
  q.xy = rot(0.15) * q.xy;
  vec2 a = vec2(-0.8, -0.7), b = vec2(0.85, -0.7), c = vec2(-0.8, 0.9);
  float tri = sd2Tri(q.xy, a, b, c) - 0.03;
  float hole = sd2Tri(q.xy, a + vec2(0.34, 0.3), vec2(0.28, -0.4), vec2(-0.46, 0.34));
  float d2 = max(tri, -hole + 0.02);
  float d = extrude(q, d2, 0.05);
  // tick marks along the long edge
  float ticks = abs(fract(q.x * 6.0 + 0.5) - 0.5) / 6.0 - 0.01;
  d = max(d, -max(max(ticks, abs(q.y + 0.62) - 0.08), abs(q.z) - 0.06) + 0.0);
  return d;
}

float oScissors(vec3 p) {
  vec3 q = p;
  q.xz = rot(0.2) * q.xz;
  float d = 1e5;
  for (int s = 0; s < 2; s++) {
    float sg = s == 0 ? 1.0 : -1.0;
    vec3 r = q;
    r.xy = rot(sg * 0.22) * r.xy;
    r.z -= sg * 0.03;
    float blade = sdEllipsoid(r - vec3(0.42, 0.0, 0.0), vec3(0.62, 0.09, 0.03));
    float arm = sdCapsule(r, vec3(0.0, 0.0, 0.0), vec3(-0.42, sg * -0.12, 0.0), 0.05);
    float loop = sdTorus((r - vec3(-0.66, sg * -0.2, 0.0)).xzy, vec2(0.22, 0.05));
    d = min(d, min(blade, min(arm, loop)));
  }
  d = min(d, sdCyl(q.xzy, 0.07, 0.07));
  return d;
}

float oBubble(vec3 p) {
  vec3 q = p - vec3(0.0, 0.15, 0.0);
  float body = sdRBox(q, vec3(0.9, 0.55, 0.14), 0.14);
  vec3 t = q - vec3(-0.4, -0.62, 0.0);
  float tail = extrude(t, sd2Tri(t.xy, vec2(-0.15, 0.2), vec2(0.28, 0.2), vec2(-0.3, -0.3)), 0.08) - 0.04;
  float d = smin(body, tail, 0.06);
  // three dots, cut in
  for (int i = 0; i < 3; i++) {
    vec3 c = q - vec3(-0.4 + float(i) * 0.4, 0.0, 0.16);
    d = max(d, -(length(c) - 0.11));
  }
  return d;
}

float oBulb(vec3 p) {
  vec3 q = p;
  float glass = smin(length(q - vec3(0.0, 0.25, 0.0)) - 0.55, sdRoundCone(q - vec3(0.0, -0.5, 0.0), 0.2, 0.42, 0.6), 0.15);
  float base = sdCyl(q - vec3(0.0, -0.66, 0.0), 0.22, 0.16);
  // screw threads
  base -= 0.02 * sin(q.y * 60.0);
  float tip = sdCyl(q - vec3(0.0, -0.86, 0.0), 0.09, 0.05);
  // filament inside shows through a slot
  return min(min(glass, base), tip);
}

float oBattery(vec3 p) {
  // an upright cell, leaning a little, with most of its charge gone
  vec3 q = p;
  q.xy = rot(-0.12) * q.xy;
  float body = sdRBox(q - vec3(0.0, -0.08, 0.0), vec3(0.44, 0.78, 0.3), 0.08);
  float nub = sdRBox(q - vec3(0.0, 0.78, 0.0), vec3(0.18, 0.08, 0.12), 0.03);
  // a window cut into the front face
  float win = sdBox(q - vec3(0.0, -0.08, 0.3), vec3(0.32, 0.64, 0.08));
  float d = max(body, -win);
  // two charge bars left at the bottom of four slots: the rest has drained
  for (int i = 0; i < 2; i++)
    d = min(d, sdRBox(q - vec3(0.0, -0.58 + float(i) * 0.3, 0.24), vec3(0.26, 0.11, 0.05), 0.02));
  return min(d, nub);
}

float map(vec3 p) {
  if (u_obj == 0) return oGrid(p);
  if (u_obj == 1) return oLayers(p);
  if (u_obj == 2) return oCards(p);
  if (u_obj == 3) return oToolbox(p);
  if (u_obj == 4) return oCap(p);
  if (u_obj == 5) return oKey(p);
  if (u_obj == 6) return oHourglass(p);
  if (u_obj == 7) return oLens(p);
  if (u_obj == 8) return oFolder(p);
  if (u_obj == 9) return oSquare(p);
  if (u_obj == 10) return oScissors(p);
  if (u_obj == 11) return oBubble(p);
  if (u_obj == 12) return oBulb(p);
  return oBattery(p);
}

float mapT(vec3 p, float ang) {
  p.xz = rot(ang) * p.xz;
  return map(p);
}

vec3 normalAt(vec3 p, float ang) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.002;
  return normalize(k.xyy * mapT(p + k.xyy * e, ang) + k.yyx * mapT(p + k.yyx * e, ang) +
                   k.yxy * mapT(p + k.yxy * e, ang) + k.xxx * mapT(p + k.xxx * e, ang));
}

float shadow(vec3 ro, vec3 rd, float ang) {
  float res = 1.0, t = 0.02;
  for (int i = 0; i < 48; i++) {
    float h = mapT(ro + rd * t, ang);
    res = min(res, 8.0 * h / t);
    t += clamp(h, 0.02, 0.2);
    if (res < 0.01 || t > 4.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

float ao(vec3 p, vec3 n, float ang) {
  float o = 0.0, s = 1.0;
  for (int i = 0; i < 6; i++) {
    float h = 0.02 + 0.08 * float(i);
    o += (h - mapT(p + n * h, ang)) * s;
    s *= 0.75;
  }
  return clamp(1.0 - 1.4 * o, 0.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float f = floor(frag.x / u_cells);
  vec2 local = vec2(mod(frag.x, u_cells), frag.y) / u_cells - 0.5;
  // a gentle swing rather than a full spin, so flat objects never go edge-on
  bool planar = u_obj == 2 || u_obj == 5 || u_obj == 7 || u_obj == 8 || u_obj == 9 || u_obj == 10 || u_obj == 11;
  float ang = planar ? 0.3 + 0.36 * sin(f / u_frames * 2.0 * PI) : 0.55 + 0.55 * sin(f / u_frames * 2.0 * PI);

  // three-quarter view from slightly above
  vec3 ro = vec3(0.0, 1.3, 3.4);
  vec3 ta = vec3(0.0, 0.0, 0.0);
  vec3 ww = normalize(ta - ro), uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0))), vv = cross(uu, ww);
  vec3 rd = normalize(local.x * uu * 0.68 + local.y * vv * 0.68 + ww);

  float t = 1.0; bool hit = false;
  for (int i = 0; i < 160; i++) {
    float h = mapT(ro + rd * t, ang);
    if (h < 0.0008) { hit = true; break; }
    t += h * 0.9;
    if (t > 8.0) break;
  }
  if (!hit) { outColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p, ang);
  vec3 L = normalize(vec3(-0.55, 0.8, 0.45));
  float dif = clamp(dot(n, L), 0.0, 1.0) * mix(0.25, 1.0, shadow(p + n * 0.004, L, ang));
  float fill = clamp(dot(n, normalize(vec3(0.7, 0.2, 0.6))), 0.0, 1.0) * 0.2;
  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 2.0);
  float lum = (dif * 0.9 + fill + 0.06) * ao(p, n, ang);
  lum *= mix(1.0, 0.25, fres);          // darken toward the silhouette so it reads on paper
  lum = smoothstep(0.02, 0.95, lum);

  if (u_shade == 1) { outColor = vec4(vec3(1.0 - lum), 1.0); return; }
  // ink where the paper would not be lit enough
  float ink = step(lum, bayer4(frag));
  outColor = vec4(vec3(ink), 1.0);
}
`

export function ObjectStudio({
  obj,
  shade = false,
}: {
  obj: ObjectKind
  shade?: boolean
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
      antialias: false,
    })!
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform1i(gl.getUniformLocation(prog, "u_obj"), OBJECTS.indexOf(obj))
    gl.uniform1f(gl.getUniformLocation(prog, "u_cells"), CELLS)
    gl.uniform1f(gl.getUniformLocation(prog, "u_frames"), FRAMES)
    gl.uniform1i(gl.getUniformLocation(prog, "u_shade"), shade ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    // Export: ink becomes opaque white, paper becomes transparent. The site
    // uses the strip as a CSS mask, so only alpha matters.
    const w = canvas.width
    const h = canvas.height
    const px = new Uint8Array(w * h * 4)
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px)
    const out = document.createElement("canvas")
    out.width = w
    out.height = h
    const c2 = out.getContext("2d")!
    const img = c2.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const src = ((h - 1 - y) * w + x) * 4 // GL rows are bottom-up
        const dst = (y * w + x) * 4
        const ink = px[src] > 127 ? 255 : 0
        img.data[dst] = img.data[dst + 1] = img.data[dst + 2] = 255
        img.data[dst + 3] = ink
      }
    }
    c2.putImageData(img, 0, 0)
    // Packed 1-bit rows for scripts/render-objects.mjs, which writes a
    // palette PNG a fraction of the size of the canvas's 32-bit one.
    const stride = Math.ceil(w / 8)
    const bits = new Uint8Array(stride * h)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (img.data[(y * w + x) * 4 + 3])
          bits[y * stride + (x >> 3)] |= 0x80 >> (x & 7)
    let bin = ""
    for (const b of bits) bin += String.fromCharCode(b)
    const win = window as unknown as {
      __strip: string
      __bits: { w: number; h: number; data: string }
    }
    win.__bits = { w, h, data: btoa(bin) }
    win.__strip = out.toDataURL("image/png")
  }, [obj, shade])

  return (
    <canvas
      ref={ref}
      width={CELLS * FRAMES}
      height={CELLS}
      className="block w-full"
      style={{ imageRendering: "pixelated" }}
    />
  )
}
