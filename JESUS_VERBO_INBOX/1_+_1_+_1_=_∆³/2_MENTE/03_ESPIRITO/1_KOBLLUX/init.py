"""
KOBLLUX — Roda Narrativa Geométrica Fractal (Python)
"""
from .archetypes import ARCHETYPES, get_archetype, list_archetypes
from .prompts import build_visual_prompt, build_short_prompt, build_system_prompt
from .narrative import roda_viva, narrar, export_json
from .cycles import cycle_3_6_9, spin, triskelion
from .trinity import TRINITY_MODEL

__all__ = [
    "ARCHETYPES",
    "get_archetype",
    "list_archetypes",
    "build_visual_prompt",
    "build_short_prompt",
    "build_system_prompt",
    "roda_viva",
    "narrar",
    "export_json",
    "cycle_3_6_9",
    "spin",
    "triskelion",
    "TRINITY_MODEL",
]
