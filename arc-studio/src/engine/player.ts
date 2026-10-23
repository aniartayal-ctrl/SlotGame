import type { ArcDocument, EventKeyframe } from '../schema/types'
import { renderFrame, setAssetReadyListener, type Camera, type RenderOptions } from './renderer'
import { solvePose } from './solver'

export interface PlayerState {
  playing: boolean
  time: number
  animationId: string | null
  speed: number
}

export type ArcEventListener = (event: EventKeyframe, meta: { animationId: string; time: number }) => void

/**
 * Collect events whose time is in (from, to] on a non-wrapping interval.
 * At t=0, events with time===0 fire when from < 0 (start) or explicitly requested.
 */
export function collectEvents(
  events: EventKeyframe[] | undefined,
  from: number,
  to: number,
  includeZeroAtStart = false,
): EventKeyframe[] {
  if (!events?.length) return []
  const out: EventKeyframe[] = []
  for (const ev of events) {
    const t = ev.time
    if (includeZeroAtStart && t === 0 && from <= 0 && to >= 0) {
      out.push(ev)
      continue
    }
    if (t > from && t <= to) out.push(ev)
  }
  return out.sort((a, b) => a.time - b.time || a.name.localeCompare(b.name))
}

export class ArcPlayer {
  canvas: HTMLCanvasElement
  doc: ArcDocument
  state: PlayerState
  camera: Camera
  options: RenderOptions
  private raf = 0
  private lastTs = 0
  private listeners = new Set<() => void>()
  private eventListeners = new Set<ArcEventListener>()
  private cssW = 800
  private cssH = 600
  /** When true, the next advance fires t=0 events. */
  private fireZeroPending = true

  constructor(canvas: HTMLCanvasElement, doc: ArcDocument) {
    this.canvas = canvas
    this.doc = doc
    this.state = {
      playing: true,
      time: 0,
      animationId: doc.animations[0]?.id ?? null,
      speed: 1,
    }
    this.camera = { x: 0, y: -20, zoom: 1.35 }
    this.options = {
      showBones: false,
      showLabels: false,
      showGrid: true,
      selectedBone: null,
      background: '#0e1418',
      stylized: true,
      time: 0,
      animTags: [],
    }
    setAssetReadyListener(() => this.draw())
  }

  setDocument(doc: ArcDocument) {
    this.doc = doc
    if (!doc.animations.find((a) => a.id === this.state.animationId)) {
      this.state.animationId = doc.animations[0]?.id ?? null
    }
    this.emit()
    this.draw()
  }

  onChange(fn: () => void) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  /** Subscribe to animation.events as the clock crosses them. */
  onEvent(fn: ArcEventListener) {
    this.eventListeners.add(fn)
    return () => this.eventListeners.delete(fn)
  }

  private emit() {
    for (const fn of this.listeners) fn()
  }

  private emitEvents(events: EventKeyframe[]) {
    const animationId = this.state.animationId ?? ''
    for (const ev of events) {
      for (const fn of this.eventListeners) {
        fn(ev, { animationId, time: this.state.time })
      }
    }
  }

  private advanceEvents(from: number, to: number, looped: boolean, duration: number) {
    const anim = this.currentAnim()
    const events = anim?.events
    if (!events?.length) return

    if (looped) {
      const tail = collectEvents(events, from, duration, false)
      const head = collectEvents(events, -Number.EPSILON, to, this.fireZeroPending)
      this.emitEvents([...tail, ...head])
    } else {
      this.emitEvents(collectEvents(events, from, to, this.fireZeroPending && from <= 0))
    }
    this.fireZeroPending = false
  }

  play() {
    this.state.playing = true
    this.lastTs = 0
    this.tick()
    this.emit()
  }

  pause() {
    this.state.playing = false
    cancelAnimationFrame(this.raf)
    this.emit()
  }

  toggle() {
    if (this.state.playing) this.pause()
    else this.play()
  }

  seek(time: number, opts: { fireEvents?: boolean } = {}) {
    const anim = this.currentAnim()
    const dur = anim?.duration ?? 1
    const from = this.state.time
    this.state.time = anim?.loop ? ((time % dur) + dur) % dur : Math.max(0, Math.min(dur, time))
    if (opts.fireEvents) {
      const looped = anim?.loop && this.state.time < from
      this.advanceEvents(from, this.state.time, !!looped, dur)
    } else {
      this.fireZeroPending = this.state.time <= 0
    }
    this.draw()
    this.emit()
  }

  setAnimation(id: string | null) {
    this.state.animationId = id
    this.state.time = 0
    this.fireZeroPending = true
    this.draw()
    this.emit()
  }

  currentAnim() {
    return this.doc.animations.find((a) => a.id === this.state.animationId) ?? null
  }

  private tick = (ts?: number) => {
    if (!this.state.playing) return
    if (ts !== undefined) {
      if (this.lastTs) {
        const dt = ((ts - this.lastTs) / 1000) * this.state.speed
        const anim = this.currentAnim()
        if (anim) {
          const from = this.state.time
          let t = from + dt
          let looped = false
          if (anim.loop) {
            const dur = anim.duration || 1
            if (t >= dur) {
              looped = true
              t = t % dur
            }
          } else {
            t = Math.min(t, anim.duration)
          }
          this.state.time = t
          this.advanceEvents(from, t, looped, anim.duration || 1)
        }
      }
      this.lastTs = ts
    }
    this.draw()
    this.emit()
    this.raf = requestAnimationFrame(this.tick)
  }

  draw() {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()
    this.cssW = Math.max(1, rect.width)
    this.cssH = Math.max(1, rect.height)
    const bw = Math.max(1, Math.floor(this.cssW * dpr))
    const bh = Math.max(1, Math.floor(this.cssH * dpr))
    if (this.canvas.width !== bw || this.canvas.height !== bh) {
      this.canvas.width = bw
      this.canvas.height = bh
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const pose = solvePose(this.doc, this.state.animationId, this.state.time)
    const anim = this.currentAnim()
    renderFrame(
      ctx,
      this.doc,
      pose,
      this.camera,
      {
        ...this.options,
        time: this.state.time,
        animTags: anim?.tags ?? [],
      },
      {
        width: this.cssW,
        height: this.cssH,
      },
    )
  }

  start() {
    this.play()
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.listeners.clear()
    this.eventListeners.clear()
  }
}
