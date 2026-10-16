import type { Vec2 } from '../schema/types'
import { dist, normalize } from './math'

/**
 * Deterministic 1-bone & 2-bone IK. Pure functions — no side effects.
 * Coordinates are world-space positions of bone joints.
 */

export function solveIk1(
  origin: Vec2,
  target: Vec2,
  length: number,
): { tip: Vec2; rotation: number } {
  const dir = normalize({ x: target.x - origin.x, y: target.y - origin.y })
  const tip = { x: origin.x + dir.x * length, y: origin.y + dir.y * length }
  const rotation = (Math.atan2(dir.y, dir.x) * 180) / Math.PI
  return { tip, rotation }
}

/**
 * Two-bone IK (analytic). bones: [parent, child], lengths L1, L2.
 * Returns world rotations for both bones (absolute from +X).
 */
export function solveIk2(
  root: Vec2,
  target: Vec2,
  lenA: number,
  lenB: number,
  bendPositive: boolean,
): { mid: Vec2; tip: Vec2; rotA: number; rotB: number } {
  let toTarget = { x: target.x - root.x, y: target.y - root.y }
  let d = Math.hypot(toTarget.x, toTarget.y)
  const maxReach = lenA + lenB - 1e-4
  const minReach = Math.abs(lenA - lenB) + 1e-4
  if (d > maxReach) {
    const n = normalize(toTarget)
    toTarget = { x: n.x * maxReach, y: n.y * maxReach }
    d = maxReach
  } else if (d < minReach) {
    const n = d < 1e-6 ? { x: 1, y: 0 } : normalize(toTarget)
    toTarget = { x: n.x * minReach, y: n.y * minReach }
    d = minReach
  }

  // Law of cosines
  const cosA = clamp((lenA * lenA + d * d - lenB * lenB) / (2 * lenA * d), -1, 1)
  const angleA = Math.acos(cosA)
  const base = Math.atan2(toTarget.y, toTarget.x)
  const sign = bendPositive ? 1 : -1
  const rotA = ((base + sign * angleA) * 180) / Math.PI

  const mid = {
    x: root.x + Math.cos((rotA * Math.PI) / 180) * lenA,
    y: root.y + Math.sin((rotA * Math.PI) / 180) * lenA,
  }

  const tipDir = { x: target.x - mid.x, y: target.y - mid.y }
  // Pull tip to exact length along direction toward target (clamped)
  const tipN = normalize(tipDir)
  const tip = { x: mid.x + tipN.x * lenB, y: mid.y + tipN.y * lenB }
  const rotB = (Math.atan2(tip.y - mid.y, tip.x - mid.x) * 180) / Math.PI

  return { mid, tip, rotA, rotB }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

/** FABRIK for longer chains (deterministic, fixed iterations) */
export function solveFabrik(
  joints: Vec2[],
  lengths: number[],
  target: Vec2,
  iterations = 12,
  epsilon = 0.5,
): Vec2[] {
  if (joints.length < 2) return joints
  const out = joints.map((j) => ({ ...j }))
  const root = { ...out[0] }

  for (let iter = 0; iter < iterations; iter++) {
    if (dist(out[out.length - 1], target) < epsilon) break

    // Backward
    out[out.length - 1] = { ...target }
    for (let i = out.length - 2; i >= 0; i--) {
      const len = lengths[i]
      const dir = normalize({ x: out[i].x - out[i + 1].x, y: out[i].y - out[i + 1].y })
      out[i] = { x: out[i + 1].x + dir.x * len, y: out[i + 1].y + dir.y * len }
    }

    // Forward
    out[0] = { ...root }
    for (let i = 0; i < out.length - 1; i++) {
      const len = lengths[i]
      const dir = normalize({ x: out[i + 1].x - out[i].x, y: out[i + 1].y - out[i].y })
      out[i + 1] = { x: out[i].x + dir.x * len, y: out[i].y + dir.y * len }
    }
  }
  return out
}
