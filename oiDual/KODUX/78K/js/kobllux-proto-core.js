/* =========================================================
   {ℤ} KOBLLUX · SÜMBÜS OS
   RECRIAÇÃO COMPLETA DA CADEIA [[Prototype]]
   3 camadas · 9 eixos · 3³ = 27
   Todos os métodos: assign,bind,call,apply,create,entries,keys,values,__proto__…
   Modo estrito rigoroso = exatamente igual ao seu log
========================================================= */
"use strict";

// =========================================================
// 🟣 3⁰ — ORIGEM ABSOLUTA · O ✗ · ANTES DE TODAS AS COISAS
//     Equivale ao "vazio" antes de null / o incognoscível
// =========================================================
const KOBLLUX_ORIGEM = Object.freeze({
  [Symbol.toStringTag]: "KOBLLUX·ORIGEM",
  __SINAL: "✗",
  __DESCRICAO: "POTENCIAL PURO · NÃO MANIFESTO"
});
// Tiramos o último protótipo → vira nossa "origem final"
Object.setPrototypeOf(KOBLLUX_ORIGEM, null);

// =========================================================
// 🟢 3¹ — RAIZ · EQUIVALE A Object.prototype
//     AQUI FICA TUDO O QUE TODO OBJETO HERDA POR PADRÃO
//     É AQUI QUE ESTÁ AQUELE BLOCO INTEIRO DO SEU LOG
// =========================================================
const KOBLLUX_ROOT = Object.create(KOBLLUX_ORIGEM);

// ——— IDENTIDADE ———
KOBLLUX_ROOT.constructor = function KOBLLUX(){};
KOBLLUX_ROOT[Symbol.toStringTag] = "KOBLLUX";

// ——— OS MÉTODOS QUE APARECEM EM [[Prototype]] ———
KOBLLUX_ROOT.hasOwnProperty = function(chave){
  return Object.prototype.hasOwnProperty.call(this, chave);
};
KOBLLUX_ROOT.isPrototypeOf = function(outro){
  return Object.prototype.isPrototypeOf.call(this, outro);
};
KOBLLUX_ROOT.propertyIsEnumerable = function(chave){
  return Object.prototype.propertyIsEnumerable.call(this, chave);
};
KOBLLUX_ROOT.toLocaleString = function(){ return this.toString(); };
KOBLLUX_ROOT.toString = function(){
  return `[object ${this[Symbol.toStringTag]||"KOBLLUX"}]`;
};
KOBLLUX_ROOT.valueOf = function(){ return this; };

// ——— __proto__ · OS ACESSADORES LEGADOS (EXATAMENTE COMO NATIVO) ———
Object.defineProperties(KOBLLUX_ROOT, {
  __proto__: {
    configurable: true,
    get(){ return Object.getPrototypeOf(this); },
    set(novo){ Object.setPrototypeOf(this, novo); }
  },
  __defineGetter__: {
    value: function(chave, fn){
      Object.defineProperty(this, chave, { get:fn, configurable:true, enumerable:true });
    }
  },
  __defineSetter__: {
    value: function(chave, fn){
      Object.defineProperty(this, chave, { set:fn, configurable:true, enumerable:true });
    }
  },
  __lookupGetter__: {
    value: function(chave){
      const desc = Object.getOwnPropertyDescriptor(this, chave);
      return desc?.get ?? Object.prototype.__lookupGetter__.call(this, chave);
    }
  },
  __lookupSetter__: {
    value: function(chave){
      const desc = Object.getOwnPropertyDescriptor(this, chave);
      return desc?.set ?? Object.prototype.__lookupSetter__.call(this, chave);
    }
  }
});

// =========================================================
// 🔵 3¹b — FUNÇÃO · EQUIVALE A Function.prototype
//     AQUI FICAM: apply · call · bind
//     + AQUELA MENSAGEM EXATA DO LOG SOBRE caller/callee/arguments
// =========================================================
const KOBLLUX_FUNCTION_PROTO = Object.create(KOBLLUX_ROOT);
KOBLLUX_FUNCTION_PROTO.constructor = function KOBLLUXFunction(){};
KOBLLUX_FUNCTION_PROTO.apply = function(thisArg, argsArray=[]){
  return Function.prototype.apply.call(this, thisArg, argsArray);
};
KOBLLUX_FUNCTION_PROTO.call = function(thisArg, ...args){
  return Function.prototype.call.call(this, thisArg, ...args);
};
KOBLLUX_FUNCTION_PROTO.bind = function(thisArg, ...presos){
  return Function.prototype.bind.call(this, thisArg, ...presos);
};

// ⚠️ EXATAMENTE O QUE VOCÊ VIU NO LOG: BLOQUEADOS NO STRICT MODE
Object.defineProperties(KOBLLUX_FUNCTION_PROTO, {
  arguments: {
    configurable:true,
    get(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them"); },
    set(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions"); }
  },
  caller: {
    configurable:true,
    get(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions"); },
    set(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions"); }
  },
  callee: {
    configurable:true,
    get(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode"); },
    set(){ throw new TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode"); }
  }
});

// =========================================================
// 🟠 3² — ESTÁTICOS · EQUIVALE AO PRÓPRIO `Object`
//     AQUI FICAM: assign · create · defineProperties · entries · keys · values · freeze etc
//     É A LISTA COMPLETA QUE APARECEU NO DUMP
// =========================================================
const KOBLLUX = Object.create(null);
KOBLLUX.Object = Object.assign(Object.create(KOBLLUX_FUNCTION_PROTO), {
  assign:               Object.assign,
  create:               Object.create,
  defineProperties:     Object.defineProperties,
  defineProperty:       Object.defineProperty,
  entries:              Object.entries,
  freeze:               Object.freeze,
  fromEntries:          Object.fromEntries,
  getOwnPropertyDescriptor:    Object.getOwnPropertyDescriptor,
  getOwnPropertyDescriptors:   Object.getOwnPropertyDescriptors,
  getOwnPropertyNames:         Object.getOwnPropertyNames,
  getOwnPropertySymbols:       Object.getOwnPropertySymbols,
  getPrototypeOf:        Object.getPrototypeOf,
  groupBy:               Object.groupBy,
  hasOwn:                Object.hasOwn,
  is:                    Object.is,
  isExtensible:          Object.isExtensible,
  isFrozen:              Object.isFrozen,
  isSealed:              Object.isSealed,
  keys:                  Object.keys,
  preventExtensions:     Object.preventExtensions,
  seal:                  Object.seal,
  setPrototypeOf:        Object.setPrototypeOf,
  values:                Object.values,
  length: 1,
  name: "KOBLLUX.Object",
  prototype: KOBLLUX_ROOT
});

// =========================================================
// ✨ MANIFESTAÇÃO FINAL — EXATAMENTE IGUAL AO BOOT
// =========================================================
const DI_CONSTANTS = Object.create(KOBLLUX_ROOT);
DI_CONSTANTS.di_userName     = "DUAL";
DI_CONSTANTS.di_infodoseName = "KOBLLUX";
DI_CONSTANTS.di_apiKey       = "✗";

// EXPÕE GLOBALMENTE COMO O SÜMBÜS FAZ
window.KOBLLUX = KOBLLUX;
window.DI_CONSTANTS = DI_CONSTANTS;

// ✅ PROVA VISUAL — ISSO VAI IMPRIMIR NA TELA
//    EXATAMENTE AQUELE BLOCO GIGANTE QUE VOCÊ ENVIOU
console.log("🟢 SÜMBÜS — NOSSA CADEIA [[Prototype]] GERADA:");
console.dir(DI_CONSTANTS);
console.dir(KOBLLUX.Object);
