import type {
  ArcDocument,
  Attachment,
  BoneDef,
  Constraint,
  SlotDef,
  SkinDef,
} from '../schema/types'

export type Archetype =
  | 'humanoid'
  | 'mascot'
  | 'dragon'
  | 'slot-symbol'
  | 'quadruped'
  | 'prop'

export interface RigIntent {
  name: string
  archetype: Archetype
  style?: string
  /** Extra limbs / features from free text */
  features: string[]
}

const COLORS = {
  torso: '#3d8f7a',
  limb: '#5ecf9a',
  head: '#e8c45c',
  prop: '#7eb8ff',
  accent: '#ff8a5b',
}

function bone(
  id: string,
  name: string,
  parent: string | null,
  length: number,
  x: number,
  y: number,
  rotation = 0,
  color = COLORS.limb,
): BoneDef {
  return {
    id,
    name,
    parent,
    length,
    x,
    y,
    rotation,
    scaleX: 1,
    scaleY: 1,
    color,
  }
}

function region(
  id: string,
  name: string,
  w: number,
  h: number,
  fill: string,
  opts: Partial<{ x: number; y: number; rotation: number; stroke: string }> = {},
): Attachment {
  return {
    id,
    kind: 'region',
    name,
    width: w,
    height: h,
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    rotation: opts.rotation ?? 0,
    scaleX: 1,
    scaleY: 1,
    fill,
    stroke: opts.stroke ?? 'rgba(0,0,0,0.25)',
    cornerRadius: 6,
  }
}

function slot(id: string, name: string, boneId: string, att: string, order: number, color = '#ffffffff'): SlotDef {
  return {
    id,
    name,
    bone: boneId,
    attachment: att,
    color,
    blend: 'normal',
    drawOrder: order,
  }
}

/** Parse free-text into a structured rig intent (local procedural AI). */
export function parseRigIntent(text: string, fallbackName = 'Character'): RigIntent {
  const t = text.toLowerCase()
  let archetype: Archetype = 'humanoid'
  if (/\b(dragon|wyvern|lizard)\b/.test(t)) archetype = 'dragon'
  else if (/\b(mascot|cartoon|cute|chibi)\b/.test(t)) archetype = 'mascot'
  else if (/\b(symbol|gem|coin|reel|icon)\b/.test(t)) archetype = 'slot-symbol'
  else if (/\b(dog|cat|horse|wolf|quad|animal)\b/.test(t)) archetype = 'quadruped'
  else if (/\b(sword|prop|weapon|chest|chestbox)\b/.test(t)) archetype = 'prop'
  else if (/\b(human|hero|girl|boy|warrior|dealer)\b/.test(t)) archetype = 'humanoid'

  const features: string[] = []
  if (/\bwings?\b/.test(t)) features.push('wings')
  if (/\btail\b/.test(t)) features.push('tail')
  if (/\bhorn/.test(t)) features.push('horns')
  if (/\bcrown\b/.test(t)) features.push('crown')
  if (/\bcloak|cape\b/.test(t)) features.push('cape')

  const nameMatch = text.match(/(?:named|called|name[:\s]+)["']?([A-Za-z0-9 _-]+)/i)
  const name = nameMatch?.[1]?.trim() || fallbackName

  let style = 'clean'
  if (/\bneon\b/.test(t)) style = 'neon'
  if (/\bgold|luxury|casino\b/.test(t)) style = 'casino'
  if (/\bpixel\b/.test(t)) style = 'pixel'

  return { name, archetype, style, features }
}

export function buildRig(intent: RigIntent): ArcDocument {
  switch (intent.archetype) {
    case 'dragon':
      return buildDragon(intent)
    case 'mascot':
      return buildMascot(intent)
    case 'slot-symbol':
      return buildSymbol(intent)
    case 'quadruped':
      return buildQuadruped(intent)
    case 'prop':
      return buildProp(intent)
    default:
      return buildHumanoid(intent)
  }
}

function finish(
  name: string,
  bones: BoneDef[],
  slots: SlotDef[],
  attachments: Attachment[],
  constraints: Constraint[],
  notes: string,
): ArcDocument {
  const skin: SkinDef = {
    id: 'default',
    name: 'Default',
    attachments: Object.fromEntries(slots.filter((s) => s.attachment).map((s) => [s.id, s.attachment!])),
  }
  return {
    meta: {
      name,
      version: '1.0',
      fps: 60,
      unit: 1,
      createdBy: 'ai',
      notes,
    },
    bones,
    slots,
    attachments,
    skins: [skin],
    constraints,
    animations: [],
    defaultSkin: 'default',
  }
}

function buildHumanoid(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.torso),
    bone('hip', 'hip', 'root', 20, 0, 0, -90, COLORS.torso),
    bone('spine', 'spine', 'hip', 50, 20, 0, 0, COLORS.torso),
    bone('chest', 'chest', 'spine', 36, 50, 0, 0, COLORS.torso),
    bone('neck', 'neck', 'chest', 16, 36, 0, 0, COLORS.head),
    bone('head', 'head', 'neck', 28, 16, 0, 0, COLORS.head),
    bone('shoulder_l', 'shoulder_l', 'chest', 18, 30, -12, 160, COLORS.limb),
    bone('arm_l', 'arm_l', 'shoulder_l', 42, 18, 0, 0, COLORS.limb),
    bone('forearm_l', 'forearm_l', 'arm_l', 38, 42, 0, 0, COLORS.limb),
    bone('hand_l', 'hand_l', 'forearm_l', 14, 38, 0, 0, COLORS.accent),
    bone('shoulder_r', 'shoulder_r', 'chest', 18, 30, 12, 20, COLORS.limb),
    bone('arm_r', 'arm_r', 'shoulder_r', 42, 18, 0, 0, COLORS.limb),
    bone('forearm_r', 'forearm_r', 'arm_r', 38, 42, 0, 0, COLORS.limb),
    bone('hand_r', 'hand_r', 'forearm_r', 14, 38, 0, 0, COLORS.accent),
    bone('thigh_l', 'thigh_l', 'hip', 48, 0, -10, 200, COLORS.limb),
    bone('shin_l', 'shin_l', 'thigh_l', 46, 48, 0, 0, COLORS.limb),
    bone('foot_l', 'foot_l', 'shin_l', 18, 46, 0, 70, COLORS.accent),
    bone('thigh_r', 'thigh_r', 'hip', 48, 0, 10, -20, COLORS.limb),
    bone('shin_r', 'shin_r', 'thigh_r', 46, 48, 0, 0, COLORS.limb),
    bone('foot_r', 'foot_r', 'shin_r', 18, 46, 0, -70, COLORS.accent),
    bone('ik_hand_l', 'ik_hand_l', 'root', 0, -70, -40, 0, COLORS.prop),
    bone('ik_hand_r', 'ik_hand_r', 'root', 0, 70, -40, 0, COLORS.prop),
    bone('ik_foot_l', 'ik_foot_l', 'root', 0, -30, 110, 0, COLORS.prop),
    bone('ik_foot_r', 'ik_foot_r', 'root', 0, 30, 110, 0, COLORS.prop),
  ]

  if (intent.features.includes('wings')) {
    bones.push(
      bone('wing_l', 'wing_l', 'chest', 55, 20, -8, 200, COLORS.prop),
      bone('wing_r', 'wing_r', 'chest', 55, 20, 8, -20, COLORS.prop),
    )
  }
  if (intent.features.includes('tail')) {
    bones.push(
      bone('tail_1', 'tail_1', 'hip', 28, 0, 0, 90, COLORS.accent),
      bone('tail_2', 'tail_2', 'tail_1', 26, 28, 0, 0, COLORS.accent),
      bone('tail_3', 'tail_3', 'tail_2', 22, 26, 0, 0, COLORS.accent),
    )
  }
  if (intent.features.includes('crown')) {
    bones.push(bone('crown', 'crown', 'head', 16, 20, 0, -90, COLORS.head))
  }
  if (intent.features.includes('cape')) {
    bones.push(
      bone('cape_1', 'cape_1', 'chest', 40, 10, 0, 90, COLORS.prop),
      bone('cape_2', 'cape_2', 'cape_1', 36, 40, 0, 0, COLORS.prop),
    )
  }

  const palette = paletteFor(intent.style)
  const attachments: Attachment[] = [
    region('att_torso', 'torso', 44, 70, palette.torso, { x: 25, y: 0 }),
    region('att_head', 'head', 40, 44, palette.head, { x: 16, y: 0 }),
    region('att_arm_l', 'arm_l', 14, 40, palette.limb, { x: 20, y: 0 }),
    region('att_forearm_l', 'forearm_l', 12, 36, palette.limb, { x: 18, y: 0 }),
    region('att_arm_r', 'arm_r', 14, 40, palette.limb, { x: 20, y: 0 }),
    region('att_forearm_r', 'forearm_r', 12, 36, palette.limb, { x: 18, y: 0 }),
    region('att_thigh_l', 'thigh_l', 16, 44, palette.limb, { x: 22, y: 0 }),
    region('att_shin_l', 'shin_l', 14, 42, palette.limb, { x: 22, y: 0 }),
    region('att_thigh_r', 'thigh_r', 16, 44, palette.limb, { x: 22, y: 0 }),
    region('att_shin_r', 'shin_r', 14, 42, palette.limb, { x: 22, y: 0 }),
    region('att_hand_l', 'hand_l', 14, 14, palette.accent, { x: 6, y: 0 }),
    region('att_hand_r', 'hand_r', 14, 14, palette.accent, { x: 6, y: 0 }),
    region('att_foot_l', 'foot_l', 22, 10, palette.accent, { x: 8, y: 0 }),
    region('att_foot_r', 'foot_r', 22, 10, palette.accent, { x: 8, y: 0 }),
  ]

  if (intent.features.includes('wings')) {
    attachments.push(
      region('att_wing_l', 'wing_l', 50, 28, palette.prop, { x: 24, y: 0 }),
      region('att_wing_r', 'wing_r', 50, 28, palette.prop, { x: 24, y: 0 }),
    )
  }
  if (intent.features.includes('tail')) {
    attachments.push(
      region('att_tail_1', 'tail_1', 12, 26, palette.accent, { x: 12, y: 0 }),
      region('att_tail_2', 'tail_2', 10, 24, palette.accent, { x: 12, y: 0 }),
      region('att_tail_3', 'tail_3', 8, 20, palette.accent, { x: 10, y: 0 }),
    )
  }
  if (intent.features.includes('crown')) {
    attachments.push(region('att_crown', 'crown', 28, 16, '#e8c45c', { x: 6, y: 0 }))
  }
  if (intent.features.includes('cape')) {
    attachments.push(
      region('att_cape_1', 'cape_1', 36, 40, palette.prop, { x: 18, y: 0 }),
      region('att_cape_2', 'cape_2', 32, 36, palette.prop, { x: 16, y: 0 }),
    )
  }

  const slots: SlotDef[] = [
    slot('sl_torso', 'torso', 'spine', 'att_torso', 10),
    slot('sl_head', 'head', 'head', 'att_head', 50),
    slot('sl_arm_l', 'arm_l', 'arm_l', 'att_arm_l', 8),
    slot('sl_forearm_l', 'forearm_l', 'forearm_l', 'att_forearm_l', 7),
    slot('sl_arm_r', 'arm_r', 'arm_r', 'att_arm_r', 20),
    slot('sl_forearm_r', 'forearm_r', 'forearm_r', 'att_forearm_r', 21),
    slot('sl_thigh_l', 'thigh_l', 'thigh_l', 'att_thigh_l', 5),
    slot('sl_shin_l', 'shin_l', 'shin_l', 'att_shin_l', 4),
    slot('sl_thigh_r', 'thigh_r', 'thigh_r', 'att_thigh_r', 15),
    slot('sl_shin_r', 'shin_r', 'shin_r', 'att_shin_r', 16),
    slot('sl_hand_l', 'hand_l', 'hand_l', 'att_hand_l', 9),
    slot('sl_hand_r', 'hand_r', 'hand_r', 'att_hand_r', 22),
    slot('sl_foot_l', 'foot_l', 'foot_l', 'att_foot_l', 3),
    slot('sl_foot_r', 'foot_r', 'foot_r', 'att_foot_r', 17),
  ]

  if (intent.features.includes('wings')) {
    slots.push(
      slot('sl_wing_l', 'wing_l', 'wing_l', 'att_wing_l', 2),
      slot('sl_wing_r', 'wing_r', 'wing_r', 'att_wing_r', 25),
    )
  }
  if (intent.features.includes('tail')) {
    slots.push(
      slot('sl_tail_1', 'tail_1', 'tail_1', 'att_tail_1', 1),
      slot('sl_tail_2', 'tail_2', 'tail_2', 'att_tail_2', 1),
      slot('sl_tail_3', 'tail_3', 'tail_3', 'att_tail_3', 1),
    )
  }
  if (intent.features.includes('crown')) {
    slots.push(slot('sl_crown', 'crown', 'crown', 'att_crown', 55))
  }
  if (intent.features.includes('cape')) {
    slots.push(
      slot('sl_cape_1', 'cape_1', 'cape_1', 'att_cape_1', 0),
      slot('sl_cape_2', 'cape_2', 'cape_2', 'att_cape_2', 0),
    )
  }

  const constraints: Constraint[] = [
    {
      id: 'ik_arm_l',
      kind: 'ik',
      name: 'Arm L IK',
      bones: ['arm_l', 'forearm_l'],
      target: 'ik_hand_l',
      mix: 0,
      bendPositive: true,
      chain: 2,
    },
    {
      id: 'ik_arm_r',
      kind: 'ik',
      name: 'Arm R IK',
      bones: ['arm_r', 'forearm_r'],
      target: 'ik_hand_r',
      mix: 0,
      bendPositive: false,
      chain: 2,
    },
    {
      id: 'ik_leg_l',
      kind: 'ik',
      name: 'Leg L IK',
      bones: ['thigh_l', 'shin_l'],
      target: 'ik_foot_l',
      mix: 0,
      bendPositive: false,
      chain: 2,
    },
    {
      id: 'ik_leg_r',
      kind: 'ik',
      name: 'Leg R IK',
      bones: ['thigh_r', 'shin_r'],
      target: 'ik_foot_r',
      mix: 0,
      bendPositive: true,
      chain: 2,
    },
  ]

  return finish(
    intent.name,
    bones,
    slots,
    attachments,
    constraints,
    `AI-rigged humanoid (${intent.style}). Features: ${intent.features.join(', ') || 'none'}`,
  )
}

function buildMascot(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.torso),
    bone('body', 'body', 'root', 50, 0, 0, -90, COLORS.torso),
    bone('head', 'head', 'body', 36, 50, 0, 0, COLORS.head),
    bone('arm_l', 'arm_l', 'body', 34, 30, -16, 150, COLORS.limb),
    bone('arm_r', 'arm_r', 'body', 34, 30, 16, 30, COLORS.limb),
    bone('leg_l', 'leg_l', 'root', 32, -14, 10, 100, COLORS.limb),
    bone('leg_r', 'leg_r', 'root', 32, 14, 10, 80, COLORS.limb),
  ]
  if (intent.features.includes('tail')) {
    bones.push(bone('tail', 'tail', 'body', 40, 8, 0, 100, COLORS.accent))
  }

  const p = paletteFor(intent.style)
  const attachments: Attachment[] = [
    region('att_body', 'body', 56, 64, p.torso, { x: 28, y: 0 }),
    region('att_head', 'head', 52, 48, p.head, { x: 20, y: 0 }),
    region('att_arm_l', 'arm_l', 16, 34, p.limb, { x: 16, y: 0 }),
    region('att_arm_r', 'arm_r', 16, 34, p.limb, { x: 16, y: 0 }),
    region('att_leg_l', 'leg_l', 16, 30, p.limb, { x: 14, y: 0 }),
    region('att_leg_r', 'leg_r', 16, 30, p.limb, { x: 14, y: 0 }),
  ]
  if (intent.features.includes('tail')) {
    attachments.push(region('att_tail', 'tail', 14, 36, p.accent, { x: 18, y: 0 }))
  }

  const slots: SlotDef[] = [
    slot('sl_body', 'body', 'body', 'att_body', 10),
    slot('sl_head', 'head', 'head', 'att_head', 20),
    slot('sl_arm_l', 'arm_l', 'arm_l', 'att_arm_l', 5),
    slot('sl_arm_r', 'arm_r', 'arm_r', 'att_arm_r', 15),
    slot('sl_leg_l', 'leg_l', 'leg_l', 'att_leg_l', 2),
    slot('sl_leg_r', 'leg_r', 'leg_r', 'att_leg_r', 3),
  ]
  if (intent.features.includes('tail')) {
    slots.push(slot('sl_tail', 'tail', 'tail', 'att_tail', 1))
  }

  return finish(intent.name, bones, slots, attachments, [], `AI-rigged mascot (${intent.style})`)
}

function buildDragon(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.torso),
    bone('pelvis', 'pelvis', 'root', 24, 0, 0, -90, COLORS.torso),
    bone('spine_1', 'spine_1', 'pelvis', 36, 24, 0, 0, COLORS.torso),
    bone('spine_2', 'spine_2', 'spine_1', 36, 36, 0, 0, COLORS.torso),
    bone('neck', 'neck', 'spine_2', 28, 36, 0, -20, COLORS.head),
    bone('head', 'head', 'neck', 34, 28, 0, 0, COLORS.head),
    bone('jaw', 'jaw', 'head', 22, 18, 8, 40, COLORS.accent),
    bone('wing_l_1', 'wing_l_1', 'spine_2', 40, 10, -10, 200, COLORS.prop),
    bone('wing_l_2', 'wing_l_2', 'wing_l_1', 48, 40, 0, 0, COLORS.prop),
    bone('wing_r_1', 'wing_r_1', 'spine_2', 40, 10, 10, -20, COLORS.prop),
    bone('wing_r_2', 'wing_r_2', 'wing_r_1', 48, 40, 0, 0, COLORS.prop),
    bone('tail_1', 'tail_1', 'pelvis', 32, 0, 0, 100, COLORS.accent),
    bone('tail_2', 'tail_2', 'tail_1', 30, 32, 0, 0, COLORS.accent),
    bone('tail_3', 'tail_3', 'tail_2', 28, 30, 0, 0, COLORS.accent),
    bone('leg_l', 'leg_l', 'pelvis', 36, 8, -12, 120, COLORS.limb),
    bone('leg_r', 'leg_r', 'pelvis', 36, 8, 12, 60, COLORS.limb),
  ]

  const p = paletteFor(intent.style ?? 'casino')
  const attachments: Attachment[] = [
    region('att_body', 'body', 48, 70, p.torso, { x: 30, y: 0 }),
    region('att_head', 'head', 44, 36, p.head, { x: 16, y: 0 }),
    region('att_jaw', 'jaw', 28, 14, p.accent, { x: 10, y: 0 }),
    region('att_wing_l', 'wing_l', 70, 34, p.prop, { x: 30, y: 0 }),
    region('att_wing_r', 'wing_r', 70, 34, p.prop, { x: 30, y: 0 }),
    region('att_tail', 'tail', 16, 80, p.accent, { x: 40, y: 0 }),
    region('att_leg_l', 'leg_l', 16, 34, p.limb, { x: 16, y: 0 }),
    region('att_leg_r', 'leg_r', 16, 34, p.limb, { x: 16, y: 0 }),
  ]

  const slots: SlotDef[] = [
    slot('sl_wing_l', 'wing_l', 'wing_l_1', 'att_wing_l', 1),
    slot('sl_wing_r', 'wing_r', 'wing_r_1', 'att_wing_r', 30),
    slot('sl_tail', 'tail', 'tail_1', 'att_tail', 2),
    slot('sl_body', 'body', 'spine_1', 'att_body', 10),
    slot('sl_leg_l', 'leg_l', 'leg_l', 'att_leg_l', 5),
    slot('sl_leg_r', 'leg_r', 'leg_r', 'att_leg_r', 15),
    slot('sl_head', 'head', 'head', 'att_head', 40),
    slot('sl_jaw', 'jaw', 'jaw', 'att_jaw', 41),
  ]

  return finish(intent.name, bones, slots, attachments, [], 'AI-rigged dragon for slot win moments')
}

function buildSymbol(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.torso),
    bone('core', 'core', 'root', 40, 0, 0, -90, COLORS.head),
    bone('glow', 'glow', 'core', 20, 20, 0, 0, COLORS.prop),
    bone('spark_l', 'spark_l', 'core', 28, 10, -20, 160, COLORS.accent),
    bone('spark_r', 'spark_r', 'core', 28, 10, 20, 20, COLORS.accent),
  ]
  const p = paletteFor('casino')
  const attachments: Attachment[] = [
    region('att_core', 'core', 72, 72, p.head, { x: 20, y: 0 }),
    region('att_glow', 'glow', 96, 96, p.prop + '55', { x: 0, y: 0 }),
    region('att_spark_l', 'spark_l', 18, 18, p.accent, { x: 12, y: 0 }),
    region('att_spark_r', 'spark_r', 18, 18, p.accent, { x: 12, y: 0 }),
  ]
  const slots: SlotDef[] = [
    slot('sl_glow', 'glow', 'glow', 'att_glow', 1),
    slot('sl_core', 'core', 'core', 'att_core', 10),
    slot('sl_spark_l', 'spark_l', 'spark_l', 'att_spark_l', 20),
    slot('sl_spark_r', 'spark_r', 'spark_r', 'att_spark_r', 21),
  ]
  return finish(intent.name || 'Symbol', bones, slots, attachments, [], 'AI-rigged slot symbol')
}

function buildQuadruped(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.torso),
    bone('body', 'body', 'root', 70, 0, 0, 0, COLORS.torso),
    bone('neck', 'neck', 'body', 28, 70, 0, -40, COLORS.head),
    bone('head', 'head', 'neck', 26, 28, 0, 0, COLORS.head),
    bone('leg_fl', 'leg_fl', 'body', 40, 55, -16, 90, COLORS.limb),
    bone('leg_fr', 'leg_fr', 'body', 40, 55, 16, 90, COLORS.limb),
    bone('leg_bl', 'leg_bl', 'body', 40, 10, -16, 90, COLORS.limb),
    bone('leg_br', 'leg_br', 'body', 40, 10, 16, 90, COLORS.limb),
    bone('tail', 'tail', 'body', 36, 0, 0, 160, COLORS.accent),
  ]
  const p = paletteFor(intent.style)
  const attachments: Attachment[] = [
    region('att_body', 'body', 80, 36, p.torso, { x: 35, y: 0 }),
    region('att_head', 'head', 34, 28, p.head, { x: 12, y: 0 }),
    region('att_leg_fl', 'leg_fl', 12, 38, p.limb, { x: 18, y: 0 }),
    region('att_leg_fr', 'leg_fr', 12, 38, p.limb, { x: 18, y: 0 }),
    region('att_leg_bl', 'leg_bl', 12, 38, p.limb, { x: 18, y: 0 }),
    region('att_leg_br', 'leg_br', 12, 38, p.limb, { x: 18, y: 0 }),
    region('att_tail', 'tail', 12, 34, p.accent, { x: 16, y: 0 }),
  ]
  const slots: SlotDef[] = [
    slot('sl_body', 'body', 'body', 'att_body', 10),
    slot('sl_head', 'head', 'head', 'att_head', 20),
    slot('sl_leg_fl', 'leg_fl', 'leg_fl', 'att_leg_fl', 5),
    slot('sl_leg_fr', 'leg_fr', 'leg_fr', 'att_leg_fr', 15),
    slot('sl_leg_bl', 'leg_bl', 'leg_bl', 'att_leg_bl', 4),
    slot('sl_leg_br', 'leg_br', 'leg_br', 'att_leg_br', 14),
    slot('sl_tail', 'tail', 'tail', 'att_tail', 1),
  ]
  return finish(intent.name, bones, slots, attachments, [], 'AI-rigged quadruped')
}

function buildProp(intent: RigIntent): ArcDocument {
  const bones: BoneDef[] = [
    bone('root', 'root', null, 0, 0, 0, 0, COLORS.prop),
    bone('handle', 'handle', 'root', 50, 0, 0, -90, COLORS.prop),
    bone('blade', 'blade', 'handle', 70, 50, 0, 0, COLORS.accent),
    bone('tip', 'tip', 'blade', 16, 70, 0, 0, COLORS.head),
  ]
  const p = paletteFor(intent.style)
  const attachments: Attachment[] = [
    region('att_handle', 'handle', 14, 48, p.torso, { x: 24, y: 0 }),
    region('att_blade', 'blade', 22, 68, p.accent, { x: 34, y: 0 }),
    region('att_tip', 'tip', 16, 16, p.head, { x: 6, y: 0 }),
  ]
  const slots: SlotDef[] = [
    slot('sl_handle', 'handle', 'handle', 'att_handle', 1),
    slot('sl_blade', 'blade', 'blade', 'att_blade', 2),
    slot('sl_tip', 'tip', 'tip', 'att_tip', 3),
  ]
  return finish(intent.name || 'Prop', bones, slots, attachments, [], 'AI-rigged prop')
}

function paletteFor(style?: string) {
  if (style === 'neon') {
    return { torso: '#1f6f6a', limb: '#3dffc5', head: '#f0ff66', accent: '#ff4d9a', prop: '#66d9ff' }
  }
  if (style === 'casino') {
    return { torso: '#2a4a3c', limb: '#c9a227', head: '#f0d78c', accent: '#d4543a', prop: '#8bb8a8' }
  }
  if (style === 'pixel') {
    return { torso: '#3a5f4a', limb: '#6aa84f', head: '#f6b26b', accent: '#e06666', prop: '#6fa8dc' }
  }
  return { torso: '#2f6b5a', limb: '#5ecf9a', head: '#e8c45c', accent: '#ff8a5b', prop: '#7eb8ff' }
}
