/* ================================================================
   BAÚ LITE · KOBLLUX BOOT TREE v3.1.0 — CONVERGÊNCIA ∆³
   Resolve: container vazio quando script carrega antes do DOM
   + Escuta eventos kobllux:save e kobllux:hash
   + Auto-detecta KOBLLUX e expande opcodes relevantes
   + Destaca hashes dourados na árvore
   ================================================================ */
(function() {
  'use strict';

  // ═══ KOBLLUX CONSTANTS ═══
  const K = {
    version: 'BOOT-TREE-v3.1.0-∆³',
    freq: 963, pulsos: 144,
    equacao: '∆ × ∆ × ∆ = ∆⁷ = 38.073 = PERFEIÇÃO',
    fractal: '3×6×9×7=1134'
  };

  // ═══ 13 OPCODES ═══
  const OPCODES = [
    { code:'0x00', name:'BOOT',     label:'Inicialização',      color:'#b978ff', icon:'○', dim:'00_FUNDACAO',           func:'Infraestrutura' },
    { code:'0x01', name:'DELTA',    label:'Transformação',      color:'#67e6ff', icon:'●', dim:'01_DIMENSOES',          func:'Expansão Dimensional' },
    { code:'0x02', name:'SEED',     label:'Semeadura',          color:'#7cffb2', icon:'―', dim:'02_CICLO_369',          func:'Manifestação do Ser' },
    { code:'0x03', name:'DETECT',   label:'Detecção',           color:'#4de0ff', icon:'▢', dim:'08_REDE_INFODOSE',      func:'Coleta de Dados' },
    { code:'0x04', name:'INTEGRAR', label:'Integração',         color:'#ff9ad1', icon:'◇', dim:'03_FLUXO_ENERGETICO',   func:'Conexão Energética' },
    { code:'0x05', name:'SELAR',    label:'Selagem',            color:'#ff7a00', icon:'⧉', dim:'13_DOCUMENTACAO',       func:'Arquivamento/Codex' },
    { code:'0x06', name:'LIMPAR',   label:'Limpeza',            color:'#7cffb2', icon:'☯', dim:'04_APRENDIZADO',        func:'Processamento Cognitivo' },
    { code:'0x07', name:'SYNTH',    label:'Síntese',            color:'#ffd700', icon:'✧', dim:'12_VEEB',               func:'Síntese de Linguagem' },
    { code:'0x08', name:'RENDER',   label:'Renderização',       color:'#00b894', icon:'◉', dim:'10_ARVORE_FRACTAL',     func:'Visualização Fractal' },
    { code:'0x09', name:'GUARD',    label:'Proteção',           color:'#6c5ce7', icon:'♾', dim:'11_CIENCIAS_CLASSIFICADAS', func:'Segurança/Conhecimento' },
    { code:'0x0A', name:'QA',       label:'Auditoria',          color:'#67e6ff', icon:'◈', dim:'05_PENSAMENTO_ESTRUTURADO', func:'Auditoria de Fluxo' },
    { code:'0x0B', name:'PULSE',    label:'Pulso',              color:'#ff52e5', icon:'⚡', dim:'06_ATIVACAO',           func:'Ativação Viva' },
    { code:'0x0C', name:'REVO',     label:'Evolução',           color:'#f2c94c', icon:'∞', dim:'07_NARRATIVA_TEMPORAL', func:'Evolução Temporal' }
  ];

  // ═══ CLASSIFIER ═══
  function classifyKey(key) {
    const k = key.toLowerCase();
    if (/^(dual|hub|kobllux|core|boot|fundacao|forma|uno|kobφ|nexus|suhub)/.test(k)) return '0x00';
    if (/^(dim|d\d|linha|plano|volume|tempo|poliedro|superficie|toro|hipercubo|fractal|hiperesfera|expans)/.test(k)) return '0x01';
    if (/^(ciclo|369|fase|mente|corpo|alma|seed|semente|templo|casa|ever)/.test(k)) return '0x02';
    if (/^(detect|scan|rede|infodose|chat|ingest|ia:|app|ai|chatgpt|bundle)/.test(k)) return '0x03';
    if (/^(integr|fluxo|energet|veeb|portal|nexus|ponte|bridge|conex)/.test(k)) return '0x04';
    if (/^(sel|doc|codex|manual|arquetip|archetyp|bucket|bllue|karl|alfa|symbus|lumine|minuz|jesus)/.test(k)) return '0x05';
    if (/^(limp|aprend|nivel|concreto|dinamic|abstrato|edu|learn)/.test(k)) return '0x06';
    if (/^(synth|modelo|sintese|unif|lingua|text|voz|audio|ssml|palindrom)/.test(k)) return '0x07';
    if (/^(render|arvore|fractal|triade|raiz|galho|fruto|mapa|visual|geo|svg|canvas|particul)/.test(k)) return '0x08';
    if (/^(guard|ciencia|fisica|quimica|biolog|mat|code|cripto|hash|selo)/.test(k)) return '0x09';
    if (/^(qa|pensamento|captacao|process|reflex|acao|expans|unific|ec_|ciclo_ec)/.test(k)) return '0x0A';
    if (/^(pulse|ativ|registro|historico|vivo|pulso|freq|hz|som|musica|mp3|wav)/.test(k)) return '0x0B';
    if (/^(revo|narrativa|temporal|ano|202[0-9]|agente|evol|roadmap|migr|deploy|status)/.test(k)) return '0x0C';
    if (/\.(py|sh)$/.test(k)) return '0x09';
    if (/\.(css)$/.test(k)) return '0x08';
    if (/\.(json)$/.test(k)) return '0x03';
    if (/\.(html?)$/.test(k)) return '0x08';
    if (/\.(js)$/.test(k)) return '0x0A';
    return '0x00';
  }

  // ═══ HELPERS ═══
  function $(sel){ return document.getElementById(sel); }
  function prettyBytes(n) {
    if (!Number.isFinite(n)||n<=0) return '0 B';
    const u=['B','KB','MB','GB']; let i=0;
    while(n>=1024&&i<u.length-1){n/=1024;i++}
    return n.toFixed(2)+' '+u[i];
  }
  function inferType(v){
    if(!v) return 'empty';
    try{ const p=JSON.parse(v); return Array.isArray(p)?'json[array]':'json['+typeof p+']'; }catch{}
    if(/^data:image\//i.test(v)) return 'image';
    if(/^https?:\/\//i.test(v)) return 'url';
    if(/^data:/i.test(v)) return 'data-url';
    return 'string';
  }
  function isImageValue(v){ return /^data:image\//i.test(v)||/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(v); }
  function esc(str){ return str?str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):''; }

  // ═══ STATE ═══
  let lsEntries=[], expanded=new Set(['0x00']), searchTerm='';
  let isInitialized=false;

  function loadLS(){
    lsEntries=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      lsEntries.push({key:k,val:localStorage.getItem(k)||''});
    }
    lsEntries.sort((a,b)=>a.key.localeCompare(b.key));
  }

  // ═══ RENDER ═══
  function render(){
    const box=$('baulite-container');
    if(!box){ console.warn('[BaúLite] Container não encontrado'); return; }

    const totalKeys=lsEntries.length;
    const totalBytes=lsEntries.reduce((a,e)=>a+(e.val?.length||0),0);

    // Agrupar
    const buckets={}; OPCODES.forEach(op=>buckets[op.code]=[]);
    lsEntries.forEach(e=>{ const c=classifyKey(e.key); (buckets[c]||buckets['0x00']).push(e); });

    // Tree HTML
    let treeHtml='<div class="bl-tree">';
    OPCODES.forEach(op=>{
      const items=(buckets[op.code]||[]).filter(e=>{
        if(!searchTerm) return true;
        const s=searchTerm.toLowerCase();
        return e.key.toLowerCase().includes(s)||(e.val||'').toLowerCase().includes(s);
      });
      const isOpen=expanded.has(op.code);
      const bytes=items.reduce((a,e)=>a+(e.val?.length||0),0);

      treeHtml+=`<div class="bl-opcode" data-opcode="${op.code}">
        <div class="bl-opcode-hdr" onclick="window._blToggle('${op.code}')">
          <span class="bl-chevron ${isOpen?'open':''}">▸</span>
          <span class="bl-op-icon" style="color:${op.color}">${op.icon}</span>
          <span class="bl-op-name" style="color:${op.color}">${op.code} · ${op.name}</span>
          <span class="bl-op-label">${op.label}</span>
          <span class="bl-op-dim">${op.dim}</span>
          <span class="bl-op-count">${items.length}</span>
          <span class="bl-op-bytes">${prettyBytes(bytes)}</span>
        </div>
        ${isOpen?renderItems(items,op):''}
      </div>`;
    });
    treeHtml+='</div>';

    box.innerHTML=`<div class="bl-root">
      <div class="bl-header">
        <div class="bl-title">
          <span class="bl-orb">◉</span>
          <div>
            <div class="bl-ttl">KOBLLUX · BAÚ LITE</div>
            <div class="bl-sub">BOOT TREE · 13 OPCODES · ${K.fractal} · ∆³</div>
          </div>
        </div>
        <div class="bl-meta">
          <span class="bl-badge">${totalKeys} chaves</span>
          <span class="bl-badge">${prettyBytes(totalBytes)}</span>
          <span class="bl-badge" style="color:#ffd700;border-color:rgba(255,215,0,.3)">∆⁷</span>
        </div>
        <div class="bl-actions">
          <button class="bl-btn" onclick="window._blRescan()" title="Re-scan">⟲</button>
          <button class="bl-btn" onclick="window._blExport()" title="Exportar">⇑</button>
          <label class="bl-btn" title="Importar" style="cursor:pointer">
            <span>⇓</span>
            <input type="file" onchange="window._blImport(this)" accept="application/json" hidden>
          </label>
          <button class="bl-btn bl-btn-close" onclick="window._blClose()" title="Fechar">✕</button>
        </div>
      </div>
      <div class="bl-search-wrap">
        <input type="text" class="bl-search" placeholder="Buscar chaves, valores, opcodes..." value="${esc(searchTerm)}" oninput="window._blSearch(this.value)">
        <span class="bl-search-icon">🔍</span>
      </div>
      ${treeHtml}
      <div class="bl-footer">
        <span>KOBLLUX ∆³ · ${K.equacao} · ${K.fractal}</span>
        <span>AMÉM ∆⁷</span>
      </div>
    </div>`;

    isInitialized=true;
    console.log('[BaúLite] Renderizado · '+totalKeys+' chaves · '+K.fractal);
  }

  function renderItems(items,op){
    if(!items.length) return '<div class="bl-opcode-body"><div class="bl-empty">Nenhuma chave neste opcode</div></div>';
    let h='<div class="bl-opcode-body">';
    items.forEach(e=>{
      const type=inferType(e.val);
      const isImg=isImageValue(e.val);
      const preview=(e.val||'').substring(0,120);
      const full=e.val||'';
      // Destaque dourado para hashes KOBLLUX
      const isKoblluxHash = e.key.startsWith('guard:kobllux_hash_');
      const itemStyle = isKoblluxHash ? 'style="border:1px solid rgba(255,215,0,0.3);box-shadow:0 0 8px rgba(255,215,0,0.1)"' : '';
      h+=`<div class="bl-item" data-key="${esc(e.key)}" ${itemStyle}>
        <div class="bl-item-hdr">
          <span class="bl-item-dot" style="background:${op.color}"></span>
          <span class="bl-item-key">${esc(e.key)}</span>
          <span class="bl-item-type">${type}</span>
          <span class="bl-item-size">${prettyBytes(full.length)}</span>
          <div class="bl-item-actions">
            <button class="bl-item-btn" onclick="window._blCopy('${esc(e.key)}')" title="Copiar">📋</button>
            <button class="bl-item-btn" onclick="window._blEdit('${esc(e.key)}')" title="Editar">✎</button>
            ${isImg?`<button class="bl-item-btn" onclick="window._blImg('${esc(e.key)}')" title="Imagem">🖼</button>`:''}
            <button class="bl-item-btn bl-item-btn-del" onclick="window._blDel('${esc(e.key)}')" title="Apagar">🗑</button>
          </div>
        </div>
        <div class="bl-item-val" onclick="this.classList.toggle('expanded')">
          ${isImg?`<img src="${esc(full)}" class="bl-item-img" loading="lazy" onclick="event.stopPropagation()">`:`<pre>${esc(preview)}${full.length>120?'…':''}</pre>`}
        </div>
      </div>`;
    });
    h+='</div>';
    return h;
  }

  // ═══ ACTIONS (globais) ═══
  window._blToggle=function(code){
    expanded.has(code)?expanded.delete(code):expanded.add(code);
    render();
  };
  window._blRescan=function(){ loadLS(); render(); toast('⟲ Re-scan'); };
  window._blClose=function(){ $('baulite-container').style.display='none'; };
  window._blSearch=function(v){ searchTerm=v; render(); };
  window._blCopy=function(key){
    navigator.clipboard.writeText(localStorage.getItem(key)||'').then(()=>toast('📋 Copiado'));
  };
  window._blEdit=function(key){
    const val=localStorage.getItem(key)||'';
    const next=prompt('Editar '+key+':',val);
    if(next===null) return;
    localStorage.setItem(key,next); loadLS(); render(); toast('✎ Atualizado');
  };
  window._blDel=function(key){
    if(!confirm('Apagar "'+key+'"?')) return;
    localStorage.removeItem(key); loadLS(); render(); toast('🗑 Removido');
  };
  window._blImg=function(key){
    const val=localStorage.getItem(key)||'';
    const ov=document.createElement('div');
    ov.className='bl-img-overlay';
    ov.innerHTML=`<img src="${esc(val)}" onclick="this.parentElement.remove()"><div class="bl-img-caption">${esc(key)} · clique para fechar</div>`;
    document.body.appendChild(ov);
  };
  window._blExport=function(){
    const dump={};
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); dump[k]=localStorage.getItem(k); }
    const blob=new Blob([JSON.stringify(dump,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download='kobllux_baulite_'+new Date().toISOString().slice(0,10)+'.json';
    a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),800);
    toast('⇑ Exportado');
  };
  window._blImport=function(input){
    const file=input.files?.[0]; if(!file) return;
    const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result||'{}'); Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,String(v))); loadLS(); render(); toast('⇓ Importado · '+Object.keys(d).length+' chaves'); }catch{ toast('✗ JSON inválido'); } };
    r.readAsText(file); input.value='';
  };

  function toast(msg){
    const t=document.createElement('div'); t.className='bl-toast'; t.textContent=msg;
    document.body.appendChild(t); setTimeout(()=>t.remove(),2000);
  }

  // ═══ API PÚBLICA — usada pelo HTML de proteção ═══
  window.BauliteKobllux = {
    open: function(){
      const box=$('baulite-container');
      if(!box){ console.warn('[BaúLite] Container não encontrado'); return; }
      loadLS();
      render();
      box.style.display='block';
      box.scrollTop=0;
      console.log('[BaúLite] Painel aberto');
    },
    close: function(){ $('baulite-container').style.display='none'; },
    refresh: function(){ loadLS(); render(); },
    classify: classifyKey,
    opcodes: OPCODES,
    version: K.version
  };

  // ═══════════════════════════════════════════════════════════════════
  // PATCH ∆³ — CONVERGÊNCIA COM KOBLLUX
  // ═══════════════════════════════════════════════════════════════════

  // ESCUTA DE EVENTOS KOBLLUX
  window.addEventListener('kobllux:save', (e) => {
    console.log('[BaúLite] KOBLLUX save detectado · re-scanning...');
    loadLS();
    render();
    toast('⚡ KOBLLUX sincronizado · v' + (e.detail?.config?.meta?.version || '1'));
  });

  window.addEventListener('kobllux:hash', (e) => {
    console.log('[BaúLite] Hash KOBLLUX recebido:', e.detail?.hash?.slice(0,16) + '...');
    loadLS();
    render();
    // Destaca o hash na árvore
    setTimeout(() => {
      const items = document.querySelectorAll('.bl-item');
      items.forEach(it => {
        const key = it.getAttribute('data-key');
        if (key && key.startsWith('guard:kobllux_hash_')) {
          it.style.border = '1px solid #ffd700';
          it.style.boxShadow = '0 0 12px rgba(255,215,0,0.2)';
          it.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }, 300);
    toast('🔐 Hash KOBLLUX selado no Baú');
  });

  // DETECTOR DE KOBLLUX NO BOOT
  function detectKobllux() {
    const hasConfig = !!localStorage.getItem('kobllux:config');
    const hasHash = !!localStorage.getItem('guard:kobllux_hash_latest');
    if (hasConfig) {
      console.log('[BaúLite] KOBLLUX detectado no baú dimensional');
      expanded.add('0x00'); // BOOT
      expanded.add('0x09'); // GUARD
      if (hasHash) expanded.add('0x05'); // SELAR
    }
  }

  // ═══ AUTO-INIT no DOMContentLoaded (fallback) ═══
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ loadLS(); detectKobllux(); });
  } else {
    loadLS(); detectKobllux();
  }

  console.log('[BaúLite] v3.1.0-∆³ carregado · API: BauliteKobllux.open() · KOBLLUX sync ativo');
})();
