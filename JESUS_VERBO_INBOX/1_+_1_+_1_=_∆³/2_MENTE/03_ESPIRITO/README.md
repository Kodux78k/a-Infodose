# KOBLLUX — Roda Narrativa Geométrica Fractal (Python)

Base simbólica para criar prompts, cenas e diretrizes de design a partir dos 12 arquétipos do sistema KOBLLUX.
Inclui:
- Registro de arquétipos com geometrias, cores, símbolos e Trindade (Pai/Filho/Espírito -> Mente/Corpo/Espírito).
- Ciclos 3–6–9, roda viva, e narrativas programáticas.
- Geração de *prompts* textuais para diretores de arte e designers.
- Exportação em JSON e CLI simples.

## Instalação rápida

```bash
cd kobllux_narrativa
python -m venv .venv && source .venv/bin/activate
pip install -e .
```

## Uso rápido

```bash
kobllux prompt --name Atlas
kobllux roda
kobllux export --out ./arquetipos.json
python -m kobllux.examples.demo
```
