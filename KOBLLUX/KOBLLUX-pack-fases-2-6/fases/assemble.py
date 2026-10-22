#!/usr/bin/env python3
"""Injeta as fases 2-6 no monólito, antes do </body> final.
uso: python3 assemble.py ENTRADA.html [SAIDA.html] [--split-tone]
  --split-tone  move o bloco Tone.js (~341 KB, text/plain) para vendor/Tone.js e esvazia o inline
                (o loader da fase 5 busca vendor/Tone.js e cai no CDN se faltar)."""
import sys, os, re
args=[a for a in sys.argv[1:] if not a.startswith('--')]; split='--split-tone' in sys.argv
src=args[0]; out=args[1] if len(args)>1 else src.replace('.html','.upgraded.html')
here=os.path.dirname(os.path.abspath(__file__))
html=open(src,encoding='utf-8',errors='surrogateescape').read()
if 'id="kob-fase2"' in html: sys.exit('já montado (kob-fase2 presente)')
if split:
    m=re.search(r'(<script type="text/plain" id="kob-tone-inline"[^>]*>)(.*?)(</script>)',html,re.S)
    if not m: sys.exit('bloco kob-tone-inline não encontrado')
    d=os.path.join(os.path.dirname(os.path.abspath(out)),'vendor'); os.makedirs(d,exist_ok=True)
    open(os.path.join(d,'Tone.js'),'w',encoding='utf-8').write(m.group(2).strip())
    html=html[:m.start(2)]+'\n'+html[m.end(2):]
tags=''
for n,f in [(2,'fase2-hooks.js'),(3,'fase3-boot.js'),(4,'fase4-webcomponents.js'),(5,'fase5-lazy.js'),(6,'fase6-perf-doctor.js')]:
    js=open(os.path.join(here,f),encoding='utf-8').read()
    assert '</script' not in js.lower()
    tags+='<script id="kob-fase%d">\n%s\n</script>\n'%(n,js)
i=html.rfind('</body>')
if i<0: sys.exit('</body> não encontrado')
open(out,'w',encoding='utf-8',errors='surrogateescape').write(html[:i]+tags+html[i:])
print('ok →',out,'(%d KB)'%(os.path.getsize(out)//1024))
