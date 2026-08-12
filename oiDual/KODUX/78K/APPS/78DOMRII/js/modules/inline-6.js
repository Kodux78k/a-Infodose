
/* ═══════════════════════════════════════
   DOMRII ENGINE
═══════════════════════════════════════ */


/* ─────────────────────────────────────
   DIALOG
───────────────────────────────────── */

function openDialog(){

  const dialog =
    document.getElementById(
      "demoDialog"
    );

  if(dialog.showModal){

    dialog.showModal();

  }else{

    dialog.setAttribute(
      "open",
      ""
    );

  }

}


/* ─────────────────────────────────────
   TEMPLATE
───────────────────────────────────── */

function cloneTemplate(){

  const template =
    document.getElementById(
      "cardTemplate"
    );

  const result =
    document.getElementById(
      "templateResult"
    );

  result.innerHTML = "";

  result.appendChild(
    template.content.cloneNode(true)
  );

}


/* ─────────────────────────────────────
   FORM
───────────────────────────────────── */

document
  .getElementById("demoForm")
  .addEventListener(
    "submit",
    function(event){

      event.preventDefault();

      const status =
        document.getElementById(
          "formStatus"
        );

      status.textContent =
        "✓ O navegador considerou o formulário válido.";

    }
  );


/* ─────────────────────────────────────
   IFRAME
───────────────────────────────────── */

function reloadFrame(){

  const frame =
    document.getElementById(
      "demoFrame"
    );

  const src =
    frame.getAttribute(
      "srcdoc"
    );

  frame.srcdoc = "";

  requestAnimationFrame(
    () => {
      frame.srcdoc = src;
    }
  );

}


/* ─────────────────────────────────────
   COPY
───────────────────────────────────── */

async function copyCode(type){

  const textarea =
    document.getElementById(
      "code-" + type
    );

  try{

    await navigator.clipboard.writeText(
      textarea.value
    );

    toast("📋 Código copiado");

  }catch{

    textarea.focus();
    textarea.select();

    document.execCommand("copy");

    toast("📋 Código copiado");

  }

}


/* ─────────────────────────────────────
   DOWNLOAD
───────────────────────────────────── */

function downloadCode(type){

  const textarea =
    document.getElementById(
      "code-" + type
    );

  const blob =
    new Blob(
      [textarea.value],
      {
        type:
          "text/html;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "domrii-" +
    type +
    ".html";

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(
    () => URL.revokeObjectURL(url),
    1000
  );

  toast("⬇️ Arquivo preparado");

}


/* ─────────────────────────────────────
   NIGHT
───────────────────────────────────── */

function toggleNight(){

  document.body.classList.toggle(
    "nebula-night"
  );

  const active =
    document.body.classList.contains(
      "nebula-night"
    );

  document.getElementById(
    "modeBtn"
  ).textContent =
    active ? "🌙" : "☀️";

}


/* ─────────────────────────────────────
   IMMERSIVE VIEW
───────────────────────────────────── */

function toggleImmersive(){

  const root =
    document.documentElement;

  const active =
    root.dataset.view ===
    "immersive";

  root.dataset.view =
    active
      ? "normal"
      : "immersive";

}


/* ─────────────────────────────────────
   TOAST
───────────────────────────────────── */

let toastTimer;

function toast(message){

  const el =
    document.getElementById(
      "toast"
    );

  el.textContent =
    message;

  el.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {
        el.classList.remove(
          "show"
        );
      },
      1800
    );

}
