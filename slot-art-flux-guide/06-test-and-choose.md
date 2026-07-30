# Phase 6 — Test and choose the best LoRA (1–2 hours)

Training creates several versions. Your job now is art direction: pick the one that looks best for production.

---

## Step 1: Set up generation (inference)

You will generate with:

- **Model:** `FLUX.2-klein-4B` (the fast distilled one)
- **LoRA:** one checkpoint at a time from your training output

Why distilled for daily use?

- Faster
- Usually looks great with a LoRA that was trained on the base model

### Easiest beginner tools for generating

Pick one:

1. **ComfyUI** (very common for artists; node graph)
2. **Diffusers + a simple Gradio app** (more technical)
3. Your future custom frontend (later)

If you are non-technical, start with **ComfyUI** and a FLUX.2 klein workflow from a trusted recent guide / community template.

Wherever you generate:

1. Load FLUX.2 klein 4B
2. Load LoRA
3. Set LoRA strength around **0.7–1.0** to start (try 0.8)
4. Use few steps if using the distilled model (often around 4; follow the model card)

---

## Step 2: Make a fixed test prompt pack

Do **not** improvise differently for every checkpoint. Use the same prompts so comparisons are fair.

Create a text file: `test-prompts.txt`

Include at least:

### A) Something close to training data

```
TRIGGER, golden wild symbol, jeweled letter W, centered reel icon, glossy slot game art
```

### B) A mild variation (should still work)

```
TRIGGER, emerald wild symbol, jeweled letter W, centered reel icon, glossy slot game art
```

### C) A new symbol not in the dataset (true test)

```
TRIGGER, purple amethyst ankh symbol, gold trim, centered reel icon, glossy slot game art
```

### D) A tough composition check

```
TRIGGER, twin cherries fruit symbol, glossy enamel, centered reel icon, dark background
```

Replace `TRIGGER` with your real trigger word.

Generate each prompt at the **same seed** if your tool allows locking a seed. That makes visual comparison easier.

---

## Step 3: Compare checkpoints side by side

Test at least:

- Early (e.g. 500)
- Middle (e.g. 1000–1250)
- Late (e.g. 1500–1800)

Score each from 1–5 on:

| Criterion | What you’re judging |
|---|---|
| Style match | Does it look like your game? |
| Clean icon | Readable as a reel symbol? |
| Flexibility | Can it make new symbols, not only copies? |
| Materials | Gold/gem/neon look correct? |
| Consistency | Similar results across prompts? |

Often winners:

- Middle checkpoints for balance
- Late checkpoints if you needed stronger style lock (but watch for cloning)

---

## Step 4: Tune LoRA strength

For your favorite checkpoint, try strengths:

- 0.6
- 0.8
- 1.0

If style is weak → raise strength or use a later checkpoint.  
If images look crushed / overbaked / identical → lower strength or use an earlier checkpoint.

---

## Step 5: Pick a production winner

Rename/copy the winner to a clear name:

```text
slotartstyle_symbols_v1_best.safetensors
```

In notes, record:

- Checkpoint step number
- Best LoRA strength
- Trigger word
- What it is good at
- What it still fails at

Example:

> Best = step 1250 at strength 0.85. Great on gems/wilds. Weak on multi-object symbols. Do not use for characters.

---

## Step 6: Decide if you need a second LoRA

If characters look bad, that does **not** mean your symbol LoRA failed.

Make a separate character dataset later and train `characters-v1`.

Same for backgrounds.

---

## Done with Phase 6 when…

- [ ] You tested with a fixed prompt pack
- [ ] You compared at least 3 checkpoints
- [ ] You chose one production LoRA file
- [ ] You wrote notes on strength + strengths/weaknesses

→ Next: `07-use-it-daily.md`
