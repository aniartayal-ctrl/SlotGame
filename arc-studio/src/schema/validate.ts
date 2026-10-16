import type { ArcDocument, BoneDef } from './types'

export interface ValidationIssue {
  level: 'error' | 'warn'
  path: string
  message: string
}

export function validateDocument(doc: ArcDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const boneIds = new Set(doc.bones.map((b) => b.id))
  const slotIds = new Set(doc.slots.map((s) => s.id))
  const attIds = new Set(doc.attachments.map((a) => a.id))
  const skinIds = new Set(doc.skins.map((s) => s.id))

  if (!doc.meta?.name) issues.push({ level: 'error', path: 'meta.name', message: 'Document needs a name' })
  if (doc.meta?.version !== '1.0') {
    issues.push({ level: 'warn', path: 'meta.version', message: `Unexpected version ${doc.meta?.version}` })
  }

  for (const bone of doc.bones) {
    if (bone.parent && !boneIds.has(bone.parent)) {
      issues.push({ level: 'error', path: `bones.${bone.id}`, message: `Missing parent ${bone.parent}` })
    }
    if (bone.parent === bone.id) {
      issues.push({ level: 'error', path: `bones.${bone.id}`, message: 'Bone cannot parent itself' })
    }
  }

  if (hasCycle(doc.bones)) {
    issues.push({ level: 'error', path: 'bones', message: 'Bone hierarchy contains a cycle' })
  }

  for (const slot of doc.slots) {
    if (!boneIds.has(slot.bone)) {
      issues.push({ level: 'error', path: `slots.${slot.id}`, message: `Unknown bone ${slot.bone}` })
    }
    if (slot.attachment && !attIds.has(slot.attachment)) {
      issues.push({ level: 'error', path: `slots.${slot.id}`, message: `Unknown attachment ${slot.attachment}` })
    }
  }

  for (const skin of doc.skins) {
    for (const [slotId, attId] of Object.entries(skin.attachments)) {
      if (!slotIds.has(slotId)) {
        issues.push({ level: 'error', path: `skins.${skin.id}`, message: `Unknown slot ${slotId}` })
      }
      if (!attIds.has(attId)) {
        issues.push({ level: 'error', path: `skins.${skin.id}`, message: `Unknown attachment ${attId}` })
      }
    }
  }

  if (!skinIds.has(doc.defaultSkin)) {
    issues.push({ level: 'error', path: 'defaultSkin', message: `Unknown default skin ${doc.defaultSkin}` })
  }

  for (const c of doc.constraints) {
    if (c.kind === 'ik') {
      for (const b of c.bones) {
        if (!boneIds.has(b)) issues.push({ level: 'error', path: `constraints.${c.id}`, message: `Unknown bone ${b}` })
      }
      if (!boneIds.has(c.target)) {
        issues.push({ level: 'error', path: `constraints.${c.id}`, message: `Unknown target ${c.target}` })
      }
    }
  }

  for (const anim of doc.animations) {
    if (anim.duration < 0) {
      issues.push({ level: 'error', path: `animations.${anim.id}`, message: 'Negative duration' })
    }
    for (const bt of anim.bones) {
      if (!boneIds.has(bt.bone)) {
        issues.push({ level: 'error', path: `animations.${anim.id}`, message: `Unknown bone ${bt.bone}` })
      }
    }
  }

  return issues
}

function hasCycle(bones: BoneDef[]): boolean {
  const parent = new Map(bones.map((b) => [b.id, b.parent]))
  for (const b of bones) {
    const seen = new Set<string>()
    let cur: string | null = b.id
    while (cur) {
      if (seen.has(cur)) return true
      seen.add(cur)
      cur = parent.get(cur) ?? null
    }
  }
  return false
}

export function assertValid(doc: ArcDocument): void {
  const errors = validateDocument(doc).filter((i) => i.level === 'error')
  if (errors.length) {
    throw new Error(`Invalid ARC document:\n` + errors.map((e) => `- ${e.path}: ${e.message}`).join('\n'))
  }
}
