/* TL · isola o #root do fusion card
   O card escuta pointerdown (drag/tap) e, em HUD/orb, um toque sem arrastar abre o card.
   Clique dentro do TL (summary, botões, inputs) não deve chegar nele. */
(function(){
  var r=document.getElementById('root'); if(!r) return;
  ['pointerdown','contextmenu'].forEach(function(t){
    r.addEventListener(t,function(e){ e.stopPropagation(); });
  });
})();
