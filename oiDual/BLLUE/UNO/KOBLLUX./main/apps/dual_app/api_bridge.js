

async function askKobllux(message){


let response=

await fetch(

"/core",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(

{

message

}

)

}

);



return response.json();



}



