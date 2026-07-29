# SlotGame — Global iGaming & Pragmatic Play Competitive Intelligence

A source-tagged research report on the worldwide online casino market and Pragmatic Play's
position inside it: market sizing, game data, popular mechanics, competitor benchmarking and
Pragmatic Play's blind spots — with 30 charts and an interactive dashboard.

**Research cut-off: 29 July 2026.** Latest actuals are FY2025 or Q2 2026 unless stated.

## Open the report

```bash
python3 -m http.server 8080
# then visit http://localhost:8080/igaming-research/index.html
```

It also opens straight from the filesystem — `igaming-research/index.html` — because the dataset is
inlined at build time and Chart.js is vendored locally. No network access is required.

## What's in here

| Path | What it is |
|---|---|
| `igaming-research/index.html` | The interactive dashboard — 9 live charts, 30 static charts, sortable tables, lightbox |
| `igaming-research/data/dataset.json` | Every chart series, each with a source URL and a confidence tier |
| `igaming-research/generate_charts.py` | Renders all 30 PNG charts from the dataset |
| `igaming-research/build_report.py` | Inlines the dataset into `report_template.html` to produce `index.html` |
| `igaming-research/report_template.html` | The dashboard source (edit this, not `index.html`) |
| `igaming-research/GROK_RESEARCH_BRIEF.md` | Plain-text brief of the findings, for feeding to an LLM |
| `slot-studio-competitive-landscape-2026.md` | Supplier benchmarking — financials, market share, studio profiles (1,100 lines) |
| `slot-mechanics-and-player-preferences-2026.md` | Mechanics, RTP, volatility, bonus buy, player behaviour (1,180 lines) |
| `regional-markets-and-regulation-2026.md` | Country-by-country market sizing, tax, licensing and enforcement |

## Rebuilding

```bash
pip install matplotlib numpy

cd igaming-research
python3 generate_charts.py   # dataset.json -> charts/*.png
python3 build_report.py      # dataset.json + report_template.html -> index.html
```

Edit `data/dataset.json` and re-run both scripts. Nothing is hard-coded in the chart or report code
except layout.

## How to read the numbers

Every figure carries a confidence tier, and the tier is printed on the chart:

| Tier | Meaning |
|---|---|
| **A** | Regulator-published, audited, or statutory primary source |
| **B** | Named commercial dataset with a stated methodology — Eilers & Krejcik, Blask, SlotsRank, bet365, SlotCatalog, iGamingCompass |
| **C** | Company-reported or single-source trade press, unaudited |
| **D** | Analyst judgement by this report — a scored opinion, not a measurement |

### Gaps that are left blank on purpose

- **Pragmatic Play files no audited accounts anywhere.** Revenue, EBITDA and valuation are unknown.
  Figures circulating online trace to unattributed or AI-generated sources and are not reproduced here.
- **No authoritative global slot-studio GGR-share table exists.** The report assembles four independent
  proxies that disagree because they measure different things.
- **Catalogue counts vary by roughly ±40%** between sources depending on whether RTP variants, re-skins
  and partner content are counted.
- **No credible public figure exists for bonus buy's share of slot GGR.** The circulating "15–25%" has
  no named source.

## Scope and independence

Desk research compiled from public sources. No relationship with Pragmatic Play, ARRISE or any
operator or supplier named in it. Nothing here is investment advice or a recommendation to gamble.
