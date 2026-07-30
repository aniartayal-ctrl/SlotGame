# Phase 5 — Train the LoRA (~1 hour of GPU time)

This is the “oven” step. You load your images, press start, and wait.  
You are teaching FLUX your slot style.

---

## Before you click Start

Confirm:

- [ ] Dataset folder has matching image + `.txt` pairs
- [ ] Every caption starts with your trigger word
- [ ] You are training on **FLUX.2-klein-base-4B** (the base model, not the fast distilled one)
- [ ] You have enough disk space
- [ ] You know where output files will be saved

---

## The settings that usually work for beginners

Use these unless a trusted tutorial for your exact toolkit version says otherwise.

| Setting | Beginner value | Why |
|---|---|---|
| Base model | `FLUX.2-klein-base-4B` | Correct training target |
| Training type | LoRA | Small, fast, reversible |
| Resolution | 1024 | Good quality default |
| LoRA rank | 16 or 32 | 16 = simpler style; 32 = richer |
| Learning rate | `1e-4` (0.0001) | Common starting point |
| Steps | 1500–2000 | Enough for 15–40 images |
| Save every | 250 or 500 steps | So you can pick the best mid-run |
| Batch size | 1 | Safest on consumer GPUs |
| Mixed precision | bf16 if available | Better for FLUX family |

Plain English:

- **Rank** = how much style detail the plug-in can store
- **Steps** = how many practice reps the model gets
- **Learning rate** = how big each learning jump is
- **Save every** = take snapshots during cooking so you don’t only keep the overcooked version

---

## Step-by-step in the trainer UI (generic)

Different UIs look slightly different. Translate these labels to whatever you see.

1. **Create new job / new training config**
2. **Model:** choose or paste `black-forest-labs/FLUX.2-klein-base-4B`
3. **Dataset path:** point to your `01-symbols` folder
4. **Trigger / class word:** your trigger word (if the UI has a separate field)
5. **LoRA rank:** `32` for first serious style run (or `16` if VRAM is tight)
6. **Steps:** `1800`
7. **Sample prompts:** add 3 prompts that include your trigger word, for example:
   - `slotartstyle, golden wild symbol, jeweled W, centered reel icon`
   - `slotartstyle, turquoise scarab scatter symbol, centered reel icon`
   - `slotartstyle, red ruby gem symbol, gold rim, centered reel icon`
8. **Output folder:** somewhere obvious like `outputs/slot-symbols-v1/`
9. **Start training**

Watch the first few minutes:

- Loss numbers may bounce; that can be normal
- If it crashes instantly on “CUDA out of memory”, lower resolution to 768, lower rank to 16, or use a bigger GPU

---

## Ready-made config notes

See:

- `configs/beginner-lora-settings.md` — plain English explanation of every important knob
- `configs/example-ai-toolkit-notes.yaml` — example values you can adapt

Software config formats change. Treat YAML as a **checklist of values**, not a magic file that always pastes perfectly into every tool version.

---

## While it trains (what to do / not do)

### Do

- Let it run
- Glance at sample images if the trainer generates previews every N steps
- Keep the machine awake (disable sleep)

### Don’t

- Change settings mid-run
- Close the terminal window running the trainer
- Assume the final step is automatically the best

---

## Overfitting warning (plain English)

If late samples start looking like exact copies of your training images, or the model loses the ability to make *new* symbols and only repeats memorized ones, you trained too long or too hard.

That is why we save checkpoints every 250–500 steps. Often the best file is around **60–80%** of the way through, not 100%.

---

## When training finishes

You should have several files, often named like:

- `slot-symbols-v1-250.safetensors`
- `slot-symbols-v1-500.safetensors`
- ...
- `slot-symbols-v1-1800.safetensors`

Download / copy the whole output folder to a safe place:

```text
MySlotLoRAs/
  symbols-v1/
    checkpoints...
    sample images...
    notes.txt
```

In `notes.txt`, write:

- Date
- Trigger word
- Rank / steps / learning rate
- How many images
- Which game style this was for

---

## Cloud users — shutdown checklist

- [ ] Downloaded all `.safetensors` checkpoints
- [ ] Downloaded sample preview images
- [ ] Saved your notes
- [ ] Stopped / terminated the rented GPU

---

## Done with Phase 5 when…

- [ ] Training completed without a hard crash
- [ ] Multiple checkpoints saved
- [ ] Files are backed up on your computer
- [ ] You wrote basic training notes

→ Next: `06-test-and-choose.md`
