/* Service Worker: shell + vendor locais para uso offline (so em http/https) */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", function(){ navigator.serviceWorker.register("./sw.js").catch(function(){}); });
}
