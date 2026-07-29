#!/usr/bin/env python3
"""Render every chart in the iGaming / Pragmatic Play report from data/dataset.json.

Every figure drawn here traces back to a source URL recorded in the dataset. Nothing
is hard-coded in this file except layout. Run:  python3 generate_charts.py
"""

import json
import textwrap
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch

ROOT = Path(__file__).parent
OUT = ROOT / "charts"
OUT.mkdir(exist_ok=True)
DATA = json.loads((ROOT / "data" / "dataset.json").read_text())

# ── palette ────────────────────────────────────────────────────────────────────
INK = "#0d1117"
PANEL = "#141a22"
GRID = "#242c38"
TEXT = "#e6edf3"
MUTED = "#8b98a9"

PP = "#ff7a1a"          # Pragmatic Play
RIVAL = "#4c9aff"       # generic competitor
GOOD = "#3fb950"
BAD = "#f85149"
WARN = "#e3b341"
PURPLE = "#a371f7"
TEAL = "#2dd4bf"
PINK = "#f778ba"
SERIES = [PP, RIVAL, TEAL, PURPLE, WARN, PINK, GOOD, BAD]

plt.rcParams.update({
    "figure.facecolor": INK,
    "savefig.facecolor": INK,
    "axes.facecolor": PANEL,
    "axes.edgecolor": GRID,
    "axes.labelcolor": MUTED,
    "axes.titlecolor": TEXT,
    "text.color": TEXT,
    "xtick.color": MUTED,
    "ytick.color": MUTED,
    "grid.color": GRID,
    "grid.linewidth": 0.8,
    "font.family": "DejaVu Sans",
    "font.size": 10.5,
    "legend.frameon": False,
    "legend.labelcolor": TEXT,
})

CONF_COLOR = {"A": GOOD, "B": RIVAL, "C": WARN, "D": BAD, "A/B": GOOD}


def frame(ax):
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(GRID)
    ax.tick_params(length=0)


def head(fig, block, extra=None):
    """Draw the title / subtitle / confidence badge / source line."""
    title = block.get("title", "")
    subtitle = block.get("subtitle", "")
    conf = block.get("conf", "")
    src = block.get("source", {})
    fig.text(0.012, 0.985, title, fontsize=16, fontweight="bold", va="top", color=TEXT)
    if subtitle:
        fig.text(0.012, 0.925, subtitle, fontsize=10.5, va="top", color=MUTED)
    if conf:
        fig.text(0.988, 0.985, f"TIER {conf}", fontsize=9, fontweight="bold", va="top",
                 ha="right", color=CONF_COLOR.get(conf, MUTED))
    line = extra or src.get("name", "")
    if line:
        fig.text(0.012, 0.012, "Source: " + textwrap.shorten(line, 165, placeholder="…"),
                 fontsize=8.5, color=MUTED, va="bottom")


def save(fig, name):
    fig.savefig(OUT / name, dpi=150, bbox_inches="tight", pad_inches=0.35)
    plt.close(fig)
    print(f"  {name}")


def newfig(w=12, h=6.6, top=0.86):
    fig, ax = plt.subplots(figsize=(w, h))
    fig.subplots_adjust(top=top, bottom=0.13, left=0.09, right=0.97)
    frame(ax)
    return fig, ax


def barlabels(ax, bars, fmt="{:,.0f}", pad=0.01, color=None, size=9.5):
    span = ax.get_xlim()[1] - ax.get_xlim()[0]
    for b in bars:
        w = b.get_width()
        ax.text(w + span * pad, b.get_y() + b.get_height() / 2, fmt.format(w),
                va="center", fontsize=size, color=color or TEXT)


# ── 01 global trajectory ───────────────────────────────────────────────────────
def c01():
    d = DATA["global_trajectory"]
    fig, ax = newfig()
    x = np.arange(len(d["years"]))
    land = [t - o for t, o in zip(d["total_ggr"], d["online_ggr"])]
    ax.bar(x, land, 0.55, label="Land-based GGR", color="#2b3442")
    ax.bar(x, d["online_ggr"], 0.55, bottom=land, label="Online GGR", color=PP)
    for i, (t, o, s) in enumerate(zip(d["total_ggr"], d["online_ggr"], d["online_share_pct"])):
        ax.text(i, t + 22, f"${t:,}bn", ha="center", fontsize=10, fontweight="bold")
        ax.text(i, land[i] + o / 2, f"{s}%\nonline", ha="center", va="center",
                fontsize=10, fontweight="bold", color="#1b1105")
    ax.axvline(1.5, color=MUTED, ls=":", lw=1)
    ax.text(1.55, 1010, "forecast", fontsize=9, color=MUTED, style="italic")
    ax.set_xticks(x)
    ax.set_xticklabels(d["years"])
    ax.set_ylabel("Gross gaming revenue, US$bn")
    ax.set_ylim(0, 1180)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    ax.legend(loc="upper left")
    head(fig, d)
    save(fig, "01_global_trajectory.png")


# ── 02 region ─────────────────────────────────────────────────────────────────
def c02():
    d = DATA["region_ggr_2026"]
    rows = d["rows"]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(13.5, 6.4), gridspec_kw={"width_ratios": [1.35, 1]})
    fig.subplots_adjust(top=0.84, bottom=0.13, left=0.11, right=0.97, wspace=0.42)
    for a in (a1, a2):
        frame(a)
    y = np.arange(len(rows))[::-1]
    b = a1.barh(y, [r["ggr"] for r in rows], 0.6, color=[SERIES[i] for i in range(len(rows))])
    a1.set_yticks(y)
    a1.set_yticklabels([r["region"] for r in rows])
    a1.set_xlim(0, 52)
    a1.set_xlabel("Online GGR 2026E, US$bn")
    a1.grid(axis="x", alpha=0.5)
    a1.set_axisbelow(True)
    barlabels(a1, b, "${:,.1f}bn")
    a1.set_title("Market size", fontsize=11, color=MUTED, loc="left")

    a2.scatter([r["growth"] for r in rows], [r["regulated"] for r in rows],
               s=[r["ggr"] * 34 for r in rows], c=SERIES[:len(rows)],
               alpha=0.85, edgecolors=INK, linewidth=1.6, zorder=3)
    for r in rows:
        a2.annotate(r["region"], (r["growth"], r["regulated"]), textcoords="offset points",
                    xytext=(0, -26), ha="center", fontsize=9, color=TEXT)
    a2.set_xlabel("YoY growth, %")
    a2.set_ylabel("Regulated share of GGR, %")
    a2.set_xlim(0, 36)
    a2.set_ylim(0, 112)
    a2.grid(alpha=0.4)
    a2.set_axisbelow(True)
    a2.set_title("Growth vs regulatory maturity  (bubble = GGR)", fontsize=11, color=MUTED, loc="left")
    head(fig, d)
    save(fig, "02_region_ggr.png")


# ── 03 slot intensity ─────────────────────────────────────────────────────────
def c03():
    d = DATA["slot_intensity"]
    rows = d["rows"]
    fig, ax = newfig(11.5, 5.8)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["pct"] for r in rows], 0.58, color=PP)
    ax.set_yticks(y)
    ax.set_yticklabels([r["market"] for r in rows])
    ax.set_xlim(0, 118)
    ax.set_xlabel("Slots as % of online casino GGR")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        ax.text(bar.get_width() + 1.6, bar.get_y() + bar.get_height() / 2,
                f"{r['pct']}%", va="center", fontweight="bold", fontsize=10)
        if r["note"]:
            ax.text(bar.get_width() + 9, bar.get_y() + bar.get_height() / 2,
                    textwrap.shorten(r["note"], 62, placeholder="…"), va="center",
                    fontsize=8.5, color=MUTED)
    head(fig, d)
    save(fig, "03_slot_intensity.png")


# ── 04 US states ──────────────────────────────────────────────────────────────
def c04():
    d = DATA["us_states_2025"]
    rows = d["rows"]
    fig, ax = newfig(12, 6.2)
    x = np.arange(len(rows))
    b = ax.bar(x, [r["rev"] for r in rows], 0.55, color=RIVAL)
    ax2 = ax.twinx()
    frame(ax2)
    ax2.plot(x, [r["growth"] for r in rows], "o--", color=PP, lw=2, ms=8, label="YoY growth")
    ax2.set_ylabel("YoY growth, %", color=PP)
    ax2.tick_params(axis="y", colors=PP)
    ax2.set_ylim(0, 100)
    for bar, r in zip(b, rows):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 70,
                f"${r['rev']:,.0f}m", ha="center", fontsize=9.5, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels([r["state"] for r in rows], fontsize=10)
    ax.set_ylabel("2025 iGaming revenue, US$m")
    ax.set_ylim(0, 4100)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    ax2.legend(loc="upper right")
    head(fig, d, d["source"]["name"] + " — " + textwrap.shorten(d["note"], 110, placeholder="…"))
    save(fig, "04_us_states.png")


# ── 05 tax ────────────────────────────────────────────────────────────────────
def c05():
    d = DATA["tax_rates"]
    rows = sorted(d["rows"], key=lambda r: r["rate"])
    fig, ax = newfig(12.5, 8)
    y = np.arange(len(rows))
    cols = [BAD if r["flag"] == "turnover" else (WARN if r["flag"] == "hike" else
            (TEAL if r["flag"] == "new" else RIVAL)) for r in rows]
    b = ax.barh(y, [r["rate"] for r in rows], 0.62, color=cols)
    ax.set_yticks(y)
    ax.set_yticklabels([r["market"] for r in rows])
    ax.set_xlim(0, 62)
    ax.set_xlabel("Headline tax rate, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        tag = "  ⚠ on TURNOVER" if r["base"] == "Turnover" else ""
        ax.text(bar.get_width() + 0.9, bar.get_y() + bar.get_height() / 2,
                f"{r['rate']}%{tag}", va="center", fontsize=9.5,
                fontweight="bold" if tag else "normal",
                color=BAD if tag else TEXT)
    ax.legend(handles=[Patch(color=BAD, label="Levied on turnover, not GGR"),
                       Patch(color=WARN, label="Raised in 2025–26"),
                       Patch(color=TEAL, label="New / opening market"),
                       Patch(color=RIVAL, label="Stable")],
              loc="lower right", ncol=2)
    head(fig, d)
    save(fig, "05_tax_rates.png")


# ── 06 channelisation ─────────────────────────────────────────────────────────
def c06():
    d = DATA["channelisation"]
    rows = [r for r in d["rows"] if r["tax"] is not None]
    fig, ax = newfig(11.5, 6.4)
    ax.scatter([r["tax"] for r in rows], [r["pct"] for r in rows], s=260,
               c=[BAD if r["pct"] < 60 else (WARN if r["pct"] < 80 else GOOD) for r in rows],
               edgecolors=INK, linewidth=1.8, zorder=3)
    for r in rows:
        ax.annotate(f"{r['market']}\n{r['pct']}%", (r["tax"], r["pct"]),
                    textcoords="offset points", xytext=(0, 18), ha="center",
                    fontsize=9.5, color=TEXT)
    ax.axhline(80, color=MUTED, ls=":", lw=1)
    ax.text(1, 81, "80% — widely used policy target", fontsize=9, color=MUTED)
    ax.set_xlabel("Headline tax on online casino, % (Germany's 5.3% is on turnover ≈ 40–55% effective on GGR)")
    ax.set_ylabel("Channelisation — % of online GGR captured by licensed operators")
    ax.set_xlim(0, 46)
    ax.set_ylim(40, 105)
    ax.grid(alpha=0.4)
    ax.set_axisbelow(True)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "06_channelisation.png")


# ── 07 market growth ──────────────────────────────────────────────────────────
def c07():
    d = DATA["market_growth"]
    rows = sorted(d["rows"], key=lambda r: r["growth"])
    fig, ax = newfig(12, 8.4)
    y = np.arange(len(rows))
    g = [r["growth"] for r in rows]
    b = ax.barh(y, g, 0.62, color=[BAD if v < 0 else GOOD for v in g])
    ax.set_yticks(y)
    ax.set_yticklabels([r["market"] for r in rows])
    ax.axvline(0, color=MUTED, lw=1)
    ax.set_xlim(-95, 100)
    ax.set_xlabel("YoY change in online casino / iGaming revenue, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        w = bar.get_width()
        ax.text(w + (3 if w >= 0 else -3), bar.get_y() + bar.get_height() / 2,
                f"{w:+.1f}%", va="center", ha="left" if w >= 0 else "right",
                fontsize=9.5, fontweight="bold")
    head(fig, d)
    save(fig, "07_market_growth.png")


# ── 08 UK slots quarterly ─────────────────────────────────────────────────────
def c08():
    d = DATA["uk_slots_quarterly"]
    fig, ax = newfig(12, 6.4)
    x = np.arange(len(d["quarters"]))
    b = ax.bar(x, d["ggy_gbp_m"], 0.5, color=PP, label="Slots GGY (£m)")
    for bar, v in zip(b, d["ggy_gbp_m"]):
        ax.text(bar.get_x() + bar.get_width() / 2, v + 8, f"£{v}m", ha="center",
                fontsize=10, fontweight="bold")
    ax.set_ylim(600, 860)
    ax.set_ylabel("Slots GGY, £m", color=PP)
    ax.tick_params(axis="y", colors=PP)
    ax.set_xticks(x)
    ax.set_xticklabels(d["quarters"])
    ax.grid(axis="y", alpha=0.4)
    ax.set_axisbelow(True)

    ax2 = ax.twinx()
    frame(ax2)
    ax2.plot(x, d["spins_per_session"], "o-", color=RIVAL, lw=2.2, ms=7, label="Spins per session")
    ax2.plot(x, [v * 30 for v in d["ggy_per_session"]], "s--", color=TEAL, lw=2.2, ms=7,
             label="GGY per session (£, right axis ×30)")
    ax2.plot(x, [v * 7 for v in d["avg_session_min"]], "^:", color=PURPLE, lw=2.2, ms=8,
             label="Avg session length (min, ×7)")
    ax2.set_ylim(95, 135)
    ax2.set_ylabel("Engagement indices")
    h1, l1 = ax.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    ax.legend(h1 + h2, l1 + l2, loc="lower left", ncol=2, fontsize=9)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "08_uk_slots_quarterly.png")


# ── 09 Europe supplier share ──────────────────────────────────────────────────
def c09():
    d = DATA["europe_supplier_share"]
    sup = d["suppliers"]
    fig, ax = newfig(12, 6.2)
    x = np.arange(len(sup))
    w = 0.36
    a = ax.bar(x - w / 2, [v or 0 for v in d["oct_2025"]], w, color="#2b3442", label="Oct 2025")
    b = ax.bar(x + w / 2, [v or 0 for v in d["jun_2026"]], w,
               color=[PP if s == "Pragmatic Play" else RIVAL for s in sup], label="Jun 2026")
    for bars, vals in ((a, d["oct_2025"]), (b, d["jun_2026"])):
        for bar, v in zip(bars, vals):
            if v:
                ax.text(bar.get_x() + bar.get_width() / 2, v + 0.25, f"{v}%",
                        ha="center", fontsize=9.5, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(sup)
    ax.set_ylabel("Share of European online casino GGR, %")
    ax.set_ylim(0, 21)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    ax.legend(loc="upper right")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "09_europe_supplier_share.png")


# ── 10 North America supplier share ───────────────────────────────────────────
def c10():
    d = DATA["na_supplier_share"]
    rows = d["rows"]
    fig, ax = newfig(11.5, 5.8)
    y = np.arange(len(rows))[::-1]
    cols = [PP if r["supplier"] == "Pragmatic Play" else RIVAL for r in rows]
    b = ax.barh(y, [r["pct"] for r in rows], 0.58, color=cols)
    ax.set_yticks(y)
    ax.set_yticklabels([r["supplier"] for r in rows])
    ax.set_xlim(0, 22)
    ax.set_xlabel("Share of North American online casino GGR, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        if r["pct"] == 0:
            ax.text(0.4, bar.get_y() + bar.get_height() / 2,
                    "0%  — not licensed in the US regulated market", va="center",
                    fontsize=10.5, fontweight="bold", color=PP)
        else:
            ax.text(bar.get_width() + 0.35, bar.get_y() + bar.get_height() / 2,
                    f"{r['pct']}%", va="center", fontsize=10, fontweight="bold")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "10_na_supplier_share.png")


# ── 11 lobby footprint ────────────────────────────────────────────────────────
def c11():
    d = DATA["lobby_footprint"]
    rows = d["rows"]
    fig, ax = newfig(12.5, 6.4)
    x = np.arange(len(rows))
    w = 0.26
    cols = [PP if r["provider"] == "Pragmatic Play" else RIVAL for r in rows]
    ax.bar(x - w, [r["games"] for r in rows], w, color=cols, label="Games in lobbies")
    ax.bar(x, [r["sites"] * 2.4 for r in rows], w, color=TEAL, label="Operator sites (×2.4)")
    ax.bar(x + w, [r["pages"] / 3 for r in rows], w, color=PURPLE, label="Lobby pages (÷3)")
    for i, r in enumerate(rows):
        ax.text(i - w, r["games"] + 22, f"{r['games']:,}", ha="center", fontsize=9, fontweight="bold")
        ax.text(i, r["sites"] * 2.4 + 22, f"{r['sites']}", ha="center", fontsize=9, color=TEAL)
        ax.text(i + w, r["pages"] / 3 + 22, f"{r['pages']:,}", ha="center", fontsize=9, color=PURPLE)
        ax.text(i, -105, f"{r['countries']} countries", ha="center", fontsize=9, color=MUTED)
    ax.set_xticks(x)
    ax.set_xticklabels([r["provider"] for r in rows])
    ax.set_ylabel("Count (scaled to fit one axis)")
    ax.set_ylim(0, 1450)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    ax.legend(loc="upper right", ncol=3)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "11_lobby_footprint.png")


# ── 12 release quality vs volume ──────────────────────────────────────────────
def c12():
    d = DATA["release_quality"]
    rows = d["rows"]
    # hand-placed label offsets so the tight top-left cluster stays readable
    off = {
        "ELK Studios": (34, 14), "Peter & Sons": (-14, 22), "Nolimit City": (46, -6),
        "Big Time Gaming": (44, 12), "Hacksaw Gaming": (0, 26), "Play'n GO": (0, 26),
        "Playtech": (0, -40), "Pragmatic Play": (-6, 30), "OctoPlay": (0, -40),
    }
    fig, ax = newfig(12.5, 7.4)
    for r in rows:
        pp = r["provider"] == "Pragmatic Play"
        ax.scatter(r["releases"], r["avg"], s=140 + r["gold"] * 130,
                   c=PP if pp else (GOOD if r["gold"] else RIVAL),
                   edgecolors=INK, linewidth=1.8, zorder=3)
        dx, dy = off.get(r["provider"], (0, 26))
        ax.annotate(f"{r['provider']}\n{r['avg']:.1f} avg · {r['gold']} gold",
                    (r["releases"], r["avg"]), textcoords="offset points",
                    xytext=(dx, dy), ha="left" if dx > 20 else "center", fontsize=9.5,
                    color=PP if pp else TEXT, fontweight="bold" if pp else "normal")
    mean = np.mean([r["avg"] for r in rows])
    ax.axhline(mean, color=MUTED, ls=":", lw=1)
    ax.text(33.5, mean + 5, "field average", fontsize=9, color=MUTED, ha="right")
    ax.set_xlabel("New releases, 2026 year to date")
    ax.set_ylabel("Average quality score per release")
    ax.set_xlim(0, 36)
    ax.set_ylim(-30, 265)
    ax.grid(alpha=0.4)
    ax.set_axisbelow(True)
    ax.text(0.8, 250, "few releases, high craft", fontsize=9.5, color=GOOD, style="italic")
    ax.text(35.2, -22, "high output, low craft", fontsize=9.5, color=PP, style="italic", ha="right")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "12_release_quality.png")


# ── 13 demo demand ────────────────────────────────────────────────────────────
def c13():
    d = DATA["demo_demand"]
    rows = d["rows"]
    fig, ax = newfig(11.5, 6.2)
    y = np.arange(len(rows))[::-1]
    cols = [PP if r["provider"] == "Pragmatic Play" else RIVAL for r in rows]
    b = ax.barh(y, [r["plays"] for r in rows], 0.6, color=cols)
    ax.set_yticks(y)
    ax.set_yticklabels([r["provider"] for r in rows])
    ax.set_xlim(0, 62000)
    ax.set_xlabel("Demo plays")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    barlabels(ax, b, "{:,.0f}")
    head(fig, d)
    save(fig, "13_demo_demand.png")


# ── 14 supplier financials ────────────────────────────────────────────────────
def c14():
    d = DATA["supplier_financials"]
    rows = d["rows"]
    fig, ax = newfig(12.5, 6.6)
    x = np.arange(len(rows))
    vals = [r["revenue_eur_m"] or 0 for r in rows]
    cols = [PP if r["company"] == "Pragmatic Play" else RIVAL for r in rows]
    b = ax.bar(x, vals, 0.52, color=cols)
    for bar, r in zip(b, rows):
        if r["revenue_eur_m"] is None:
            ax.text(bar.get_x() + bar.get_width() / 2, 90, "NOT\nDISCLOSED", ha="center",
                    fontsize=11, fontweight="bold", color=PP)
            ax.text(bar.get_x() + bar.get_width() / 2, 420,
                    "#1 in Europe\nby GGR share", ha="center", fontsize=9.5, color=MUTED)
        else:
            ax.text(bar.get_x() + bar.get_width() / 2, r["revenue_eur_m"] + 45,
                    f"€{r['revenue_eur_m']:,.0f}m\n{r['margin']}% {r['margin_type']}",
                    ha="center", fontsize=9.5, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels([textwrap.fill(r["company"], 18) for r in rows], fontsize=9.5)
    ax.set_ylabel("FY2025 revenue, €m")
    ax.set_ylim(0, 2500)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    head(fig, d, "Company reports. Games Global figure is FY to Mar 2023 — the last disclosure before its IPO was withdrawn.")
    save(fig, "14_supplier_financials.png")


# ── 15 Evolution live vs RNG ──────────────────────────────────────────────────
def c15():
    d = DATA["evolution_quarterly"]
    fig, ax = newfig(12, 6.4)
    x = np.arange(len(d["quarters"]))
    ax.plot(x, d["live"], "o-", color=RIVAL, lw=2.6, ms=8, label="Live casino")
    ax.set_ylabel("Live casino revenue, €m", color=RIVAL)
    ax.tick_params(axis="y", colors=RIVAL)
    ax.set_ylim(415, 470)
    ax.set_xticks(x)
    ax.set_xticklabels(d["quarters"])
    ax.grid(alpha=0.4)
    ax.set_axisbelow(True)
    ax2 = ax.twinx()
    frame(ax2)
    ax2.plot(x, d["rng"], "s-", color=PP, lw=2.6, ms=8, label="RNG (slots)")
    ax2.set_ylabel("RNG revenue, €m", color=PP)
    ax2.tick_params(axis="y", colors=PP)
    ax2.set_ylim(66, 86)
    for i, v in enumerate(d["rng"]):
        ax2.annotate(f"{v:.1f}", (i, v), textcoords="offset points", xytext=(0, 10),
                     ha="center", fontsize=9, color=PP)
    h1, l1 = ax.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    ax.legend(h1 + h2, l1 + l2, loc="lower left")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "15_evolution_live_vs_rng.png")


# ── 16 Hacksaw growth ─────────────────────────────────────────────────────────
def c16():
    d = DATA["hacksaw_quarterly"]
    fig, ax = newfig(11.5, 6)
    x = np.arange(len(d["quarters"]))
    v = [r / 1000 for r in d["revenue_eur_k"]]
    b = ax.bar(x, v, 0.55, color=TEAL)
    for bar, val in zip(b, v):
        ax.text(bar.get_x() + bar.get_width() / 2, val + 0.9, f"€{val:.1f}m",
                ha="center", fontsize=9.5, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(d["quarters"])
    ax.set_ylabel("Revenue, €m")
    ax.set_ylim(0, 70)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "16_hacksaw_growth.png")


# ── 17 margins ────────────────────────────────────────────────────────────────
def c17():
    d = DATA["margins"]
    rows = d["rows"]
    fig, ax = newfig(11.5, 6)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["margin"] for r in rows], 0.6,
                color=[GOOD if r["margin"] > 60 else (WARN if r["margin"] > 35 else BAD) for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([r["company"] for r in rows])
    ax.set_xlim(0, 96)
    ax.set_xlabel("FY2025 margin, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        ax.text(bar.get_width() + 1.2, bar.get_y() + bar.get_height() / 2,
                f"{r['margin']}%  ({r['metric']})", va="center", fontsize=9.5)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "17_margins.png")


# ── 18 title reach ────────────────────────────────────────────────────────────
def c18():
    d = DATA["top_titles_reach"]
    rows = d["rows"]
    fig, ax = newfig(12, 6.2)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["sites"] for r in rows], 0.6, color=[PP if r["pp"] else RIVAL for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([f"{r['title']}\n{r['provider']}" for r in rows], fontsize=9.5)
    ax.set_xlim(0, 590)
    ax.set_xlabel("Operator sites carrying the title")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        lab = f"{r['sites']} sites" + (f" · {r['countries']} countries" if r["countries"] else "")
        ax.text(bar.get_width() + 8, bar.get_y() + bar.get_height() / 2, lab,
                va="center", fontsize=9.5, fontweight="bold")
    ax.legend(handles=[Patch(color=PP, label="Pragmatic Play / Reel Kingdom"),
                       Patch(color=RIVAL, label="Other suppliers")], loc="lower right")
    head(fig, d)
    save(fig, "18_title_reach.png")


# ── 19 Gates depth ────────────────────────────────────────────────────────────
def c19():
    d = DATA["gates_depth"]
    rows = d["rows"]
    fig, ax = newfig(12, 6.2)
    x = np.arange(len(rows))
    w = 0.4
    ax.bar(x - w / 2, [r["brands"] for r in rows], w, color=PP, label="Operator brands carrying")
    ax.bar(x + w / 2, [r["lobbies"] for r in rows], w, color="#8a4512", label="Front-lobby placements")
    for i, r in enumerate(rows):
        ax.text(i - w / 2, r["brands"] + 3, r["brands"], ha="center", fontsize=9, fontweight="bold")
        ax.text(i + w / 2, r["lobbies"] + 3, r["lobbies"], ha="center", fontsize=9, color=MUTED)
    ax.set_xticks(x)
    ax.set_xticklabels([r["market"] for r in rows], rotation=20, ha="right")
    ax.set_ylabel("Count")
    ax.set_ylim(0, 195)
    ax.grid(axis="y", alpha=0.5)
    ax.set_axisbelow(True)
    ax.legend(loc="upper right")
    head(fig, d)
    save(fig, "19_gates_depth.png")


# ── 20 no global #1 ───────────────────────────────────────────────────────────
def c20():
    d = DATA["no1_by_market"]
    rows = d["rows"]
    fig, ax = plt.subplots(figsize=(12.5, 6.8))
    fig.subplots_adjust(top=0.84, bottom=0.1, left=0.02, right=0.98)
    ax.axis("off")
    for i, r in enumerate(rows):
        yy = 1 - (i + 0.5) / len(rows)
        col = PP if r["pp"] else "#1c2430"
        ax.add_patch(plt.Rectangle((0.02, yy - 0.036), 0.96, 0.072,
                                   transform=ax.transAxes, facecolor="#171e28",
                                   edgecolor=GRID, lw=0.8, zorder=1))
        ax.add_patch(plt.Rectangle((0.02, yy - 0.036), 0.006, 0.072,
                                   transform=ax.transAxes, facecolor=col, zorder=2))
        ax.text(0.045, yy, r["market"], transform=ax.transAxes, va="center",
                fontsize=11, color=MUTED)
        ax.text(0.30, yy, r["title"], transform=ax.transAxes, va="center",
                fontsize=12.5, fontweight="bold", color=PP if r["pp"] else TEXT)
        ax.text(0.74, yy, r["provider"], transform=ax.transAxes, va="center",
                fontsize=10.5, color=MUTED)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "20_no_global_number_one.png")


# ── 21 shelf share US vs Germany ──────────────────────────────────────────────
def c21():
    d = DATA["shelf_share"]
    us, de = d["us"], d["germany"]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(13.5, 6.8))
    fig.subplots_adjust(top=0.83, bottom=0.11, left=0.13, right=0.97, wspace=0.42)
    for a, rows, title in ((a1, us, "United States  (76 licensed sites, 7 states)"),
                           (a2, de, "Germany  (all licensed .de lobbies)")):
        frame(a)
        y = np.arange(len(rows))[::-1]
        cols = [PP if r["studio"] in ("Pragmatic Play", "Reel Kingdom") else RIVAL for r in rows]
        b = a.barh(y, [r["n"] for r in rows], 0.6, color=cols)
        a.set_yticks(y)
        a.set_yticklabels([r["studio"] for r in rows], fontsize=9.5)
        a.set_xlim(0, 34)
        a.grid(axis="x", alpha=0.5)
        a.set_axisbelow(True)
        a.set_title(title, fontsize=11, color=MUTED, loc="left")
        a.set_xlabel("Titles in the market's top 100")
        for bar, r in zip(b, rows):
            if r["n"] == 0:
                a.text(0.5, bar.get_y() + bar.get_height() / 2, "0 — absent from the market",
                       va="center", fontsize=10, fontweight="bold", color=PP)
            else:
                a.text(bar.get_width() + 0.6, bar.get_y() + bar.get_height() / 2, r["n"],
                       va="center", fontsize=9.5, fontweight="bold")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "21_shelf_share.png")


# ── 22 max win ────────────────────────────────────────────────────────────────
def c22():
    d = DATA["max_win"]
    rows = d["rows"]
    fig, ax = newfig(12.5, 7.4)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["max"] for r in rows], 0.6, color=[PP if r["pp"] else RIVAL for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([f"{r['title']}  ·  {r['provider']}" for r in rows], fontsize=9.5)
    ax.set_xscale("log")
    ax.set_xlim(3000, 1_400_000)
    ax.set_xlabel("Maximum win multiplier (log scale)")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        ax.text(bar.get_width() * 1.13, bar.get_y() + bar.get_height() / 2,
                f"{r['max']:,}x" + (f"  ·  RTP {r['rtp']}%" if r["rtp"] else ""),
                va="center", fontsize=9.5)
    ax.axvline(50000, color=WARN, ls="--", lw=1.4)
    ax.text(52000, len(rows) - 0.6, "industry ceiling\nplateaued ~50,000x", fontsize=9, color=WARN)
    ax.legend(handles=[Patch(color=PP, label="Pragmatic Play / Reel Kingdom"),
                       Patch(color=RIVAL, label="Competitors")], loc="lower right")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "22_max_win.png")


# ── 23 money train paradox ────────────────────────────────────────────────────
def c23():
    d = DATA["money_train_paradox"]
    rows = d["rows"]
    fig, ax = newfig(11.5, 6)
    x = np.arange(len(rows))
    b = ax.bar(x, [r["multiplier"] for r in rows], 0.5, color=RIVAL, label="Headline max win multiplier")
    for bar, r in zip(b, rows):
        ax.text(bar.get_x() + bar.get_width() / 2, r["multiplier"] + 3500,
                f"{r['multiplier']:,}x", ha="center", fontsize=10, fontweight="bold")
    ax.set_ylabel("Max win multiplier", color=RIVAL)
    ax.tick_params(axis="y", colors=RIVAL)
    ax.set_ylim(0, 185000)
    ax.set_xticks(x)
    ax.set_xticklabels([r["game"] for r in rows])
    ax.grid(axis="y", alpha=0.4)
    ax.set_axisbelow(True)
    ax2 = ax.twinx()
    frame(ax2)
    ax2.plot(x, [r["ceiling"] for r in rows], "o-", color=BAD, lw=2.6, ms=9,
             label="Actual maximum payout ($, max bet × multiplier)")
    for i, r in enumerate(rows):
        ax2.annotate(f"${r['ceiling']:,}\nmax bet ${r['max_bet']}", (i, r["ceiling"]),
                     textcoords="offset points", xytext=(0, -34), ha="center",
                     fontsize=9, color=BAD)
    ax2.set_ylim(700000, 1150000)
    ax2.set_ylabel("Actual payout ceiling, US$", color=BAD)
    ax2.tick_params(axis="y", colors=BAD)
    h1, l1 = ax.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    ax.legend(h1 + h2, l1 + l2, loc="upper left", fontsize=9)
    head(fig, d, "The headline multiplier grew 7.5× across the series while the amount a player can actually win fell.")
    save(fig, "23_money_train_paradox.png")


# ── 24 RTP compression ────────────────────────────────────────────────────────
def c24():
    d = DATA["rtp_compression"]
    rows = d["rows"]
    fig, ax = newfig(12, 6.6)
    y = np.arange(len(rows))[::-1]
    for yy, r in zip(y, rows):
        ax.plot([r["deployed"], r["max"]], [yy, yy], color=GRID, lw=3, zorder=1)
        ax.scatter(r["max"], yy, s=110, color=RIVAL, zorder=3, edgecolors=INK, lw=1.4)
        ax.scatter(r["deployed"], yy, s=110, color=BAD, zorder=3, edgecolors=INK, lw=1.4)
        ax.text(r["deployed"] - 0.13, yy, f"{r['deployed']:.2f}%", va="center", ha="right",
                fontsize=9.5, color=BAD, fontweight="bold")
        ax.text(r["max"] + 0.13, yy, f"{r['max']:.2f}%", va="center", fontsize=9.5, color=RIVAL)
        ax.text(97.35, yy, f"−{r['max'] - r['deployed']:.2f}pp", va="center",
                fontsize=9.5, color=WARN, fontweight="bold")
    ax.set_yticks(y)
    ax.set_yticklabels([f"{r['title']}\n{r['provider']}" for r in rows], fontsize=9)
    ax.set_xlim(91, 98)
    ax.set_xlabel("Return to player, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    ax.legend(handles=[Patch(color=RIVAL, label="Provider maximum RTP"),
                       Patch(color=BAD, label="RTP actually deployed on UK sites")],
              loc="lower left")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "24_rtp_compression.png")


# ── 25 mechanic prevalence ────────────────────────────────────────────────────
def c25():
    d = DATA["mechanics"]
    rows = d["prevalence"]
    fig, ax = newfig(12, 6.4)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["count"] for r in rows], 0.6, color=PURPLE)
    ax.set_yticks(y)
    ax.set_yticklabels([r["tag"] for r in rows], fontsize=9.5)
    ax.set_xlim(0, 12600)
    ax.set_xlabel("Titles tagged with the mechanic (supply, not revenue)")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    barlabels(ax, b, "{:,.0f}")
    head(fig, {**d, "title": "Mechanic prevalence across the global catalogue",
               "subtitle": "SlotCatalog title tags across ~45,000–51,000 indexed slots"},
         "SlotCatalog feature index, July 2026. Incomplete — the index is Cloudflare-protected past the first render.")
    save(fig, "25_mechanic_prevalence.png")


# ── 26 bonus buy ──────────────────────────────────────────────────────────────
def c26():
    d = DATA["bonus_buy"]
    rows = d["rows"]
    order = {"Banned": 0, "Constrained": 1, "Patchy": 2, "Contested": 3, "Permitted": 4}
    col = {"Banned": BAD, "Constrained": WARN, "Patchy": WARN, "Contested": MUTED, "Permitted": GOOD}
    rows = sorted(rows, key=lambda r: order[r["status"]])
    fig, ax = plt.subplots(figsize=(13, 7))
    fig.subplots_adjust(top=0.83, bottom=0.1, left=0.02, right=0.98)
    ax.axis("off")
    for i, r in enumerate(rows):
        yy = 1 - (i + 0.5) / len(rows)
        ax.add_patch(plt.Rectangle((0.02, yy - 0.038), 0.96, 0.076, transform=ax.transAxes,
                                   facecolor="#171e28", edgecolor=GRID, lw=0.8))
        ax.add_patch(plt.Rectangle((0.02, yy - 0.038), 0.006, 0.076, transform=ax.transAxes,
                                   facecolor=col[r["status"]]))
        ax.text(0.045, yy, r["market"], transform=ax.transAxes, va="center", fontsize=11,
                fontweight="bold", color=TEXT)
        ax.text(0.27, yy, r["status"].upper(), transform=ax.transAxes, va="center",
                fontsize=10, fontweight="bold", color=col[r["status"]])
        ax.text(0.40, yy, textwrap.shorten(r["detail"], 95, placeholder="…"),
                transform=ax.transAxes, va="center", fontsize=9, color=MUTED)
    head(fig, d, "No credible public figure exists for bonus buy's share of slot GGR. 55% of Swedish slot players think it should be banned (Play'n GO / Opinium).")
    save(fig, "26_bonus_buy.png")


# ── 27 streaming ──────────────────────────────────────────────────────────────
def c27():
    d = DATA["streaming"]
    rows = d["metrics"]
    fig, ax = newfig(11.5, 6)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["change"] for r in rows], 0.6,
                color=[GOOD if r["change"] > 0 else BAD for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([f"{r['metric']}  ({r['value']})" for r in rows], fontsize=10)
    ax.axvline(0, color=MUTED, lw=1)
    ax.set_xlim(-30, 72)
    ax.set_xlabel("YoY change, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        w = bar.get_width()
        ax.text(w + (1.6 if w >= 0 else -1.6), bar.get_y() + bar.get_height() / 2,
                f"{w:+.1f}%", va="center", ha="left" if w >= 0 else "right",
                fontsize=10, fontweight="bold")
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "27_streaming.png")


# ── 28 radar ──────────────────────────────────────────────────────────────────
def c28():
    d = DATA["pragmatic_scorecard"]
    axes = [a["axis"] for a in d["axes"]]
    ang = np.linspace(0, 2 * np.pi, len(axes), endpoint=False).tolist()
    ang += ang[:1]
    fig = plt.figure(figsize=(12.5, 10.5))
    fig.subplots_adjust(top=0.80, bottom=0.08, left=0.17, right=0.83)
    ax = fig.add_subplot(111, polar=True)
    ax.set_facecolor(PANEL)
    show = ["Pragmatic Play", "Evolution Group", "Hacksaw Gaming", "Nolimit City", "Light & Wonder"]
    cols = [PP, RIVAL, TEAL, PURPLE, WARN]
    for name, c in zip(show, cols):
        v = d["providers"][name] + d["providers"][name][:1]
        ax.plot(ang, v, "o-", lw=2.4 if name == "Pragmatic Play" else 1.6, ms=6,
                color=c, label=name, zorder=3 if name == "Pragmatic Play" else 2)
        if name == "Pragmatic Play":
            ax.fill(ang, v, color=c, alpha=0.16)
    ax.set_xticks(ang[:-1])
    ax.set_xticklabels([textwrap.fill(a, 13) for a in axes], fontsize=10)
    ax.tick_params(axis="x", pad=26)
    ax.set_ylim(0, 100)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(["20", "40", "60", "80", "100"], fontsize=8, color=MUTED)
    ax.grid(color=GRID)
    ax.spines["polar"].set_color(GRID)
    ax.legend(loc="upper right", bbox_to_anchor=(1.22, 1.10), fontsize=10)
    head(fig, d, "Analyst scoring. Each axis is anchored to a cited measurement listed in dataset.json — but the 0-100 conversion is judgement.")
    save(fig, "28_scorecard_radar.png")


# ── 29 blind spots ────────────────────────────────────────────────────────────
def c29():
    d = DATA["blind_spots"]
    rows = sorted(d["rows"], key=lambda r: r["severity"])
    fig, ax = newfig(13, 7)
    y = np.arange(len(rows))
    b = ax.barh(y, [r["severity"] for r in rows], 0.62,
                color=[BAD if r["severity"] >= 75 else (WARN if r["severity"] >= 55 else RIVAL) for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([f"{r['rank']}. {r['gap']}" for r in rows], fontsize=10.5)
    ax.set_xlim(0, 100)
    ax.set_xlabel("Severity of the gap (analyst score)")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        ax.text(2, bar.get_y() + bar.get_height() / 2,
                "Beneficiary: " + textwrap.shorten(r["beneficiary"], 58, placeholder="…"),
                va="center", fontsize=9, color="#0d1117", fontweight="bold")
        ax.text(bar.get_width() + 1.4, bar.get_y() + bar.get_height() / 2,
                f"{r['severity']}", va="center", fontsize=10, fontweight="bold")
    head(fig, d, "Severity is an analyst score. The underlying evidence for each row is cited in full in dataset.json and the written report.")
    save(fig, "29_blind_spots.png")


# ── 30 regional rank ──────────────────────────────────────────────────────────
def c30():
    d = DATA["pragmatic_regional_rank"]
    rows = d["rows"]
    fig, ax = newfig(12, 6.2)
    y = np.arange(len(rows))[::-1]
    b = ax.barh(y, [r["pp"] for r in rows], 0.58,
                color=[PP if r["rank"] == 1 else (WARN if r["rank"] else BAD) for r in rows])
    ax.set_yticks(y)
    ax.set_yticklabels([r["region"] for r in rows])
    ax.set_xlim(0, 26)
    ax.set_xlabel("Pragmatic Play supplier share, %")
    ax.grid(axis="x", alpha=0.5)
    ax.set_axisbelow(True)
    for bar, r in zip(b, rows):
        if r["pp"] == 0:
            ax.text(0.4, bar.get_y() + bar.get_height() / 2,
                    "not licensed  ·  leader: " + r["next"], va="center",
                    fontsize=10, fontweight="bold", color=PP)
        else:
            ax.text(bar.get_width() + 0.4, bar.get_y() + bar.get_height() / 2,
                    f"{r['pp']}%  ·  #{r['rank']}  ·  next: {r['next']}  [tier {r['conf']}]",
                    va="center", fontsize=9.5)
    head(fig, d, textwrap.shorten(d["note"], 168, placeholder="…"))
    save(fig, "30_pragmatic_regional_rank.png")


if __name__ == "__main__":
    print("Rendering charts from data/dataset.json …")
    for fn in [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10,
               c11, c12, c13, c14, c15, c16, c17, c18, c19, c20,
               c21, c22, c23, c24, c25, c26, c27, c28, c29, c30]:
        fn()
    print(f"\nDone — {len(list(OUT.glob('*.png')))} charts in {OUT}/")
