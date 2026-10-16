import type { ArcDocument, Attachment, BoneDef, SlotDef } from '../schema/types'
import type { ArtPiece } from './layerSplit'

export interface PieceImage {
  id: string
  /** data URL or path — original pixels, never repainted per frame */
  path: string
}

const TARGET_HEIGHT = 220

/**
 * Infer a reusable skeleton from cut pieces.
 * Bone ids match the motion library so any clip retargets without a new rig.
 */
export function rigFromPieces(name: string, pieces: ArtPiece[], images: PieceImage[]): ArcDocument {
  const byId = new Map(pieces.map((p) => [p.id, p]))
  const img = new Map(images.map((i) => [i.id, i.path]))
  const torso = byId.get('torso')
  const hipX = torso ? torso.x + torso.pivotX : 0
  const hipY = torso ? torso.y + torso.pivotY : 0
  const height = pieces.reduce((m, p) => Math.max(m, p.y + p.h), 1)
  const top = pieces.reduce((m, p) => Math.min(m, p.y), height)
  const scale = TARGET_HEIGHT / Math.max(1, height - top)

  const world = new Map<string, { x: number; y: number }>()
  world.set('root', { x: 0, y: 0 })
  for (const p of pieces) {
    world.set(p.id, {
      x: (p.x + p.pivotX - hipX) * scale,
      y: (p.y + p.pivotY - hipY) * scale,
    })
  }

  const bones: BoneDef[] = [
    {
      id: 'root',
      name: 'root',
      parent: null,
      length: 0,
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      color: '#e8c45c',
    },
  ]

  const attachments: Attachment[] = []
  const slots: SlotDef[] = []
  let order = 0
  const drawRank: Record<string, number> = {
    thigh_l: 2,
    shin_l: 3,
    foot_l: 4,
    thigh_r: 5,
    shin_r: 6,
    foot_r: 7,
    torso: 10,
    arm_l: 12,
    forearm_l: 13,
    hand_l: 14,
    arm_r: 15,
    forearm_r: 16,
    hand_r: 17,
    head: 30,
  }

  for (const p of pieces) {
    const parentId = p.parent === 'root' || p.parent === null ? 'root' : p.parent
    const parentW = world.get(parentId)!
    const selfW = world.get(p.id)!
    bones.push({
      id: p.id,
      name: p.id,
      parent: parentId,
      length: Math.max(p.w, p.h) * scale * 0.5,
      x: selfW.x - parentW.x,
      y: selfW.y - parentW.y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      color: '#5ecf9a',
    })

    const path = img.get(p.id)
    attachments.push({
      id: `att_${p.id}`,
      kind: 'region',
      name: p.id,
      width: p.w * scale,
      height: p.h * scale,
      // Pivot sits on the bone origin; the crop extends around it.
      x: (p.w / 2 - p.pivotX) * scale,
      y: (p.h / 2 - p.pivotY) * scale,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      path,
      fill: '#5ecf9a',
    })
    slots.push({
      id: `sl_${p.id}`,
      name: p.id,
      bone: p.id,
      attachment: `att_${p.id}`,
      color: '#ffffffff',
      blend: 'normal',
      drawOrder: drawRank[p.id] ?? order++,
    })
  }

  return {
    meta: {
      name,
      version: '1.0',
      fps: 30,
      unit: 1,
      createdBy: 'ai',
      notes:
        'Auto-rigged from cut artwork. Pixels are original piece crops; motion is skeletal retarget, not per-frame redraw.',
    },
    bones,
    slots,
    attachments,
    skins: [
      {
        id: 'default',
        name: 'Default',
        attachments: Object.fromEntries(slots.map((s) => [s.id, s.attachment!])),
      },
    ],
    constraints: [],
    animations: [],
    defaultSkin: 'default',
  }
}
