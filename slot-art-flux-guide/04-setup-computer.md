# Phase 4 — Set up your computer (1–3 hours)

This phase installs the tools. Go slowly. If something fails, stop and re-read the step — do not skip ahead.

There are **two paths**:

- **Path L — Local GPU** (you have a strong NVIDIA card at home/office)
- **Path C — Cloud GPU** (you rent a machine for ~1 hour of training)

Both paths use the same dataset and the same training idea.

---

## Path decision

Choose one:

### Path L if…
- You have NVIDIA GPU with about **24 GB VRAM** (ideal), or at least **16 GB** and patience
- You are okay installing software on your PC

### Path C if…
- Your laptop has no strong NVIDIA GPU
- You want the simplest first win and will pay a few dollars for a rental GPU

**Beginner recommendation:**  
If unsure, use **Path C for training**, keep your dataset on your normal computer, upload it to the rented machine, download the finished LoRA back.

---

## Shared Step A — Create a Hugging Face account

1. Go to https://huggingface.co/join and create an account.
2. After login, create an **Access Token**:
   - Click your profile → **Settings** → **Access Tokens**
   - Create a token with permission to download models
   - Copy it somewhere safe (password manager). You will paste it later.
3. Open the model page for training:
   - https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B
4. Click through any **license / agreement** buttons so downloads are allowed.

Also note the fast model you will use later for generating:

- https://huggingface.co/black-forest-labs/FLUX.2-klein-4B

Why two models?

- **base-4B** = teacher desk (training)
- **4B distilled** = fast production drawing (daily use with your LoRA)

---

## Shared Step B — Zip your dataset

On your computer:

1. Open `slot-art-flux-guide/dataset/01-symbols/`
2. Confirm every image has a matching `.txt`
3. Zip the folder as `01-symbols.zip`

You will upload this zip to the training machine (local folder or cloud).

---

# Path L — Local setup (home/office GPU)

## L1. Install the basics

Install these if missing:

1. **NVIDIA drivers** (from NVIDIA’s site for your GPU)
2. **Git** — https://git-scm.com
3. **Python 3.11** (recommended) — https://www.python.org/downloads/  
   During install on Windows: check **“Add python.exe to PATH”**

To test Python worked, open Terminal / PowerShell and type:

```bash
python --version
```

You should see something like `Python 3.11.x`.

## L2. Create a project folder

Example:

```text
C:\AI\slot-lora\
```

or on Mac/Linux:

```text
~/AI/slot-lora/
```

Copy your `01-symbols` folder into it, e.g.:

```text
C:\AI\slot-lora\dataset\01-symbols\
```

## L3. Install a trainer (recommended: AI Toolkit)

The friendliest popular option for FLUX LoRA training is **ostris AI Toolkit** (has a web UI form).

High-level install flow:

1. Open Terminal in your `C:\AI\slot-lora\` folder
2. Clone the toolkit repository (commands are on the project’s GitHub README):
   - Search GitHub for: `ostris ai-toolkit`
3. Follow that README’s install instructions exactly for your OS
4. Start the UI when the README says to
5. Open the local web page it prints (often something like `http://localhost:8675`)

If the toolkit README and this guide disagree on a command, **trust the toolkit README** for install commands — software versions change.

## L4. Log into Hugging Face on that machine

In the same terminal environment the trainer uses:

```bash
huggingface-cli login
```

Paste your token when asked.

(If `huggingface-cli` is not found, the toolkit README usually includes the equivalent login step.)

## L5. Smoke-test before real training

Before overnight/long runs:

1. Point the UI at **5 images only** (a tiny copy of your dataset)
2. Set very few steps (for example 50–100) just to confirm it starts, saves a file, and does not crash
3. If that works, stop it and proceed to the real run in Phase 5

---

# Path C — Cloud GPU setup (rented machine)

## C1. Pick a rental service

Common options people use for this kind of work:

- RunPod
- Vast.ai
- Similar GPU cloud hosts

Choose a machine with:

- NVIDIA GPU with **24 GB VRAM** if possible (RTX 4090 class is a common sweet spot)
- Enough disk for models (at least ~50–100 GB free is comfortable)

## C2. Start a template that already has AI tools

Many hosts offer templates like:

- “PyTorch + CUDA”
- “Diffusion / ComfyUI”
- “AI Toolkit”

Prefer a template that mentions **AI Toolkit**, **Diffusers**, or **PyTorch CUDA**.

## C3. Upload your dataset

Use the host’s file browser / SFTP / drag-and-drop to upload `01-symbols.zip`, then unzip it on the server.

## C4. Install or open AI Toolkit on the rented machine

Follow the same idea as Path L:

1. Install AI Toolkit per its README **on the rented machine**
2. Log into Hugging Face with your token
3. Do a tiny 50–100 step smoke test

## C5. Remember cloud costs

- Start the pod/machine only when ready to train
- Stop/destroy it when finished so you are not billed idle time
- Download your LoRA `.safetensors` file to your own computer before shutting down

---

## What “setup success” looks like

You can say yes to:

- [ ] Hugging Face account + token ready
- [ ] FLUX.2 klein base 4B license accepted
- [ ] Dataset zip prepared
- [ ] Trainer UI opens (local or cloud)
- [ ] Tiny smoke-test run starts without immediate crash

→ Next: `05-train-the-lora.md`
