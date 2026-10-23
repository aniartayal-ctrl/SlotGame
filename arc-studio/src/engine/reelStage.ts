import type { ArcDocument, EventKeyframe } from '../schema/types'
import { solvePose } from './solver'
import { renderFrame, type Camera } from './renderer'
import type { SymbolState } from '../ai/symbolKit'

export type ReelCellState = SymbolState | 'spinning'

export interface ReelCell {
  col: number
  row: number
  state: ReelCellState
  /** Local clip time for the active state. */
  time: number
  /** Highlight as part of the winning line. */
  win: boolean
}

export interface ReelSpinScript {
  /** Final symbol state per cell after land (15 cells, col-major or row-major — see layout). */
  finalStates: SymbolState[]
  /** Column that holds anticipation before stopping (0–4). */
  anticipationCol: number
  /** Which win tier plays on winning cells. */
  winTier: 'win-small' | 'win-big' | null
  /** Winning cell indices (0..14, row-major: row * 5 + col). */
  winCells: number[]
}

export interface FiredReelEvent {
  at: number
  cell: number
  col: number
  row: number
  event: EventKeyframe
  animationId: string
}

const COLS = 5
const ROWS = 3
const CELL_W = 96
const CELL_H = 96
const GAP = 10

function idx(col: number, row: number) {
  return row * COLS + col
}

/** Default scripted spin: middle row hits three gems, reel 4 anticipates, big win. */
export function defaultSpinScript(): ReelSpinScript {
  const finalStates: SymbolState[] = Array.from({ length: 15 }, () => 'dim')
  // Middle row (row 1): cols 1,2,3 win — rest dim
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      finalStates[idx(c, r)] = r === 1 && c >= 1 && c <= 3 ? 'idle' : 'dim'
    }
  }
  return {
    finalStates,
    anticipationCol: 3,
    winTier: 'win-big',
    winCells: [idx(1, 1), idx(2, 1), idx(3, 1)],
  }
}

/**
 * Headless 5×3 reel director. Uses one ArcDocument (symbol kit) and drives
 * per-cell clip times. A host canvas blits each cell via {@link drawReelFrame}.
 */
export class ReelStage {
  doc: ArcDocument
  cells: ReelCell[] = []
  clock = 0
  playing = false
  private script: ReelSpinScript | null = null
  private phase: 'idle' | 'spin' | 'anticipate' | 'land' | 'win' | 'done' = 'idle'
  private phaseStart = 0
  private fired: FiredReelEvent[] = []
  private prevCellTime = new Map<number, number>()
  private listeners = new Set<(e: FiredReelEvent) => void>()
  private changeListeners = new Set<() => void>()

  constructor(doc: ArcDocument) {
    this.doc = doc
    this.resetCells('idle')
  }

  onEvent(fn: (e: FiredReelEvent) => void) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  onChange(fn: () => void) {
    this.changeListeners.add(fn)
    return () => this.changeListeners.delete(fn)
  }

  get eventLog(): FiredReelEvent[] {
    return this.fired.slice()
  }

  get phaseName() {
    return this.phase
  }

  private emitChange() {
    for (const fn of this.changeListeners) fn()
  }

  private pushEvent(e: FiredReelEvent) {
    this.fired.push(e)
    for (const fn of this.listeners) fn(e)
  }

  resetCells(state: SymbolState) {
    this.cells = []
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        this.cells.push({ col, row, state, time: 0, win: false })
      }
    }
    this.prevCellTime.clear()
    this.emitChange()
  }

  setDocument(doc: ArcDocument) {
    this.doc = doc
  }

  /** Begin a scripted spin. Events log in order as cells cross key times. */
  playScript(script: ReelSpinScript = defaultSpinScript()) {
    this.script = script
    this.fired = []
    this.clock = 0
    this.phase = 'spin'
    this.phaseStart = 0
    this.playing = true
    this.prevCellTime.clear()
    for (const cell of this.cells) {
      cell.state = 'spinning'
      cell.time = 0
      cell.win = false
    }
    this.emitChange()
  }

  /**
   * Advance the reel clock. Spin 0–0.9s, anticipation on one col 0.9–1.6s,
   * land stagger 1.6–2.4s, then win tier on winning cells.
   */
  tick(dt: number) {
    if (!this.playing || !this.script) return
    this.clock += dt
    const s = this.script

    if (this.phase === 'spin' && this.clock >= 0.9) {
      this.phase = 'anticipate'
      this.phaseStart = this.clock
    }
    if (this.phase === 'anticipate' && this.clock >= 1.6) {
      this.phase = 'land'
      this.phaseStart = this.clock
    }
    if (this.phase === 'land' && this.clock >= 2.45) {
      this.phase = 'win'
      this.phaseStart = this.clock
    }

    for (const cell of this.cells) {
      const i = idx(cell.col, cell.row)
      const prev = this.prevCellTime.get(i) ?? -0.0001

      if (this.phase === 'spin') {
        cell.state = 'spinning'
        cell.time = (this.clock * 4 + cell.col * 0.2 + cell.row * 0.1) % 1
      } else if (this.phase === 'anticipate') {
        if (cell.col === s.anticipationCol) {
          cell.state = 'anticipation'
          cell.time = this.clock - this.phaseStart
          this.sampleCellEvents(cell, i, prev, cell.time)
        } else {
          cell.state = 'spinning'
          cell.time = (this.clock * 4 + cell.col * 0.2) % 1
        }
      } else if (this.phase === 'land') {
        const landAt = this.phaseStart + cell.col * 0.12 + cell.row * 0.04
        if (this.clock < landAt) {
          cell.state = cell.col === s.anticipationCol ? 'anticipation' : 'spinning'
          cell.time = this.clock - this.phaseStart
        } else {
          const local = this.clock - landAt
          const target = s.finalStates[i] ?? 'idle'
          if (cell.state !== 'land' && cell.state !== target && local < 0.45) {
            cell.state = 'land'
            cell.time = local
            this.fireZero(cell, i, 'land')
          } else if (local >= 0.45) {
            cell.state = target
            cell.time = local - 0.45
            if (target !== 'land') this.sampleCellEvents(cell, i, prev, cell.time)
          } else {
            cell.time = local
            this.sampleCellEvents(cell, i, prev, cell.time)
          }
        }
      } else if (this.phase === 'win') {
        const isWin = s.winCells.includes(i)
        cell.win = isWin
        if (isWin && s.winTier) {
          if (cell.state !== s.winTier) {
            cell.state = s.winTier
            cell.time = 0
            this.fireZero(cell, i, s.winTier)
          } else {
            cell.time = this.clock - this.phaseStart
            this.sampleCellEvents(cell, i, prev, cell.time)
          }
        } else {
          if (cell.state !== 'dim' && !isWin) {
            cell.state = 'dim'
            cell.time = 0
            this.fireZero(cell, i, 'dim')
          } else {
            cell.time = Math.min(cell.time + dt, 1)
            this.sampleCellEvents(cell, i, prev, cell.time)
          }
        }
        const winAnim = s.winTier ? this.doc.animations.find((a) => a.id === s.winTier) : null
        if (winAnim && this.clock - this.phaseStart >= winAnim.duration) {
          this.phase = 'done'
          this.playing = false
        }
      }

      this.prevCellTime.set(i, cell.time)
    }

    this.emitChange()
  }

  private fireZero(cell: ReelCell, i: number, animId: string) {
    const anim = this.doc.animations.find((a) => a.id === animId)
    const zeros = (anim?.events ?? []).filter((e) => e.time === 0)
    for (const event of zeros) {
      this.pushEvent({
        at: this.clock,
        cell: i,
        col: cell.col,
        row: cell.row,
        event,
        animationId: animId,
      })
    }
    this.prevCellTime.set(i, 0)
  }

  private sampleCellEvents(cell: ReelCell, i: number, from: number, to: number) {
    if (cell.state === 'spinning') return
    const anim = this.doc.animations.find((a) => a.id === cell.state)
    if (!anim?.events) return
    for (const event of anim.events) {
      if (event.time > from && event.time <= to) {
        this.pushEvent({
          at: this.clock,
          cell: i,
          col: cell.col,
          row: cell.row,
          event,
          animationId: anim.id,
        })
      }
    }
  }
}

const cellScratch: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null = (() => {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = CELL_W
  canvas.height = CELL_H
  const ctx = canvas.getContext('2d')
  return ctx ? { canvas, ctx } : null
})()

/** Draw the 5×3 stage into a canvas. */
export function drawReelFrame(
  ctx: CanvasRenderingContext2D,
  stage: ReelStage,
  view: { width: number; height: number },
) {
  const doc = stage.doc
  const gridW = COLS * CELL_W + (COLS - 1) * GAP
  const gridH = ROWS * CELL_H + (ROWS - 1) * GAP
  const originX = (view.width - gridW) / 2
  const originY = (view.height - gridH) / 2 - 10

  ctx.save()
  ctx.fillStyle = '#0a1014'
  ctx.fillRect(0, 0, view.width, view.height)

  const pad = 28
  roundRect(ctx, originX - pad, originY - pad, gridW + pad * 2, gridH + pad * 2, 18)
  ctx.fillStyle = '#14352c'
  ctx.fill()
  ctx.strokeStyle = 'rgba(232, 196, 92, 0.45)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.font = '700 18px Syne, sans-serif'
  ctx.fillStyle = '#e8c45c'
  ctx.textAlign = 'center'
  ctx.fillText('KINETIC PRO · REEL STAGE', view.width / 2, originY - pad - 14)

  for (const cell of stage.cells) {
    const x = originX + cell.col * (CELL_W + GAP)
    const y = originY + cell.row * (CELL_H + GAP)

    ctx.save()
    roundRect(ctx, x, y, CELL_W, CELL_H, 12)
    ctx.clip()
    ctx.fillStyle = cell.win ? '#1a2e28' : '#0e1814'
    ctx.fillRect(x, y, CELL_W, CELL_H)

    if (cell.state === 'spinning') {
      const off = (cell.time * CELL_H * 3) % CELL_H
      for (let n = -1; n < 3; n++) {
        const gy = y + off + n * (CELL_H * 0.55)
        const g = ctx.createLinearGradient(x, gy, x, gy + 40)
        g.addColorStop(0, 'rgba(45,184,138,0)')
        g.addColorStop(0.5, 'rgba(201,162,39,0.55)')
        g.addColorStop(1, 'rgba(45,184,138,0)')
        ctx.fillStyle = g
        ctx.fillRect(x + 8, gy, CELL_W - 16, 36)
      }
    } else if (cellScratch) {
      const animId = cell.state
      const pose = solvePose(doc, animId, cell.time)
      const cam: Camera = { x: 0, y: 8, zoom: 0.72 }
      renderFrame(
        cellScratch.ctx,
        doc,
        pose,
        cam,
        {
          showBones: false,
          showLabels: false,
          showGrid: false,
          selectedBone: null,
          background: '#0e1814',
          stylized: true,
          time: cell.time,
          animTags: doc.animations.find((a) => a.id === animId)?.tags ?? [],
          clear: true,
        },
        { width: CELL_W, height: CELL_H },
      )
      ctx.drawImage(cellScratch.canvas, x, y)
    }

    ctx.restore()

    ctx.strokeStyle = cell.win ? 'rgba(232,196,92,0.95)' : 'rgba(255,255,255,0.08)'
    ctx.lineWidth = cell.win ? 2.5 : 1
    roundRect(ctx, x, y, CELL_W, CELL_H, 12)
    ctx.stroke()
  }

  ctx.font = '500 12px IBM Plex Mono, monospace'
  ctx.fillStyle = '#8aa399'
  ctx.textAlign = 'center'
  ctx.fillText(
    `phase ${stage.phaseName} · t ${stage.clock.toFixed(2)}s · events ${stage.eventLog.length}`,
    view.width / 2,
    originY + gridH + pad + 22,
  )
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
