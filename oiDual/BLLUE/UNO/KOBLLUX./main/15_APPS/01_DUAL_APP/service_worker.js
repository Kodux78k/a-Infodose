

const CACHE="kobllux-v6";


self.addEventListener(

"install",

event=>{


event.waitUntil(

caches.open(CACHE)

);


}

);



self.addEventListener(

"fetch",

event=>{


event.respondWith(

caches.match(

event.request

)

.then(

r=>r || fetch(event.request)

)

);


}

);


