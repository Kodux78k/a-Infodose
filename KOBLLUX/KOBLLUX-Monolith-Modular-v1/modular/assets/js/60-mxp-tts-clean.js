
/* Estágio de prioridade 1 no KOB_SPEECH: limpa o texto de toda utterance */
(function(){
  if(!window.KOB_SPEECH || window.KOB_SPEECH.has('text-events')) return;
  window.KOB_SPEECH.use('text-events', 1, (u, next) => {
    try{
      if(u && u.text && window.KOBTextEvents){
        const c = window.KOBTextEvents.cleanForTTS(u.text);
        if(c !== u.text) u.text = c;
      }
    }catch(e){}
    return next(u);
  });
  console.log('[MXP] KOB_SPEECH stage text-events (prio 1)');
})();
