
// REGISTRO DO SERVICE WORKER
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').then(reg=>{
    document.getElementById('swStatus').innerText = '🐐 Gerardo ONLINE e em cache';
  }).catch(()=>{
    document.getElementById('swStatus').innerText = '🐐 Gerardo OFFLINE';
  });
}

function instalarPWA(){
  toast('📲 Adicione na tela inicial pra instalar');
}

function limparCache(){
  caches.delete('domrii-v369');
  toast('🗑️ Cache limpo. Gerardo resetou');
}
