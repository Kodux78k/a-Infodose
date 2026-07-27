import json
from typing import List
from .archetypes import ARCHETYPES, to_dict

def narrar() -> List[str]:
    lines = []
    for name, a in ARCHETYPES.items():
        lines.append(f"{a.name}: '{a.lemma}' | Geometria: {a.symbol} | Essência: {a.essence}")
    return lines

def roda_viva() -> str:
    header = "=== Roda Viva dos 12 Arquétipos KOBLLUX ==="
    return header + "\n" + "\n".join(narrar())

def export_json(path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(to_dict(), f, ensure_ascii=False, indent=2)
