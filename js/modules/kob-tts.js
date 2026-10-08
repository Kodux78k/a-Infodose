
(function(){
"use strict";
const $=s=>document.querySelector(s);
/* ---- holograma no header: 2 linhas (♫ música · 🗣 TTS) ---- */
let holoT;
window.KOB_HOLO=function(kind,idx,text){
  const t=$('#hd2Title'),el=$('#hd2Holo '+(kind==='m'?'.hm':'.ht')); if(!t||!el||!text) return;
  let a=idx,b=idx; while(a>0&&text[a-1]!==' '&&text[a-1]!=='\n')a--; 
  const s=Math.max(0,a-12); const e=Math.min(text.length,idx+22);
  el.textContent=(kind==='m'?'♫ ':'🗣 ')+text.slice(s,e).replace(/\s+/g,' ');
  t.classList.add('holo-on'); clearTimeout(holoT); holoT=setTimeout(()=>{t.classList.remove('holo-on')},2600);
};
/* ---- TTS: troca de voz ao aparecer nome de arquétipo no texto (mesmo com texto longo) ---- */
if('speechSynthesis'in window&&!speechSynthesis.__v81){
  const sp=speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.__v81=1;
  speechSynthesis.speak=function(u){
    try{
      const text=u.text||'', V=window.KBLX_VOICE; if(!V||text.length<3||u.__seg) return sp(u);
      const names=(window.ARCH_LIST||[]).slice().sort((a,b)=>b.length-a.length);
      const re=new RegExp('\\b('+names.join('|')+')\\b','gi'), cuts=[]; let m;
      while((m=re.exec(text))) cuts.push({i:m.index,a:m[1].toUpperCase()});
      let cur=(window.getArch&&getArch())||'KOBLLUX', segs=[], last=0;
      cuts.forEach(c=>{ if(c.i>last){segs.push({t:text.slice(last,c.i),a:cur,o:last});last=c.i;} cur=c.a; });
      segs.push({t:text.slice(last),a:cur,o:last});
      segs=segs.filter(s=>s.t.trim());
      const mixA=a=>{ const A=V.map[a]||{rate:1,pitch:1}, M=window.KOB_MIXVOICE?KOB_MIXVOICE(a):A; return {r:M.rate/(A.rate||1), p:M.pitch/(A.pitch||1)}; };
      if(segs.length<2){ { const x=mixA(segs[0]?segs[0].a:cur); u.rate=Math.max(.5,Math.min(2,u.rate*x.r)); u.pitch=Math.max(.2,Math.min(2,u.pitch*x.p)); } const o=u.onboundary; u.onboundary=e=>{window.KOB_HOLO&&KOB_HOLO('t',e.charIndex||0,text); o&&o.call(u,e)}; return sp(u); }
      segs.forEach((s,k)=>{
        const v=V.forArch(s.a,s.t); v.__seg=1; v.volume=u.volume; { const x=mixA(s.a); v.rate=Math.max(.5,Math.min(2,v.rate*x.r)); v.pitch=Math.max(.2,Math.min(2,v.pitch*x.p)); }
        v.onstart=()=>{ try{window.KOB_ARCHSWITCH&&KOB_ARCHSWITCH(s.a)}catch(e){} if(k===0&&u.onstart)u.onstart.call(u,{}); };
        v.onboundary=e=>{ const ci=(e.charIndex||0)+s.o; window.KOB_HOLO&&KOB_HOLO('t',ci,text); if(u.onboundary)u.onboundary.call(u,Object.assign({},e,{charIndex:ci})); };
        if(k===segs.length-1){ v.onend=e=>u.onend&&u.onend.call(u,e); }
        v.onerror=e=>u.onerror&&u.onerror.call(u,e);
        sp(v);
      });
    }catch(err){ sp(u); }
  };
}
/* ---- loader: barra + pílula enquanto arquivo grande é lido ---- */
const bar=document.createElement('div'); bar.id='kobLoad'; bar.innerHTML='<span>CARREGANDO…</span>'; document.body.appendChild(bar);
let busy=0,showT;
function ld(on){ busy+=on?1:-1; if(busy<0)busy=0; clearTimeout(showT);
  if(busy>0) showT=setTimeout(()=>bar.classList.add('on'),250); else bar.classList.remove('on'); }
window.KOB_LOADING=ld;
['readAsText','readAsArrayBuffer','readAsDataURL'].forEach(fn=>{ const o=FileReader.prototype[fn];
  FileReader.prototype[fn]=function(){ ld(true); this.addEventListener('loadend',()=>ld(false),{once:true}); return o.apply(this,arguments); }; });
['text','arrayBuffer'].forEach(fn=>{ const o=Blob.prototype[fn];
  Blob.prototype[fn]=function(){ if(this.size<200000) return o.call(this); ld(true); return o.call(this).finally(()=>ld(false)); }; });
})();