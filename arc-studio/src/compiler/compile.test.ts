import { describe, expect, it } from 'vitest'
import { compile } from './compile'
import { validateDocument } from '../schema/validate'
import { solvePose } from '../engine/solver'

describe('compile', () => {
  it('rigs a humanoid from intent', () => {
    const { doc, log } = compile({
      intent: 'humanoid warrior with cape and crown',
      mode: 'rig',
    })
    expect(doc.bones.some((b) => b.id === 'head')).toBe(true)
    expect(doc.bones.some((b) => b.id === 'cape_1')).toBe(true)
    expect(doc.bones.some((b) => b.id === 'crown')).toBe(true)
    expect(validateDocument(doc).filter((i) => i.level === 'error')).toHaveLength(0)
    expect(log.join(' ')).toMatch(/humanoid/)
  })

  it('directs a walk animation onto an existing rig', () => {
    const rig = compile({ intent: 'humanoid hero', mode: 'rig' })
    const { doc } = compile({
      intent: 'walk cycle 0.9s',
      mode: 'animate',
      base: rig.doc,
    })
    expect(doc.animations.length).toBeGreaterThan(0)
    const anim = doc.animations[0]
    expect(anim.bones.some((b) => b.bone === 'thigh_l')).toBe(true)
    const pose = solvePose(doc, anim.id, anim.duration * 0.25)
    expect(pose.bones.get('root')).toBeTruthy()
  })

  it('builds a slot symbol win moment end-to-end', () => {
    const { doc } = compile({
      intent: 'gold slot gem symbol — epic big win once',
      mode: 'both',
    })
    expect(doc.bones.some((b) => b.id === 'core')).toBe(true)
    expect(doc.animations[0]?.tags).toContain('win')
    const pose0 = solvePose(doc, doc.animations[0].id, 0)
    const pose1 = solvePose(doc, doc.animations[0].id, doc.animations[0].duration * 0.4)
    expect(pose0.bones.size).toBe(doc.bones.length)
    expect(pose1.bones.size).toBe(doc.bones.length)
  })
})
