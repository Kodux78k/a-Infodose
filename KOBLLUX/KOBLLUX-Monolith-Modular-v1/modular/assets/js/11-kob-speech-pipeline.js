
/* [R2] Único dono de speechSynthesis.speak. Estágios por ordem (menor = mais externo):
   flow 5 → voicebase 10 → kca 20 → v81 30 → arch 40 → nativo. Cada estágio: run(u, next) e deve chamar next(u). */
(function(){
  "use strict";
  if(window.KOB_SPEECH||!('speechSynthesis' in window)) return;
  var ss=window.speechSynthesis, native=ss.speak.bind(ss), stages=[];
  function at(i){ return function(u){ return i<stages.length ? stages[i].run(u,at(i+1)) : native(u); }; }
  window.KOB_SPEECH={
    use:function(name,order,run){ stages=stages.filter(function(s){return s.name!==name;}); stages.push({name:name,order:order,run:run}); stages.sort(function(a,b){return a.order-b.order;}); return true; },
    has:function(name){ return stages.some(function(s){return s.name===name;}); },
    list:function(){ return stages.map(function(s){return s.name+':'+s.order;}); }
  };
  window.speechSynthesis.speak = function(u){ return at(0)(u); };
  window.speechSynthesis.speak.__kobPipeline=true;
})();
