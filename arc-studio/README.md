# Kinetic Pro (ARC engine)

**Six-state slot symbol studio** on the ARC deterministic rigging & animation engine — a Spine replacement for 2D skeletal animation.

Kinetic Pro’s contract: every symbol speaks `idle`, `land`, `win-small`, `win-big`, `anticipation`, and `dim`, and the player emits `land`, `win-start`, `win-peak`, and `loop-end` on time. Open **Reel stage** for a scripted 5×3 spin that logs those events.

The geometry/IK/render engine owns space and pixels. AI acts only as a procedural rigger and motion director that writes the ARC document schema.

## Architecture

```
Intent (NL) ──► Compiler ──► ArcDocument schema ──► Solver (FK/IK) ──► Canvas renderer
                    ▲                                    │
                    │         AI rigger / director        │
                    └──────── patches only ───────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **Schema** (`src/schema`) | Bones, slots, attachments, skins, constraints, keyframe animations, patches |
| **Engine** (`src/engine`) | Matrices, timeline sampling, 1/2-bone IK + FABRIK, mesh skinning, playback, canvas render |
| **AI** (`src/ai`) | Procedural rigger (archetypes + features) & motion director (idle/walk/win/fly/…) |
| **Compiler** (`src/compiler`) | Intent → validated document + export (`.arc.json`, runtime bundle, Spine-compat sketch) |
| **Studio** (`src/main.ts`) | Viewport, timeline, AI prompt panel, export |

AI never invents matrices. It only mutates the schema; the engine evaluates poses deterministically.

## Quick start

```bash
cd arc-studio
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test      # unit tests
npm run build # production build → dist/
```

## Studio workflow

1. **Rig** — describe a character (`Casino mascot with tail and crown`).
2. **Animate** — describe motion (`epic big win once`, `walk cycle`, `fly flap`).
3. **Rig + Animate** — compile both in one pass.
4. Scrub the timeline, toggle bone overlays, pan/zoom the viewport.
5. **Export** `.arc.json` (authoring), runtime bundle (playback), or Spine-compat sketch (migration aid).

## Runtime embed (engine only)

```ts
import { solvePose } from './engine/solver'
import { renderFrame } from './engine/renderer'
import type { ArcDocument } from './schema/types'

const doc = await fetch('/hero.arc.json').then((r) => r.json()) as ArcDocument
const pose = solvePose(doc, 'win', timeSeconds)
renderFrame(ctx, doc, pose, { x: 0, y: 0, zoom: 1 })
```

## Slot / iGaming fit

Built for reel characters, mascots, win moments, and symbol pops without Esoteric/Spine licensing:

- Humanoid, mascot, dragon, quadruped, prop, and **slot-symbol** archetypes
- Motion presets: idle, walk, win/celebrate, spin-hook, attack, fly, bounce
- Gold/casino style palettes for on-brand placeholders until art is attached

## Extending with a real LLM

Point an LLM at the schema types in `src/schema/types.ts` and have it emit `ArcPatch[]` (or full `ArcDocument`). Run patches through `applyPatches` + `validateDocument`, then play with `ArcPlayer`. The local procedural AI in `src/ai/*` is the offline default and the reference implementation of “AI writes data, engine draws.”

## Format

`ArcDocument` version `1.0` — see `src/schema/types.ts`. Exported files use the same shape (runtime bundle strips metadata only).
