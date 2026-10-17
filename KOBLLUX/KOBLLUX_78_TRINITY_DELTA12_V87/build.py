#!/usr/bin/env python3
import re, os
ROOT = os.path.dirname(os.path.abspath(__file__))
tpl = open(os.path.join(ROOT,'index.template.html'),encoding='utf-8').read()
out = re.sub(r'<!-- ⌘component:([^>]+) -->',
  lambda m: open(os.path.join(ROOT,'components',m.group(1)),encoding='utf-8').read(), tpl)
open(os.path.join(ROOT,'index.html'),'w',encoding='utf-8').write(out)
print(f"[build] index.html: {len(out):,} chars")
