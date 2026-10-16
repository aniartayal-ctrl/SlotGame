import type { AnimationDef, ArcDocument, BoneTimeline, Keyframe } from '../schema/types'

export type MotionKind =
  | 'idle'
  | 'walk'
  | 'win'
  | 'spin-hook'
  | 'attack'
  | 'fly'
  | 'bounce'
  | 'celebrate'
  | 'custom'

export interface MotionIntent {
  kind: MotionKind
  name: string
  duration: number
  loop: boolean
  intensity: number
  raw: string
}

const k = (time: number, value: number, curve: Keyframe['curve'] = 'linear'): Keyframe => ({
  time,
  value,
  curve,
})

/** Procedural motion director — writes animation timelines into schema (never matrices). */
export function parseMotionIntent(text: string): MotionIntent {
  const t = text.toLowerCase()
  let kind: MotionKind = 'custom'
  if (/\b(idle|breathe|rest)\b/.test(t)) kind = 'idle'
  else if (/\b(walk|run|stride)\b/.test(t)) kind = 'walk'
  else if (/\b(win|jackpot|big.?win)\b/.test(t)) kind = 'win'
  else if (/\b(spin|reel|hook)\b/.test(t)) kind = 'spin-hook'
  else if (/\b(attack|slash|punch|hit)\b/.test(t)) kind = 'attack'
  else if (/\b(fly|flap|soar)\b/.test(t)) kind = 'fly'
  else if (/\b(bounce|hop|jump)\b/.test(t)) kind = 'bounce'
  else if (/\b(celebrat|cheer|dance)\b/.test(t)) kind = 'celebrate'

  const durMatch = t.match(/(\d+(?:\.\d+)?)\s*(s|sec|seconds?)/)
  const duration = durMatch ? parseFloat(durMatch[1]) : defaultDuration(kind)

  let intensity = 1
  if (/\b(subtle|soft|gentle)\b/.test(t)) intensity = 0.45
  if (/\b(big|intense|wild|crazy|epic)\b/.test(t)) intensity = 1.6

  const loop = !/\b(once|oneshot|one-shot)\b/.test(t) && kind !== 'win' && kind !== 'attack' && kind !== 'spin-hook'

  const nameMatch = text.match(/(?:named|called|name[:\s]+)["']?([A-Za-z0-9 _-]+)/i)
  const name = nameMatch?.[1]?.trim() || kind

  return { kind, name, duration, loop, intensity, raw: text }
}

function defaultDuration(kind: MotionKind): number {
  switch (kind) {
    case 'idle':
      return 2.4
    case 'walk':
      return 0.9
    case 'win':
      return 2.2
    case 'spin-hook':
      return 1.4
    case 'attack':
      return 0.7
    case 'fly':
      return 1.2
    case 'bounce':
      return 0.8
    case 'celebrate':
      return 1.6
    default:
      return 1.5
  }
}

export function directMotion(doc: ArcDocument, intent: MotionIntent): AnimationDef {
  const ids = new Set(doc.bones.map((b) => b.id))
  const has = (...names: string[]) => names.every((n) => ids.has(n))
  const I = intent.intensity
  const D = intent.duration

  let bones: BoneTimeline[] = []

  switch (intent.kind) {
    case 'idle':
      bones = idleClip(ids, D, I)
      break
    case 'walk':
      bones = has('thigh_l', 'thigh_r') ? walkHumanoid(D, I) : walkSimple(ids, D, I)
      break
    case 'win':
    case 'celebrate':
      bones = winClip(ids, D, I)
      break
    case 'spin-hook':
      bones = spinHook(ids, D, I)
      break
    case 'attack':
      bones = attackClip(ids, D, I)
      break
    case 'fly':
      bones = flyClip(ids, D, I)
      break
    case 'bounce':
      bones = bounceClip(ids, D, I)
      break
    default:
      bones = customFromText(ids, intent)
  }

  // Filter to existing bones only
  bones = bones.filter((b) => ids.has(b.bone))

  return {
    id: slug(intent.name),
    name: intent.name,
    duration: D,
    loop: intent.loop,
    bones,
    tags: [intent.kind],
    intent: intent.raw,
  }
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'anim'
}

function idleClip(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const amp = 4 * I
  const out: BoneTimeline[] = []
  if (ids.has('chest') || ids.has('body') || ids.has('spine')) {
    const bone = ids.has('chest') ? 'chest' : ids.has('spine') ? 'spine' : 'body'
    out.push({
      bone,
      scaleY: [k(0, 1), k(D * 0.5, 1 + 0.03 * I), k(D, 1)],
      translateY: [k(0, 0), k(D * 0.5, -amp * 0.3), k(D, 0)],
    })
  }
  if (ids.has('head')) {
    out.push({
      bone: 'head',
      rotate: [k(0, 0), k(D * 0.5, 3 * I), k(D, 0)],
    })
  }
  if (ids.has('arm_l')) {
    out.push({ bone: 'arm_l', rotate: [k(0, 0), k(D * 0.5, -4 * I), k(D, 0)] })
  }
  if (ids.has('arm_r')) {
    out.push({ bone: 'arm_r', rotate: [k(0, 0), k(D * 0.5, 4 * I), k(D, 0)] })
  }
  if (ids.has('tail') || ids.has('tail_1')) {
    const bone = ids.has('tail_1') ? 'tail_1' : 'tail'
    out.push({ bone, rotate: [k(0, -8 * I), k(D * 0.5, 8 * I), k(D, -8 * I)] })
  }
  if (ids.has('wing_l') || ids.has('wing_l_1')) {
    const bone = ids.has('wing_l_1') ? 'wing_l_1' : 'wing_l'
    out.push({ bone, rotate: [k(0, 0), k(D * 0.5, 6 * I), k(D, 0)] })
  }
  if (ids.has('core')) {
    out.push({
      bone: 'core',
      scaleX: [k(0, 1), k(D * 0.5, 1.04), k(D, 1)],
      scaleY: [k(0, 1), k(D * 0.5, 1.04), k(D, 1)],
    })
  }
  return out
}

function walkHumanoid(D: number, I: number): BoneTimeline[] {
  const a = 28 * I
  return [
    {
      bone: 'root',
      translateY: [k(0, 0), k(D * 0.25, -6 * I), k(D * 0.5, 0), k(D * 0.75, -6 * I), k(D, 0)],
    },
    {
      bone: 'thigh_l',
      rotate: [k(0, a), k(D * 0.5, -a), k(D, a)],
    },
    {
      bone: 'thigh_r',
      rotate: [k(0, -a), k(D * 0.5, a), k(D, -a)],
    },
    {
      bone: 'shin_l',
      rotate: [k(0, 10 * I), k(D * 0.25, 40 * I), k(D * 0.5, 10 * I), k(D * 0.75, 5 * I), k(D, 10 * I)],
    },
    {
      bone: 'shin_r',
      rotate: [k(0, 10 * I), k(D * 0.25, 5 * I), k(D * 0.5, 10 * I), k(D * 0.75, 40 * I), k(D, 10 * I)],
    },
    {
      bone: 'arm_l',
      rotate: [k(0, -a * 0.7), k(D * 0.5, a * 0.7), k(D, -a * 0.7)],
    },
    {
      bone: 'arm_r',
      rotate: [k(0, a * 0.7), k(D * 0.5, -a * 0.7), k(D, a * 0.7)],
    },
    {
      bone: 'chest',
      rotate: [k(0, -3 * I), k(D * 0.5, 3 * I), k(D, -3 * I)],
    },
  ]
}

function walkSimple(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const out: BoneTimeline[] = []
  if (ids.has('leg_l') && ids.has('leg_r')) {
    out.push(
      { bone: 'leg_l', rotate: [k(0, 20 * I), k(D * 0.5, -20 * I), k(D, 20 * I)] },
      { bone: 'leg_r', rotate: [k(0, -20 * I), k(D * 0.5, 20 * I), k(D, -20 * I)] },
    )
  }
  if (ids.has('leg_fl')) {
    out.push(
      { bone: 'leg_fl', rotate: [k(0, 18 * I), k(D * 0.5, -18 * I), k(D, 18 * I)] },
      { bone: 'leg_fr', rotate: [k(0, -18 * I), k(D * 0.5, 18 * I), k(D, -18 * I)] },
      { bone: 'leg_bl', rotate: [k(0, -18 * I), k(D * 0.5, 18 * I), k(D, -18 * I)] },
      { bone: 'leg_br', rotate: [k(0, 18 * I), k(D * 0.5, -18 * I), k(D, 18 * I)] },
    )
  }
  if (ids.has('body') || ids.has('root')) {
    const bone = ids.has('body') ? 'body' : 'root'
    out.push({
      bone,
      translateY: [k(0, 0), k(D * 0.25, -4 * I), k(D * 0.5, 0), k(D * 0.75, -4 * I), k(D, 0)],
    })
  }
  return out.length ? out : bounceClip(ids, D, I)
}

function winClip(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const out: BoneTimeline[] = [
    {
      bone: ids.has('root') ? 'root' : [...ids][0],
      translateY: [k(0, 0), k(D * 0.2, -30 * I), k(D * 0.45, -10 * I), k(D * 0.7, -35 * I), k(D, 0)],
      scaleX: [k(0, 1), k(D * 0.3, 1.08), k(D * 0.6, 1.12), k(D, 1)],
      scaleY: [k(0, 1), k(D * 0.3, 1.08), k(D * 0.6, 1.12), k(D, 1)],
      rotate: [k(0, 0), k(D * 0.35, -8 * I), k(D * 0.65, 8 * I), k(D, 0)],
    },
  ]
  if (ids.has('arm_l')) {
    out.push({
      bone: 'arm_l',
      rotate: [k(0, 0), k(D * 0.25, -90 * I), k(D * 0.5, -70 * I), k(D * 0.75, -100 * I), k(D, -40 * I)],
    })
  }
  if (ids.has('arm_r')) {
    out.push({
      bone: 'arm_r',
      rotate: [k(0, 0), k(D * 0.25, 90 * I), k(D * 0.5, 70 * I), k(D * 0.75, 100 * I), k(D, 40 * I)],
    })
  }
  if (ids.has('head')) {
    out.push({ bone: 'head', rotate: [k(0, 0), k(D * 0.4, -12 * I), k(D * 0.7, 12 * I), k(D, 0)] })
  }
  if (ids.has('wing_l') || ids.has('wing_l_1')) {
    const l = ids.has('wing_l_1') ? 'wing_l_1' : 'wing_l'
    const r = ids.has('wing_r_1') ? 'wing_r_1' : 'wing_r'
    out.push(
      { bone: l, rotate: [k(0, 0), k(D * 0.3, -40 * I), k(D * 0.6, 10 * I), k(D, -20 * I)] },
      { bone: r, rotate: [k(0, 0), k(D * 0.3, 40 * I), k(D * 0.6, -10 * I), k(D, 20 * I)] },
    )
  }
  if (ids.has('spark_l')) {
    out.push(
      {
        bone: 'spark_l',
        rotate: [k(0, 0), k(D, 360)],
        translateX: [k(0, 0), k(D * 0.5, -20 * I), k(D, 0)],
      },
      {
        bone: 'spark_r',
        rotate: [k(0, 0), k(D, -360)],
        translateX: [k(0, 0), k(D * 0.5, 20 * I), k(D, 0)],
      },
      {
        bone: 'core',
        scaleX: [k(0, 1), k(D * 0.4, 1.25 * I), k(D, 1)],
        scaleY: [k(0, 1), k(D * 0.4, 1.25 * I), k(D, 1)],
        rotate: [k(0, 0), k(D, 180)],
      },
    )
  }
  return out
}

function spinHook(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const bone = ids.has('core') ? 'core' : ids.has('root') ? 'root' : [...ids][0]
  return [
    {
      bone,
      rotate: [k(0, 0), k(D * 0.55, 720 * I), k(D, 720 * I)],
      scaleX: [k(0, 1), k(D * 0.2, 0.7), k(D * 0.55, 1.2), k(D, 1)],
      scaleY: [k(0, 1), k(D * 0.2, 0.7), k(D * 0.55, 1.2), k(D, 1)],
      translateY: [k(0, 0), k(D * 0.3, -20 * I), k(D * 0.7, 10 * I), k(D, 0)],
    },
  ]
}

function attackClip(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const out: BoneTimeline[] = []
  if (ids.has('arm_r') || ids.has('blade')) {
    const bone = ids.has('blade') ? 'handle' : 'arm_r'
    if (ids.has(bone) || ids.has('handle')) {
      out.push({
        bone: ids.has('handle') ? 'handle' : bone,
        rotate: [k(0, -40 * I), k(D * 0.35, -60 * I), k(D * 0.55, 80 * I), k(D, 20 * I)],
      })
    }
  }
  if (ids.has('chest')) {
    out.push({
      bone: 'chest',
      rotate: [k(0, 0), k(D * 0.35, -8 * I), k(D * 0.55, 12 * I), k(D, 0)],
      translateX: [k(0, 0), k(D * 0.55, 18 * I), k(D, 0)],
    })
  }
  if (ids.has('root')) {
    out.push({
      bone: 'root',
      translateX: [k(0, 0), k(D * 0.55, 24 * I), k(D, 8 * I)],
    })
  }
  return out.length ? out : bounceClip(ids, D, I)
}

function flyClip(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const out: BoneTimeline[] = []
  if (ids.has('root')) {
    out.push({
      bone: 'root',
      translateY: [k(0, 0), k(D * 0.5, -18 * I), k(D, 0)],
    })
  }
  const l = ids.has('wing_l_1') ? 'wing_l_1' : ids.has('wing_l') ? 'wing_l' : null
  const r = ids.has('wing_r_1') ? 'wing_r_1' : ids.has('wing_r') ? 'wing_r' : null
  if (l && r) {
    out.push(
      { bone: l, rotate: [k(0, 25 * I), k(D * 0.5, -35 * I), k(D, 25 * I)] },
      { bone: r, rotate: [k(0, -25 * I), k(D * 0.5, 35 * I), k(D, -25 * I)] },
    )
  }
  if (ids.has('wing_l_2')) {
    out.push(
      { bone: 'wing_l_2', rotate: [k(0, 10 * I), k(D * 0.5, -20 * I), k(D, 10 * I)] },
      { bone: 'wing_r_2', rotate: [k(0, -10 * I), k(D * 0.5, 20 * I), k(D, -10 * I)] },
    )
  }
  return out.length ? out : idleClip(ids, D, I)
}

function bounceClip(ids: Set<string>, D: number, I: number): BoneTimeline[] {
  const bone = ids.has('root') ? 'root' : ids.has('body') ? 'body' : [...ids][0]
  return [
    {
      bone,
      translateY: [k(0, 0), k(D * 0.45, -40 * I), k(D * 0.7, 4 * I), k(D, 0)],
      scaleX: [k(0, 1), k(D * 0.45, 0.92), k(D * 0.7, 1.12), k(D, 1)],
      scaleY: [k(0, 1), k(D * 0.45, 1.1), k(D * 0.7, 0.9), k(D, 1)],
    },
  ]
}

function customFromText(ids: Set<string>, intent: MotionIntent): BoneTimeline[] {
  // Keyword spice on top of idle
  const base = idleClip(ids, intent.duration, intent.intensity)
  if (/\bspin|turn|twirl\b/.test(intent.raw.toLowerCase()) && ids.has('root')) {
    base.push({
      bone: 'root',
      rotate: [k(0, 0), k(intent.duration, 360 * intent.intensity)],
    })
  }
  if (/\bwave\b/.test(intent.raw.toLowerCase()) && ids.has('arm_r')) {
    base.push({
      bone: 'arm_r',
      rotate: [
        k(0, 60),
        k(intent.duration * 0.25, 90),
        k(intent.duration * 0.5, 50),
        k(intent.duration * 0.75, 90),
        k(intent.duration, 60),
      ],
    })
  }
  return base
}
