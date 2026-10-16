import type { AnimationDef, ArcDocument, BoneDef, MeshAttachment } from '../schema/types'
import { contentBounds } from './layerSplit'
import { fromTRS, invert, mul, type Mat3 } from '../engine/math'

/**
 * One illustration, mesh-weighted onto joints.
 * Used when limbs overlap the body (arms in front, hair over the shoulders)
 * so a hard crop would duplicate pixels. The painting bends; it is not redrawn.
 */

const COLS = 10
const ROWS = 18

function smooth(x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  return x * x * (3 - 2 * x)
}

function fall(dist: number, radius: number): number {
  return smooth(1 - Math.abs(dist) / radius)
}

export function compilePortrait(source: HTMLImageElement, name: string, path?: string): ArcDocument {
  const maxW = 520
  const scaleDown = Math.min(1, maxW / (source.naturalWidth || source.width))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round((source.naturalWidth || source.width) * scaleDown))
  canvas.height = Math.max(1, Math.round((source.naturalHeight || source.height) * scaleDown))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const bounds = contentBounds(image.data, canvas.width, canvas.height)
  const texture = path ?? canvas.toDataURL('image/png')

  const hipPx = bounds.x + bounds.w * 0.5
  const hipPy = bounds.y + bounds.h * 0.8
  const scale = 240 / Math.max(1, bounds.h)
  const wp = (u: number, v: number) => ({
    x: (bounds.x + bounds.w * u - hipPx) * scale,
    y: (bounds.y + bounds.h * v - hipPy) * scale,
  })

  const places: { id: string; parent: string | null; u: number; v: number }[] = [
    { id: 'root', parent: null, u: 0.5, v: 0.8 },
    { id: 'torso', parent: 'root', u: 0.5, v: 0.58 },
    { id: 'head', parent: 'torso', u: 0.5, v: 0.38 },
    { id: 'arm_l', parent: 'torso', u: 0.28, v: 0.52 },
    { id: 'hand_l', parent: 'arm_l', u: 0.4, v: 0.66 },
    { id: 'arm_r', parent: 'torso', u: 0.74, v: 0.52 },
    { id: 'hand_r', parent: 'arm_r', u: 0.62, v: 0.67 },
    { id: 'thigh_l', parent: 'root', u: 0.42, v: 0.92 },
    { id: 'thigh_r', parent: 'root', u: 0.58, v: 0.92 },
  ]

  const world = new Map(places.map((p) => [p.id, p.id === 'root' ? { x: 0, y: 0 } : wp(p.u, p.v)]))
  const bones: BoneDef[] = places.map((p) => {
    const self = world.get(p.id)!
    const parent = p.parent ? world.get(p.parent)! : { x: 0, y: 0 }
    return {
      id: p.id,
      name: p.id,
      parent: p.parent,
      length: p.id === 'root' ? 0 : 28,
      x: p.parent ? self.x - parent.x : 0,
      y: p.parent ? self.y - parent.y : 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      color: p.id === 'head' ? '#e8c45c' : '#5ecf9a',
    }
  })

  const bind = bindWorlds(bones)
  const inverseBind: NonNullable<MeshAttachment['inverseBind']> = {}
  for (const [id, m] of bind) inverseBind[id] = invert(m)

  const vertices: MeshAttachment['vertices'] = []
  for (let j = 0; j <= ROWS; j++) {
    for (let i = 0; i <= COLS; i++) {
      const u = bounds.x / canvas.width + (bounds.w / canvas.width) * (i / COLS)
      const v = bounds.y / canvas.height + (bounds.h / canvas.height) * (j / ROWS)
      const nu = i / COLS
      const nv = j / ROWS
      const px = bounds.x + bounds.w * nu
      const py = bounds.y + bounds.h * nv
      vertices.push({
        x: (px - hipPx) * scale,
        y: (py - hipPy) * scale,
        u,
        v,
        weights: zoneWeights(nu, nv),
      })
    }
  }

  const triangles: number[] = []
  const stride = COLS + 1
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const a = j * stride + i
      const b = a + 1
      const c = a + stride
      const d = c + 1
      triangles.push(a, c, b, b, c, d)
    }
  }

  const mesh: MeshAttachment = {
    id: 'att_body',
    kind: 'mesh',
    name: 'body',
    path: texture,
    vertices,
    triangles,
    inverseBind,
  }

  return {
    meta: {
      name,
      version: '1.0',
      fps: 30,
      unit: 1,
      createdBy: 'ai',
      notes:
        'Portrait mesh. Arms overlap the torso, so the painting is weighted onto joints instead of cut into rectangles.',
    },
    bones,
    slots: [
      {
        id: 'sl_body',
        name: 'body',
        bone: 'root',
        attachment: 'att_body',
        color: '#ffffffff',
        blend: 'normal',
        drawOrder: 1,
      },
    ],
    attachments: [mesh],
    skins: [{ id: 'default', name: 'Default', attachments: { sl_body: 'att_body' } }],
    constraints: [],
    animations: portraitClips(),
    defaultSkin: 'default',
  }
}

function zoneWeights(u: number, v: number): Record<string, number> {
  const w: Record<string, number> = {}
  const add = (id: string, value: number) => {
    if (value > 0.04) w[id] = (w[id] ?? 0) + value
  }
  add('head', fall(v - 0.3, 0.22) * (0.55 + 0.45 * (1 - Math.abs(u - 0.5) * 1.2)))
  add('head', fall(u - 0.16, 0.18) * fall(v - 0.42, 0.2))
  add('head', fall(u - 0.84, 0.18) * fall(v - 0.42, 0.2))
  add('torso', fall(v - 0.58, 0.2) * fall(u - 0.5, 0.28))
  add('arm_l', fall(u - 0.26, 0.16) * fall(v - 0.54, 0.12))
  add('hand_l', fall(u - 0.4, 0.16) * fall(v - 0.66, 0.1))
  add('arm_r', fall(u - 0.76, 0.16) * fall(v - 0.55, 0.14))
  add('hand_r', fall(u - 0.62, 0.14) * fall(v - 0.67, 0.1))
  add('thigh_l', fall(u - 0.4, 0.16) * fall(v - 0.9, 0.14))
  add('thigh_r', fall(u - 0.6, 0.16) * fall(v - 0.9, 0.14))
  add('root', 0.08)

  let sum = 0
  for (const value of Object.values(w)) sum += value
  if (sum <= 0) return { root: 1 }
  for (const id of Object.keys(w)) w[id] /= sum
  return w
}

function bindWorlds(bones: BoneDef[]): Map<string, Mat3> {
  const byId = new Map(bones.map((b) => [b.id, b]))
  const out = new Map<string, Mat3>()
  const visit = (id: string): Mat3 => {
    const cached = out.get(id)
    if (cached) return cached
    const bone = byId.get(id)!
    const local = fromTRS(bone.x, bone.y, bone.rotation, bone.scaleX, bone.scaleY)
    const world = bone.parent ? mul(visit(bone.parent), local) : local
    out.set(id, world)
    return world
  }
  for (const bone of bones) visit(bone.id)
  return out
}

function portraitClips(): AnimationDef[] {
  const k = (time: number, value: number) => ({ time, value, curve: 'linear' as const })
  return [
    {
      id: 'idle',
      name: 'idle',
      duration: 2.8,
      loop: true,
      tags: ['idle'],
      intent: 'dealer breathe',
      bones: [
        { bone: 'torso', scaleY: [k(0, 1), k(1.4, 1.025), k(2.8, 1)], scaleX: [k(0, 1), k(1.4, 0.99), k(2.8, 1)] },
        { bone: 'head', rotate: [k(0, -2), k(1.4, 3), k(2.8, -2)] },
        { bone: 'hand_l', rotate: [k(0, -2), k(1.4, 3), k(2.8, -2)] },
        { bone: 'hand_r', rotate: [k(0, 2), k(1.4, -2), k(2.8, 2)] },
        { bone: 'root', translateY: [k(0, 0), k(1.4, -3), k(2.8, 0)] },
      ],
    },
    {
      id: 'deal',
      name: 'deal',
      duration: 1.6,
      loop: true,
      tags: ['attack'],
      intent: 'offer the cards',
      bones: [
        { bone: 'hand_l', rotate: [k(0, 0), k(0.4, -14), k(0.9, 6), k(1.6, 0)] },
        { bone: 'arm_l', rotate: [k(0, 0), k(0.45, -8), k(1.6, 0)] },
        { bone: 'torso', rotate: [k(0, 0), k(0.5, -3), k(1.6, 0)] },
        { bone: 'head', rotate: [k(0, 0), k(0.6, 4), k(1.6, 0)] },
      ],
    },
    {
      id: 'win',
      name: 'win',
      duration: 2.2,
      loop: false,
      tags: ['win'],
      intent: 'small jackpot nod',
      bones: [
        { bone: 'root', translateY: [k(0, 0), k(0.35, -12), k(0.7, -4), k(1.2, -14), k(2.2, 0)] },
        { bone: 'head', rotate: [k(0, 0), k(0.4, -6), k(1.1, 6), k(2.2, 0)] },
        { bone: 'torso', scaleY: [k(0, 1), k(0.5, 1.04), k(2.2, 1)], scaleX: [k(0, 1), k(0.5, 1.03), k(2.2, 1)] },
        { bone: 'hand_l', rotate: [k(0, 0), k(0.6, -10), k(2.2, 0)] },
        { bone: 'hand_r', rotate: [k(0, 0), k(0.6, 8), k(2.2, 0)] },
      ],
    },
  ]
}
