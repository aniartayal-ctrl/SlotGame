import type { ArcDocument, EventKeyframe, SlotTimeline } from '../schema/types'
import { compile } from '../compiler/compile'
import { directMotion, parseMotionIntent } from './director'

/** Canonical six states for a Kinetic Pro slot symbol. */
export const SYMBOL_STATES = [
  'idle',
  'land',
  'win-small',
  'win-big',
  'anticipation',
  'dim',
] as const

export type SymbolState = (typeof SYMBOL_STATES)[number]

const STATE_INTENTS: Record<SymbolState, string> = {
  idle: 'slot symbol idle breathe loop 2.0 seconds named idle',
  land: 'slot symbol land once 0.45 seconds named land',
  'win-small': 'slot symbol win-small once 1.1 seconds named win-small',
  'win-big': 'slot symbol win-big epic once 1.8 seconds named win-big',
  anticipation: 'slot symbol anticipation loop 1.2 seconds named anticipation',
  dim: 'slot symbol dim once 0.35 seconds named dim',
}

/** Events a math / reel client can hear. Times are seconds into the clip. */
export function eventsForState(state: SymbolState, duration: number): EventKeyframe[] {
  switch (state) {
    case 'idle':
      return [{ time: duration, name: 'loop-end', string: 'idle' }]
    case 'land':
      return [
        { time: 0, name: 'land' },
        { time: Math.min(duration * 0.55, duration), name: 'land-settle' },
        { time: duration, name: 'loop-end', string: 'land' },
      ]
    case 'win-small':
      return [
        { time: 0, name: 'win-start', int: 1 },
        { time: duration * 0.4, name: 'win-peak', int: 1 },
        { time: duration, name: 'loop-end', string: 'win-small' },
      ]
    case 'win-big':
      return [
        { time: 0, name: 'win-start', int: 2 },
        { time: duration * 0.35, name: 'win-peak', int: 2 },
        { time: duration * 0.7, name: 'win-peak', int: 2, string: 'second' },
        { time: duration, name: 'loop-end', string: 'win-big' },
      ]
    case 'anticipation':
      return [
        { time: 0, name: 'anticipation-start' },
        { time: duration * 0.5, name: 'anticipation-pulse' },
        { time: duration, name: 'loop-end', string: 'anticipation' },
      ]
    case 'dim':
      return [
        { time: 0, name: 'dim-start' },
        { time: duration, name: 'loop-end', string: 'dim' },
      ]
  }
}

function dimSlotTimelines(doc: ArcDocument, duration: number): SlotTimeline[] {
  return doc.slots.map((s) => ({
    slot: s.id,
    color: [
      { time: 0, value: s.color || '#ffffffff', curve: 'linear' as const },
      { time: duration, value: '#ffffff55', curve: 'linear' as const },
    ],
  }))
}

/** Rig a gold gem and seed all six Kinetic Pro symbol states with timed events. */
export function compileSymbolKit(name = 'Gold Gem'): { doc: ArcDocument; log: string[] } {
  const log: string[] = [`Kinetic Pro symbol kit · ${name}`]
  let doc = compile({
    intent: `${name} gold slot gem symbol`,
    mode: 'rig',
    archetype: 'slot-symbol',
  }).doc
  log.push(`Rigged ${doc.bones.length} bones · ${doc.slots.length} slots`)

  for (const state of SYMBOL_STATES) {
    const intentText = STATE_INTENTS[state]
    const motion = parseMotionIntent(intentText)
    let anim = directMotion(doc, { ...motion, name: state })
    anim = {
      ...anim,
      id: state,
      name: state,
      tags: Array.from(new Set([...(anim.tags ?? []), state, 'slot-symbol'])),
      events: eventsForState(state, anim.duration),
      slots: state === 'dim' ? dimSlotTimelines(doc, anim.duration) : anim.slots,
    }
    doc = {
      ...doc,
      animations: [...doc.animations.filter((a) => a.id !== state), anim],
    }
    log.push(
      `Clip ${state} · ${anim.duration.toFixed(2)}s · events=${(anim.events ?? []).map((e) => e.name).join(',')}`,
    )
  }

  doc = {
    ...doc,
    meta: { ...doc.meta, name, notes: 'Kinetic Pro six-state slot symbol', createdBy: 'ai' },
    animations: SYMBOL_STATES.map((id) => doc.animations.find((a) => a.id === id)!).filter(Boolean),
  }

  return { doc, log }
}

/** Apply the six symbol clips onto an existing slot-symbol (or core/glow) rig. */
export function applySymbolMotionLibrary(base: ArcDocument): ArcDocument {
  const kit = compileSymbolKit(base.meta.name || 'Symbol')
  return {
    ...base,
    animations: kit.doc.animations,
    meta: {
      ...base.meta,
      notes: kit.doc.meta.notes,
      createdBy: base.meta.createdBy === 'human' ? 'hybrid' : 'ai',
    },
  }
}
