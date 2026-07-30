# Slot Game Art with FLUX — Start Here

**This folder is a beginner-friendly playbook.**  
You do **not** need to be a programmer. Follow the steps in order. When something is technical, it is written like a recipe: click this, paste that, wait for this.

---

## What you are building

You will teach an open AI image model (FLUX.2) to draw **in your slot-game art style**.

Think of it like this:

1. FLUX already knows how to draw almost anything (the “general artist”).
2. You give it a folder of your slot art (the “style homework”).
3. Training creates a small add-on file called a **LoRA** (like a style plug-in).
4. Later, when you generate images, you load FLUX + your LoRA and ask for things like:
   - “golden wild gem, slotartstyle”
   - “scatter coin, slotartstyle”
   - “Egyptian pharaoh character bust, slotartstyle”

You are **not** rebuilding the whole model. You are teaching it your look.

---

## Important words (plain English)

| Word | Meaning |
|---|---|
| **Model / weights** | The AI’s “brain” files you download |
| **Base model** | The version used for **learning** (slower, more flexible) |
| **Distilled model** | The version used for **fast drawing** after training |
| **LoRA** | A small style plug-in you train (usually tens of MB) |
| **Dataset** | Your collection of example images + short text descriptions |
| **Caption** | The text description next to each image |
| **Trigger word** | A made-up keyword (e.g. `slotartstyle`) that activates your style |
| **VRAM** | Memory on your graphics card (GPU). More VRAM = easier training |
| **Inference** | Generating a new image after training |

---

## What you need before Day 1

### Computer

- A Windows or Linux PC with an **NVIDIA graphics card**
- Ideally **24 GB VRAM** (e.g. RTX 4090).  
  **16 GB** can work with care.  
  **8–12 GB** is usually too tight for comfortable training (you can still *generate* with smaller setups later, or rent a cloud GPU for training).

If you do not have a strong GPU:

- You can still collect images and write captions on any computer.
- For the training step, rent a cloud GPU for about an hour (often cheap) using a service like RunPod, Vast.ai, or similar. The guide notes where that fits in.

### Accounts (free to create)

1. **Hugging Face** account — to download FLUX  
   https://huggingface.co/join
2. Accept the model license on the FLUX.2 klein base 4B page when you get there.
3. (Optional) **GitHub** account — only if a tool asks you to sign in.

### Your art

- Images you **own** or are **allowed** to train on (your studio art, commissioned art with rights, etc.).
- Do **not** scrape random casino games you do not own.

---

## The big picture (7 phases)

| Phase | What you do | Time (rough) | Guide file |
|---|---|---|---|
| 0 | Read this page + checklist | 20 min | You are here |
| 1 | Decide your art goal | 30–60 min | `01-decide-your-goal.md` |
| 2 | Collect & clean images | half day | `02-build-your-dataset.md` |
| 3 | Write captions | half day | `03-write-captions.md` |
| 4 | Set up the computer / tools | 1–3 hours | `04-setup-computer.md` |
| 5 | Train the LoRA | ~1 hour GPU time | `05-train-the-lora.md` |
| 6 | Test & pick the best version | 1–2 hours | `06-test-and-choose.md` |
| 7 | Use it for real slot work | ongoing | `07-use-it-daily.md` |

Also open:

- `checklists/master-checklist.md` — tick boxes as you go
- `captions-examples/` — copy-paste caption patterns
- `configs/` — ready-to-adapt training settings
- `dataset/` — put your images here (folders already named)

---

## What “success” looks like

After this process you should have:

1. A folder of prepared slot art + captions  
2. One (or a few) `.safetensors` LoRA file(s)  
3. A simple prompt recipe that reliably produces symbols/characters in your style  
4. A short list of “do / don’t” prompts for your artists or producers  

---

## What we are *not* doing in this beginner path

- We are **not** building a full custom tiny model from scratch (“true distillation”).
- We are **not** training on copyrighted competitor assets.
- We are **not** expecting one LoRA to do everything perfectly on day one.

Start with **one style LoRA for symbols**. Add character LoRAs later.

---

## Your first action right now

1. Open `checklists/master-checklist.md`
2. Open `01-decide-your-goal.md`
3. Create a simple goal sentence like:

> “I want FLUX to generate square reel symbols in a glossy jeweled casino style matching our Lucky Nile set.”

Then continue to Phase 2.
