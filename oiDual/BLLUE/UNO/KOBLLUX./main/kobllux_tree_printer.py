#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⧈ KOBLLUX_Δ³ :: CHRONORITHM ATIVADO (Enriquecido) ⧈
Script de Impressão da Árvore Fractal com análise de dependências,
extração de classes e ordem de inicialização (bootloader fractal).
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass, field
from collections import defaultdict, deque

# ═══════════════════════════════════════════════════════════════
# PALETA ANSI / SEMÂNTICA KOBLLUX
# ═══════════════════════════════════════════════════════════════
ANSI = {
    "RESET": "\033[0m",
    "TITLE": "\033[95m",
    "BLUE": "\033[94m",
    "GREEN": "\033[92m",
    "YELLOW": "\033[93m",
    "CYAN": "\033[96m",
    "RED": "\033[91m",
    "BOLD": "\033[1m",
    "DIM": "\033[2m",
    "GOLD": "\033[33m",
}


def color(txt: str, key: str) -> str:
    """Aplica cor ANSI."""
    if getattr(sys.modules[__name__], "NO_COLOR", False):
        return txt
    return f" {ANSI.get(key, '')} {txt} {ANSI['RESET']}"


# ═══════════════════════════════════════════════════════════════
# DADOS FRACTAIS (agora com campos enriquecidos)
# ═══════════════════════════════════════════════════════════════
@dataclass
class FileNode:
    path: Path
    name: str
    is_dir: bool
    depth: int
    extension: str = ""
    size: int = 0
    opcode: str = "0x00"
    desincronia: List[str] = field(default_factory=list)
    # -- novos campos para análise enriquecida --
    source: Optional[str] = None             # código-fonte (limitado)
    classes: List[str] = field(default_factory=list)
    functions: List[str] = field(default_factory=list)
    imports: List[str] = field(default_factory=list)        # paths relativos encontrados
    dependencies: List[str] = field(default_factory=list)   # caminhos resolvidos para outros nós
    loaded_by: List[str] = field(default_factory=list)      # quem importa este arquivo
    boot_order: int = -1                      # ordem de inicialização (topológica)


@dataclass
class TreeReport:
    total_files: int = 0
    total_dirs: int = 0
    total_size: int = 0
    max_depth: int = 0
    extensions: Dict[str, int] = field(default_factory=lambda: defaultdict(int))
    opcodes_count: Dict[str, int] = field(default_factory=lambda: defaultdict(int))
    desincronia_count: int = 0
    nodes: List[FileNode] = field(default_factory=list)
    # sequência de inicialização
    boot_sequence: List[str] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════════
# MAPEAMENTO DE OPCODES POR EXTENSÃO
# ═══════════════════════════════════════════════════════════════
OPCODE_MAP = {
    ".py": "0x01", ".ts": "0x02", ".js": "0x03",
    ".rs": "0x04", ".glsl": "0x05", ".sh": "0x06",
    ".json": "0x07", ".html": "0x08", ".css": "0x09",
    ".md": "0x0A", ".txt": "0x0B", ".webmanifest": "0x0C",
}


# ═══════════════════════════════════════════════════════════════
# DETECÇÃO DE DESINCRONIA (mantida)
# ═══════════════════════════════════════════════════════════════
def detect_desincronia(node: FileNode, all_nodes: List[FileNode]) -> List[str]:
    issues = []
    if node.extension == ".js" and "engine" in node.name.lower():
        if not any(n.extension == ".html" for n in all_nodes):
            issues.append("JS sem HTML correspondente")
    if node.extension == ".css" and "unified" in node.name.lower():
        if not any(n.extension == ".html" for n in all_nodes):
            issues.append("CSS sem HTML correspondente")
    if node.extension == ".json" and "metapulso" in node.name.lower():
        if not any("schema" in n.name.lower() for n in all_nodes):
            issues.append("JSON sem schema de validação")
    if node.size > 100000:
        issues.append(f"Arquivo grande ({node.size} bytes) - possível monólito")
    return issues


# ═══════════════════════════════════════════════════════════════
# NOVAS FUNÇÕES DE ANÁLISE ENRIQUECIDA
# ═══════════════════════════════════════════════════════════════

MAX_SOURCE_SIZE = 100_000   # bytes máximos para incluir o fonte no JSON

def safe_read_file(path: Path, max_size: int = MAX_SOURCE_SIZE) -> Optional[str]:
    """Lê arquivo de texto com limite de tamanho."""
    try:
        if path.stat().st_size > max_size:
            return f"// Conteúdo truncado (> {max_size} bytes)"
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()
    except Exception:
        return None


def extract_definitions(content: str, ext: str) -> Tuple[List[str], List[str]]:
    """
    Extrai classes e funções do código fonte usando regex simples.
    Retorna (classes, funções).
    """
    classes = []
    functions = []

    # JavaScript / TypeScript
    if ext in ('.js', '.ts', '.jsx', '.tsx'):
        # classes: class Nome { ... }
        classes = re.findall(r'(?:export\s+)?class\s+(\w+)', content)
        # funções tradicionais e arrow functions atribuídas a variáveis/constantes
        funcs1 = re.findall(r'(?:async\s+)?function\s+(\w+)', content)
        funcs2 = re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(', content)
        functions = list(set(funcs1 + funcs2))

    # Python
    elif ext == '.py':
        classes = re.findall(r'^class\s+(\w+)', content, re.MULTILINE)
        functions = re.findall(r'^def\s+(\w+)', content, re.MULTILINE)

    # HTML (pode conter scripts inline – opcional)
    elif ext == '.html':
        # procura scripts com classe/função
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
        for script in scripts:
            c, f = extract_definitions(script, '.js')
            classes.extend(c)
            functions.extend(f)

    return classes, functions


def extract_local_imports(content: str, ext: str, project_root: Path, file_path: Path) -> List[str]:
    """
    Encontra imports que apontam para arquivos locais do projeto.
    Retorna lista de caminhos relativos (ex: './event_bus.js').
    """
    imports = []
    if ext in ('.js', '.ts'):
        # import ... from '...'
        matches = re.findall(r'''from\s+['"]([^'"]+)['"]''', content)
        # require('...')
        matches += re.findall(r'''require\(['"]([^'"]+)['"]\)''', content)
        for imp in matches:
            if imp.startswith('./') or imp.startswith('../'):
                imports.append(imp)

    elif ext == '.py':
        # from .modulo import ...
        matches = re.findall(r'from\s+(\.\S+)\s+import', content)
        for imp in matches:
            if imp.startswith('.'):
                imports.append(imp)

    elif ext == '.html':
        # script src e link href
        scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
        css = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', content)
        imports = scripts + css
        imports = [i for i in imports if i.startswith('./') or i.startswith('../')]

    return imports


def resolve_import_path(import_str: str, file_path: Path, project_root: Path) -> Optional[Path]:
    """
    Tenta resolver o import relativo para um caminho absoluto de arquivo existente.
    """
    if import_str.startswith('./') or import_str.startswith('../'):
        # resolve relativo ao diretório do arquivo
        resolved = (file_path.parent / import_str).resolve()
    else:
        return None

    # Trata import sem extensão (ex: './event_bus')
    if not resolved.suffix:
        for ext in ['.js', '.ts', '.py', '.json']:
            candidate = resolved.with_suffix(ext)
            if candidate.exists():
                return candidate
        # tenta index.js dentro de diretório
        if resolved.is_dir():
            for ext in ['.js', '.ts']:
                candidate = resolved / ('index' + ext)
                if candidate.exists():
                    return candidate
        return None
    else:
        return resolved if resolved.exists() else None


def build_dependency_graph(nodes: List[FileNode], project_root: Path) -> Dict[str, List[str]]:
    """
    Cria mapeamento: nome_canonico -> [lista de nomes canônicos dependidos].
    O nome canônico é o caminho relativo ao project_root.
    """
    node_map = {n.path.resolve(): n for n in nodes if not n.is_dir}

    for node in node_map.values():
        if not node.source or not node.imports:
            continue
        for imp in node.imports:
            resolved = resolve_import_path(imp, node.path, project_root)
            if resolved and resolved in node_map:
                # registra dependência
                dep_node = node_map[resolved]
                node.dependencies.append(str(dep_node.path.relative_to(project_root)))
                dep_node.loaded_by.append(str(node.path.relative_to(project_root)))

    return node_map


def topological_order(nodes: List[FileNode], project_root: Path) -> List[str]:
    """
    Ordena topologicamente os arquivos com base nas dependências.
    Quem não depende de nada vem primeiro (bootloader inicial).
    Retorna lista de caminhos relativos na ordem.
    """
    node_map = {str(n.path.relative_to(project_root)): n for n in nodes if not n.is_dir}
    in_degree = defaultdict(int)
    adj = defaultdict(list)

    # constrói grafo
    for rel, node in node_map.items():
        if rel not in in_degree:
            in_degree[rel] = 0
        for dep in node.dependencies:
            if dep in node_map:
                adj[dep].append(rel)
                in_degree[rel] += 1

    # Kahn's algorithm
    queue = deque([rel for rel, deg in in_degree.items() if deg == 0])
    order = []
    while queue:
        current = queue.popleft()
        order.append(current)
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # se sobraram, adiciona no final (ciclos)
    remaining = [rel for rel, deg in in_degree.items() if deg > 0]
    order.extend(remaining)

    # atribui boot_order
    for idx, rel in enumerate(order):
        node_map[rel].boot_order = idx

    return order


def enrich_nodes(report: TreeReport, root_path: Path, analyze: bool):
    """Faz a leitura dos fontes e análises se --analyze estiver ativo."""
    if not analyze:
        return

    project_root = root_path.resolve()
    # 1. Ler fontes e extrair definições
    for node in report.nodes:
        if node.is_dir:
            continue
        node.source = safe_read_file(node.path)
        if node.source:
            node.classes, node.functions = extract_definitions(node.source, node.extension)
            node.imports = extract_local_imports(node.source, node.extension, project_root, node.path)

    # 2. Construir grafo de dependências
    build_dependency_graph(report.nodes, project_root)
    # 3. Ordem de bootloader
    report.boot_sequence = topological_order(report.nodes, project_root)


# ═══════════════════════════════════════════════════════════════
# CONSTRUÇÃO DA ÁRVORE (versão modificada)
# ═══════════════════════════════════════════════════════════════
def build_tree(root_path: Path, max_depth: int = 10, analyze: bool = False) -> TreeReport:
    report = TreeReport()
    all_nodes = []

    def traverse(path: Path, depth: int):
        if depth > max_depth or not path.is_dir():
            return
        try:
            items = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name))
        except PermissionError:
            return

        for item in items:
            if item.name.startswith('.') or item.name == 'node_modules':
                continue

            node = FileNode(
                path=item,
                name=item.name,
                is_dir=item.is_dir(),
                depth=depth,
                extension=item.suffix.lower() if not item.is_dir() else "",
                size=item.stat().st_size if item.is_file() else 0
            )
            if not item.is_dir():
                node.opcode = OPCODE_MAP.get(node.extension, "0x00")

            all_nodes.append(node)
            if item.is_dir():
                report.total_dirs += 1
            else:
                report.total_files += 1
                report.total_size += node.size
                report.extensions[node.extension] += 1
                report.opcodes_count[node.opcode] += 1
            if depth > report.max_depth:
                report.max_depth = depth

            traverse(item, depth + 1)

    traverse(root_path, 0)

    # Detectar desincronia
    for node in all_nodes:
        node.desincronia = detect_desincronia(node, all_nodes)
        report.desincronia_count += len(node.desincronia)

    report.nodes = all_nodes

    # Enriquecimento só depois que todos os nós existem
    enrich_nodes(report, root_path, analyze)

    return report


# ═══════════════════════════════════════════════════════════════
# IMPRESSÃO DA ÁRVORE (mantida, sem alterações visuais)
# ═══════════════════════════════════════════════════════════════
def print_tree(report: TreeReport, root_name: str = "KOBLLUX_MODULAR"):
    print("\n" + "═" * 76)
    print(color("⧈ KOBLLUX_Δ³ :: CHRONORITHM ATIVADO ⧈", "TITLE"))
    print(color(f"Árvore Fractal: {root_name}", "BOLD"))
    print("═" * 76 + "\n")

    for node in report.nodes:
        indent = "    " * node.depth
        connector = "├── " if node.depth > 0 else ""
        if node.is_dir:
            if "SEMENTE" in node.name:
                print(f"{indent}{connector}{color('📁 ' + node.name + '/', 'BLUE')}")
            elif "CORPO" in node.name:
                print(f"{indent}{connector}{color('📁 ' + node.name + '/', 'GREEN')}")
            elif "ESPIRITO" in node.name:
                print(f"{indent}{connector}{color('📁 ' + node.name + '/', 'YELLOW')}")
            else:
                print(f"{indent}{connector}{color('📁 ' + node.name + '/', 'CYAN')}")
        else:
            opcode_color = {
                "0x01": "BLUE", "0x02": "CYAN", "0x03": "GREEN",
                "0x04": "RED", "0x05": "YELLOW", "0x06": "GOLD",
                "0x07": "GOLD", "0x08": "CYAN", "0x09": "YELLOW",
                "0x0A": "DIM", "0x0B": "DIM", "0x0C": "GOLD"
            }.get(node.opcode, "DIM")
            size_str = f"({node.size} bytes)" if node.size > 0 else ""
            print(f"{indent}{connector}{color(node.name, opcode_color)} {color(size_str, 'DIM')}")
        if node.desincronia:
            for issue in node.desincronia:
                print(f"{indent}    {color('⚠ ' + issue, 'RED')}")

    print("\n" + "─" * 76)
    print(color("📊 RESUMO FRACTAL", "TITLE"))
    print("─" * 76)
    print(f"Total de Arquivos: {color(str(report.total_files), 'BOLD')}")
    print(f"Total de Diretórios: {color(str(report.total_dirs), 'BOLD')}")
    print(f"Profundidade Máxima: {color(str(report.max_depth), 'BOLD')}")
    print(f"Tamanho Total: {color(f'{report.total_size:,} bytes', 'BOLD')}")
    print(f"Desincronias Detectadas: {color(str(report.desincronia_count), 'RED' if report.desincronia_count > 0 else 'GREEN')}")
    print("\n" + color("🔤 EXTENSÕES:", "CYAN"))
    for ext, count in sorted(report.extensions.items(), key=lambda x: -x[1]):
        print(f"  {ext or '(sem)'}: {count}")
    print("\n" + color("⧉ OPCODES APLICADOS:", "GOLD"))
    for opcode, count in sorted(report.opcodes_count.items()):
        print(f"  {opcode}: {count} arquivos")

    total = report.total_files + report.total_dirs
    print("\n" + color("🔢 ASSINATURA MATEMÁTICA:", "TITLE"))
    print(f"  Soma Total: {total}")
    print(f"  Fractal Base: 3 × 6 × 9 × 7 = 1134")
    print(f"  Equação Mestra: VERDADE × INTEGRAR ÷ Δ = ∞")
    print("\n" + "═" * 76)
    print(color("♾️⏜⏝ATIVAR⏜⏝_CHRONORITHM⏜⏝_KOBLLUX⏜⏝♾️", "GOLD"))
    print("═" * 76 + "\n")


# ═══════════════════════════════════════════════════════════════
# EXPORTAÇÃO JSON (agora com campos enriquecidos)
# ═══════════════════════════════════════════════════════════════
def export_json(report: TreeReport, output_path: str):
    data = {
        "total_files": report.total_files,
        "total_dirs": report.total_dirs,
        "total_size": report.total_size,
        "max_depth": report.max_depth,
        "extensions": dict(report.extensions),
        "opcodes_count": dict(report.opcodes_count),
        "desincronia_count": report.desincronia_count,
        "boot_sequence": report.boot_sequence,  # NOVO
        "nodes": []
    }

    for n in report.nodes:
        node_dict = {
            "name": n.name,
            "is_dir": n.is_dir,
            "depth": n.depth,
            "extension": n.extension,
            "size": n.size,
            "opcode": n.opcode,
            "desincronia": n.desincronia,
        }
        if n.source is not None:          # só inclui se análise foi ativada
            node_dict["source"] = n.source
            node_dict["classes"] = n.classes
            node_dict["functions"] = n.functions
            node_dict["imports_raw"] = n.imports
            node_dict["dependencies"] = n.dependencies
            node_dict["loaded_by"] = n.loaded_by
            node_dict["boot_order"] = n.boot_order

        data["nodes"].append(node_dict)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(color(f"[OK] JSON enriquecido exportado em: {output_path}", "GREEN"))


# ═══════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════
def main():
    import argparse
    parser = argparse.ArgumentParser(description="KOBLLUX Δ³ :: Árvore Fractal (enriquecida)")
    parser.add_argument("path", nargs="?", default=".", help="Caminho do diretório")
    parser.add_argument("--max-depth", type=int, default=10, help="Profundidade máxima")
    parser.add_argument("--out-json", help="Exportar relatório JSON")
    parser.add_argument("--no-color", action="store_true", help="Desativar cores ANSI")
    parser.add_argument("--analyze", action="store_true", help="Ler fontes e extrair dependências/classes/bootloader")

    args = parser.parse_args()
    if args.no_color:
        setattr(sys.modules[__name__], "NO_COLOR", True)

    root_path = Path(args.path).resolve()
    if not root_path.exists():
        print(color(f"[ERRO] Caminho não encontrado: {root_path}", "RED"))
        sys.exit(1)

    print(color(f"\n⧈ Analisando: {root_path}", "TITLE"))
    report = build_tree(root_path, args.max_depth, analyze=args.analyze)
    print_tree(report, root_path.name)

    if args.out_json:
        export_json(report, args.out_json)


if __name__ == "__main__":
    main()