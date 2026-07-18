#!/usr/bin/env python3
import os, sys, json, hashlib, time
from pathlib import Path

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
stamp = time.strftime("%Y-%m-%d_%H-%M-%S")
out_dir = root / "LOGS"; out_dir.mkdir(parents=True, exist_ok=True)
jsonl = out_dir / f"scan_{stamp}.jsonl"

def sha256(p: Path):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for b in iter(lambda: f.read(1024*1024), b''): h.update(b)
    return h.hexdigest()

with open(jsonl, "w", encoding="utf-8") as w:
    for p in root.rglob("*"):
        if p.is_file():
            st = p.stat()
            item = {
              "path": str(p), "size": st.st_size,
              "mtime": int(st.st_mtime), "sha256": sha256(p),
              "name": p.name, "ext": p.suffix.lower()
            }
            w.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"OK · inventário em {jsonl}")
