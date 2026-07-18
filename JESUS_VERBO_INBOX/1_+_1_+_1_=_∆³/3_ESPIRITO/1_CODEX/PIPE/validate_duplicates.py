#!/usr/bin/env python3
import sys, json, collections, time
from pathlib import Path

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
log = sorted((root/"LOGS").glob("scan_*.jsonl"))[-1]
by_hash = collections.defaultdict(list)
for line in open(log, encoding="utf-8"):
    d = json.loads(line); by_hash[d["sha256"]].append(d)

dups = {h:files for h,files in by_hash.items() if len(files)>1}

# heurística 3-6-9: intenção (nome), integridade (metadados), valor (caminho)
weights = {"00_CORE":3, "PIPE":3, "UI":2}
report = []
for h, files in dups.items():
    # canônico: mais antigo (origem) com maior peso de caminho
    files_sorted = sorted(files, key=lambda f: (-(max((weights.get(Path(f["path"]).parts[-2],0)),0)), f["mtime"]))
    canon = files_sorted[0]
    variants = files_sorted[1:]
    report.append({"sha256":h,"canon":canon,"variants":variants})

out = root/"LOGS"/f"duplicates_{time.strftime('%Y-%m-%d_%H-%M-%S')}.json"
json.dump(report, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"OK · duplicatas em {out}")
