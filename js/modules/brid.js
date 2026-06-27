/* ==========================================================
   KOBLLUX CORE
   Bridge + UI Cache + Registry + Router + Dispatcher
   + LOG SYSTEM
   ========================================================== */

(() => {

const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];

/* ==========================================================
   LOGGER
   ========================================================== */

const Log = {
    info: (...a) => console.log("[INFO]", ...a),
    action: (...a) => console.log("[ACTION]", ...a),
    state: (...a) => console.log("[STATE]", ...a),
    warn: (...a) => console.warn("[WARN]", ...a),
    error: (...a) => console.error("[ERROR]", ...a),
};

/* ==========================================================
   UI CACHE
   ========================================================== */

const UI = {};

function cacheUI(){

    Object.assign(UI,{
        root:$("#root"),
        frame:$("#frame"),
        appFrame:$("#appFrame"),
        runtime:$("#runtimeLayer"),
        symbolBar:$("#symbolBar"),
        orb:$("#orbBtn"),
        vault:$("#viewVault"),
        editor:$("#viewEditor"),
        drawer:$("#drawerProfile"),
        drawerOverlay:$("#drawerOverlay"),
        toast:$("#toast"),
        toaster:$("#toasterWrap"),
        quickMenu:$("#kblx-quick"),
        routeEditor:$("#kblx-back"),
        particles:$("#particles-js")
    });

    Log.info("UI cached", Object.keys(UI));

    return UI;
}

/* ==========================================================
   REGISTRY
   ========================================================== */

const Registry = {
    modules: new Map(),

    register(name, module){
        this.modules.set(name, module);
        module.init?.();
        Log.info("Registry register:", name);
    },

    get(name){
        Log.info("Registry get:", name);
        return this.modules.get(name);
    }
};

/* ==========================================================
   EVENT BUS
   ========================================================== */

const Bus = {
    events: {},

    on(name, fn){
        (this.events[name]??=[]).push(fn);
        Log.info("Bus listen:", name);
    },

    emit(name, data){
        Log.state("Bus emit:", name, data);
        (this.events[name]||[]).forEach(fn=>fn(data));
    }
};

/* ==========================================================
   BRIDGE CONTROLLER
   ========================================================== */

const Bridge = {

    state:{
        mode:"chat",
        runtime:false,
        vault:false,
        drawer:false,
        overlay:null,
        theme:"solar"
    },

    set(key,value){
        this.state[key]=value;

        Log.state("Bridge set:", key, value);

        Bus.emit("state:"+key,value);
        Bus.emit("state",structuredClone(this.state));
    },

    get(key){
        Log.info("Bridge get:", key, this.state[key]);
        return this.state[key];
    },

    toggle(key){
        Log.action("Bridge toggle:", key);
        this.set(key,!this.state[key]);
    },

    openDrawer(){
        UI.drawer?.classList.add("open");
        UI.drawerOverlay?.classList.add("show");
        Log.action("Drawer open");
        this.set("drawer",true);
    },

    closeDrawer(){
        UI.drawer?.classList.remove("open");
        UI.drawerOverlay?.classList.remove("show");
        Log.action("Drawer close");
        this.set("drawer",false);
    },

    toggleDrawer(){
        Log.action("Drawer toggle");
        this.get("drawer") ? this.closeDrawer() : this.openDrawer();
    },

    openRuntime(){
        UI.runtime?.classList.add("active");
        Log.action("Runtime open");
        this.set("runtime",true);
    },

    closeRuntime(){
        UI.runtime?.classList.remove("active");
        Log.action("Runtime close");
        this.set("runtime",false);
    },

    navigate(url,target="frame"){

        const iframe =
            target==="runtime"
            ? UI.appFrame
            : UI.frame;

        Log.action("Navigate:", {url, target});

        if(iframe) iframe.src = url;
    }
};

/* ==========================================================
   ROUTER
   ========================================================== */

const Router = {
    go(url,target="frame"){
        Log.action("Router go:", url, target);
        Bridge.navigate(url,target);
    }
};

/* ==========================================================
   EVENT DELEGATION
   ========================================================== */

document.addEventListener("click",(e)=>{

    const btn = e.target.closest("[data-action]");
    if(!btn) return;

    const action = btn.dataset.action;

    Log.action("Click action:", action, btn.dataset);

    switch(action){

        case "nav":
            if(btn.dataset.url)
                Router.go(btn.dataset.url);
            break;

        case "runtime":
            Bridge.openRuntime();
            break;

        case "drawer":
            Bridge.toggleDrawer();
            break;

        case "toggle":
            Bridge.toggle(btn.dataset.state);
            break;
    }
});

/* ==========================================================
   GLOBAL
   ========================================================== */

window.UI = cacheUI();
window.Registry = Registry;
window.Bus = Bus;
window.Bridge = Bridge;
window.Router = Router;
window.Log = Log;

Log.info("KOBLLUX CORE READY");

})();