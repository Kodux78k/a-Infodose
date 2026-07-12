

class RenderEngine{


render(message){


const box=

document.getElementById(
"response"
);



box.innerHTML=

message;



window.avatar.pulse();



}


}



window.renderer=

new RenderEngine();



