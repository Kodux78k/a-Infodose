


----
⚡ KBLX: horus ONLINE
⚡ KBLX: kodux-player ONLINE
⚡ KBLX: hub1 ONLINE
⚡ KBLX: infodose ONLINE
♾️ KBLX REGISTRY+ ATIVO
📡 KBLX EVENT: core:ready 
Object {system: "KBLX", status: "online"}
📡 KBLX EVENT: hub1:connected 
Object {mode: "hybrid"}
📡 KBLX EVENT BUS ONLINE
⚡ KBLX STATE: null → ball
📡 KBLX EVENT: state:change 
Object {previous: null, current: "ball", data: {…}}
🧬 KBLX STATE MANAGER ONLINE
🎵 Kodux Player injetado com sucesso!
Player.js carregado!
Error: Script error.
SyntaxError: Identifier 'CADIAL_ARQUETIPOS' has already been declared
YouTube API ready
⚫ KODUX Player inicializado.
Error: Script error.
(function KOBLLUX_SCANNER() {
    console.log("=== ♾️ ATIVANDO RASTREAMENTO ESTRUTURAL ===");

    // 1. MAPEAMENTO DE IDs E CLASSES (Nativas e Mascaradas)
    const allElements = document.querySelectorAll('*');
    const structure = {
        ids: new Set(),
        classes: new Set(),
        shadowDOMs: [], // Classes/IDs mascaradas em Shadow Roots
        externalStyles: []
    };

    allElements.forEach(el => {
        if (el.id) structure.ids.add(el.id);
        if (el.className && typeof el.className === 'string') {
            el.className.split(/\s+/).forEach(c => {
                if (c) structure.classes.add(c);
            });
        }
        // Identificação de elementos mascarados (Shadow DOM)
        if (el.shadowRoot) {
            structure.shadowDOMs.push(el.tagName.toLowerCase());
        }
    });

    // 2. DETECÇÃO DE CSS EXTERNO (Mapeando a origem das classes)
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            if (sheet.href) structure.externalStyles.push(sheet.href);
        } catch (e) {
            // Ignora erros de CORS (Cross-Origin)
        }
    });

    // 3. SEQUÊNCIA DE BOOTLOADER E ORQUESTRAÇÃO (Scripts)
    const bootloaderSequence = Array.from(document.scripts).map((script, index) => {
        return {
            ordem: index + 1,
            origem: script.src ? script.src : 'Inline (Embutido)',
            carregamento: script.defer ? 'Deferido' : (script.async ? 'Assíncrono' : 'Síncrono/Imediato'),
            tipo: script.type || 'Padrão (text/javascript)'
        };
    });

    // 4. ESTADOS GLOBAIS (States)
    // Filtra chaves globais da window que não são padrão do navegador
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const nativeWindowKeys = Object.keys(iframe.contentWindow);
    document.body.removeChild(iframe);
    
    const customStates = Object.keys(window).filter(key => !nativeWindowKeys.includes(key));

    // --- RELATÓRIO FINAL ---
    console.groupCollapsed("1. 🧬 Estrutura de Classes e IDs");
    console.log("IDs Encontrados:", Array.from(structure.ids));
    console.log("Classes Encontradas:", Array.from(structure.classes));
    console.groupEnd();

    console.groupCollapsed("2. 🌐 Classes Externas e Mascaradas (Shadow DOM)");
    console.log("Folhas de Estilo Externas (Fontes das classes):", structure.externalStyles);
    console.log("Elementos com Shadow DOM (Mascarados):", structure.shadowDOMs);
    console.groupEnd();

    console.groupCollapsed("3. ⚙️ Sequência do Bootloader (Orquestração de Scripts)");
    console.table(bootloaderSequence);
    console.groupEnd();

    console.groupCollapsed("4. 🧠 Estados (States) Globais Detectados");
    console.log("Variáveis e Estados Globais injetados na Window:", customStates);
    console.groupEnd();

    console.log("=== ⚠️ PARA EVENT LISTENERS: LEIA A INSTRUÇÃO ABAIXO ===");
})();
=== ♾️ ATIVANDO RASTREAMENTO ESTRUTURAL ===
1. 🧬 Estrutura de Classes e IDs
IDs Encontrados: 
(85) ["www-widgetapi-script", "eruda", "bodyPlayer", "view-dualtube", "dt-watched-count", "dttab-0", "dttab-1", "dttab-2", "dttab-3", "dttab-4", "dttab-5", "dttab-6", "dtpanel-0", "dt-infodose-grid", "dtpanel-1", "dt-matriz-grid", "dtpanel-2", "dt-freq-grid", "dtpanel-3", "dt-cogn-grid", "dtpanel-4", "dt-medi-grid", "dtpanel-5", "dt-ghv-container", "dt-gh-url", "dt-ghv-grid", "dtpanel-6", "dt-pod-url", "dt-pod-grid", "global-player", "player-frame-wrap", "yt-container", "sc-container", "local-audio", "kodux-widget", "content-ball", "content-preview", "prev-cover", "prev-title", "prev-artist", "prev-play-icon", "content-footer", "footer-progress-click", "footer-progress-bar", "foot-cover", "foot-title", "foot-artist", "foot-play-icon", "content-full", "playlist-tabs", "link-input", "destination-select", "new-playlist-input", "playlist-container", "main-progress", "main-cover", "main-title", "main-artist", "main-play-icon", "toggle-dt-btn", "toggle-dt-icon", "toggle-dt-path", "header-horus-delta", "kx-vinyl", "kx-play-circle", "kx-prev", "kx-next", "kx-collapse", "kx-bolt", "kx-collapse-full", "kx-link", "kx-plus", "kx-folder", "kx-folder-add", "kx-play", "kx-stack", "kx-heart", "kx-heart-fill", "kx-spiral", "kx-playlist", "kx-trash", "kx-disc", "kx-waveform", "kx-pause-circle", "kx-pause"]
0: "www-widgetapi-script"
1: "eruda"
2: "bodyPlayer"
3: "view-dualtube"
4: "dt-watched-count"
5: "dttab-0"
6: "dttab-1"
7: "dttab-2"
8: "dttab-3"
9: "dttab-4"
10: "dttab-5"
11: "dttab-6"
12: "dtpanel-0"
13: "dt-infodose-grid"
14: "dtpanel-1"
15: "dt-matriz-grid"
16: "dtpanel-2"
17: "dt-freq-grid"
18: "dtpanel-3"
19: "dt-cogn-grid"
20: "dtpanel-4"
21: "dt-medi-grid"
22: "dtpanel-5"
23: "dt-ghv-container"
24: "dt-gh-url"
25: "dt-ghv-grid"
26: "dtpanel-6"
27: "dt-pod-url"
28: "dt-pod-grid"
29: "global-player"
30: "player-frame-wrap"
31: "yt-container"
32: "sc-container"
33: "local-audio"
34: "kodux-widget"
35: "content-ball"
36: "content-preview"
37: "prev-cover"
38: "prev-title"
39: "prev-artist"
40: "prev-play-icon"
41: "content-footer"
42: "footer-progress-click"
43: "footer-progress-bar"
44: "foot-cover"
45: "foot-title"
46: "foot-artist"
47: "foot-play-icon"
48: "content-full"
49: "playlist-tabs"
50: "link-input"
51: "destination-select"
52: "new-playlist-input"
53: "playlist-container"
54: "main-progress"
55: "main-cover"
56: "main-title"
57: "main-artist"
58: "main-play-icon"
59: "toggle-dt-btn"
60: "toggle-dt-icon"
61: "toggle-dt-path"
62: "header-horus-delta"
63: "kx-vinyl"
64: "kx-play-circle"
65: "kx-prev"
66: "kx-next"
67: "kx-collapse"
68: "kx-bolt"
69: "kx-collapse-full"
70: "kx-link"
71: "kx-plus"
72: "kx-folder"
73: "kx-folder-add"
74: "kx-play"
75: "kx-stack"
76: "kx-heart"
77: "kx-heart-fill"
78: "kx-spiral"
79: "kx-playlist"
80: "kx-trash"
81: "kx-disc"
82: "kx-waveform"
83: "kx-pause-circle"
84: "kx-pause"
length: 85
[[Prototype]]: Array(0)
Classes Encontradas: 
(155) ["__chobitsu-hide__", "main-wrapper", "screen-panel", "layout-padding", "container", "d-flex", "justify-between", "items-end", "mb-md", "fade-in", "text-title", "text-subtitle", "text-right", "text-count", "text-label-sm", "scroll-x", "gap-sm", "pb-xs", "w-max", "v-pill", "dt-tab", "dt-tab-on", "text-tab", "v-glass", "panel-header", "text-icon-lg", "text-panel-title", "text-panel-desc", "gap-md", "pb-sm", "snap-x", "grid-matriz", "gh-form", "input-gh", "btn-gh", "space-y-6", "helper-text", "font-mono", "flex-col", "overflow-hidden", "player-window-controls", "btn-win", "hover-red", "player", "botao", "player-bg", "yt-overlay", "bg-overlay", "off-screen", "state-ball", "hidden-content", "cover-sm", "hover-scale", "transition-transform", "preview-clickable", "track-info-prev", "text-title-sm", "text-truncate", "glow-text", "text-artist-sm", "btn-play-prev", "transition-base", "progress-area", "progress-fill", "footer-body", "drag-header", "cover-md", "track-info-foot", "text-title-md", "text-artist-md", "ctrl-group", "btn-ctrl", "btn-play-main", "hover-scale-lg", "full-header", "brand-title", "btn-collapse", "full-scroll", "soft-scroll", "mb-sm", "mini-chip", "active", "opacity-60", "cadial-chip", "input-row", "input-wrap", "glass-input", "glass-inp", "glass-select", "glass-sel", "btn-primary", "btn-action", "section-head", "list-group", "flex", "items-center", "gap-3", "p-3", "rounded-2xl", "cursor-pointer", …]
[0 … 99]
[100 … 154]
length: 155
[[Prototype]]: Array(0)
2. 🌐 Classes Externas e Mascaradas (Shadow DOM)
Folhas de Estilo Externas (Fontes das classes): 
Array ["http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"]
0: "http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS_FIRMWARE-+0x01212345_789ABC/code_28062026/KBLX_kodux_all_in_one.css"
length: 1
[[Prototype]]: Array(0)
Elementos com Shadow DOM (Mascarados): 
(2) ["div", "div"]
0: "div"
1: "div"
length: 2
[[Prototype]]: Array(0)
3. ⚙️ Sequência do Bootloader (Orquestração de Scripts)
(index)	carregamento	ordem	origem	tipo
0	"Assíncrono"	1	"https://www.youtube.com/s/player/2837ca40/www-widgetapi.vflset/www-widgetapi.js"	"text/javascript"
1	"Síncrono/Imediato"	2	"http://localhost:26543/eruda.min.js"	"Padrão (text/javascript)"
2	"Síncrono/Imediato"	3	"Inline (Embutido)"	"Padrão (text/javascript)"
3	"Síncrono/Imediato"	4	"https://www.w.soundcloud.com/player/api.js"	"Padrão (text/javascript)"
4	"Síncrono/Imediato"	5	"https://www.youtube.com/iframe_api"	"Padrão (text/javascript)"
5	"Assíncrono"	6	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
6	"Assíncrono"	7	"https://w.soundcloud.com/player/api.js"	"Padrão (text/javascript)"
7	"Assíncrono"	8	"https://www.infodose.com.br/NL/NL--MAIN/player/js/db.js"	"Padrão (text/javascript)"
8	"Assíncrono"	9	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
9	"Assíncrono"	10	"https://www.infodose.com.br/NL/NL--MAIN/player/js/player-0.js"	"Padrão (text/javascript)"
10	"Assíncrono"	11	"https://www.infodose.com.br/NL/NL--MAIN/player/js/idle.js"	"Padrão (text/javascript)"
11	"Síncrono/Imediato"	12	"https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0B.js"	"Padrão (text/javascript)"
12	"Síncrono/Imediato"	13	"https://www.infodose.com.br/NL/NL--MAIN/player/js/db.js"	"Padrão (text/javascript)"
13	"Síncrono/Imediato"	14	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
14	"Síncrono/Imediato"	15	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
15	"Síncrono/Imediato"	16	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
16	"Síncrono/Imediato"	17	"http://localhost:26543/storage/emulated/0/%7BZ%7D+%E2%80%94+%25+ATIVA%C3%87%C3%83O+S%C3%9CMB%C3%9CS…"	"Padrão (text/javascript)"
17	"Síncrono/Imediato"	18	"https://www.infodose.com.br/NL/NL--MAIN/player/js/idle.js"	"Padrão (text/javascript)"
18	"Síncrono/Imediato"	19	"Inline (Embutido)"	"Padrão (text/javascript)"
19	"Síncrono/Imediato"	20	"Inline (Embutido)"	"Padrão (text/javascript)"
20	"Assíncrono"	21	"Inline (Embutido)"	"text/vivo"
21	"Síncrono/Imediato"	22	"Inline (Embutido)"	"module"
Array(22) 
0: Object
1: Object
2: Object
3: Object
4: Object
5: Object
6: Object
7: Object
8: Object
9: Object
10: Object
11: Object
12: Object
13: Object
14: Object
15: Object
16: Object
17: Object
18: Object
19: Object
20: Object
21: Object
length: 22
[[Prototype]]: Array(0)
4. 🧠 Estados (States) Globais Detectados
Variáveis e Estados Globais injetados na Window: 
(61) ["eruda", "scriptUrl", "ttPolicy", "YT", "YTConfig", "onYTReady", "updateOrbVisual", "updateHeader", "setupGestures", "AP", "_ak", "_at2", "_abuildtile", "_atoggle", "_arender", "_asetab", "_acopy", "toast", "uid", "normalizeUrl", "extractYouTubeId", "extractYouTubePlaylistId", "normalizeTrack", "createDefaultDB", "saveDB", "loadDB", "ensureSystemPlaylists", "migrateLegacyIfNeeded", "KOBLLUX_DB", "KOBLLUX_ARCHETYPES", "KBLX", "KoduxShell", "kblx", "toggleDualTube", "SC", "initKoduxPlayer", "openFullFromPreview", "updateWidgetState", "togglePlay", "playNext", "playPrev", "addLink", "collapseToBall", "toggleFavorite", "removeTrack", "quickAddToSelectedPlaylist", "createPlaylist", "onYouTubeIframeAPIReady", "copy", "$", "$$", "$x", "clear", "dir", "table", "keys", "$0", "$1", "$2", "$3", "$4"]
0: "eruda"
1: "scriptUrl"
2: "ttPolicy"
3: "YT"
4: "YTConfig"
5: "onYTReady"
6: "updateOrbVisual"
7: "updateHeader"
8: "setupGestures"
9: "AP"
10: "_ak"
11: "_at2"
12: "_abuildtile"
13: "_atoggle"
14: "_arender"
15: "_asetab"
16: "_acopy"
17: "toast"
18: "uid"
19: "normalizeUrl"
20: "extractYouTubeId"
21: "extractYouTubePlaylistId"
22: "normalizeTrack"
23: "createDefaultDB"
24: "saveDB"
25: "loadDB"
26: "ensureSystemPlaylists"
27: "migrateLegacyIfNeeded"
28: "KOBLLUX_DB"
29: "KOBLLUX_ARCHETYPES"
30: "KBLX"
31: "KoduxShell"
32: "kblx"
33: "toggleDualTube"
34: "SC"
35: "initKoduxPlayer"
36: "openFullFromPreview"
37: "updateWidgetState"
38: "togglePlay"
39: "playNext"
40: "playPrev"
41: "addLink"
42: "collapseToBall"
43: "toggleFavorite"
44: "removeTrack"
45: "quickAddToSelectedPlaylist"
46: "createPlaylist"
47: "onYouTubeIframeAPIReady"
48: "copy"
49: "$"
50: "$$"
51: "$x"
52: "clear"
53: "dir"
54: "table"
55: "keys"
56: "$0"
57: "$1"
58: "$2"
59: "$3"
60: "$4"
length: 61
[[Prototype]]: Array(0)
at: ƒ at()
concat: ƒ concat()
constructor: ƒ Array()
copyWithin: ƒ copyWithin()
entries: ƒ entries()
every: ƒ every()
fill: ƒ fill()
filter: ƒ filter()
find: ƒ find()
findIndex: ƒ findIndex()
findLast: ƒ findLast()
findLastIndex: ƒ findLastIndex()
flat: ƒ flat()
flatMap: ƒ flatMap()
forEach: ƒ forEach()
includes: ƒ includes()
indexOf: ƒ indexOf()
join: ƒ join()
keys: ƒ keys()
lastIndexOf: ƒ lastIndexOf()
length: 61
map: ƒ map()
pop: ƒ pop()
push: ƒ push()
reduce: ƒ reduce()
reduceRight: ƒ reduceRight()
reverse: ƒ reverse()
shift: ƒ shift()
slice: ƒ slice()
some: ƒ some()
sort: ƒ sort()
splice: ƒ splice()
toLocaleString: ƒ toLocaleString()
toReversed: ƒ toReversed()
toSorted: ƒ toSorted()
toSpliced: ƒ toSpliced()
toString: ƒ toString()
unshift: ƒ unshift()
values: ƒ values()
with: ƒ with()
Symbol(Symbol.iterator): undefined
Symbol(Symbol.unscopables): undefined
[[Prototype]]: Object