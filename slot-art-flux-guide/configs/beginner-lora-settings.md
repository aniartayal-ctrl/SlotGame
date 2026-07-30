# Beginner LoRA settings (plain English)

These are starting values for a first **symbol style** LoRA on FLUX.2 klein base 4B.

| Knob | Suggested value | Plain English |
|---|---|---|
| Model | `black-forest-labs/FLUX.2-klein-base-4B` | The training brain |
| Method | LoRA | Teach with a small plug-in, not a full rewrite |
| Images | 15–40 | Quality over quantity |
| Resolution | 1024 | Square symbols work well here |
| Rank | 16 or 32 | Capacity of the plug-in; 32 is a strong default |
| Alpha | Often rank/2 (e.g. 16 if rank 32) | Scaling helper; follow your trainer defaults if unsure |
| Learning rate | 0.0001 (`1e-4`) | How fast it learns each step |
| Steps | 1500–2000 | Practice reps |
| Save every | 250–500 | Snapshots so you can pick the best |
| Batch size | 1 | Safer on home GPUs |
| Precision | bf16 | Better match for this model family when supported |
| Sample every | 250 | Preview images during training |

---

## If you run out of GPU memory

Try in this order:

1. Rank 16 instead of 32
2. Resolution 768 instead of 1024
3. Fewer sample previews
4. Rent a 24 GB cloud GPU

---

## If style is too weak after training

- Use a later checkpoint
- Raise LoRA strength at generation time (e.g. 0.9–1.0)
- Check that every caption included the trigger word
- Add 10–20 more highly consistent images and train v2

---

## If style is too strong / stuck / cloned

- Use an earlier checkpoint
- Lower LoRA strength (e.g. 0.6–0.75)
- Reduce steps next time
- Make sure dataset has enough variety of objects inside one style
