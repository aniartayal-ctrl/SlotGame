# SlotGame — iGaming Market Research

Global iGaming & Pragmatic Play research report with charts, operator data, and aggregator analysis.

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

## Regenerate Charts

```bash
cd igaming-research
python3 generate_charts.py
```
