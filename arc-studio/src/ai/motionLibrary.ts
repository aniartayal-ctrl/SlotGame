import type { ArcDocument } from '../schema/types'
import { compile } from '../compiler/compile'
import { applySymbolMotionLibrary } from './symbolKit'

/**
 * Clip library retargeted onto whatever rig shares these bone ids.
 * Same idea as God Mode's ~400 clips: rig once, apply many motions.
 */
export const MOTION_LIBRARY: { id: string; label: string; intent: string }[] = [
  { id: 'idle', label: 'Idle', intent: 'gentle idle breathe loop 2.4 seconds named idle' },
  { id: 'walk', label: 'Walk', intent: 'walk cycle 0.9 seconds named walk' },
  { id: 'attack', label: 'Attack', intent: 'attack slash once named attack' },
  { id: 'win', label: 'Win', intent: 'epic big win jackpot once named win' },
  { id: 'celebrate', label: 'Celebrate', intent: 'celebrate dance loop 1.6 seconds named celebrate' },
]

/** Kinetic Pro symbol states — preferred when the rig has a `core` bone. */
export const SYMBOL_MOTION_LIBRARY: { id: string; label: string; intent: string }[] = [
  { id: 'idle', label: 'Idle', intent: 'slot symbol idle breathe loop 2.0 seconds named idle' },
  { id: 'land', label: 'Land', intent: 'slot symbol land once 0.45 seconds named land' },
  { id: 'win-small', label: 'Win small', intent: 'slot symbol win-small once named win-small' },
  { id: 'win-big', label: 'Win big', intent: 'slot symbol win-big epic once named win-big' },
  { id: 'anticipation', label: 'Anticipation', intent: 'slot symbol anticipation loop named anticipation' },
  { id: 'dim', label: 'Dim', intent: 'slot symbol dim once named dim' },
]

export function applyMotionLibrary(doc: ArcDocument): ArcDocument {
  if (doc.bones.some((b) => b.id === 'core') && !doc.bones.some((b) => b.id === 'thigh_l')) {
    return applySymbolMotionLibrary(doc)
  }
  let current = doc
  for (const clip of MOTION_LIBRARY) {
    current = compile({ intent: clip.intent, mode: 'animate', base: current }).doc
  }
  return current
}
