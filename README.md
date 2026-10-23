# SlotGame

iGaming research plus **Kinetic Pro** — a six-state slot symbol studio on the ARC deterministic rigging & animation engine (Spine replacement).

## Kinetic Pro (ARC Studio)

```bash
cd arc-studio
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

- **Load symbol kit** — idle / land / win-small / win-big / anticipation / dim with timed game events
- **Reel stage** — scripted 5×3 spin that logs `land` → `win-start` → `win-peak` in order

See [arc-studio/README.md](arc-studio/README.md).

## iGaming Research Report

**Open in browser:**

- [igaming-research/index.html](igaming-research/index.html) — full report (recommended)
- [index.html](index.html) — auto-redirects to the report

```bash
cd /workspace
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/igaming-research/index.html`

### Contents

- **GROK_RESEARCH_BRIEF.md** — full text brief for Grok/AI consumption
- 12 research sections + 20 charts
- Regenerate charts: `cd igaming-research && python3 generate_charts.py`
