/* =====================================
   KBLX STATE MANAGER
   Hub1 Hybrid v2
   HORUS · KOBLLUX CORE
===================================== */

(function(){

window.KBLX = window.KBLX || {};


const State = {


 version:"1.0.0",

 current:null,

 history:[],


 states:{

  BALL:"ball",

  PREVIEW:"preview",

  FOOTER:"footer",

  FULL:"full"

 },


 set(state,data={}){


  if(!Object.values(this.states)
    .includes(state)){

    console.warn(
     "⚠️ Estado inválido:",
     state
    );

    return;

  }


  const previous =
  this.current;


  this.current = state;


  this.history.push({

    from:previous,

    to:state,

    data,

    time:Date.now()

  });


  console.log(
   "⚡ KBLX STATE:",
   previous,
   "→",
   state
  );


  this.syncUI();


  if(window.KBLX.bus){

    window.KBLX.bus.emit(
     "state:change",
     {
      previous,
      current:state,
      data
     }
    );

  }


 },


 get(){

  return this.current;

 },


 back(){

  const last =
  this.history[
   this.history.length-2
  ];

  if(last){

    this.set(
     last.to
    );

  }

 },


 syncUI(){


  const widget =
  document.getElementById(
   "kodux-widget"
  );


  if(!widget)
   return;


  Object.values(
   this.states
  )
  .forEach(s=>{

    widget.classList
    .remove(
     "state-"+s
    );

  });


  widget.classList.add(
   "state-"+this.current
  );


 },


 init(){

  this.set(
   this.states.BALL,
   {
    boot:true
   }
  );


  console.log(
   "%c🧬 KBLX STATE MANAGER ONLINE",
   "color:#22c55e;font-weight:bold"
  );

 }


};


window.KBLX.state = State;


State.init();


})();