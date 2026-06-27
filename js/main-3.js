console.log(
  "Infodose conectado main 7-9 TE AMO DUAL! kob on ativar Ayor ahhahah. kob depois do in6 antes do 7-9",
  {
    ts: 1778715871351,
    id: "348fab2c-a5ef-4d12-8e5b-3fde8577db6a",
    meta: { app: "generated.app" }
  }
);




import "./modules/inline-00-arx.js";
import "./modules/archz.js";

import "./modules/inline-1.js";
import "./modules/inline-2.js";
import "./modules/inline-3.js";
import "./modules/inline-4.js";
import "./modules/inline-5.js";
import "./modules/KOB-RHEA-KAOS-sync.js";



import "./modules/inline-7-9.js";
/*import "./modules/inline-8.js";
import "./modules/inline-9.js";
import "./modules/inline-10.js";*/
/*import "./modules/inline-11.js";*/
import './modules/a€Arx.js';
import './modules/kxtsk-shell.js';
console.log(`
╔════════════════════════════════════╗
║ KBllX READY                        ║
║ PROFILE :: 7-9                     ║
║ HASH    :: 1778•78K                ║
╚════════════════════════════════════╝
`);

try {
  await import(
    "https://www.infodose.com.br/oiDual/KODUX/78K/DATA/kob5.js"
  );

  console.log("✓ kob5.js carregado");
} catch (err) {
  console.error("✗ Falha ao carregar kob2.js", err);
}

/* ==========================================================
   3. CORE ENGINE (NO DOM DEPENDENCY)
   ========================================================== */

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];


/* ==========================================================
   4. LOGGER (SIMPLE + SAFE)
   ========================================================== */

const Log = {
    info: (...a) => console.log("[INFO]", ...a),
    action: (...a) => console.log("[ACTION]", ...a),
    state: (...a) => console.log("[STATE]", ...a),
    warn: (...a) => console.warn("[WARN]", ...a),
    error: (...a) => console.error("[ERROR]", ...a),
};


/* ==========================================================
   5. UI CACHE (ONLY AFTER DOM READY)
   ========================================================== */

const UI = {};

function cacheUI(){

    Object.assign(UI,{
        root: $("#root"),
        frame: $("#frame"),
        appFrame: $("#appFrame"),
        runtime: $("#runtimeLayer"),
        symbolBar: $("#symbolBar"),
        orb: $("#orbBtn"),
        vault: $("#viewVault"),
        editor: $("#viewEditor"),
        drawer: $("#drawerProfile"),
        drawerOverlay: $("#drawerOverlay"),
        toast: $("#toast"),
        toaster: $("#toasterWrap"),
        quickMenu: $("#kblx-quick"),
        routeEditor: $("#kblx-back"),
        particles: $("#particles-js")
    });

    Log.info("UI cached");
    return UI;
}


/* ==========================================================
   6. GLOBAL STATE HOLDERS (placeholders)
   ========================================================== */

let Bridge = null;
let Registry = null;
let Bus = null;
let Router = null;


/* ==========================================================
   7. BOOT CORE INIT (SAFE ENTRY POINT)
   ========================================================== */

function initCore(){

    Log.info("Initializing CORE...");

    /* Bridge comes from module OR global export */
    Bridge = window.Bridge || null;
    Registry = window.Registry || null;
    Bus = window.Bus || null;

    Router = {
        go(url, target="frame"){
            Bridge?.navigate?.(url, target);
            Log.action("Router go:", url, target);
        }
    };

    window.UI = cacheUI();

    window.Bridge = Bridge;
    window.Registry = Registry;
    window.Bus = Bus;
    window.Router = Router;
    window.Log = Log;

    Log.info("CORE READY");
}


/* ==========================================================
   8. RUNTIME START
   ========================================================== */

function startRuntime(){

    Log.info("Starting runtime layer...");

    document.addEventListener("click", (e) => {

        const btn = e.target.closest("[data-action]");
        if(!btn) return;

        const action = btn.dataset.action;

        Log.action("UI action:", action);

        switch(action){

            case "nav":
                if(btn.dataset.url)
                    Router.go(btn.dataset.url);
                break;

            case "runtime":
                Bridge?.openRuntime?.();
                break;

            case "drawer":
                Bridge?.toggleDrawer?.();
                break;

            case "toggle":
                Bridge?.toggle?.(btn.dataset.state);
                break;
        }
    });
}


/* ==========================================================
   9. BOOT SEQUENCE CONTROL
   ========================================================== */

window.addEventListener("DOMContentLoaded", () => {

    initCore();
    startRuntime();

});


/* ==========================================================
   END
   ========================================================== */

console.log("MAIN LOADED (await DOM)");