/**
 * ARC Document Schema — the single source of truth for rigs & motion.
 * Deterministic engine reads this. AI writes / patches this. Never invents matrices.
 */

export type Vec2 = { x: number; y: number }

export type BoneId = string
export type SlotId = string
export type AttachmentId = string
export type SkinId = string
export type AnimId = string
export type ConstraintId = string

export interface BoneDef {
  id: BoneId
  name: string
  parent: BoneId | null
  /** Local rest pose */
  length: number
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
  /** Draw order hint for debug */
  color?: string
}

export type AttachmentKind = 'region' | 'mesh' | 'path' | 'boundingBox'

export interface RegionAttachment {
  id: AttachmentId
  kind: 'region'
  name: string
  /** Procedural fill when no texture — used for demos & AI-generated placeholders */
  fill?: string
  stroke?: string
  width: number
  height: number
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
  /** Optional texture URL or atlas region name */
  path?: string
  cornerRadius?: number
}

export interface MeshVertex {
  x: number
  y: number
  u: number
  v: number
  /** boneId → weight */
  weights: Record<BoneId, number>
}

export interface MeshAttachment {
  id: AttachmentId
  kind: 'mesh'
  name: string
  fill?: string
  stroke?: string
  vertices: MeshVertex[]
  triangles: number[]
  path?: string
  /** Inverse bind matrix per bone so one illustration can bend with the skeleton. */
  inverseBind?: Record<BoneId, { a: number; b: number; c: number; d: number; tx: number; ty: number }>
}

export type Attachment = RegionAttachment | MeshAttachment

export interface SlotDef {
  id: SlotId
  name: string
  bone: BoneId
  /** Default attachment id (nullable = empty) */
  attachment: AttachmentId | null
  color: string
  blend: 'normal' | 'additive' | 'multiply'
  drawOrder: number
}

export interface SkinDef {
  id: SkinId
  name: string
  /** slotId → attachmentId */
  attachments: Record<SlotId, AttachmentId>
}

export interface IkConstraint {
  id: ConstraintId
  kind: 'ik'
  name: string
  bones: BoneId[]
  target: BoneId
  mix: number
  bendPositive: boolean
  /** 1 or 2 bone IK */
  chain: 1 | 2
}

export interface TransformConstraint {
  id: ConstraintId
  kind: 'transform'
  name: string
  bone: BoneId
  target: BoneId
  mixRotate: number
  mixX: number
  mixY: number
  mixScaleX: number
  mixScaleY: number
}

export type Constraint = IkConstraint | TransformConstraint

export type CurveType = 'linear' | 'stepped' | 'bezier'

export interface Keyframe<T = number> {
  time: number
  value: T
  curve?: CurveType
  /** Bezier control: c1, c2 in 0..1 for time/value easing */
  bezier?: [number, number, number, number]
}

export interface BoneTimeline {
  bone: BoneId
  rotate?: Keyframe[]
  translateX?: Keyframe[]
  translateY?: Keyframe[]
  scaleX?: Keyframe[]
  scaleY?: Keyframe[]
}

export interface SlotTimeline {
  slot: SlotId
  attachment?: Keyframe<AttachmentId | null>[]
  color?: Keyframe<string>[]
}

export interface EventKeyframe {
  time: number
  name: string
  int?: number
  float?: number
  string?: string
}

export interface AnimationDef {
  id: AnimId
  name: string
  duration: number
  loop: boolean
  bones: BoneTimeline[]
  slots?: SlotTimeline[]
  events?: EventKeyframe[]
  /** AI / director metadata */
  tags?: string[]
  intent?: string
}

export interface ArcMeta {
  name: string
  version: '1.0'
  fps: number
  /** pixels per unit */
  unit: number
  createdBy: 'human' | 'ai' | 'hybrid'
  notes?: string
}

export interface ArcDocument {
  meta: ArcMeta
  bones: BoneDef[]
  slots: SlotDef[]
  attachments: Attachment[]
  skins: SkinDef[]
  constraints: Constraint[]
  animations: AnimationDef[]
  /** Active skin */
  defaultSkin: SkinId
}

/** Patches the AI (or tools) apply — never raw matrices */
export type ArcPatch =
  | { op: 'replaceDoc'; doc: ArcDocument }
  | { op: 'setBones'; bones: BoneDef[] }
  | { op: 'upsertBone'; bone: BoneDef }
  | { op: 'removeBone'; id: BoneId }
  | { op: 'setSlots'; slots: SlotDef[] }
  | { op: 'setAttachments'; attachments: Attachment[] }
  | { op: 'setConstraints'; constraints: Constraint[] }
  | { op: 'upsertAnimation'; animation: AnimationDef }
  | { op: 'removeAnimation'; id: AnimId }
  | { op: 'setDefaultSkin'; id: SkinId }
  | { op: 'setMeta'; meta: Partial<ArcMeta> }

export interface CompileRequest {
  /** Natural language or structured intent */
  intent: string
  /** Optional existing doc to mutate */
  base?: ArcDocument
  mode: 'rig' | 'animate' | 'both'
  /** Character archetype hints */
  archetype?: string
  style?: string
}

export interface CompileResult {
  doc: ArcDocument
  patches: ArcPatch[]
  log: string[]
}
