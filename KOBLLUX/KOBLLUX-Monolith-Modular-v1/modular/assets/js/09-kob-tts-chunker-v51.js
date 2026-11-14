
/* [v5.1] KOB_TTS_CHUNK(texto, max) → pedaços curtos para o SpeechSynthesis.
   Motivo do "limite": Chrome/Android cortam uma utterance longa (~15 s) SEM disparar onend,
   então a cadeia "fim do bloco → próximo bloco" morria. Pedaços ≤ ~220 chars evitam o corte. */
(function(){
  'use strict';
  window.KOB_TTS_CHUNK = function(txt, max){
    max = max || 220;
    var atoms = [];
    function hard(s){                       /* último recurso: por palavra; palavra gigante (URL) é fatiada */
      var cur = '', ws = s.split(' ');
      for (var i = 0; i < ws.length; i++){
        var w = ws[i];
        if (w.length > max){
          if (cur){ atoms.push(cur); cur = ''; }
          for (var k = 0; k < w.length; k += max) atoms.push(w.slice(k, k + max));
          continue;
        }
        if ((cur ? cur.length + 1 : 0) + w.length > max){ atoms.push(cur); cur = w; }
        else cur = cur ? cur + ' ' + w : w;
      }
      if (cur) atoms.push(cur);
    }
    String(txt == null ? '' : txt).split(/\n+/).forEach(function(line){
      line = line.replace(/\s+/g, ' ').trim();
      if (!line) return;
      line.split(/(?<=[.!?…;:])\s+/).forEach(function(sent){
        if (sent.length <= max){ atoms.push(sent); return; }
        sent.split(/(?<=[,)\]—–])\s+/).forEach(function(part){
          if (part.length <= max) atoms.push(part); else hard(part);
        });
      });
    });
    var out = [], buf = '';
    atoms.forEach(function(a){
      if (buf && buf.length + 1 + a.length > max){ out.push(buf); buf = a; }
      else buf = buf ? buf + ' ' + a : a;
    });
    if (buf) out.push(buf);
    return out;
  };
})();
