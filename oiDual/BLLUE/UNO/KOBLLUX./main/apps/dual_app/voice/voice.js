

function speak(text){


let speech=

new SpeechSynthesisUtterance(text);


speech.lang="pt-BR";


speech.rate=1;


speechSynthesis.speak(

speech

);


}



function activateVoice(){


speak(

"Eu sou KOBLLUX Dual Infodose. O núcleo está ativo."

);


}



