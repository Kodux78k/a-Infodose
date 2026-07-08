#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⧈ KOBLLUX_Δ³ :: HTML SCANNER (Estático/Profundo) ⧈
Analisa um arquivo HTML e extrai:
  - IDs e Classes (com fonte: inline ou arquivo CSS/JS)
  - Estilos externos
  - Sequência de scripts (bootloader)
  - Estados globais (window, var, let, const, function, class)
  - Shadow DOMs detectados
  - Dependências entre módulos (se --deep)
Saída JSON enriquecida.
"""

import sys
import json
import re
import os
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict
from typing import List, Dict, Set, Optional
from urllib.parse import urljoin, urlparse

# ----------------------------------------------------------------------
# 1. Parser HTML minimalista (extrai tags relevantes)
# ----------------------------------------------------------------------
class HTMLScanner(HTMLParser):
    def __init__(self, base_path: Path, deep: bool = False):
        super().__init__()
        self.base_path = base_path          # diretório do HTML
        self.deep = deep                    # se True, lê scripts locais
        self.ids: Set[str] = set()
        self.classes: Set[str] = set()
        self.scripts: List[dict] = []       # lista em ordem de aparição
        self.stylesheets: List[str] = []    # hrefs externos
        self.inline_scripts: List[str] = [] # conteúdo de scripts inline
        self.elements_with_shadow = []      # elementos que podem ter shadow (tags com attachShadow)
        self._current_tag = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        # IDs e classes
        if 'id' in attrs_dict:
            self.ids.add(attrs_dict['id'])
        if 'class' in attrs_dict:
            for c in attrs_dict['class'].split():
                self.classes.add(c)

        # Scripts
        if tag == 'script':
            script_info = {
                'src': attrs_dict.get('src', ''),
                'type': attrs_dict.get('type', 'text/javascript'),
                'async': 'async' in attrs_dict,
                'defer': 'defer' in attrs_dict,
                'module': attrs_dict.get('type') == 'module',
                'inline': False,
                'order': len(self.scripts) + 1
            }
            self.scripts.append(script_info)
            self._current_tag = 'script'

        # Estilos externos
        if tag == 'link' and attrs_dict.get('rel') == 'stylesheet':
            href = attrs_dict.get('href')
            if href:
                self.stylesheets.append(href)

        # Possíveis elementos com shadow DOM: custom elements ou tags comuns
        # Guardamos para depois verificar se há attachShadow chamado neles
        # (simplificado: qualquer tag que possa ser um host)
        if tag not in ('html', 'head', 'body', 'script', 'style', 'link', 'meta', 'title', 'br', 'hr'):
            self.elements_with_shadow.append(tag)

    def handle_data(self, data):
        if self._current_tag == 'script':
            # Script inline
            if self.scripts:
                self.scripts[-1]['inline'] = True
                self.scripts[-1]['content'] = data.strip()
                self.inline_scripts.append(data.strip())
        self._current_tag = None

    def handle_endtag(self, tag):
        if tag == 'script':
            self._current_tag = None

# ----------------------------------------------------------------------
# 2. Análise profunda de código JavaScript
# ----------------------------------------------------------------------
def extract_js_globals(code: str) -> Dict[str, List[str]]:
    """
    Extrai variáveis globais, funções, classes de um trecho JS.
    """
    # Remove comentários para evitar falsos positivos
    code_clean = re.sub(r'//.*?$|/\*.*?\*/', '', code, flags=re.MULTILINE|re.DOTALL)

    patterns = {
        'window_assign': r'window\.(\w+)\s*=',
        'var_global': r'(?:^|\n)\s*var\s+(\w+)',
        'let_global': r'(?:^|\n)\s*let\s+(\w+)',
        'const_global': r'(?:^|\n)\s*const\s+(\w+)',
        'function_decl': r'(?:^|\n)\s*(?:async\s+)?function\s+(\w+)',
        'class_decl': r'(?:^|\n)\s*class\s+(\w+)',
    }
    results = defaultdict(list)
    for cat, pat in patterns.items():
        matches = re.findall(pat, code_clean, re.MULTILINE)
        results[cat].extend(matches)
    return results

def analyze_js_file(filepath: Path, base_dir: Path) -> dict:
    """
    Lê um arquivo JS e retorna suas globais e imports/dependências.
    """
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except Exception:
        return {'error': f'Could not read {filepath}'}

    globals_data = extract_js_globals(content)
    # Dependências (imports / require)
    imports = re.findall(r'''from\s+['"]([^'"]+)['"]''', content)
    imports += re.findall(r'''require\(['"]([^'"]+)['"]\)''', content)
    imports += re.findall(r'''import\s+['"]([^'"]+)['"]''', content)

    # Resolve caminhos relativos ao diretório do arquivo
    deps = []
    for imp in imports:
        if imp.startswith('./') or imp.startswith('../'):
            resolved = (filepath.parent / imp).resolve()
            # Se não tiver extensão, tenta .js e /index.js
            if not resolved.suffix:
                for ext in ['.js', '.ts']:
                    candidate = resolved.with_suffix(ext)
                    if candidate.exists():
                        deps.append(str(candidate.relative_to(base_dir)))
                        break
                else:
                    if resolved.is_dir():
                        candidate = resolved / 'index.js'
                        if candidate.exists():
                            deps.append(str(candidate.relative_to(base_dir)))
            else:
                if resolved.exists():
                    deps.append(str(resolved.relative_to(base_dir)))

    # Detecta uso de attachShadow
    has_shadow = 'attachShadow' in content
    return {
        'globals': {k: v for k, v in globals_data.items() if v},
        'imports_raw': imports,
        'dependencies': deps,
        'has_shadow': has_shadow
    }

# ----------------------------------------------------------------------
# 3. Função principal de scanner
# ----------------------------------------------------------------------
def scan_html(html_path: str, deep: bool = False) -> dict:
    html_file = Path(html_path).resolve()
    base_dir = html_file.parent

    with open(html_file, 'r', encoding='utf-8', errors='replace') as f:
        html_content = f.read()

    # Parse HTML
    scanner = HTMLScanner(base_dir, deep=deep)
    scanner.feed(html_content)

    # Preparar relatório
    report = {
        'source': str(html_file),
        'ids': sorted(scanner.ids),
        'classes': sorted(scanner.classes),
        'external_stylesheets': sorted(scanner.stylesheets),
        'scripts': []
    }

    # Dados de scripts (bootloader)
    for scr in scanner.scripts:
        item = {
            'order': scr['order'],
            'src': scr['src'] if not scr['inline'] else 'inline',
            'type': scr['type'],
            'async': scr['async'],
            'defer': scr['defer'],
            'module': scr['module'],
            'inline': scr['inline']
        }
        if scr['inline'] and 'content' in scr:
            # Trunca conteúdo inline para não poluir JSON (opcional)
            item['content_preview'] = scr['content'][:200] + ('...' if len(scr['content'])>200 else '')
        report['scripts'].append(item)

    # Estados globais (apenas se deep)
    global_states = set()
    shadow_dom_detected = False
    dependencies_graph = {}

    if deep:
        # Analisa scripts inline
        for code in scanner.inline_scripts:
            gl = extract_js_globals(code)
            for vals in gl.values():
                global_states.update(vals)
            if 'attachShadow' in code:
                shadow_dom_detected = True

        # Analisa scripts externos locais (não CDN)
        for scr in scanner.scripts:
            if scr['src'] and not scr['inline']:
                # Verifica se é URL externa ou local
                parsed = urlparse(scr['src'])
                if not parsed.scheme or parsed.scheme == 'file':
                    # Caminho relativo ou absoluto local
                    if parsed.scheme == 'file':
                        local_path = Path(parsed.path)
                    else:
                        local_path = (base_dir / scr['src']).resolve()
                    if local_path.exists():
                        js_info = analyze_js_file(local_path, base_dir)
                        global_states.update(js_info.get('globals', {}).get('var_global', []))
                        global_states.update(js_info.get('globals', {}).get('let_global', []))
                        global_states.update(js_info.get('globals', {}).get('const_global', []))
                        global_states.update(js_info.get('globals', {}).get('function_decl', []))
                        global_states.update(js_info.get('globals', {}).get('class_decl', []))
                        if js_info.get('has_shadow'):
                            shadow_dom_detected = True
                        # Adiciona ao grafo de dependências
                        rel_path = str(local_path.relative_to(base_dir))
                        dependencies_graph[rel_path] = {
                            'deps': js_info.get('dependencies', []),
                            'globals': js_info.get('globals', {})
                        }

        report['global_states'] = sorted(global_states)
        report['shadow_dom_detected'] = shadow_dom_detected
        report['dependencies'] = dependencies_graph

    else:
        # Modo superficial: não analisa JS, só IDs e classes
        report['global_states'] = []
        report['shadow_dom_detected'] = False
        report['dependencies'] = {}

    return report

# ----------------------------------------------------------------------
# 4. CLI
# ----------------------------------------------------------------------
def main():
    import argparse
    parser = argparse.ArgumentParser(
        description='KOBLLUX HTML Scanner – Extrai estrutura, bootloader e estados'
    )
    parser.add_argument('input_html', help='Caminho para o arquivo HTML')
    parser.add_argument('--deep', action='store_true',
                        help='Analisar profundamente scripts locais (dependências, globais)')
    parser.add_argument('--out-json', help='Exportar relatório como JSON')
    parser.add_argument('--no-color', action='store_true', help='Desativar cores (placeholder)')
    args = parser.parse_args()

    if not os.path.isfile(args.input_html):
        print(f'[ERRO] Arquivo não encontrado: {args.input_html}')
        sys.exit(1)

    print(f'🔍 Escaneando HTML: {args.input_html} {"(modo profundo)" if args.deep else ""}')
    report = scan_html(args.input_html, deep=args.deep)

    # Exibe resumo no terminal
    print(f'\n🧬 IDs: {len(report["ids"])}')
    print(f'🧬 Classes: {len(report["classes"])}')
    print(f'🌐 Estilos externos: {len(report["external_stylesheets"])}')
    print(f'⚙️ Scripts na sequência: {len(report["scripts"])}')
    if args.deep:
        print(f'🧠 Estados globais detectados: {len(report["global_states"])}')
        print(f'👥 Shadow DOM detectado: {report["shadow_dom_detected"]}')
        print(f'📦 Dependências entre módulos: {len(report["dependencies"])} arquivos analisados')

    if args.out_json:
        with open(args.out_json, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f'✅ Relatório salvo em: {args.out_json}')
    else:
        # Exibe JSON no stdout
        print('\n' + json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()