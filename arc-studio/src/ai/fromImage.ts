import type { ArcDocument } from '../schema/types'
import { rigFromPieces, type PieceImage } from './autoRig'
import { contentBounds, planPieces, type ArtPiece } from './layerSplit'
import { applyMotionLibrary } from './motionLibrary'

export interface SplitResult {
  pieces: ArtPiece[]
  images: PieceImage[]
  log: string[]
}

function crop(source: HTMLImageElement, piece: ArtPiece): string {
  const canvas = document.createElement('canvas')
  canvas.width = piece.w
  canvas.height = piece.h
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.drawImage(source, piece.x, piece.y, piece.w, piece.h, 0, 0, piece.w, piece.h)
  return canvas.toDataURL('image/png')
}

/**
 * Upload → layer split → joint cuts → auto-rig → motion library.
 * Artwork pixels are cropped, never regenerated per frame.
 */
export function splitAndRig(source: HTMLImageElement, name: string): { doc: ArcDocument; log: string[] } {
  const scratch = document.createElement('canvas')
  scratch.width = source.naturalWidth || source.width
  scratch.height = source.naturalHeight || source.height
  const ctx = scratch.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(source, 0, 0)
  const data = ctx.getImageData(0, 0, scratch.width, scratch.height)
  const bounds = contentBounds(data.data, scratch.width, scratch.height)
  const pieces = planPieces(bounds)
  const images = pieces.map((p) => ({ id: p.id, path: crop(source, p) }))
  const log = [
    `1 · Layer split — content ${bounds.w}×${bounds.h}, six body regions`,
    `2 · Piece split — ${pieces.length} joint cuts (upper / mid / end)`,
    `3 · Auto-rig — ${pieces.length} bones inferred from piece connectivity`,
    `4 · Motion library — idle, walk, attack, win, celebrate retargeted onto this rig`,
  ]
  const rigged = rigFromPieces(name, pieces, images)
  const doc = applyMotionLibrary(rigged)
  return { doc, log }
}

/** Paint a full-body sample whose parts sit on the splitter grid, then run the same pipeline. */
export function compileSampleCharacter(): { doc: ArcDocument; log: string[] } {
  const w = 480
  const h = 720
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  paintSample(ctx, w, h)
  return splitCanvas(canvas, 'Sample Hero')
}

function splitCanvas(canvas: HTMLCanvasElement, name: string): { doc: ArcDocument; log: string[] } {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const bounds = contentBounds(data.data, canvas.width, canvas.height)
  const pieces = planPieces(bounds)
  const images = pieces.map((p) => {
    const c = document.createElement('canvas')
    c.width = p.w
    c.height = p.h
    const g = c.getContext('2d')!
    g.drawImage(canvas, p.x, p.y, p.w, p.h, 0, 0, p.w, p.h)
    return { id: p.id, path: c.toDataURL('image/png') }
  })
  const log = [
    `1 · Layer split — sample sprite ${bounds.w}×${bounds.h}`,
    `2 · Piece split — ${pieces.length} anatomical pieces`,
    `3 · Auto-rig — skeleton inferred, reusable`,
    `4 · Motion library — 5 clips retargeted (pixels unchanged)`,
  ]
  return { doc: applyMotionLibrary(rigFromPieces(name, pieces, images)), log }
}

function paintSample(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
  const box = (u: number, du: number, v: number, dv: number) => ({
    x: w * u,
    y: h * v,
    w: w * du,
    h: h * dv,
  })

  const blob = (
    b: { x: number; y: number; w: number; h: number },
    fill: string,
    inset = 0.12,
  ) => {
    const x = b.x + b.w * inset
    const y = b.y + b.h * inset
    const rw = b.w * (1 - inset * 2)
    const rh = b.h * (1 - inset * 2)
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.roundRect(x, y, rw, rh, Math.min(rw, rh) * 0.45)
    ctx.fill()
  }

  blob(box(0.3, 0.4, 0.18, 0.34), '#1f8a6a', 0.08)
  // belly
  const torso = box(0.3, 0.4, 0.18, 0.34)
  ctx.fillStyle = '#2db88a'
  ctx.beginPath()
  ctx.ellipse(torso.x + torso.w / 2, torso.y + torso.h * 0.55, torso.w * 0.22, torso.h * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()

  const head = box(0.28, 0.44, 0.0, 0.22)
  blob(head, '#f0d78c', 0.08)
  const hx = head.x + head.w / 2
  const hy = head.y + head.h * 0.48
  ctx.fillStyle = '#1a2420'
  ctx.beginPath()
  ctx.arc(hx - head.w * 0.12, hy, 7, 0, Math.PI * 2)
  ctx.arc(hx + head.w * 0.12, hy, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#1a2420'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(hx, hy + 16, 16, 0.15 * Math.PI, 0.85 * Math.PI)
  ctx.stroke()
  // crown
  ctx.fillStyle = '#e8c45c'
  ctx.beginPath()
  ctx.moveTo(hx - 36, head.y + 28)
  ctx.lineTo(hx - 24, head.y + 8)
  ctx.lineTo(hx, head.y + 22)
  ctx.lineTo(hx + 24, head.y + 4)
  ctx.lineTo(hx + 36, head.y + 28)
  ctx.closePath()
  ctx.fill()

  blob(box(0.02, 0.26, 0.2, 0.16), '#c9a227', 0.18)
  blob(box(0.02, 0.24, 0.34, 0.14), '#e8c45c', 0.18)
  blob(box(0.04, 0.18, 0.46, 0.08), '#d4543a', 0.15)
  blob(box(0.72, 0.26, 0.2, 0.16), '#c9a227', 0.18)
  blob(box(0.74, 0.24, 0.34, 0.14), '#e8c45c', 0.18)
  blob(box(0.78, 0.18, 0.46, 0.08), '#d4543a', 0.15)

  blob(box(0.3, 0.18, 0.5, 0.2), '#176b52', 0.16)
  blob(box(0.32, 0.16, 0.68, 0.18), '#1f8a6a', 0.16)
  blob(box(0.26, 0.22, 0.84, 0.12), '#3d3429', 0.12)
  blob(box(0.52, 0.18, 0.5, 0.2), '#176b52', 0.16)
  blob(box(0.52, 0.16, 0.68, 0.18), '#1f8a6a', 0.16)
  blob(box(0.52, 0.22, 0.84, 0.12), '#3d3429', 0.12)
}
