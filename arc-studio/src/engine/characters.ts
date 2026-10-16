import type { RegionAttachment } from '../schema/types'
import type { Mat3 } from './math'
import { transformPoint } from './math'

export interface CameraView {
  x: number
  y: number
  zoom: number
}

type Pt = { x: number; y: number }

function w2s(wx: number, wy: number, cam: CameraView, vw: number, vh: number): Pt {
  return {
    x: (wx - cam.x) * cam.zoom + vw / 2,
    y: (wy - cam.y) * cam.zoom + vh / 2,
  }
}

/** Local attachment point → screen via attachment rotation + bone world + camera */
function toScreen(
  lx: number,
  ly: number,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
): Pt {
  const r = (att.rotation * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  const ax = lx * cos - ly * sin
  const ay = lx * sin + ly * cos
  const wp = transformPoint(world, { x: ax, y: ay })
  return w2s(wp.x, wp.y, cam, vw, vh)
}

function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '').slice(0, 6)
  if (h.length < 6) return hex
  const n = parseInt(h, 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function fillStroke(
  ctx: CanvasRenderingContext2D,
  fill: string,
  stroke = 'rgba(10,16,14,0.55)',
  line = 2,
) {
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = line
  ctx.stroke()
}

function ovalPath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 4) return
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
}

/** Sample ellipse in local space then project */
function ellipseScreen(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  n = 28,
): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    out.push(toScreen(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, att, world, cam, vw, vh))
  }
  return out
}

function classify(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('head') || n.includes('jaw')) return 'head'
  if (n.includes('crown')) return 'crown'
  if (n.includes('wing')) return 'wing'
  if (n.includes('tail')) return 'tail'
  if (n.includes('hand') || n.includes('foot')) return 'end'
  if (n.includes('glow') || n.includes('spark') || n.includes('core')) return 'gem'
  if (n.includes('blade') || n.includes('tip') || n.includes('handle')) return 'prop'
  if (n.includes('cape')) return 'cape'
  if (n.includes('torso') || n.includes('body') || n.includes('chest') || n.includes('spine'))
    return 'torso'
  if (n.includes('arm') || n.includes('forearm') || n.includes('thigh') || n.includes('shin') || n.includes('leg'))
    return 'limb'
  return 'limb'
}

/**
 * Draw a stylized character part from a region attachment.
 * Deterministic — same schema → same pixels.
 */
export function drawCharacterPart(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  tint: string,
  time = 0,
): void {
  const fill = att.fill ?? (tint.slice(0, 7) || '#5ecf9a')
  const kind = classify(att.name)
  const hw = (att.width * att.scaleX) / 2
  const hh = (att.height * att.scaleY) / 2
  const ox = att.x
  const oy = att.y

  ctx.save()
  ctx.globalAlpha = tint.length === 9 ? parseInt(tint.slice(7, 9), 16) / 255 : 0.98
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  switch (kind) {
    case 'head':
      drawHead(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'crown':
      drawCrown(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'torso':
      drawTorso(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'limb':
      drawLimb(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'end':
      drawEnd(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'wing':
      drawWing(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'tail':
      drawTail(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'gem':
      drawGem(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh, time, att.name)
      break
    case 'cape':
      drawCape(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
      break
    case 'prop':
      drawProp(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh, att.name)
      break
    default:
      drawLimb(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
  }

  ctx.restore()
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const pts = ellipseScreen(ox, oy, hw * 0.95, hh * 0.95, att, world, cam, vw, vh)
  ovalPath(ctx, pts)
  const g = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[Math.floor(pts.length / 2)].x, pts[Math.floor(pts.length / 2)].y)
  g.addColorStop(0, shade(fill, 40))
  g.addColorStop(1, shade(fill, -25))
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(10,16,14,0.5)'
  ctx.lineWidth = 2.2
  ctx.stroke()

  // Eyes
  const eyeY = oy - hh * 0.12
  const eyeR = Math.min(hw, hh) * 0.14
  for (const ex of [-hw * 0.32, hw * 0.32]) {
    const white = ellipseScreen(ox + ex, eyeY, eyeR, eyeR * 1.1, att, world, cam, vw, vh)
    ovalPath(ctx, white)
    fillStroke(ctx, '#f7f3e8', 'rgba(10,16,14,0.35)', 1)
    const pupil = ellipseScreen(ox + ex + eyeR * 0.15, eyeY + eyeR * 0.1, eyeR * 0.45, eyeR * 0.55, att, world, cam, vw, vh)
    ovalPath(ctx, pupil)
    ctx.fillStyle = '#1a2420'
    ctx.fill()
    const shine = toScreen(ox + ex - eyeR * 0.2, eyeY - eyeR * 0.25, att, world, cam, vw, vh)
    ctx.beginPath()
    ctx.arc(shine.x, shine.y, Math.max(1.2, eyeR * 0.2 * cam.zoom), 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fill()
  }

  // Smile
  const smileL = toScreen(ox - hw * 0.28, oy + hh * 0.28, att, world, cam, vw, vh)
  const smileC = toScreen(ox, oy + hh * 0.42, att, world, cam, vw, vh)
  const smileR = toScreen(ox + hw * 0.28, oy + hh * 0.28, att, world, cam, vw, vh)
  ctx.beginPath()
  ctx.moveTo(smileL.x, smileL.y)
  ctx.quadraticCurveTo(smileC.x, smileC.y, smileR.x, smileR.y)
  ctx.strokeStyle = 'rgba(20,30,26,0.55)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Cheek blush
  for (const bx of [-hw * 0.55, hw * 0.55]) {
    const blush = ellipseScreen(ox + bx, oy + hh * 0.15, hw * 0.12, hh * 0.08, att, world, cam, vw, vh)
    ovalPath(ctx, blush)
    ctx.fillStyle = 'rgba(212, 84, 58, 0.28)'
    ctx.fill()
  }
}

function drawCrown(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const tips = [-0.9, -0.45, 0, 0.45, 0.9]
  const baseY = oy + hh * 0.35
  const topY = oy - hh * 0.85
  ctx.beginPath()
  const start = toScreen(ox - hw, baseY, att, world, cam, vw, vh)
  ctx.moveTo(start.x, start.y)
  for (const t of tips) {
    const peak = toScreen(ox + t * hw, t === 0 ? topY - hh * 0.15 : topY + Math.abs(t) * hh * 0.25, att, world, cam, vw, vh)
    const valley = toScreen(ox + (t + 0.22) * hw, baseY - hh * 0.15, att, world, cam, vw, vh)
    ctx.lineTo(peak.x, peak.y)
    if (t < 0.9) ctx.lineTo(valley.x, valley.y)
  }
  const end = toScreen(ox + hw, baseY, att, world, cam, vw, vh)
  ctx.lineTo(end.x, end.y)
  ctx.closePath()
  fillStroke(ctx, shade(fill, 10), 'rgba(80,50,10,0.55)', 1.8)

  const jewel = ellipseScreen(ox, oy - hh * 0.1, hw * 0.18, hh * 0.22, att, world, cam, vw, vh)
  ovalPath(ctx, jewel)
  fillStroke(ctx, '#d4543a', 'rgba(40,10,10,0.4)', 1)
}

function drawTorso(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  // Rounded capsule / belly
  const pts = [
    ...ellipseScreen(ox, oy - hh * 0.15, hw * 0.85, hh * 0.55, att, world, cam, vw, vh, 16),
  ]
  // Build body as rounded rect via ellipse stack
  const body = ellipseScreen(ox, oy, hw * 0.92, hh * 0.95, att, world, cam, vw, vh, 32)
  ovalPath(ctx, body)
  const a = toScreen(ox, oy - hh, att, world, cam, vw, vh)
  const b = toScreen(ox, oy + hh, att, world, cam, vw, vh)
  const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
  g.addColorStop(0, shade(fill, 35))
  g.addColorStop(0.55, fill)
  g.addColorStop(1, shade(fill, -30))
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(10,16,14,0.45)'
  ctx.lineWidth = 2.2
  ctx.stroke()

  // Belly highlight
  const belly = ellipseScreen(ox, oy + hh * 0.1, hw * 0.45, hh * 0.35, att, world, cam, vw, vh)
  ovalPath(ctx, belly)
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fill()
  void pts
}

function drawLimb(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  // Capsule along X (bone direction)
  const rx = Math.max(hw, hh) * 0.95
  const ry = Math.min(hw, hh) * 0.85
  const pts = ellipseScreen(ox, oy, rx, ry, att, world, cam, vw, vh, 24)
  ovalPath(ctx, pts)
  const g0 = toScreen(ox - rx, oy, att, world, cam, vw, vh)
  const g1 = toScreen(ox + rx, oy, att, world, cam, vw, vh)
  const g = ctx.createLinearGradient(g0.x, g0.y, g1.x, g1.y)
  g.addColorStop(0, shade(fill, 25))
  g.addColorStop(1, shade(fill, -20))
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(10,16,14,0.4)'
  ctx.lineWidth = 1.8
  ctx.stroke()
}

function drawEnd(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const pts = ellipseScreen(ox, oy, hw * 0.95, hh * 0.85, att, world, cam, vw, vh, 20)
  ovalPath(ctx, pts)
  fillStroke(ctx, shade(fill, 15), 'rgba(10,16,14,0.45)', 1.6)
}

function drawWing(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const root = toScreen(ox - hw * 0.7, oy, att, world, cam, vw, vh)
  const tip = toScreen(ox + hw * 0.95, oy - hh * 0.2, att, world, cam, vw, vh)
  const midUp = toScreen(ox + hw * 0.1, oy - hh * 0.95, att, world, cam, vw, vh)
  const midDn = toScreen(ox + hw * 0.2, oy + hh * 0.85, att, world, cam, vw, vh)
  ctx.beginPath()
  ctx.moveTo(root.x, root.y)
  ctx.quadraticCurveTo(midUp.x, midUp.y, tip.x, tip.y)
  ctx.quadraticCurveTo(midDn.x, midDn.y, root.x, root.y)
  ctx.closePath()
  ctx.fillStyle = shade(fill, 10) + 'cc'
  ctx.fill()
  ctx.strokeStyle = 'rgba(10,16,14,0.45)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Membrane ribs
  for (const t of [0.3, 0.55, 0.75]) {
    const a = toScreen(ox - hw * 0.5, oy, att, world, cam, vw, vh)
    const b = toScreen(ox + hw * (t * 0.9), oy - hh * (0.7 - t * 0.3), att, world, cam, vw, vh)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 1.2
    ctx.stroke()
  }
}

function drawTail(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const a = toScreen(ox - hw * 0.8, oy, att, world, cam, vw, vh)
  const b = toScreen(ox + hw * 0.9, oy - hh * 0.1, att, world, cam, vw, vh)
  const c = toScreen(ox + hw * 0.2, oy + hh * 0.7, att, world, cam, vw, vh)
  const d = toScreen(ox - hw * 0.4, oy + hh * 0.35, att, world, cam, vw, vh)
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.quadraticCurveTo(b.x, b.y, c.x, c.y)
  ctx.quadraticCurveTo(d.x, d.y, a.x, a.y)
  fillStroke(ctx, fill, 'rgba(10,16,14,0.4)', 1.6)
}

function drawGem(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
  time: number,
  name: string,
) {
  if (name.toLowerCase().includes('glow')) {
    const pulse = 0.55 + 0.25 * Math.sin(time * 4)
    const pts = ellipseScreen(ox, oy, hw * (0.9 + pulse * 0.1), hh * (0.9 + pulse * 0.1), att, world, cam, vw, vh)
    ovalPath(ctx, pts)
    ctx.fillStyle = fill.length === 7 ? fill + '44' : fill
    ctx.fill()
    return
  }
  if (name.toLowerCase().includes('spark')) {
    const s = toScreen(ox, oy, att, world, cam, vw, vh)
    const r = Math.max(hw, hh) * 0.5 * cam.zoom
    ctx.save()
    ctx.translate(s.x, s.y)
    ctx.rotate(time * 3)
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      ctx.lineTo(Math.cos(a + Math.PI / 4) * r * 0.35, Math.sin(a + Math.PI / 4) * r * 0.35)
    }
    ctx.closePath()
    fillStroke(ctx, shade(fill, 30), 'rgba(255,220,120,0.5)', 1)
    ctx.restore()
    return
  }

  // Diamond core
  const top = toScreen(ox, oy - hh, att, world, cam, vw, vh)
  const right = toScreen(ox + hw, oy, att, world, cam, vw, vh)
  const bot = toScreen(ox, oy + hh, att, world, cam, vw, vh)
  const left = toScreen(ox - hw, oy, att, world, cam, vw, vh)
  ctx.beginPath()
  ctx.moveTo(top.x, top.y)
  ctx.lineTo(right.x, right.y)
  ctx.lineTo(bot.x, bot.y)
  ctx.lineTo(left.x, left.y)
  ctx.closePath()
  const g = ctx.createLinearGradient(left.x, left.y, right.x, right.y)
  g.addColorStop(0, shade(fill, 50))
  g.addColorStop(0.5, fill)
  g.addColorStop(1, shade(fill, -40))
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,230,150,0.65)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawCape(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
) {
  const p0 = toScreen(ox - hw, oy - hh * 0.6, att, world, cam, vw, vh)
  const p1 = toScreen(ox + hw, oy - hh * 0.5, att, world, cam, vw, vh)
  const p2 = toScreen(ox + hw * 0.7, oy + hh, att, world, cam, vw, vh)
  const p3 = toScreen(ox - hw * 0.8, oy + hh * 0.9, att, world, cam, vw, vh)
  ctx.beginPath()
  ctx.moveTo(p0.x, p0.y)
  ctx.lineTo(p1.x, p1.y)
  ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y)
  ctx.closePath()
  fillStroke(ctx, shade(fill, -10), 'rgba(10,16,14,0.4)', 1.5)
}

function drawProp(
  ctx: CanvasRenderingContext2D,
  att: RegionAttachment,
  world: Mat3,
  cam: CameraView,
  vw: number,
  vh: number,
  fill: string,
  ox: number,
  oy: number,
  hw: number,
  hh: number,
  name: string,
) {
  if (name.toLowerCase().includes('blade') || name.toLowerCase().includes('tip')) {
    const tip = toScreen(ox + hw, oy, att, world, cam, vw, vh)
    const a = toScreen(ox - hw * 0.6, oy - hh, att, world, cam, vw, vh)
    const b = toScreen(ox - hw * 0.6, oy + hh, att, world, cam, vw, vh)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(tip.x, tip.y)
    ctx.lineTo(b.x, b.y)
    ctx.closePath()
    fillStroke(ctx, shade(fill, 20), 'rgba(40,40,50,0.5)', 1.5)
    return
  }
  drawLimb(ctx, att, world, cam, vw, vh, fill, ox, oy, hw, hh)
}

/** Celebration FX behind character — driven by animation time */
export function drawMotionFx(
  ctx: CanvasRenderingContext2D,
  cam: CameraView,
  vw: number,
  vh: number,
  time: number,
  tags: string[],
): void {
  const win = tags.some((t) => t === 'win' || t === 'celebrate' || t === 'spin-hook')
  if (!win) return

  const origin = w2s(0, -40, cam, vw, vh)
  ctx.save()

  // Rays
  const rayCount = 12
  for (let i = 0; i < rayCount; i++) {
    const a = (i / rayCount) * Math.PI * 2 + time * 0.8
    const len = 120 + 40 * Math.sin(time * 3 + i)
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(origin.x + Math.cos(a) * len * cam.zoom, origin.y + Math.sin(a) * len * cam.zoom)
    ctx.strokeStyle = `rgba(232, 196, 92, ${0.08 + 0.06 * Math.sin(time * 4 + i)})`
    ctx.lineWidth = 10 * cam.zoom
    ctx.stroke()
  }

  // Sparkles
  for (let i = 0; i < 18; i++) {
    const ang = i * 1.7 + time * 2
    const rad = (40 + (i % 5) * 28 + Math.sin(time * 5 + i) * 10) * cam.zoom
    const x = origin.x + Math.cos(ang) * rad
    const y = origin.y + Math.sin(ang * 0.9) * rad * 0.75
    const s = (2 + (i % 3)) * cam.zoom
    ctx.beginPath()
    ctx.moveTo(x, y - s * 2)
    ctx.lineTo(x + s * 0.6, y)
    ctx.lineTo(x, y + s * 2)
    ctx.lineTo(x - s * 0.6, y)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? 'rgba(232,196,92,0.85)' : 'rgba(255,255,255,0.7)'
    ctx.fill()
  }

  ctx.restore()
}
