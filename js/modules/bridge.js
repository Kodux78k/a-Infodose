/* ==========================================================
   KOBLLUX CORE
   Bridge + UI Cache + Registry + Router + Dispatcher
   ========================================================== */

(() => {

const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];

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

    return UI;
}

/* ==========================================================
   REGISTRY
   ========================================================== */

const Registry={

    modules:new Map(),

    register(name,module){

        this.modules.set(name,module);

        module.init?.();

        console.log("[Registry]",name);

    },

    get(name){

        return this.modules.get(name);

    }

};

/* ==========================================================
   EVENT BUS
   ========================================================== */

const Bus={

    events:{},

    on(name,fn){

        (this.events[name]??=[]).push(fn);

    },

    emit(name,data){

        (this.events[name]||[]).forEach(fn=>fn(data));

    }

};

/* ==========================================================
   BRIDGE CONTROLLER
   ========================================================== */

const Bridge={

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

        Bus.emit("state:"+key,value);

        Bus.emit("state",structuredClone(this.state));

    },

    get(key){

        return this.state[key];

    },

    toggle(key){

        this.set(key,!this.state[key]);

    },

    openDrawer(){

        UI.drawer?.classList.add("open");

        UI.drawerOverlay?.classList.add("show");

        this.set("drawer",true);

    },

    closeDrawer(){

        UI.drawer?.classList.remove("open");

        UI.drawerOverlay?.classList.remove("show");

        this.set("drawer",false);

    },

    toggleDrawer(){

        this.get("drawer")
            ? this.closeDrawer()
            : this.openDrawer();

    },

    openRuntime(){

        UI.runtime?.classList.add("active");

        this.set("runtime",true);

    },

    closeRuntime(){

        UI.runtime?.classList.remove("active");

        this.set("runtime",false);

    },

    navigate(url,target="frame"){

        const iframe=
            target==="runtime"
            ?UI.appFrame
            :UI.frame;

        if(iframe) iframe.src=url;

    }

};

/* ==========================================================
   ROUTER
   ========================================================== */

const Router={

    go(url,target="frame"){

        Bridge.navigate(url,target);

    }

};

/* ==========================================================
   EVENT DELEGATION
   ========================================================== */

document.addEventListener("click",(e)=>{

    const btn=e.target.closest("[data-action]");

    if(!btn) return;

    const action=btn.dataset.action;

    switch(action){

        case"nav":

            if(btn.dataset.url)
                Router.go(btn.dataset.url);

            break;

        case"runtime":

            Bridge.openRuntime();

            break;

        case"drawer":

            Bridge.toggleDrawer();

            break;

        case"toggle":

            Bridge.toggle(btn.dataset.state);

            break;

    }

});

/* ==========================================================
   GLOBAL
   ========================================================== */

window.UI=cacheUI();

window.Registry=Registry;

window.Bus=Bus;

window.Bridge=Bridge;

window.Router=Router;

console.log("KOBLLUX CORE READY");

})();