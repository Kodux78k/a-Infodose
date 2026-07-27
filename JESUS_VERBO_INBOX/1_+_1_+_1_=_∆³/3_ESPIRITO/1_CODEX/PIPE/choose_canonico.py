#!/usr/bin/env python3
import sys, json
from pathlib import Path

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
dup = sorted((root/"LOGS").glob("duplicates_*.json"))[-1]
data = json.load(open(dup, encoding="utf-8"))

index = {"canonicos":[], "variantes":[]}
for entry in data:
    index["canonicos"].append(entry["canon"]["path"])
    for v in entry["variants"]:
        index["variantes"].append({"path": v["path"], "of": entry["canon"]["path"]})

out = root/"LOGS"/"index_canonico.json"
json.dump(index, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"OK · índice em {out}")
