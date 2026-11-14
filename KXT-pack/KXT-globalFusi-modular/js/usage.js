/* ═══════════ KXT USAGE · log didático de uso (tokens, modelo, custo, tempo) ═══════════ */
(() => {
  if (window.KXT_USAGE) return;
  const LS = localStorage, KEY = 'di_usageLog', RKEY = 'di_usageRange', MAX = 300;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = () => { try { const l = JSON.parse(LS.getItem(KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; } };
  const save = (l) => { try { LS.setItem(KEY, JSON.stringify(l.slice(-MAX))); } catch (e) { console.warn('[USAGE] sem espaço', e); } };
  const fmtN = (n) => Number(n || 0).toLocaleString('pt-BR');
  const fmtCost = (c, unknown) => {
    if (c === 0) return 'Grátis';
    if (c == null) return unknown ? '—' : 'Grátis';
    if (c < 0.0001) return '< US$ 0,0001';
    return 'US$ ' + c.toFixed(c < 0.01 ? 4 : 3).replace('.', ',');
  };
  const fmtMs = (ms) => !ms ? '—' : ms < 1000 ? ms + ' ms' : (ms / 1000).toFixed(1).replace('.', ',') + ' s';
  const fmtTime = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const catalog = () => { try { const c = JSON.parse(LS.getItem('di_orModelsCache') || 'null'); return (c && c.list) || []; } catch (e) { return []; } };
  const meta = (id) => catalog().find((m) => m.id === id) || null;
  const pretty = (s) => s.replace(/[-_]+/g, ' ').replace(/\b([a-z])/g, (c) => c.toUpperCase());
  const shortName = (id) => { const m = meta(id); const n = m ? m.name : pretty(String(id || '?').split('/').pop().replace(/:free$/i, '')); return n.replace(/\s*\(free\)\s*$/i, ''); };

  function record(e) {
    const m = meta(e.model);
    const free = /:free$/i.test(e.model || '') || !!(m && m.free);
    let cost = typeof e.cost === 'number' ? e.cost : null;
    if (cost === null) {
      if (free) cost = 0;
      else if (m && typeof m.price === 'number' && typeof m.priceOut === 'number') cost = ((e.pt || 0) * m.price + (e.ct || 0) * m.priceOut) / 1e6;
    }
    const entry = { t: Date.now(), model: e.model || '?', pt: e.pt | 0, ct: e.ct | 0, ms: e.ms | 0, ok: !!e.ok, est: !!e.est, err: e.err || '', cost, free, ctx: m ? m.ctx : 0 };
    const l = load(); l.push(entry); save(l);
    console.log('[USAGE]', entry.ok ? 'ok' : 'erro', shortName(entry.model), '↑' + entry.pt, '↓' + entry.ct, fmtMs(entry.ms));
    render();
    return entry;
  }

  const getRange = () => LS.getItem(RKEY) === 'today' ? 'today' : 'all';
  function filtered() {
    const l = load();
    if (getRange() === 'all') return l;
    const d0 = new Date(); d0.setHours(0, 0, 0, 0);
    return l.filter((x) => x.t >= d0.getTime());
  }

  function render() {
    const box = $('usagePanel'); if (!box) return;
    const all = load(), l = filtered(), oks = l.filter((x) => x.ok);
    const range = getRange();
    const chips = `<div class="u-range"><button type="button" class="u-chip ${range === 'today' ? 'on' : ''}" data-r="today">Hoje</button><button type="button" class="u-chip ${range === 'all' ? 'on' : ''}" data-r="all">Tudo</button></div>`;
    const help = `<details class="u-help"><summary>O que é um token?</summary><p>Token é um <b>pedacinho de texto</b> (uns 4 caracteres). A IA conta tudo em tokens: o que você <b>envia</b> (sua mensagem + o histórico da conversa) e o que ela <b>responde</b>. Modelos <b>grátis</b> não cobram; os <b>pagos</b> cobram por milhão de tokens. Por isso conversas longas ficam mais "pesadas": o histórico vai junto a cada mensagem.</p></details>`;
    if (!l.length) {
      box.innerHTML = chips + `<div class="u-empty">${all.length ? 'Nada registrado hoje ainda.' : 'Ainda sem registros.<br>Envie uma mensagem e o consumo aparece aqui, de forma simples.'}</div>` + help + actions();
      bind(box); return;
    }
    const tin = oks.reduce((a, x) => a + x.pt, 0), tout = oks.reduce((a, x) => a + x.ct, 0);
    const known = oks.filter((x) => x.cost != null), unknown = oks.length - known.length;
    const cost = known.reduce((a, x) => a + x.cost, 0);
    const counts = {}; oks.forEach((x) => { counts[x.model] = (counts[x.model] || 0) + 1; });
    const fav = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    const errs = l.length - oks.length;
    const anyEst = oks.some((x) => x.est);
    const costTxt = oks.length && known.length === 0 ? '—' : fmtCost(cost, false);
    const costSub = cost === 0 && known.length ? 'Tudo em modelos grátis 🎉' : (unknown ? `+ ${unknown} sem preço conhecido` : 'estimativa pelo preço do OpenRouter');
    const cards = `<div class="u-cards">
      <div class="u-card"><div class="u-ico">💬</div><div class="u-val">${fmtN(oks.length)}</div><div class="u-lbl">Respostas</div><div class="u-sub">${errs ? errs + ' com erro' : 'sem erros'}</div></div>
      <div class="u-card accent"><div class="u-ico">🔤</div><div class="u-val">${fmtN(tin + tout)}</div><div class="u-lbl">Tokens</div><div class="u-sub">↑ ${fmtN(tin)} enviados · ↓ ${fmtN(tout)} recebidos${anyEst ? ' (estimado)' : ''}</div></div>
      <div class="u-card"><div class="u-ico">💸</div><div class="u-val">${esc(costTxt)}</div><div class="u-lbl">Custo</div><div class="u-sub">${esc(costSub)}</div></div>
      <div class="u-card"><div class="u-ico">🤖</div><div class="u-val" title="${esc(fav || '')}">${esc(fav ? shortName(fav) : '—')}</div><div class="u-lbl">Modelo mais usado</div><div class="u-sub">${fav ? counts[fav] + '× nesse período' : ''}</div></div>
    </div>`;
    // medidor de contexto da última chamada
    const last = [...all].reverse().find((x) => x.ok);
    let meter = '';
    if (last) {
      const used = last.pt, ctx = last.ctx || 0, pct = ctx ? Math.min(100, used / ctx * 100) : 0;
      meter = `<div class="u-meter"><div class="u-mt"><span>📚 Memória da conversa</span><b>${fmtN(used)} tokens${ctx ? ' de ' + fmtN(ctx) : ''}</b></div><div class="u-track"><i class="u-in" style="width:${ctx ? Math.max(pct, 1.5) : 0}%"></i></div><div class="u-sub" style="font-size:.62rem;color:var(--ck-dim);margin-top:6px">${ctx ? pct.toFixed(1).replace('.', ',') + '% do limite do modelo. Quando enche, a IA esquece o começo.' : 'Busque o modelo no catálogo (Neural) para ver o limite dele.'}</div></div>`;
    }
    // linha do tempo
    const recent = l.slice(-12).reverse(), maxT = Math.max(1, ...recent.map((x) => x.pt + x.ct));
    const rows = recent.map((x) => {
      const w = (x.pt + x.ct) / maxT * 100, wi = (x.pt + x.ct) ? x.pt / (x.pt + x.ct) * w : 0;
      return `<div class="u-row ${x.ok ? '' : 'err'}">
        <div class="u-r1"><span class="u-m">${x.ok ? '✅' : '⚠️'} ${esc(shortName(x.model))}<span class="u-badge ${x.free ? 'free' : 'paid'}">${x.free ? 'GRÁTIS' : 'PAGO'}</span></span><span class="u-t">${fmtTime(x.t)}</span></div>
        ${x.ok ? `<div class="u-track" style="margin-top:7px"><i class="u-in" style="width:${wi}%"></i><i class="u-out" style="width:${w - wi}%"></i></div>` : `<div class="u-sub" style="font-size:.64rem;color:#ff6b9a;margin-top:6px">${esc(x.err || 'falhou')}</div>`}
        <div class="u-r2"><span>↑ ${fmtN(x.pt)} · ↓ ${fmtN(x.ct)}${x.est ? ' ~' : ''}</span><span>⏱ ${fmtMs(x.ms)}</span><span>${x.ok ? esc(fmtCost(x.cost, true)) : ''}</span></div>
      </div>`;
    }).join('');
    box.innerHTML = chips + cards + meter + `<div class="u-h">Últimas respostas</div><div class="u-list">${rows}</div>` +
      `<div class="u-sub" style="font-size:.6rem;color:var(--ck-dim);text-align:center">↑ roxo/ciano = enviado · ↓ = recebido · "~" = estimado (a API não informou)</div>` + help + actions();
    bind(box);
  }

  function actions() { return `<div class="u-actions"><button type="button" class="btn-block" id="usageExport">Exportar log</button><button type="button" class="btn-block" id="usageClear">Limpar</button></div>`; }

  function bind(box) {
    box.querySelectorAll('.u-chip').forEach((b) => b.addEventListener('click', () => { LS.setItem(RKEY, b.dataset.r); render(); }));
    const ex = $('usageExport'), cl = $('usageClear');
    if (ex) ex.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' });
      const name = 'kxt-usage-' + new Date().toISOString().slice(0, 10) + '.json';
      if (typeof DownloadUtils !== 'undefined' && DownloadUtils.triggerDownload) DownloadUtils.triggerDownload(blob, name);   // (const global: não é window.DownloadUtils)
      else { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
    });
    if (cl) {
      let armed = false, t = null;
      cl.addEventListener('click', () => {
        if (!armed) { armed = true; cl.textContent = 'Confirmar?'; cl.classList.add('active'); t = setTimeout(() => { armed = false; cl.textContent = 'Limpar'; cl.classList.remove('active'); }, 3000); return; }
        clearTimeout(t); save([]); render();
      });
    }
  }

  window.KXT_USAGE = { record, list: load, render, clear: () => { save([]); render(); }, estimate: (s) => Math.ceil(String(s == null ? '' : s).length / 4) };
  if (window.KXT_ready) KXT_ready(render); else document.addEventListener('DOMContentLoaded', render);
})();
