import { applyPatches } from '../schema/applyPatch'
import type { ArcDocument, ArcPatch, CompileRequest, CompileResult } from '../schema/types'
import { assertValid } from '../schema/validate'
import { buildRig, parseRigIntent } from '../ai/rigger'
import { directMotion, parseMotionIntent } from '../ai/director'

/**
 * ARC Compiler — AI intent → validated schema patches → document.
 * Geometry/rendering stay in the deterministic engine; AI only mutates data.
 */
export function compile(request: CompileRequest): CompileResult {
  const log: string[] = []
  const patches: ArcPatch[] = []
  let doc = request.base ? structuredClone(request.base) : emptyDoc('Untitled')

  const mode = request.mode
  const intent = request.intent.trim()
  log.push(`Compile mode=${mode}`)
  log.push(`Intent: ${intent}`)

  if (mode === 'rig' || mode === 'both') {
    const rigIntent = parseRigIntent(intent, request.archetype || 'Character')
    if (request.archetype) rigIntent.archetype = request.archetype as typeof rigIntent.archetype
    if (request.style) rigIntent.style = request.style
    log.push(`Rigger → archetype=${rigIntent.archetype} features=[${rigIntent.features.join(', ')}]`)
    const rigged = buildRig(rigIntent)
    // Preserve animations if mutating existing
    if (request.base && mode === 'both') {
      rigged.animations = request.base.animations
    }
    patches.push({ op: 'replaceDoc', doc: rigged })
    doc = rigged
  }

  if (mode === 'animate' || mode === 'both') {
    const motion = parseMotionIntent(intent)
    log.push(`Director → kind=${motion.kind} duration=${motion.duration}s loop=${motion.loop}`)
    const anim = directMotion(doc, motion)
    patches.push({ op: 'upsertAnimation', animation: anim })
    doc = applyPatches(doc, [{ op: 'upsertAnimation', animation: anim }])
    patches.push({ op: 'setMeta', meta: { createdBy: doc.meta.createdBy === 'human' ? 'hybrid' : 'ai' } })
    doc = applyPatches(doc, [{ op: 'setMeta', meta: { createdBy: doc.meta.createdBy === 'human' ? 'hybrid' : 'ai' } }])
  }

  assertValid(doc)
  log.push(`Bones=${doc.bones.length} slots=${doc.slots.length} anims=${doc.animations.length}`)
  return { doc, patches, log }
}

export function emptyDoc(name: string): ArcDocument {
  return {
    meta: { name, version: '1.0', fps: 60, unit: 1, createdBy: 'human' },
    bones: [
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
        color: '#5ecf9a',
      },
    ],
    slots: [],
    attachments: [],
    skins: [{ id: 'default', name: 'Default', attachments: {} }],
    constraints: [],
    animations: [],
    defaultSkin: 'default',
  }
}
