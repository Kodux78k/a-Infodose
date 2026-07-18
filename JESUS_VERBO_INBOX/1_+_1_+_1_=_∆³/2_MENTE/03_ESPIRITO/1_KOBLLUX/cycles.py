from typing import List

def cycle_3_6_9(seed: str = "KOBLLUX") -> List[str]:
    steps = ["3: Início/Semente", "6: Raiz/Corpo", "9: Espírito/Conclusão"]
    return [f"{seed} :: {s}" for s in steps]

def spin(values: List[str]) -> List[str]:
    # Gira a lista (spin simbólico)
    if not values:
        return []
    return values[1:] + values[:1]

def triskelion(a: str, b: str, c: str) -> List[str]:
    # Tri-ritmo simples
    return [a, b, c, a, b, c]
