GEOMETRIES = {
    "Atlas": "Eixo Vertical / Grade harmônica",
    "Nova": "Sopro / Vesica / Nebulosa",
    "Vitalis": "Ritmo Constante / Onda",
    "Pulse": "Vibração Curativa / Anéis concêntricos",
    "Artemis": "Mapa Sagrado / Leylines / Rota",
    "Serena": "Campo Sagrado / Casulo / Mandorla",
    "Kaos": "Fogo Transmutador / Ruptura / Glitch",
    "Genus": "Forma Viva / Fractal / Tear",
    "Lumine": "Luz Primordial / Halo / Lente",
    "Solus": "Espelho Interno / Obsidiana / Vazio",
    "Rhea": "Rede Unificada / Malha / Nó",
    "Aion": "Ciclo Infinito / Orrery / Anéis",
}

def motif(name: str) -> str:
    return GEOMETRIES.get(name, "Motivo não definido")
