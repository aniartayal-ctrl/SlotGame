import type { ArcDocument } from '../schema/types'

/** Export ARC JSON — drop-in runtime asset (Spine alternative). */
export function exportArcJson(doc: ArcDocument, pretty = true): string {
  return pretty ? JSON.stringify(doc, null, 2) : JSON.stringify(doc)
}

/** Minimal runtime bundle: strip AI notes, keep playback essentials. */
export function exportRuntimeBundle(doc: ArcDocument): string {
  const bundle = {
    format: 'arc-runtime',
    version: '1.0',
    meta: {
      name: doc.meta.name,
      fps: doc.meta.fps,
      unit: doc.meta.unit,
    },
    bones: doc.bones.map(({ color: _c, ...b }) => b),
    slots: doc.slots,
    attachments: doc.attachments,
    skins: doc.skins,
    constraints: doc.constraints,
    animations: doc.animations.map(({ intent: _i, tags: _t, ...a }) => a),
    defaultSkin: doc.defaultSkin,
  }
  return JSON.stringify(bundle, null, 2)
}

export function downloadText(filename: string, text: string, mime = 'application/json') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Rough Spine-shaped export for migration experiments (not 1:1). */
export function exportSpineCompatSketch(doc: ArcDocument): string {
  const skeleton = {
    skeleton: { hash: 'arc', spine: '4.2-compat-sketch', width: 400, height: 400 },
    bones: doc.bones.map((b) => ({
      name: b.name,
      parent: b.parent ? doc.bones.find((p) => p.id === b.parent)?.name : undefined,
      length: b.length,
      x: b.x,
      y: -b.y,
      rotation: b.rotation,
      scaleX: b.scaleX,
      scaleY: b.scaleY,
    })),
    slots: doc.slots.map((s) => ({
      name: s.name,
      bone: doc.bones.find((b) => b.id === s.bone)?.name,
      attachment: s.attachment,
    })),
    skins: {
      default: Object.fromEntries(
        doc.slots.map((s) => {
          const att = doc.attachments.find((a) => a.id === s.attachment)
          if (!att || att.kind !== 'region') return [s.name, {}]
          return [
            s.name,
            {
              [att.name]: {
                type: 'region',
                width: att.width,
                height: att.height,
                x: att.x,
                y: -att.y,
              },
            },
          ]
        }),
      ),
    },
    animations: Object.fromEntries(
      doc.animations.map((anim) => [
        anim.name,
        {
          bones: Object.fromEntries(
            anim.bones.map((bt) => {
              const name = doc.bones.find((b) => b.id === bt.bone)?.name ?? bt.bone
              const channels: Record<string, unknown> = {}
              if (bt.rotate) channels.rotate = bt.rotate.map((k) => ({ time: k.time, value: k.value }))
              if (bt.translateX || bt.translateY) {
                channels.translate = mergeXY(bt.translateX, bt.translateY)
              }
              if (bt.scaleX || bt.scaleY) {
                channels.scale = mergeXY(bt.scaleX, bt.scaleY, true)
              }
              return [name, channels]
            }),
          ),
        },
      ]),
    ),
  }
  return JSON.stringify(skeleton, null, 2)
}

function mergeXY(
  xs?: { time: number; value: number }[],
  ys?: { time: number; value: number }[],
  isScale = false,
) {
  const times = new Set<number>()
  xs?.forEach((k) => times.add(k.time))
  ys?.forEach((k) => times.add(k.time))
  const sorted = [...times].sort((a, b) => a - b)
  return sorted.map((time) => ({
    time,
    x: sample(xs, time, isScale ? 1 : 0),
    y: sample(ys, time, isScale ? 1 : 0),
  }))
}

function sample(keys: { time: number; value: number }[] | undefined, time: number, fallback: number) {
  if (!keys?.length) return fallback
  let v = keys[0].value
  for (const k of keys) {
    if (k.time <= time) v = k.value
  }
  return v
}
