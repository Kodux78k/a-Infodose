
(function(){
  'use strict';
  var root = document.documentElement;
  var LS = 'kob-css-app-v1';
  var $ = function(id){ return document.getElementById(id); };

  function readVar(n){ try{ var v=getComputedStyle(root).getPropertyValue(n); return (v||'').trim(); }catch(e){ return ''; } }
  function normHex(s){
    if(!s) return null; s=s.trim();
    var m=s.match(/#([0-9a-f]{3}|[0-9a-f]{6})/i); if(!m) return null;
    var h=m[1]; if(h.length===3) h=h.split('').map(function(c){return c+c;}).join('');
    return '#'+h.toLowerCase();
  }
  var base = normHex(readVar('--kob-voice-primary'))||normHex(readVar('--a'))||normHex(readVar('--accent'))||normHex(readVar('--sbx-acc'))||'#00f2ff';

  function hexToRgb(h){ h=normHex(h).slice(1); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function rgbToHex(r,g,b){ function x(v){ v=Math.max(0,Math.min(255,Math.round(v))); var s=v.toString(16); return s.length<2?'0'+s:s; } return '#'+x(r)+x(g)+x(b); }
  function lum(h){ var c=hexToRgb(h); return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255; }
  function mixHex(h1,h2,t){ var a=hexToRgb(h1),b=hexToRgb(h2); return rgbToHex(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t); }
  function hexToHsl(h){ var c=hexToRgb(h),r=c[0]/255,g=c[1]/255,b=c[2]/255; var mx=Math.max(r,g,b),mn=Math.min(r,g,b); var hh=0,s=0,l=(mx+mn)/2; if(mx!==mn){ var d=mx-mn; s=l>0.5?d/(2-mx-mn):d/(mx+mn); if(mx===r) hh=(g-b)/d+(g<b?6:0); else if(mx===g) hh=(b-r)/d+2; else hh=(r-g)/d+4; hh/=6; } return [hh*360,s,l]; }
  function hslToHex(h,s,l){ h=((h%360)+360)%360/360; var a=s*Math.min(l,1-l); function f(n){ var k=(n+h*12)%12; var c=l-a*Math.max(-1,Math.min(k-3,Math.min(9-k,1))); return Math.round(255*c); } return rgbToHex(f(0),f(8),f(4)); }
  function hueShift(h,deg){ var c=hexToHsl(h); return hslToHex(c[0]+deg, Math.min(1,c[1]+0.12), Math.max(.45,Math.min(.7,c[2]))); }
  function isLightTheme(){ try{ return (root.getAttribute('data-theme')||'').toLowerCase()==='light'; }catch(e){ return false; } }
  function contrastSafe(h){
    var light = isLightTheme(); var L = lum(h);
    if(light){ return L>0.55 ? mixHex(h,'#000000',0.45) : h; }
    return L<0.45 ? mixHex(h,'#ffffff',0.42) : h;
  }

  var S = { user:base, mode:'misto', border:12, dur:28, fixtx:true, mic:false, amb:false, orb:true };
  try{ var saved=JSON.parse(localStorage.getItem(LS)||'{}'); for(var k in saved){ if(k in S) S[k]=saved[k]; } }catch(e){}
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} }

  function applyUser(h){
    S.user=h;
    root.style.setProperty('--kca-user', h);
    root.style.setProperty('--kca-tx-fixed', contrastSafe(h));
    var inp=$('kca-user-color'); if(inp) inp.value=h;
    var hx=$('kca-user-hex'); if(hx) hx.textContent=h;
    document.querySelectorAll('#kca-presets .kca-sw').forEach(function(sw){ sw.classList.toggle('kca-on', sw.getAttribute('data-c')===h); });
    save();
  }
  function applyMode(m){
    S.mode=m; root.setAttribute('data-kca-mode', m);
    document.querySelectorAll('#kca-mode .kca-btn').forEach(function(b){ b.classList.toggle('kca-on', b.getAttribute('data-mode')===m); });
    save();
  }
  function applyBorder(v){
    S.border=v; var px=(v/10).toFixed(1);
    root.style.setProperty('--kca-border-w', px+'px');
    var el=$('kca-border-v'); if(el) el.textContent=px+'px';
    save();
  }
  function applyDur(v){
    S.dur=v; var s=(v/100).toFixed(2);
    root.style.setProperty('--kca-dur', s+'s');
    var el=$('kca-dur-v'); if(el) el.textContent=s+'s';
    save();
  }
  function applyFixTx(on){
    S.fixtx=on; root.setAttribute('kca-fixtx', on?'on':'off');
    var c=$('kca-fixtx'); if(c) c.checked=on;
    save();
  }

  /* ── estado de fala ── */
  var speaking=false, env=0;
  function setSpeaking(on){
    speaking=!!on;
    if(viz) viz.classList.toggle('kca-pulse', speaking);
  }
  function hookSpeech(){
    if(!('speechSynthesis' in window)) return;
    try{
      if(window.KOB_SPEECH.has('kca')) return;
      window.KOB_SPEECH.use('kca', 20, function(u, next){
        try{
          var s0=u.onstart, e0=u.onend, r0=u.onerror;
          u.onstart=function(ev){ setSpeaking(true); if(s0) return s0.call(this,ev); };
          u.onend=function(ev){ setSpeaking(false); if(e0) return e0.call(this,ev); };
          u.onerror=function(ev){ setSpeaking(false); if(r0) return r0.call(this,ev); };
        }catch(e){}
        return next(u);
      });
      window.speechSynthesis.speak.__kcaHooked=true;
    }catch(e){}
  }
  hookSpeech();
  setInterval(function(){
    try{
      if('speechSynthesis' in window){
        var sp = window.speechSynthesis.speaking || window.speechSynthesis.pending;
        if(sp !== speaking) setSpeaking(sp);
      }
    }catch(e){}
  }, 400);

  /* ── motor de áudio ── */
  var ctx=null, analyser=null, master=null, padGain=null, freq=null, micStream=null, micNode=null;
  function ensureCtx(){
    if(ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    try{
      ctx = new AC();
      master = ctx.createGain(); master.gain.value=1;
      analyser = ctx.createAnalyser(); analyser.fftSize=256; analyser.smoothingTimeConstant=0.8;
      master.connect(ctx.destination);
      master.connect(analyser);
      freq = new Uint8Array(analyser.frequencyBinCount);
      var lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=520; lp.Q.value=0.6;
      padGain = ctx.createGain(); padGain.gain.value=0;
      var o1=ctx.createOscillator(); o1.type='sine'; o1.frequency.value=110;
      var o2=ctx.createOscillator(); o2.type='sine'; o2.frequency.value=164.81; o2.detune.value=4;
      var o3=ctx.createOscillator(); o3.type='triangle'; o3.frequency.value=55; o3.detune.value=-3;
      o1.connect(lp); o2.connect(lp); o3.connect(lp); lp.connect(padGain); padGain.connect(master);
      o1.start(); o2.start(); o3.start();
    }catch(e){ ctx=null; return null; }
    return ctx;
  }
  function fadePad(on){
    if(!ctx || !padGain) return;
    try{
      if(ctx.state==='suspended') ctx.resume();
      var t=ctx.currentTime;
      padGain.gain.cancelScheduledValues(t);
      padGain.gain.setTargetAtTime(on?0.03:0, t, 0.5);
    }catch(e){}
  }
  setInterval(function(){ if(S.amb) fadePad(speaking); }, 500);

  /* ── visualizador: bars (áudio real, cor do usuário) + waveform (trilha sintetizada, 2ª cor) ── */
  var viz=null, panel=$('kca-panel');
  var BARS=12, levels=new Array(BARS).fill(0), phase=0, walk=0;
  function currentUserHex(){ return normHex(readVar('--kca-user'))||'#00f2ff'; }
  function roundRect(c,x,y,w,h,r){
    if(w<2*r) r=w/2; if(h<2*r) r=h/2;
    c.beginPath();
    c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
  }
  function draw(){
    requestAnimationFrame(draw);
    if(!S.orb) return; /* desligado: custo zero (só um early return por frame) */
    var canvas = document.getElementById('kca-orb-mini');
    if(!canvas) return;
    var cctx = canvas.getContext('2d');
    var w=canvas.width, h=canvas.height;
    cctx.clearRect(0,0,w,h);
    env += ((speaking?1:0) - env)*0.04; /* envelope suave da fala sintetizada */
    phase += 0.12; walk += (Math.random()-0.5)*0.2; walk*=0.93;
    var u = currentUserHex();
    var u2 = hueShift(u, 120); /* 2ª cor para a waveform da trilha sintetizada */

    /* camada 1 — bars do áudio real (sensor de microfone / pad ambiental) */
    var real = !!(analyser && freq && (micStream || (padGain && padGain.gain.value>0.001)));
    if(real){
      var grad = cctx.createLinearGradient(0,h,0,0);
      grad.addColorStop(0, u+'22'); grad.addColorStop(1, u);
      cctx.fillStyle = grad;
      var bw = w/BARS;
      for(var i=0;i<BARS;i++){
        var target=0;
        try{ target = freq[Math.min(freq.length-1, 1+Math.floor(i*1.6))]/255; }catch(e){ target=0; }
        levels[i] += (target - levels[i])*0.22;
        var bh = Math.max(1.5, levels[i]*(h-4));
        cctx.globalAlpha = 0.3 + 0.6*levels[i];
        roundRect(cctx, i*bw+1, h-bh-2, bw-2, bh, 1.5);
        cctx.fill();
      }
      cctx.globalAlpha=1;
    } else {
      for(var j=0;j<BARS;j++) levels[j] += (0-levels[j])*0.1;
    }

    /* camada 2 — waveform contínua da trilha sintetizada (SpeechSynthesis), 2ª cor */
    var mid = h/2, amp = (h/2 - 3) * (0.12 + 0.88*env);
    cctx.beginPath();
    for(var x=0; x<=w; x+=2){
      var y = mid + amp*( Math.sin(x*0.12 + phase*2.2)*0.5
                        + Math.sin(x*0.05 - phase*1.7)*0.35
                        + walk*0.3*Math.sin(x*0.21 + phase) );
      if(x===0) cctx.moveTo(x,y); else cctx.lineTo(x,y);
    }
    cctx.strokeStyle = u2;
    cctx.lineWidth = 1.5;
    cctx.shadowColor = u2;
    cctx.shadowBlur = 6;
    cctx.globalAlpha = 0.35 + 0.6*env;
    cctx.stroke();
    cctx.shadowBlur = 0;
    cctx.globalAlpha = 1;
  }
  requestAnimationFrame(draw);

  /* ── injeta o visualizador ao lado do hudStatus (fallback: orb flutuante perto do footer) ── */
  function buildViz(){
    viz = document.createElement('div');
    viz.id='kca-viz';
    viz.title='CSS App · clique para abrir (visualizador + waveform da trilha)';
    viz.innerHTML='<canvas id="kca-orb-mini" width="192" height="36"></canvas>';
    viz.classList.toggle('kca-dim', !S.orb);
    viz.addEventListener('click', function(){ ensureCtx(); if(ctx&&ctx.state==='suspended') ctx.resume(); togglePanel(); });
  }
  function injectViz(){
    if(viz && document.contains(viz)) return true;
    buildViz();
    var host = $('hudStatus') || $('sbHud');
    if(host && host.parentNode){
      try{ host.parentNode.insertBefore(viz, host.nextSibling); return true; }catch(e){}
    }
    var sb = document.querySelector('#symbolBar') || document.querySelector('.symbol-bar');
    if(sb){ try{ sb.appendChild(viz); return true; }catch(e){} }
    /* fallback: flutuante perto do footer */
    viz.classList.add('kca-float');
    document.body.appendChild(viz);
    return true;
  }
  var tries=0;
  var t = setInterval(function(){
    tries++;
    if(injectViz()){ clearInterval(t); }
    if(tries>60){ clearInterval(t); }
  }, 300);
  setInterval(function(){ if(viz && !document.contains(viz)){ viz=null; injectViz(); } }, 1500);

  /* ── painel ancorado no visualizador ── */
  function togglePanel(force){
    var open = (typeof force==='boolean')? force : !panel.classList.contains('kca-open');
    if(open){
      var r = (viz && document.contains(viz)) ? viz.getBoundingClientRect() : {right: window.innerWidth-60, bottom: 70, left: window.innerWidth-360, top: 70};
      var wdt = 300;
      var top = r.bottom + 8;
      if(top + 440 > window.innerHeight) top = Math.max(8, r.top - 440 - 8);
      var left = Math.min(Math.max(8, r.left), window.innerWidth - wdt - 12);
      panel.style.top = top+'px';
      panel.style.left = left+'px';
    }
    panel.classList.toggle('kca-open', open);
    panel.setAttribute('aria-hidden', open?'false':'true');
  }
  if($('kca-close')) $('kca-close').addEventListener('click', function(){ togglePanel(false); });

  function toggleOrb(){
    S.orb=!S.orb;
    if(viz) viz.classList.toggle('kca-dim', !S.orb);
    var btnOrb=$('kca-orb-toggle');
    if(btnOrb){ btnOrb.innerHTML='Visualizador<br>'+(S.orb?'ON':'OFF'); btnOrb.classList.toggle('kca-on', S.orb); }
    save();
  }

  /* ── controles do painel ── */
  var inpColor=$('kca-user-color');
  if(inpColor){ inpColor.addEventListener('input', function(){ applyUser(normHex(inpColor.value)||S.user); }); }
  document.querySelectorAll('#kca-presets .kca-sw').forEach(function(sw){
    sw.addEventListener('click', function(){ applyUser(sw.getAttribute('data-c')); });
  });
  document.querySelectorAll('#kca-mode .kca-btn').forEach(function(b){
    b.addEventListener('click', function(){ applyMode(b.getAttribute('data-mode')); });
  });
  var br=$('kca-border'); if(br) br.addEventListener('input', function(){ applyBorder(parseInt(br.value,10)); });
  var dr=$('kca-dur'); if(dr) dr.addEventListener('input', function(){ applyDur(parseInt(dr.value,10)); });
  var fx=$('kca-fixtx'); if(fx) fx.addEventListener('change', function(){ applyFixTx(fx.checked); });

  var btnMic=$('kca-mic');
  if(btnMic) btnMic.addEventListener('click', function(){
    if(micStream){
      try{ micStream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      try{ if(micNode) micNode.disconnect(); }catch(e){}
      micStream=null; micNode=null; S.mic=false;
      btnMic.innerHTML='Sensor de microfone<br>OFF'; btnMic.classList.remove('kca-on'); save(); return;
    }
    var c=ensureCtx(); if(!c){ btnMic.innerHTML='Áudio<br>indisponível'; return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ btnMic.innerHTML='Sem suporte<br>a mic'; return; }
    btnMic.innerHTML='A autorizar…';
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
      micStream=stream;
      micNode=ctx.createMediaStreamSource(stream);
      micNode.connect(analyser);
      S.mic=true; btnMic.innerHTML='Sensor de microfone<br>ON'; btnMic.classList.add('kca-on'); save();
    }).catch(function(){
      btnMic.innerHTML='Acesso<br>negado'; S.mic=false;
      setTimeout(function(){ btnMic.innerHTML='Sensor de microfone<br>OFF'; }, 1600);
    });
  });

  var btnAmb=$('kca-amb');
  if(btnAmb) btnAmb.addEventListener('click', function(){
    var c=ensureCtx(); if(!c){ btnAmb.innerHTML='Áudio<br>indisponível'; return; }
    if(ctx.state==='suspended') ctx.resume();
    S.amb=!S.amb;
    btnAmb.innerHTML='Pad ambiental<br>'+(S.amb?'ON':'OFF');
    btnAmb.classList.toggle('kca-on', S.amb);
    if(!S.amb) fadePad(false); else fadePad(speaking);
    save();
  });

  var btnTts=$('kca-tts');
  if(btnTts) btnTts.addEventListener('click', function(){
    ensureCtx(); if(ctx && ctx.state==='suspended') ctx.resume();
    if(!('speechSynthesis' in window)){ btnTts.innerHTML='Speech<br>indisp.'; return; }
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance('KOB CSS App ativado. Pilares de cor privado, secundário e soft distribuídos pela interface. Áudio, sensor, visualizador e waveform da trilha sintetizada sincronizados.');
      u.lang='pt-BR'; u.rate=1.05; u.pitch=1;
      var vs=window.speechSynthesis.getVoices();
      if(vs && vs.length){ var v=vs.find(function(x){ return /pt[-_]BR/i.test(x.lang); })||vs.find(function(x){ return /^pt/i.test(x.lang); }); if(v) u.voice=v; }
      window.speechSynthesis.speak(u);
      btnTts.innerHTML='A falar…';
      setTimeout(function(){ btnTts.innerHTML='Testar voz<br>podcast'; }, 2500);
    }catch(e){ btnTts.innerHTML='Erro<br>de áudio'; }
  });

  var btnOrb=$('kca-orb-toggle');
  if(btnOrb) btnOrb.addEventListener('click', toggleOrb);

  try{
    new MutationObserver(function(){ applyUser(S.user); }).observe(root, {attributes:true, attributeFilter:['data-theme']});
  }catch(e){}

  applyUser(S.user);
  applyMode(S.mode);
  applyBorder(S.border);
  applyDur(S.dur);
  applyFixTx(S.fixtx);
  if(btnOrb) btnOrb.classList.toggle('kca-on', S.orb);
})();
