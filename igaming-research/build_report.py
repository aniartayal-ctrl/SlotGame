#!/usr/bin/env python3
"""Inline data/dataset.json into report_template.html to produce index.html.

The dataset is inlined rather than fetched so the report opens straight from the
filesystem — browsers block fetch() over file:// URLs.
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent
data = json.loads((ROOT / "data" / "dataset.json").read_text())
template = (ROOT / "report_template.html").read_text()

PLACEHOLDER = "/*__DATA__*/{}"
if PLACEHOLDER not in template:
    raise SystemExit("placeholder /*__DATA__*/{} not found in report_template.html")

html = template.replace(PLACEHOLDER, json.dumps(data, ensure_ascii=False, separators=(",", ":")))
out = ROOT / "index.html"
out.write_text(html)
print(f"index.html written — {len(html):,} bytes, {len(data)} data blocks inlined")
