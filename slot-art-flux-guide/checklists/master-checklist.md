# Master checklist — Slot art FLUX LoRA

Tick items as you finish them. Do not jump phases unless a note says you can.

---

## Phase 0 — Orientation

- [ ] Read `START-HERE.md`
- [ ] I understand LoRA = style plug-in, not a whole new model
- [ ] I understand train on **base**, generate with **distilled + LoRA**

## Phase 1 — Goal

- [ ] Chose one first project (symbols recommended)
- [ ] Wrote one goal sentence
- [ ] Chose a unique trigger word
- [ ] Listed top 3 quality rules
- [ ] Listed 3 things the LoRA should NOT do

## Phase 2 — Dataset

- [ ] Collected 15–40 consistent images (ideally 25–40)
- [ ] Cropped / cleaned / simply renamed
- [ ] Confirmed rights to train on every image
- [ ] Put images in `dataset/01-symbols/`

## Phase 3 — Captions

- [ ] Created matching `.txt` for every image
- [ ] Every caption starts with trigger word
- [ ] Used consistent symbol-type labels
- [ ] Spot-checked 5 random image/caption pairs

## Phase 4 — Setup

- [ ] Hugging Face account created
- [ ] Access token saved
- [ ] Accepted FLUX.2 klein base 4B license
- [ ] Chose Path L (local) or Path C (cloud)
- [ ] Trainer UI opens
- [ ] Tiny smoke test run starts

## Phase 5 — Train

- [ ] Training config uses base-4B
- [ ] Rank / steps / LR set to beginner values
- [ ] Sample prompts include trigger word
- [ ] Full training finished
- [ ] Checkpoints backed up
- [ ] Cloud machine stopped (if used)

## Phase 6 — Choose winner

- [ ] Fixed test prompt pack created
- [ ] Compared early / mid / late checkpoints
- [ ] Tuned LoRA strength
- [ ] Renamed best file clearly
- [ ] Wrote notes on strengths / weaknesses

## Phase 7 — Daily use

- [ ] Team knows trigger word + strength
- [ ] Prompt library started
- [ ] Human polish step exists before final assets
- [ ] Decided whether v2 / character LoRA is next

---

## Emergency “I’m stuck” shortcuts

| Problem | Try this |
|---|---|
| Don’t know what to train first | Symbols only |
| Don’t have a GPU | Cloud Path C |
| Out of memory | Rank 16, resolution 768 |
| Style too weak | Later checkpoint, higher strength, check trigger word in captions |
| Style too cloned | Earlier checkpoint, lower strength |
| Characters look wrong | Train a separate character LoRA later |
| Process feels overwhelming | Do only Phase 1–3 this week; setup/train next week |
