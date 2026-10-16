import type { ArcDocument, BoneDef, RegionAttachment } from '../schema/types'
import { deformMesh } from './mesh'
import { boneTipWorld, type SolvedPose } from './solver'
import { getTranslation, mul, transformPoint, type Mat3 } from './math'
import { drawCharacterPart, drawMotionFx } from './characters'

const imageCache = new Map<string, HTMLImageElement>()
let onAssetReady: (() => void) | null = null

export function setAssetReadyListener(fn: (() => void) | null) {
  onAssetReady = fn
}

function cachedImage(src: string): HTMLImageElement | null {
  const hit = imageCache.get(src)
  if (hit) return hit.complete && hit.naturalWidth > 0 ? hit : null
  const img = new Image()
  img.onload = () => onAssetReady?.()
  img.src = src
  imageCache.set(src, img)
  return null
}

export interface Camera {
  x: number
  y: number
  zoom: number
}

export interface RenderOptions {
  showBones: boolean
  showLabels: boolean
  showGrid: boolean
  selectedBone?: string | null
  background?: string
  /** Animation time for FX / gem pulse */
  time?: number
  /** Tags from current animation (win, idle, …) */
  animTags?: string[]
  /** Use procedural character art instead of flat quads */
  stylized?: boolean
}

const DEFAULT_OPTS: RenderOptions = {
  showBones: false,
  showLabels: false,
  showGrid: true,
  selectedBone: null,
  background: '#0e1418',
  time: 0,
  animTags: [],
  stylized: true,
}

function worldToScreen(
  wx: number,
  wy: number,
  cam: Camera,
  w: number,
  h: number,
): { x: number; y: number } {
  return {
    x: (wx - cam.x) * cam.zoom + w / 2,
    y: (wy - cam.y) * cam.zoom + h / 2,
  }
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  doc: ArcDocument,
  pose: SolvedPose,
  cam: Camera,
  opts: Partial<RenderOptions> = {},
  viewSize?: { width: number; height: number },
): void {
  const o = { ...DEFAULT_OPTS, ...opts }
  const w = viewSize?.width ?? ctx.canvas.width
  const h = viewSize?.height ?? ctx.canvas.height

  ctx.save()
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = o.background!
  ctx.fillRect(0, 0, w, h)

  if (o.showGrid) drawGrid(ctx, cam, w, h)

  drawMotionFx(ctx, cam, w, h, o.time ?? 0, o.animTags ?? [])

  for (const slot of pose.drawOrder) {
    const att = pose.slotAttachments.get(slot.id)
    if (!att) continue
    const bonePose = pose.bones.get(slot.bone)
    if (!bonePose) continue
    const tint = pose.slotColors.get(slot.id) ?? slot.color

    if (att.kind === 'region') {
      const tex = att.path ? cachedImage(att.path) : null
      if (tex) {
        drawTexturedRegion(ctx, att, tex, bonePose.world, cam, w, h)
      } else if (o.stylized) {
        drawCharacterPart(ctx, att, bonePose.world, cam, w, h, tint, o.time ?? 0)
      } else {
        drawRegionFlat(ctx, att, bonePose.world, cam, w, h, tint)
      }
    } else if (att.kind === 'mesh') {
      const verts = deformMesh(att, pose.bones)
      drawMesh(ctx, att, verts, cam, w, h, tint)
    }
  }

  if (o.showBones) {
    const byId = new Map(doc.bones.map((b) => [b.id, b]))
    for (const bone of doc.bones) {
      drawBone(ctx, bone, pose, byId, cam, w, h, o.selectedBone === bone.id, o.showLabels)
    }
  }

  ctx.restore()
}

function drawGrid(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number) {
  const step = 40
  const worldLeft = cam.x - w / 2 / cam.zoom
  const worldTop = cam.y - h / 2 / cam.zoom
  const worldRight = cam.x + w / 2 / cam.zoom
  const worldBottom = cam.y + h / 2 / cam.zoom
  const startX = Math.floor(worldLeft / step) * step
  const startY = Math.floor(worldTop / step) * step

  ctx.strokeStyle = 'rgba(140, 168, 160, 0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = startX; x <= worldRight; x += step) {
    const s = worldToScreen(x, 0, cam, w, h)
    ctx.moveTo(s.x, 0)
    ctx.lineTo(s.x, h)
  }
  for (let y = startY; y <= worldBottom; y += step) {
    const s = worldToScreen(0, y, cam, w, h)
    ctx.moveTo(0, s.y)
    ctx.lineTo(w, s.y)
  }
  ctx.stroke()

  const origin = worldToScreen(0, 0, cam, w, h)
  ctx.strokeStyle = 'rgba(232, 196, 92, 0.28)'
  ctx.beginPath()
  ctx.moveTo(0, origin.y)
  ctx.lineTo(w, origin.y)
  ctx.moveTo(origin.x, 0)
  ctx.lineTo(origin.x, h)
  ctx.stroke()
}

function drawTexturedRegion(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  img: HTMLImageElement,
  world: Mat3,
  cam: Camera,
  w: number,
  h: number,
) {
  const r = (att.rotation * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  const local: Mat3 = {
    a: cos * att.scaleX,
    b: sin * att.scaleX,
    c: -sin * att.scaleY,
    d: cos * att.scaleY,
    tx: att.x,
    ty: att.y,
  }
  const placed = mul(world, local)
  const z = cam.zoom
  ctx.save()
  ctx.setTransform(
    placed.a * z,
    placed.b * z,
    placed.c * z,
    placed.d * z,
    (placed.tx - cam.x) * z + w / 2,
    (placed.ty - cam.y) * z + h / 2,
  )
  ctx.drawImage(img, -att.width / 2, -att.height / 2, att.width, att.height)
  ctx.restore()
}

function drawRegionFlat(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: Camera,
  w: number,
  h: number,
  tint: string,
) {
  const corners = [
    { x: att.x - (att.width * att.scaleX) / 2, y: att.y - (att.height * att.scaleY) / 2 },
    { x: att.x + (att.width * att.scaleX) / 2, y: att.y - (att.height * att.scaleY) / 2 },
    { x: att.x + (att.width * att.scaleX) / 2, y: att.y + (att.height * att.scaleY) / 2 },
    { x: att.x - (att.width * att.scaleX) / 2, y: att.y + (att.height * att.scaleY) / 2 },
  ]

  const r = (att.rotation * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  const rotated = corners.map((p) => {
    const lx = p.x * cos - p.y * sin
    const ly = p.x * sin + p.y * cos
    return transformPoint(world, { x: lx, y: ly })
  })

  const screen = rotated.map((p) => worldToScreen(p.x, p.y, cam, w, h))
  ctx.beginPath()
  ctx.moveTo(screen[0].x, screen[0].y)
  for (let i = 1; i < screen.length; i++) ctx.lineTo(screen[i].x, screen[i].y)
  ctx.closePath()

  ctx.globalAlpha = alphaFromTint(tint)
  ctx.fillStyle = att.fill ?? tint ?? '#7fd4b8'
  ctx.fill()
  if (att.stroke) {
    ctx.strokeStyle = att.stroke
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawMesh(
  ctx: CanvasRenderingContext2D,
  att: { triangles: number[]; fill?: string; stroke?: string },
  verts: { x: number; y: number }[],
  cam: Camera,
  w: number,
  h: number,
  tint: string,
) {
  const screen = verts.map((v) => worldToScreen(v.x, v.y, cam, w, h))
  ctx.globalAlpha = alphaFromTint(tint)
  ctx.fillStyle = att.fill ?? tint ?? '#7fd4b8'
  for (let i = 0; i < att.triangles.length; i += 3) {
    const a = screen[att.triangles[i]]
    const b = screen[att.triangles[i + 1]]
    const c = screen[att.triangles[i + 2]]
    if (!a || !b || !c) continue
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawBone(
  ctx: CanvasRenderingContext2D,
  bone: BoneDef,
  pose: SolvedPose,
  byId: Map<string, BoneDef>,
  cam: Camera,
  w: number,
  h: number,
  selected: boolean,
  labels: boolean,
) {
  const bp = pose.bones.get(bone.id)
  if (!bp) return
  const origin = getTranslation(bp.world)
  const tip = boneTipWorld(bp, bone.length || 24)
  const o = worldToScreen(origin.x, origin.y, cam, w, h)
  const t = worldToScreen(tip.x, tip.y, cam, w, h)

  const color = selected ? '#e8c45c' : bone.color ?? '#5ecf9a'
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = selected ? 2.5 : 1.5

  const dx = t.x - o.x
  const dy = t.y - o.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const mid = { x: o.x + dx * 0.25, y: o.y + dy * 0.25 }
  const width = Math.min(8, len * 0.2)

  ctx.beginPath()
  ctx.moveTo(o.x, o.y)
  ctx.lineTo(mid.x + nx * width, mid.y + ny * width)
  ctx.lineTo(t.x, t.y)
  ctx.lineTo(mid.x - nx * width, mid.y - ny * width)
  ctx.closePath()
  ctx.globalAlpha = 0.35
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(o.x, o.y, selected ? 5 : 3.5, 0, Math.PI * 2)
  ctx.fill()

  if (labels) {
    ctx.font = '600 11px "IBM Plex Mono", monospace'
    ctx.fillStyle = 'rgba(230, 240, 236, 0.75)'
    ctx.fillText(bone.name, o.x + 8, o.y - 8)
  }

  void byId
}

function alphaFromTint(tint: string): number {
  if (tint.length === 9 && tint.startsWith('#')) {
    return parseInt(tint.slice(7, 9), 16) / 255
  }
  return 0.92
}
