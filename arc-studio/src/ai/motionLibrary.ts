import type { ArcDocument } from '../schema/types'
import { compile } from '../compiler/compile'

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

export function applyMotionLibrary(doc: ArcDocument): ArcDocument {
  let current = doc
  for (const clip of MOTION_LIBRARY) {
    current = compile({ intent: clip.intent, mode: 'animate', base: current }).doc
  }
  return current
}
