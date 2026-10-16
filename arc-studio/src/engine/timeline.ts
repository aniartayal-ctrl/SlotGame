import type { Keyframe } from '../schema/types'
import { bezierEase, lerp, lerpAngle } from './math'

export function sampleScalar(keys: Keyframe[] | undefined, time: number, isAngle = false): number | undefined {
  if (!keys || keys.length === 0) return undefined
  if (time <= keys[0].time) return keys[0].value
  if (time >= keys[keys.length - 1].time) return keys[keys.length - 1].value

  let i = 0
  while (i < keys.length - 1 && keys[i + 1].time < time) i++
  const a = keys[i]
  const b = keys[i + 1]
  if (a.curve === 'stepped') return a.value

  const span = b.time - a.time || 1
  let t = (time - a.time) / span
  if (a.curve === 'bezier' && a.bezier) {
    t = bezierEase(t, a.bezier[1], a.bezier[3])
  }
  return isAngle ? lerpAngle(a.value, b.value, t) : lerp(a.value, b.value, t)
}

export function sampleDiscrete<T>(keys: Keyframe<T>[] | undefined, time: number): T | undefined {
  if (!keys || keys.length === 0) return undefined
  let chosen = keys[0].value
  for (const k of keys) {
    if (k.time <= time) chosen = k.value
    else break
  }
  return chosen
}
