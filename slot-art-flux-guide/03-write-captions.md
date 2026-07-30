# Phase 3 — Write captions (half a day)

Captions teach the AI what each picture *is*.  
Your **trigger word** teaches the AI *which style* to use.

---

## The caption formula (memorize this)

```
[trigger word], [what it is], [important visual details], [composition]
```

### Example

```
slotartstyle, golden wild symbol, jeweled letter W with scarab wings, centered icon on dark velvet background, glossy casino game art
```

---

## Step 1: Create one `.txt` file per image

For `wild_01.png`, create `wild_01.txt` in the **same folder**.

Windows tip:

1. Right-click empty space in folder → New → Text Document
2. Name it exactly like the image, ending in `.txt`
3. Open it in Notepad and paste your caption
4. Save

Mac tip: TextEdit → plain text → same idea.

You can also copy the templates from:

`captions-examples/symbol-captions.md`

---

## Step 2: Always start with your trigger word

Every caption in this dataset should begin with the same trigger word you chose in Phase 1.

Example: `slotartstyle, ...`

If you forget it on half the images, the style becomes weaker and less reliable.

---

## Step 3: Be specific, but not poetic

### Good

```
slotartstyle, red ruby gem symbol, hexagonal cut, gold rim, soft studio lighting, centered square icon
```

### Too vague

```
nice gem
```

### Too novel-y

```
a breathtaking jewel that whispers ancient fortunes under moonlight...
```

The AI likes clear inventory language, not marketing copy.

---

## Step 4: Name the symbol type clearly

Use consistent labels across the set:

- `wild symbol`
- `scatter symbol`
- `bonus symbol`
- `low pay symbol`
- `high pay symbol`
- `fruit symbol`
- `gem symbol`
- `number seven symbol`

Consistency helps the model learn categories.

---

## Step 5: Mention only details that matter

Usually include:

- Main object
- Materials (gold, enamel, neon glass, wood, jade)
- Colors that define the brand
- Lighting style if consistent
- “centered”, “square icon”, “game UI symbol”

Usually skip:

- Long stories
- Studio gossip
- Exact hex codes unless you truly need them
- “8k, masterpiece, trending on artstation” spam

---

## Step 6: Caption templates you can copy

### Wild

```
TRIGGER, wild symbol, [describe mark], [materials/colors], centered square reel icon, glossy slot game art
```

### Scatter

```
TRIGGER, scatter symbol, [coin/orb/amulet details], [materials/colors], centered square reel icon, glossy slot game art
```

### Gem / fruit / royal

```
TRIGGER, [gem/fruit/royal] symbol, [shape and color], [materials], centered square reel icon, glossy slot game art
```

### Character bust (for later character LoRA)

```
TRIGGER, [character name] character bust, [hair/outfit/expression], facing camera, slot game character art
```

Replace `TRIGGER` with your real trigger word.

More ready-made examples: `captions-examples/symbol-captions.md`

---

## Step 7: Keep captions roughly similar length

Aim for **1–2 short sentences** (about 15–40 words).

If one caption is 8 words and another is 120 words, training gets noisier.

---

## Step 8: Optional helper — ask an AI to draft captions

If you use ChatGPT / Claude / Cursor later:

1. Show the image (or describe it carefully)
2. Paste:

> Write one plain caption for FLUX LoRA training. Start with trigger word `slotartstyle`. Describe the slot symbol objectively. No hype words. Under 40 words.

3. Then **edit** the result yourself. You are the art director.

---

## Step 9: Spot-check 5 random pairs

Pick 5 images and read their captions out loud.

Ask:

- Does the caption match what I see?
- Does every caption include the trigger word?
- Would another artist understand this caption?

Fix anything wrong.

---

## Done with Phase 3 when…

- [ ] Every image has a matching `.txt`
- [ ] Every caption starts with the trigger word
- [ ] Symbol types are named consistently
- [ ] Captions are clear and similar in length
- [ ] You did a 5-image spot check

→ Next: `04-setup-computer.md`
