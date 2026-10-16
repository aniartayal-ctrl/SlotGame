import type { ArcDocument, ArcPatch } from './types'

export function applyPatch(doc: ArcDocument, patch: ArcPatch): ArcDocument {
  switch (patch.op) {
    case 'replaceDoc':
      return structuredClone(patch.doc)
    case 'setBones':
      return { ...doc, bones: structuredClone(patch.bones) }
    case 'upsertBone': {
      const i = doc.bones.findIndex((b) => b.id === patch.bone.id)
      const bones = [...doc.bones]
      if (i >= 0) bones[i] = structuredClone(patch.bone)
      else bones.push(structuredClone(patch.bone))
      return { ...doc, bones }
    }
    case 'removeBone':
      return {
        ...doc,
        bones: doc.bones.filter((b) => b.id !== patch.id),
        slots: doc.slots.filter((s) => s.bone !== patch.id),
        constraints: doc.constraints.filter((c) => {
          if (c.kind === 'ik') return !c.bones.includes(patch.id) && c.target !== patch.id
          return c.bone !== patch.id && c.target !== patch.id
        }),
      }
    case 'setSlots':
      return { ...doc, slots: structuredClone(patch.slots) }
    case 'setAttachments':
      return { ...doc, attachments: structuredClone(patch.attachments) }
    case 'setConstraints':
      return { ...doc, constraints: structuredClone(patch.constraints) }
    case 'upsertAnimation': {
      const i = doc.animations.findIndex((a) => a.id === patch.animation.id)
      const animations = [...doc.animations]
      if (i >= 0) animations[i] = structuredClone(patch.animation)
      else animations.push(structuredClone(patch.animation))
      return { ...doc, animations }
    }
    case 'removeAnimation':
      return { ...doc, animations: doc.animations.filter((a) => a.id !== patch.id) }
    case 'setDefaultSkin':
      return { ...doc, defaultSkin: patch.id }
    case 'setMeta':
      return { ...doc, meta: { ...doc.meta, ...patch.meta } }
    default:
      return doc
  }
}

export function applyPatches(doc: ArcDocument, patches: ArcPatch[]): ArcDocument {
  return patches.reduce(applyPatch, doc)
}
