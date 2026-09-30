"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A 1-bit self-portrait. The character is a signed distance field raymarched
 * in a single fragment shader (no meshes, no textures, no 3D library), shaded
 * like matte clay and then quantized through a 4x4 Bayer matrix.
 *
 * The canvas renders at dither-cell resolution: one canvas pixel is one dot,
 * upscaled with `image-rendering: pixelated` by a whole number of device
 * pixels, so the lattice stays locked to the screen and every dot is crisp.
 *
 * Interaction: the head and eyes follow the pointer, he lights up when a link
 * is hovered, and he waves when clicked. Idle life (breathing, blinks,
 * glances) runs on its own. Renders a single static frame under
 * prefers-reduced-motion.
 */

/** Dot size in CSS pixels. */
const CELL = 2

const INK = hexToRgb("#EBE7E1")
const PAPER = hexToRgb("#1A1715")
const ACCENT = hexToRgb("#D9634A")

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_res;        // canvas size in cells
uniform float u_time;
uniform mat3 u_headInv;    // inverse head rotation
uniform vec2 u_eyes;       // pupil offset, -1..1
uniform float u_blink;     // 0 open, 1 closed
uniform float u_brow;      // 0 rest, 1 raised
uniform float u_smile;     // 0 neutral, 1 grin
uniform vec3 u_arm;        // waving arm: shoulder angle, elbow angle, palm twist
uniform float u_glint;     // lens glint sweep position
uniform float u_intro;     // 0..1 print-in progress
uniform vec3 u_ink;
uniform vec3 u_paper;
uniform vec3 u_accent;
uniform int u_mode;        // 0 dithered, 1 continuous shading (debug)

#define M_SKIN 1.0
#define M_HAIR 2.0
#define M_BEARD 3.0
#define M_SHIRT 4.0
#define M_FRAME 5.0
#define M_BROW 6.0
#define M_LIP 7.0
#define M_BAND 8.0

const vec3 PIVOT = vec3(0.0, 0.45, 0.0);
const float HS = 1.3;                 // head scale: chibi proportions
const float CAM_Z = 10.0;

// ---------------------------------------------------------------- primitives

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
float smax(float a, float b, float k) { return -smin(-a, -b, k); }

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec2 opU(vec2 a, vec2 b) { return a.x < b.x ? a : b; }

float bayer4(vec2 p) {
  ivec2 i = ivec2(mod(p, 4.0));
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i.y * 4 + i.x]) + 0.5) / 16.0;
}

// ---------------------------------------------------------------- the head
// Head space: y up, +z out of the face, pivoting at the base of the neck.

float skull(vec3 q) {
  return sdEllipsoid(q - vec3(0.0, 1.45, -0.05), vec3(0.9, 0.98, 0.95));
}

float faceShape(vec3 q) {
  float d = skull(q);
  // broad jaw
  d = smin(d, sdEllipsoid(q - vec3(0.0, 1.02, 0.1), vec3(0.74, 0.68, 0.78)), 0.32);
  // nose
  float n = sdEllipsoid(q - vec3(0.0, 1.2, 0.85), vec3(0.11, 0.26, 0.15));
  n = smin(n, sdEllipsoid(q - vec3(0.0, 1.04, 0.96), vec3(0.16, 0.12, 0.13)), 0.09);
  d = smin(d, n, 0.08);
  // ears
  vec3 e = vec3(abs(q.x), q.yz) - vec3(0.9, 1.28, -0.08);
  d = smin(d, sdEllipsoid(e, vec3(0.09, 0.22, 0.14)), 0.06);
  return d;
}

float hairline(vec3 q) {
  // forehead at the front, above the ears on the sides, low at the nape
  float ax = abs(q.x);
  float line = mix(1.55, 1.9 + 0.1 * smoothstep(0.2, 0.55, ax), smoothstep(0.15, 0.8, q.z));
  line = mix(line, 1.05, 1.0 - smoothstep(-0.8, -0.2, q.z));
  float burn = smoothstep(0.66, 0.84, ax) * (1.0 - smoothstep(0.06, 0.2, abs(q.z - 0.2)));
  return mix(line, 1.12, burn);
}

float hair(vec3 q) {
  float line = hairline(q);
  float top = smoothstep(1.6, 2.3, q.y);
  // grows out of the skin at the hairline: short faded sides, volume on top
  float grow = smoothstep(line - 0.02, line + 0.2, q.y);
  float th = mix(0.025, 0.11, top) * grow;
  // combed ridges running front to back, broken up into short tufts
  float cl = 0.65 * sin(q.x * 24.0 + sin(q.z * 5.0) * 0.8) + 0.35 * sin(q.z * 17.0 + q.x * 6.0);
  th += top * grow * 0.022 * cl;
  float d = skull(q) - th;
  // swept-up front
  float front = sdEllipsoid(q - vec3(0.0, 2.08, 0.38), vec3(0.58, 0.17, 0.4)) - 0.02 * cl;
  d = smin(d, front, 0.2);
  return smax(d, line - q.y, 0.04);
}

float beard(vec3 q, float face) {
  float ax = abs(q.x);
  // cheek line runs from the sideburns down to the mouth corners; the
  // moustache sits as a band right under the nose
  float line = mix(0.8, 1.32, smoothstep(0.28, 0.84, ax));
  line = max(line, mix(0.955, 0.8, smoothstep(0.16, 0.3, ax)));
  float th = mix(0.08, 0.03, smoothstep(0.3, 0.8, ax)) * mix(1.0, 0.6, smoothstep(0.85, 1.1, q.y));
  th *= 0.35 + 0.65 * smoothstep(line + 0.01, line - 0.12, q.y);
  float d = face - th - 0.014 * sin(q.x * 23.0) * sin(q.y * 19.0 + q.z * 7.0);
  d = smax(d, q.y - line, 0.05);
  d = smax(d, -0.02 - q.z, 0.05);
  // opening for the lips
  d = smax(d, -sdEllipsoid(q - vec3(0.0, 0.775, 0.92), vec3(0.15, 0.05, 0.2)), 0.025);
  return d;
}

float brows(vec3 q) {
  vec3 b = vec3(abs(q.x), q.yz);
  float lift = u_brow * 0.07;
  vec3 a = vec3(0.13, 1.6 + lift, 0.885);
  vec3 c = vec3(0.52, 1.62 + lift * 1.2, 0.74);
  vec3 pa = b - a, ba = c - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  vec3 off = pa - ba * h;
  off.y -= 0.035 * sin(h * 3.1416);             // gentle arch
  return length(off * vec3(1.0, 1.25, 1.6)) - mix(0.06, 0.03, h);
}

// Lens-local 2D coordinates, shared by the frames and the glint.
vec2 lensUV(vec3 q) {
  vec2 c = vec2(abs(q.x) - 0.35, q.y - 1.32);
  c.x *= 1.0 - 0.1 * c.y;
  return c;
}

float frames(vec3 q) {
  vec3 g = q - vec3(0.0, 1.32, 1.0);
  float ax = abs(g.x);
  g.z += 0.22 * ax * ax;             // wrap around the face
  float r2 = sdRoundRect(lensUV(q), vec2(0.25, 0.185), 0.085);
  vec2 w = vec2(abs(r2) - 0.028, abs(g.z) - 0.028);
  float d = min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - 0.01;
  // keyhole bridge
  d = min(d, sdCapsule(g, vec3(-0.1, 0.07, 0.0), vec3(0.1, 0.07, 0.0), 0.03));
  // temples back to the ears
  vec3 t = vec3(ax, q.yz);
  d = min(d, sdCapsule(t, vec3(0.62, 1.4, 0.9), vec3(0.93, 1.4, -0.1), 0.026));
  return d;
}

vec2 head(vec3 q) {
  float face = faceShape(q);
  vec2 h = vec2(face, M_SKIN);
  h = opU(h, vec2(hair(q), M_HAIR));
  h = opU(h, vec2(beard(q, face), M_BEARD));
  h = opU(h, vec2(sdEllipsoid(q - vec3(0.0, 0.77, 0.86), vec3(0.13, 0.05, 0.075)), M_LIP));
  h = opU(h, vec2(brows(q), M_BROW));
  h = opU(h, vec2(frames(q), M_FRAME));
  return h;
}

// ---------------------------------------------------------------- the body

// One short clay arm from shoulder S. a1 swings it out from the side, a2 bends
// the elbow, twist turns the palm from the thigh (1) to the viewer (0).
// Returns distance, material.
vec2 arm(vec3 p, vec3 S, float a1, float a2, float twist, float tattoo) {
  const float UPPER = 0.8;
  const float FORE = 0.72;
  vec3 d1 = normalize(vec3(sin(a1), -cos(a1), 0.12));
  vec3 E = S + d1 * UPPER;
  float a = a1 + a2;
  vec3 d2 = normalize(vec3(sin(a), -cos(a), mix(0.3, 0.45, twist)));
  vec3 W = E + d2 * FORE;

  float bound = sdCapsule(p, S, W + d2 * 0.3, 0.1) - 0.42;
  if (bound > 0.2) return vec2(bound, M_SKIN);

  vec2 r = vec2(sdCapsule(p, S, S + d1 * 0.45, 0.32), M_SHIRT);   // sleeve
  float skin = sdCapsule(p, S + d1 * 0.3, E, 0.21);
  // forearm tapers toward the wrist
  vec3 pe = p - E;
  float h = clamp(dot(pe, d2) / FORE, 0.0, 1.0);
  float fore = length(pe - d2 * FORE * h) - mix(0.2, 0.15, h);
  skin = smin(skin, fore, 0.1);

  // mitten hand with a thumb
  vec3 up = d2;
  vec3 fwd = normalize(mix(vec3(0.0, 0.0, 1.0), vec3(-1.0, 0.0, 0.0), twist));
  vec3 side = normalize(cross(up, fwd));
  fwd = cross(side, up);
  vec3 H = W + up * 0.17;
  vec3 hp = vec3(dot(p - H, side), dot(p - H, up), dot(p - H, fwd));
  float hand = sdEllipsoid(hp, vec3(0.16, 0.21, 0.09));
  hand = smin(hand, sdCapsule(hp, vec3(-0.11, -0.07, 0.02), vec3(-0.22, 0.05, 0.05), 0.05), 0.05);
  skin = smin(skin, hand, 0.07);
  r = opU(r, vec2(skin, M_SKIN));

  // forearm tattoo band and a bracelet at the wrist
  if (tattoo > 0.0) {
    float onFore = step(fore, skin + 0.001);
    float band = step(abs(h - 0.42), 0.03) + step(abs(h - 0.5), 0.015);
    if (r.y == M_SKIN && onFore * band > 0.0) r.y = M_BAND;
    float rad = length(pe - d2 * FORE * h);
    float bracelet = length(vec2(rad - 0.155, (h - 0.88) * FORE)) - 0.03;
    r = opU(r, vec2(bracelet, M_BAND));
  }
  return r;
}

vec2 body(vec3 p) {
  vec3 b = p;
  b.y -= 0.014 * sin(u_time * 1.6);  // breathing

  vec2 r = vec2(sdCapsule(p, vec3(0.0, -0.1, -0.05), vec3(0.0, 0.85, 0.0), 0.42), M_SKIN);

  // soft sloping shoulders over a rounded chest, like a clay toy
  float torso = sdEllipsoid(b - vec3(0.0, -1.4, -0.1), vec3(1.22, 1.05, 0.78));
  torso = smin(torso, sdEllipsoid(b - vec3(0.0, -0.52, -0.12), vec3(0.98, 0.4, 0.6)), 0.55);
  torso = smin(torso, sdEllipsoid(b - vec3(0.0, -2.5, -0.05), vec3(1.25, 1.5, 0.82)), 0.4);
  r = opU(r, vec2(torso, M_SHIRT));

  // crew-neck collar, dipping at the front
  vec3 c = b - vec3(0.0, 0.0, 0.0);
  float ca = 0.32;
  c = vec3(c.x, c.y * cos(ca) - c.z * sin(ca), c.y * sin(ca) + c.z * cos(ca));
  float collar = length(vec2(length(c.xz) - 0.45, c.y + 0.03)) - 0.045;
  r.x = smin(r.x, collar, 0.08);
  if (collar < r.x + 0.02 && r.y == M_SKIN) r.y = M_SHIRT;

  // arms hang relaxed at the sides; his left one (screen right) waves
  vec3 S = vec3(0.95, -0.62, 0.02);
  vec2 arms = arm(vec3(-b.x, b.yz), S, 0.4, -0.45, 1.0, 0.0);
  arms = opU(arms, arm(b, S, u_arm.x, u_arm.y, u_arm.z, 1.0));
  float merged = smin(r.x, arms.x, 0.04);
  r = arms.x < r.x ? vec2(merged, arms.y) : vec2(merged, r.y);
  return r;
}

vec3 toHead(vec3 p) { return u_headInv * (p - PIVOT) / HS + PIVOT; }

vec2 map(vec3 p) {
  vec2 r = body(p);
  vec3 q = toHead(p);
  float bound = (length(q - vec3(0.0, 1.45, 0.05)) - 1.6) * HS;
  if (bound > 0.2) return opU(r, vec2(bound, M_SKIN));
  vec2 h = head(q);
  return opU(r, vec2(h.x * HS, h.y));
}

vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.0015;
  return normalize(
    k.xyy * map(p + k.xyy * e).x +
    k.yyx * map(p + k.yyx * e).x +
    k.yxy * map(p + k.yxy * e).x +
    k.xxx * map(p + k.xxx * e).x);
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 4; i++) {
    float h = 0.03 + 0.1 * float(i);
    occ += (h - map(p + n * h).x) * sca;
    sca *= 0.8;
  }
  return clamp(1.0 - 1.6 * occ, 0.0, 1.0);
}

float softShadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.03;
  for (int i = 0; i < 14; i++) {
    float h = map(ro + rd * t).x;
    res = min(res, 10.0 * h / t);
    t += clamp(h, 0.04, 0.3);
    if (res < 0.02 || t > 3.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

// ---------------------------------------------------------------- shading

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = u_res.x / u_res.y;
  float viewH = max(6.4, 5.6 / aspect);
  vec3 ro = vec3(-0.2, 0.26, CAM_Z);
  if (u_mode >= 2) { viewH = 3.6; ro.y = 1.65; }
  vec2 uv = (frag - 0.5 * u_res) / u_res.y;
  vec3 rd = normalize(vec3(uv * viewH, -CAM_Z));

  float bay = bayer4(frag);
  float yTop = 1.0 - frag.y / u_res.y;                // 0 at the top edge

  // --- raymarch
  float t = CAM_Z - 1.8;
  float tMax = CAM_Z + 2.0;
  vec2 h = vec2(0.0);
  bool hit = false;
  for (int i = 0; i < 96; i++) {
    h = map(ro + rd * t);
    if (h.x < 0.0015 * t) { hit = true; break; }
    t += h.x;
    if (t > tMax) break;
  }
  if (!hit) { outColor = vec4(0.0); return; }

  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  float m = h.y;
  vec3 q = toHead(p);

  float albedo = 0.7;
  if (m == M_HAIR) albedo = mix(0.42, 0.3, smoothstep(1.6, 2.2, q.y));
  else if (m == M_BEARD) albedo = 0.34;
  else if (m == M_SHIRT) albedo = 0.36;
  else if (m == M_FRAME) albedo = 0.8;
  else if (m == M_BROW) albedo = 0.02;
  else if (m == M_LIP) albedo = 0.6;
  else if (m == M_BAND) albedo = 0.04;

  // decals drawn straight to ink or paper, never dithered
  float decal = -1.0;
  bool onHead = length(q - vec3(0.0, 1.45, 0.05)) < 1.8;
  if (onHead && m == M_SKIN && q.z > 0.55) {
    vec2 e = vec2(q.x - sign(q.x) * 0.33, q.y - 1.32) - u_eyes * vec2(0.05, 0.035);
    float open = max(1.0 - u_blink, 0.08);
    if (u_smile > 0.8) {
      // happy squint: two little arches
      vec2 a = e + vec2(0.0, 0.04);
      if (abs(length(a) - 0.07) < 0.02 && a.y > 0.012) decal = 0.0;
    } else {
      vec2 eo = e / vec2(0.075, 0.1 * open);
      if (dot(eo, eo) < 1.0 && e.y < 0.075 * open) {
        decal = 0.0;
        vec2 hl = e - vec2(0.022, 0.03 * open);
        if (open > 0.5 && dot(hl, hl) < 0.022 * 0.022) decal = 1.0;
      }
    }
  }
  if (onHead && m == M_LIP) {
    float x = q.x;
    float curve = 0.79 + (0.6 + 1.6 * u_smile) * x * x;
    if (abs(q.y - curve) < 0.014 && abs(x) < 0.13) decal = 0.0;
  }

  // lighting: key from the upper left, cool fill, back rim to lift dark hair
  vec3 L = normalize(vec3(-0.55, 0.65, 0.6));
  float dif = clamp((dot(n, L) + 0.2) / 1.2, 0.0, 1.0);
  float sh = softShadow(p + n * 0.01, L);
  dif *= mix(0.35, 1.0, sh);
  float fill = clamp(dot(n, normalize(vec3(0.7, -0.1, 0.6))), 0.0, 1.0) * 0.28;
  float ao = calcAO(p, n);
  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
  float rimSide = smoothstep(-0.5, 0.4, dot(n, normalize(vec3(0.5, 0.4, -0.4))));
  float lum = albedo * (dif * 0.95 + fill + 0.08) * ao + fres * rimSide * 0.85;
  if (m == M_FRAME) lum = max(lum, 0.35) * (1.0 - 0.6 * fres);

  // lens glint: intersect the lens plane in head space
  vec3 hro = toHead(ro);
  vec3 hrd = u_headInv * rd / HS;
  float tl = (1.02 - hro.z) / hrd.z;
  if (tl > 0.0 && tl < t) {
    vec3 lp = hro + hrd * tl;
    vec2 c = lensUV(lp);
    if (abs(lp.x) < 0.75 && sdRoundRect(c, vec2(0.25, 0.185), 0.085) < -0.028) {
      float s = c.x * 0.8 + c.y;
      float g = u_glint - (lp.x > 0.0 ? 0.25 : 0.0);
      if (abs(s - g) < 0.05) decal = 1.0;
      if (abs(s + 0.28) < 0.018 && c.y > 0.05) lum = max(lum, 0.8);
    }
  }

  // the bust dissolves into the page toward the bottom edge
  lum *= smoothstep(-3.1, -2.05, p.y);
  lum = smoothstep(-0.03, 0.9, lum);
  float bit = decal >= 0.0 ? decal : step(bay, lum);

  if (u_mode == 1 || u_mode == 2) {
    float v = decal >= 0.0 ? decal : lum;
    outColor = vec4(mix(u_paper, u_ink, v), 1.0);
    return;
  }

  // print-in: the page fills top to bottom in Bayer order, a scan head leading
  float front = u_intro * 1.25 - 0.1;
  if (yTop > front - bay * 0.12) { outColor = vec4(0.0); return; }
  if (u_intro < 1.0 && yTop > front - 0.12 - 1.5 / u_res.y) { outColor = vec4(u_accent, 1.0); return; }

  outColor = vec4(bit > 0.5 ? u_ink : u_paper, 1.0);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
  }
  return s
}

/** Inverse (transpose) of Ry(yaw) * Rx(pitch) * Rz(roll), column-major. */
function headInverse(yaw: number, pitch: number, roll: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw)
  const cp = Math.cos(pitch), sp = Math.sin(pitch)
  const cr = Math.cos(roll), sr = Math.sin(roll)
  // R = Ry * Rx * Rz (row-major)
  const r00 = cy * cr + sy * sp * sr
  const r01 = -cy * sr + sy * sp * cr
  const r02 = sy * cp
  const r10 = cp * sr
  const r11 = cp * cr
  const r12 = -sp
  const r20 = -sy * cr + cy * sp * sr
  const r21 = sy * sr + cy * sp * cr
  const r22 = cy * cp
  // Column-major upload of R^T is R's rows laid out as columns: i.e. R row-major.
  return new Float32Array([r00, r01, r02, r10, r11, r12, r20, r21, r22])
}

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
const damp = (v: number, target: number, rate: number, dt: number) =>
  v + (target - v) * (1 - Math.exp(-rate * dt))

export function DitherCharacter({ className }: { className?: string }) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) return
    const ctx: WebGL2RenderingContext = gl
    const cnv: HTMLCanvasElement = canvas

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Dev-only views for sculpting: ?shade (no dither), ?zoom (head close-up).
    const params = new URLSearchParams(window.location.search)
    const dev = process.env.NODE_ENV !== "production"
    const mode = !dev ? 0 : (params.has("shade") ? 1 : 0) + (params.has("zoom") ? 2 : 0)
    const still = dev && params.has("still")

    const program = ctx.createProgram()!
    ctx.attachShader(program, compile(ctx, ctx.VERTEX_SHADER, VERT))
    ctx.attachShader(program, compile(ctx, ctx.FRAGMENT_SHADER, FRAG))
    ctx.linkProgram(program)
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      console.error(ctx.getProgramInfoLog(program))
      return
    }
    ctx.useProgram(program)

    const buf = ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW)
    const loc = ctx.getAttribLocation(program, "a_pos")
    ctx.enableVertexAttribArray(loc)
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0)

    const U = (name: string) => ctx.getUniformLocation(program, name)
    const u = {
      res: U("u_res"),
      time: U("u_time"),
      headInv: U("u_headInv"),
      eyes: U("u_eyes"),
      blink: U("u_blink"),
      brow: U("u_brow"),
      smile: U("u_smile"),
      arm: U("u_arm"),
      glint: U("u_glint"),
      intro: U("u_intro"),
      ink: U("u_ink"),
      paper: U("u_paper"),
      accent: U("u_accent"),
      mode: U("u_mode"),
    }
    ctx.uniform3fv(u.ink, INK)
    ctx.uniform3fv(u.paper, PAPER)
    ctx.uniform3fv(u.accent, ACCENT)
    ctx.uniform1i(u.mode, mode === 1 ? 1 : mode === 3 ? 2 : mode === 2 ? 3 : 0)

    // ------------------------------------------------------------ sizing
    let dpr = 1
    let cellDev = 2
    let cols = 1
    let rows = 1
    function resize() {
      const rect = wrap!.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      // finer dots on phones, where the figure is small
      cellDev = Math.max(1, Math.round((rect.width < 640 ? CELL * 0.7 : CELL) * dpr))
      cols = Math.max(1, Math.floor((rect.width * dpr) / cellDev))
      rows = Math.max(1, Math.floor((rect.height * dpr) / cellDev))
      if (cnv.width !== cols || cnv.height !== rows) {
        cnv.width = cols
        cnv.height = rows
      }
      cnv.style.width = `${(cols * cellDev) / dpr}px`
      cnv.style.height = `${(rows * cellDev) / dpr}px`
      ctx.viewport(0, 0, cols, rows)
    }

    // ------------------------------------------------------------ state
    const s = {
      yaw: 0,
      pitch: 0,
      roll: 0,
      eyeX: 0,
      eyeY: 0,
      brow: 0,
      smile: 0.25,
      blink: 0,
      nextBlink: 1.8,
      blinkAt: -10,
      doubleBlink: false,
      waveAt: -10,
      glintAt: -10,
      introAt: -1,
      pointer: { x: 0, y: 0, seen: false, lastMove: -10 },
      hover: false,
      excited: false,
    }
    let now = 0

    /** Head centre in CSS pixels relative to the viewport (matches the shader camera). */
    function headScreen() {
      const rect = cnv.getBoundingClientRect()
      const aspect = cols / rows
      const viewH = Math.max(6.4, 5.6 / aspect)
      const hx = (0 + 0.2) / viewH // head at x 0, camera at x -0.2
      const hy = (1.62 - 0.26) / viewH
      return {
        x: rect.left + rect.width / 2 + hx * rect.height,
        y: rect.top + rect.height / 2 - hy * rect.height,
        h: rect.height,
      }
    }

    function toCells(clientX: number, clientY: number) {
      const rect = cnv.getBoundingClientRect()
      return {
        x: ((clientX - rect.left) / rect.width) * cols,
        y: (1 - (clientY - rect.top) / rect.height) * rows,
      }
    }

    // ------------------------------------------------------------ render
    const px = new Uint8Array(4)
    let hitUnderPointer = false

    let frame = 0
    function draw(force = false) {
      const t = now
      // pointer tracking, with idle glances when nobody is around
      const idle = !s.pointer.seen || t - s.pointer.lastMove > 6
      let ty = 0
      let tp = 0
      let ex = 0
      let ey = 0
      if (!idle) {
        const hs = headScreen()
        const dx = (s.pointer.x - hs.x) / hs.h
        const dy = (s.pointer.y - hs.y) / hs.h
        ty = Math.max(-0.5, Math.min(0.5, dx * 1.1))
        tp = Math.max(-0.3, Math.min(0.38, dy * 0.9))
        ex = Math.max(-1, Math.min(1, dx * 3))
        ey = Math.max(-1, Math.min(1, -dy * 3))
      } else {
        ty = 0.28 * Math.sin(t * 0.31) + 0.12 * Math.sin(t * 0.83)
        tp = 0.06 * Math.sin(t * 0.47) - 0.03
        ex = Math.sin(t * 0.31 + 0.6) * 0.7
        ey = 0.2 * Math.sin(t * 0.53)
      }
      const dt = 1 / 60
      s.yaw = damp(s.yaw, ty, 5, dt)
      s.pitch = damp(s.pitch, tp, 5, dt)
      s.roll = damp(s.roll, -ty * 0.12 + 0.03 * Math.sin(t * 0.7), 4, dt)
      s.eyeX = damp(s.eyeX, ex, 14, dt)
      s.eyeY = damp(s.eyeY, ey, 14, dt)

      // blinks, sometimes doubled
      if (t > s.nextBlink) {
        s.blinkAt = t
        s.doubleBlink = Math.random() < 0.25
        s.nextBlink = t + 2.2 + Math.random() * 3.8
      }
      const bt = t - s.blinkAt
      let blink = bt < 0.16 ? Math.sin((bt / 0.16) * Math.PI) : 0
      if (s.doubleBlink && bt > 0.24 && bt < 0.4) blink = Math.sin(((bt - 0.24) / 0.16) * Math.PI)
      s.blink = blink

      // wave: lift from the resting pose, wag, lower
      const wt = t - s.waveAt
      const dur = 2.2
      let raise = 0
      if (wt < dur) raise = ease(wt / 0.35) * (1 - ease((wt - (dur - 0.45)) / 0.45))
      const wag = Math.sin(wt * 13) * 0.32 * raise
      const a1 = 0.4 + (2.45 - 0.4) * raise
      const a2 = -0.45 + (0.75 + 0.45) * raise + wag
      const twist = 1 - raise

      const waving = raise > 0.01
      s.brow = damp(s.brow, waving || s.excited ? 1 : s.hover ? 0.5 : 0, 10, dt)
      s.smile = damp(s.smile, waving || s.excited ? 1 : s.hover ? 0.6 : 0.25, 8, dt)

      const gt = t - s.glintAt
      const glint = gt < 0.9 ? -0.7 + gt * 2.4 : -9

      const intro = reduced || still ? 1 : s.introAt < 0 ? 0 : Math.min(1, (t - s.introAt) / 1.6)

      ctx.uniform2f(u.res, cols, rows)
      ctx.uniform1f(u.time, t)
      ctx.uniformMatrix3fv(u.headInv, false, headInverse(s.yaw, s.pitch, s.roll))
      ctx.uniform2f(u.eyes, s.eyeX, s.eyeY)
      ctx.uniform1f(u.blink, s.blink)
      ctx.uniform1f(u.brow, s.brow)
      ctx.uniform1f(u.smile, s.smile)
      ctx.uniform3f(u.arm, a1, a2, twist)
      ctx.uniform1f(u.glint, glint)
      ctx.uniform1f(u.intro, intro)

      ctx.clearColor(0, 0, 0, 0)
      ctx.clear(ctx.COLOR_BUFFER_BIT)
      ctx.drawArrays(ctx.TRIANGLES, 0, 3)

      // hit test the pixel under the pointer (alpha is 1 only on the figure);
      // every third frame is plenty and spares the GPU a sync
      if (s.pointer.seen && (force || ++frame % 3 === 0)) {
        const c = toCells(s.pointer.x, s.pointer.y)
        if (c.x >= 0 && c.y >= 0 && c.x < cols && c.y < rows) {
          ctx.readPixels(Math.floor(c.x), Math.floor(c.y), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px)
          setHover(px[3] > 0)
        } else setHover(false)
      }
    }

    function setHover(v: boolean) {
      if (v === hitUnderPointer) return
      hitUnderPointer = v
      if (v && !s.hover) s.glintAt = now
      s.hover = v
      document.documentElement.style.cursor = v && !s.excited ? "pointer" : ""
    }

    let raf = 0
    let running = false
    let last = performance.now()
    function loop(ts: number) {
      now += Math.min(0.05, (ts - last) / 1000)
      last = ts
      draw()
      raf = requestAnimationFrame(loop)
    }
    function start() {
      if (running || reduced) return
      running = true
      last = performance.now()
      if (s.introAt < 0) s.introAt = now
      raf = requestAnimationFrame(loop)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    // ------------------------------------------------------------ input
    function onMove(e: PointerEvent) {
      s.pointer.x = e.clientX
      s.pointer.y = e.clientY
      s.pointer.seen = true
      s.pointer.lastMove = now
    }
    function onDown(e: PointerEvent) {
      onMove(e)
      draw(true)
      // one wave at a time
      if (hitUnderPointer && now - s.waveAt > 2.2) s.waveAt = now
    }
    function onOver(e: PointerEvent) {
      const el = e.target instanceof Element ? e.target.closest("a, button") : null
      s.excited = !!el
    }
    function onLeaveWindow() {
      s.pointer.seen = false
      setHover(false)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced || !running) draw()
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    })
    io.observe(wrap)

    function onVisibility() {
      if (document.hidden) stop()
      else if (!reduced) start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("pointerdown", onDown)
      document.addEventListener("pointerover", onOver)
      document.documentElement.addEventListener("pointerleave", onLeaveWindow)
    }

    resize()
    draw()
    if (!reduced) start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      document.removeEventListener("pointerover", onOver)
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow)
      document.documentElement.style.cursor = ""
      ctx.deleteProgram(program)
      ctx.deleteBuffer(buf)
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("pointer-events-none relative", className)}>
      <canvas
        ref={canvasRef}
        className="absolute right-0 bottom-0 block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}
