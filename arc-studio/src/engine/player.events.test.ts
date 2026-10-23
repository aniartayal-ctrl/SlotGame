import { describe, expect, it } from 'vitest'
import { collectEvents } from './player'
import type { EventKeyframe } from '../schema/types'
import { compileSymbolKit } from '../ai/symbolKit'
import { defaultSpinScript, ReelStage } from './reelStage'

describe('collectEvents', () => {
  const events: EventKeyframe[] = [
    { time: 0, name: 'land' },
    { time: 0.2, name: 'land-settle' },
    { time: 0.45, name: 'loop-end' },
  ]

  it('fires crossings in (from, to]', () => {
    expect(collectEvents(events, 0, 0.2).map((e) => e.name)).toEqual(['land-settle'])
    expect(collectEvents(events, 0.2, 0.45).map((e) => e.name)).toEqual(['loop-end'])
  })

  it('can include zero at start', () => {
    expect(collectEvents(events, -0.001, 0.1, true).map((e) => e.name)).toEqual(['land'])
  })
})

describe('Kinetic Pro symbol kit', () => {
  it('seeds six states with game events', () => {
    const { doc } = compileSymbolKit('Gold Gem')
    const ids = doc.animations.map((a) => a.id)
    expect(ids).toEqual(['idle', 'land', 'win-small', 'win-big', 'anticipation', 'dim'])
    const land = doc.animations.find((a) => a.id === 'land')!
    expect(land.events?.some((e) => e.name === 'land')).toBe(true)
    const winBig = doc.animations.find((a) => a.id === 'win-big')!
    expect(winBig.events?.filter((e) => e.name === 'win-peak').length).toBeGreaterThanOrEqual(1)
    expect(winBig.events?.some((e) => e.name === 'win-start')).toBe(true)
  })
})

describe('ReelStage scripted spin', () => {
  it('logs land → win-start → win-peak in order on a scripted spin', () => {
    const { doc } = compileSymbolKit('Gold Gem')
    const stage = new ReelStage(doc)
    stage.playScript(defaultSpinScript())

    // Spin + anticipate + land + full win-big (~4.3s) at 60fps
    for (let i = 0; i < 300; i++) stage.tick(1 / 60)

    const names = stage.eventLog.map((e) => e.event.name)
    expect(names).toContain('land')
    expect(names).toContain('win-start')
    expect(names).toContain('win-peak')

    const firstLand = names.indexOf('land')
    const firstWinStart = names.indexOf('win-start')
    const firstWinPeak = names.indexOf('win-peak')
    expect(firstLand).toBeGreaterThanOrEqual(0)
    expect(firstWinStart).toBeGreaterThan(firstLand)
    expect(firstWinPeak).toBeGreaterThan(firstWinStart)
    expect(stage.phaseName).toBe('done')
  })
})
