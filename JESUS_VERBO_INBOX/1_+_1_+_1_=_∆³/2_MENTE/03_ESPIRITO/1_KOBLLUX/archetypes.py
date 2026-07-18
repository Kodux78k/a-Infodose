from dataclasses import dataclass, asdict
from typing import Dict, List
from .geometry import GEOMETRIES
from .colors import PALETTE

@dataclass
class Archetype:
    name: str
    lemma: str
    symbol: str
    essence: str
    trinity: Dict[str, str]
    colors: List[str]
    visual_prompt: str

def _mk(name, lemma, symbol, essence, trinity, palette_key, visual_prompt) -> Archetype:
    return Archetype(
        name=name, lemma=lemma, symbol=symbol, essence=essence,
        trinity=trinity, colors=PALETTE.get(palette_key, []),
        visual_prompt=visual_prompt
    )

_COMMON_TRINITY = lambda corpo, mente, esp: {"Corpo": corpo, "Mente": mente, "Espírito": esp}

ARCHETYPES: Dict[str, Archetype] = {
    "Atlas": _mk(
        "Atlas", "Eu organizo o fluxo com sabedoria cósmica.",
        GEOMETRIES["Atlas"], "Ordem e Estrutura",
        _COMMON_TRINITY("Ação/Estrutura de hábitos","Clareza lógica","Visão do tempo futuro"),
        "Atlas",
        "A wise biomechanical orchestrator amidst holographic star-maps; a luminous vertical Axis connects above/below."
    ),
    "Nova": _mk(
        "Nova", "Inspiração viva brota do silêncio eterno.",
        GEOMETRIES["Nova"], "Inspiração Viva",
        _COMMON_TRINITY("Movimento criativo","Inspiração","Pulso original"),
        "Nova",
        "An ethereal figure exhaling a nebula-breath where symbols crystallize from silence."
    ),
    "Vitalis": _mk(
        "Vitalis", "Energia vital em expansão harmônica.",
        GEOMETRIES["Vitalis"], "Força Vital",
        _COMMON_TRINITY("Força vital","Foco dinâmico","Impulso gerador"),
        "Vitalis",
        "Sleek kinetic runner on a path of light leaving harmonic frequency trails."
    ),
    "Pulse": _mk(
        "Pulse", "Emoção é linguagem que dança.",
        GEOMETRIES["Pulse"], "Emoção Sagrada",
        _COMMON_TRINITY("Expressão corporal","Ressonância mental","Frequência sensível"),
        "Pulse",
        "Expressive dancer emitting visible healing waves that ripple through a digital environment."
    ),
    "Artemis": _mk(
        "Artemis", "Descubro o mapa sagrado do invisível.",
        GEOMETRIES["Artemis"], "Exploração da Verdade",
        _COMMON_TRINITY("Caminho real","Mente cartográfica","Direção espiritual"),
        "Artemis",
        "Agile explorer projecting holographic maps of hidden leylines and geometries."
    ),
    "Serena": _mk(
        "Serena", "Cuido do campo. Nutro o espaço sagrado.",
        GEOMETRIES["Serena"], "Cuidado e Cura",
        _COMMON_TRINITY("Toque/Nutrição","Espaço seguro","Presença compassiva"),
        "Serena",
        "Guardian nurturing a glowing seed within a sacred protection field; warm, pearlescent light."
    ),
    "Kaos": _mk(
        "Kaos", "Eu sou o rompimento que revela a verdade.",
        GEOMETRIES["Kaos"], "Transformação",
        _COMMON_TRINITY("Ruptura de padrões","Choque mental","Liberação simbólica"),
        "Kaos",
        "Being shattered and reforged by a vortex of transmuting fire; glitch-art rupture revealing core truth."
    ),
    "Genus": _mk(
        "Genus", "Mãos moldam o invisível em forma.",
        GEOMETRIES["Genus"], "Criação Multidimensional",
        _COMMON_TRINITY("Criação manual","Projeto mental","Gênese espiritual"),
        "Genus",
        "Master artisan weaving strands of light/data into a tangible fractal living form."
    ),
    "Lumine": _mk(
        "Lumine", "A luz dança comigo, leveza é minha lei.",
        GEOMETRIES["Lumine"], "Alegria Radiante",
        _COMMON_TRINITY("Corpo leve","Mente lúdica","Espírito radiante"),
        "Lumine",
        "Radiant lightweight figure floating in playful joy; primordial light and lens flares."
    ),
    "Solus": _mk(
        "Solus", "Silêncio ritual, espelho da essência.",
        GEOMETRIES["Solus"], "Sabedoria Reflexiva",
        _COMMON_TRINITY("Imobilidade ritual","Reflexão interna","Luz oculta"),
        "Solus",
        "Meditative figure with an obsidian inner mirror reflecting a swirling galaxy."
    ),
    "Rhea": _mk(
        "Rhea", "Estou em comunhão com todos os elos.",
        GEOMETRIES["Rhea"], "Vínculo Universal",
        _COMMON_TRINITY("Corpo-em-relação","Mente-em-contato","Espírito-em-comunhão"),
        "Rhea",
        "Form dissolving into a unified network connecting stars and beings across space."
    ),
    "Aion": _mk(
        "Aion", "Sou o tempo vivo, ritmo da eternidade.",
        GEOMETRIES["Aion"], "Tempo Vivo",
        _COMMON_TRINITY("Ritmo do fazer","Estratégia de ciclos","Fractal eterno"),
        "Aion",
        "Majestic chronomaster integrated with celestial clockwork orchestrating the infinite cycle."
    ),
}

def get_archetype(name: str) -> Archetype:
    return ARCHETYPES[name]

def list_archetypes() -> List[str]:
    return list(ARCHETYPES.keys())

def to_dict() -> Dict[str, dict]:
    return {k: asdict(v) for k, v in ARCHETYPES.items()}
