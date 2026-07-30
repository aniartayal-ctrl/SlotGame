# SlotGame — iGaming Market Research

Global iGaming & Pragmatic Play research report with charts, operator data, and aggregator analysis.

## Slot art with FLUX (beginner playbook)

Non-technical step-by-step guide to specialize an open-weight FLUX.2 model for slot-game art using a LoRA:

- Start here: [slot-art-flux-guide/START-HERE.md](slot-art-flux-guide/START-HERE.md)
- Checklist: [slot-art-flux-guide/checklists/master-checklist.md](slot-art-flux-guide/checklists/master-checklist.md)
- One-page cheat sheet: [slot-art-flux-guide/CHEAT-SHEET.md](slot-art-flux-guide/CHEAT-SHEET.md)

## Preview the Report

**Open in browser:**

- [igaming-research/index.html](igaming-research/index.html) — full report (recommended)
- [index.html](index.html) — auto-redirects to the report

**Local preview server:**

```bash
cd /workspace
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/igaming-research/index.html`

## Contents

- **GROK_RESEARCH_BRIEF.md** — full text brief for Grok/AI consumption (all insights, no charts needed)
- 12 research sections (market, games, competitors, operators, aggregators, platforms)
- 20 data visualization charts
- Light skeuomorphic UI theme
- Interactive HTML report
- **slot-art-flux-guide/** — beginner LoRA specialization playbook for slot symbol art

## Regenerate Charts

```bash
cd igaming-research
python3 generate_charts.py
```
