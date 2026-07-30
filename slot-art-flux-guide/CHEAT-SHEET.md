# One-page cheat sheet

## Goal
Teach FLUX your slot symbol style with a LoRA plug-in.

## Models
- Train on: **FLUX.2-klein-base-4B**
- Generate with: **FLUX.2-klein-4B + LoRA**

## Dataset
- 15–40 consistent symbol images
- Matching `.txt` captions
- Every caption starts with your trigger word

## Caption formula
```
TRIGGER, [symbol type], [object], [materials/colors], centered square reel icon
```

## Beginner train settings
- Rank: 32 (or 16 if low VRAM)
- LR: 0.0001
- Steps: 1800
- Save every: 250
- Resolution: 1024

## Pick the winner
- Test early / mid / late checkpoints with the same prompts
- Often mid checkpoint wins
- Tune LoRA strength around 0.7–1.0

## Production rule
One clear asset per prompt → generate a batch → human polish → export to game pipeline

## Next LoRAs later
Characters → Backgrounds → UI chrome
