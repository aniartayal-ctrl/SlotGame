# Slot Game Mechanics, Features and Player Preferences — Market Research Report

**Research date:** July 2026 · **Data window prioritised:** January 2025 – July 2026

---

## 0. How to read this report (source-confidence key)

The iGaming affiliate web is heavily polluted with AI-generated content that invents precise-looking statistics. Every figure below carries a confidence tag. **Do not plot [D] figures without a caveat.**

| Tag | Meaning | Examples of sources in this tier |
|---|---|---|
| **[A]** | **Hard / verified.** Statutory regulator statistics or audited/filed company financials. | UK Gambling Commission, Spillemyndigheden (DK), Spelinspektionen (SE), iGaming Ontario, AGA, Evolution AB annual report, Hacksaw AB year-end report |
| **[B]** | **Named commercial dataset, or an operator publishing its own internal data.** Real methodology, but proprietary, unaudited and often partly paywalled. | Eilers & Krejcik (OGPD/Eilers-Fantini), Blask, eGaming Monitor / EGR Slots Tracker, **bet365 Gaming Insights and Performance**, **iGamingCompass lobby scans**, SlotCatalog SlotRank, SullyGnome, Streamlabs × Stream Hatchet, SOFTSWISS network data |
| **[C]** | **Company-reported / trade press single source.** Directionally useful, not independently verified. | Spribe's Aviator metrics, supplier promo case studies, iGB interviews |
| **[D]** | **Unverified / low confidence.** Affiliate or SEO content with no stated methodology, or sources that conflict with each other. Flagged explicitly. | Most "X% of slots use mechanic Y" claims |

**Three claims in the original brief did not survive verification** and are corrected in §3: Slovakia and Italy do **not** appear to have bonus-buy bans, and Sweden's status is genuinely contested.

---

## 1. Executive summary — the twelve numbers that matter

| # | Finding | Figure | Tag |
|---|---|---|---|
| 1 | UK online slots GGY, quarter to Dec 2025 | **£788m**, +10% YoY, on **25.7bn spins** | [A] |
| 2 | UK average slots session length | **15 min** (Q1 2026), down from 18 min (Dec 2024) | [A] |
| 3 | Denmark: online slots as share of online casino GGR | **82%** (DKK 3.54bn of DKK 4.31bn) | [A] |
| 4 | Best single verified game-level GGR share | Gates of Olympus 1000 = **1.35% of all European slot GGR** (1Q25) | [B] |
| 5 | **There is no global #1 slot** | bet365's own rankings show a **different #1 in all 10 published markets** (Jun 2026) | [B] |
| 6 | Widest-distributed title on earth | Gates of Olympus 1000, carried by **606 operator brands** (Blask) | [B] |
| 7 | UK Remote Gaming Duty rise driving RTP cuts | **21% → 40%** from 1 Apr 2026; deployed RTP moving 96% → 94%, with 92% requested | [A] tax / [B] RTP |
| 8 | Verified sub-96% UK deployments | Book of Dead **94.25%**, several Big Bass titles at **92.0–92.1%** | [B] |
| 9 | Hacksaw Gaming FY2025 revenue | **€197.5m, +44%**; avg daily rounds **+58%**; 82% adj. EBIT margin | [A] |
| 10 | Twitch "Slots" category, trailing 365 days | **121.5m hours watched, +39.5% YoY** on 11.5% *fewer* streamed hours | [B] |
| 11 | Aviator claimed scale | **77m+ MAU**, ~90% of crash market — company-reported, unaudited | [C] |
| 12 | Max-win ceiling plateau | Industry flagship ceiling settled at **~50,000x**; absolute record 500,000x (Tombstone Slaughter) | [B]/[C] |

**The through-line:** the industry is monetising *harder per spin* rather than *more spins per player*. UK spin volume is at record highs while session length, spins per session and GGY per session all fall — and operators are compensating by cutting RTP. Simultaneously, product innovation has shifted away from adding new payline geometries (Megaways is mature) toward two things: **collect/persistence mechanics** (Hold & Win, CollectR, money-symbol collection), which now dominate top-performer lists in every market where we have attribute-level data, and **crash/instant hybrids**, which capture the mobile-first, short-session, sub-35 audience that slots convert poorly.

**The single most useful corrective for a report like this** is finding 5. The affiliate web, and most industry commentary, treats "top slots" as a global league table headed by Gates of Olympus and Sweet Bonanza. The 2026 operator and full-lobby datasets say otherwise: the #1 game is *Gold Cash Freespins* in the UK, *Legacy of Dead* in Germany, *Cash Eruption* in the US, *Area Link Phoenix Firestorm* in Canada and *Gates of Olympus* only in Brazil. Pragmatic Play, the dominant global supplier by every distribution measure, **does not place a single title in the US top-100 supplier table**. Mechanic and title preference is strongly path-dependent on each market's land-based heritage — which is why six of Germany's top 19 are Egyptian "book" slots and why hold-and-collect "Link" titles own North America. Do not publish a single global ranking without stating both the market and the metric.

---

## 2. Mechanics: prevalence and performance

### 2.1 What the attribute-level performance data actually says

The single most credible attribute study is **Eilers & Krejcik's Eilers-Fantini OGPD Data Insights Q4-2025**, which analysed 80+ game attributes against top-performing new US online slot releases. Its published abstract states:

> "Performance remains strongly tied to mechanics such as **Cash on Reels, Free Games, $ Jackpots, Hold & Spin, Multipliers, and Perceived Persistence**, which dominate the Top 10 and Top 25 rankings. Top games are increasingly defined by **layered bonus complexity**, with **Multi-Trigger Jackpots, Multi-Trigger Features and Multi-Feature** among the fastest-rising attributes year-over-year. Newer mechanics such as **Nested Hold & Spin, Nested Wheels, and Prize Areas** are gaining traction along with **Spinoff** games… the market continues to be anchored by **5×3 reel matrix** video slots." **[B]**
> — Eilers & Krejcik Gaming, https://ekgamingllc.com/downloads/eilers-fantini-ogpd-data-insights-q4-2025-new-u-s-online-slots-attributes/

Three things to take from this and plot as a qualitative ranking:

1. **Hold & Spin / Cash on Reels is the dominant performing mechanic in the US**, not Megaways, not cluster pays.
2. **"Perceived persistence"** — the feeling that progress carries between spins — is an explicitly identified performance driver. This is the design principle behind sticky wilds, collection meters, upgrade ladders and CollectR.
3. **The frontier is layering, not invention.** "Nested Hold & Spin" (a hold-and-spin inside a hold-and-spin) is the fastest-growing attribute class.

Corroborating this from the land-based side: Aristocrat's **Lightning Link** — the franchise that invented the term "Hold & Spin" in 2014–15 — has been ranked the **#1 premium leased game in North America** in the Eilers-Fantini Quarterly Slot Survey **[B]**, and Aristocrat brought it to online RMG across all regulated US states plus Ontario and Alberta on **23 July 2026** with *Lightning Link High Stakes* **[A]** (https://www.prnewswire.com/news-releases/one-of-the-worlds-most-popular-slot-brands-lightning-link-by-aristocrat-makes-online-premiere-on-platforms-across-north-america-302833506.html).

The commercial value of hold-and-spin math is also legally quantified: **Light & Wonder agreed on 11 January 2026 to pay Aristocrat US$127.5m** to settle trade-secret litigation over hold-and-spin math models used in *Dragon Train* and *Jewel of the Dragon*, permanently ceasing commercialisation of those games globally **[A]** (https://explore.lnw.com/newsroom/joint-statement-regarding-resolution-of-litigation-between-aristocrat-and-light-wonder/ ; https://www.casino.org/news/light-wonder-to-pay-aristocrat-127-5m-to-end-trade-secrets-dispute/). That is a hard, court-tested price tag on one mechanic's math.

### 2.2 Mechanic prevalence — catalogue counts

These are counts of titles tagged with each mechanic in **SlotCatalog's database** (~45,000–51,000+ titles from 1,000–1,199 providers). They measure *supply*, not revenue. SlotCatalog's public feature index renders only part of the alphabet, so this list is **incomplete** — I could not retrieve counts for Hold & Win, Megaways, Infinity Reels or several others because the page is Cloudflare-protected beyond the first render.

| Mechanic / feature tag | Titles tagged | Tag |
|---|---|---|
| Additional Free Spins | 10,838 | [B] |
| Feature: Substitution Symbols | 3,813 | [B] |
| Bonus Game: Pick Objects | 2,968 | [B] |
| Cluster Pays | 1,302 | [B] |
| Crash (Burst / Bustabit-like) | 843 | [B] |
| Feature: Random reward | 810 | [B] |
| "Book of…" mechanic | 741 | [B] |
| Expanding wild with re-spin | 555 | [B] |
| Big Bass Bonanza / Fishin' Frenzy mechanic | 181 | [B] |
| 9 Pots (9 Masks) of Gold mechanic | 142 | [B] |
| Expanding wild, additional prepaid wilds | 43 | [B] |
| Bonus game: take or refuse | 47 | [B] |
| Connect to Win | 12 | [B] |

Source: https://slotcatalog.com/en/slot-features (retrieved July 2026)

SlotCatalog separately states that **Free Spins Multiplier appears in "nearly 6,000 slots or about half of all online slots"** **[B]**, same source.

### 2.3 Megaways: mature, licensed everywhere, no longer growing

| Metric | Value | Tag |
|---|---|---|
| Megaways share of all classified casino *titles* | ~2% | [C] |
| Megaways share of casino *lobby sections* | ~3% | [C] |
| Studios licensing Megaways from Big Time Gaming | 100+ | [C] |
| Max ways to win (standard 6-reel configuration) | 117,649 | [A] |
| Year of most Megaways releases | 2023 | [C] |
| BTG's own active UKGC-distributed catalogue | ~60 titles | [D] |
| BTG new-title release cadence | ~5–8 per year | [D] |
| Current market-wide new Megaways releases | "lucky to see two new releases per month" | [D] |

Sources: https://igamingcompass.com/blogs/why-megaways-slots-dominate-casinos/ ; https://www.slotshawk.com/guides/why-megaways-remain-king/ ; https://slottyhouse.co.uk/big-time-gaming/

**Interpretation:** Megaways is now infrastructure rather than a differentiator. The ~2% title share is small precisely *because* the licensing model spread the mechanic to specialist and volume studios alike rather than concentrating it. Note the widely-circulated affiliate claim that "Megaways titles account for over 30% of total slot activity in Malta, Sweden and the UK" is **[D] — I could not verify it against any operator or regulator source and it is inconsistent with the 2–3% supply share.** Do not use it.

BTG's response has been to build successors rather than more Megaways: **MegaClusters** and **MegaPays**, plus *White Rabbit 2* (late 2025), which embeds hold-and-spin directly inside a 12-symbol expanding grid **[C]** (https://firstlookgames.com/mechanic/megaways/ ; https://unfgaming.net/the-hold-and-spin-phenomenon-why-collection-mechanics-dominate-every-new-release/).

### 2.4 Studio-signature mechanics reference table

| Mechanic | Owner / originator | What it does | Flagship titles | Tag |
|---|---|---|---|---|
| Megaways | Big Time Gaming (Evolution, acq. 2021) | Variable reel heights, up to 117,649 ways | Bonanza, Dragon Born (first, 2016), Extra Chilli | [A] |
| Hold & Spin / Hold & Win | Aristocrat (*Lightning Link*, 2014–15) | Trigger symbols lock, respin counter resets on each new symbol | Lightning Link, Dragon Link, Cash Express, Big Bass series, Money Train | [A] |
| Money Cart / persistent respin | Relax Gaming (*Money Train*, 2019) | First major web-native hold-and-win | Money Train 1–4 | [B] |
| xWays | Nolimit City (Evolution, acq. 2022 ~$340m) | Symbol reveals 2–6 pay values, expanding ways | San Quentin xWays, Mental | [B] |
| xNudge | Nolimit City | Wild nudges to fill reel, +1x multiplier per nudge position | Deadwood, Bushido Ways xNudge | [B] |
| xBomb | Nolimit City | Wild detonates, clears symbols, adds to running multiplier | Fire in the Hole xBomb, Tombstone RIP | [B] |
| xSplit | Nolimit City | Splits symbol into two, increases multiplier | Mental, Punk Toilet | [B] |
| Infinity Reels | ReelPlay | Winning combination on the starting reels adds another reel to the right, indefinitely | Thor Infinity Reels, Odin Infinity Reels Megaways | [B] |
| CollectR | ELK Studios | Coloured birds collect adjacent matching gems on an expandable grid; payouts driven by collector behaviour, not paylines/ways | Pirots 1–5 | [B] |
| Cluster Pays | NetEnt origin, now generic | 5+ adjacent matching symbols anywhere, usually with cascades | Reactoonz 2, Sugar Rush | [B] |
| Scatter Pays / Pay Anywhere | Generic | Symbols pay regardless of position | Gates of Olympus, Sweet Bonanza, Money Train 4 | [A] |
| Reel Overlay (slot × crash) | Ready Play Gaming (2026) | Crash cash-out layer running on top of a live video slot | Blaz'n Buffalo Reel Crash | [C] |

**On Nolimit's max wins there is a genuine source conflict** — see §4.4. Treat any single affiliate figure with suspicion.

### 2.5 Claims about mechanic revenue share that I could NOT verify

Two figures circulate widely and both come from sources with no stated methodology. **I recommend excluding both, or presenting them explicitly as unsourced industry folklore:**

- "Hold & Win games account for **60–70% of total slot revenue** in regulated online markets while making up only ~45% of the game library" — **[D]**, https://gamerushhub.com/... No underlying dataset named. The direction is consistent with Eilers & Krejcik's attribute findings, but the magnitude is unsupported.
- "**Hold & Win features appear in 42% of new releases; Cluster Pays in 38% of modern slots; 15,000+ new slot titles released globally in 2025**" — **[D]**, https://comicplay.net/slots/slot-features/. Attributed to nothing. The 15,000 releases/year figure is also inconsistent with SlotCatalog's total database size of ~51,000 titles accumulated since the 1990s.

A more defensible mid-tier data point: **"35 of the top 100 grossing online slots globally featured coin-based mechanics in 2024"**, attributed to GameIntel **[C]** (https://www.linkedin.com/pulse/hold-win-how-coin-collecting-mechanics-became-slot-kalinichenko-0nxpe). Same source cites SOFTSWISS finding **22% longer session times** for coin-collecting games and Slotegrator finding an **18% lift in Day-14 retention** — both **[C]**, secondary citations I could not trace to the primary publications.

---

## 3. Volatility, max win and RTP

### 3.1 The RTP story is the biggest single commercial development of 2026

**Hard fact:** UK Remote Gaming Duty rose from **21% to 40% on 1 April 2026** **[A]** — the largest single tax change the UK online gambling market has absorbed.

The arithmetic driving the response, from RTPTrack **[B]**:

> "A tier change from a 96 per cent deployment to a 94 per cent deployment increases the operator's expected take per £100 wagered from **£4 to £6 — a 50 per cent increase in gross margin per spin**."
> — https://rtptrack.com/blog/why-uk-casinos-lowering-rtp-2026

What operators are actually doing, per iGaming Business **[B/C]**:

> Helen Walton, co-founder of G Games: *"RTP is absolutely a pricing lever. Operators are already pulling it."* In the UK, standard RTPs have already shifted from **around 96% to 94%, with 92% now the requested maximum at some operators.**
> — https://igamingbusiness.com/casino-games/slots/cutting-rtp-uk-margin-fix-market-misstep/

**Verified evidence of the shift in deployed RTP.** These are RTPs actually configured on UK-facing casinos, from SlotCatalog's UK page and a UK affiliate's deployment tracker. This is the most chart-ready RTP dataset in this report:

| Title | Provider | Provider max RTP | Deployed UK RTP | Gap (pp) | Tag |
|---|---|---|---|---|---|
| Book of Dead | Play'n GO | 96.21% | **94.25%** | −1.96 | [B] |
| Fire and Roses Joker | Triple Edge Studios | ~96% | **94.01%** | ~−2.0 | [B] |
| Big Bass Splash | Reel Kingdom / Pragmatic | 96.71% | **95.67%** | −1.04 | [B] |
| Big Bass Bonanza | Reel Kingdom / Pragmatic | 96.71% | **95.67%** | −1.04 | [B] |
| Shaman's Dream | Eyecon | ~96% | **95.44%** | ~−0.6 | [B] |
| Big Bass Bonanza 1000 | Reel Kingdom / Pragmatic | 96.51% | **94.51%** | −2.00 | [B] |
| Bigger Bass Splash | Reel Kingdom / Pragmatic | 96.50% | **94.50%** | −2.00 | [B] |
| Big Bass Return to the Races | Reel Kingdom / Pragmatic | 96.07% | **94.07%** | −2.00 | [B] |
| Big Bass Reel Repeat | Reel Kingdom / Pragmatic | 96.51% | **92.01%** | **−4.50** | [B] |
| Big Bass Christmas Frozen Lake | Reel Kingdom / Pragmatic | 96.07% | **92.07%** | **−4.00** | [B] |
| Big Bass Splash 1000 | Reel Kingdom / Pragmatic | 96.52% | **92.02%** | **−4.50** | [B] |
| Big Bass Master Classic | Reel Kingdom / Pragmatic | 92% | **92%** | 0 (shipped low) | [B] |
| Big Bass It's a Whopper | Reel Kingdom / Pragmatic | 92% | **92%** | 0 (shipped low) | [B] |
| Big Bass Surf's Up | Reel Kingdom / Pragmatic | 92% | **92%** | 0 (shipped low) | [B] |
| Money Train 4 | Relax Gaming | 96.40% | 96.10% | −0.30 | [B] |

Sources: https://slotcatalog.com/en-gb/best-online-slots ; https://www.bestnewbingosites.co.uk/slot-articles/big-bass-world-domination/ ; https://rtptrack.com/slots/money-train-4

Note the November 2025 Big Bass releases (*Master Classic*, *It's a Whopper*, *Surf's Up*) that ship at **92% as their only configuration** — the tier cut is now moving upstream into game design, not just operator configuration.

### 3.2 The counter-argument: where the RTP cliff edge sits

Two named-source data points give the shape of the demand curve. Both are **[B/C]**, from the same iGB piece:

**RubyPlay (Loz, product):**
> *"If you lower RTP from 96% to 94%, you don't see a huge difference. But **below 94%, there's a statistically significant drop. Around 90% and below, the drop becomes catastrophic.** Players just leave."* … *"At 88% RTP, we at RubyPlay simply don't make games for that market."*

**Regulus Partners on Germany as the cautionary case:**

| Germany metric | Value | Tag |
|---|---|---|
| Turnover tax on online slots | 5.3% of stakes | [A] |
| Resulting effective RTP | ~90% or lower (vs. natural ~95%) | [B] |
| Bankroll depletion rate, 95% vs 90% RTP | ~**50% higher loss rate** | [B] |
| Share of slot demand channelised by the licensed product | ~25% | [B] |
| Overall channelisation | **below 40%** | [B] |
| Licensed slot revenue trajectory | ~**€800m (2022) → ~€470m (H2 2025 run-rate)** | [B] |
| Estimated German underground slot market | ~**€2bn** | [B] |
| German licensed virtual slot wagers, 2025 | €4.6bn | [C] |

Sources: https://igamingbusiness.com/casino-games/slots/cutting-rtp-uk-margin-fix-market-misstep/ ; https://15m.com/news/uk-slot-returns-fall-as-remote-gaming-duty-starts-to-bite/ ; https://theigaming.eu/2026/07/09/germany-raises-online-slot-stakes-to-e5-in-tiered-reform/

Germany has since **reversed direction on stake caps**: from **1 July 2026** the flat €1/spin limit was replaced by a tiered system — **€1 under 21, €3 for 21+, €5 for 21+ players showing no harm indicators over a 90-day qualification period** **[A]** (https://next.io/news/regulation/germany-quietly-raises-stake-limit-online-slots/). This is the first time the GGL has used its Interstate Treaty powers to loosen a slot parameter, and the stated rationale is channelisation.

### 3.3 Volatility tiers and max-win ceilings

**The max-win arms race peaked and plateaued.** Per VegasSlotsOnline's April 2026 analysis **[B]**:

> "From 2018 to 2020 there was a steady increase in max win multipliers. Then **2021 brought a sharp spike courtesy of Nolimit**… For most slots this led to a **general plateau from 2022 to 2026 with a max cap at around 50,000x**… In 2026, the average ceiling stands at **around 50,000x for most top providers**… We predict suppliers won't be offering 200,000x anytime soon."
> — https://www.vegasslotsonline.com/news/2026/04/09/an-unsustainable-arms-race-the-slot-max-win-multipliers-that-keep-climbing/

**Volatility tier framework** (industry-standard four tiers plus an "extreme" fifth; the specific hit-frequency bands below are **[D]** — a plausible synthesis with no primary source, use as illustrative only):

| Tier | Hit frequency | Typical max win | Primary segment |
|---|---|---|---|
| Low | 35–50% of spins | 500–1,000x | Casual / low-budget |
| Medium | 20–35% | 1,000–5,000x | Broad audience, lobby anchors |
| High | 10–20% | 5,000–20,000x | Experienced players, bonus hunters |
| Extreme | under 10% | 20,000–100,000x+ | High-rollers, crypto operators, streamer content |

Source: https://igaming.whimsygames.co/blog/slot-math-design-rtp-volatility-bonus-buy-and-megaways-mechanics-explained/ **[D]**

**Verified max-win ceilings** (provider-published where possible):

| Title | Provider | Max win | RTP | Tag |
|---|---|---|---|---|
| Tombstone Slaughter | Nolimit City | **500,000x** (largest non-jackpot cap in commercial online slot history) | — | [C] |
| Tombstone RIP | Nolimit City | 300,000x | 96.07–96.08% | [C] |
| San Quentin xWays | Nolimit City | 150,000x | 96.03–96.05% | [C] |
| Money Train 4 | Relax Gaming | **150,000x** | 96.10–96.40% | [B] |
| Mental 2 | Nolimit City | 99,999x | 96.06% | [C] |
| Money Train 3 | Relax Gaming | 100,000x | 96.22% | [C] |
| Brute Force Alien Onslaught | Nolimit City | 80,000x | 96.01% | [C] |
| Road Rage | Nolimit City | 75,757x | 96.02% | [C] |
| Mental / Fire in the Hole xBomb / Punk Toilet | Nolimit City | 50,000x | 96.03–96.10% | [C] |
| Money Train 2 | Relax Gaming | 50,000x | 96.40% base / **98% bonus-buy** | [B] |
| Sweet Bonanza 1000 | Pragmatic Play | 25,000x | 96.53% | [B] |
| Sugar Rush 1000 | Pragmatic Play | 25,000x | 96.53% | [B] |
| Big Bass Bonanza 1000 | Reel Kingdom | 20,000x | 96.51% | [B] |
| Gates of Olympus 1000 | Pragmatic Play | 15,000x | 96.50% | [B] |
| Pirots 5 | ELK Studios | 10,000x | 96% (top config) | [B] |
| Gates of Olympus (original) | Pragmatic Play | 5,000x | 96.50% | [B] |
| Book of Dead | Play'n GO | 5,000x | 96.21% | [B] |
| Starburst | NetEnt | 500x | — | [C] |
| Chicken+ (crash/instant) | Pragmatic Play | **3,138,009x** (Daredevil mode) | 97–97.5% | [C] |

**The Money Train series is the cleanest illustration of the max-win illusion** — and is a good chart. As the multiplier ceiling rose, Relax Gaming cut the max bet to cap its own liability **[B]** (https://clearcasinos.com/games/money-train-4):

| Game | Max win multiplier | Max bet | Absolute payout ceiling |
|---|---|---|---|
| Money Train 1 | 20,000x | $50 | $1,000,000 |
| Money Train 2 | 50,000x | $20 | $1,000,000 |
| Money Train 3 | 100,000x | $10 | $1,000,000 |
| Money Train 4 | **150,000x** | **$6** | **$900,000** |

The headline multiplier grew 7.5×; the actual maximum a player can win went *down*.

**Probability context:** the full max win on Tombstone Slaughter is estimated at roughly **1 in 189 million spins** **[D]** — a single unsourced estimate, but useful as an order-of-magnitude sanity check on what a 500,000x cap means.

Note also that **Relax Gaming reported "3 max win occurrences on the very first day"** of Money Train 4 **[C]** (https://slotbeats.com/featured/money-train-4-a-final-journey-for-the-franchise-that-changed-the-game/) — which, if true, says more about the size of the launch-day player base than about the odds.

---

## 4. Bonus Buy / Feature Buy

### 4.1 Corrections to the brief

| Market | Brief's assumption | What I found | Tag |
|---|---|---|---|
| **UK** | Banned | ✅ **Confirmed.** UKGC issued a "Games warning for online operators" in **January 2020** flagging "feature buy-in" mechanics; operators removed them within weeks. Underpinned by RTS 14 (games must not encourage stake escalation). Reinforced by the April/May 2025 £5/£2 per-spin stake caps. Some sources date the ban to Oct 2019 — the warning notice is Jan 2020. | [A]/[B] |
| **Netherlands** | Banned | ✅ **Confirmed in effect.** The KSA achieved the ban by classifying bonus buy under the autoplay prohibition in the Wet Kansspelen op afstand. All Dutch-licensed operators must disable it. | [B] |
| **Germany** | Banned | ✅ **Confirmed.** No bonus buys under the Interstate Treaty regime, alongside no autoplay, 5-second minimum spin, no jackpots, no parallel play, LUGAS €1,000/month cross-operator deposit cap. | [A]/[B] |
| **Italy** | Banned | ❌ **Not verified as a ban.** I found no ADM instrument prohibiting feature buy. Italian sources describe it as available at many ADM-licensed operators but "limited or removed in some titles," with the main constraint being wagering-contribution rules (buy spins often contribute 10–20% or are excluded entirely). The 2025 concession terms tightened bonus mechanics generally. **Treat as "restricted/patchy," not "banned."** | [D] |
| **Slovakia** | Banned | ❌ **Contradicted by direct evidence.** CT Interactive launched five titles from its explicit **"Buy Bonus" product line** on Slovak-licensed **Tipos.sk (Nov 2025)** and **Ifortuna.sk (July 2026)** — *Fruits & Sweets Buy Bonus, Duck of Luck Buy Bonus, Nanook The White Ghost Buy Bonus* and others. Its certified Slovak portfolio reached 30 titles, five of them Buy Bonus. **Do not report Slovakia as a ban market.** | [B] |
| **Belgium** | (not in brief) | Restrictive. Belgium prohibits **bonuses entirely** since 2020 plus a €200/week deposit cap — bonus buy is caught by the broader regime. | [C] |
| **Spain** | (not in brief) | **Functional constraint, not a ban.** DGOJ moved in 2022 with bet-limit thresholds and pre-game information requirements; most providers default to no-buy builds for Spain rather than maintain dual configurations. | [C] |
| **Sweden** | (not in brief) | ⚠️ **Genuinely contested.** Swedish affiliate sources directly contradict each other: one states "bonusköp är förbjudet på casinon med svensk licens… förbudet infördes 2020 av Spelinspektionen"; another states "Köp bonus slots… är lagligt i Sverige"; a third (CasinoGuide, Nov-2025 vintage) states "Idag finns det inte något förbud i Sverige att erbjuda bonusköp i casinospel." **I could not locate a primary Spelinspektionen instrument either way. Flag as unresolved.** | [D] |
| **Romania** | (not in brief) | Permitted. CT Interactive launched its Buy Bonus series in Romania for the first time in 2025. | [B] |
| **Ontario / New Jersey** | (not in brief) | Permitted, subject to technical certification. No confirmed bans as of mid-2026, though Ontario has discussed UK-style restrictions. | [C] |

Sources: https://www.casinositesonline.co.uk/why-cant-i-buy-bonus-in-slots-uk/ ; https://casinogrounds.com/blog/bonus-buy-slots-regulations-in-uk/ ; https://gokkastgids.nl/autoplay-en-bonus-buy-verboden-in-nederland/ ; https://henkwolff.com/insights/marketing-playbook/ ; https://www.yogonet.com/international/news/2026/07/02/125130-ct-interactive-expands-slovakia-presence-through-ifortunask-games-launch ; https://lcb.org/news/ct-interactive-expands-european-reach-with-new-certifications-and-strategic-partnerships ; https://www.casinoguide.se/nyheter/hiss-eller-diss-sa-tycker-spelarna-om-bonuskop

### 4.2 Why studios love it — and what the revenue share actually is

**I could not verify any credible bonus-buy revenue-share figure.** The single number in circulation is:

> "Operators report that bonus buy revenue now represents **15–25% of total slot machine income** at progressive casinos, according to 2025 industry surveys from gaming analytics firms."
> — https://whisperwagonwire.com/bonus-buy-features-crash-slot-machine-game-design-today/ **[D]**

No firm is named, no survey is cited, and the site has no methodology page. **If you need a bonus-buy revenue share for the report, either commission it or state that no public figure exists.** This is a genuine gap in the public data.

What *is* verifiable about the economics:

| Fact | Value | Tag |
|---|---|---|
| First bonus-buy slot | *White Rabbit*, Big Time Gaming, **2017** | [B] |
| Typical buy cost | **50–200x** stake (most commonly 100x) | [B] |
| Pragmatic "Super Buy" tier (Sweet Bonanza 1000, Sugar Rush 1000) | **500x** stake | [B] |
| Buy-mode RTP can differ from base | e.g. *Thor Infinity Reels* 96.20% base → **96.60%** with buy; *Money Train 2* 96.40% base → **98%** bonus buy | [B] |
| Studios ship dual builds | Pragmatic Play, Hacksaw, Nolimit City and BTG all maintain buy and no-buy variants; base math usually identical, only the button removed | [B] |
| Regulatory rationale (UKGC) | A £5 spin becomes a £500 commitment in one click, defeating deposit/time limits | [A] |

**Player sentiment — the best hard survey I found.** Play'n GO commissioned Opinium to survey Swedish players who play slots at least monthly **[B]**:

| Question | Result |
|---|---|
| Bonus buy should be **banned** | **55% agree** |
| Believe you **lose more than you win** using bonus buy | **63%** |

Source: https://www.casinoguide.se/nyheter/hiss-eller-diss-sa-tycker-spelarna-om-bonuskop

Play'n GO's CEO has publicly stated the studio committed in 2021 never to build a bonus-buy game — *"a decision that has cost us hundreds of millions of Swedish kronor"* — and argues the feature should be excluded from the regulated Swedish market **[B]**, same source. Play'n GO is the only top-five studio taking this position, and it is worth a callout box in your report: **Book of Dead is still the #1 slot in Sweden and the Netherlands** (§5.2) without ever shipping a buy button.

⚠️ **Simulation-based "bonus buy EV" tables** circulating on sites like betting-data-lab.com (claiming "62% of bonus buys returned less than half your investment", "average return 78.4x on a 100x buy") are **[D]**. They are self-run simulations with no published seed, model or verification. Do not plot them. The only defensible statement is the tautological one: buy-mode RTP is published per game and is typically within ±2pp of base RTP, so the house edge is not materially different — the difference is *variance compression*, not expected value.

---

## 5. Top performing slots, 2025–2026

### 5.1 The single best hard GGR number

> **Pragmatic Play's Gates of Olympus 1000 has the highest percentage of GGR among slot games in Europe at 1.35%.**
> — Eilers & Krejcik, *Eilers-Fantini OGPD Data Insights Report – 1Q25* **[B]**, https://ekgamingllc.com/downloads/eilers-fantini-ogpd-data-insights-report-1q25/

This is the only game-level, GGR-denominated market share figure I could source publicly. It is worth internalising how *small* 1.35% is: the #1 slot in Europe by revenue commands barely more than one percent of the category. **The slot market has no equivalent of a platform monopoly at the title level** — the concentration is at the *supplier* level (Pragmatic Play), not the title level.

Same report: AGS's *Diamond Reels* ranks in the top-25 overall game ranks in **every** North American state/province.

### 5.2 Blask Awards 2025 — distribution-based, global

Blask's awards are computed from tracked lobby presence and operator footprint rather than a jury **[B]** (https://next.io/news/casino/blask-awards-gates-of-olympus-pragmatic-play-dominate/):

| Award | Winner | Definition |
|---|---|---|
| Slot of the Year | **Gates of Olympus 1000** (Pragmatic Play) | Carried by the largest number of licensed operators worldwide |
| Operator Footprint Champion | **Gates of Olympus 1000** | Present at the highest number of operators |
| Lobby Legend | **Gates of Olympus 1000** | Featured on the greatest number of operator main lobby pages |
| Crash Game of the Year | **Aviator** (Spribe) | Most widely distributed crash game across regulated markets |
| Full-Shelf Takeover | **Pragmatic Play** | Games appearing most frequently across catalog pages, categories, promos |
| Largest Catalog Provider | **Pragmatic Play** | Most unique games listed in licensed operator catalogs globally |

**#1 game by market** (Blask, 2025) — a directly plottable table:

| Market | #1 title | Provider |
|---|---|---|
| United Kingdom | Big Bass Bonanza | Pragmatic Play / Reel Kingdom |
| Brazil | Gates of Olympus 1000 | Pragmatic Play |
| Italy | Gates of Olympus 1000 | Pragmatic Play |
| Germany | Gates of Olympus 1000 | Pragmatic Play |
| Argentina | Gates of Olympus 1000 | Pragmatic Play |
| Spain | Gates of Olympus Super Scatter | Pragmatic Play |
| Mexico | Gates of Olympus Super Scatter | Pragmatic Play |
| Netherlands | **Book of Dead** | **Play'n GO** |
| South Africa | Aviator | Spribe |
| Ghana | Aviator | Spribe |
| Belgium | First Person Lightning Roulette | Evolution |

**Gates of Olympus distribution depth** (Blask Global Games dashboard, brands / lobbies) **[B]** (https://igamingnewstoday.com/casino-games/gates-of-olympus-leads-global-igaming-placement-rankings/) — tracked across **25 countries**:

| Market | Brands carrying | Lobby placements |
|---|---|---|
| Brazil | 172 | 96 |
| Germany | 110 | 69 |
| Nigeria | 79 | 44 |
| United Kingdom | 67 | 34 |
| Chile | 59 | 39 |
| Ecuador | 59 | 36 |
| India | 59 | 34 |
| Ireland | 57 | 30 |
| Denmark | 54 | 23 |
| Sweden | 53 | 22 |

### 5.3 EGR / eGaming Monitor Slots Tracker — the operator-data ranking

EGR publishes a monthly slots ranking in partnership with **eGaming Monitor** (which tracks 90,000+ games across 5,000+ operators and is the official data partner of both iGB and EGR) **[B]**. The full tables are paywalled; the visible headlines chart a real leadership contest:

| Period | #1 | #2 | #3 | Notes |
|---|---|---|---|---|
| April 2025 | **Book of Dead** (Play'n GO) | — | — | "Play'n GO breaks Pragmatic Play's grip on top spot" |
| July 2025 | **Big Bass Splash** (Pragmatic) | Big Bass Bonanza | Book of Dead | Pragmatic held 6 of top 10; GoO 1000 at #7; Big Bass Vegas Double Down Deluxe 13th→8th; 9 of the top 20 new releases were Pragmatic, 4 Playtech |
| December 2025 | **Book of Dead** | — | — | Book of Dead retook #1 |
| January 2026 | **Big Bass Splash** | — | — | Pragmatic reclaimed the lead |

Sources: https://www.egr.global/intel/insight/slots-tracker-pragmatic-play-holds-firm-at-the-top-of-the-table/ ; https://www.egr.global/intel/insight/slots-tracker-playn-go-breaks-pragmatic-plays-grip-on-top-spot/ ; https://www.egr.global/intel/insight/slots-tracker-pragmatic-play-kicks-off-2026-at-the-top-of-the-table/ ; https://egamingmonitor.com/

**This is the most important corrective in the report.** The public narrative is "Gates of Olympus is #1 everywhere." The operator-revenue data says the actual #1 across regulated markets alternates between **Big Bass Splash** and **Book of Dead** — a 2022 fishing hold-and-win and a 2016 book slot. Gates of Olympus 1000 wins on *distribution breadth*; the Big Bass and Book franchises win on *performance where they are deployed*.

### 5.4 bet365 "Gaming Insights and Performance" — the first operator to publish its own game rankings

This is the most significant new public data source in the category, and it directly answers the brief's question 4b. In **February 2026 bet365 began publishing a monthly public leaderboard of its own top-performing games**, market by market. Nothing else in this report is operator-internal performance data released voluntarily and at this granularity. **[B]**

**Methodology, as stated by bet365:** rankings cover **7,500+ games across 20 markets**; games are ordered by "an algorithm that takes into account metrics such as **revenue, stakes, sessions and engagement**"; slots only — table games and live casino are excluded; published monthly.

Primary source: bet365 Gaming Insights and Performance, June 2026 edition, https://releasd.com/pages/NCe-ha7Dkvxt75buSAFDWnd0wpqfWAb02NS4ZTwnnQo= (the report itself is a JavaScript-rendered microsite and did not return text to automated retrieval; the figures below are taken from trade-press coverage of each monthly edition).

**Caveats before using this.** It is one operator's book, not the market: bet365's mix is skewed by its own game merchandising, its exclusive titles (*bet365 Pop-A-Shot LuckyTap*, *bet365 High Flyer*) and its sportsbook-led acquisition funnel. The composite of revenue + stakes + sessions + engagement is not disclosed in weights, so a title can rank on volume rather than yield. Treat it as a strong **[B]** — real internal data, undisclosed methodology, single operator.

**#1 slot by market, June 2026** — the single most chart-ready ranking table in this report:

| Market | #1 slot, June 2026 | Provider |
|---|---|---|
| United Kingdom | **Gold Cash Freespins** | Inspired Entertainment |
| Germany | **Legacy of Dead** | Play'n GO |
| Spain | **Eye of Horus** | Reel Time Gaming / Merkur |
| Greece | **Stacked Fire 7's** | — |
| Brazil | **Gates of Olympus** | Pragmatic Play |
| Canada (national) | **Area Link Phoenix Firestorm** | Games Global |
| Ontario | **Area Link Phoenix Firestorm** | Games Global |
| Michigan | **Hypernova Megaways** | ReelPlay |
| New Jersey | **Triple Diamond** | IGT |
| Pennsylvania | **Mad Mad Monkey** | Games Global |
| Brazil — crash chart | **Aviator** | Spribe |

Sources: https://slotbeats.com/slot-news/bet365-june-slot-charts/ ; https://www.playnj.com/news/bet365-nj-slots-rankings-june/98657/

**Top 5 by market, June 2026** (from the same coverage):

| Rank | UK | Germany | Spain | Brazil | Canada | Ontario |
|---|---|---|---|---|---|---|
| 1 | Gold Cash Freespins | Legacy of Dead | Eye of Horus | Gates of Olympus | Area Link Phoenix Firestorm | Area Link Phoenix Firestorm |
| 2 | Spin O'Reely Gold Blitz | Book of Ra Magic | Pirots 4 | Gates of Olympus Super Scatter | Chests of Cai Shen | Big Bass Halloween 3 |
| 3 | Sizzling 7s Fortune | Sunny Sevens | Spin O'Reely Gold Blitz | (Pragmatic title) | Amazing Link Zeus | John Hunter & the Tomb of the Scarab Queen |
| 4 | Fish' Frenzy Lure 'Em In | Sizzling Hot Deluxe | Blue Wizard | Gold Trio 10000 | Area Link Bank Boss | Sweet Rush Bonanza |
| 5 | Pirots 4 | Dynamite Riches Megaways | Mega Fire Blaze Big Circus! | Sweet Bonanza 1000 | Sweet Bonanza 2500 | Gates of Olympus Super Scatter |

**Full New Jersey top 10, June 2026** — the only complete top-10 published in the trade coverage **[B]** (https://www.playnj.com/news/bet365-nj-slots-rankings-june/98657/):

| Rank | Game | May rank | Move |
|---|---|---|---|
| 1 | Triple Diamond (IGT) | 16 | **+15** |
| 2 | Cash Eruption | 3 | +1 |
| 3 | bet365 Pop-A-Shot LuckyTap | 8 | +5 |
| 4 | Piggy Payouts Bank Buster LuckyTap | 1 | −3 |
| 5 | 9 Coins Grand Gold Edition | 28 | **+23** |
| 6 | Huff N' Even More Puff Grand | — | — |
| 7 | 88 Fortunes | — | — |
| 8 | Happy Money Hens | 11 | +3 |
| 9 | Oink Oink Oink | — | — |
| 10 | Wolf It Up! Again | 13 | +3 |

Seven of the top 10 improved position month-on-month; only two held rank.

**Month-on-month volatility is the headline finding.** Across February, May and June 2026 the #1 slot changed in most markets almost every month:

| Market | Feb 2026 #1 | May 2026 #1 | Jun 2026 #1 |
|---|---|---|---|
| UK | Gold Cash Freespins | Gold Cash Freespins | **Gold Cash Freespins** (5th consecutive month) |
| Germany | Big Bass Splash | — | Legacy of Dead |
| Spain | Amazing Link Zeus Boost | Blue Wizard | Eye of Horus |
| Greece | Rich Wilde and the Tome of Madness | — | Stacked Fire 7's |
| Brazil | Gates of Olympus Super Scatter | Gates of Olympus Super Scatter | Gates of Olympus |
| Canada | 12 Masks of Fire Drums | Area Link Phoenix Firestorm | Area Link Phoenix Firestorm |
| Ontario | (Area Link Bank Boss #2) | Big Bass Halloween 3 | Area Link Phoenix Firestorm |
| Pennsylvania | Cash Eruption | Scruffy Duck | Mad Mad Monkey |
| New Jersey | bet365 Pop-A-Shot LuckyTap | Piggy Payouts Bank Buster LuckyTap | Triple Diamond |
| Michigan | — | Hypernova Megaways | Hypernova Megaways |

Sources: https://zonadeazar.com/juego-online/bet365-reveals-the-suppliers-set-to-shine-in-canada-ahead-of-alberta-launch/ (Feb) ; https://igamingexpert.com/regions/europe/bet365-playtech-spanish-slots-charts/ and https://www.vegasslotsonline.com/news/2026/06/16/scruffy-duck-among-multiple-slots-to-soar-to-top-of-bet365s-us-canada-charts-for-may/ (May) ; https://slotbeats.com/slot-news/bet365-june-slot-charts/ (Jun)

**Four things this dataset establishes that nothing else in the report does:**

1. **There is no global #1 slot.** At a single operator, on a single ranking algorithm, in a single month, the top game differs in all ten markets. The only market with genuine stability is the UK, where *Gold Cash Freespins* held #1 for five straight months.
2. **The famous titles are largely absent from operator top-fives outside LatAm.** Gates of Olympus tops Brazil and appears at #5 in Ontario, but does not appear in the UK, German, Spanish, Michigan, New Jersey or Pennsylvania top fives at all. Sweet Bonanza appears only as *Sweet Bonanza 2500* (#5 Canada) and *Sweet Bonanza 1000* (#5 Brazil). **The slots that dominate search volume and affiliate lists are not the slots that dominate operator revenue in mature markets.**
3. **Hold-and-collect "Link" mechanics own North America.** Games Global's *Area Link* / *Amazing Link* family took the top spot in Canada and Ontario and swept the Canadian podium in May. Combined with the Eilers & Krejcik attribute finding (§2.1), this is now corroborated by operator revenue data.
4. **Old games win.** *Triple Diamond* (a three-reel IGT classic), *Scruffy Duck* (NetEnt, 2017), *Book of Ra*, *Legacy of Dead*, *Eye of Horus*, *Starburst* and *Sizzling Hot Deluxe* all took top-five positions in 2026. Age of catalogue is close to irrelevant; familiarity and lobby placement are what matter.

### 5.5 iGamingCompass full-market lobby scans — US and Germany

A second 2026 tracker worth having, because it claims **100% market coverage rather than a sample**. iGamingCompass scans every licensed online casino lobby in a market monthly and scores each game on distribution reach (how many casinos carry it) weighted by lobby prominence. **[B]**

**United States, June 2026** — panel of **76 licensed sites across seven states** (NJ 25, PA 23, MI 14, WV 10, DE 3, CT 2, RI 1) **[B]** (https://igamingcompass.com/blogs/usa-top-100-slot-games-rankings/):

| Rank | Game | Studio | Change |
|---|---|---|---|
| 1 | **Cash Eruption** | IGT | ▲1 |
| 2 | Huff N Even More Puff | Light & Wonder | ▼1 |
| 3 | Eternal Link Princess' Empire | IGT | NEW |
| 4 | Divine Fortune Gold | NetEnt | NEW |
| 5 | Big Hot Flaming Pots Delicious Delights | Light & Wonder | NEW |
| 6 | Huff N' Lots of Goals | Light & Wonder | NEW |
| 7 | Huff N' Puff Money Mansion | Light & Wonder | ▼2 |
| 8 | Almighty Mustang Express | Blueprint Gaming | NEW |
| 9 | Hypernova Megaways | Reel Play | ▼6 |
| 10 | Jackpot Train | Red Tiger | NEW |
| 11 | Monopoly Rent Rush | Red Tiger | ▲3 |
| 12 | Mega Eagle Power Combo | JustForTheWin | NEW |
| 13 | Huff N' More Puff | Light & Wonder | ▼7 |
| 14 | Bigger Piggy Bank Soccer | Inspired Gaming | NEW |
| 15 | 3 Pigs: Bacon Bankroll | S Gaming | NEW |
| 16 | Monopoly Cash is King | Red Tiger | ▼12 |
| 17 | Thunder Drums Serengeti Sun | Light & Wonder | NEW |
| 18 | Wolf It Up! Again Soccer | Inspired Gaming | NEW |
| 19 | Big Money Frenzy Cash Gains | Blueprint Gaming | NEW |
| 20 | Maradona Golden Goal | Blueprint Gaming | NEW |

Key metrics: **Cash Eruption is live in 62 of 75 scored casinos** and has held a top-100 position for six consecutive months. **48 of the top 100 were brand-new entries** and **no game held its exact May rank**. Light & Wonder's *Huff N' Puff* franchise holds **6 of the top 20**.

⚠️ **The publisher's own caveat, which you should carry over:** its tracked panel grew from **49 casinos in May to 75 in June**, so a large part of the month-on-month churn is coverage expansion, not market movement. iGamingCompass flags this explicitly and warns against reading moves like "+232 places" as real momentum. Credit to them for disclosing it; most trackers do not.

**US supplier presence in the top 100, June 2026** (counts double as percentages) **[B]**:

| Supplier | Games in top 100 |
|---|---|
| IGT | 15 |
| Light & Wonder | 12 |
| Inspired Gaming | 8 |
| Playtech | 6 |
| Blueprint Gaming | 6 |
| AGS | 5 |
| NetEnt | 5 |
| Red Tiger | 5 |
| Reel Play | 4 |
| Hacksaw Gaming | 4 |
| Design Works Gaming | 3 |
| Play'n GO | 2 |
| Slingshot Studios | 2 |
| Aristocrat | 2 |
| 21 other studios | 1 each |

IGT and Light & Wonder hold **27% of the visible US shelf** between them; the top ten studios hold **70%**. **Pragmatic Play — the global #1 everywhere else in this report — does not appear in the US top-100 supplier table at all.** That is the single sharpest illustration of how completely the US and European slot markets have diverged.

**Germany, June 2026 top 20** — measured across every licensed German slot lobby **[B]** (https://igamingcompass.com/blogs/germany-slot-game-rankings-2026/):

| Rank | Game | Provider | Casinos carrying it |
|---|---|---|---|
| 1 | **Legacy of Dead** | Play'n GO | 56 |
| 2 | Book of Dead | Play'n GO | 51 |
| 3 | Big Bass Bonanza | Pragmatic Play | 54 |
| 4 | Big Bass Splash | Reel Kingdom | 47 |
| 5 | Lucky Pharaoh Wild | Merkur | 44 |
| 6 | Book of Ra | Greentube | 47 |
| 7 | Tizona | Edict | 46 |
| 8 | Eye of Horus | Merkur | 41 |
| 9 | Book of Ra Magic | Greentube | 44 |
| 10 | Razor Shark | Push Gaming | 37 |
| 11 | Gates of Olympus | Pragmatic Play | 35 |
| 12 | Fire Joker | Play'n GO | 36 |
| 13 | Luxor Gold: Hold and Win | Playson | 31 |
| 14 | Robin Sherwood Marauders | Peter & Sons | 27 |
| 15 | Johnan Legendarian | Peter & Sons | 26 |
| 16 | El Torero | Reel Time Gaming | 29 |
| 17 | Gold Cup Power Spins | Edict | 28 |
| 18 | Zentaurus | Merkur | 31 |
| 19 | Book of Ra deluxe 6 | Greentube | 29 |
| 20 | Madame Destiny Megaways | Pragmatic Play | 30 |

**Six of the German top 19 are Egyptian expanding-symbol "book" slots** (Legacy of Dead, Book of Dead, Book of Ra, Book of Ra Magic, Eye of Horus, Book of Ra deluxe 6). The publisher attributes this to decades of Novoline and Merkur land-based cabinet play — the "book" mechanic is the German market's muscle memory. This is the clearest available evidence that **mechanic preference is culturally path-dependent, not universal**, and it is a direct counterexample to any single global mechanic-prevalence ranking.

**German supplier presence in the top 100** **[B]**:

| Provider | Titles in top 100 | Highest-ranked title |
|---|---|---|
| Pragmatic Play | 24 | #3 Big Bass Bonanza |
| Play'n GO | 17 | #1 Legacy of Dead |
| Greentube | 12 | #6 Book of Ra |
| Merkur | 7 | #5 Lucky Pharaoh Wild |
| Edict | 6 | #7 Tizona |
| Gamomat | 6 | #23 Ramses Book |
| Reel Kingdom | 5 | #4 Big Bass Splash |
| Reel Time Gaming | 5 | #16 El Torero |
| Peter & Sons | 4 | #14 Robin Sherwood Marauders |
| Push Gaming | 2 | #10 Razor Shark |
| Playson | 2 | #13 Luxor Gold: Hold and Win |
| Novomatic | 2 | #26 Book of Ra Deluxe |
| GameArt, ELK, Red Tiger, Relax, NetEnt, Flipluck, Swintt, Hacksaw | 1 each | #36 El Toreo (GameArt) |

**German market structure — a useful distribution fact [B]:** iGamingCompass tracks **95 licensed casino brands on .de domains, operated by just 31 licensed companies**. **SkillOnNet alone operates ~37 of those brands** as a white-label platform (DrückGlück, PlayOJO, SlotsMagic, ICE36, Lucky Niki and others), followed by Lotto24 with 8, then 888, Rabbit Entertainment and Merkur Bets with 5 apiece. One SkillOnNet integration places a game on roughly **four in ten German storefronts**. Brand fragmentation in Germany is cosmetic; buying power is concentrated.

**Biggest German climbers into the June 2026 top 100 [B]** — note that the top two are both hold-and-win titles:

| Game | Provider | Rank move | Places gained |
|---|---|---|---|
| Luxor Gold: Hold and Win | Playson | #542 → #13 | **+529** |
| The Sword and The Grail | Play'n GO | #536 → #50 | +486 |
| Gold Cup Power Spins | Edict | #495 → #17 | +478 |
| Fury of Odin Megaways | Pragmatic Play | #539 → #63 | +476 |
| Convertus Aurum | Reel Time Gaming | #545 → #88 | +457 |
| Rise of Olympus 100 | Play'n GO | #486 → #47 | +439 |
| Blazing Star | Edict | #480 → #72 | +408 |
| Spin and Score Megaways | Pragmatic Play | #487 → #79 | +408 |

Moves of this size in one month are placement campaigns, not organic demand. It is a useful reminder that **lobby rank trackers measure commercial negotiation at least as much as player preference.**

**The "Lobby Effect" — a quantified placement premium [C]:** iGamingCompass reports from its own data that a game in the visible lobby pulls **4× more new players and 3× higher engagement** than one buried in a sub-menu. Vendor-published and self-serving (they sell placement tracking), so tag accordingly — but it is the only number I found that puts a figure on lobby position.

### 5.6 Blask Global Games dashboard — distribution scale

Blask launched its Global Games dashboard in late 2025, ranking **26,000+ online casino titles by the number of operator brands carrying them**. As of May 2026 **[B]** (https://playercounter.com/7-online-games-pulling-the-biggest-player-numbers/):

| Rank | Title | Provider | Operator brands |
|---|---|---|---|
| 1 | **Gates of Olympus 1000** | Pragmatic Play | **606** |
| 2 | Gates of Olympus Super Scatter | Pragmatic Play | — |
| 3 | Aviator | Spribe | — |

Blask's own casino-games ranking places **Sweet Bonanza inside the global top ten in nearly every regulated market it tracks**, strongest in Asia and LatAm, and **Book of Dead still inside the top thirty most-distributed titles globally in 2026** — ten years after release.

⚠️ **Note a coverage discrepancy:** this source describes the dashboard as covering **17 countries**, while the Blask coverage cited in §5.2 describes **25 countries** and the casual-genre tracking in §7.2 describes **28 regulated markets**. These are probably different products or different vintages of the same one, but if you cite a country count, cite it with its date.

### 5.7 Provider footprint, Q1 2026 (SlotsRank)

Analysed 3,844 games across 12,999 pages **[B]** (https://www.isstories.com/2026/04/09/slotsrank-reveals-which-slot-providers-actually-dominated-q1-2026/):

| Provider | Games | Sites | Pages | Countries |
|---|---|---|---|---|
| **Pragmatic Play** | **1,219** | **514** | **3,291** | 45 |
| Playtech | 985 | 503 | 2,993 | 45 |
| Light & Wonder | 687 | 408 | 2,172 | 45 |
| Games Global | 486 | 483 | 2,354 | 44 |
| Evolution | 467 | 428 | 2,189 | 43 |

Blask's separate "provider content share" metric finds the same shape: **Pragmatic Play leads in essentially every tracked jurisdiction across Europe, LatAm and Africa, with the nearest UK rival (Blueprint Gaming) at roughly half its content share** **[B]** (https://blask.com/blog/provider-content-share/).

A composite discovery-and-lobby ranking for 2026 **[C]** (https://www.businessofigaming.com/provider-power-ranking/):
**1** Pragmatic Play · **2** PG Soft · **3** Reel Kingdom · **4** Hacksaw Gaming · **5** Play'n GO · **6** Spribe · **7** Jili Games · **8** TaDa Gaming · **9** ELK Studios · **10** Greentube/Novomatic

### 5.8 The Big Bass franchise — the single most successful slot IP by title count

| Metric | Value | Tag |
|---|---|---|
| Developer / publisher | Reel Kingdom / Pragmatic Play | [A] |
| First release | *Big Bass Bonanza*, December 2020 | [A] |
| Titles released by mid-2026 | **35–40** (exact count depends on operator exclusives and regional variants) | [B] |
| Release cadence | Roughly one new title every 6–8 weeks | [B] |
| Core mechanic | Fisherman wild collects money-fish values during free spins (a hold-and-collect derivative) | [A] |

| Title | Released | Grid / ways | Base RTP | Volatility | Max win |
|---|---|---|---|---|---|
| Big Bass Bonanza | Dec 2020 | 5×3, 10 lines | 96.71% | Med-High | 2,100x |
| Bigger Bass Bonanza | Sep 2021 | 5×4, 12 lines | 96.71% | Very High | 4,000x |
| Big Bass Bonanza Megaways | Nov 2021 | 46,656 ways | 96.70% | High | 4,000x |
| Big Bass Splash | Jun 2022 | 5×3, 10 lines | 96.71% | High | 5,000x |
| Big Bass Keeping It Reel | Oct 2022 | 5×3, 10 lines | 96.07% | High | 10,000x |
| Big Bass Hold & Spinner | Mar 2023 | 5×3, 10 lines | 96.07% | High | 10,000x |
| Big Bass Hold & Spinner Megaways | Aug 2023 | 6×6, 147,456 ways | 96.70% | High | 20,000x |
| Big Bass Amazon Xtreme | Jun 2023 | 5×3, 10 lines | 96.07% | High | 10,000x |
| Big Bass Bonanza 1000 | Apr 2025 | 5×3, 10 lines | 96.51% | High | 20,000x |
| Big Bass Splash 1000 | Dec 2025 | 5×3 | 96.52% | Very High | 25,000x |

Sources: https://slotsrank.com/guides/big-bass-slots-comparison/ ; https://www.slotogram.com/en/fishing-slots/ ; https://respinix.com/series/big-bass-bonanza-slots-series/

### 5.9 Where the rankings disagree, and why

Seven public "top slots" rankings gave seven different answers. This is not noise — each measures a different thing, and the divergence is itself the finding:

| Ranking | What it measures | Coverage | #1 result |
|---|---|---|---|
| Eilers & Krejcik OGPD | Actual GGR share | Europe | Gates of Olympus 1000 (1.35%) |
| EGR / eGaming Monitor | Operator performance data | 5,000+ operators | Big Bass Splash / Book of Dead (alternating) |
| **bet365 Gaming Insights** | **Revenue + stakes + sessions + engagement, one operator's own book** | **7,500 games, 20 markets** | **Different game in all 10 published markets** |
| Blask Global Games | Operator brands carrying the title | 26,000 titles, 17 countries | Gates of Olympus 1000 (606 brands) |
| Blask Awards | Distribution + lobby placement + search demand | Global | Gates of Olympus 1000 |
| iGamingCompass | Distribution reach × lobby prominence, 100% of licensed lobbies | US: 76 sites / Germany | Cash Eruption (US) · Legacy of Dead (DE) |
| SlotCatalog SlotRank | Weighted lobby position, scanned daily | 50+ markets | Geo-dependent — US IP returns L&W's Quick Hit; UK returns Big Bass Splash |

**SlotCatalog's SlotRank methodology** is worth documenting **[B]**: daily incognito scans of casino lobbies across 50+ markets; points awarded by lobby position (higher = better); scores weighted by estimated operator traffic in each market; games absent from tracked lobbies receive the worst score of 151; lower score = better rank.

**The rule to state explicitly in your report:** there are three distinct questions that get conflated into "what is the top slot," and they have different answers.

1. **Which title earns the most revenue?** No fully public answer exists. The best available are Eilers & Krejcik (Gates of Olympus 1000, 1.35% of European GGR) and now bet365's own book, which says the answer is market-specific.
2. **Which title is carried by the most operators?** Gates of Olympus 1000, on 606 brands (Blask). This is the question most "top slots" lists actually answer, usually without saying so.
3. **Which title do players in market X actually play?** Almost always a different game from either of the above — *Gold Cash Freespins* in the UK, *Legacy of Dead* in Germany, *Cash Eruption* in the US, *Area Link Phoenix Firestorm* in Canada.

**Any global "top 10 slots" list without a stated market and a stated metric is close to meaningless**, and the 2026 data makes that case far more strongly than the 2025 data did.

### 5.10 Search / streaming visibility

- Gates of Olympus 1000 monthly search interest peaked at **657,600 searches in November 2025** — **[D]**, single affiliate source (https://gatesolympus.net/gates-of-olympus-1000/), unverifiable against Google Trends absolute volumes. Use only if labelled as an estimate.
- Same source claims GoO 1000 "paid 7 times its max win during 2024" — **[D]**, unverifiable.

---

## 6. Player demographics and behaviour

### 6.1 UK Gambling Commission operator data — the best behavioural dataset in the industry

This is the highest-quality time series available anywhere, drawn from the largest operators (~70% of the UK online market). **Note: the May 2026 release was the final publication of this dataset** — the Commission has discontinued it, so this is the end of the series **[A]**.

| Metric | Q1 FY25/26 (Apr–Jun 25) | Q2 (Jul–Sep 25) | Q3 (Oct–Dec 25) | Q4 (Jan–Mar 26) |
|---|---|---|---|---|
| Slots GGY | £745m (+14% YoY) | £747m (+9%) | **£788m** (+10%) | £773m (+12%) |
| Spins | 24.4bn (+8%) | 24.4bn (+4%) | **25.7bn** (+7%) | 25.1bn (+7%) |
| Avg monthly active accounts | 4.4m (flat) | 4.4m (−0.4%) | 4.6m (+5%) | **4.8m** (+6%) |
| Total sessions | 189m (+16%) | 188m (+13%) | 201m (+17%) | **202m** (+18%) |
| **Spins per session** | 129 (from 139) | 130 (from 141) | 128 (from 139) | **124** (from 136) |
| **GGY per session** | £3.95 (from £4.01) | £3.96 (from £4.11) | £3.91 (from £4.13) | **£3.82** (from £4.01) |
| **Avg session length** | 16 min (−1) | 16 min (−1) | 16 min (−2) | **15 min** (−2) |
| Sessions over 1 hour | 8.8m (−9%) | 8.6m (−15%) | 8.9m (−16%) | 8.9m (−12%) |
| % of sessions over 1 hour | ~5% (from ~6%) | ~5% (from ~6%) | **4.4%** (from 6.2%) | **4.4%** (from 5.9%) |

Sources: https://www.gamblingcommission.gov.uk/statistics-and-research/publication/market-overview-operator-data-to-march-2026-published-may-2026 and the equivalent Dec-2025, Sep-2025 and Jun-2025 releases.

**Monthly granularity** (from the accompanying business-data tables) **[A]**:

| Month | Slots GGY | Avg session (min) | Sessions >1hr | Total sessions |
|---|---|---|---|---|
| Oct 2024 | £231,219,418 | 17 | 3,291,478 | 53,746,454 |
| Nov 2024 | £231,440,120 | 18 | 3,479,516 | 54,336,276 |
| Dec 2024 | £250,185,794 | 18 | 3,849,269 | 64,582,481 |
| Oct 2025 | £251,881,883 | 16 | 2,900,708 | 64,706,010 |
| Nov 2025 | £252,600,432 | 16 | 3,008,462 | 65,251,203 |
| Dec 2025 | £283,066,357 | 15 | 3,028,023 | 71,431,310 |

**Caveat the Commission itself flags:** a small number of operators refined their session-length methodology during the period, which affects YoY comparability of session counts, sessions-over-one-hour and average session length. GGY and spin figures are unaffected.

**The pattern to plot:** total sessions +18%, spins +7%, GGY +12% — but spins per session −9%, session length −2 min, GGY per session −5%. **UK players are having more, shorter, cheaper sessions.** The £5/£2 stake caps (live from 9 April and 21 May 2025) are the obvious cause of falling GGY per session; the rising session count suggests the same spend is being spread across more visits rather than lost.

For comparison, UK **land-based** machine sessions in Q4 FY25/26 averaged **132 spins** and **£12.48 spend per session** **[A]** — three times the online GGY per session, on similar spin counts.

### 6.2 Mobile share

| Market / dataset | Mobile share | Tag |
|---|---|---|
| Evolution AB platform, 2025 (all GGR) | **74.0%** | [A] |
| Denmark, all online gambling revenue 2025 | **73%** (vs 27% in 2012) | [A] |
| Denmark, online **casino** revenue 2025 | **69%** | [A] |
| Sweden, players who play **only** on mobile | **40%** of all respondents | [B] |
| — Swedish men only-mobile | 29% | [B] |
| — Swedish women only-mobile | **42%** | [B] |
| — Swedish 18–35 only-mobile | **29%** (vs ~40% in the two older cohorts) | [B] |
| Europe, share of online gambling revenue from mobile (EGBA/H2, 2024) | 58%, projected >60% globally by end-2025 | [C] |
| SOFTSWISS Sportsbook (not casino) | >90% of GGR | [C] |

Sources: Evolution AB Year-End Report 2025 (https://www.evolution.com/wp-content/uploads/2026/04/Annual_Report_English_2026_04_01.pdf) ; https://igamingbusiness.com/finance/online-casinos-lotteries-largest-danish-gambling-segment-2025/ ; https://www.casinofeber.se/files/casinotempen-2025-english.pdf

⚠️ **Counter-intuitive finding worth highlighting:** in the Swedish survey, the **youngest cohort (18–35) was the *least* likely to be mobile-only (29%)**, while the two oldest cohorts were at ~40%. The survey authors flagged this as surprising. It cuts directly against the standard "Gen Z is mobile-first" narrative — younger players appear to be *multi-device*, not mobile-exclusive. Worth a callout.

### 6.3 Swedish player preference survey (Casinofeber / Reflect Företagsutveckling, July 2025)

Nationally representative Norstat web panel, n=3,463 screened → **501 casino respondents**, weighted by gender and age; fieldwork 3–17 July 2025 **[B]**:

| Finding | Value |
|---|---|
| Share of Swedes 18–75 who are online casino players | **18%** (1 in 6) |
| Share who are betting players | 24% |
| Of casino players: men | 55% |
| Play online casino at least once a month | 53% |
| **Prefer slots** | **49%** — of which regular slots **28%**, jackpot slots **21%** |
| Most important factor when choosing a casino site | "Good chances of winning" |

Source: https://www.casinofeber.se/files/casinotempen-2025-english.pdf

### 6.4 Category mix — what share of the market slots actually hold

| Market / dataset | Slots share | Basis | Tag |
|---|---|---|---|
| **Denmark 2025** | **82%** of online casino GGR (DKK 3.54bn of 4.31bn) | Regulator | [A] |
| Pennsylvania, July 2025 | **81.6%** of online casino revenue ($226.8m of $277.9m) | Regulator | [A] |
| Pennsylvania, Sept 2025 | **77.6%** ($181.1m of $233.4m) | Regulator | [A] |
| Michigan 2025 | ~73% of online casino revenue | Secondary | [C] |
| SOFTSWISS network 2023 | **85.56%** of GGR and total bet count | Aggregator | [B] |
| SOFTSWISS network early 2024 | ~83%, expected to stay >80% | Aggregator | [B] |
| Ontario FY2024-25 | Casino (slots + live + tables + bingo) = **84% of wagers**, **75% of GGR** | Regulator | [A] |
| Ontario CY2025 | Casino = 83–89% of monthly handle (peak in Jul/Aug), 75% of GGR | Regulator | [A] |
| Europe (EGBA) | Casino games = 51% of online gambling revenue | Trade body | [C] |

Denmark also gives a clean within-casino breakdown for 2025 **[A]**: **slots 82%** (DKK 3.54bn), **blackjack ~6%** (DKK 267m), **roulette ~6%** (DKK 246m).

### 6.5 Average bet size

The only network-level figure I found, from SOFTSWISS **[B]** (2023 data, dated but the only one available):

| Category | Average bet |
|---|---|
| **Slots** | **€0.75** |
| Live card games | **€49.95** |

That 66× ratio is the clearest single argument for why lobby mix matters: slots drive volume and top-of-funnel conversion; live drives per-session yield and VIP concentration. SOFTSWISS's own recommended lobby weighting for 2026 is **40% slots / 40% live casino / 20% hybrid (crash, arcade, instant-win)** **[B]** (https://www.softswiss.com/knowledge-base/casino-game-types-guide-for-operators/).

### 6.6 Streaming — the Twitch/Kick effect, quantified

**Twitch "Slots" category, trailing 365 days to 28 July 2026** **[B]** (https://sullygnome.com/game/slots/365/summary):

| Metric | Value | YoY change |
|---|---|---|
| **Hours watched** | **121.5m** | **+34.4m (+39.5%)** |
| Hours streamed | 649.3k | −84.1k (−11.5%) |
| Average viewers | 13.9k | +3.9k (+39.5%) |
| Average channels | 74 | −9 (−10.8%) |
| **Viewer ratio (viewers per channel)** | **187.1** | **+68.3 (+57.5%)** |
| Peak concurrent viewers | 93k | +32k (+52.6%) |
| Unique streamers | 23.9k | −3.6k (−13.2%) |
| Category rank by average viewers | **23rd on Twitch** | +13 places |

**This is the most striking dataset in the report.** Slots viewership on Twitch grew **39.5%** while hours streamed *fell* 11.5% and the streamer count fell 13.2%. Audience is consolidating hard onto fewer, larger channels — the viewer ratio jumped 57.5%. Slots is now a **top-25 Twitch category by average viewership** and did that with an average of just 74 concurrent channels.

**Platform context** (Streamlabs × Stream Hatchet Q4 2025) **[B]** (https://streamlabs.com/content-hub/post/streamlabs-and-stream-hatchet-q4-2025-live-streaming-report):

| Platform | Q4 2025 hours watched | QoQ | YoY |
|---|---|---|---|
| All platforms | 20.90bn | +0.76% | — |
| Twitch | 4.38bn | −5.05% | **−14.94%** |
| Kick | 1.22bn | −20.5% | **+106%** (from 591.2m) |

**Kick**: "Slots & Casino" was the **#2 or #3 category by monthly rank continuously from November 2024 through October 2025** **[B]** (https://twitchmetrics.herokuapp.com/overviews/kick). In September 2025, when Kick's overall hours watched fell 13% to 511m, **Slots & Casino was the only top-four category to grow** **[B]** (https://streamscharts.com/news/kick-september-2025-recap).

**Record streamed wins — the escalation curve** (a good chart) **[C]**:

| Date | Streamer | Game | Provider | Bet | Reported win |
|---|---|---|---|---|---|
| Jul 2022 | Roshtein | Wanted Dead or a Wild | Hacksaw | — | $18.7m |
| Jun 2024 | Roshtein | Drac's Stacks | Massive Studios | $10,000 | $28.5m |
| Oct 2024 | Trainwreckstv | San Quentin 2: Death Row | Nolimit City | — | $20m |
| May 2025 | Roshtein | License to Squirrel | — | $500 | $25m (50,000x) |
| Jul 2025 | Trainwreckstv | Hex Appeals | — | $6,000 | **$37.5m** |
| Jul 2025 | Roshtein | Drac's Stacks | Massive Studios | $10,000 | **$45.4m** |

Sources: https://www.vegasslotsonline.com/news/2026/03/26/train-vs-rosh-the-debate-over-the-biggest-online-slot-win-of-all-time/ ; https://sccgmanagement.com/sccg-news/2025/7/21/new-slots-win-leaderboard-confirmed-after-trains-record-37-5m-win/

**Important caveat:** these amounts are disputed within the streaming community over "fake balance" allegations — promotional house-funded balances rather than withdrawable money. Trainwreckstv has publicly made this accusation against sponsored high-stakes play. **Treat all streamed win amounts as marketing artefacts, not verified payouts.** Per-spin stakes have escalated from hundreds of dollars to $5,000–$10,000 over the period.

**Studios now design *for* streamers.** BGaming's stated three-layer approach **[B]** (https://igamingbusiness.com/casino-games/bgaming-kate-puteiko-igaming-streamers-player-acquisition/):
1. **Data layer** — Strmlytics tracking of which streamers actually drive play, session length and comparative performance.
2. **Product layer** — explicit "is this game streamable?" gate covering pacing, volatility and clip-worthy moments. Result: *Aztec Clusters* entered the top-20 most-played games across streamers for over a month.
3. **Engagement layer** — live viewer challenges (highest multiplier competitions) driving deposits and reactivations, with cohort-level GGR tracked.

They also shipped the **first celebrity-branded slot, *Snoop Dogg Dollars*** with Roobet and Strmlytics.

### 6.7 Gen Z and gamification

Qualitative consensus across trade sources **[C]**: Gen Z prefers short bursts over long sessions, mobile-first, gamified progression (missions, achievements, quests), social/chat/streaming integration, transparent mechanics, and instant payments as a baseline expectation. Crypto casinos (Stake, BC.Game) are cited as the reference implementations of full gamification.

**Quantified gamification and tournament impacts.** All of these are vendor case studies — **[C]** — so treat as vendor-favourable, but they are internally consistent around a +20–30% band:

| Intervention | Reported effect | Source |
|---|---|---|
| SOFTSWISS Tournament Tool | **+22% of daily bets** | softswiss.com |
| SOFTSWISS Jackpot Aggregator (first month) | avg bet count **+40%**, avg bet sum **+68%** | casino.com |
| Kalamba *Kash Drops* (Feb–May 2025, >1m players) | bets **+60.35%**, total players **+22.82%**; next pool €10m | kalambagames.com |
| *Spin-O-Mania* network tournament (€1m pool) | avg session duration **+25%**, 3-month retention **+30%** | casinorix.com |
| Social-casino tournament layer (SpinRally) | session frequency **+46%**, D30 retention **+29%**, referral acquisition **+34%** | redappletech.com |
| Coin-collecting mechanics vs non-collecting | **+22%** session time (SOFTSWISS, 2024); **+18%** D14 retention (Slotegrator) | via LinkedIn |

**AI personalisation** — the 2026 operator arms race. Reported uplifts **[C]**:

| Vendor / deployment | Result |
|---|---|
| ZingBrain AI × Hondubet (A/B vs manual lobby) | **+25% GGR and turnover** for newly-registered players; **+10%** total bets from existing players; **+25%** unique games tried |
| ZingBrain AI (published benchmarks) | **5–15%** GGR/turnover uplift; **10–15%** more games played; **5–10%** more active days; **−80%** lobby management time |
| ZingBrain A/B across 4 brands (provider cost optimisation) | redirected up to **20% of turnover and GGR** to more profitable titles with no drop in player performance |
| The Playa × Infingame (two European markets) | **+12–16%** turnover per user; **+9–12%** active days; **+13–32%** more game variety explored; compounding per monthly cohort with no increase in marketing spend |
| The Playa (general) | **+5–15%** bets and LTV; up to **25%** total revenue uplift |

Sources: https://gamingnewsroom.com/latest-news/2026/04/09/170774/zingbrain-ai-transforms-hondubet-lobby-with-real-time-personalisation/ ; https://igamingbusiness.com/company-news/vegangster-integrates-zingbrain-ai-for-smart-game-recommendations-across-operator-lobbies/ ; https://www.yogonet.com/international/news/2026/07/02/125190-infingame-and-the-playa-highlight-growing-role-of-ai-recommendation-systems-in-igaming-retention-strategies

The architectural shift underneath **[C]**: personalisation has moved from matrix-factorisation collaborative filtering to **sequence models consuming recent player event history** — the same pattern powering TikTok/Spotify recommendations, made tractable by the small catalogue size (a few thousand games rather than millions of items). Explainability layers are becoming permanent rather than temporary, driven by regulatory pressure over automated problem-gambling detection.

---

## 7. Crash, instant-win and the "next slot"

### 7.1 Aviator's claimed scale — all company-reported

Every figure below originates from Spribe and **none is independently audited**. The trajectory is not in dispute; the precision is. **[C]**

| Metric | Value |
|---|---|
| Monthly active players | **77m+** (early–mid 2026), from ~5m (2022) → ~35m (2024) → 42m → 77m |
| Bets per minute | 400,000+ |
| Claimed share of global crash market | **~90% (Spribe says "to be precise, 92%")** |
| Operator integrations | 6,000+ across 60+ countries |
| Bets per month (Oct 2025) | 17.4bn |
| Wagered in a single December | >$14bn |
| Company valuation | >€1.2bn |
| Published RTP | **97%** |

⚠️ **Source conflict on total 2025 volume:** SOFTSWISS's knowledge base states Aviator processed **€160 billion** in total play volume in 2025; europeangaming.eu states **€160 million** for the same period, "up from an estimated €40–70 million in 2023." These differ by three orders of magnitude and cannot both be right. **Do not use either without resolving it.**

**Independently observable Aviator facts [A]/[B]:**
- The **UKGC suspended Spribe OÜ's licence on 30 October 2025** over hosting-requirement non-compliance and **lifted it on 30 March 2026**. Aviator has not returned to UK-regulated platforms since.
- Blask measured Aviator at **over 40% of crash traffic in Brazil** (June 2025), outperforming its nearest competitor by 2×+ on Visibility Score.
- Blask's casual-genre tracking across 28 regulated markets: **Aviator leads the entire dataset at 748 brands** — more than any other casual title in any genre.
- Aviator won Blask's **Global Crash Game of the Year 2025**.

### 7.2 Genre leadership across casual formats (Blask, 28 markets, 30-day window) [B]

| Genre | Leader | Margin over #2 | Notes |
|---|---|---|---|
| Crash | **Aviator** (Spribe) | Leads all genres at 748 brands | Pragmatic holds 3 of crash's top 5 |
| Mines | **Mines** (Spribe) | **+41%** over Hacksaw's Mines Supreme | |
| Dice | **Dice** (Spribe) | **+28%** over Evolution's Lightning Dice | |
| Instant win | **Booming Games** title | — | Largest catalogue by count: **739 titles tracked**, yet its leader reaches fewer brands than any of the top three crash titles |

Source: https://next.io/news/casino/blask-top-games-across-casual-genres/

Spribe tops three of the four casual genres. The instant-win finding is the interesting one: **genre size and distribution do not move together** — the most crowded catalogue has the weakest leader.

### 7.3 Crash's actual revenue weight vs. its narrative weight

| Metric | Value | Tag |
|---|---|---|
| Crash as share of **European** digital casino GGR | **~1.1%** (≈€2.56bn) | [B] |
| Crash as share of games offered, LatAm (Q2 2024) | 3.9% | [B] |
| Crash as share of games offered, Europe | ~1% | [B] |
| Crash's rank by GGR on SOFTSWISS network | **#3**, after slots and live casino | [B] |
| Reported GGR uplift for operators adding Aviator | **≥10%** | [C] |
| Crypto-casino "originals" (crash, Plinko, Mines, dice, Limbo, Hi-Lo, wheel) as share of all wagers | **~38% in 2026**, from under 15% in 2020 | [D] |
| Share of crash traffic from platforms launched in 2025 | 33% | [C] |

**The framing that matters for your report:** crash is a *distribution and engagement* phenomenon far more than a revenue one in mature European markets — 1.1% of GGR. Its real weight is in Africa, LatAm, India and the CIS, and in the under-35 demographic that slots convert poorly. It should be positioned as a **portfolio-diversification and acquisition product**, not a slots replacement.

### 7.4 Crypto originals: the RTP inversion

Instant-win originals run at radically higher RTP than slots, which is the core of their appeal to high-volume players **[B]/[C]**:

| Game | Provider | Published RTP | Provably fair? |
|---|---|---|---|
| BGaming Plinko | BGaming | **99%** | Yes |
| Stake Originals Plinko | Stake | **99%** | Yes |
| BC.Game Originals Plinko | BC.Game | 99% | Yes |
| Crash / Limbo / Hi-Lo (crypto originals, typical) | various | 99% | Yes |
| Dice (typical) | various | 99% | Yes |
| Mines (typical) | various | 97% (99% at high mine counts) | Yes |
| Pragmatic Plinko+ (Jul 2025, regulated markets) | Pragmatic Play | 97.50%, 1,000x max | No |
| Spribe Plinko | Spribe | 97% | Partial |
| Hacksaw Plinko | Hacksaw | ~97%, **7 operator-configurable tiers, lowest 88.20%** | No |
| Aviator | Spribe | 97.3% | Yes (SHA-512) |
| **Typical video slot** | — | **92–96%** | No (certified RNG) |

Sources: https://playplinko.com/rtp/ ; https://crashedge.com/games/plinko/ ; https://cryptocasinohouse.com/games/

**This is the strategic risk to slots that no one is pricing properly.** As UK and other taxed markets push slot RTP from 96% toward 92%, the crypto-originals category is publicly advertising 99% with cryptographic verification. The regulated slot product and the unregulated instant-win product are moving in opposite directions on the single metric a value-conscious player can compare.

### 7.5 The slot × crash hybrid frontier

Confirmed 2025–2026 releases and directions **[C]**:

- **Ready Play Gaming — *Blaz'n Buffalo Reel Crash*** (2026). First slot/crash hybrid using the studio's **Reel Overlay engine**: a full video slot runs *beneath* a crash round; winning spins add stars to the crash overlay; the player chooses when to cash out. Explicitly designed to *lengthen* sessions rather than compress them — COO Christoph Härtel: *"designed to keep players engaged for longer, not to burn through a session in seconds."*
- **Pragmatic Play** now runs a three-title crash portfolio — *Spaceman*, *Big Bass Crash*, *High Flyer* — plus *Chicken+* (2026), a step-ladder instant-win with four risk modes (Easy → Daredevil), 97–97.5% RTP and a 3,138,009x ceiling. *Big Bass Crash* adds a **50% partial cash-out**, importing a risk-management tool into the crash loop.
- **Multi-volatility configuration**: crash titles increasingly ship with operator-selectable volatility curves — low-volatility for new-player campaigns and cautious markets, high-volatility for VIP and loyalty segments, within the same mechanic.
- **Evolution launched two new in-house RNG studios in 2025** — **Sneaky Slots** (character-driven) and **Tap-A-Roo**, described in the annual report as *"a faster-paced RNG format for shorter play sessions"* **[A]**. When the largest live-casino company in the world builds a studio specifically for short sessions, that is a strong signal about where attention economics are heading.
- **ELK Studios — *Pirots 5*** (July 2026): Egyptian theme, 6×6 grid expanding to 8×8, CollectR engine, medium-high volatility, 10,000x max, top RTP config 96%. Notably, ELK is scaling by **re-theming a mechanic platform** rather than inventing new ones — the same strategy Pragmatic runs with Big Bass.
- **Hacksaw's OpenRGS** third-party platform: **8 third-party studios live by end-2025**, contributing **46 of the 91 titles Hacksaw shipped in 2025** **[A]**. This is the "mechanics-as-a-platform" model in practice.

### 7.6 Sweepstakes / social casino

| Metric | Value | Tag |
|---|---|---|
| Eilers & Krejcik 2026 forecast (net revenue) | **$3.6bn**, down ~$1bn from 2025 | [B] |
| Estimated 2025 net revenue | ~$4.6bn | [B] |
| Blask 2026 estimate | $7.2bn (definitional difference — likely gross/other basis) | [B] |
| 2024 gross player spend on coin packages | $10.6bn | [C] |
| 2024 net revenue after prizes | $3.4bn | [C] |
| States banning sweepstakes in 2026 | **6** — California, Indiana, Maine, New York, Louisiana, Tennessee | [B] |
| California's prior share of the US sweeps market | **17–20%** (E&K) | [B] |
| Blask Index change in remaining 44 states after the bans | **+~20%** | [B] |
| VGW market share trajectory | >90% → ~50%, with 25+ new operators entering in 2025 | [C] |

⚠️ The $3.6bn and $7.2bn figures are **not reconcilable** and almost certainly measure different things (net operator revenue vs. gross or index-derived). Present them separately with their definitions, never as a range.

---

## 8. Supplier financials — the hard numbers

### 8.1 Hacksaw Gaming FY2025 (Nasdaq Stockholm: HACK) [A]

| Metric | FY2025 | FY2024 | Change |
|---|---|---|---|
| Total revenue | **€197.5m** | €137.1m | **+44%** (+48% constant currency) |
| Adjusted EBIT | €161.4m | €116.1m | +39% |
| Adjusted EBIT margin | **82%** | 85% | −3pp |
| Net profit | €142.8m | €109.4m | +31% |
| Operating cash flow | €152.1m | €100.7m | +51% |
| Year-end cash | €133.2m | €93.8m | +42% |
| **Average daily rounds played** | — | — | **+58%** |
| Top 10 games as % of GGR (full year) | **44%** | 52% | −8pp |
| Top 10 games as % of GGR (Q4) | 43% | 57% | −14pp |
| Largest client as % of revenue | 13% | 20% | −7pp |
| In-house titles released | 45 | 37 | +8 |
| Third-party (OpenRGS) titles released | 46 | 24 | +22 |
| Total portfolio | **293** | 203 | +90 |

Q4 2025 alone: revenue €55.1m (+26%), adjusted EBIT €45.0m (+28%), margin 82%.
No country represented more than 10% of bets placed over the full year.
Long-term targets: >30% annual revenue growth, >80% adjusted EBIT margin — both met.
Hacksaw's own estimate of its share of the global online slots market: **below 5%**, in a market it says has **grown ~24% annually on average** in recent years.

Sources: https://www.hacksawgroup.com/en/wp-content/uploads/sites/2/2026/02/year-end-report-2025.pdf ; https://www.hacksawgroup.com/en/wp-content/uploads/sites/2/2021/10/annual-report-2025.pdf

**The diversification story is the important one.** Hacksaw halved its top-10 concentration (57% → 43% in Q4) while growing 44%. For a studio whose brand was built on a handful of streamer-famous titles (*Wanted Dead or a Wild*, *Le Bandit*, *Chaos Crew*), that is the transition from hit-driven to catalogue-driven.

### 8.2 Evolution AB FY2025 [A]

| Metric | FY2025 | FY2024 | Change |
|---|---|---|---|
| Net revenue | €2,066.5m | €2,063.1m | +0.2% |
| — Live | €1,772.6m | €1,775.7m | −0.2% |
| — **RNG (slots)** | **€294.0m** | €287.4m | **+2.3%** |
| Q4 Live | €438.6m | €459.4m | −4.5% |
| Q4 RNG | €75.7m | €74.4m | +1.7% |
| Share of platform GGR from mobile | **74.0%** | — | — |

RNG brands: NetEnt, Nolimit City, Red Tiger, Big Time Gaming, plus new 2025 in-house studios Sneaky Slots and Tap-A-Roo.
Nolimit City earn-out payment of €11.2m made in Q2 2025. BTG earn-out extended to 2031, liability reduced by €51.7m (booked as other operating revenue), remaining NPV €51.6m.

Source: https://www.evolution.com/wp-content/uploads/2026/04/Annual_Report_English_2026_04_01.pdf

**Note the divergence:** Evolution's RNG division grew 2.3% while Hacksaw grew 44%. Slot-content market share is moving decisively toward independent, high-velocity studios and away from the consolidated portfolio houses.

### 8.3 Market-level context [A]

| Market | 2025 figure | Growth |
|---|---|---|
| **US iGaming (7 states)** | **$10.73bn** | **+27.6%** |
| — Pennsylvania | $3.46bn | ~+28% |
| — Michigan | ~$3.1bn | — |
| — New Jersey | $2.91bn | — |
| — MI+NJ+PA combined | ~90% of national total | — |
| **Ontario (CY2025)** | **CA$4.04bn** GGR on CA$98.3bn wagers | +34% GGR, +26% handle |
| — Ontario casino GGR | ~CA$3.15bn (75% of total) | — |
| — Ontario Dec 2025 (record month) | CA$9.5bn handle, CA$425.4m revenue | — |
| **Sweden** | SEK 28,196m total; commercial online + betting SEK 18,412m (65%) | +1% total |
| **Denmark** | DKK 11.5bn total; online casino DKK 4.31bn (38%) | −1% total; +12.1% online casino |
| **UK online slots (Q4 FY25/26)** | £773m | +12% |

In both Pennsylvania and New Jersey, **annual iGaming revenue surpassed land-based commercial casino revenue for the first time in 2025** **[A]** (AGA State of the States 2026). Ontario reports **83.7% channelisation** to regulated sites (third annual IPSOS study), though 20.2% of regulated-site players also use unregulated sites **[A]**.

---

## 9. Chart-ready data appendix

### 9.1 UK slots quarterly series (all [A])
```
Quarter        GGY(£m)  Spins(bn)  Actives(m)  Sessions(m)  Spins/sess  GGY/sess(£)  AvgSess(min)  %>1hr
Apr–Jun 2025     745      24.4        4.4          189          129         3.95          16         ~5.0
Jul–Sep 2025     747      24.4        4.4          188          130         3.96          16         ~5.0
Oct–Dec 2025     788      25.7        4.6          201          128         3.91          16          4.4
Jan–Mar 2026     773      25.1        4.8          202          124         3.82          15          4.4
```

### 9.2 Slots share of online casino GGR by market
```
Denmark 2025              82%   [A]
Pennsylvania Jul 2025   81.6%   [A]
Pennsylvania Sep 2025   77.6%   [A]
Michigan 2025            ~73%   [C]
SOFTSWISS network 2023  85.6%   [B]  (share of all GGR incl. non-casino verticals)
```

### 9.3 Mobile share of gambling revenue
```
Evolution platform 2025          74.0%   [A]
Denmark all online 2025            73%   [A]
Denmark online casino 2025         69%   [A]
Europe (EGBA/H2 2024)              58%   [C]
Sweden: mobile-only players        40%   [B]
```

### 9.4 Twitch Slots category, trailing 365 days to 28 Jul 2026 [B]
```
Hours watched      121.5m   +39.5%
Hours streamed     649.3k   -11.5%
Average viewers     13.9k   +39.5%
Average channels       74   -10.8%
Viewer ratio        187.1   +57.5%
Peak viewers          93k   +52.6%
Unique streamers    23.9k   -13.2%
```

### 9.5 UK deployed RTP vs provider maximum (selected, [B])
```
Big Bass Reel Repeat        96.51 -> 92.01   (-4.50pp)
Big Bass Splash 1000        96.52 -> 92.02   (-4.50pp)
Big Bass Christmas Frozen   96.07 -> 92.07   (-4.00pp)
Big Bass Bonanza 1000       96.51 -> 94.51   (-2.00pp)
Bigger Bass Splash          96.50 -> 94.50   (-2.00pp)
Book of Dead                96.21 -> 94.25   (-1.96pp)
Big Bass Splash             96.71 -> 95.67   (-1.04pp)
Money Train 4               96.40 -> 96.10   (-0.30pp)
```

### 9.6 #1 slot by market, June 2026 (bet365 operator data, [B])
```
United Kingdom   Gold Cash Freespins            Inspired Entertainment
Germany          Legacy of Dead                 Play'n GO
Spain            Eye of Horus                   Reel Time Gaming / Merkur
Greece           Stacked Fire 7's               -
Brazil           Gates of Olympus               Pragmatic Play
Canada           Area Link Phoenix Firestorm    Games Global
Ontario          Area Link Phoenix Firestorm    Games Global
Michigan         Hypernova Megaways             ReelPlay
New Jersey       Triple Diamond                 IGT
Pennsylvania     Mad Mad Monkey                 Games Global
Brazil (crash)   Aviator                        Spribe
```

### 9.7 Supplier share of the visible shelf, top 100 ([B])
```
UNITED STATES (iGamingCompass, Jun 2026, 76 licensed sites)
IGT                 15      Red Tiger            5
Light & Wonder      12      Reel Play            4
Inspired Gaming      8      Hacksaw Gaming       4
Playtech             6      Design Works         3
Blueprint Gaming     6      Play'n GO            2
AGS                  5      Slingshot            2
NetEnt               5      Aristocrat           2
                            21 others            1 each
Pragmatic Play: ABSENT from the US top-100 supplier table

GERMANY (iGamingCompass, Jun 2026, all licensed .de lobbies)
Pragmatic Play      24      Reel Time Gaming     5
Play'n GO           17      Peter & Sons         4
Greentube           12      Push Gaming          2
Merkur               7      Playson              2
Edict                6      Novomatic            2
Gamomat              6      8 others             1 each
Reel Kingdom         5
```

### 9.8 Germany top 20, casinos carrying each title (Jun 2026, [B])
```
 1 Legacy of Dead              Play'n GO         56
 2 Book of Dead                Play'n GO         51
 3 Big Bass Bonanza            Pragmatic Play    54
 4 Big Bass Splash             Reel Kingdom      47
 5 Lucky Pharaoh Wild          Merkur            44
 6 Book of Ra                  Greentube         47
 7 Tizona                      Edict             46
 8 Eye of Horus                Merkur            41
 9 Book of Ra Magic            Greentube         44
10 Razor Shark                 Push Gaming       37
11 Gates of Olympus            Pragmatic Play    35
12 Fire Joker                  Play'n GO         36
13 Luxor Gold: Hold and Win    Playson           31
14 Robin Sherwood Marauders    Peter & Sons      27
15 Johnan Legendarian          Peter & Sons      26
16 El Torero                   Reel Time Gaming  29
17 Gold Cup Power Spins        Edict             28
18 Zentaurus                   Merkur            31
19 Book of Ra deluxe 6         Greentube         29
20 Madame Destiny Megaways     Pragmatic Play    30

Note: rank is distribution x lobby prominence, so carriage count alone
does not reproduce the ordering (e.g. #3 is carried by more casinos than #2).
```

### 9.9 Market structure and coverage constants ([B])
```
bet365 rankings:  7,500+ games, 20 markets, monthly since Feb 2026
Blask Global Games: 26,000+ titles, 17 countries (25 and 28 cited elsewhere - check vintage)
iGamingCompass US:  76 licensed sites, 7 states (NJ 25, PA 23, MI 14, WV 10, DE 3, CT 2, RI 1)
iGamingCompass DE:  95 licensed .de brands run by 31 operating companies
                    SkillOnNet operates ~37 brands (~40% of German storefronts)
SlotCatalog:        ~45,000-51,000 titles, 1,000-1,199 providers, 50+ markets
eGaming Monitor:    90,000+ games, 5,000+ operators
SlotsRank Q1 2026:  3,844 games across 12,999 pages
US top 100 churn:   48 of 100 brand new in Jun 2026 (partly panel growth 49 -> 75 sites)
Lobby placement premium: 4x new players, 3x engagement (vendor-reported [C])
```

### 9.10 Bonus-buy regulatory status (see §4.1 for evidence)
```
BANNED (verified):        UK, Netherlands, Germany
BANNED (broader ban):     Belgium (all bonuses since 2020)
CONSTRAINED, NOT BANNED:  Spain (DGOJ bet-limit + disclosure, 2022)
PATCHY / NOT A BAN:       Italy (availability varies by operator/title)
PERMITTED (evidenced):    Slovakia, Romania, Malta, Ontario, New Jersey, Estonia, Curacao
UNRESOLVED:               Sweden (sources directly contradict)
```

---

## 10. What I could not verify — gaps to flag or commission

1. **Bonus-buy share of slot GGR.** No credible public figure exists. The circulating "15–25%" has no named source. This is the single biggest data gap relative to the brief.
2. **Sweden's bonus-buy legal status.** Swedish-language sources directly contradict one another and I found no primary Spelinspektionen instrument. Needs a direct regulator query.
3. **Italy's position on feature buy.** No ADM prohibition located. The brief's assumption appears wrong but I cannot prove a negative from public sources.
4. **Complete SlotCatalog mechanic counts.** The public feature index is Cloudflare-protected past the first render; I retrieved roughly A–F only. Hold & Win, Megaways, Infinity Reels and cluster-variant counts are missing. SlotCatalog sells API/data access — worth buying for a definitive supply-side prevalence table.
5. **Eilers & Krejcik full rankings.** The OGPD and Eilers-Fantini reports are $500 each and paywalled; I only have the public abstracts. **These are the highest-value purchase for this report** — they contain the actual game-by-game GGR rankings by region and the 80-attribute performance analysis.
6. **EGR Slots Tracker full tables.** Subscriber-only. I have the headline #1–#3 positions but not the full top-20 or the underlying eGaming Monitor index values.
7. **bet365's report in primary form.** The monthly Gaming Insights and Performance microsite (https://releasd.com/pages/NCe-ha7Dkvxt75buSAFDWnd0wpqfWAb02NS4ZTwnnQo=) is JavaScript-rendered and returned no text to automated retrieval, so every bet365 figure in §5.4 is second-hand via trade press — which means I have full top-tens only for New Jersey, and top-fives elsewhere. The reports are **free and public**: open them in a browser and transcribe the complete top-tens for all 20 markets. This is the cheapest high-value data acquisition available for this report, it back-fills to February 2026, and it continues monthly. Alberta joins from roughly September 2026.
8. **bet365's ranking weights.** The composite of "revenue, stakes, sessions and engagement" is published without weights, so a title may rank on volume rather than yield. Worth asking bet365's press office directly before treating the leaderboard as a revenue proxy.
9. **iGamingCompass panel-growth distortion.** Its US panel grew from 49 to 75 casinos between May and June 2026, so June's "48 new entries" and the largest rank jumps are partly an artefact of coverage. The publisher discloses this; carry the caveat if you plot month-on-month movement.
10. **Blask country coverage.** Cited variously as 17, 25 and 28 markets across three 2025–26 sources. Probably different products or vintages, but pin it down before quoting a coverage figure.
11. **Aviator's 2025 total wagering volume.** Two sources differ by a factor of 1,000 (€160bn vs €160m). Unresolvable from public sources.
12. **Nolimit City max wins.** Affiliate sources conflict badly — e.g. one gives *Mental* as 250,000x, another as 50,000x. Nolimit City's own game pages are JavaScript-rendered and did not return data. Verify each title against the provider's own info panel before publishing.
13. **"Megaways = 30% of slot activity in UK/Sweden/Malta."** Widely repeated, unverifiable, and inconsistent with the 2–3% supply share. Recommend excluding.
14. **Session-length YoY comparability in UKGC data.** The Commission itself warns that some operators changed methodology mid-series. GGY and spins are clean; session metrics carry a caveat. Also note the May 2026 release was the **final** publication of this dataset.

---

*Compiled July 2026. All URLs retrieved and verified as live at time of compilation. Figures tagged [A] are traceable to statutory regulators or filed company accounts; [B] to named commercial datasets; [C] to company-reported or single-source trade press; [D] to sources with no verifiable methodology.*
