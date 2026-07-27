from kobllux import roda_viva, build_visual_prompt, list_archetypes, export_json

def main():
    print(roda_viva())
    print("\n--- Exemplo de Prompt Visual (Atlas) ---")
    print(build_visual_prompt("Atlas"))
    export_json("arquetipos.json")
    print("\nArquivo 'arquetipos.json' gerado.")

if __name__ == "__main__":
    main()
