import argparse
from .narrative import roda_viva, export_json
from .prompts import build_visual_prompt, build_short_prompt, build_system_prompt
from .archetypes import list_archetypes

def main():
    parser = argparse.ArgumentParser(prog="kobllux", description="KOBLLUX — Roda Narrativa Geométrica Fractal")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("roda", help="Imprime a roda viva dos 12 arquétipos")

    p_prompt = sub.add_parser("prompt", help="Gera prompt visual para um arquétipo")
    p_prompt.add_argument("--name", required=True, help="Nome do arquétipo")

    p_short = sub.add_parser("short", help="Gera prompt curto")
    p_short.add_argument("--name", required=True)

    p_export = sub.add_parser("export", help="Exporta os arquétipos em JSON")
    p_export.add_argument("--out", required=True)

    sub.add_parser("system", help="Imprime o prompt universal do sistema")

    p_list = sub.add_parser("list", help="Lista os arquétipos")

    args = parser.parse_args()

    if args.cmd == "roda":
        print(roda_viva())
    elif args.cmd == "prompt":
        print(build_visual_prompt(args.name))
    elif args.cmd == "short":
        print(build_short_prompt(args.name))
    elif args.cmd == "export":
        export_json(args.out)
        print(f"Exportado: {args.out}")
    elif args.cmd == "system":
        print(build_system_prompt())
    elif args.cmd == "list":
        print("\n".join(list_archetypes()))
    else:
        parser.print_help()
