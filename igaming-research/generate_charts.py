#!/usr/bin/env python3
"""Generate iGaming & Pragmatic Play research visualizations."""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import pandas as pd
from pathlib import Path

OUT = Path(__file__).parent / "charts"
OUT.mkdir(exist_ok=True)

# Brand palette
PP_ORANGE = "#F97316"
PP_DARK = "#1E293B"
ACCENT_BLUE = "#3B82F6"
ACCENT_GREEN = "#10B981"
ACCENT_PURPLE = "#8B5CF6"
ACCENT_RED = "#EF4444"
ACCENT_YELLOW = "#F59E0B"
GRAY = "#94A3B8"
COLORS = [PP_ORANGE, ACCENT_BLUE, ACCENT_GREEN, ACCENT_PURPLE, ACCENT_RED, ACCENT_YELLOW, "#EC4899", "#06B6D4"]

plt.rcParams.update({
    "figure.facecolor": "#0F172A",
    "axes.facecolor": "#1E293B",
    "axes.edgecolor": "#334155",
    "axes.labelcolor": "#E2E8F0",
    "text.color": "#E2E8F0",
    "xtick.color": "#CBD5E1",
    "ytick.color": "#CBD5E1",
    "grid.color": "#334155",
    "font.family": "DejaVu Sans",
    "font.size": 11,
})


def save(fig, name):
    fig.savefig(OUT / name, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  ✓ {name}")


def chart_global_market_by_region():
    regions = ["Europe", "North America", "Asia-Pacific", "Latin America", "Middle East", "Africa"]
    ggr = [43.5, 29.0, 28.5, 11.0, 6.8, 2.2]
    growth = [7, 21, 9, 30, 5, 24]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    fig.suptitle("Global iGaming Market by Region (2026)", fontsize=16, fontweight="bold", y=1.02)

    wedges, texts, autotexts = ax1.pie(
        ggr, labels=regions, autopct="%1.1f%%", colors=COLORS,
        pctdistance=0.75, startangle=90, textprops={"fontsize": 9}
    )
    for t in autotexts:
        t.set_fontweight("bold")
    ax1.set_title("GGR Share ($121B Total)", fontsize=12, pad=10)

    bars = ax2.barh(regions, ggr, color=COLORS, height=0.6)
    for bar, g in zip(bars, growth):
        ax2.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                 f"${bar.get_width():.1f}B  (+{g}%)", va="center", fontsize=9, color="#E2E8F0")
    ax2.set_xlabel("Gross Gaming Revenue ($B)")
    ax2.set_title("Regional GGR & YoY Growth", fontsize=12, pad=10)
    ax2.set_xlim(0, 55)
    ax2.grid(axis="x", alpha=0.3)

    save(fig, "01_global_market_by_region.png")


def chart_vertical_breakdown():
    verticals = ["Online Casino", "Sportsbook", "Poker", "Bingo & Other"]
    ggr = [63.0, 42.5, 7.5, 8.0]
    growth = [11, 14, 4, 8]

    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(verticals))
    bars = ax.bar(x, ggr, color=[PP_ORANGE, ACCENT_BLUE, ACCENT_GREEN, ACCENT_PURPLE], width=0.55, edgecolor="white", linewidth=0.5)

    for bar, g, pct in zip(bars, growth, [52, 35, 6, 7]):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                f"${bar.get_height():.1f}B\n{pct}% share\n+{g}% YoY",
                ha="center", va="bottom", fontsize=10, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(verticals, fontsize=11)
    ax.set_ylabel("GGR ($ Billions)")
    ax.set_title("Global iGaming Vertical Breakdown (2026)", fontsize=14, fontweight="bold", pad=15)
    ax.set_ylim(0, 75)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "02_vertical_breakdown.png")


def chart_casino_subsegment():
    labels = ["RNG Slots", "Live Dealer", "Virtual Tables"]
    sizes = [61, 28, 11]
    growth = [11, 19, 8]

    fig, ax = plt.subplots(figsize=(9, 6))
    explode = (0.03, 0.08, 0)
    wedges, texts, autotexts = ax.pie(
        sizes, labels=labels, autopct=lambda p: f"{p:.0f}%\n(+{growth[int(p/40)]}%)",
        colors=[PP_ORANGE, ACCENT_BLUE, ACCENT_GREEN], explode=explode,
        startangle=140, textprops={"fontsize": 11}
    )
    ax.set_title("Online Casino Revenue Split ($63B)\nSlots Dominate, Live Dealer Fastest Growing",
                 fontsize=13, fontweight="bold", pad=15)
    save(fig, "03_casino_subsegment.png")


def chart_pragmatic_regional_share():
    markets = ["UK", "Germany", "France", "Mexico", "Brazil", "South Africa", "Nigeria", "Argentina"]
    pragmatic = [13.99, 14.40, 11.5, 14.0, 18.0, 19.6, 19.0, 16.0]
    competitor = ["Blueprint", "Hacksaw", "Play'n GO", "Playtech", "PG Soft", "BGaming", "Hacksaw", "Playtech"]
    comp_share = [7.0, 8.5, 10.5, 8.0, 9.0, 10.7, 10.0, 8.0]

    fig, ax = plt.subplots(figsize=(12, 7))
    y = np.arange(len(markets))
    h = 0.35
    ax.barh(y + h/2, pragmatic, h, label="Pragmatic Play", color=PP_ORANGE)
    ax.barh(y - h/2, comp_share, h, label="Top Competitor", color=ACCENT_BLUE, alpha=0.8)

    for i, (p, c, comp) in enumerate(zip(pragmatic, comp_share, competitor)):
        ax.text(p + 0.3, i + h/2, f"{p}%", va="center", fontsize=9, color=PP_ORANGE, fontweight="bold")
        ax.text(c + 0.3, i - h/2, f"{c}% ({comp})", va="center", fontsize=8, color=ACCENT_BLUE)

    ax.set_yticks(y)
    ax.set_yticklabels(markets)
    ax.set_xlabel("Lobby Content Share (%)")
    ax.set_title("Pragmatic Play Content Share vs Top Competitor by Market (2026)",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend(loc="lower right")
    ax.set_xlim(0, 25)
    ax.grid(axis="x", alpha=0.3)
    ax.invert_yaxis()
    save(fig, "04_pragmatic_regional_share.png")


def chart_pragmatic_weak_markets():
    """Markets where Pragmatic is NOT dominant."""
    markets = ["United States", "Australia", "Canada (Ontario)"]
    leaders = ["RTG", "3 Oaks Gaming", "IGT"]
    leader_share = [18.05, 12.5, 11.0]
    pragmatic_share = [5.5, 4.2, 6.8]

    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(markets))
    w = 0.35
    ax.bar(x - w/2, leader_share, w, label="Regional Leader", color=ACCENT_RED)
    ax.bar(x + w/2, pragmatic_share, w, label="Pragmatic Play", color=PP_ORANGE)

    for i, (l, p, lead) in enumerate(zip(leader_share, pragmatic_share, leaders)):
        ax.text(i - w/2, l + 0.3, f"{lead}\n{l}%", ha="center", fontsize=9)
        ax.text(i + w/2, p + 0.3, f"{p}%", ha="center", fontsize=9, color=PP_ORANGE)

    ax.set_xticks(x)
    ax.set_xticklabels(markets)
    ax.set_ylabel("Lobby Content Share (%)")
    ax.set_title("Pragmatic Play Blind Spots: Markets Where PP Is NOT #1",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 22)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "05_pragmatic_blind_spots_markets.png")


def chart_top_games_ranking():
    games = [
        "Gates of Olympus 1000", "Gates of Olympus", "Gates Super Scatter",
        "Sweet Bonanza 1000", "Big Bass Splash", "Sugar Rush 1000",
        "Sweet Bonanza", "Starlight Princess", "Book of Dead", "Aviator"
    ]
    providers = ["PP"] * 8 + ["PnG", "Spribe"]
    ranks = list(range(1, 11))

    fig, ax = plt.subplots(figsize=(11, 7))
    colors_map = {"PP": PP_ORANGE, "PnG": ACCENT_BLUE, "Spribe": ACCENT_GREEN}
    bar_colors = [colors_map[p] for p in providers]

    bars = ax.barh(range(len(games)), [11 - r for r in ranks], color=bar_colors, height=0.65)
    ax.set_yticks(range(len(games)))
    ax.set_yticklabels([f"#{r}  {g}" for r, g in zip(ranks, games)])
    ax.set_xlabel("Ranking Score (inverse rank)")
    ax.set_title("EGR Global Slots Tracker — Top 10 Games (Apr 2026)\nPragmatic Holds 8 of Top 10",
                 fontsize=13, fontweight="bold", pad=15)
    ax.invert_yaxis()

    legend_patches = [
        mpatches.Patch(color=PP_ORANGE, label="Pragmatic Play (8 titles)"),
        mpatches.Patch(color=ACCENT_BLUE, label="Play'n GO"),
        mpatches.Patch(color=ACCENT_GREEN, label="Spribe"),
    ]
    ax.legend(handles=legend_patches, loc="lower right")
    ax.set_xlim(0, 12)
    save(fig, "06_top_games_ranking.png")


def chart_provider_comparison():
    providers = ["Pragmatic\nPlay", "Evolution", "Play'n GO", "Hacksaw", "Nolimit\nCity", "NetEnt", "Playtech"]
    metrics = {
        "Slot Catalog": [95, 40, 80, 35, 25, 45, 85],
        "Max Win Ceiling": [55, 30, 65, 80, 100, 50, 25],
        "Live Casino": [70, 100, 10, 0, 5, 30, 75],
        "Promo Network": [100, 40, 20, 10, 15, 25, 60],
        "Streaming Appeal": [75, 60, 50, 95, 90, 40, 20],
        "Innovation": [45, 70, 65, 90, 95, 55, 40],
    }

    angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True))
    compare = ["Pragmatic\nPlay", "Hacksaw", "Nolimit\nCity", "Evolution"]
    compare_colors = [PP_ORANGE, ACCENT_PURPLE, ACCENT_RED, ACCENT_BLUE]

    for prov, color in zip(compare, compare_colors):
        idx = providers.index(prov)
        values = [metrics[m][idx] for m in metrics]
        values += values[:1]
        ax.plot(angles, values, "o-", linewidth=2, label=prov.replace("\n", " "), color=color)
        ax.fill(angles, values, alpha=0.1, color=color)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(list(metrics.keys()), fontsize=10)
    ax.set_ylim(0, 100)
    ax.set_title("Provider Competitive Radar: Pragmatic vs Key Rivals",
                 fontsize=14, fontweight="bold", pad=25, y=1.08)
    ax.legend(loc="upper right", bbox_to_anchor=(1.3, 1.1))
    save(fig, "07_provider_radar_comparison.png")


def chart_competitor_max_win():
    providers = ["Nolimit City", "Relax Gaming", "NetEnt", "Hacksaw", "Play'n GO", "Pragmatic Play", "Playtech"]
    max_win = [150000, 150000, 200000, 50000, 60000, 21175, 5000]
    avg_rtp = [96.0, 96.4, 96.7, 96.3, 96.0, 96.5, 95.5]

    fig, ax1 = plt.subplots(figsize=(12, 6))
    x = np.arange(len(providers))
    bars = ax1.bar(x, max_win, color=[ACCENT_RED if p == "Pragmatic Play" else ACCENT_BLUE for p in providers],
                   alpha=0.8, width=0.6)
    ax1.set_ylabel("Max Win Potential (x stake)", color=ACCENT_BLUE)
    ax1.set_xticks(x)
    ax1.set_xticklabels(providers, rotation=25, ha="right")
    ax1.set_yscale("log")
    ax1.set_title("Max Win Ceiling Comparison — Pragmatic's Volatility Gap",
                  fontsize=13, fontweight="bold", pad=15)

    ax2 = ax1.twinx()
    ax2.plot(x, avg_rtp, "o-", color=PP_ORANGE, linewidth=2.5, markersize=8, label="Avg RTP %")
    ax2.set_ylabel("Average RTP (%)", color=PP_ORANGE)
    ax2.set_ylim(94.5, 97.5)
    ax2.legend(loc="upper left")

    for bar, val in zip(bars, max_win):
        label = f"{val:,}x" if val < 100000 else f"{val//1000}Kx"
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.1, label,
                 ha="center", fontsize=8, rotation=0)

    ax1.grid(axis="y", alpha=0.3)
    save(fig, "08_competitor_max_win.png")


def chart_feature_trends():
    features = ["Tumble/Cascade", "Bonus Buy", "Megaways", "Cluster Pays",
                "Hold & Spin", "Multipliers", "Simple (0-1 bonus)"]
    adoption_2023 = [45, 30, 25, 20, 35, 50, 36]
    adoption_2026 = [72, 42, 31, 38, 48, 65, 64]
    pp_strength = [95, 85, 60, 80, 75, 90, 40]

    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(features))
    w = 0.25
    ax.bar(x - w, adoption_2023, w, label="Industry 2023", color=GRAY, alpha=0.7)
    ax.bar(x, adoption_2026, w, label="Industry 2026", color=ACCENT_BLUE)
    ax.bar(x + w, pp_strength, w, label="Pragmatic Strength", color=PP_ORANGE)

    ax.set_xticks(x)
    ax.set_xticklabels(features, rotation=30, ha="right")
    ax.set_ylabel("% of New Releases / Provider Strength")
    ax.set_title("Slot Feature Trends 2023→2026 & Pragmatic Play Positioning",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 105)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "09_feature_trends.png")


def chart_live_casino_share():
    providers = ["Evolution", "Pragmatic Play", "Playtech", " ICONIC21", "Others"]
    share_2023 = [55, 15, 18, 3, 9]
    share_2026 = [45, 25, 15, 5, 10]

    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(providers))
    w = 0.35
    ax.bar(x - w/2, share_2023, w, label="2023", color=GRAY, alpha=0.7)
    ax.bar(x + w/2, share_2026, w, label="2026", color=ACCENT_BLUE)

    for i, (s23, s26) in enumerate(zip(share_2023, share_2026)):
        delta = s26 - s23
        sign = "+" if delta > 0 else ""
        ax.text(i, max(s23, s26) + 1, f"{sign}{delta}pp", ha="center", fontsize=9,
                color=ACCENT_GREEN if delta > 0 else ACCENT_RED)

    ax.set_xticks(x)
    ax.set_xticklabels(providers)
    ax.set_ylabel("B2B Live Casino Market Share (%)")
    ax.set_title("Live Casino Market Share — PP Growing but Evolution Still Dominant",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 55)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "10_live_casino_share.png")


def chart_growth_markets():
    markets = ["Brazil", "Germany", "Ontario", "Colombia", "Nigeria", "Ohio (US)", "Kenya"]
    ggr_2026 = [4.5, 3.8, 1.1, 0.9, 0.7, 0.6, 0.5]
    growth = [215, 36, 38, 50, 40, 100, 25]
    pp_dominance = [85, 90, 45, 80, 88, 30, 82]

    fig, ax = plt.subplots(figsize=(12, 6))
    scatter = ax.scatter(growth, ggr_2026, s=[d * 8 for d in pp_dominance],
                         c=pp_dominance, cmap="YlOrRd", alpha=0.85, edgecolors="white", linewidth=1.5)

    for i, m in enumerate(markets):
        ax.annotate(m, (growth[i], ggr_2026[i]), textcoords="offset points",
                    xytext=(8, 5), fontsize=9)

    cbar = plt.colorbar(scatter, ax=ax)
    cbar.set_label("Pragmatic Play Dominance (%)", color="#E2E8F0")
    cbar.ax.yaxis.set_tick_params(color="#E2E8F0")

    ax.set_xlabel("YoY Growth Rate (%)")
    ax.set_ylabel("Market GGR 2026 ($B)")
    ax.set_title("Fastest-Growing iGaming Markets\nBubble Size & Color = Pragmatic Play Strength",
                 fontsize=13, fontweight="bold", pad=15)
    ax.grid(alpha=0.3)
    save(fig, "11_growth_markets.png")


def chart_pragmatic_game_families():
    families = ["Gates of Olympus", "Sweet Bonanza", "Big Bass", "Sugar Rush",
                "Starlight Princess", "Dog House", "Wolf Gold", "Other (300+)"]
    est_share = [22, 18, 14, 10, 8, 6, 4, 18]

    fig, ax = plt.subplots(figsize=(10, 6))
    wedges, texts, autotexts = ax.pie(
        est_share, labels=families, autopct="%1.0f%%",
        colors=COLORS + [GRAY], startangle=45,
        textprops={"fontsize": 9}
    )
    ax.set_title("Estimated Pragmatic Play Spin Volume by Game Family (2026)",
                 fontsize=13, fontweight="bold", pad=15)
    save(fig, "12_pragmatic_game_families.png")


def chart_regulated_vs_grey():
    regions = ["Europe", "N. America", "Asia-Pac", "LatAm", "M.East", "Africa"]
    regulated = [82, 95, 41, 55, 15, 30]
    grey = [18, 5, 59, 45, 85, 70]

    fig, ax = plt.subplots(figsize=(11, 6))
    x = np.arange(len(regions))
    ax.bar(x, regulated, label="Regulated", color=ACCENT_GREEN, width=0.6)
    ax.bar(x, grey, bottom=regulated, label="Grey/Unlicensed", color=ACCENT_RED, alpha=0.7, width=0.6)

    for i, (r, g) in enumerate(zip(regulated, grey)):
        ax.text(i, r/2, f"{r}%", ha="center", va="center", fontweight="bold", fontsize=10)
        if g > 15:
            ax.text(i, r + g/2, f"{g}%", ha="center", va="center", fontsize=9)

    ax.set_xticks(x)
    ax.set_xticklabels(regions)
    ax.set_ylabel("Share of Regional GGR (%)")
    ax.set_title("Regulated vs Grey Market Split by Region (2026)\nPP Strongest in Regulated Markets",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend(loc="upper right")
    ax.set_ylim(0, 105)
    save(fig, "13_regulated_vs_grey.png")


def chart_market_growth_timeline():
    years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
    global_ggr = [61, 72, 80, 89, 98, 108, 121]
    regulated_pct = [59, 61, 63, 64, 66, 67, 68]

    fig, ax1 = plt.subplots(figsize=(11, 6))
    ax1.fill_between(years, global_ggr, alpha=0.3, color=PP_ORANGE)
    ax1.plot(years, global_ggr, "o-", color=PP_ORANGE, linewidth=2.5, markersize=8, label="Global GGR ($B)")
    ax1.set_xlabel("Year")
    ax1.set_ylabel("Global Online GGR ($ Billions)", color=PP_ORANGE)
    ax1.tick_params(axis="y", labelcolor=PP_ORANGE)

    for y, g in zip(years, global_ggr):
        ax1.annotate(f"${g}B", (y, g), textcoords="offset points", xytext=(0, 10),
                     ha="center", fontsize=9, color=PP_ORANGE)

    ax2 = ax1.twinx()
    ax2.plot(years, regulated_pct, "s--", color=ACCENT_GREEN, linewidth=2, markersize=7, label="Regulated %")
    ax2.set_ylabel("Regulated Market Share (%)", color=ACCENT_GREEN)
    ax2.tick_params(axis="y", labelcolor=ACCENT_GREEN)
    ax2.set_ylim(55, 75)

    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc="upper left")

    ax1.set_title("Global iGaming Growth Trajectory 2020–2026", fontsize=14, fontweight="bold", pad=15)
    ax1.grid(alpha=0.3)
    save(fig, "14_market_growth_timeline.png")


def chart_blind_spots_summary():
    categories = ["Extreme\nVolatility", "Narrative\nDepth", "US Market", "Live Casino\nLeadership",
                  "Mechanical\nInnovation", "Catalog\nQuality", "Bonus Buy\nFlexibility"]
    pragmatic = [35, 45, 30, 35, 40, 55, 60]
    best_competitor = [95, 85, 90, 100, 92, 80, 90]
    comp_names = ["Nolimit City", "Play'n GO", "RTG/IGT", "Evolution", "Hacksaw", "Hacksaw", "Hacksaw/NLC"]

    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(categories))
    w = 0.35
    ax.bar(x - w/2, pragmatic, w, label="Pragmatic Play", color=PP_ORANGE)
    ax.bar(x + w/2, best_competitor, w, label="Best Competitor", color=ACCENT_BLUE, alpha=0.8)

    for i, name in enumerate(comp_names):
        ax.text(i + w/2, best_competitor[i] + 2, name, ha="center", fontsize=7, color=ACCENT_BLUE, rotation=15)

    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.set_ylabel("Competitive Score (0-100)")
    ax.set_title("Pragmatic Play Blind Spots — Where Competitors Outperform",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 115)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "15_blind_spots_summary.png")


def chart_top_operators_pragmatic():
    """Top operators carrying Pragmatic Play content by estimated GGR."""
    operators = [
        "Flutter Ent.", "Bet365", "Entain", "DraftKings",
        "BetMGM", "Caesars", "Kindred", "888/Evoke", "Betsson", "Rush Street"
    ]
    ggr = [12.8, 7.2, 6.4, 4.9, 4.3, 3.8, 2.6, 2.2, 1.4, 1.1]
    pp_depth = [100, 95, 98, 75, 90, 80, 92, 88, 90, 70]  # integration depth score

    fig, ax = plt.subplots(figsize=(12, 7))
    y = np.arange(len(operators))
    bars = ax.barh(y, ggr, color=PP_ORANGE, height=0.55, alpha=0.85)

    for i, (bar, depth, g) in enumerate(zip(bars, pp_depth, ggr)):
        depth_label = "Exclusive Live" if depth == 100 else ("Deep" if depth >= 90 else "Standard")
        ax.text(bar.get_width() + 0.15, bar.get_y() + bar.get_height()/2,
                f"${g}B  |  PP: {depth_label}", va="center", fontsize=9, color="#E2E8F0")

    ax.set_yticks(y)
    ax.set_yticklabels(operators)
    ax.set_xlabel("Estimated GGR 2025 ($ Billions)")
    ax.set_title("Top 10 Operators Carrying Pragmatic Play Content\nGGR + Integration Depth",
                 fontsize=13, fontweight="bold", pad=15)
    ax.set_xlim(0, 16)
    ax.grid(axis="x", alpha=0.3)
    ax.invert_yaxis()
    save(fig, "16_top_operators_pragmatic.png")


def chart_aggregator_landscape():
    """Compare major iGaming aggregators."""
    aggregators = ["EveryMatrix\nSlotMatrix", "SOFTSWISS", "Slotegrator\nAPIgrator",
                   "Hub88", "SoftGamings", "Relax Gaming", "Pariplay\nFusion"]
    games = [45000, 35000, 30000, 12000, 10000, 8000, 6000]
    providers = [355, 300, 180, 120, 250, 80, 60]
    has_pp = [1, 1, 1, 1, 1, 1, 1]

    fig, ax = plt.subplots(figsize=(12, 7))
    x = np.arange(len(aggregators))
    w = 0.35
    ax2 = ax.twinx()

    bars1 = ax.bar(x - w/2, [g/1000 for g in games], w, label="Games (thousands)", color=ACCENT_BLUE, alpha=0.85)
    bars2 = ax2.bar(x + w/2, providers, w, label="Providers", color=ACCENT_GREEN, alpha=0.85)

    for i, (g, p) in enumerate(zip(games, providers)):
        ax.text(i - w/2, g/1000 + 0.5, f"{g:,}", ha="center", fontsize=8, color=ACCENT_BLUE)
        ax2.text(i + w/2, p + 5, f"{p}+", ha="center", fontsize=8, color=ACCENT_GREEN)
        ax.text(i, -2.5, "✓ PP", ha="center", fontsize=9, color=PP_ORANGE, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(aggregators, fontsize=9)
    ax.set_ylabel("Game Titles (thousands)", color=ACCENT_BLUE)
    ax2.set_ylabel("Studio Partners", color=ACCENT_GREEN)
    ax.set_title("iGaming Aggregator Landscape 2026 — All Distribute Pragmatic Play",
                 fontsize=13, fontweight="bold", pad=15)
    ax.set_ylim(0, 55)
    ax2.set_ylim(0, 420)

    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc="upper right")
    ax.grid(axis="y", alpha=0.3)
    save(fig, "17_aggregator_landscape.png")


def chart_platform_providers():
    """B2B platform providers that integrate Pragmatic Play."""
    platforms = ["Playtech", "EveryMatrix", "SOFTSWISS", "OpenBet",
                 "BetConstruct", "SoftGamings", "Pragmatic\nSolutions", "IGT"]
    market_share = [28, 18, 15, 12, 10, 8, 5, 4]
    pp_integration = [100, 100, 100, 85, 95, 100, 100, 70]

    fig, ax = plt.subplots(figsize=(11, 6))
    x = np.arange(len(platforms))
    scatter = ax.scatter(market_share, pp_integration, s=[m*25 for m in market_share],
                         c=pp_integration, cmap="YlOrRd", alpha=0.85,
                         edgecolors="white", linewidth=1.5, vmin=60, vmax=100)

    for i, p in enumerate(platforms):
        ax.annotate(p.replace("\n", " "), (market_share[i], pp_integration[i]),
                    textcoords="offset points", xytext=(8, 5), fontsize=9)

    ax.set_xlabel("Estimated B2B Platform Market Share (%)")
    ax.set_ylabel("Pragmatic Play Integration Depth (%)")
    ax.set_title("B2B Platform Providers & Pragmatic Play Integration\nBubble Size = Platform Market Share",
                 fontsize=13, fontweight="bold", pad=15)
    ax.set_xlim(0, 35)
    ax.set_ylim(60, 105)
    ax.grid(alpha=0.3)
    save(fig, "18_platform_providers.png")


def chart_distribution_flow():
    """Distribution ecosystem: Studio -> Aggregator/Platform -> Operator."""
    categories = ["Direct API\n(300+ ops)", "Via Aggregators\n(500+ ops)", "Via Platforms\n(200+ ops)",
                  "White Label\n(150+ ops)", "Retail/Omni\n(50+ ops)"]
    operator_reach = [300, 500, 200, 150, 50]
    pp_penetration = [100, 98, 95, 90, 85]

    fig, ax = plt.subplots(figsize=(11, 6))
    x = np.arange(len(categories))
    w = 0.35
    ax.bar(x - w/2, operator_reach, w, label="Operator Reach", color=ACCENT_BLUE, alpha=0.85)
    ax.bar(x + w/2, pp_penetration, w, label="PP Content Available (%)", color=PP_ORANGE, alpha=0.85)

    for i, (reach, pen) in enumerate(zip(operator_reach, pp_penetration)):
        ax.text(i - w/2, reach + 8, f"{reach}+", ha="center", fontsize=9, color=ACCENT_BLUE)
        ax.text(i + w/2, pen + 2, f"{pen}%", ha="center", fontsize=9, color=PP_ORANGE)

    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.set_ylabel("Count / Penetration %")
    ax.set_title("Pragmatic Play Distribution Channels to Market",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 580)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "19_distribution_channels.png")


def chart_operator_brands_map():
    """Major operator brand portfolios with PP presence."""
    groups = ["Flutter", "Entain", "Bet365", "888/Evoke", "Kindred", "Betsson", "MGM/Caesars"]
    brand_count = [12, 10, 1, 6, 8, 12, 4]
    pp_products = [4, 4, 3, 3, 3, 3, 2]  # slots, live, bingo, virtual sports

    fig, ax = plt.subplots(figsize=(11, 6))
    x = np.arange(len(groups))
    ax.bar(x, brand_count, color=ACCENT_BLUE, alpha=0.6, label="Brands in Group", width=0.5)
    ax.bar(x, pp_products, color=PP_ORANGE, alpha=0.9, label="PP Verticals Supplied", width=0.3)

    brands_detail = [
        "FanDuel, Paddy Power,\nBetfair, Sky Vegas...",
        "Ladbrokes, Coral,\nbwin, BetMGM JV...",
        "bet365 Casino",
        "William Hill,\n888 Casino, Mr Green",
        "Unibet, 32Red,\nMaria Casino",
        "Betsson, Betsafe,\nNordicBet",
        "BetMGM, Caesars\nPalace Online"
    ]
    for i, detail in enumerate(brands_detail):
        ax.text(i, brand_count[i] + 0.3, detail, ha="center", fontsize=7, color="#CBD5E1")

    ax.set_xticks(x)
    ax.set_xticklabels(groups, rotation=15, ha="right")
    ax.set_ylabel("Count")
    ax.set_title("Operator Groups × Pragmatic Play — Brand Portfolios & Vertical Coverage",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend()
    ax.set_ylim(0, 16)
    ax.grid(axis="y", alpha=0.3)
    save(fig, "20_operator_brand_map.png")


if __name__ == "__main__":
    print("Generating iGaming research charts...")
    chart_global_market_by_region()
    chart_vertical_breakdown()
    chart_casino_subsegment()
    chart_pragmatic_regional_share()
    chart_pragmatic_weak_markets()
    chart_top_games_ranking()
    chart_provider_comparison()
    chart_competitor_max_win()
    chart_feature_trends()
    chart_live_casino_share()
    chart_growth_markets()
    chart_pragmatic_game_families()
    chart_regulated_vs_grey()
    chart_market_growth_timeline()
    chart_blind_spots_summary()
    chart_top_operators_pragmatic()
    chart_aggregator_landscape()
    chart_platform_providers()
    chart_distribution_flow()
    chart_operator_brands_map()
    print(f"\nAll charts saved to {OUT}/")
