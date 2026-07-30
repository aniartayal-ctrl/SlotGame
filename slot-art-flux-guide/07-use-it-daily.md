# Phase 7 — Use it daily for slot production

Now the LoRA is a studio tool. Treat it like a junior artist who is strong on style and weak on judgment unless directed.

---

## Daily generation recipe

1. Load **FLUX.2-klein-4B**
2. Load your best LoRA
3. Set LoRA strength to your tested value (often ~0.8)
4. Always include your **trigger word**
5. Ask for one clear asset at a time
6. Generate a small batch (4–8), pick winners, then refine

### Good production prompt pattern

```
TRIGGER, [symbol type], [object], [materials/colors], centered square reel icon, glossy slot game art
```

Example:

```
slotartstyle, high pay symbol, golden scarab with turquoise inlay, centered square reel icon, glossy slot game art
```

---

## A practical studio workflow

### 1) Concept exploration
Use the LoRA to explore 20–40 options quickly for a new symbol set.

### 2) Art direction lock
Pick 5 winners. Write “must keep” notes (palette, outline, metal style).

### 3) Human polish
Have an artist clean edges, fix readability at small size, ensure regulatory/clear branding needs.

### 4) Engine packaging
Export final assets to your real slot pipeline sizes/formats.

**Important:** AI output is a draft accelerator, not automatic final compliance-ready art unless your process signs it off.

---

## Prompt do’s and don’ts

### Do

- One subject per image for reel symbols
- Repeat your style phrases consistently
- Specify “centered”, “square icon”, “dark background” if that is your standard
- Keep a shared prompt library for the team

### Don’t

- Ask for a full slot screenshot with 20 symbols in one go (split the work)
- Change the trigger word casually
- Mix 3 art directions in one prompt
- Expect perfect text rendering inside icons (add typography in design tools)

---

## Build a tiny prompt library

Create `prompt-library.md` for your team with sections:

- Wilds
- Scatters
- Low symbols
- High symbols
- Specials / bonus

Each entry = best prompt + recommended LoRA strength + example notes.

---

## When to train version 2

Train `symbols-v2` when:

- Your art direction changed
- The model keeps missing one important material (e.g. always wrong enamel)
- You now have 20+ new approved finals to teach it

Do not endlessly retrain for every tiny whim. Collect a batch of corrections, then train.

---

## Later upgrades (only after v1 works)

1. **Character LoRA** for the mascot
2. **Background LoRA** for bonus worlds
3. **UI chrome LoRA** for frames/buttons
4. A simple **frontend app in Cursor** that calls your local generator
5. Advanced “distillation” for speed/cost — only if you truly need it

Your original question about distillation: for slot art, **LoRA specialization** is the practical first mountain. Distillation is an optional later optimization.

---

## Hand-off checklist for a non-technical producer

Give your technical teammate:

- [ ] Best LoRA file
- [ ] Trigger word
- [ ] Best strength
- [ ] Prompt library
- [ ] Known failure cases
- [ ] License notes for the base model you used

---

## Done with the whole beginner journey when…

- [ ] You can generate on-brand symbol drafts on demand
- [ ] Your team knows the prompt recipe
- [ ] Final art still goes through human polish
- [ ] You know what LoRA v2 should improve next

If you want help next, ask Cursor to:

1. Build a simple local web UI for prompt → image
2. Turn your prompt library into a form with dropdowns (Wild / Scatter / Gem…)
3. Prepare a second dataset structure for characters
