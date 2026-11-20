/* RUNTIME · FULL BUNDLE (from extracted parts) → #inject-here
 * Estilos: 1 · Scripts: 3
 */
(function(cssArr, htmlStr, jsArr, s){
  const t = document.querySelector(s) || document.body;
  cssArr.forEach(function(css, i){
    const n = document.createElement('style');
    n.setAttribute('data-runtime-module', 'css');
    n.setAttribute('data-runtime-index', i);
    n.textContent = css;
    document.head.appendChild(n);
  });
  if(htmlStr){
    const p = new DOMParser();
    const c = p.parseFromString(htmlStr, 'text/html');
    const f = document.createDocumentFragment();
    Array.from(c.body.childNodes).forEach(function(node){
      f.appendChild(document.importNode(node, true));
    });
    t.appendChild(f);
  }
  jsArr.forEach(function(obj, i){
    const n = document.createElement('script');
    n.setAttribute('data-runtime-module', 'js');
    n.setAttribute('data-runtime-index', i);
    if(obj.src){ n.src = obj.src; n.async = false; }
    else{ n.textContent = obj.content; }
    document.body.appendChild(n);
  });
})(["@import url(\"https://infodose.com.br/css/iFSw-unified.css\");"], "<div class=\"almasliber\" data-app=\"almasliber\">\n    <div class=\"shell\">\n\n      <!-- ===== TOPBAR (oculta) =====\n      <header style=\"z-index:10\" class=\"topbar\">\n        <button class=\"icon-btn\" id=\"menuBtn\" aria-label=\"Abrir menu\">☰<\/button>\n        <div class=\"brand\">\n          A.<span>INFODOSE<\/span>\n          <span class=\"mini-orb-wrap\" id=\"topbarMiniOrb\"><\/span>\n        <\/div>\n        <div style=\"z-index:11; display:flex;gap:8px;\">\n          <button class=\"icon-btn\" id=\"themeToggle\" aria-label=\"Alternar tema\">🌙<\/button>\n          <button class=\"icon-btn\" id=\"notifBtn\" aria-label=\"Notificações\">♧<\/button>\n        <\/div>\n      <\/header>\n      -->\n\n      <div class=\"wrap\">\n\n        <!-- ===== HEADER GLOBAL ===== -->\n        <header class=\"topbar header-visible\" id=\"main-header\">\n          <div class=\"brandX\">\n            <span>DUAL<\/span>\n            <span class=\"badgeX\">GLOBAL<\/span>\n          <\/div>\n\n          <!--\n          <div class=\"win-navrow\" onclick=\"event.stopPropagation()\">\n            <input class=\"win-urlbar\" type=\"text\" id=\"urlInputNav\" placeholder=\"Digite uma URL...\" spellcheck=\"false\" autocomplete=\"off\">\n            <button class=\"win-go-btn\" type=\"button\" id=\"goNavBtn\">Go<\/button>\n          <\/div>\n          -->\n\n          <button id=\"theme-dot\" class=\"theme-dot\" type=\"button\" aria-label=\"Alternar tema\" title=\"Alternar tema\">\n            <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"width:14px;height:14px;\">\n              <circle cx=\"12\" cy=\"12\" r=\"5\"><\/circle>\n              <path d=\"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42\"><\/path>\n            <\/svg>\n          <\/button>\n\n          <!-- <button class=\"launcher-btn\" id=\"openKobBtn\">+<\/button> -->\n        <\/header>\n\n        <!-- ===== MAIN ===== -->\n        <main>\n          <div id=\"main-content\">\n            <div id=\"kxtsk-shell\">\n              <div id=\"inject-here\"><\/div>\n              <div id=\"dock\"><\/div>\n            <\/div>\n          <\/div>\n        <\/main>\n\n        <!-- ===== BOTTOM NAV ===== -->\n        <nav style=\"display:none\" class=\"symbol-bar bottom-nav\" data-module=\"navigation\" aria-label=\"Navegação principal\">\n          <button class=\"nav-item active\" data-tab=\"home\"><span class=\"nav-icon\">⌂<\/span><span>Início<\/span><\/button>\n          <button class=\"nav-item\" id=\"navLibraryBtn\"><span class=\"nav-icon\">▣<\/span><span>Library<\/span><\/button>\n          <button class=\"nav-main\" id=\"navCreateBtn\">+<\/button>\n          <button class=\"nav-item\" id=\"navResultsBtn\"><span class=\"nav-icon\">▥<\/span><span>Resultados<\/span><\/button>\n          <button class=\"nav-item\" id=\"navProfileBtn\"><span class=\"nav-icon\">♙<\/span><span>Perfil<\/span><\/button>\n        <\/nav>\n\n      <\/div>\n    <\/div>\n  <\/div>\n\n  <!-- ===== TOASTER ===== -->\n  <div class=\"toaster-wrap\" id=\"toasterWrap\"><\/div>\n\n  <input type=\"file\" id=\"nebulaFileInput\" multiple=\"\" accept=\".txt,.md,.html,.pdf\" style=\"display:none\">\n\n  <!-- ============================================================\n       SCRIPTS DO KXTSK-SHELL / STACKWRAP\n       ============================================================ -->", [{"src":"https://www.infodose.com.br/js/modules/kob-outline-uni-3.js"},{"src":"https://www.infodose.com.br/js/modules/Dual_[Theme]-js.js"},{"src":"https://kodux78k.github.io/a-Infodose/js/modules/iFSw-base.js"}], "#inject-here");