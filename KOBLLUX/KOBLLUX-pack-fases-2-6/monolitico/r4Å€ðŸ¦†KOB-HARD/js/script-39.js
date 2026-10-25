
/* V5 patch: persisted profile-base palette, 30ms accent + 150ms blob transition; player/SymbolBar bridges preserved. */
(function(){
  'use strict';
  if (window.__KOB_PROFILE_RUNTIME_V4__) return;
  window.__KOB_PROFILE_RUNTIME_V4__ = true;
  var root = document.documentElement;
  var body = document.body;
  var STORE_BASE = 'kob:voice:base-arch';
  var STORE_PROFILE = 'kob:profile:base-arch';
  var VOICE_OVERRIDE_KEY = 'kob:voice:override';       /* '0' (padrão, desligado) | '1' */
  var boot = window.__KOB_PROFILE_BOOT__ || {};
  var lock = false, applyingProfile = false, baseColors = null;
  var protectedProps = {
    '--kob-voice-primary':1, '--kob-voice-secondary':1, '--kob-voice-primaryi':1,
    '--active-color':1, '--active-secondary':1, '--active-glow':1,
    '--kob-voice-bg-soft':1, '--kob-voice-outline':1, '--primary':1, '--accent':1, '--arch-color':1
  };
  function isVoiceOverrideOn(){
    try { return localStorage.getItem(VOICE_OVERRIDE_KEY) === '1'; } catch(e){ return false; }
  }
  function norm(v){ return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
  function allProfiles(){
    var out = [], seen = Object.create(null);
    function add(p, key){
      if (!p) return;
      var id = String(p.id || key || p.name || '').trim();
      if (!id) return;
      var k = norm(id);
      if (!k || seen[k]) return;
      seen[k] = true;
      out.push({id:id, name:String(p.name || p.label || id), voice:String(p.voice || p.nome || ''), lang:String(p.lang || 'pt-BR'), rate:Number(p.rate)||1, pitch:Number(p.pitch)||1, color:p.color || (p.theme&&p.theme.primary) || (p.colors&&p.colors.main) || '', secondary:(p.theme&&p.theme.secondary) || (p.colors&&p.colors.secondary) || '', raw:p});
    }
    try { if (typeof ARCHETYPES !== 'undefined' && Array.isArray(ARCHETYPES)) ARCHETYPES.forEach(function(p){add(p);}); } catch(e) {}
    try { if (Array.isArray(window.ARCHETYPES)) window.ARCHETYPES.forEach(function(p){add(p);}); } catch(e) {}
    try { (window.ARCH_LIST || []).forEach(function(k){ add({id:k,name:k},k); }); } catch(e) {}
    try { Object.keys(window.ARCH_MAP || {}).forEach(function(k){ add({id:k,name:k},k); }); } catch(e) {}
    try { Object.keys((window.KBLX_VOICE && window.KBLX_VOICE.map) || {}).forEach(function(k){ var c=window.KBLX_VOICE.map[k]||{}; add({id:k,name:k,voice:c.nome,lang:c.lang,rate:c.rate,pitch:c.pitch},k); }); } catch(e) {}
    return out;
  }
  function findProfile(key){
    var n=norm(key), list=allProfiles();
    return list.find(function(p){return norm(p.id)===n || norm(p.name)===n;}) || null;
  }
  function tok(name){ try { return window.KBLX_TOKVAL ? window.KBLX_TOKVAL(name) : getComputedStyle(root).getPropertyValue(name).trim(); } catch(e){ return ''; } }
  function validHex(c, fallback){
    c=String(c||'').trim();
    if (/^#[0-9a-f]{3}$/i.test(c)) c='#'+c.slice(1).split('').map(function(x){return x+x;}).join('');
    return /^#[0-9a-f]{6}$/i.test(c) ? c : fallback;
  }
  function alphaHex(hex, alpha){ return validHex(hex,'#22D3EE') + alpha; }
  function colorsFor(key){
    var p=findProfile(key), k=String(key||'').toUpperCase(), a=(window.ARCH_MAP||{})[k]||{};
    var known={KOBLLUX:['#22D3EE','#0E7C9E'],ATLAS:['#38BDF8','#1E3A8A'],NOVA:['#F72585','#7209B7'],VITALIS:['#22C55E','#166534'],PULSE:['#EC4899','#831843'],ARTEMIS:['#A855F7','#5B21B6'],SERENA:['#38BDF8','#1E3A8A'],KAOS:['#FACC15','#B45309'],GENUS:['#E5E7EB','#4B5563'],LUMINE:['#FDE047','#CA8A04'],SOLUS:['#0EA5E9','#0369A1'],RHEA:['#22C55E','#166534'],AION:['#4F46E5','#3730A3'],KODUX:['#F97316','#C2410C'],BLLUE:['#3B82F6','#1E40AF'],JESUS:['#FFD700','#7C5C00']};
    var fallback=known[k]||known.KOBLLUX;
    var primary=(p&&p.color) || (p&&p.raw&&p.raw.theme&&p.raw.theme.primary) || (a.tok&&tok(a.tok)) || fallback[0];
    var secondary=(p&&p.secondary) || (k==='INFODOSE'||k==='KOBLLUX' ? tok('--KBLX_F') : tok('--KBLX_I')) || fallback[1];
    return {primary:validHex(primary,fallback[0]), secondary:validHex(secondary,fallback[1]), profile:p};
  }

  /* ── CAMADAS DE ARQUÉTIPO (V5.2) ─────────────────────────────────────────
     html[data-arch] = usuário (paleta-base U1/U2) · body[data-arch] = ativo (A1/A2)
     primary   = U1 distribuída com U2            (identidade do usuário, estável)
     secondary = A1 distribuída com A2            (só o arquétipo ativo mexe aqui)
     fuseA     = U1 na secondary do arquétipo (A2) · fuseB = A1 na secondary do usuário (U2)
     Aninhado: section/iframe com data-arch usa a camada resolvida do pai como "usuário". */
  var LAYER_W = 0.35;
  function hexMix(a,b,t){
    a=validHex(a,'#22D3EE'); b=validHex(b,a);
    var o='#';
    for (var i=1;i<7;i+=2){
      var x=parseInt(a.substr(i,2),16), y=parseInt(b.substr(i,2),16);
      var v=Math.round(x+(y-x)*t); o+=(v<16?'0':'')+v.toString(16);
    }
    return o.toUpperCase();
  }
  function layerFor(P1,P2,A1,A2){
    return {primary:hexMix(P1,P2,LAYER_W), secondary:hexMix(A1,A2,LAYER_W),
            fuseA:hexMix(P1,A2,0.5), fuseB:hexMix(A1,P2,0.5), user:[P1,P2], active:[A1,A2]};
  }
  function layerVars(L){
    return {'--kob-L-primary':L.primary,'--kob-L-secondary':L.secondary,'--kob-L-fuse-a':L.fuseA,'--kob-L-fuse-b':L.fuseB,
            '--kob-L-u1':L.user[0],'--kob-L-u2':L.user[1],'--kob-L-a1':L.active[0],'--kob-L-a2':L.active[1]};
  }
  var NESTED_SEL = 'section[data-arch],iframe[data-arch],[data-arch-layer][data-arch]';
  function paintNested(el){
    var parent=el.parentElement, cs=parent&&getComputedStyle(parent);
    var P1=cs&&cs.getPropertyValue('--kob-L-primary').trim(), P2=cs&&cs.getPropertyValue('--kob-L-secondary').trim();
    if(!P1||!P2){ var u=baseColors||colorsFor('KOBLLUX'); P1=u.primary; P2=u.secondary; }
    var a=colorsFor(el.getAttribute('data-arch')), L=layerFor(P1,P2,a.primary,a.secondary), v=layerVars(L);
    Object.keys(v).forEach(function(k){ el.style.setProperty(k,v[k]); });
    if (el.tagName==='IFRAME') {
      try { var d=el.contentDocument; if(d&&d.documentElement) Object.keys(v).forEach(function(k){ d.documentElement.style.setProperty(k,v[k]); }); } catch(e) {}
      try { el.contentWindow&&el.contentWindow.postMessage({type:'kob:layer',arch:el.getAttribute('data-arch'),layer:L},'*'); } catch(e) {}
    }
    return L;
  }
  function paintAllNested(){ try { document.querySelectorAll(NESTED_SEL).forEach(paintNested); } catch(e) {} }
  function applyBodyLayers(){
    var u=baseColors||colorsFor('KOBLLUX');
    var act=colorsFor((body&&body.getAttribute('data-arch'))||'KOBLLUX');
    var L=layerFor(u.primary,u.secondary,act.primary,act.secondary), v=layerVars(L);
    Object.keys(v).forEach(function(k){ setRootVar(k,v[k]); });
    /* só a secondary segue o arquétipo ativo; a primary permanece ancorada no usuário */
    setRootVar('--kob-voice-primary',L.primary); setRootVar('--kob-voice-primaryi',L.primary);
    setRootVar('--active-color',L.primary); setRootVar('--active-glow',alphaHex(L.primary,'66'));
    setRootVar('--kob-voice-secondary',L.secondary); setRootVar('--active-secondary',L.secondary);
    window.KOBLayers=window.KOBLayers||{};
    window.KOBLayers.current=L;
    paintAllNested();
    return L;
  }
  window.KOBLayers={
    current:null, mix:hexMix, build:layerFor,
    resolve:function(el){ return (el&&el!==document.body&&el!==root)?paintNested(el):applyBodyLayers(); },
    refresh:applyBodyLayers
  };
  function setRootVar(name, value){
    applyingProfile=true;
    try { root.style.setProperty(name, value); } catch(e) {}
    applyingProfile=false;
  }
  function setProfileTheme(key){
    var c=colorsFor(key);
    baseColors=c;
    setRootVar('--kob-profile-primary',c.primary);
    setRootVar('--kob-profile-secondary',c.secondary);
    setRootVar('--kob-profile-gradient','radial-gradient(900px 700px at 50% 10%, '+alphaHex(c.primary,'1A')+' 0%, transparent 80%), radial-gradient(600px 600px at 75% 95%, '+alphaHex(c.secondary,'12')+' 0%, transparent 80%)');
    setRootVar('--kob-voice-primary',c.primary);
    setRootVar('--kob-voice-secondary',c.secondary);
    setRootVar('--kob-voice-primaryi',c.primary);
    setRootVar('--active-color',c.primary);
    setRootVar('--active-secondary',c.secondary);
    setRootVar('--active-glow',alphaHex(c.primary,'66'));
    setRootVar('--kob-blob-primary',c.primary);
    setRootVar('--kob-blob-secondary',c.secondary);
    root.classList.add('kob-profile-theme-lock');
    /* html[data-arch] = arquétipo do usuário (camada de base) */
    try { root.setAttribute('data-arch',String(key||'KOBLLUX').toLowerCase()); } catch(e) {}
    applyBodyLayers();
  }
  function setActiveBlobTheme(key){
    var c=colorsFor(key);
    /* A troca de arquétipo não reescreve a paleta-base do usuário.
       Só muda as duas cores atmosféricas e os acentos explicitamente seletivos. */
    setRootVar('--kob-blob-primary',c.primary);
    setRootVar('--kob-blob-secondary',c.secondary);
    setRootVar('--kob-arch-accent',c.primary);
    setRootVar('--kob-arch-accent-secondary',c.secondary);
    applyBodyLayers();
  }
  function canonicalArch(raw){
    var p=findProfile(raw);
    if (p) {
      var upper=String(p.id||p.name).toUpperCase();
      if ((window.ARCH_MAP||{})[upper]) return upper;
      return upper;
    }
    return String(raw||'KOBLLUX').trim().toUpperCase() || 'KOBLLUX';
  }
  function setActiveArch(raw, persist){
    var arch=canonicalArch(raw);
    if (!body) body=document.body;
    if (body) {
      body.setAttribute('data-arch',arch);
      body.setAttribute('data-voice-arch',arch.toLowerCase());
      body.setAttribute('data-art-voice-active',arch.toLowerCase());
    }
    setActiveBlobTheme(arch);
    var label=document.getElementById('displayArchetypeBadge'); if(label) label.textContent=arch;
    var status=document.getElementById('sbStatus'); if(status) status.textContent=arch;
    if (persist) { try { localStorage.setItem('di_activeArchetype',arch); } catch(e) {} }
    return arch;
  }
  function paintIdentity(value){
    var name=String(value || '').trim();
    if (body) body.setAttribute('data-user',name);
    root.setAttribute('data-user',name);
    var display=name; try { if(name && typeof convertToArtyaski==='function') display=convertToArtyaski(name); } catch(e) {}
    ['displayUserHeader','usernameDisplay','yusernameDisplay'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent=id==='displayUserHeader'?(display||'PILOTO'):name;});
  }
  function installRootColorLock(){
    if (lock || !root || !root.style) return;
    var style=root.style, previous=style.setProperty.bind(style);
    style.setProperty=function(prop,value,priority){
      if (lock && !applyingProfile && protectedProps[prop]) return;
      return previous(prop,value,priority);
    };
    lock=true;
  }
  /* ── VOZ-BASE · só age com o toggle ligado (kob:voice:override) ── */
  var originalVoiceMap=null;
  function expandVoiceProfiles(){
    var voice=window.KBLX_VOICE, map=voice&&voice.map;
    if (!map) return;
    if (!originalVoiceMap) {   /* snapshot único, antes de qualquer alteração */
      originalVoiceMap={};
      Object.keys(map).forEach(function(k){ originalVoiceMap[k]={nome:map[k].nome,lang:map[k].lang,rate:map[k].rate,pitch:map[k].pitch}; });
    }
    allProfiles().forEach(function(p){
      var key=String(p.id||p.name||'').toUpperCase();
      if (!key || map[key]) return;
      var entry={nome:p.voice||'Luciana',lang:p.lang||'pt-BR',rate:Number(p.rate)||1,pitch:Number(p.pitch)||1};
      map[key]=entry;
      if (!originalVoiceMap[key]) originalVoiceMap[key]=Object.assign({},entry);
    });
  }
  function resetVoicesToOriginal(){
    var voice=window.KBLX_VOICE, map=voice&&voice.map;
    if (!map || !originalVoiceMap) return;
    Object.keys(originalVoiceMap).forEach(function(k){
      if (map[k]) { map[k].nome=originalVoiceMap[k].nome; map[k].lang=originalVoiceMap[k].lang; map[k].rate=originalVoiceMap[k].rate; map[k].pitch=originalVoiceMap[k].pitch; }
    });
    if (voice) voice._base=null;
    var status=document.getElementById('kobVoiceBaseStatus');
    if (status) status.textContent='Override desligado — vozes por arquétipo restauradas.';
  }
  function applyVoiceBase(key, persist){
    var voice=window.KBLX_VOICE, map=voice&&voice.map;
    var profile=findProfile(key);
    if (!profile) profile=findProfile('KOBLLUX');
    if (!profile) return false;
    if (persist) { try { localStorage.setItem(STORE_BASE,String(profile.id||profile.name)); } catch(e) {} }
    var select=document.getElementById('kobVoiceBaseSelect'); if(select) select.value=String(profile.id||profile.name);
    var status=document.getElementById('kobVoiceBaseStatus');
    if (!isVoiceOverrideOn()) {   /* sem override: só guarda a preferência, não toca no KBLX_VOICE.map */
      if (status) status.textContent='Base preferida: '+profile.name+' (override desligado — vozes por arquétipo em uso).';
      return false;
    }
    if (map) {
      var baseName=profile.voice || (map[String(profile.id).toUpperCase()]||{}).nome || 'Luciana';
      var baseLang=profile.lang || (map[String(profile.id).toUpperCase()]||{}).lang || 'pt-BR';
      Object.keys(map).forEach(function(k){
        var active=findProfile(k), original=(originalVoiceMap&&originalVoiceMap[k])||map[k]||{};
        map[k].nome=baseName;
        map[k].lang=baseLang;
        map[k].rate=active ? (Number(active.rate)||Number(original.rate)||1) : (Number(original.rate)||1);
        map[k].pitch=active ? (Number(active.pitch)||Number(original.pitch)||1) : (Number(original.pitch)||1);
      });
      voice._base=String(profile.id||profile.name).toUpperCase();
    }
    if (status) status.textContent='Base: '+profile.name+' · '+(profile.voice||'voz padrão')+' · '+(profile.lang||'pt-BR')+' (aplicado a todos os arquétipos).';
    return true;
  }
  function setVoiceOverride(on){
    try { localStorage.setItem(VOICE_OVERRIDE_KEY, on ? '1' : '0'); } catch(e){}
    if (on) {
      expandVoiceProfiles();
      var saved=''; try { saved=localStorage.getItem(STORE_BASE)||''; } catch(e){}
      var select=document.getElementById('kobVoiceBaseSelect');
      applyVoiceBase((select && select.value) || saved || 'KOBLLUX', false);
    } else { resetVoicesToOriginal(); }
    try { window.KBLX_TOAST && window.KBLX_TOAST(on ? '🔊 Override de voz-base ativado' : '🎤 Vozes por arquétipo restauradas'); } catch(e){}
  }
  function installSpeechBaseWrapper(){
    var ss=window.speechSynthesis;
    if(!ss || typeof ss.speak!=='function' || ss.__kobVoiceBaseWrapped) return;
    if(!window.KOB_SPEECH) return;
    window.KOB_SPEECH.use('voicebase', 10, function(utterance, previous){
      if (!isVoiceOverrideOn()) return previous(utterance);   /* OFF: v81-js segue dividindo por arquétipo */
      var key=''; try{key=localStorage.getItem(STORE_BASE)||'';}catch(e){}
      var base=findProfile(key || (window.__KOB_PROFILE_BOOT__&&window.__KOB_PROFILE_BOOT__.arch) || 'KOBLLUX');
      if(!base) return previous(utterance);
      var name=base.voice || 'Luciana', lang=base.lang || 'pt-BR';
      var rawProfiles=[];
      allProfiles().forEach(function(p){
        if(!p.raw || typeof p.raw!=='object' || !('voice' in p.raw)) return;
        if(rawProfiles.some(function(x){return x.raw===p.raw;})) return;
        rawProfiles.push({raw:p.raw,voice:p.raw.voice,lang:p.raw.lang,hadVoice:Object.prototype.hasOwnProperty.call(p.raw,'voice'),hadLang:Object.prototype.hasOwnProperty.call(p.raw,'lang')});
        p.raw.voice=name; p.raw.lang=lang;
      });
      try {
        if(utterance && typeof utterance==='object'){
          utterance.__seg=1;   /* impede o v81-js de re-dividir por arquétipo */
          utterance.lang=lang;
          var voiceObj=window.KBLX_VOICE&&window.KBLX_VOICE.find ? window.KBLX_VOICE.find({nome:name,lang:lang}) : null;
          if(voiceObj) utterance.voice=voiceObj;
        }
        return previous(utterance);
      } finally {
        rawProfiles.forEach(function(x){
          if(x.hadVoice) x.raw.voice=x.voice; else delete x.raw.voice;
          if(x.hadLang) x.raw.lang=x.lang; else delete x.raw.lang;
        });
      }
    });
    ss.__kobVoiceBaseWrapped=true;
  }
  function mountVoiceControl(){
    var host=document.querySelector('#drawerProfile .drawer-body');
    if (!host || document.getElementById('kobVoiceBaseRow')) return;
    var row=document.createElement('div'); row.className='cockpit-item'; row.id='kobVoiceBaseRow';
    var toggleWrap=document.createElement('label'); toggleWrap.className='cockpit-label';
    toggleWrap.style.cssText='display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;margin-bottom:8px';
    var toggleInput=document.createElement('input'); toggleInput.type='checkbox'; toggleInput.id='kobVoiceOverrideToggle';
    toggleInput.style.cssText='width:16px;height:16px;cursor:pointer;accent-color:#22d3ee';
    var toggleText=document.createElement('span'); toggleText.textContent='Forçar voz-base única (override)';
    toggleWrap.appendChild(toggleInput); toggleWrap.appendChild(toggleText); row.appendChild(toggleWrap);
    var controls=document.createElement('div'); controls.id='kobVoiceBaseControls';
    var label=document.createElement('div'); label.className='cockpit-label'; label.textContent='Voz-base do usuário';
    var select=document.createElement('select'); select.id='kobVoiceBaseSelect'; select.setAttribute('aria-label','Escolher arquétipo da voz-base');
    var status=document.createElement('span'); status.id='kobVoiceBaseStatus';
    var test=document.createElement('button'); test.type='button'; test.id='kobVoiceBaseTest'; test.textContent='Testar voz-base';
    controls.appendChild(label); controls.appendChild(select); controls.appendChild(status); controls.appendChild(test);
    row.appendChild(controls); host.appendChild(row);
    function refresh(){
      var keep=select.value || ''; var list=allProfiles();
      select.textContent='';
      list.forEach(function(p){var opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name+' — '+(p.voice||'voz-base')+' ('+(p.lang||'pt-BR')+')';select.appendChild(opt);});
      var saved=''; try{saved=localStorage.getItem(STORE_BASE)||'';}catch(e){}
      var chosen=saved || keep || (window.__KOB_PROFILE_BOOT__&&window.__KOB_PROFILE_BOOT__.arch) || (body&&body.dataset.arch) || 'KOBLLUX';
      var found=list.find(function(p){return norm(p.id)===norm(chosen)||norm(p.name)===norm(chosen);});
      if(found) select.value=found.id;
      if(!select.value && select.options.length) select.value=select.options[0].value;
    }
    select.addEventListener('change',function(){applyVoiceBase(select.value,true);});
    test.addEventListener('click',function(){
      var p=findProfile(select.value)||findProfile('KOBLLUX');
      var msg='Esta é a voz-base '+(p?p.name:'KOBLLUX')+'. A modulação do arquétipo ativo continua habilitada.';
      try { if(window.KOBBus&&typeof window.KOBBus.say==='function') window.KOBBus.say(msg,{rate:1}); else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(msg); var c=p||{};u.lang=c.lang||'pt-BR';u.rate=Number(c.rate)||1;u.pitch=Number(c.pitch)||1;var cfg={nome:c.voice||'',lang:c.lang||'pt-BR'};var v=window.KBLX_VOICE&&window.KBLX_VOICE.find?window.KBLX_VOICE.find(cfg):null;if(v)u.voice=v;speechSynthesis.speak(u);} } catch(e) {}
    });
    refresh();
    toggleInput.checked=isVoiceOverrideOn();
    controls.style.display=toggleInput.checked?'':'none';
    toggleInput.addEventListener('change',function(){ setVoiceOverride(toggleInput.checked); controls.style.display=toggleInput.checked?'':'none'; });
    if (toggleInput.checked) applyVoiceBase(select.value || 'KOBLLUX', false);
    else status.textContent='Override desligado — vozes por arquétipo em uso. Ative acima para forçar uma voz única.';
  }
  function bindPlayer(){
    var p=document.getElementById('sbxPlayerBtn');
    if(p && !p.dataset.kobPlayerBridge){
      p.dataset.kobPlayerBridge='1';
      p.addEventListener('click',function(ev){
        ev.preventDefault(); ev.stopPropagation(); if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();
        var url=p.dataset.playerUrl || 'https://youtu.be/Bt_rLbMjJDk';
        var title=p.dataset.playerTitle || 'Player';
        try { if(window.Player && typeof window.Player.play==='function') { window.Player.play(url,title); return; } } catch(e) {}
        miniPlayer().play(url,title);
      },true);
    }
  }
  function miniPlayer(){
    if(window.Player && typeof window.Player.play==='function') return window.Player;
    var api={_type:null,_detect:function(src){return String(src||'');},play:function(src,title){
      var gp=document.getElementById('global-player'), fw=document.getElementById('player-frame-wrap'); if(!gp||!fw)return false;
      var u=String(src||'').trim(); if(!/^https?:\/\//i.test(u) && !/^[A-Za-z0-9_-]{6,}$/.test(u)) return false;
      var id='';
      try { var parsed=new URL(u,location.href); if(/youtu\.be$/i.test(parsed.hostname)) id=parsed.pathname.split('/').filter(Boolean)[0]||''; else if(/youtube\.com$/i.test(parsed.hostname)||/youtube-nocookie\.com$/i.test(parsed.hostname)) id=parsed.searchParams.get('v') || ((parsed.pathname.match(/\/embed\/([^/]+)/)||[])[1]) || ''; } catch(e) {}
      if(!id && /^[A-Za-z0-9_-]{6,}$/.test(u)) id=u;
      if(id) fw.innerHTML='<iframe loading="lazy" title="'+String(title||'YouTube Player').replace(/[&<>"']/g,'')+'" width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&controls=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      else if (/\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(u)) fw.innerHTML='<audio controls autoplay playsinline style="width:100%" src="'+u.replace(/"/g,'%22')+'"></audio>';
      else if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) fw.innerHTML='<video controls autoplay playsinline style="width:100%;height:100%" src="'+u.replace(/"/g,'%22')+'"></video>';
      else { try{window.open(u,'_blank','noopener');}catch(e){} return false; }
      gp.classList.remove('hidden','minimized'); gp.classList.add('active'); this._type=id?'yt':'media'; return true;
    },minimize:function(){var gp=document.getElementById('global-player');if(gp)gp.classList.toggle('minimized');},expand:function(){var gp=document.getElementById('global-player');if(!gp)return;var el=gp.querySelector('iframe,video,audio')||gp;var fn=el.requestFullscreen||el.webkitRequestFullscreen;if(fn){try{fn.call(el);return;}catch(e){}}gp.classList.toggle('player-fullscreen');},stop:function(){var gp=document.getElementById('global-player'),fw=document.getElementById('player-frame-wrap');if(fw)fw.textContent='';if(gp){gp.classList.remove('active','minimized','player-fullscreen');gp.classList.add('hidden');setTimeout(function(){gp.classList.remove('hidden');},250);}}};
    window.Player=api; return api;
  }
  function installPlayer(){
    try { if (typeof Player !== 'undefined' && Player && typeof Player.play==='function') window.Player=Player; } catch(e) {}
    if (!window.Player || typeof window.Player.play!=='function') miniPlayer();
    bindPlayer();
  }
  function installArchSync(){
    var initial=canonicalArch((boot.arch || '').trim() || 'KOBLLUX');
    try { if(window.applyArch && (window.ARCH_MAP||{})[initial]) window.applyArch(initial); } catch(e) {}
    setActiveArch(initial,false);
    var profileBase='';
    try { profileBase=localStorage.getItem(STORE_PROFILE)||''; } catch(e) {}
    profileBase=canonicalArch(profileBase || (boot.arch||'').trim() || (body&&body.getAttribute('data-arch')) || root.getAttribute('data-arch') || 'KOBLLUX');
    setProfileTheme(profileBase);
    try { if(!localStorage.getItem(STORE_PROFILE)) localStorage.setItem(STORE_PROFILE,profileBase); } catch(e) {}
    installRootColorLock();
    /* [R2] applyArch tem 1 único wrapper: KOB.installArch (kob-fase2), idempotente. O persist de setActiveArch(name,true)
       já corre pelo listener 'kob:arch' abaixo (o wrapper local aqui era código morto: a Fase 2 já marcava a flag de wrapper). */
    try { if(window.KOB && typeof window.KOB.installArch==='function') window.KOB.installArch(); } catch(e) {}
    var lastVoice='';
    var observer=new MutationObserver(function(records){
      records.forEach(function(r){
        if(r.attributeName==='data-voice-arch'){
          var v=body.getAttribute('data-voice-arch')||'';
          if(v && v!==lastVoice){lastVoice=v;setActiveArch(v,true);}
        } else if(r.attributeName==='data-arch'){
          setActiveBlobTheme(body.getAttribute('data-arch')||initial);
        } else if(r.attributeName==='data-art') {
          setActiveBlobTheme(body.getAttribute('data-art')||body.getAttribute('data-arch')||initial);
        }
      });
    });
    observer.observe(body,{attributes:true,attributeFilter:['data-voice-arch','data-arch','data-art']});
    var nestedObs=new MutationObserver(function(rs){ rs.forEach(function(r){ var t=r.target; if(t!==body&&t!==root&&t.matches&&t.matches(NESTED_SEL)) paintNested(t); }); });
    nestedObs.observe(document.documentElement,{attributes:true,attributeFilter:['data-arch'],subtree:true});
    document.addEventListener('load',function(e){ var t=e.target; if(t&&t.tagName==='IFRAME'&&t.matches(NESTED_SEL)) paintNested(t); },true);
    paintAllNested();
    window.addEventListener('kob:arch',function(e){var a=e&&e.detail&&e.detail.arch;if(a)setActiveArch(a,true);});
    paintIdentity(boot.user || (function(){try{return localStorage.getItem('di_userName')||'';}catch(e){return '';}})());
    var input=document.getElementById('inputUserId');
    if(input){ if(!input.value && boot.user) input.value=boot.user; input.addEventListener('input',function(){var v=input.value.trim();paintIdentity(v);try{localStorage.setItem('di_userName',v);}catch(e){}}); }
    var savedVoice=''; try{savedVoice=localStorage.getItem(STORE_BASE)||'';}catch(e){}
    expandVoiceProfiles();
    mountVoiceControl();
    installSpeechBaseWrapper();
    if (isVoiceOverrideOn()) { if(savedVoice) applyVoiceBase(savedVoice,false); else applyVoiceBase(initial,true); }
    window.KOBProfile={setArch:function(name){return typeof window.applyArch==='function'?window.applyArch(name):setActiveArch(name,true);},setTheme:setProfileTheme,setProfileBase:function(name,persist){var key=canonicalArch(name);setProfileTheme(key);if(persist!==false){try{localStorage.setItem(STORE_PROFILE,key);}catch(e){}}return key;},setVoiceBase:applyVoiceBase,setVoiceOverride:setVoiceOverride,isVoiceOverrideOn:isVoiceOverrideOn,paintIdentity:paintIdentity,get arch(){return body&&body.dataset.arch;},get profileBase(){try{return localStorage.getItem(STORE_PROFILE)||'';}catch(e){return ''; }},get voiceBase(){try{return localStorage.getItem(STORE_BASE)||'';}catch(e){return '';}}};
  }
  installPlayer();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){installPlayer();mountVoiceControl();},{once:true});
  window.addEventListener('load',function(){
    /* deixa os inicializadores legados terminarem antes de fixar o tema-base do perfil */
    setTimeout(function(){installArchSync();mountVoiceControl();installPlayer();},80);
  },{once:true});
  if(document.readyState==='complete') setTimeout(function(){installArchSync();mountVoiceControl();installPlayer();},80);
})();
