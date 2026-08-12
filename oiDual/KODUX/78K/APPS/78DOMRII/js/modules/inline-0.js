
function startProgress(){
  let v=0; const p=document.getElementById('p');
  const i=setInterval(()=>{v+=5;p.value=v;if(v>=100)clearInterval(i)},100)
}
