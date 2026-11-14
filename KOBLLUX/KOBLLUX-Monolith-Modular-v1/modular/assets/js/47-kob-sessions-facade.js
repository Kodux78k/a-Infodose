
/* [R3] Ponto único de acesso às sessões/abas — só alias (getters), nenhuma lógica nova, nenhum listener.
   Estado real continua onde estava: abas = TabStore (localStorage kobllux:tabs, já compartilhado por MXP e iFSw);
   registro de nós = KobluxEngine (kobllux:nodes); engines = MXP / iFSw / DualSession / KOBWorkspace (APIs antigas intactas). */
(function(W){
  "use strict";
  var KOB=W.KOB; if(!KOB||KOB.sessions) return;
  function def(o,k,get){ try{ Object.defineProperty(o,k,{get:get,enumerable:true,configurable:true}); }catch(e){} }
  var S={};
  def(S,'nodes',function(){return W.KobluxEngine;});
  def(S,'tabs',function(){return W.TabStore;});
  def(S,'mxp',function(){return W.MXP;});
  def(S,'ifsw',function(){return W.iFSw;});
  def(S,'dual',function(){return W.DualSession;});
  def(S,'workspace',function(){return W.KOBWorkspace;});
  KOB.sessions=S;
  def(KOB,'tabs',function(){return W.TabStore;});
})(window);
