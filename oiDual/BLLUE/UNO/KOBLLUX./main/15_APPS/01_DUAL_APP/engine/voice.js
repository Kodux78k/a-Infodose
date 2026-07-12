

class VoiceEngine{


constructor(){

this.synth=
window.speechSynthesis;

}



speak(text){


let u=
new SpeechSynthesisUtterance(
text
);


u.lang="pt-BR";


this.synth.speak(u);


}


}



export default VoiceEngine;


