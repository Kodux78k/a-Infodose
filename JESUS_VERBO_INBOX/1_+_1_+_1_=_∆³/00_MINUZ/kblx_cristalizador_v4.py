#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KOBLLUX · CRISTALIZADOR DE NOMES V4 · ∆³
✅ Apaga EMOJIS / símbolos / aspas / hashtag / ponto médio
✅ NÃO começa com underline / traço / ponto
✅ SÓ pode ter: letras · números · _ (espaço) · - (traço) · . (ponto)
✅ Espaço → underline SEMPRE
✅ Ponto no nome → MANTÉM (ex: arquivo.v2.py)
✅ CamelCase / PascalCase / snake_case → PRESERVADO EXATO (conforme sintaxe da linguagem)
✅ NUNCA ALTERA A EXTENSÃO
✅ Lê memória codex_data.json · atualiza após renomear
✅ Gera em CADA pasta: 00_METADADOS.json + 00_RESUMO.md (árvore + fluxograma)
Executar DENTRO de: /∆/1_+_1_+_1_=_∆³/00_MINUZ/
Assinatura: 3×6×9×7 = 1134
"""
import os
import re
import sys
import json
import shutil
import hashlib
from datetime import datetime
from pathlib import Path

# ============================================================
# 1 · CONFIGURAÇÃO · CAMINHOS · FILTROS
# ============================================================
MINUZ = Path(__file__).resolve().parent
RAIZ = MINUZ.parent
CODEX = RAIZ / "3_ESPIRITO" / "1_CODEX"
PUBLIC = CODEX / "public"
MEMORIA = PUBLIC / "codex_data.json"

# ⚠️ TIPOS QUE VÃO SER CRISTALIZADOS (código + texto + documento)
TIPOS_PERMITIDOS = {
    "py","js","ts","jsx","tsx","vue","html","htm","css","scss","sh","bash",
    "json","yaml","yml","xml","csv","sql","md","markdown","txt","pdf","rtf"
}
# 🛑 TIPOS QUE NUNCA TOCA (binários / mídia)
TIPOS_PULAR = {"png","jpg","jpeg","gif","webp","svg","mp3","mp4","wav","ogg","zip","tar","gz"}

# ============================================================
# 2 · REGRAS DE CRISTALIZAÇÃO · CORAÇÃO DO SCRIPT
# ============================================================

# 🚫 REMOVE TUDO ISSO: emoji · símbolos · pontuação extra · aspas · hashtag
REGEX_EMOJI = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # rostos
    "\U0001F300-\U0001F5FF"  # símbolos / pictogramas
    "\U0001F680-\U0001F6FF"  # transporte / mapa
    "\U0001F1E0-\U0001F1FF"  # bandeiras
    "\U00002702-\U000027B0"  # dingbats
    "\U000024C2-\U0001F251"
    "\U0001f926-\U0001f937"
    "\U00010000-\U0010ffff"
    "\u2640-\u2642\u2600-\u2B55\u200d\u23cf\u23e9\u231a\ufe0f\u3030"
    "]+",
    flags=re.UNICODE,
)
# 🚫 Caracteres proibidos de existir em NOME DE ARQUIVO (fora os 3 permitidos: _ - .)
REGEX_PROIBIDOS = re.compile(r'[^\w\-\. ]', re.UNICODE)  # \w = letras + números + _
# 🚫 Separadores repetidos: __ → _  ·  -- → -  ·  .. → .
REGEX_DUP_UNDER = re.compile(r'_+')
REGEX_DUP_TRACO = re.compile(r'-+')
REGEX_DUP_PONTO = re.compile(r'\.+')
# 🚫 NÃO PODE COMEÇAR nem TERMINAR com _  -  .
REGEX_INICIO = re.compile(r'^[_\-\.]+')
REGEX_FIM = re.compile(r'[_\-\.]+$')

def cristalizar(nome_arquivo: str, tipo: str) -> str:
    """
    APLICA TODAS AS REGRAS DO PEDIDO · EXTENSÃO NUNCA É ALTERADA
    Retorna nome final LIMPINHO
    """
    # 1) SEPARAR NOME + EXTENSÃO (extensão = SANTA, NUNCA MEXE)
    caminho = Path(nome_arquivo)
    nome = caminho.stem
    extensao = caminho.suffix  # ← .py .txt .js etc. → SAI IGUAL

    # 2) REMOVER EMOJIS E CARACTERES DE DESENHO
    nome = REGEX_EMOJI.sub('', nome)

    # 3) REMOVER ASPAS · HASHTAG · ARROBA · PONTO MÉDIO · SÍMBOLOS DIVERSOS
    nome = REGEX_PROIBIDOS.sub('', nome)

    # 4) REGRA DE OURO: QUALQUER ESPAÇO → UNDERLINE
    nome = re.sub(r'\s+', '_', nome.strip())

    # 5) SEPARADORES REPETIDOS → 1 SÓ
    nome = REGEX_DUP_UNDER.sub('_', nome)
    nome = REGEX_DUP_TRACO.sub('-', nome)
    nome = REGEX_DUP_PONTO.sub('.', nome)

    # 6) NÃO PODE COMEÇAR COM _  -  . (regras explícitas)
    nome = REGEX_INICIO.sub('', nome)

    # 7) NÃO PODE TERMINAR COM _  -  .
    nome = REGEX_FIM.sub('', nome)

    # 8) SE FICAR VAZIO DEPOIS DA LIMPEZA
    if not nome:
        nome = "arquivo_sem_nome"

    # 9) ✅ REGRA SINTÁTICA: NÃO MODIFICA ESTRUTURA DE CÓDIGO
    #    CamelCase PascalCase snake_case kebab-case → SAEM EXATOS
    #    (a limpeza acima só remove lixo, NÃO quebra palavras juntas)

    # 10) MONTA NOME FINAL = nome_limpo + extensao_ORIGINAL
    return f"{nome}{extensao}"

# ============================================================
# 3 · MEMÓRIA · LER E ATUALIZAR codex_data.json
# ============================================================
def carregar_memoria() -> dict:
    if not MEMORIA.exists():
        return {"entradas": [], "ultima_atualizacao": None, "total_entradas": 0}
    try:
        d = json.loads(MEMORIA.read_text(encoding="utf-8"))
        d.setdefault("entradas", [])
        return d
    except:
        return {"entradas": [], "ultima_atualizacao": None, "total_entradas": 0}

def atualizar_memoria(memoria: dict, antes: str, depois: str, caminho: str):
    for e in memoria["entradas"]:
        if e.get("arquivo_final") == antes or e.get("destino", "").endswith(antes):
            e["arquivo_final"] = depois
            e["destino"] = caminho
            e["cristalizado_em"] = datetime.now().isoformat()
    memoria["ultima_atualizacao"] = datetime.now().isoformat()
    MEMORIA.write_text(json.dumps(memoria, ensure_ascii=False, indent=2), encoding="utf-8")

# ============================================================
# 4 · HASH · SEGURANÇA (antes/depois)
# ============================================================
def sha256(arquivo: Path) -> str:
    return hashlib.sha256(arquivo.read_bytes()).hexdigest()

# ============================================================
# 5 · VARRER ÁRVORE · COLETAR ARQUIVOS PARA PROCESSAR
# ============================================================
def varrer() -> dict[Path, list[dict]]:
    """
    Retorna: { pasta: [ {arquivo, nome_antes, nome_depois, tipo, hash_antes}, ... ] }
    SÓ inclui arquivos que PRECISAM ser renomeados
    """
    resultado: dict[Path, list[dict]] = {}
    memoria = carregar_memoria()

    pastas_alvo = [
        RAIZ / "1_CORPO",
        RAIZ / "2_MENTE",
        RAIZ / "3_ESPIRITO",
    ]

    for pasta in pastas_alvo:
        if not pasta.exists():
            continue
        for caminho in sorted(pasta.rglob("*")):
            if not caminho.is_file():
                continue
            # Pula arquivos de sistema / metadados que o próprio script gera
            if caminho.name.startswith("00_"):
                continue
            if caminho.suffix.lower().lstrip(".") in TIPOS_PULAR:
                continue
            if caminho.suffix.lower().lstrip(".") not in TIPOS_PERMITIDOS:
                continue

            tipo = caminho.suffix.lower().lstrip(".")
            nome_novo = cristalizar(caminho.name, tipo)

            if nome_novo == caminho.name:
                continue  # já está cristalizado → pula

            entrada = {
                "arquivo": caminho,
                "nome_antes": caminho.name,
                "nome_depois": nome_novo,
                "tipo": tipo,
                "hash_antes": sha256(caminho),
                "pasta": caminho.parent,
            }
            resultado.setdefault(caminho.parent, []).append(entrada)

    return resultado

# ============================================================
# 6 · GERAR METADADOS + RESUMO.MD EM CADA PASTA
# ============================================================
def gerar_arvore_texto(pasta: Path) -> str:
    """Gera representação estilo comando `tree` em texto"""
    linhas = [f"./{pasta.relative_to(RAIZ)}"]
    itens = sorted([i for i in pasta.iterdir() if not i.name.startswith(".")])
    for i, item in enumerate(itens):
        ultimo = (i == len(itens) - 1)
        ramo = "└── " if ultimo else "├── "
        linhas.append(f"{ramo}{item.name}{'/' if item.is_dir() else ''}")
    return "\n".join(linhas)

def gerar_fluxograma_mermaid(operacoes: list[dict]) -> str:
    """Fluxograma da operação em Mermaid (renderiza em GitHub / Obsidian etc.)"""
    linhas = ["```mermaid", "flowchart LR", "  A[INÍCIO · Leitura da pasta]"]
    for idx, op in enumerate(operacoes, 1):
        antes = op["nome_antes"].replace('"',"'")
        depois = op["nome_depois"].replace('"',"'")
        linhas.append(f"  A --> B{idx}[\"{antes}\"]")
        linhas.append(f"  B{idx} -->|Cristalizar ∆³| C{idx}[\"{depois}\"]")
    linhas.append("  FIM[FIM · Metadados + MD gravados]")
    for idx in range(1, len(operacoes)+1):
        linhas.append(f"  C{idx} --> FIM")
    linhas.append("```")
    return "\n".join(linhas)

def gravar_metadados_pasta(pasta: Path, operacoes: list[dict]):
    """Gera 00_METADADOS.json + 00_RESUMO.md na pasta"""
    agora = datetime.now().isoformat()

    # --- JSON ---
    metadados = {
        "pasta": str(pasta.relative_to(RAIZ)),
        "data_operacao": agora,
        "script": "kblx_cristalizador_v4.py",
        "assinatura": "3×6×9×7=1134",
        "total_arquivos_cristalizados": len(operacoes),
        "operacoes": [
            {
                "nome_antes": o["nome_antes"],
                "nome_depois": o["nome_depois"],
                "tipo": o["tipo"],
                "hash_antes": o["hash_antes"],
                "hash_depois": o.get("hash_depois", o["hash_antes"]),
            }
            for o in operacoes
        ],
    }
    (pasta / "00_METADADOS.json").write_text(
        json.dumps(metadados, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # --- MARKDOWN ---
    md = [
        f"# ✧ 00_RESUMO · Cristalização ∆³",
        f"**Pasta**: `./{pasta.relative_to(RAIZ)}`  \n**Data**: {agora}  \n**Arquivos processados**: {len(operacoes)}",
        "",
        "## 🧭 Fluxograma da Operação",
        gerar_fluxograma_mermaid(operacoes),
        "",
        "## 🌳 Árvore da Pasta (após)",
        "```",
        gerar_arvore_texto(pasta),
        "```",
        "",
        "## 📋 Tabela de Renomeações",
        "| # | Nome ANTES | Nome DEPOIS | Tipo | Hash (SHA-256) |",
        "|---|---|---|---|---|",
    ]
    for i, o in enumerate(operacoes, 1):
        md.append(
            f"| {i} | `{o['nome_antes']}` | `{o['nome_depois']}` | `{o['tipo']}` | `{o['hash_antes'][:16]}…` |"
        )
    md += ["", "---", "∆³ ∴ 3×6×9×7 = 1134 · Nomes cristalizados e selados"]
    (pasta / "00_RESUMO.md").write_text("\n".join(md), encoding="utf-8")

# ============================================================
# 7 · EXECUTAR RENOMEAÇÕES
# ============================================================
def executar(operacoes_por_pasta: dict[Path, list[dict]]) -> dict[Path, list[dict]]:
    memoria = carregar_memoria()
    feitas: dict[Path, list[dict]] = {}

    for pasta, lista in operacoes_por_pasta.items():
        feitas[pasta] = []
        for op in lista:
            destino = op["arquivo"].with_name(op["nome_depois"])
            cont = 1
            while destino.exists():
                destino = op["arquivo"].with_name(f"{Path(op['nome_depois']).stem}_{cont}{Path(op['nome_depois']).suffix}")
                cont += 1
            op["arquivo"].rename(destino)
            op["nome_depois_final"] = destino.name
            op["hash_depois"] = sha256(destino)
            atualizar_memoria(memoria, op["nome_antes"], destino.name, str(destino.relative_to(RAIZ)))
            feitas[pasta].append(op)
    return feitas

# ============================================================
# 🏁 MAIN
# ============================================================
def main():
    print(f"⚡ KOBLLUX · CRISTALIZADOR DE NOMES V4 · ∆³")
    print(f"🌳 Raiz: {RAIZ}\n🧠 Memória: {MEMORIA.relative_to(RAIZ)}\n")

    operacoes = varrer()
    total = sum(len(v) for v in operacoes.values())

    if total == 0:
        print("✅ Todos os nomes já estão cristalizados. Nada a fazer.")
        return

    # ─── DRY RUN (mostra TUDO antes de tocar em nada) ───
    print(f"🔍 Encontrados {total} arquivo(s) para cristalizar:\n")
    for pasta, lista in operacoes.items():
        print(f"\n📂 ./{pasta.relative_to(RAIZ)}")
        for op in lista:
            print(f"   ❌ {op['nome_antes']:50s} → ✅ {op['nome_depois']}  [{op['tipo']}]")

    confirm = input(f"\n⚠️  CONFIRMA renomear esses {total} arquivos? (s/N): ").strip().lower()
    if confirm not in ("s", "sim", "y", "yes"):
        print("❌ Cancelado. Nada foi alterado.")
        return

    # ─── EXECUTA ───
    print("\n🚀 Executando cristalização...")
    feitas = executar(operacoes)

    # ─── GERA METADADOS + MD EM CADA PASTA ───
    for pasta, lista in feitas.items():
        gravar_metadados_pasta(pasta, lista)
        print(f"📝 ./{pasta.relative_to(RAIZ)} → 00_METADADOS.json + 00_RESUMO.md gravados")

    print(f"\n✅ CONCLUÍDO: {sum(len(v) for v in feitas.values())} arquivo(s) cristalizado(s)")
    print(f"🧠 Memória codex_data.json atualizada")
    print(f"∆³ ∴ 1134 · Nomes selados")

if __name__ == "__main__":
    main()

