
/* ═══════════════════════════════════════════════════════════════════════════
   KOB · CONVERGENCE v1 — ledger E1..E7 aplicado ao MXDB-DTCP
   Base: E1_hz_canonico · E2_atlas · E3_opcode_politica · E4_orb
         E5_portal_0x07 · E6_fase · E7_triade_metadado
   Modo: append-only. Camada acima de ARCH/ORB_PATTERN/PAT. Nada é sobrescrito.
   Instalar: <script id="kob-convergence-v1"> antes de </body>
   Verificação: KOBConvergence.audit() · .ledger() · .triads() · .walk()
   ═══════════════════════════════════════════════════════════════════════════ */
(function KOBConv(){
  'use strict';
  if (window.KOB_CONVERGENCE) return;
  window.KOB_CONVERGENCE = true;

  var V = 'v1';
  var LEDGER_KEY = 'kob:convergence:ledger';

  /* ── E1 · Hz canônico (voto ≥2 fontes distintas) ──────────────────── */
  var HZ_CANON = {
    ATLAS:   { hz: 528, sources: ['A-Z','HTML','codex'], status: '3_fontes', prev: [396,594] },
    VITALIS: { hz: 528, sources: ['A-Z','HTML','codex'], status: '3_fontes' },
    ARTEMIS: { hz: 672, sources: ['A-Z','HTML','codex'], status: '3_fontes' },
    RHEA:    { hz: 528, sources: ['A-Z','HTML','codex'], status: '3_fontes' },
    PULSE:   { hz: 639, sources: ['A-Z','codex'],        status: '2_fontes' },
    SERENA:  { hz: 528, sources: ['A-Z','codex'],        status: '2_fontes' },
    GENUS:   { hz: 777, sources: ['HTML','codex'],       status: '2_fontes' },
    SOLUS:   { hz: 963, sources: ['A-Z','codex'],        status: '2_fontes' },
    AION:    { hz: 777, sources: ['A-Z','HTML'],         status: '2_fontes' },
    NOVA:    { hz: null, status: 'pendente' },
    KAOS:    { hz: null, status: 'pendente' },
    LUMINE:  { hz: null, status: 'pendente' }
  };

  /* ── E3 · opcode canônico (≥2 fontes) + projeções para o resto ────── */
  var OPCODE_CANON = {
    NOVA:    { op: '0x01', sources: ['codex','A-Z'], status: '2_fontes' },
    ARTEMIS: { op: '0x05', sources: ['HTML','A-Z'],  status: '2_fontes' },
    GENUS:   { op: '0x07', sources: ['HTML','codex'], status: '2_fontes' },
    SOLUS:   { op: '0x09', sources: ['codex','A-Z'], status: '2_fontes' },
    RHEA:    { op: '0x0A', sources: ['HTML','codex'], status: '2_fontes' }
  };
  var OPCODE_PROJ = {
    ATLAS:   { html: '0x02', codex: '0x0A', az: ['0x0B'], canon: null },
    VITALIS: { html: '0x09', codex: '0x02', az: ['0x04'], canon: null },
    PULSE:   { html: '0x01', codex: '0x03', az: ['0x05','0x06'], canon: null },
    SERENA:  { html: '0x0A', codex: '0x05', az: ['0x02'], canon: null },
    KAOS:    { html: '0x04', codex: '0x06', az: ['0x01'], canon: null },
    LUMINE:  { html: '0x06', codex: '0x08', az: ['0x03'], canon: null },
    AION:    { html: '0x0C', codex: '0x0B', az: ['0x08','0x09'], canon: null }
  };

  /* ── E5 · nomes corrigidos do portal 0x07 ─────────────────────────── */
  var OPCODE_NAMES = {
    '0x00': { name: 'ORIGEM',      hz: 768 },
    '0x01': { name: 'DETECTAR',    hz: 432 },
    '0x02': { name: 'INTEGRAR',    hz: 528 },
    '0x03': { name: 'EXPANDIR',    hz: 639 },
    '0x04': { name: 'LAPIDAR',     hz: 594 },
    '0x05': { name: 'CONVERGIR',   hz: 672 },
    '0x06': { name: 'UNIFICAR',    hz: 528 },
    '0x07': { name: 'SELAR',       hz: 777 },
    '0x08': { name: 'TESTEMUNHAR', hz: 852 },
    '0x09': { name: 'ETERNIZAR',   hz: 963 },
    '0x0A': { name: 'TUTORIAL',    hz: 432, corrected: true },
    '0x0B': { name: 'ARQUETIPO',   hz: 528, corrected: true },
    '0x0C': { name: 'SÍNTESE',     hz: 777, corrected: true }
  };

  /* ── E6 · ordem × fase ────────────────────────────────────────────── */
  var PHASE = {
    '0x0A': { order: 11, phase: 10 },
    '0x0B': { order: 12, phase: 11 },
    '0x0C': { order: 13, phase: 12 }
  };

  /* ── E7 · tríade como camadas de metadado ─────────────────────────── */
  var TRIAD = {
    3: { name: 'MENTE', person: 'Pai',            time: 'Presente', dimension: '1D-3D ponto·linha·plano', tech: 'DOM',             cycle: 'UNO' },
    6: { name: 'CORPO', person: 'Filho',          time: 'Passado',  dimension: '4D-6D',                    tech: 'localStorage',    cycle: 'DUALIDADE' },
    9: { name: 'ALMA',  person: 'Espírito Santo', time: 'Futuro',   dimension: '7D-10D',                   tech: 'módulos remotos', cycle: 'TRINDADE' }
  };

  /* ── ledger append-only com hash encadeado ──────────────────────── */
  function hash(str) {
    var h = 0xdeadbeef;
    for (var i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
    return ((h ^ h >>> 16) >>> 0).toString(16);
  }
  function append(entry) {
    try {
      var L = JSON.parse(localStorage.getItem(LEDGER_KEY) || '[]');
      var prev = L.length ? L[L.length - 1].selo : '0';
      var e = { ts: Date.now(), v: V, prev: prev };
      Object.keys(entry).forEach(function(k) { e[k] = entry[k]; });
      e.selo = hash(JSON.stringify(e));
      L.push(e);
      if (L.length > 300) L.splice(0, L.length - 300);
      localStorage.setItem(LEDGER_KEY, JSON.stringify(L));
    } catch (err) {}
  }

  /* ── aplica na ARCH_MAP (global exposto pelo tokval.js) ──────────── */
  var applied = false;
  function apply() {
    if (applied) return true;
    var M = window.ARCH_MAP;
    if (!M) return false;

    Object.keys(HZ_CANON).forEach(function(k) {
      var c = HZ_CANON[k];
      if (!M[k] || !c.hz) return;
      if (M[k].hz !== c.hz) {
        append({ op: 'hz_update', arch: k, from: M[k].hz, to: c.hz, sources: c.sources, status: c.status });
        M[k].hz = c.hz;
      }
      M[k].hz_canon = { value: c.hz, sources: c.sources, status: c.status };
    });

    Object.keys(OPCODE_CANON).forEach(function(k) {
      var c = OPCODE_CANON[k];
      if (!M[k] || !c.op) return;
      if (M[k].op !== c.op) {
        append({ op: 'opcode_update', arch: k, from: M[k].op, to: c.op, sources: c.sources });
        M[k].op = c.op;
      }
      M[k].op_canon = c;
    });

    Object.keys(OPCODE_PROJ).forEach(function(k) {
      if (M[k]) M[k].op_projections = OPCODE_PROJ[k];
    });

    refreshLabels();
    enrichSymbolBar();
    paintAudit();
    applied = true;
    append({ op: 'canon_applied',
             hz_updated: Object.keys(HZ_CANON).length,
             op_updated: Object.keys(OPCODE_CANON).length });
    return true;
  }

  /* ── reflete o Hz canônico em pillHz e sbSub ────────────────────── */
  function refreshLabels() {
    var M = window.ARCH_MAP || {};
    var cur = (window.getArch && window.getArch()) || 'KOBLLUX';
    var c = M[cur];
    if (!c) return;
    var pillHz = document.getElementById('pillHz');
    if (pillHz) pillHz.textContent = c.hz + 'Hz';
    var sbSub = document.getElementById('sbSub');
    if (sbSub) sbSub.textContent = c.hz + 'Hz';
  }

  /* ── tooltip enriquecido nos botões do symbolBar ────────────────── */
  function enrichSymbolBar() {
    var M = window.ARCH_MAP || {};
    document.querySelectorAll('#sbTrack .sb-btn').forEach(function(btn) {
      var arch = btn.dataset.arch;
      if (!arch || !M[arch]) return;
      var hz = HZ_CANON[arch] || {};
      var op = OPCODE_CANON[arch] || {};
      var proj = OPCODE_PROJ[arch];
      var t = arch;
      if (hz.hz) t += ' · ' + hz.hz + 'Hz (' + hz.status.replace('_', ' ') + ')';
      else t += ' · ' + M[arch].hz + 'Hz (pendente)';
      if (op.op) t += ' · ' + op.op + ' (canon)';
      else if (proj) t += ' · h:' + proj.html + ' c:' + proj.codex;
      btn.title = t;
    });
  }

  /* ── E4 · orb [3,6,9,7] quando flag ON (intercept, sem reatribuir const) ── */
  function patchOrb() {
    var orb = document.getElementById('sbOrb');
    if (!orb || orb.__convPatched) return;
    orb.__convPatched = true;

    var lpTimer = null, lpFired = false, idx = 0;
    var CANON_PATTERN = [3, 6, 9, 7];

    orb.addEventListener('pointerdown', function() {
      lpFired = false;
      lpTimer = setTimeout(function() { lpFired = true; }, 800);
    }, true);

    orb.addEventListener('pointerup', function(e) {
      clearTimeout(lpTimer);
      var use3697 = false;
      try { use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true'; } catch (err) {}
      if (!use3697) return;         /* deixa o original rodar com [5,3,6,9,7] */
      if (lpFired) return;          /* deixa o wheel abrir */

      e.stopImmediatePropagation();
      var list = window.ARCH_LIST || [];
      if (!list.length) return;
      var cur = list.indexOf(window.getArch && window.getArch());
      var step = CANON_PATTERN[idx++ % CANON_PATTERN.length];
      var next = list[(cur + step) % list.length];
      var r = orb.getBoundingClientRect();
      try {
        if (window.applyArch) window.applyArch(next, {
          x: (r.left + r.width / 2) / window.innerWidth * 100,
          y: (r.top + r.height / 2) / window.innerHeight * 100
        });
      } catch (err) {}
      if (window.__sbSync) window.__sbSync(next);
      if (window.KBLX_TOAST) window.KBLX_TOAST('∆³ ' + next + ' · +' + step + ' (canon)');
      append({ op: 'orb_walk', arch: next, step: step, pattern: CANON_PATTERN.slice() });
    }, true);
  }

  /* ── cockpit: painel ∆ Canon ────────────────────────────────────── */
  function paintAudit() {
    var el = document.getElementById('kobCanonAudit');
    if (!el) return;
    var M = window.ARCH_MAP || {};
    var html = '';
    Object.keys(M).forEach(function(k) {
      var hz = HZ_CANON[k] || { hz: null, status: 'pendente' };
      var op = OPCODE_CANON[k] || { op: null };
      var dot = hz.status === '3_fontes' ? '<span style="color:#39ffb6">●●●</span>'
              : hz.status === '2_fontes' ? '<span style="color:#ffd166">●●</span>'
              : '<span style="color:#5c6577">○</span>';
      var hzVal = hz.hz || M[k].hz;
      var opVal = op.op || M[k].op;
      html += '<div style="display:grid;grid-template-columns:56px 54px 36px 1fr;gap:4px;padding:2px 4px;border-bottom:1px solid rgba(255,255,255,.05);align-items:center">'
            + '<span>' + k.slice(0,6) + '</span>'
            + '<span>' + hzVal + 'Hz</span>'
            + dot
            + '<span style="opacity:.55">' + opVal + '</span>'
            + '</div>';
    });
    el.innerHTML = html;
  }
  function mountCockpit() {
    var body = document.querySelector('#drawerProfile .drawer-body');
    if (!body || document.getElementById('kobCanonPanel')) return;
    var box = document.createElement('details');
    box.id = 'kobCanonPanel';
    box.className = 'cockpit-item';
    box.innerHTML =
      '<summary class="cockpit-label" style="cursor:pointer">∆ Canon · convergência entre fontes</summary>'
    + '<div id="kobCanonAudit" style="font:500 10px/1.5 ui-monospace,monospace;margin-top:6px;max-height:260px;overflow-y:auto"></div>'
    + '<div class="control-row" style="margin-top:6px">'
    +   '<button class="btn-block" id="kobCanonRefresh" type="button">↻ AUDITAR</button>'
    +   '<button class="btn-block" id="kobCanonLedger" type="button">📜 LEDGER</button>'
    +   '<button class="btn-block" id="kobCanonClear" type="button">⌫ LIMPAR</button>'
    + '</div>';
    body.appendChild(box);
    document.getElementById('kobCanonRefresh').onclick = paintAudit;
    document.getElementById('kobCanonLedger').onclick = function() {
      var L = window.KOBConvergence.ledger();
      console.log('%c[KOB-CONVERGENCE · ledger]', 'background:#c9a84c;color:#000;padding:2px 6px', L);
      if (window.KBLX_TOAST) window.KBLX_TOAST('📜 ' + L.length + ' entradas (ver console)');
    };
    document.getElementById('kobCanonClear').onclick = function() {
      if (window.confirm && !window.confirm('Limpar ledger de convergência?')) return;
      window.KOBConvergence.clear();
      paintAudit();
    };
    paintAudit();
  }

  /* ── boot: tenta aplicar até ARCH_MAP existir ─────────────────────── */
  var tries = 0;
  function attempt() {
    if (apply()) return;
    if (++tries > 100) return;
    setTimeout(attempt, 150);
  }
  attempt();

  window.addEventListener('load', function() {
    setTimeout(apply, 500);
    setTimeout(patchOrb, 2500);
    setTimeout(mountCockpit, 2600);
  });

  /* mantém pillHz / sbSub sincronizados ao trocar de arquétipo */
  if (window.KOBArch && window.KOBArch.subscribe) {
    window.KOBArch.subscribe(function(ev) {
      if (ev.type === 'voice') setTimeout(refreshLabels, 40);
    });
  }
  document.addEventListener('click', function(e) {
    var t = e.target;
    if (t && t.closest && t.closest('#sbOrb, .sb-btn, #archWheel, #arch-overlay')) {
      setTimeout(refreshLabels, 60);
    }
  }, { passive: true });

  /* ── API pública ────────────────────────────────────────────────── */
  window.KOBConvergence = {
    V: V,
    HZ_CANON: HZ_CANON,
    OPCODE_CANON: OPCODE_CANON,
    OPCODE_PROJ: OPCODE_PROJ,
    OPCODE_NAMES: OPCODE_NAMES,
    PHASE: PHASE,
    TRIAD: TRIAD,

    audit: function() {
      var M = window.ARCH_MAP || {};
      var rows = Object.keys(M).map(function(k) {
        var h = HZ_CANON[k] || {}, o = OPCODE_CANON[k] || {};
        return {
          arch: k,
          hz_atual: M[k].hz,
          hz_canon: h.hz || '—',
          hz_status: h.status || 'pendente',
          op_atual: M[k].op,
          op_canon: o.op || '—',
          op_status: o.status || 'projeção'
        };
      });
      console.table(rows);
      return rows;
    },

    ledger: function() {
      try { return JSON.parse(localStorage.getItem(LEDGER_KEY) || '[]'); } catch (e) { return []; }
    },

    triads: function() { console.table(TRIAD); return TRIAD; },

    canonHz: function(arch) {
      var c = HZ_CANON[String(arch || '').toUpperCase()];
      return c && c.hz ? c.hz : null;
    },

    canonOp: function(arch) {
      var c = OPCODE_CANON[String(arch || '').toUpperCase()];
      return c && c.op ? c.op : null;
    },

    walk: function(pattern, n, start) {
      pattern = pattern || [3, 6, 9, 7];
      n = n || 16;
      var idx = start || 0, out = [];
      for (var i = 0; i < n; i++) { out.push(idx); idx = (idx + pattern[i % pattern.length]) % 16; }
      return out;
    },

    clear: function() {
      try { localStorage.removeItem(LEDGER_KEY); } catch (e) {}
      console.log('[KOB-Convergence] ledger limpo');
    }
  };

  console.log(
    '%c[KOB-CONVERGENCE v1] %cledger aplicado · KOBConvergence.audit() / .ledger() / .triads() / .walk()',
    'background:#c9a84c;color:#000;padding:2px 8px;border-radius:3px',
    'color:#c9a84c'
  );
})();
