import './style.css'
import { compile } from './compiler/compile'
import { downloadText, exportArcJson, exportRuntimeBundle, exportSpineCompatSketch } from './compiler/export'
import { compileSampleCharacter, splitAndRig } from './ai/fromImage'
import { compileSymbolKit } from './ai/symbolKit'
import { ArcPlayer } from './engine/player'
import { defaultSpinScript, drawReelFrame, ReelStage } from './engine/reelStage'
import type { ArcDocument } from './schema/types'
import { validateDocument } from './schema/validate'

const STARTER_INTENT =
  'Gold slot gem symbol — land then win-big once'

function bootStarter(): { doc: ArcDocument; idleId: string } {
  const rig = compile({
    intent: 'Casino mascot named Lucky with a tail and crown, luxury gold style',
    mode: 'rig',
  })
  const idle = compile({
    intent: 'gentle idle breathe loop 2.4s named idle',
    mode: 'animate',
    base: rig.doc,
  })
  const win = compile({
    intent: 'epic big win jackpot celebration once named win',
    mode: 'animate',
    base: idle.doc,
  })
  // Prefer idle as first selectable / default playback
  const idleAnim = win.doc.animations.find((a) => a.id === 'idle') ?? win.doc.animations[0]
  const ordered = {
    ...win.doc,
    animations: [
      idleAnim,
      ...win.doc.animations.filter((a) => a.id !== idleAnim.id),
    ],
  }
  return { doc: ordered, idleId: idleAnim.id }
}

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <header class="brand-bar">
    <div class="brand">
      <div class="brand-mark">Kinetic Pro</div>
      <div class="brand-sub">Six-state slot symbols · deterministic ARC engine · Spine replacement</div>
    </div>
    <div class="brand-actions">
      <button type="button" id="btn-mode-rig" class="active">Rig view</button>
      <button type="button" id="btn-mode-reel" class="gold">Reel stage</button>
      <button type="button" id="btn-export-arc" class="gold">Export .arc.json</button>
      <button type="button" id="btn-export-runtime">Runtime bundle</button>
      <button type="button" id="btn-export-spine" class="ghost">Spine-compat sketch</button>
    </div>
  </header>

  <div class="workspace">
    <aside class="panel" id="panel-left">
      <h2>Skeleton</h2>
      <div class="stat-line" id="doc-stats"></div>
      <h3>Bones</h3>
      <ul class="bone-list" id="bone-list"></ul>
      <h3>Constraints</h3>
      <div class="muted" id="constraint-list"></div>
      <h3>Display</h3>
      <div class="row">
        <button type="button" id="tog-bones">Bones</button>
        <button type="button" id="tog-labels">Labels</button>
        <button type="button" id="tog-grid" class="active">Grid</button>
      </div>
      <h3>Game events</h3>
      <div class="log event-log" id="event-log">Waiting for playback…</div>
    </aside>

    <section class="viewport-wrap">
      <canvas id="viewport"></canvas>
      <div class="viewport-hud">
        <div class="hud-chip" id="hud-status">Compiling…</div>
        <div class="hud-tools">
          <button type="button" id="zoom-out" class="hud-chip">−</button>
          <button type="button" id="zoom-in" class="hud-chip">+</button>
          <button type="button" id="zoom-reset" class="hud-chip">Reset cam</button>
        </div>
      </div>
    </section>

    <aside class="panel" id="panel-right">
      <h2>Kinetic Pro symbol</h2>
      <p class="muted" style="margin:0 0 0.6rem;line-height:1.45">
        Six states a reel can hear: idle, land, win-small, win-big, anticipation, dim — with timed land / win-start / win-peak / loop-end events.
      </p>
      <div class="row">
        <button type="button" id="btn-symbol-kit" class="gold">Load symbol kit</button>
        <button type="button" id="btn-reel-spin" class="primary">Play scripted spin</button>
      </div>
      <div class="log" id="pipeline-log">Load the kit, then open Reel stage and spin.</div>

      <h2 style="margin-top:1.2rem">From one image</h2>
      <p class="muted" style="margin:0 0 0.6rem;line-height:1.45">
        God Mode loop: split art → cut joints → auto-rig once → retarget clips. Original pixels move.
      </p>
      <div class="row">
        <button type="button" id="btn-sample" class="gold">Sample character</button>
        <button type="button" id="btn-upload" class="primary">Upload PNG</button>
        <input id="file-art" type="file" accept="image/png,image/webp,image/jpeg" hidden />
      </div>

      <h2 style="margin-top:1.2rem">AI Director</h2>
      <p class="muted" style="margin:0 0 0.6rem;line-height:1.45">
        Describe a rig or motion. The engine still owns geometry and pixels.
      </p>
      <textarea class="prompt-box" id="prompt" placeholder="Describe a character or motion…"></textarea>
      <div class="pill-row" id="presets"></div>
      <div class="row">
        <button type="button" id="btn-rig" class="primary">Rig</button>
        <button type="button" id="btn-animate" class="primary">Animate</button>
        <button type="button" id="btn-both" class="gold">Rig + Animate</button>
      </div>
      <div class="log" id="compile-log">Ready.</div>

      <h3>Animations</h3>
      <ul class="anim-list" id="anim-list"></ul>

      <h3>Validation</h3>
      <div class="muted" id="validation"></div>
    </aside>
  </div>

  <footer class="timeline">
    <div class="timeline-controls">
      <button type="button" id="btn-play">Pause</button>
      <select id="anim-select"></select>
      <label class="muted" style="display:flex;align-items:center;gap:0.35rem">
        Speed
        <input id="speed" type="range" min="0.25" max="2" step="0.25" value="1" style="width:80px" />
      </label>
    </div>
    <input class="scrub" id="scrub" type="range" min="0" max="1000" value="0" />
    <div class="time-readout" id="time-readout">0.00 / 0.00s</div>
  </footer>
`

const PRESETS = [
  'Gold slot gem symbol — land once',
  'Gold slot gem symbol — win-big epic once',
  'Gold slot gem symbol — anticipation loop',
  'Casino dragon with wings — fly flap then win',
  'Cute mascot with tail — bounce hop loop',
  'Humanoid warrior with cape — walk cycle',
]

const presetsEl = document.querySelector('#presets')!
for (const p of PRESETS) {
  const b = document.createElement('button')
  b.type = 'button'
  b.className = 'pill'
  b.textContent = p.split('—')[0].trim()
  b.title = p
  b.addEventListener('click', () => {
    promptEl.value = p
  })
  presetsEl.appendChild(b)
}

const promptEl = document.querySelector<HTMLTextAreaElement>('#prompt')!
promptEl.value = STARTER_INTENT

const starter = (() => {
  try {
    const kit = compileSymbolKit('Gold Gem')
    return { doc: kit.doc, idleId: 'idle', log: kit.log }
  } catch {
    const fallback = bootStarter()
    return { doc: fallback.doc, idleId: fallback.idleId, log: ['Procedural starter'] }
  }
})()
let doc = starter.doc
type StudioMode = 'rig' | 'reel'
let mode: StudioMode = 'rig'
const eventLines: string[] = []

const canvas = document.querySelector<HTMLCanvasElement>('#viewport')!
const player = new ArcPlayer(canvas, doc)
player.setAnimation('idle')
player.camera = { x: 0, y: 10, zoom: 1.9 }
player.start()

const reel = new ReelStage(doc)
let reelRaf = 0
let reelLastTs = 0

function pushEventLine(line: string) {
  eventLines.unshift(line)
  if (eventLines.length > 40) eventLines.length = 40
  const el = document.querySelector('#event-log')
  if (el) el.textContent = eventLines.join('\n')
}

player.onEvent((ev, meta) => {
  pushEventLine(
    `${meta.time.toFixed(2)}s · ${meta.animationId} · ${ev.name}${ev.int != null ? `:${ev.int}` : ''}`,
  )
})

reel.onEvent((e) => {
  pushEventLine(
    `reel ${e.at.toFixed(2)}s · c${e.col}r${e.row} · ${e.animationId} · ${e.event.name}`,
  )
})

function stopReelLoop() {
  cancelAnimationFrame(reelRaf)
  reelRaf = 0
  reelLastTs = 0
}

function paintReel() {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const cssW = Math.max(1, rect.width)
  const cssH = Math.max(1, rect.height)
  const bw = Math.floor(cssW * dpr)
  const bh = Math.floor(cssH * dpr)
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw
    canvas.height = bh
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  drawReelFrame(ctx, reel, { width: cssW, height: cssH })
}

const reelLoop = (ts: number) => {
  if (mode !== 'reel') return
  if (reelLastTs) {
    const dt = Math.min(0.05, (ts - reelLastTs) / 1000)
    reel.tick(dt)
  }
  reelLastTs = ts
  paintReel()
  document.querySelector('#hud-status')!.textContent =
    `Reel · ${reel.phaseName} · ${reel.eventLog.length} events`
  document.querySelector('#time-readout')!.textContent = `${reel.clock.toFixed(2)}s · ${reel.phaseName}`
  reelRaf = requestAnimationFrame(reelLoop)
}

function setMode(next: StudioMode) {
  mode = next
  document.querySelector('#btn-mode-rig')!.classList.toggle('active', mode === 'rig')
  document.querySelector('#btn-mode-reel')!.classList.toggle('active', mode === 'reel')
  if (mode === 'reel') {
    player.pause()
    document.querySelector('#btn-play')!.textContent = 'Play'
    stopReelLoop()
    reel.setDocument(doc)
    if (!reel.playing && reel.phaseName === 'idle') {
      reel.resetCells('idle')
    }
    reelLastTs = 0
    reelRaf = requestAnimationFrame(reelLoop)
  } else {
    stopReelLoop()
    player.draw()
    if (!player.state.playing) player.play()
    document.querySelector('#btn-play')!.textContent = 'Pause'
  }
  refreshUi()
}

document.querySelector('#pipeline-log')!.textContent = starter.log.join('\n')

// Pan / zoom
let dragging = false
let lastX = 0
let lastY = 0
canvas.addEventListener('pointerdown', (e) => {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  canvas.setPointerCapture(e.pointerId)
})
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  lastX = e.clientX
  lastY = e.clientY
  player.camera.x -= dx / player.camera.zoom
  player.camera.y -= dy / player.camera.zoom
  player.draw()
})
canvas.addEventListener('pointerup', () => {
  dragging = false
})
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    player.camera.zoom = Math.max(0.25, Math.min(4, player.camera.zoom * factor))
    player.draw()
  },
  { passive: false },
)

function setDoc(next: ArcDocument, selectAnim?: string) {
  doc = next
  player.setDocument(doc)
  if (selectAnim) player.setAnimation(selectAnim)
  refreshUi()
}

function refreshUi() {
  const stats = document.querySelector('#doc-stats')!
  stats.innerHTML = `
    <span><strong>${doc.meta.name}</strong></span>
    <span>${doc.bones.length} bones</span>
    <span>${doc.slots.length} slots</span>
    <span>${doc.animations.length} anims</span>
    <span>${doc.meta.createdBy}</span>
  `

  const boneList = document.querySelector('#bone-list')!
  boneList.innerHTML = ''
  for (const bone of doc.bones) {
    const li = document.createElement('li')
    if (player.options.selectedBone === bone.id) li.classList.add('selected')
    li.innerHTML = `<span style="display:flex;align-items:center;gap:0.45rem">
      <span class="bone-dot" style="background:${bone.color ?? '#5ecf9a'}"></span>
      ${bone.name}
    </span>
    <span class="muted">${bone.parent ?? 'root'}</span>`
    li.addEventListener('click', () => {
      player.options.selectedBone = bone.id
      player.draw()
      refreshUi()
    })
    boneList.appendChild(li)
  }

  document.querySelector('#constraint-list')!.textContent =
    doc.constraints.length === 0
      ? 'None'
      : doc.constraints.map((c) => `${c.name} (${c.kind})`).join(' · ')

  const animList = document.querySelector('#anim-list')!
  const animSelect = document.querySelector<HTMLSelectElement>('#anim-select')!
  animList.innerHTML = ''
  animSelect.innerHTML = ''
  for (const anim of doc.animations) {
    const li = document.createElement('li')
    if (player.state.animationId === anim.id) li.classList.add('selected')
    li.innerHTML = `<span>${anim.name}</span><span class="muted">${anim.duration.toFixed(1)}s${anim.loop ? ' ∞' : ''}</span>`
    li.addEventListener('click', () => {
      player.setAnimation(anim.id)
      refreshUi()
    })
    animList.appendChild(li)

    const opt = document.createElement('option')
    opt.value = anim.id
    opt.textContent = anim.name
    if (player.state.animationId === anim.id) opt.selected = true
    animSelect.appendChild(opt)
  }

  const issues = validateDocument(doc)
  const val = document.querySelector('#validation')!
  if (!issues.length) val.textContent = 'Document valid ✓'
  else val.textContent = issues.map((i) => `${i.level}: ${i.path} — ${i.message}`).join('\n')

  const anim = player.currentAnim()
  document.querySelector('#hud-status')!.textContent = anim
    ? `${doc.meta.name} · ${anim.name}`
    : `${doc.meta.name} · rest pose`
}

function runCompile(mode: 'rig' | 'animate' | 'both') {
  const intent = promptEl.value.trim()
  if (!intent) return
  try {
    const compiled = compile({
      intent,
      mode,
      base: mode === 'animate' ? doc : undefined,
    })
    const newest = compiled.doc.animations[compiled.doc.animations.length - 1]?.id
    setDoc(compiled.doc, newest)
    document.querySelector('#compile-log')!.textContent = compiled.log.join('\n')
  } catch (err) {
    document.querySelector('#compile-log')!.textContent =
      err instanceof Error ? err.message : String(err)
  }
}

function adopt(next: ArcDocument, log: string[], animId = 'idle') {
  setDoc(next, next.animations.some((a) => a.id === animId) ? animId : next.animations[0]?.id)
  document.querySelector('#pipeline-log')!.textContent = log.join('\n')
  document.querySelector('#compile-log')!.textContent = log.join('\n')
  player.camera = { x: 0, y: 20, zoom: 1.6 }
  player.draw()
}

document.querySelector('#btn-symbol-kit')!.addEventListener('click', () => {
  try {
    const { doc: next, log } = compileSymbolKit('Gold Gem')
    eventLines.length = 0
    adopt(next, log, 'idle')
    player.camera = { x: 0, y: 10, zoom: 1.9 }
    reel.setDocument(next)
    setMode('rig')
  } catch (err) {
    document.querySelector('#pipeline-log')!.textContent = err instanceof Error ? err.message : String(err)
  }
})

document.querySelector('#btn-reel-spin')!.addEventListener('click', () => {
  if (!doc.animations.some((a) => a.id === 'land')) {
    const { doc: next, log } = compileSymbolKit('Gold Gem')
    adopt(next, log, 'idle')
    reel.setDocument(next)
  } else {
    reel.setDocument(doc)
  }
  eventLines.length = 0
  pushEventLine('— scripted spin —')
  setMode('reel')
  reel.playScript(defaultSpinScript())
})

document.querySelector('#btn-mode-rig')!.addEventListener('click', () => setMode('rig'))
document.querySelector('#btn-mode-reel')!.addEventListener('click', () => {
  reel.setDocument(doc)
  setMode('reel')
})

document.querySelector('#btn-sample')!.addEventListener('click', () => {
  try {
    const { doc: next, log } = compileSampleCharacter()
    adopt(next, log, 'walk')
    setMode('rig')
  } catch (err) {
    document.querySelector('#pipeline-log')!.textContent = err instanceof Error ? err.message : String(err)
  }
})

document.querySelector('#btn-upload')!.addEventListener('click', () => {
  document.querySelector<HTMLInputElement>('#file-art')!.click()
})

document.querySelector('#file-art')!.addEventListener('change', () => {
  const file = document.querySelector<HTMLInputElement>('#file-art')!.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    try {
      const { doc: next, log } = splitAndRig(img, file.name.replace(/\.[^.]+$/, '') || 'Character')
      adopt(next, log, 'idle')
    } catch (err) {
      document.querySelector('#pipeline-log')!.textContent = err instanceof Error ? err.message : String(err)
    }
    URL.revokeObjectURL(url)
  }
  img.src = url
})

document.querySelector('#btn-rig')!.addEventListener('click', () => runCompile('rig'))
document.querySelector('#btn-animate')!.addEventListener('click', () => runCompile('animate'))
document.querySelector('#btn-both')!.addEventListener('click', () => runCompile('both'))

document.querySelector('#btn-play')!.addEventListener('click', () => {
  if (mode === 'reel') {
    if (reel.playing) {
      reel.playing = false
      document.querySelector('#btn-play')!.textContent = 'Play'
    } else {
      if (reel.phaseName === 'done' || reel.phaseName === 'idle') {
        reel.playScript(defaultSpinScript())
      } else {
        reel.playing = true
      }
      document.querySelector('#btn-play')!.textContent = 'Pause'
    }
    return
  }
  player.toggle()
  document.querySelector('#btn-play')!.textContent = player.state.playing ? 'Pause' : 'Play'
})

document.querySelector('#anim-select')!.addEventListener('change', (e) => {
  const id = (e.target as HTMLSelectElement).value
  player.setAnimation(id)
  refreshUi()
})

document.querySelector('#speed')!.addEventListener('input', (e) => {
  player.state.speed = parseFloat((e.target as HTMLInputElement).value)
})

const scrub = document.querySelector<HTMLInputElement>('#scrub')!
scrub.addEventListener('input', () => {
  const anim = player.currentAnim()
  const dur = anim?.duration ?? 1
  player.pause()
  document.querySelector('#btn-play')!.textContent = 'Play'
  player.seek((scrub.valueAsNumber / 1000) * dur)
})

player.onChange(() => {
  const anim = player.currentAnim()
  const dur = anim?.duration ?? 1
  const t = player.state.time
  scrub.value = String(Math.round((t / (dur || 1)) * 1000))
  document.querySelector('#time-readout')!.textContent = `${t.toFixed(2)} / ${dur.toFixed(2)}s`
})

function toggle(btnId: string, key: 'showBones' | 'showLabels' | 'showGrid') {
  const btn = document.querySelector(`#${btnId}`)!
  btn.addEventListener('click', () => {
    player.options[key] = !player.options[key]
    btn.classList.toggle('active', player.options[key])
    player.draw()
  })
}
toggle('tog-bones', 'showBones')
toggle('tog-labels', 'showLabels')
toggle('tog-grid', 'showGrid')

document.querySelector('#zoom-in')!.addEventListener('click', () => {
  player.camera.zoom = Math.min(4, player.camera.zoom * 1.15)
  player.draw()
})
document.querySelector('#zoom-out')!.addEventListener('click', () => {
  player.camera.zoom = Math.max(0.25, player.camera.zoom / 1.15)
  player.draw()
})
document.querySelector('#zoom-reset')!.addEventListener('click', () => {
  player.camera = { x: 0, y: -20, zoom: 1.35 }
  player.draw()
})

document.querySelector('#btn-export-arc')!.addEventListener('click', () => {
  downloadText(`${slug(doc.meta.name)}.arc.json`, exportArcJson(doc))
})
document.querySelector('#btn-export-runtime')!.addEventListener('click', () => {
  downloadText(`${slug(doc.meta.name)}.runtime.json`, exportRuntimeBundle(doc))
})
document.querySelector('#btn-export-spine')!.addEventListener('click', () => {
  downloadText(`${slug(doc.meta.name)}.spine-sketch.json`, exportSpineCompatSketch(doc))
})

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'arc'
}

refreshUi()
window.addEventListener('resize', () => player.draw())
