import { describe, expect, it } from 'vitest'
import { fromTRS, lerpAngle, mul, transformPoint } from './math'
import { solveIk2 } from './ik'
import { sampleScalar } from './timeline'

describe('math', () => {
  it('composes TRS transforms', () => {
    const m = fromTRS(10, 20, 90, 1, 1)
    const p = transformPoint(m, { x: 5, y: 0 })
    expect(p.x).toBeCloseTo(10, 5)
    expect(p.y).toBeCloseTo(25, 5)
  })

  it('multiplies matrices', () => {
    const a = fromTRS(10, 0, 0, 1, 1)
    const b = fromTRS(5, 0, 0, 1, 1)
    const c = mul(a, b)
    expect(c.tx).toBeCloseTo(15)
  })

  it('lerps angles across wrap', () => {
    expect(lerpAngle(170, -170, 0.5)).toBeCloseTo(180, 5)
  })
})

describe('ik', () => {
  it('reaches target within chain length', () => {
    const root = { x: 0, y: 0 }
    const target = { x: 60, y: 0 }
    const s = solveIk2(root, target, 40, 40, true)
    const tipDist = Math.hypot(s.tip.x - target.x, s.tip.y - target.y)
    expect(tipDist).toBeLessThan(1.5)
  })
})

describe('timeline', () => {
  it('samples between keys', () => {
    const v = sampleScalar(
      [
        { time: 0, value: 0 },
        { time: 1, value: 10 },
      ],
      0.5,
    )
    expect(v).toBeCloseTo(5)
  })
})
