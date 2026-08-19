(function(){
  // mapeia sufixo (assistant) por key
  const SLUG={kaos:"disruptor",nova:"inspira",genus:"fabricus",pulse:"resona",lumine:"brilhare",serena:"ampara",vitalis:"momentum",atlas:"cartesius",artemis:"naviga",solus:"arcana",rhea:"raizes",aion:"evolutia"};
  const cb=()=>String(Date.now());
  const toast=(m,ok=true)=>{const x=document.createElement("div");x.style.cssText="position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0));transform:translateX(-50%);background:"+(ok?"rgba(18,20,28,.9)":"rgba(80,8,8,.92)")+";color:#eaf1ff;border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px);padding:10px 12px;border-radius:12px;font:600 12px/1.1 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.4);z-index:99999;opacity:0;transition:opacity .25s,transform .25s";x.textContent=m;document.body.appendChild(x);requestAnimationFrame(()=>{x.style.opacity=1;x.style.transform="translateX(-50%) translateY(-4px)";});setTimeout(()=>{x.style.opacity=0;x.style.transform="translateX(-50%) translateY(6px)";setTimeout(()=>x.remove(),260)},2000)};
  const urlJoin=(a,b)=>a.replace(/\/+$/,'')+'/'+b.replace(/^\/+/,'');
  const exists=async(u)=>{try{const r=await fetch(u+(u.includes('?')?'&':'?')+'v='+cb(),{method:"HEAD",cache:"no-store"});return r.ok}catch{return false}};

  // 1) Base candidates automáticos (sem precisar saber repo)
  function makeCandidates(){
    const O=location.origin, P=location.pathname.replace(/index\.html?$/,'');
    // ex: /repo/ ou /sub/dir/ → tenta raiz atual, com/sem docs
    const here = O+P;
    const root = O + (P.split('/').filter(Boolean)[0] ? '/'+P.split('/').filter(Boolean)[0]+'/' : '/');
    // Prioridade: override explícito > aqui > /docs
    const list = [
      // Override por query (?appsBase=https://.../apps/APPS78K/)
      new URLSearchParams(location.search).get('appsBase'),
      // Override global opcional (window.APPS78K_BASE = "https://.../apps/APPS78K/")
      (typeof window!=="undefined" && window.APPS78K_BASE)||null,
      // Caminhos relativos (funcionam em qualquer pasta)
      './apps/APPS78K/', 'apps/APPS78K/',
      './docs/apps/APPS78K/', 'docs/apps/APPS78K/',
      // Absolutos inferidos (raiz do repo atual)
      urlJoin(here,'apps/APPS78K/'),
      urlJoin(here,'docs/apps/APPS78K/'),
      urlJoin(root,'apps/APPS78K/'),
      urlJoin(root,'docs/apps/APPS78K/')
    ].filter(Boolean);
    // unifica e mantém ordem
    return [...new Set(list)];
  }

  async function pickBase(){
    const probe='app_kaos_disruptor.html';
    const C = makeCandidates();
    for(const base of C){
      const abs = base.startsWith('http') ? base : new URL(base, location.href).href;
      if (await exists(urlJoin(abs, probe))) return abs.replace(/\/?$/,'/'); // normaliza com /
    }
    return null;
  }

  function getAPPS(){
    const tag=document.getElementById('APPS_JSON');
    if(!tag) throw new Error("Sem <script id='APPS_JSON'>");
    const data=JSON.parse((tag.textContent||'{}').trim());
    if(!data || !Array.isArray(data.apps)) throw new Error('APPS_JSON.apps inválido');
    return {tag,data};
  }

  function patchAPPS(base){
    const {tag,data}=getAPPS();
    const v=cb();
    for(const it of data.apps){
      const k=String(it.key||'').toLowerCase();
      if(k && SLUG[k]) it.url = urlJoin(base, `app_${k}_${SLUG[k]}.html`) + `?v=${v}`;
    }
    tag.textContent = JSON.stringify(data,null,2);
    window.APPS_JSON = data;
    if(typeof window.reloadCatalog==='function'){ try{ window.reloadCatalog(data); }catch{} }
    return data;
  }

  function retargetOpenIframes(data){
    try{
      const map = new Map(data.apps.map(a=>[String(a.title||a.key||'').toLowerCase(), a.url]));
      document.querySelectorAll('.session iframe').forEach(fr=>{
        try{
          const card=fr.closest('.session');
          const meta=card && card.dataset && card.dataset.meta ? JSON.parse(card.dataset.meta) : null;
          const title=(meta && meta.title ? meta.title : (card && card.querySelector('.title')?.textContent)||'').toLowerCase();
          const u=map.get(title)||null; if(u){ fr.src=u; }
        }catch{}
      });
    }catch{}
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const base = await pickBase();
    if(!base){ toast('APPS78K: não encontrei a pasta dos apps.', false); console.error('[APPS78K] Nenhum baseDir funcionou. Use ?appsBase=https://username.github.io/repo/apps/APPS78K/'); return; }
    try{
      const data = patchAPPS(base);
      retargetOpenIframes(data);
      toast('APPS78K sincronizado');
      console.log('[APPS78K] base =', base, data.apps.map(a=>a.url));
    }catch(e){
      toast('APPS78K: falha ao aplicar patch.', false);
      console.error('[APPS78K] Patch error:', e);
    }
  });
})();