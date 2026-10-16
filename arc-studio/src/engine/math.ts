import type { Vec2 } from '../schema/types'

export interface Mat3 {
  /** column-major 3x3 affine: [a,c,e, b,d,f, 0,0,1] stored as a,b,c,d,tx,ty */
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

export const identity = (): Mat3 => ({ a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 })

export function mul(m: Mat3, n: Mat3): Mat3 {
  return {
    a: m.a * n.a + m.c * n.b,
    b: m.b * n.a + m.d * n.b,
    c: m.a * n.c + m.c * n.d,
    d: m.b * n.c + m.d * n.d,
    tx: m.a * n.tx + m.c * n.ty + m.tx,
    ty: m.b * n.tx + m.d * n.ty + m.ty,
  }
}

export function fromTRS(x: number, y: number, rotationDeg: number, sx: number, sy: number): Mat3 {
  const r = (rotationDeg * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  return {
    a: cos * sx,
    b: sin * sx,
    c: -sin * sy,
    d: cos * sy,
    tx: x,
    ty: y,
  }
}

export function transformPoint(m: Mat3, p: Vec2): Vec2 {
  return { x: m.a * p.x + m.c * p.y + m.tx, y: m.b * p.x + m.d * p.y + m.ty }
}

export function getTranslation(m: Mat3): Vec2 {
  return { x: m.tx, y: m.ty }
}

export function getRotation(m: Mat3): number {
  return (Math.atan2(m.b, m.a) * 180) / Math.PI
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpAngle(a: number, b: number, t: number): number {
  let d = ((b - a + 540) % 360) - 180
  return a + d * t
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

export function dist(a: Vec2, b: Vec2): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.hypot(dx, dy)
}

export function normalize(v: Vec2): Vec2 {
  const l = Math.hypot(v.x, v.y) || 1
  return { x: v.x / l, y: v.y / l }
}

export function bezierEase(t: number, c1: number, c2: number): number {
  // Cubic bezier with P0=0,P3=1, solving x then y with equal control on both axes simplified
  // Approximate: use cubic Hermite on [0,c1,c2,1]
  const u = 1 - t
  return 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t
}
