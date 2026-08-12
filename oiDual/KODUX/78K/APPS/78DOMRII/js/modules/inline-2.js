
// AGENT INSTANCE
const Gerardo = {
  memory: [],
  log(msg){
    document.getElementById('gerardoLog').innerHTML += `> ${msg}<br>`;
    document.getElementById('gerardoLog').scrollTop = 9999;
  },
  ouvir(comando){
    this.log(`Ouvindo: "${comando}"`);
    comando = comando.toLowerCase();
    
    if(comando.includes('clona')){
      const qtd = parseInt(comando.match(/\d+/)) || 1;
      this.clonar(qtd);
    }
    else if(comando.includes('limpa') || comando.includes('zera')){
      this.limpar();
    }
    else if(comando.includes('modal')){
      document.getElementById('demoDialog').showModal();
      this.log(`🐐 Gerardo abriu o modal`);
    }
    else{
      this.log(`🐐 Gerardo: "Não entendi. Tenta: clona 3, limpa, modal"`);
    }
  },
  clonar(qtd){
    const stage = document.getElementById('gerardoStage');
    const template = document.getElementById('cardTemplate');
    for(let i=0;i<qtd;i++){
      stage.appendChild(template.content.cloneNode(true));
    }
    this.log(`🐐 Gerardo clonou ${qtd}x`);
  },
  limpar(){
    document.getElementById('gerardoStage').innerHTML='';
    this.log(`🐐 Gerardo limpou o palco`);
  }
}

function falarComGerardo(){
  const cmd = document.getElementById('gerardoInput').value;
  if(!cmd) return;
  Gerardo.ouvir(cmd);
  document.getElementById('gerardoInput').value = '';
}

function gerardoReset(){
  document.getElementById('gerardoLog').innerHTML = '';
  Gerardo.limpar();
}
