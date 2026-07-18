#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KOBLLUX · INBOX ROUTER V3 · REGRAS RÍGIDAS
✅ Erro JSON corrigido
✅ Espaço → underline SEMPRE
✅ EXTENSÃO NUNCA É ALTERADA (txt=txt, js=js, py=py)
✅ Python def/class → NOME EXATO DO CÓDIGO (case/_/- preservados)
✅ Título limitado a 3 PALAVRAS (exceto identificadores técnicos)
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
# 1 · CONFIGURAÇÃO
# ============================================================
MINUZ = Path(__file__).resolve().parent
RAIZ = MINUZ.parent
AZURE = RAIZ / "3_ESPIRITO" / "2_AZURE"
CODEX = RAIZ / "3_ESPIRITO" / "1_CODEX"
PIPE = CODEX / "PIPE"
PUBLIC = CODEX / "public"
LOG_FILE = MINUZ / "00_inbox_log.jsonl"
PENDENTE = MINUZ / "00_PENDENTE"
PENDENTE.mkdir(exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

MAX_PALAVRAS = 3  # ← REGRA: MÁXIMO 3 PALAVRAS NO TÍTULO

# ============================================================
# 2 · TABELA DE ROTAS (Cada tipo vai para SUA pasta — NÃO MISTURA)
# ============================================================
TIPOS = {
    # 📄 DOCUMENTOS → CADA UM NA SUA PASTA
    "txt":  AZURE / "2_DOCUMENTOS" / "1_TXT",
    "pdf":  AZURE / "2_DOCUMENTOS" / "2_PDF",
    "md":   AZURE / "2_DOCUMENTOS" / "3_MD",
    "markdown": AZURE / "2_DOCUMENTOS" / "3_MD",
    # 🌐 WEB → SEPARADO POR FUNÇÃO
    "html": AZURE / "1_ARQUIVOS" / "1_HTML",
    "htm":  AZURE / "1_ARQUIVOS" / "1_HTML",
    "css":  AZURE / "1_ARQUIVOS" / "2_BODY",
    "scss": AZURE / "1_ARQUIVOS" / "2_BODY",
    "js":   AZURE / "1_ARQUIVOS" / "3_SCRIPTS",
    "ts":   AZURE / "1_ARQUIVOS" / "3_SCRIPTS",
    "jsx":  AZURE / "1_ARQUIVOS" / "3_SCRIPTS",
    "tsx":  AZURE / "1_ARQUIVOS" / "3_SCRIPTS",
    "vue":  AZURE / "1_ARQUIVOS" / "3_SCRIPTS",
    # ⚙️ CÓDIGO → TODOS NA PASTA DE CÓDIGO
    "py":   AZURE / "3_CODIGOS",
    "sh":   AZURE / "3_CODIGOS",
    "bash": AZURE / "3_CODIGOS",
    "json": AZURE / "3_CODIGOS",
    "yaml": AZURE / "3_CODIGOS",
    "yml":  AZURE / "3_CODIGOS",
    "xml":  AZURE / "3_CODIGOS",
    "csv":  AZURE / "3_CODIGOS",
    "sql":  AZURE / "3_CODIGOS",
    # 🖼️ MÍDIA
    "png":  AZURE / "1_ARQUIVOS" / "2_BODY",
    "jpg":  AZURE / "1_ARQUIVOS" / "2_BODY",
    "jpeg": AZURE / "1_ARQUIVOS" / "2_BODY",
    "svg":  AZURE / "1_ARQUIVOS" / "2_BODY",
    "gif":  AZURE / "1_ARQUIVOS" / "2_BODY",
}

MIME_PARA_EXT = {
    "text/plain": "txt", "application/pdf": "pdf", "text/markdown": "md",
    "text/html": "html", "text/css": "css", "application/javascript": "js",
    "application/json": "json", "text/x-python": "py",
}

# SÓ esses caracteres são proibidos (sistema de arquivos)
# PRESERVA: letras, números, underline, traço, ponto — MAIÚSCULAS E MINÚSCULAS
PROIBIDOS = re.compile(r'[<>:"/\\|?*\']')

# ============================================================
# 🔧 JSON SEGURO (erro corrigido)
# ============================================================
def carregar_db() -> dict:
    db_path = PUBLIC / "codex_data.json"
    if not db_path.exists():
        return {"entradas": [], "ultima_atualizacao": None, "total_entradas": 0}
    try:
        dados = json.loads(db_path.read_text(encoding="utf-8"))
        if not isinstance(dados, dict): dados = {}
        dados.setdefault("entradas", [])
        dados.setdefault("ultima_atualizacao", None)
        dados.setdefault("total_entradas", len(dados["entradas"]))
        return dados
    except Exception:
        backup = db_path.with_suffix(f".corrompido_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        shutil.copy(db_path, backup)
        return {"entradas": [], "ultima_atualizacao": None, "total_entradas": 0, "backup": backup.name}

def atualizar_public(registro: dict):
    dados = carregar_db()
    dados["entradas"].insert(0, registro)
    dados["ultima_atualizacao"] = datetime.now().isoformat()
    dados["total_entradas"] = len(dados["entradas"])
    (PUBLIC / "codex_data.json").write_text(
        json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8"
    )

# ============================================================
# 📝 REGRAS DE TÍTULO · EXATAMENTE COMO PEDIDO
# ============================================================
def limpar(texto: str) -> str:
    """REGRA 1: SÓ tira caracteres proibidos. PRESERVA TUDO: Aa _ - ."""
    return PROIBIDOS.sub("", texto).strip()

def espaco_para_underline(texto: str) -> str:
    """REGRA 2: Qualquer espaço/quebra/tab → UM underline"""
    return re.sub(r"\s+", "_", texto.strip())

def limitar_palavras(texto: str, maximo: int = MAX_PALAVRAS) -> str:
    """REGRA 3: MÁXIMO 3 PALAVRAS (separa por underline)"""
    partes = [p for p in texto.split("_") if p]
    return "_".join(partes[:maximo])

def tratar_titulo_comum(titulo: str) -> str:
    """Aplica regras para títulos normais (não é nome de código)"""
    t = limpar(titulo)
    t = espaco_para_underline(t)
    t = limitar_palavras(t)
    return t.strip("_") or "sem_titulo"

def ler_texto(arquivo: Path, max_bytes: int = 50000) -> str:
    try:
        return arquivo.read_text(encoding="utf-8", errors="ignore")[:max_bytes]
    except:
        return ""

# ============================================================
# 🔍 EXTRATOR DE TÍTULO · CADA LINGUAGEM NA SUA REGRA
# ============================================================
def extrair_titulo(arquivo: Path, tipo: str) -> tuple[str | None, bool]:
    """
    Retorna (titulo_tratado, é_identificador_tecnico)
    REGRA PYTHON: def/class → NOME EXATO, SEM ALTERAÇÃO, SEM LIMITE DE PALAVRAS
    """
    texto = ler_texto(arquivo)
    if not texto:
        return None, False
    t = texto.strip()

    # ─── 🐍 PYTHON — REGRA ESPECIAL: NOME EXATO DO CÓDIGO ───
    if tipo == "py":
        # 1º opção: docstring inicial (título comum → 3 palavras)
        m_doc = re.match(r'^["\']{3}(.*?)["\']{3}', t, re.DOTALL)
        if m_doc:
            primeira = m_doc.group(1).strip().splitlines()[0]
            if primeira:
                return tratar_titulo_comum(primeira), False
        # 2º opção: comentário topo
        for linha in t.splitlines()[:5]:
            l = linha.strip()
            if l.startswith("#") and len(l) > 3:
                return tratar_titulo_comum(l.lstrip("# ")), False
        # ✅ 3º opção: PRIMEIRA def OU class → NOME EXATO, SEM MUDAR NADA
        m = re.search(r"^(?:def|class)\s+([A-Za-z_][A-Za-z0-9_]*)\s*[(:]", t, re.MULTILINE)
        if m:
            nome_exato = m.group(1)  # ← EXATAMENTE como tá no código: Aa _ tudo igual
            return nome_exato, True  # ← é identificador técnico: NÃO LIMITA PALAVRAS

    # ─── 🌐 HTML ───
    if tipo in ("html", "htm"):
        m = re.search(r"<title[^>]*>(.*?)</title>", t, re.IGNORECASE | re.DOTALL)
        if m: return tratar_titulo_comum(m.group(1)), False
        m = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.IGNORECASE | re.DOTALL)
        if m: return tratar_titulo_comum(re.sub(r"<[^>]+>", "", m.group(1))), False

    # ─── ⚡ JAVASCRIPT / TYPESCRIPT ───
    if tipo in ("js", "ts", "jsx", "tsx", "vue"):
        m = re.match(r"^\s*/\*(.*?)\*/", t, re.DOTALL)
        if m:
            l = m.group(1).strip().splitlines()[0]
            if l and not l.startswith("!"):
                return tratar_titulo_comum(l), False
        for linha in t.splitlines()[:8]:
            l = linha.strip()
            if l.startswith("//") and len(l) > 4:
                return tratar_titulo_comum(l.lstrip("/ ")), False
        # Nome de função/const JS → exato
        m = re.search(r"(?:export\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)", t)
        if m: return m.group(1), True

    # ─── 📦 JSON ───
    if tipo == "json":
        try:
            d = json.loads(texto)
            if isinstance(d, dict):
                for chave in ("title", "name", "nome", "titulo"):
                    if chave in d and isinstance(d[chave], str) and d[chave].strip():
                        return tratar_titulo_comum(d[chave]), False
        except: pass

    # ─── 📝 MARKDOWN ───
    if tipo in ("md", "markdown"):
        for linha in t.splitlines()[:10]:
            l = linha.strip()
            if l.startswith("# "): return tratar_titulo_comum(l[2:]), False
            if l.startswith("## "): return tratar_titulo_comum(l[3:]), False

    # ─── 📄 TXT / PDF / GERAL ───
    for linha in t.splitlines()[:5]:
        l = linha.strip()
        if 3 < len(l) < 120 and not l.startswith(("{", "[", "<", "//", "/*", "#", "-", "*")):
            return tratar_titulo_comum(l), False

    return None, False

# ============================================================
# 🔄 RENOMEADOR — EXTENSÃO NUNCA MUDA
# ============================================================
def renomear(arquivo: Path, tipo: str) -> tuple[Path, str | None, bool]:
    """
    ✅ REGRA DE OURO: extensão ORIGINAL é SEMPRE preservada
    ✅ Técnico (def/class): nome exato + extensão original
    ✅ Comum: até 3 palavras + extensão original
    """
    titulo, eh_tecnico = extrair_titulo(arquivo, tipo)
    if not titulo:
        return arquivo, None, False

    extensao_original = arquivo.suffix  # ← NUNCA ALTERA: .py continua .py, .txt continua .txt

    if eh_tecnico:
        # Nome técnico: exato, sem limite de palavras, só limpa perigosos
        nome_final = limpar(titulo) + extensao_original
    else:
        # Título comum: 3 palavras + extensão ORIGINAL
        nome_final = titulo + extensao_original

    if nome_final == arquivo.name:
        return arquivo, titulo, eh_tecnico  # já está certo

    novo = arquivo.with_name(nome_final)
    cont = 1
    while novo.exists():
        sem_ext = novo.stem
        novo = arquivo.with_name(f"{sem_ext}_{cont}{extensao_original}")
        cont += 1
    arquivo.rename(novo)
    return novo, titulo, eh_tecnico

# ============================================================
# 🧰 UTILIDADES
# ============================================================
def detectar_tipo(arquivo: Path) -> str:
    ext = arquivo.suffix.lower().lstrip(".")
    try:
        import magic
        mime = magic.from_file(str(arquivo), mime=True)
        if mime in MIME_PARA_EXT: return MIME_PARA_EXT[mime]
    except ImportError: pass
    return ext if ext else "desconhecido"

def assinatura(arquivo: Path) -> dict:
    d = arquivo.read_bytes()
    return {"sha256": hashlib.sha256(d).hexdigest(), "tamanho_bytes": len(d)}

def verificar_espelho(arquivo: Path) -> dict | None:
    nome = arquivo.name.lower()
    if "mirror" not in nome: return None
    original = arquivo.parent / nome.replace(".mirror", "").replace("mirror.", "")
    return {"status": "ok" if original.exists() else "sem_par", "original": original.name}

# ============================================================
# 🚀 ROTEAR
# ============================================================
def rotear(item: Path) -> dict:
    if item.is_dir() or item.name.startswith("00_") or item.name == Path(__file__).name:
        return {"ignorado": True}

    tipo = detectar_tipo(item)
    # 1) Renomeia usando título interno → MANTÉM EXTENSÃO
    item, titulo, tecnico = renomear(item, tipo)
    # 2) Escolhe pasta DESTINO pelo tipo (cada linguagem na sua)
    destino = TIPOS.get(tipo, PENDENTE)
    destino.mkdir(parents=True, exist_ok=True)

    ass = assinatura(item)
    espelho = verificar_espelho(item)

    final = destino / item.name
    if final.exists():
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        final = destino / f"{item.stem}__{ts}{item.suffix}"
    shutil.move(str(item), str(final))

    registro = {
        "timestamp": datetime.now().isoformat(),
        "arquivo_final": final.name,
        "titulo_interno": titulo,
        "titulo_eh_identificador_tecnico": tecnico,
        "tipo": tipo,
        "extensao_original": final.suffix,
        "destino": str(final.relative_to(RAIZ)),
        **ass,
    }
    if espelho: registro["espelho"] = espelho

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(registro, ensure_ascii=False) + "\n")
    atualizar_public(registro)
    return registro

# ============================================================
# 🏁 MAIN
# ============================================================
def main():
    print(f"⚡ KOBLLUX INBOX ROUTER V3 · ∆³")
    print(f"📥 MINUZ: {MINUZ}\n📤 AZURE: {AZURE}")
    print(f"📏 REGRA: máximo {MAX_PALAVRAS} palavras · extensão nunca muda\n")

    ok = erros = 0
    for item in sorted(MINUZ.iterdir()):
        if not item.is_file(): continue
        try:
            r = rotear(item)
        except Exception as e:
            erros += 1
            print(f"❌ {item.name}: {e}")
            continue
        if r.get("ignorado"): continue
        ok += 1
        tag = "🔧" if r.get("titulo_eh_identificador_tecnico") else "📝"
        print(f"✅ {r['arquivo_final']:45s} [{r['tipo']:4s}] → {r['destino']} {tag} {r.get('titulo_interno','')}")

    print(f"\n📊 {ok} ok · {erros} erro(s) · ∆³ ∴ 1134")

if __name__ == "__main__":
    main()
