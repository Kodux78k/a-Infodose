
        const library = [

{

    id:1,

    name:"Main Engine",

    category:"Core",

    tags:["Main","Bootstrap"],

    url:"https://www.infodose.com.br/js/main.js",

    type:"module"

},

{

    id:2,

    name:"Nephesh",

    category:"Core",

    tags:["Soul"],

    url:"https://www.infodose.com.br/js/modules/nephesh.js",

    type:"module"

},

{

    id:3,

    name:"kodbrain-66",

    category:"IA",

    tags:["Brain","AI"],

    url:"https://www.infodose.com.br/js/kodbrain-66.js",

    type:"module"

},

{

    id:4,

    name:"KOB2 DATA",

    category:"DATA",

    tags:["78K"],

    url:"https://www.infodose.com.br/oiDual/KODUX/78K/DATA/kob2.js",

    type:"script"

},

{

    id:5,

    name:"KOB3 DATA",

    category:"DATA",

    tags:["78K"],

    url:"https://www.infodose.com.br/oiDual/KODUX/78K/DATA/kob3.js",

    type:"script"

},

{

    id:6,

    name:"KOB4 DATA",

    category:"DATA",

    tags:["78K"],

    url:"https://www.infodose.com.br/oiDual/KODUX/78K/DATA/kob4.js",

    type:"script"

},

{

    id:7,

    name:"KOB5 DATA",

    category:"DATA",

    tags:["78K"],

    url:"https://www.infodose.com.br/oiDual/KODUX/78K/DATA/kob5.js",

    type:"module"

},

{

    id:8,

    name:"Module kob2",

    category:"Module",

    tags:["JS"],

    url:"https://www.infodose.com.br/js/modules/kob2.js",

    type:"module"

},

{

    id:9,

    name:"a€ParTKlz",

    category:"Insert",

    tags:["Insert"],

    url:"https://www.infodose.com.br/js/modules/a%E2%82%ACParTKlz.js",

    type:"module"

},

{

    id:10,

    name:"a€ParTKlz Insert",

    category:"Insert",

    tags:["Insert"],

    url:"https://www.infodose.com.br/js/modules/a%E2%82%ACParTKlz-insert.js",

    type:"script"

},

{

    id:11,

    name:"a€Arx",

    category:"ARX",

    tags:["Opcode"],

    url:"https://www.infodose.com.br/js/modules/a%E2%82%ACArx.js",

    type:"script"

},

{

    id:12,

    name:"Archetypes JSON",

    category:"JSON",

    tags:["Archetypes"],

    url:"https://www.infodose.com.br/oiDual/KODUX/78K/DATA/json/archetypes.json",

    type:"json"

},
            { id: 13, name: "Tailwind Components", tags: ["CSS", "HTML"], cdn: "https://cdn...", readme: "https://github.com/...", code: "const x = 1;" },
            { id: 14, name: "Audio Visualizer JS", tags: ["Áudio", "Canvas"], cdn: "https://cdn...", readme: "https://github.com/...", code: "function play() {}" },
            { id: 15, name: "Neural Network Tiny", tags: ["IA"], cdn: "https://cdn...", readme: "https://github.com/...", code: "const model = {};" }
        ];

        const render = (filter = "") => {
            const list = document.getElementById('libraryList');
            list.innerHTML = "";
            const filtered = library.filter(item => 
                item.name.toLowerCase().includes(filter.toLowerCase()) || 
                item.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
            );

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = "bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-indigo-500 transition";
                card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg text-white">${item.name}</h3>
                        <button onclick="alert('Adicionado aos favoritos!')">⭐</button>
                    </div>
                    <div class="flex gap-2 my-3">
                        ${item.tags.map(t => `<span class="bg-indigo-900 text-indigo-200 text-xs px-2 py-1 rounded">${t}</span>`).join('')}
                    </div>
                    <div class="flex gap-2 mt-4">
                        <button onclick="copyToClipboard('${item.cdn}')" class="flex-1 bg-slate-700 p-2 rounded text-sm hover:bg-slate-600">📦 CDN</button>
                        <a href="${item.readme}" target="_blank" class="flex-1 bg-slate-700 p-2 rounded text-sm text-center hover:bg-slate-600">📄 README</a>
                        <button onclick="copyToClipboard('${item.code}')" class="flex-1 bg-indigo-600 p-2 rounded text-sm hover:bg-indigo-500">📋 Código</button>
                    </div>
                `;
                list.appendChild(card);
            });
        };

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => alert("Copiado com sucesso!"));
        }

        document.getElementById('searchInput').addEventListener('input', (e) => render(e.target.value));

        render();
