# FAQ — plain answers

## Do I need to be a programmer?
No. You need patience, a checklist, and either a strong NVIDIA GPU or a rented one for about an hour.

## Is this the same as “distilling” a model?
Not exactly. Distilling usually means making a model faster/smaller.  
What you are doing first is **specializing** with a LoRA (teaching your slot style). That is the useful first step for game art.

## Which FLUX version should I use?
For this beginner path:

- Train: `FLUX.2-klein-base-4B`
- Daily generate: `FLUX.2-klein-4B` + your LoRA

## Can I train on competitor slot screenshots?
Only if you have legal rights. If you do not own it / license it, do not use it.

## How many images do I need?
Start with 15–40 excellent, consistent images. More messy images are worse than fewer clean ones.

## How long does training take?
Often around an hour on a strong 24 GB card for a beginner LoRA setting. Cloud rentals can be similar.

## Will the AI replace my artists?
Treat it as a drafting accelerator. Final production art still needs human taste, readability checks, and pipeline polish.

## Why are my results inconsistent?
Common causes:

1. Trigger word missing from some captions
2. Mixed styles in one dataset
3. Too few images
4. Using the wrong checkpoint
5. LoRA strength too high or too low

## Can Cursor build the app part too?
Yes. After your LoRA works locally, Cursor can help build a simple website/app that sends prompts to your local generator and shows images. That is a separate project after Phase 7.

## What if I only have a Mac laptop with no NVIDIA GPU?
Do Phases 1–3 on the Mac. Rent a cloud NVIDIA GPU for Phases 4–5. Bring the LoRA file back to wherever you generate (or keep generating in the cloud).
