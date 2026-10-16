/**
 * God Mode–style decomposition plan.
 * 1) Six body layers: head, torso, two arms, two legs.
 * 2) Joint cuts: upper → mid → end (arm/forearm/hand, thigh/shin/foot).
 *
 * This is a geometric template (full-body, front view). A vision model would
 * replace the rects with occlusion-aware masks; the rig consumes the same pieces.
 */

export type PieceRole =
  | 'torso'
  | 'head'
  | 'arm_l'
  | 'forearm_l'
  | 'hand_l'
  | 'arm_r'
  | 'forearm_r'
  | 'hand_r'
  | 'thigh_l'
  | 'shin_l'
  | 'foot_l'
  | 'thigh_r'
  | 'shin_r'
  | 'foot_r'

export interface ArtPiece {
  id: PieceRole
  name: string
  parent: PieceRole | 'root' | null
  /** Source-image crop */
  x: number
  y: number
  w: number
  h: number
  /** Pivot inside the crop (joint), pixels */
  pivotX: number
  pivotY: number
}

export interface Bounds {
  x: number
  y: number
  w: number
  h: number
}

export function contentBounds(data: Uint8ClampedArray, width: number, height: number, alpha = 24): Bounds {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  let hit = false
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3]
      if (a > alpha) {
        hit = true
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (!hit) return { x: 0, y: 0, w: width, h: height }
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

function piece(
  id: PieceRole,
  parent: ArtPiece['parent'],
  box: Bounds,
  pivot: 'top' | 'bottom' | 'center',
): ArtPiece {
  const pivotX = box.w / 2
  const pivotY = pivot === 'top' ? box.h * 0.08 : pivot === 'bottom' ? box.h * 0.92 : box.h / 2
  return {
    id,
    name: id,
    parent,
    x: Math.round(box.x),
    y: Math.round(box.y),
    w: Math.max(1, Math.round(box.w)),
    h: Math.max(1, Math.round(box.h)),
    pivotX,
    pivotY,
  }
}

/**
 * Plan anatomical pieces inside a full-body bounding box.
 * Proportions follow a front-facing game sprite (head ~20%, torso, 3-bone limbs).
 */
export function planPieces(bounds: Bounds): ArtPiece[] {
  const { x, y, w, h } = bounds
  const col = (u: number, du: number, v: number, dv: number): Bounds => ({
    x: x + w * u,
    y: y + h * v,
    w: w * du,
    h: h * dv,
  })

  return [
    piece('torso', 'root', col(0.3, 0.4, 0.18, 0.34), 'bottom'),
    piece('head', 'torso', col(0.28, 0.44, 0.0, 0.22), 'bottom'),
    piece('arm_l', 'torso', col(0.02, 0.26, 0.2, 0.16), 'top'),
    piece('forearm_l', 'arm_l', col(0.02, 0.24, 0.34, 0.14), 'top'),
    piece('hand_l', 'forearm_l', col(0.04, 0.18, 0.46, 0.08), 'top'),
    piece('arm_r', 'torso', col(0.72, 0.26, 0.2, 0.16), 'top'),
    piece('forearm_r', 'arm_r', col(0.74, 0.24, 0.34, 0.14), 'top'),
    piece('hand_r', 'forearm_r', col(0.78, 0.18, 0.46, 0.08), 'top'),
    piece('thigh_l', 'root', col(0.3, 0.18, 0.5, 0.2), 'top'),
    piece('shin_l', 'thigh_l', col(0.32, 0.16, 0.68, 0.18), 'top'),
    piece('foot_l', 'shin_l', col(0.26, 0.22, 0.84, 0.12), 'top'),
    piece('thigh_r', 'root', col(0.52, 0.18, 0.5, 0.2), 'top'),
    piece('shin_r', 'thigh_r', col(0.52, 0.16, 0.68, 0.18), 'top'),
    piece('foot_r', 'shin_r', col(0.52, 0.22, 0.84, 0.12), 'top'),
  ]
}
