window.onerror = function(
  msg,
  src,
  line,
  col,
  err
){
  console.log({
    msg,
    src,
    line,
    col,
    stack: err?.stack
  });
};

window.addEventListener("error", e => {
  console.log("ERRO:");
  console.log("Mensagem:", e.message);
  console.log("Arquivo:", e.filename);
  console.log("Linha:", e.lineno);
  console.log("Coluna:", e.colno);
  console.log("Stack:", e.error?.stack);
});

window.addEventListener("unhandledrejection", e => {
  console.log("PROMISE ERROR:");
  console.log(e.reason);
});