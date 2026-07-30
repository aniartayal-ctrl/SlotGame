# Phase 2 — Build your dataset (half a day)

This is the most important phase. Bad images = bad AI. Good images = magic.

---

## What a dataset is

A dataset is simply:

```
folder of images
+
a short text file for each image (caption)
```

Example:

```
01-symbols/
  wild_01.png
  wild_01.txt
  scatter_01.png
  scatter_01.txt
  gem_red_01.png
  gem_red_01.txt
```

The `.txt` file has the same name as the image.

---

## Step 1: Use the folders already created for you

Inside this project:

```
slot-art-flux-guide/dataset/
  01-symbols/      ← put symbol images here for first LoRA
  02-characters/   ← later
  03-backgrounds/  ← later
  04-ui-chrome/    ← later
```

For your **first** LoRA, only fill **`01-symbols/`**.

Leave the others empty until later.

---

## Step 2: Collect the right kind of images

### Ideal symbol images

- Square (or close to square)
- One main object, centered
- Similar lighting across the set
- Similar outline / material language
- Clean or simple background (transparent PNG is fine; solid dark is fine)
- High resolution (ideally 1024×1024 or larger; at least 512×512)

### Avoid

- Screenshots of whole slot screens with many symbols at once
- Tiny blurry icons
- Watermarked stock you don’t own
- Mixing 5 different art styles in one first LoRA
- Text-heavy marketing banners as “symbol examples”

---

## Step 3: Aim for variety *inside* one style

You want **same style**, **different objects**.

Good first pack for an Egyptian gold style:

- 5 wilds / specials
- 5 scatters / bonus icons
- 8 low symbols (A, K, Q, J, 10 or fruits/gems)
- 5 high symbols (scarab, eye, ankh, etc.)
- 5 props that share the look (coins, jars, keys)

Total: about **25–30** images.

If you only have one character and 3 symbols, wait and make more art first — or train a tiny character LoRA later, not a whole studio style yet.

---

## Step 4: Clean / normalize (simple version)

You do not need Photoshop mastery. Do what you can:

1. Crop so the symbol fills most of the frame with a little padding.
2. Remove random UI overlays, jackpot meters, “WIN” stamps.
3. Make backgrounds consistent if easy (all transparent, or all dark velvet).
4. Rename files simply:
   - `wild_01.png`
   - `scatter_02.png`
   - `gem_blue_03.png`
5. Prefer PNG or high-quality JPG.

Optional but helpful:

- Keep a spreadsheet with columns: filename | symbol type | notes

---

## Step 5: Legal / rights (non-negotiable)

Only use images if at least one is true:

- [ ] Your studio created them
- [ ] A contractor assigned you full rights / training rights
- [ ] They are licensed for AI training for your use case
- [ ] They are public domain / clearly open for this use

If unsure, do not use it.

---

## Step 6: Split “style pack” vs “everything pack”

For beginners:

**Pack 1 (now):** symbols only, one visual language  
**Pack 2 (later):** characters  
**Pack 3 (later):** backgrounds  

Mixing all three in one first LoRA often makes the model confused.

---

## Step 7: Quick quality audit

Open your folder and answer:

1. If I squint, do they look like the same game? **Yes / No**
2. Would a player recognize this as one brand? **Yes / No**
3. Are at least 20 images sharp and usable? **Yes / No**

If any answer is No, fix the set before training.

---

## Done with Phase 2 when…

- [ ] 15–40 (ideally 25–40) symbol images are in `dataset/01-symbols/`
- [ ] Files are simply named
- [ ] Style is consistent
- [ ] Rights are clear
- [ ] You are ready to write captions

→ Next: `03-write-captions.md`
