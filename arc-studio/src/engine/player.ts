import type { ArcDocument } from '../schema/types'
import { renderFrame, setAssetReadyListener, type Camera, type RenderOptions } from './renderer'
import { solvePose } from './solver'

export interface PlayerState {
  playing: boolean
  time: number
  animationId: string | null
  speed: number
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
  private cssW = 800
  private cssH = 600

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

  private emit() {
    for (const fn of this.listeners) fn()
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

  seek(time: number) {
    const anim = this.currentAnim()
    const dur = anim?.duration ?? 1
    this.state.time = anim?.loop ? ((time % dur) + dur) % dur : Math.max(0, Math.min(dur, time))
    this.draw()
    this.emit()
  }

  setAnimation(id: string | null) {
    this.state.animationId = id
    this.state.time = 0
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
          let t = this.state.time + dt
          if (anim.loop) t = t % (anim.duration || 1)
          else t = Math.min(t, anim.duration)
          this.state.time = t
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
  }
}
