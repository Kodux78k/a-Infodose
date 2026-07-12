

class RenderEngine{


constructor(container){

this.container=
container;

}



render(data){


const card=
document.createElement(
"section"
);



card.className="render-card";


card.innerHTML=

`

<div>

${data}

</div>

`;



this.container.appendChild(card);


}



}



export default RenderEngine;


