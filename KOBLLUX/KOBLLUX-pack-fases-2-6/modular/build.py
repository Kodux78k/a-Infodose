#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KOBLLUX · build.py — monólito ⇄ pacote modular (reversível, ordem de execução preservada)

  python3 build.py split  MONOLITO.html  PASTA/   # gera index.html + css/ + js/ + vendor/ + manifest.json
  python3 build.py join   PASTA/  SAIDA.html      # reconstrói o monólito (idêntico ao original)
  python3 build.py check  MONOLITO.html           # split → join → compara byte a byte
  python3 build.py css-report PASTA/              # duplicação de CSS (só relatório)

Regras do split:
 • cada <script>/<style> inline vira UM arquivo, no MESMO ponto do HTML (<script src> / <link>), então a
   ordem de execução e de cascata é a do monólito. Atributos (id, data-*, type=module…) são mantidos.
 • <script type="text/plain" id="kob-tone-inline"> (Tone.js, 340 KB) → vendor/Tone.js (tag fica vazia).
 • <script src="https://…"> externos e <style> vazio ficam intocados.
 • nome do arquivo = NNN-<fonte>.ext ; fonte = data-kodux-source / data-inlined-from / id / 1º comentário.
 • 1ª linha de cada arquivo é um cabeçalho '/* @kob-mod … */' (o join remove).
"""
import sys, os, re, json, hashlib, html as H
from html.parser import HTMLParser

ENC = dict(encoding='utf-8', errors='surrogateescape')
RENAME = {'kob-fase2': 'fase2-hooks', 'kob-fase3': 'fase3-boot', 'kob-fase4': 'fase4-webcomponents',
          'kob-fase5': 'fase5-lazy', 'kob-fase6': 'fase6-perf-doctor'}
OVERRIDE = {   # {índice do bloco: 'nome'} — nomes legíveis para blocos sem id/fonte
    4: 'tokens-resize-handle', 5: 'tailwind-utilities-mini', 7: 'orb-core-blobs', 8: 'toaster-hidden-utils',
    9: 'tokens-kblx-core-arch-rules', 10: 'main-oi-Dual', 14: 'main-0RB', 19: 'z-index-tokens',
    20: 'fc-stack-helper', 38: 'kodbllox-p8', 40: 'archetypes-data', 44: 'updateInterface-JSI_22',
    45: 'unified-v3-symbolbar', 46: 'sumbus-pronto-JSI_5', 57: 'kobllux-v78-fullmoon-runtime'}

def slug(s, n=48):
    s = re.sub(r'[^A-Za-z0-9_.\-]+', '-', s).strip('-._')
    return (s[:n] or 'bloco')

def scan(t):
    ls = [0]
    for m in re.finditer('\n', t): ls.append(m.end())
    class P(HTMLParser):
        def __init__(s): super().__init__(convert_charrefs=False); s.items = []; s.cur = None; s.head = True
        def off(s): l, c = s.getpos(); return ls[l - 1] + c
        def handle_starttag(s, tag, attrs):
            if tag == 'body': s.head = False
            if tag in ('script', 'style'):
                st = s.off(); op = s.get_starttag_text()
                s.cur = dict(tag=tag, attrs=dict(attrs), st=st, oe=st + len(op), head=s.head, open=op)
        def handle_endtag(s, tag):
            if s.cur and tag == s.cur['tag']:
                ce = s.off(); s.cur['cs'] = ce; s.cur['en'] = ce + len(tag) + 3; s.items.append(s.cur); s.cur = None
    p = P(); p.feed(t); p.close(); return p.items

def title_of(body):
    m = re.search(r'/\*+\s*(.*?)\s*\*+/', body[:1500], re.S)
    if m:
        s = re.sub(r'[═=─\-*]{3,}', ' ', m.group(1)); s = ' '.join(s.split())
        if len(s) > 3: return s
    m = re.search(r'\n?\s*([#.\w:\[\]>*"=\- ,()]{2,40})\s*\{', body[:600])
    return m.group(1) if m else ''

def name_for(k, it, body):
    if k in OVERRIDE: return OVERRIDE[k]
    a = it['attrs']; i = a.get('id', '')
    if i in RENAME: return RENAME[i]
    for key in ('data-kodux-source', 'data-inlined-from'):
        if a.get(key):
            b = os.path.basename(a[key].split('?')[0]); b = re.sub(r'\.(js|css)$', '', b); return slug(b)
    if i: return slug(i)
    if a.get('data-k-id'): return slug(a['data-k-id'])
    ti = title_of(body)
    return slug(ti) if ti else ('script' if it['tag'] == 'script' else 'style')

def header(n, name, it, k):
    a = it['attrs']; src = a.get('data-kodux-source') or a.get('data-inlined-from') or ''
    return '/* @kob-mod %03d · %s · %s%s%s */' % (n, name, 'head' if it['head'] else 'body',
            ' · type=' + a['type'] if a.get('type') else '', ' · fonte: ' + src if src else '')

def split(src, out):
    t = open(src, **ENC).read(); items = scan(t)
    for d in ('css', 'js', 'vendor'): os.makedirs(os.path.join(out, d), exist_ok=True)
    man, res, cur = [], [], 0
    for k, it in enumerate(items):
        body = t[it['oe']:it['cs']]; a = it['attrs']; op = it['open']; n = k
        skip = (it['tag'] == 'script' and 'src' in a) or (it['tag'] == 'style' and not body.strip())
        if skip:
            man.append(dict(n=n, kind='untouched', tag=it['tag'], id=a.get('id', ''), src=a.get('src', ''))); continue
        name = name_for(k, it, body)
        if it['tag'] == 'script' and a.get('type') == 'text/plain':
            rel = 'vendor/%s' % (name.replace('kob-tone-inline', 'Tone') + '.js' if name == 'kob-tone-inline' else name + '.txt')
            open(os.path.join(out, rel), 'w', **ENC, newline='').write(body.strip('\n') if False else body)
            repl = op[:-1] + ' data-src="%s" data-kob-mod="%03d">' % (rel, n) + '</script>'; kind = 'vendor'
        elif it['tag'] == 'script':
            rel = 'js/%03d-%s.js' % (n, name)
            open(os.path.join(out, rel), 'w', **ENC, newline='').write(header(n, name, it, k) + '\n' + body)
            repl = op[:-1] + ' src="%s" data-kob-mod="%03d">' % (rel, n) + '</script>'; kind = 'js'
        else:
            rel = 'css/%03d-%s.css' % (n, name)
            open(os.path.join(out, rel), 'w', **ENC, newline='').write(header(n, name, it, k) + '\n' + body)
            extra = ''.join(' %s="%s"' % (q, H.escape(v, quote=True)) for q, v in a.items() if q != 'type')
            repl = '<link rel="stylesheet" href="%s" data-kob-mod="%03d"%s>' % (rel, n, extra); kind = 'css'
        res.append(t[cur:it['st']]); res.append(repl); cur = it['en']
        man.append(dict(n=n, kind=kind, tag=it['tag'], id=a.get('id', ''), name=name, file=rel, where='head' if it['head'] else 'body',
                        bytes=len(body.encode('utf-8', 'surrogateescape')), open=op, repl=repl,
                        source=a.get('data-kodux-source') or a.get('data-inlined-from') or ''))
    res.append(t[cur:])
    open(os.path.join(out, 'index.html'), 'w', **ENC, newline='').write(''.join(res))
    json.dump(dict(generator='build.py', blocks=man), open(os.path.join(out, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    n_css = sum(m['kind'] == 'css' for m in man); n_js = sum(m['kind'] == 'js' for m in man)
    print('split ok: %d css · %d js · %d vendor · %d intocados → %s' % (n_css, n_js, sum(m['kind'] == 'vendor' for m in man), sum(m['kind'] == 'untouched' for m in man), out))

def read_mod(path):
    s = open(path, **ENC).read()
    if s.startswith('/* @kob-mod'):
        s = s.split('\n', 1)[1] if '\n' in s else ''
    return s

def join(pdir, outfile):
    man = json.load(open(os.path.join(pdir, 'manifest.json'), encoding='utf-8'))['blocks']
    t = open(os.path.join(pdir, 'index.html'), **ENC).read(); pos = 0; res = []
    for m in man:
        if m['kind'] == 'untouched': continue
        i = t.find(m['repl'], pos)
        if i < 0: raise SystemExit('não achei a tag do módulo %03d (%s) no index.html — foi editada?' % (m['n'], m['file']))
        body = read_mod(os.path.join(pdir, m['file']))
        res.append(t[pos:i]); res.append(m['open'] + body + '</%s>' % m['tag']); pos = i + len(m['repl'])
    res.append(t[pos:])
    open(outfile, 'w', **ENC, newline='').write(''.join(res)); print('join ok →', outfile)

def check(src):
    import tempfile, filecmp
    d = tempfile.mkdtemp(); split(src, d); o = os.path.join(d, '_rebuilt.html'); join(d, o)
    a = hashlib.sha256(open(src, 'rb').read()).hexdigest(); b = hashlib.sha256(open(o, 'rb').read()).hexdigest()
    print('original', a[:16], '| remontado', b[:16], '→', 'IDÊNTICO' if a == b else 'DIFERENTE'); return a == b

# ── CSS: relatório de duplicação (exata) ────────────────────────────────────
def css_rules(s):
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S); out = []; i = 0; n = len(s); depth = 0; start = 0; q = None
    while i < n:
        c = s[i]
        if q:
            if c == '\\': i += 1
            elif c == q: q = None
        elif c in '"\'': q = c
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: out.append(s[start:i + 1]); start = i + 1
        elif c == ';' and depth == 0: out.append(s[start:i + 1]); start = i + 1
        i += 1
    return [x for x in (' '.join(r.split()) for r in out) if x]

def css_report(pdir, apply=False):
    man = json.load(open(os.path.join(pdir, 'manifest.json'), encoding='utf-8'))['blocks']
    blocks = [(m, css_rules(read_mod(os.path.join(pdir, m['file'])))) for m in man if m['kind'] == 'css']
    last = {}
    for bi, (m, rs) in enumerate(blocks):
        for ri, r in enumerate(rs): last[r] = (bi, ri)
    tot = sum(len(r) for _, rs in blocks for r in rs); dup = 0; rows = []; kept = {}
    for bi, (m, rs) in enumerate(blocks):
        d = sum(len(r) for ri, r in enumerate(rs) if last[r] != (bi, ri) and not r.startswith('@import') and not r.startswith('@charset'))
        c = sum(1 for ri, r in enumerate(rs) if last[r] != (bi, ri)); dup += d
        rows.append((m['n'], m['file'], sum(len(r) for r in rs), c, d)); kept[m['n']] = [r for ri, r in enumerate(rs) if last[r] == (bi, ri) or r.startswith('@import') or r.startswith('@charset')]
    print('CSS total (sem comentários): %d KB em %d blocos · duplicado exato removível: %d KB (%d%%)' % (tot // 1024, len(blocks), dup // 1024, 100 * dup // max(1, tot)))
    print('%-5s %-46s %8s %8s %8s' % ('n', 'arquivo', 'KB', 'regras dup', 'KB dup'))
    for n, f, sz, c, d in sorted(rows, key=lambda x: -x[4])[:12]: print('%-5s %-46s %8d %8d %8d' % (n, f[:46], sz // 1024, c, d // 1024))
    if apply:   # variante experimental: 1 arquivo, mesma ordem, duplicatas EXATAS anteriores removidas (a cópia final vence igual)
        out = os.path.join(pdir, 'css', 'kob.bundle.css')
        with open(out, 'w', encoding='utf-8', errors='surrogateescape') as f:
            f.write('/* kob.bundle.css · gerado por build.py css-report --apply · EXPERIMENTAL · ordem original, duplicatas exatas anteriores removidas */\n')
            for m, _ in blocks:
                f.write('\n/* ── %03d %s ── */\n' % (m['n'], m['name'])); f.write('\n'.join(kept[m['n']]) + '\n')
        t = open(os.path.join(pdir, 'index.html'), **ENC).read(); first = True
        for m, _ in blocks:
            if first: t = t.replace(m['repl'], '<link rel="stylesheet" href="css/kob.bundle.css" id="kob-bundle-css">', 1); first = False
            else: t = t.replace(m['repl'], '', 1)
        open(os.path.join(pdir, 'index.bundle.html'), 'w', **ENC, newline='').write(t)
        print('bundle experimental →', out, '(%d KB)' % (os.path.getsize(out) // 1024), '+ index.bundle.html')

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == 'split': split(a[1], a[2])
    elif len(a) >= 3 and a[0] == 'join': join(a[1], a[2])
    elif len(a) >= 2 and a[0] == 'check': sys.exit(0 if check(a[1]) else 1)
    elif len(a) >= 2 and a[0] == 'css-report': css_report(a[1], '--apply' in a)
    else: print(__doc__)
