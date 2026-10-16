import type { MeshAttachment, BoneId } from '../schema/types'
import type { BonePose } from './solver'
import { transformPoint, type Mat3 } from './math'

/** Skin a mesh attachment by weighted bone world matrices (deterministic). */
export function deformMesh(
  mesh: MeshAttachment,
  bones: Map<BoneId, BonePose>,
): { x: number; y: number; u: number; v: number }[] {
  return mesh.vertices.map((v) => {
    let x = 0
    let y = 0
    let wSum = 0
    for (const [boneId, w] of Object.entries(v.weights)) {
      const pose = bones.get(boneId)
      if (!pose) continue
      const p = transformPoint(pose.world, { x: v.x, y: v.y })
      x += p.x * w
      y += p.y * w
      wSum += w
    }
    if (wSum <= 0) {
      return { x: v.x, y: v.y, u: v.u, v: v.v }
    }
    return { x: x / wSum, y: y / wSum, u: v.u, v: v.v }
  })
}

export function applyCamera(m: Mat3, camera: { x: number; y: number; zoom: number; cx: number; cy: number }): Mat3 {
  // world → screen: translate -cam, scale zoom, then center
  const a = camera.zoom
  return {
    a: m.a * a,
    b: m.b * a,
    c: m.c * a,
    d: m.d * a,
    tx: (m.tx - camera.x) * a + camera.cx,
    ty: (m.ty - camera.y) * a + camera.cy,
  }
}
