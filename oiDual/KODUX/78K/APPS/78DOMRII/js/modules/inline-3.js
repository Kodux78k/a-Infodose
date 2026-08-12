
// WORKER ENGINE
let gerardoWorker;

function initWorker(){
  const workerCode = `
    self.onmessage = function(e){
      let total = 0;
      const start = Date.now();
      for(let i=0;i<e.data;i++) total += i;
      const time = Date.now() - start;
      self.postMessage({result: total, loops: e.data, time: time});
    }
  `;
  const blob = new Blob([workerCode], {type: 'application/javascript'});
  gerardoWorker = new Worker(URL.createObjectURL(blob));

  gerardoWorker.onmessage = (e) => {
    document.getElementById('workerStatus').innerText = `Status: Ocioso - ${e.data.time}ms`;
    document.getElementById('workerResult').innerText = `🐐 Gerardo: Somei ${e.data.loops.toLocaleString()} em ${e.data.time}ms. Resultado: ${e.data.result.toLocaleString()}`;
  }
}

function gerardoPensar(n){
  if(!gerardoWorker) initWorker();
  document.getElementById('workerStatus').innerText = `Status: Pensando ${n.toLocaleString()}x...`;
  document.getElementById('workerResult').innerText = '';
  gerardoWorker.postMessage(n);
}
