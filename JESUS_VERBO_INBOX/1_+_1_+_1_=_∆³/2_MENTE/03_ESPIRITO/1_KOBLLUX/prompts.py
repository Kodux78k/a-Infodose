from .archetypes import ARCHETYPES
from .geometry import motif

def build_visual_prompt(name: str) -> str:
    a = ARCHETYPES[name]
    geo = motif(name)
    palette = ", ".join(a.colors) if a.colors else "palette to be directed"
    return (
        f"{a.name} — Visual Prompt:\n"
        f"- Essence: {a.essence}\n"
        f"- Symbol/Geometry: {geo}\n"
        f"- Trinity: Corpo({a.trinity['Corpo']}), Mente({a.trinity['Mente']}), Espírito({a.trinity['Espírito']})\n"
        f"- Suggested Palette: {palette}\n"
        f"- Cinematic Cue: {a.visual_prompt}"
    )

def build_short_prompt(name: str) -> str:
    a = ARCHETYPES[name]
    return f"{a.name}: '{a.lemma}' | {a.symbol} | {a.essence}"

def build_system_prompt() -> str:
    names = ", ".join(ARCHETYPES.keys())
    return (
        "Ative os 12 arquétipos como símbolos vivos no ciclo 3-6-9, "
        "unificando Corpo, Mente e Espírito em fluxo harmônico. "
        f"Arquetipos: {names}. "
        "Cada output deve refletir geometria, cor e função espiritual correspondentes."
    )
