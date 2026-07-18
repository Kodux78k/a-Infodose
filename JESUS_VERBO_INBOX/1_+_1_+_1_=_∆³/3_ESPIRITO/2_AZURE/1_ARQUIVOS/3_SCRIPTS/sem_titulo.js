/* =====================================
   KBLX EVENT BUS
   Hub1 Hybrid v2
   HORUS · KOBLLUX CORE
===================================== */

(function(){

window.KBLX = window.KBLX || {};

const Bus = {

 version:"1.0.0",

 channels:{},


 on(channel,callback){

   if(!this.channels[channel]){
     this.channels[channel]=[];
   }

   this.channels[channel]
   .push(callback);

 },


 emit(channel,data={}){

   console.log(
    "📡 KBLX EVENT:",
    channel,
    data
   );


   (this.channels[channel]||[])
   .forEach(fn=>fn(data));


   window.dispatchEvent(
    new CustomEvent(
     "kblx:event",
     {
      detail:{
       channel,
       data
      }
     }
    )
   );

 },


 once(channel,callback){

   const wrapper=(data)=>{

    callback(data);

    this.off(
     channel,
     wrapper
    );

   };

   this.on(
    channel,
    wrapper
   );

 },


 off(channel,callback){

   if(!this.channels[channel])
    return;

   this.channels[channel] =
   this.channels[channel]
   .filter(fn=>fn!==callback);

 },


 list(){

   return Object.keys(
    this.channels
   );

 }


};


window.KBLX.bus = Bus;


/* Eventos base */

Bus.emit(
 "core:ready",
 {
  system:"KBLX",
  status:"online"
 }
);


Bus.emit(
 "hub1:connected",
 {
  mode:"hybrid"
 }
);


console.log(
 "%c📡 KBLX EVENT BUS ONLINE",
 "color:#a855f7;font-weight:bold"
);


})();