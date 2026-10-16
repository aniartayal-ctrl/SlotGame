import type {
  ArcDocument,
  BoneDef,
  BoneId,
  IkConstraint,
  SkinDef,
  SlotDef,
  AnimationDef,
  Attachment,
} from '../schema/types'
import { fromTRS, getRotation, getTranslation, identity, mul, type Mat3, transformPoint } from './math'
import { solveIk1, solveIk2 } from './ik'
import { sampleDiscrete, sampleScalar } from './timeline'

export interface BonePose {
  id: BoneId
  local: Mat3
  world: Mat3
  /** Local channels after animation, before IK */
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
}

export interface SolvedPose {
  bones: Map<BoneId, BonePose>
  /** slotId → active attachment */
  slotAttachments: Map<string, Attachment | null>
  slotColors: Map<string, string>
  drawOrder: SlotDef[]
}

function topoBones(bones: BoneDef[]): BoneDef[] {
  const byId = new Map(bones.map((b) => [b.id, b]))
  const result: BoneDef[] = []
  const visiting = new Set<string>()
  const done = new Set<string>()

  function visit(id: string) {
    if (done.has(id) || !byId.has(id)) return
    if (visiting.has(id)) return
    visiting.add(id)
    const b = byId.get(id)!
    if (b.parent) visit(b.parent)
    visiting.delete(id)
    done.add(id)
    result.push(b)
  }
  for (const b of bones) visit(b.id)
  return result
}

function restChannels(bone: BoneDef) {
  return {
    x: bone.x,
    y: bone.y,
    rotation: bone.rotation,
    scaleX: bone.scaleX,
    scaleY: bone.scaleY,
  }
}

function applyAnimation(
  bone: BoneDef,
  anim: AnimationDef | null,
  time: number,
): ReturnType<typeof restChannels> {
  const base = restChannels(bone)
  if (!anim) return base
  const tl = anim.bones.find((b) => b.bone === bone.id)
  if (!tl) return base

  const rotation = sampleScalar(tl.rotate, time, true)
  const x = sampleScalar(tl.translateX, time)
  const y = sampleScalar(tl.translateY, time)
  const scaleX = sampleScalar(tl.scaleX, time)
  const scaleY = sampleScalar(tl.scaleY, time)

  return {
    x: x !== undefined ? base.x + x : base.x,
    y: y !== undefined ? base.y + y : base.y,
    rotation: rotation !== undefined ? base.rotation + rotation : base.rotation,
    scaleX: scaleX !== undefined ? base.scaleX * scaleX : base.scaleX,
    scaleY: scaleY !== undefined ? base.scaleY * scaleY : base.scaleY,
  }
}

function rebuildWorld(ordered: BoneDef[], poses: Map<BoneId, BonePose>): void {
  for (const bone of ordered) {
    const pose = poses.get(bone.id)!
    pose.local = fromTRS(pose.x, pose.y, pose.rotation, pose.scaleX, pose.scaleY)
    if (bone.parent) {
      const parent = poses.get(bone.parent)!
      pose.world = mul(parent.world, pose.local)
    } else {
      pose.world = pose.local
    }
  }
}

function applyIk(
  constraint: IkConstraint,
  bonesById: Map<BoneId, BoneDef>,
  poses: Map<BoneId, BonePose>,
  ordered: BoneDef[],
): void {
  const targetPose = poses.get(constraint.target)
  if (!targetPose) return
  const target = getTranslation(targetPose.world)
  const mix = constraint.mix

  if (constraint.chain === 1 || constraint.bones.length === 1) {
    const boneId = constraint.bones[0]
    const bone = bonesById.get(boneId)
    const pose = poses.get(boneId)
    if (!bone || !pose) return
    const parentWorld = bone.parent ? poses.get(bone.parent)!.world : identity()
    const worldOrigin = bone.parent
      ? getTranslation(parentWorld)
      : getTranslation(pose.world)

    const { rotation } = solveIk1(worldOrigin, target, bone.length || 1)
    const parentRot = bone.parent ? getRotation(parentWorld) : 0
    const localRot = rotation - parentRot
    pose.rotation = pose.rotation + (localRot - pose.rotation) * mix
    rebuildWorld(ordered, poses)
    return
  }

  // 2-bone
  const [aId, bId] = constraint.bones
  const boneA = bonesById.get(aId)
  const boneB = bonesById.get(bId)
  const poseA = poses.get(aId)
  const poseB = poses.get(bId)
  if (!boneA || !boneB || !poseA || !poseB) return

  const parentWorld = boneA.parent ? poses.get(boneA.parent)!.world : identity()
  const root = boneA.parent ? getTranslation(parentWorld) : getTranslation(poseA.world)

  const solved = solveIk2(root, target, boneA.length || 40, boneB.length || 40, constraint.bendPositive)
  const parentRot = boneA.parent ? getRotation(parentWorld) : 0

  const desiredLocalA = solved.rotA - parentRot
  const desiredLocalB = solved.rotB - solved.rotA

  poseA.rotation = poseA.rotation + (desiredLocalA - poseA.rotation) * mix
  poseB.rotation = poseB.rotation + (desiredLocalB - poseB.rotation) * mix
  rebuildWorld(ordered, poses)
}

export function solvePose(
  doc: ArcDocument,
  animationId: string | null,
  time: number,
): SolvedPose {
  const anim = animationId ? doc.animations.find((a) => a.id === animationId) ?? null : null
  const ordered = topoBones(doc.bones)
  const bonesById = new Map(doc.bones.map((b) => [b.id, b]))
  const poses = new Map<BoneId, BonePose>()

  for (const bone of ordered) {
    const ch = applyAnimation(bone, anim, time)
    const local = fromTRS(ch.x, ch.y, ch.rotation, ch.scaleX, ch.scaleY)
    const world = bone.parent ? mul(poses.get(bone.parent)!.world, local) : local
    poses.set(bone.id, {
      id: bone.id,
      local,
      world,
      ...ch,
    })
  }

  for (const c of doc.constraints) {
    if (c.kind === 'ik' && c.mix > 0) applyIk(c, bonesById, poses, ordered)
  }

  const skin: SkinDef | undefined = doc.skins.find((s) => s.id === doc.defaultSkin)
  const attById = new Map(doc.attachments.map((a) => [a.id, a]))
  const slotAttachments = new Map<string, Attachment | null>()
  const slotColors = new Map<string, string>()

  for (const slot of doc.slots) {
    let attId = skin?.attachments[slot.id] ?? slot.attachment
    let color = slot.color
    if (anim?.slots) {
      const st = anim.slots.find((s) => s.slot === slot.id)
      if (st?.attachment) {
        const v = sampleDiscrete(st.attachment, time)
        if (v !== undefined) attId = v
      }
      if (st?.color) {
        const v = sampleDiscrete(st.color, time)
        if (v !== undefined) color = v
      }
    }
    slotAttachments.set(slot.id, attId ? attById.get(attId) ?? null : null)
    slotColors.set(slot.id, color)
  }

  const drawOrder = [...doc.slots].sort((a, b) => a.drawOrder - b.drawOrder)

  return { bones: poses, slotAttachments, slotColors, drawOrder }
}

export function boneTipWorld(pose: BonePose, length: number) {
  return transformPoint(pose.world, { x: length, y: 0 })
}
