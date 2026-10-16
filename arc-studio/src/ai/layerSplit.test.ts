import { describe, expect, it } from 'vitest'
import { contentBounds, planPieces } from './layerSplit'
import { rigFromPieces } from './autoRig'
import { validateDocument } from '../schema/validate'

describe('god-mode pipeline', () => {
  it('finds opaque content bounds', () => {
    const w = 10
    const h = 10
    const data = new Uint8ClampedArray(w * h * 4)
    data[(3 * w + 4) * 4 + 3] = 255
    data[(7 * w + 8) * 4 + 3] = 255
    const b = contentBounds(data, w, h)
    expect(b).toEqual({ x: 4, y: 3, w: 5, h: 5 })
  })

  it('cuts six layers into 3-bone limbs and rigs them', () => {
    const pieces = planPieces({ x: 0, y: 0, w: 400, h: 600 })
    expect(pieces.find((p) => p.id === 'head')).toBeTruthy()
    expect(pieces.filter((p) => p.id.includes('arm') || p.id.includes('forearm') || p.id.includes('hand'))).toHaveLength(6)
    expect(pieces.find((p) => p.id === 'forearm_l')?.parent).toBe('arm_l')
    expect(pieces.find((p) => p.id === 'shin_r')?.parent).toBe('thigh_r')

    const doc = rigFromPieces(
      'Hero',
      pieces,
      pieces.map((p) => ({ id: p.id, path: `pieces/${p.id}.png` })),
    )
    expect(validateDocument(doc).filter((i) => i.level === 'error')).toHaveLength(0)
    expect(doc.bones.some((b) => b.id === 'head' && b.parent === 'torso')).toBe(true)
    const head = doc.attachments.find((a) => a.id === 'att_head')
    expect(head && head.kind === 'region' && head.path).toBe('pieces/head.png')
  })
})
