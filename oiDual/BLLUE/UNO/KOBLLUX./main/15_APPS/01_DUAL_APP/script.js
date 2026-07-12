

const chat =
document.querySelector("#chat");


const input =
document.querySelector("#message");



function render(msg,type){


let div=document.createElement(
"div"
);


div.innerHTML=
type+" "+msg;


chat.appendChild(div);


}




document
.querySelector("#send")
.onclick=()=>{


let value=input.value;


render(
value,
"👤"
);



localStorage.setItem(

"last_message",

value

);



render(

"🌀 Vórtice recebido. Núcleo identificado.",

"💠"

);



};



