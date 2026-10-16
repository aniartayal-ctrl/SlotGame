# SlotGame

iGaming research plus **ARC** — an AI-native rigging & animation compiler (Spine replacement).

## ARC Studio (new)

Deterministic 2D skeletal engine + AI procedural rigger/motion director.

```bash
cd arc-studio
npm install
npm run dev
```

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
