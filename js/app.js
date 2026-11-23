/* CS116 Trainer · app engine (no build step, no dependencies).
   Content lives in js/data/*.js. Progress is saved in localStorage. */
(() => {
'use strict';
const { units: UNITS, mock: MOCK, ex: EX = {} } = window.CS116;
const TRACES = window.CS116_TRACES || {};
const $app = document.getElementById('app');
const QUESTION_TYPES = new Set(['mcq', 'out', 'num', 'fill', 'bug', 'grid']);
const isQ = it => QUESTION_TYPES.has(it.t);

// ───────────────────────────── index content ─────────────────────────────
const Q = {};          // question id → { item, lesson, unit }
const LESSONS = [];    // flat, in path order
UNITS.forEach((u, ui) => u.lessons.forEach((l, li) => {
  l.unit = u; l.num = `${ui + 1}.${li + 1}`; LESSONS.push(l);
  l.items.forEach((it, i) => {
    it._id = `${l.id}:${i}`; Q[it._id] = { item: it, lesson: l, unit: u };
    if (!it.x && EX[it._id]) it.x = EX[it._id];   // explanations from js/data/explain.js
    if (it.again) {
      it.again._id = it._id + 'b'; it.again._base = it._id; Q[it.again._id] = { item: it.again, lesson: l, unit: u };
      if (!it.again.x && EX[it.again._id]) it.again.x = EX[it.again._id];
    }
  });
}));
MOCK.forEach((it, i) => { it._id = `mock:${i}`; Q[it._id] = { item: it, lesson: null, unit: null }; });

// ───────────────────────────── state ─────────────────────────────
const KEY = 'cs116-trainer-v1';
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const yesterday = () => { const d = new Date(Date.now() - 864e5); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
let S = load();
function load() {
  const base = { xp: 0, streak: 0, lastDay: null, day: { date: today(), xp: 0 }, goal: 60, done: {}, mistakes: {}, mocks: [], answered: 0, correct: 0 };
  try { return Object.assign(base, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return base; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } }
function addXP(n) {
  const t = today();
  if (S.day.date !== t) S.day = { date: t, xp: 0 };
  if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; }
  S.xp += n; S.day.xp += n; save();
}
function liveStreak() { return (S.lastDay === today() || S.lastDay === yesterday()) ? S.streak : 0; }
function addMistake(id) { const base = Q[id]?.item._base || id; const m = S.mistakes[base] || { n: 0 }; m.n++; m.at = Date.now(); S.mistakes[base] = m; save(); }
function clearMistake(id) { const base = Q[id]?.item._base || id; delete S.mistakes[base]; save(); }

// ───────────────────────────── helpers ─────────────────────────────
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(9)) if (k != null && k !== false) e.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return e;
}
const put = (el, ...kids) => { for (const k of kids.flat(9)) if (k != null && k !== false && k !== '') el.append(k instanceof Node ? k : document.createTextNode(String(k))); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function md(s) { // tiny inline markdown: **bold**, `code`, \* escapes, newlines
  if (!s) return '';
  let t = esc(s).replace(/\\\*/g, '\u0001');
  t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return t.replace(/\u0001/g, '*').replace(/\n/g, '<br>');
}
const KW = 'int|float|double|char|void|long|short|unsigned|_Bool|bool|return|if|else|for|while|do|switch|case|default|break|continue|true|false|const|sizeof';
const HL_RE = new RegExp(String.raw`(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*")|('(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|\b(${KW})\b|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*(?=\s*\())`, 'gm');
function hl(code) {
  let out = '', last = 0;
  code.replace(HL_RE, (m, com, str, chr, pre, kw, num, fn, idx) => {
    out += esc(code.slice(last, idx));
    const cls = com ? 'com' : str ? 'str' : chr ? 'chr' : pre ? 'pre' : kw ? 'kw' : num ? 'num' : 'fn';
    out += `<span class="tk-${cls}">${esc(m)}</span>`; last = idx + m.length; return m;
  });
  return out + esc(code.slice(last));
}
const codeBlock = (code, cls = '') => h('pre', { class: 'code ' + cls, html: hl(code) });
const outBlock = (text, label = 'Output') => h('div', { class: 'outbox' }, h('div', { class: 'outbox-l' }, label), h('pre', {}, text === '' ? '(nothing)' : text));
const norm = s => String(s ?? '').replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/^\n+|\n+$/g, '');
const squash = s => String(s ?? '').replace(/\s+/g, '');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const icon = {
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5-1.5 5-1.5 7.5A2.5 2.5 0 0 0 13 12c1.8 0 2.5-1.6 2.2-3.4C17.6 10.4 19 13 19 15.5A7 7 0 0 1 5 15.5C5 10 10.5 8 12 2Z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
};
const ico = (name, cls = '') => h('span', { class: 'ico ' + cls, html: icon[name] });

// ───────────────────────────── sound effects ─────────────────────────────
// Synthesised with the Web Audio API (no audio files to download). Muted state is saved in S.sound.
let actx = null;
function sfx(kind) {
  if (S.sound === false) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t0 = actx.currentTime + 0.01;
    const notes = { ok: [[659.25, 0], [987.77, 0.08]], bad: [[233.08, 0], [174.61, 0.12]], done: [[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.3]] }[kind];
    for (const [freq, dt] of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = kind === 'bad' ? 'triangle' : 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(kind === 'bad' ? 0.13 : 0.09, t0 + dt + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + (kind === 'done' ? 0.35 : 0.2));
      o.connect(g).connect(actx.destination);
      o.start(t0 + dt); o.stop(t0 + dt + 0.4);
    }
  } catch { /* audio unavailable: stay silent */ }
}
icon.sound = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
icon.mute = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function soundBtn() {
  const on = () => S.sound !== false;
  const b = h('button', { type: 'button', class: 'chip sound-btn', 'aria-pressed': String(on()), 'aria-label': 'Sound effects', title: 'Sound effects on/off' });
  const draw = () => { b.innerHTML = ''; b.append(ico(on() ? 'sound' : 'mute')); b.setAttribute('aria-pressed', String(on())); };
  b.onclick = () => { S.sound = !on(); save(); draw(); if (on()) sfx('ok'); };
  draw();
  return b;
}

// ───────────────────────────── visuals ─────────────────────────────
function arrayViz(name, values, changed = new Set()) {
  return h('div', { class: 'arr', role: 'img', 'aria-label': `${name}: ${values.join(', ')}` },
    values.map((v, i) => h('div', { class: 'arr-cell' + (changed.has(i) ? ' chg' : '') }, h('div', { class: 'arr-v' }, v), h('div', { class: 'arr-i' }, `${name}[${i}]`))));
}
function gridViz(name, rows, opts = {}) {
  const { pick, selected, correct, wrong, changed } = opts;
  const t = h('table', { class: 'grid' + (pick ? ' pickable' : '') });
  t.append(h('tr', {}, h('th', { class: 'corner' }, name), rows[0].map((_, c) => h('th', { scope: 'col' }, `col ${c}`))));
  rows.forEach((r, ri) => t.append(h('tr', {}, h('th', { scope: 'row' }, `row ${ri}`), r.map((v, ci) => {
    const key = ri + ',' + ci;
    let cls = '';
    if (selected === key) cls += ' sel';
    if (correct === key) cls += ' ok';
    if (wrong === key) cls += ' bad';
    if (changed && changed.has(key)) cls += ' chg';
    return pick
      ? h('td', { class: cls }, h('button', { type: 'button', 'aria-label': `${name}[${ri}][${ci}] = ${v}`, onclick: () => pick(ri, ci) }, v))
      : h('td', { class: cls }, v);
  }))));
  return h('div', { class: 'grid-wrap' }, t);
}
function boxes(it) {
  return [
    it.key && h('div', { class: 'box key' }, h('div', { class: 'box-l' }, 'Key idea'), h('div', { html: md(it.key) })),
    it.rule && h('div', { class: 'box rule' }, h('div', { class: 'box-l' }, 'Rule'), h('div', { html: md(it.rule) })),
    it.trap && h('div', { class: 'box trap' }, h('div', { class: 'box-l' }, 'Exam trap'), h('div', { html: md(it.trap) })),
  ];
}
function tableViz(rows) {
  return h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' },
    h('thead', {}, h('tr', {}, rows[0].map(c => h('th', { html: md(c) })))),
    h('tbody', {}, rows.slice(1).map(r => h('tr', {}, r.map(c => h('td', { html: md(c) })))))));
}

// ───────────────────────────── tracer ─────────────────────────────
function fmtVal(v, type) {
  if (v === '?' || v == null) return '?';
  if (type === 'c' && /^c-?\d+$/.test(v)) { const n = +v.slice(1); return n >= 32 && n < 127 ? `'${String.fromCharCode(n)}'` : String(n); }
  if (type === 'f') { let s = v.replace(/0+$/, ''); if (s.endsWith('.')) s += '0'; return s; }
  return v;
}
function Tracer(id, opts = {}) {
  const T = TRACES[id];
  if (!T) return h('p', {}, `Missing tracer: ${id}`);
  const scalars = T.watch.filter(w => !w.dims.length), arrays = T.watch.filter(w => w.dims.length);
  let cur = -1;
  const root = h('div', { class: 'tracer', tabindex: '0', 'aria-label': `Code tracer: ${T.title}` });
  const codeEl = h('div', { class: 'tr-code code' });
  const lineEls = T.code.map((line, i) => { const e = h('div', { class: 'tr-line' }, h('span', { class: 'ln' }, i + 1), h('span', { class: 'lc', html: hl(line) || ' ' })); codeEl.append(e); return e; });
  const msg = h('div', { class: 'tr-msg' });
  const tbody = h('tbody');
  const table = h('table', { class: 'tr-table' },
    h('thead', {}, h('tr', {}, h('th', {}, 'step'), h('th', {}, 'line'), scalars.map(w => h('th', { class: 'var' }, w.name)), h('th', {}, 'what happened'))), tbody);
  const tableWrap = h('div', { class: 'tr-table-wrap' }, table);
  const arrEl = h('div', { class: 'tr-arrays' });
  const outPre = h('pre');
  const btnBack = h('button', { class: 'btn ghost sm', type: 'button', onclick: () => go(cur - 1) }, '‹ Back');
  const btnNext = h('button', { class: 'btn primary sm', type: 'button', onclick: () => go(cur + 1) }, 'Next line ›');
  const btnEnd = h('button', { class: 'btn ghost sm', type: 'button', onclick: () => go(T.steps.length - 1) }, 'Run to end');
  const btnReset = h('button', { class: 'btn ghost sm', type: 'button', onclick: () => go(-1) }, 'Reset');
  const counter = h('span', { class: 'tr-count' });
  root.append(
    h('div', { class: 'tr-head' }, h('span', { class: 'tr-title' }, T.title), T.stdin && h('span', { class: 'tr-stdin' }, 'input: ', h('code', {}, T.stdin.replace(/\\n/g, ' ')))),
    h('div', { class: 'tr-top' }, codeEl, h('div', { class: 'tr-side' }, h('div', { class: 'outbox' }, h('div', { class: 'outbox-l' }, 'Output'), outPre), arrEl)),
    msg,
    h('div', { class: 'tr-ctrl' }, btnReset, btnBack, btnNext, btnEnd, counter),
    tableWrap);
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  const sub = (expr, v) => {
    let s = expr;
    for (const w of arrays.filter(a => a.dims.length === 1)) {
      s = s.replace(new RegExp(`\\b${w.name}\\[(\\w+)\\]`, 'g'), (m, ix) => { const k = /^\d+$/.test(ix) ? +ix : +v[ix]; return v[w.name] && v[w.name][k] != null ? v[w.name][k] : m; });
    }
    for (const w of scalars) s = s.replace(new RegExp(`\\b${w.name}\\b(?!\\s*\\[)`, 'g'), fmtVal(v[w.name], w.type));
    return s;
  };
  const isAssign = t => /(^|[^=!<>])=(?!=)/.test(t);
  function describe(st) {
    const line = st.l ? T.code[st.l - 1].trim() : '';
    switch (st.k) {
      case 'c': {
        if (isAssign(st.t)) return { long: `Check <code>${esc(st.t)}</code>: this is an ASSIGNMENT, not a comparison. Its value is ${st.r ? 'non-zero → <b class="t-ok">true ✔</b>' : '0 → <b class="t-bad">false ✘</b>'}`, short: `${st.t} → ${st.r ? 'true' : 'false'}` };
        const s = sub(st.t, st.v);
        const shown = s !== st.t ? ` → <code>${esc(s)}</code>` : '';
        return { long: `Check <code>${esc(st.t)}</code>${shown} → ${st.r ? '<b class="t-ok">true ✔</b>' : '<b class="t-bad">false ✘</b>'}`, short: `${s} ${st.r ? '✔' : '✘'}` };
      }
      case 'e': {
        const name = (st.t.match(/[A-Za-z_]\w*/) || [])[0]; const w = scalars.find(x => x.name === name);
        const val = w ? ` → ${name} = ${fmtVal(st.v[name], w.type)}` : '';
        return { long: `Run <code>${esc(st.t)}</code>${esc(val)}`, short: st.t };
      }
      case 'v': {
        const w = scalars.find(x => x.name === st.t.trim());
        const shown = w && w.type === 'c' ? `'${String.fromCharCode(st.r)}' (${st.r})` : st.r;
        return { long: `switch value: <code>${esc(st.t)}</code> = <b>${esc(String(shown))}</b> → jump to the matching case`, short: `switch → ${shown}` };
      }
      case 'n': return { long: esc(st.t), short: (st.t.split(':')[0].length < 18 ? st.t.split(':')[0] : '') };
      default: return { long: `Ran line ${st.l}: <code>${esc(line)}</code>`, short: '' };
    }
  }
  function cell(w, st, prev) {
    const v = fmtVal(st.v[w.name], w.type); const pv = prev ? fmtVal(prev.v[w.name], w.type) : null;
    return h('td', { class: 'var' + (prev && pv !== v ? ' chg' : '') }, v);
  }
  function go(n) {
    cur = Math.max(-1, Math.min(T.steps.length - 1, n));
    lineEls.forEach(e => e.classList.remove('on'));
    tbody.innerHTML = '';
    const st = T.steps[cur];
    if (cur >= 0 && st.l) lineEls[st.l - 1].classList.add('on');
    // table rows
    T.steps.slice(0, cur + 1).forEach((s, i) => {
      const d = describe(s);
      tbody.append(h('tr', { class: i === cur ? 'on' : '' }, h('td', {}, i + 1), h('td', {}, s.l), scalars.map(w => cell(w, s, T.steps[i - 1])), h('td', { class: 'what' }, d.short)));
    });
    if (cur >= 0) { const last = tbody.lastChild; tableWrap.scrollTop = last.offsetTop - tableWrap.clientHeight + last.offsetHeight + 8; }
    // arrays
    arrEl.innerHTML = '';
    if (arrays.length) {
      const ref = st || T.steps[0]; const prev = T.steps[cur - 1];
      for (const w of arrays) {
        const vals = ref.v[w.name];
        if (w.dims.length === 1) {
          const ch = new Set(); if (prev && st) vals.forEach((x, i) => { if (prev.v[w.name][i] !== x) ch.add(i); });
          arrEl.append(arrayViz(w.name, cur < 0 ? vals.map(() => '') : vals, ch));
        } else {
          const ch = new Set(); if (prev && st) vals.forEach((r, i) => r.forEach((x, j) => { if (prev.v[w.name][i][j] !== x) ch.add(i + ',' + j); }));
          arrEl.append(gridViz(w.name, cur < 0 ? vals.map(r => r.map(() => '')) : vals, { changed: ch }));
        }
      }
    }
    // output
    const o = st ? st.o : ''; const po = cur > 0 ? T.steps[cur - 1].o : '';
    outPre.innerHTML = o.startsWith(po) ? esc(po) + `<mark>${esc(o.slice(po.length))}</mark>` : esc(o);
    if (!o) outPre.innerHTML = '<span class="muted">(nothing yet)</span>';
    msg.innerHTML = cur < 0 ? 'Press <b>Next line</b> (or →) to run the program one step at a time.'
      : describe(st).long + (cur === T.steps.length - 1 ? ' <span class="tr-done">· program finished</span>' : '');
    counter.textContent = `${cur + 1} / ${T.steps.length}`;
    btnBack.disabled = cur < 0; btnNext.disabled = btnEnd.disabled = cur >= T.steps.length - 1;
    root.dispatchEvent(new CustomEvent('trace', { detail: { done: cur >= T.steps.length - 1 } }));
  }
  go(opts.atEnd ? T.steps.length - 1 : -1);
  return root;
}

// ───────────────────────────── question widgets ─────────────────────────────
// Each widget returns { el, get(), lock(), ready() }. evaluate(item, answer) returns the verdict.
function widget(item, onChange) {
  const changed = () => onChange && onChange();
  switch (item.t) {
    case 'mcq': {
      const order = shuffle(item.o.map((_, i) => i));
      let sel = null;
      // if any option is code-like, render ALL options as code so styling never hints at the answer
      const codey = item.o.some(o => /[;(){}"%*\n]/.test(o[0]));
      const btns = order.map((oi, k) => h('button', { type: 'button', class: 'opt', 'data-oi': oi, onclick: () => { sel = oi; btns.forEach(b => b.classList.toggle('sel', +b.dataset.oi === oi)); changed(); } },
        h('span', { class: 'opt-k' }, String.fromCharCode(65 + k)), h('span', { class: 'opt-t', html: codey ? `<code>${esc(item.o[oi][0])}</code>` : md(item.o[oi][0]) })));
      return { el: h('div', { class: 'opts' }, btns), get: () => sel, ready: () => sel != null, lock: (res) => btns.forEach(b => { b.disabled = true; const oi = +b.dataset.oi; if (oi === item.a) b.classList.add('ok'); else if (oi === sel) b.classList.add('bad'); }), keys: k => { const b = btns[k]; if (b) b.click(); } };
    }
    case 'out': {
      const ta = h('textarea', { class: 'answer mono', rows: Math.min(8, Math.max(2, String(item.a).split('\n').length + 1)), placeholder: 'Type the exact output…', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', 'aria-label': 'Your output', oninput: changed });
      return { el: h('div', {}, ta, h('p', { class: 'hint' }, 'One line per \\n. Spaces between values matter; extra spaces at line ends don\'t. A tab can be typed as a space.')), get: () => ta.value, ready: () => ta.value.trim() !== '', lock: () => { ta.disabled = true; }, focus: () => ta.focus() };
    }
    case 'num': {
      const inp = h('input', { class: 'answer mono num', inputmode: 'numeric', autocomplete: 'off', placeholder: '?', 'aria-label': 'Your answer', oninput: changed });
      return { el: h('div', {}, inp), get: () => inp.value, ready: () => inp.value.trim() !== '', lock: () => { inp.disabled = true; }, focus: () => inp.focus() };
    }
    case 'fill': {
      const inputs = [];
      const pre = h('pre', { class: 'code fill' });
      const parts = item.code.split(/(\[\[\d+\]\])/);
      for (const p of parts) {
        const m = p.match(/^\[\[(\d+)\]\]$/);
        if (m) { const k = +m[1]; const w = Math.max(3, ...item.b[k].map(s => s.length)) + 1; const inp = h('input', { class: 'blank', size: w, style: `width:${w + 1}ch`, spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': `Blank ${k + 1}`, oninput: changed }); inputs[k] = inp; pre.append(inp); }
        else pre.append(h('span', { html: hl(p) }));
      }
      return { el: pre, get: () => inputs.map(i => i.value), ready: () => inputs.every(i => i.value.trim() !== ''), lock: (res) => inputs.forEach((inp, k) => { inp.disabled = true; inp.classList.add(res && res.blanks && res.blanks[k] ? 'ok' : 'bad'); }), focus: () => inputs[0] && inputs[0].focus() };
    }
    case 'bug': {
      let sel = null;
      const lines = item.code.split('\n').map((line, i) => h('button', { type: 'button', class: 'bug-line', onclick: () => { sel = i; lines.forEach((b, j) => b.classList.toggle('sel', j === i)); changed(); } },
        h('span', { class: 'ln' }, i + 1), h('span', { html: hl(line) || ' ' })));
      return { el: h('div', { class: 'code bug' }, lines), get: () => sel, ready: () => sel != null, lock: () => lines.forEach((b, j) => { b.disabled = true; if (j === item.a) b.classList.add('ok'); else if (j === sel) b.classList.add('bad'); }) };
    }
    case 'grid': {
      let sel = null; const wrap = h('div');
      const draw = (o = {}) => { wrap.innerHTML = ''; wrap.append(gridViz(item.name, item.grid, { pick: o.locked ? null : (r, c) => { sel = r + ',' + c; draw(); changed(); }, selected: sel, ...o })); };
      draw();
      return { el: wrap, get: () => sel, ready: () => sel != null, lock: () => draw({ locked: true, correct: item.a.join(','), wrong: sel !== item.a.join(',') ? sel : null }) };
    }
  }
}

function evaluate(item, ans) {
  switch (item.t) {
    case 'mcq': {
      const ok = ans === item.a;
      return { ok, why: item.o[ans] ? item.o[ans][1] : '', correctWhy: item.o[item.a][1], correctText: item.o[item.a][0] };
    }
    case 'out': {
      const n = norm(ans); const accepted = [item.a, ...(item.alt || [])].map(norm);
      const ok = accepted.includes(n);
      const w = item.w || {}; let why = '';
      for (const [k, v] of Object.entries(w)) if (norm(k) === n) why = v;
      if (!ok && !why) {
        const lines = norm(item.a).split('\n'), mine = n.split('\n');
        if (squash(n) === squash(item.a)) why = 'The values are right, but the spacing or line breaks differ. Every \\n starts a new line, and spaces in the format string are printed exactly.';
        else if (mine.length !== lines.length) why = `The real output has ${lines.length} line${lines.length > 1 ? 's' : ''}; yours has ${mine.length}. Check where each \\n is.`;
        else { const k = lines.findIndex((l, i) => l !== mine[i]); why = `Line ${k + 1} differs: you wrote “${mine[k]}”, but C prints “${lines[k]}”.`; }
      }
      return { ok, why, correctText: item.a };
    }
    case 'num': {
      const v = parseFloat(String(ans).trim()); const ok = v === Number(item.a);
      const why = (item.w && item.w[String(v)]) || (!ok ? '' : '');
      return { ok, why, correctText: String(item.a) };
    }
    case 'fill': {
      const blanks = item.b.map((alts, k) => alts.some(a => squash(a) === squash(ans[k])));
      return { ok: blanks.every(Boolean), blanks, correctText: item.b.map(a => a[0]).join('   ·   '), why: blanks.every(Boolean) ? '' : `Blank${blanks.filter(b => !b).length > 1 ? 's' : ''} ${blanks.map((b, k) => b ? null : k + 1).filter(Boolean).join(', ')} ${blanks.filter(b => !b).length > 1 ? 'are' : 'is'} wrong.` };
    }
    case 'bug': {
      const ok = ans === item.a;
      const why = ok ? '' : ((item.w && item.w[ans]) || 'That line is correct as written.');
      return { ok, why, correctText: `Line ${item.a + 1}: ${item.code.split('\n')[item.a].trim()}  →  ${item.fix || ''}` };
    }
    case 'grid': {
      const [r, c] = (ans || '0,0').split(',').map(Number); const [ar, ac] = item.a; const ok = r === ar && c === ac;
      let why = '';
      if (!ok) {
        why = `You tapped ${item.name}[${r}][${c}] = ${item.grid[r][c]}. `;
        if (r === ac && c === ar) why += 'You swapped them: the FIRST index is the row, the second is the column.';
        else if (item.math && r === ar + 1 && c === ac + 1) why += 'That is counting from 1 like maths. In C subtract 1 from both: X3,2 → X[2][1].';
        else if (r === ar + 1 || c === ac + 1) why += 'Count from 0: the first row is row 0, the first column is column 0.';
        else why += `Go to row ${ar} first (counting from 0, top to bottom), then column ${ac} (from 0, left to right).`;
      }
      return { ok, why, correctText: `${item.name}[${ar}][${ac}] = ${item.grid[ar][ac]}` };
    }
  }
}

function questionHead(item) {
  return [
    h('h2', { class: 'q', html: md(item.q || 'What does this print?') }),
    item.code && item.t !== 'fill' && item.t !== 'bug' && codeBlock(item.code),
    item.stdin && h('p', { class: 'stdin' }, 'Keyboard input: ', h('code', {}, item.stdin.replace(/\n/g, ' ⏎ '))),
  ];
}

const TYPE_LABEL = { mcq: 'Multiple choice', out: 'What does it print?', num: 'Give the number', fill: 'Fill in the code', bug: 'Find the bug', grid: 'Pick the [row][col]', learn: 'Learn', steps: 'Step by step', trace: 'Code tracer' };

function feedbackBody(item, res, ans) {
  const parts = [];
  if (item.t === 'mcq' && res.gaveUp) {
    // "I don't know" / unanswered: teach the whole question, i.e. the right answer AND why each other option is wrong
    parts.push(h('p', { html: `<b>Answer:</b> <code>${esc(res.correctText)}</code>. ${md(item.o[item.a][1])}` }));
    const others = item.o.map((o, i) => i).filter(i => i !== item.a);
    parts.push(h('div', { class: 'fb-why' }, h('b', {}, 'Why the other options are wrong:'),
      h('ul', { class: 'fb-list' }, others.map(i => h('li', {}, h('code', {}, item.o[i][0]), ' ', h('span', { html: md(item.o[i][1]) }))))));
  } else if (item.t === 'mcq') {
    if (res.ok) parts.push(h('p', { html: md(res.correctWhy) }));
    else { parts.push(h('p', { class: 'fb-why', html: '<b>Why your choice is wrong:</b> ' + md(res.why) })); parts.push(h('p', { html: `<b>Correct:</b> ${esc(res.correctText)}. ${md(res.correctWhy)}` })); }
  } else if (item.t === 'out' && res.gaveUp) {
    parts.push(outBlock(item.a, 'C prints'));
  } else if (item.t === 'out') {
    if (!res.ok) {
      if (res.why) parts.push(h('p', { class: 'fb-why', html: '<b>Why:</b> ' + md(res.why) }));
      parts.push(h('div', { class: 'fb-cmp' }, outBlock(ans || '', 'You wrote'), outBlock(item.a, 'C prints')));
    }
  } else if (res.why) parts.push(h('p', { class: 'fb-why', html: (res.ok ? '' : '<b>Why:</b> ') + md(res.why) }));
  if (!res.ok && item.t !== 'mcq' && item.t !== 'out') parts.push(h('p', {}, h('b', {}, 'Answer: '), h('code', {}, res.correctText)));
  if (item.t === 'bug' && res.ok && item.fix) parts.push(h('p', {}, h('b', {}, 'Fix: '), h('code', {}, item.fix)));
  if (item.t === 'grid' && res.gaveUp) {
    const [r, c] = item.a;
    parts.push(h('p', { class: 'fb-why', html: (item.math ? `<b>Step by step:</b> maths counts from 1, C counts from 0, so subtract 1 from both: X${r + 1},${c + 1} → X[${r}][${c}]. Then ` : '<b>Step by step:</b> ') +
      `the FIRST index is the row: go down to row ${r} (the top row is row 0). The SECOND index is the column: go across to column ${c} (the left column is column 0). That box holds <b>${esc(String(item.grid[r][c]))}</b>.` }));
  }
  if (item.x) parts.push(h('p', { class: res.gaveUp ? 'fb-why' : 'fb-x', html: (res.gaveUp ? '<b>Step by step:</b> ' : '') + md(item.x) }));
  return parts;
}

// ───────────────────────────── router ─────────────────────────────
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  const [view, arg] = location.hash.replace(/^#\/?/, '').split('/');
  window.scrollTo(0, 0);
  $app.innerHTML = '';
  if (view === 'lesson') { const l = LESSONS.find(x => x.id === arg); return l ? playLesson(l) : home(); }
  if (view === 'mistakes') return mistakesView();
  if (view === 'review') return startReview();
  if (view === 'weak') return startWeak();
  if (view === 'mock') return arg ? runMock(arg) : mockView();
  if (view === 'sheet') return sheetView();
  return home();
}
window.addEventListener('hashchange', route);
// GoatCounter counts the first page load by itself; count in-app navigation (lessons, exams) as page views too.
// Hash routes like #/lesson/u1-names show up in the dashboard as /cs116-trainer/#/lesson/u1-names.
window.addEventListener('hashchange', () => {
  if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: location.pathname + location.hash, title: document.title });
});

function topbar(back) {
  const pct = Math.min(100, Math.round(S.day.date === today() ? S.day.xp / S.goal * 100 : 0));
  return h('header', { class: 'topbar' },
    h('div', { class: 'wrap topbar-in' },
      back ? h('a', { class: 'back', href: '#/' }, '‹ Path') : h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-mark' }, '>_'), h('span', {}, 'cs116', h('b', { class: 'brand-b' }, '.trainer'))),
      h('div', { class: 'stats' },
        soundBtn(),
        h('span', { class: 'chip streak', title: 'Day streak' }, ico('flame'), liveStreak()),
        h('span', { class: 'chip xp', title: 'Total XP' }, ico('bolt'), S.xp),
        h('span', { class: 'chip goal', title: `Daily goal: ${S.day.date === today() ? S.day.xp : 0} / ${S.goal} XP` }, h('span', { class: 'ring', style: `--p:${pct}` }), `${pct}%`))));
}

// ───────────────────────────── home ─────────────────────────────
function lessonState(l) { return S.done[l.id] ? 'done' : 'todo'; }
function home() {
  const next = LESSONS.find(l => !S.done[l.id]) || LESSONS[0];
  const weak = LESSONS.filter(l => l.weak);
  const weakDone = weak.filter(l => S.done[l.id]).length;
  const doneN = LESSONS.filter(l => S.done[l.id]).length;
  const mistakesN = Object.keys(S.mistakes).length;
  const best = S.mocks.length ? Math.max(...S.mocks.map(m => Math.round(m.score / m.total * 100))) : null;
  $app.append(topbar(), h('main', { class: 'wrap home' },
    h('section', { class: 'hero' },
      h('div', { class: 'hero-txt' },
        h('p', { class: 'eyebrow' }, '~/gju/cs116 $ ./train --exam  ·  German Jordanian University (GJU)'),
        h('h1', {}, 'Learn the rules. Trace the code. Pass the exam.'),
        h('p', { class: 'credit mono-s' }, '// built by ', h('b', {}, 'Zaid Altal'), ' · GJU CS116'),
        h('p', { class: 'lead' }, `${LESSONS.length} short lessons covering every slide of the exam deck, with a step-by-step code tracer and instant feedback on every wrong answer.`),
        h('div', { class: 'hero-cta' },
          h('a', { class: 'btn primary lg', href: `#/lesson/${next.id}` }, doneN ? `Continue: ${next.title}` : 'Start lesson 1.1'),
          h('a', { class: 'btn ghost lg', href: '#/weak' }, ico('target'), 'Common-traps drill'))),
      h('div', { class: 'hero-stats' },
        stat(`${doneN}/${LESSONS.length}`, 'lessons done'), stat(`${weakDone}/${weak.length}`, 'extra-practice done'),
        stat(S.answered ? Math.round(S.correct / S.answered * 100) + '%' : '–', 'accuracy'), stat(best != null ? best + '%' : '–', 'best mock'))),
    h('section', { class: 'tools' },
      tool('#/mistakes', 'Mistakes deck', mistakesN ? `${mistakesN} question${mistakesN > 1 ? 's' : ''} to review` : 'Wrong answers collect here', mistakesN ? 'warn' : ''),
      tool('#/mock', 'Timed mock exam', 'Deck mock, real past papers, or a mixed set', ''),
      tool('#/sheet', 'Rules & traps sheet', 'Every rule box on one page, for the night before', '')),
    UNITS.map((u, ui) => {
      const done = u.lessons.filter(l => S.done[l.id]).length;
      return h('section', { class: 'unit' },
        h('div', { class: 'unit-head' },
          h('div', {}, h('p', { class: 'eyebrow' }, `unit_0${ui + 1} · ${u.sub}`), h('h2', {}, u.title)),
          h('div', { class: 'unit-prog', 'aria-label': `${done} of ${u.lessons.length} lessons done` }, h('div', { class: 'bar' }, h('span', { style: `width:${done / u.lessons.length * 100}%` })), h('span', {}, `${done}/${u.lessons.length}`))),
        h('ol', { class: 'path' }, u.lessons.map(l => {
          const st = lessonState(l); const d = S.done[l.id];
          const qn = l.items.filter(isQ).length;
          return h('li', { class: `node ${st}${l === next ? ' next' : ''}` },
            h('a', { href: `#/lesson/${l.id}` },
              h('span', { class: 'dot' }, st === 'done' ? h('span', { html: icon.check }) : l.num),
              h('span', { class: 'node-txt' },
                h('span', { class: 'node-t' }, l.title, l.weak && h('span', { class: 'tag weak' }, 'Extra practice')),
                h('span', { class: 'node-m' }, `${l.mins} min · ${qn} questions · slide${/[–,]/.test(l.slides) ? 's' : ''} ${l.slides}`, d && ` · best ${d.best}%`))));
        })));
    }),
    h('footer', { class: 'foot' },
      h('p', { class: 'credit' }, 'Built by ', h('b', {}, 'Zaid Altal'), ' for CS116 Computing Fundamentals students at the German Jordanian University (GJU). Not an official GJU resource.'),
      h('p', {}, 'Every code example and expected output in this trainer was compiled and run with gcc. Progress is stored only in this browser.'),
      h('button', { class: 'linkbtn', type: 'button', onclick: () => { if (confirm('Reset all progress, XP and mistakes?')) { localStorage.removeItem(KEY); S = load(); route(); } } }, 'Reset progress'))));
}
const stat = (v, l) => h('div', { class: 'stat' }, h('b', {}, v), h('span', {}, l));
const tool = (href, t, d, cls) => h('a', { class: 'tool ' + cls, href }, h('b', {}, t), h('span', {}, d), h('span', { class: 'arrow' }, '→'));

// ───────────────────────────── session player ─────────────────────────────
function playLesson(l) {
  session({ title: `${l.num} · ${l.title}`, lesson: l, items: l.items.map(it => ({ item: it })) });
}
function startReview() {
  const ids = Object.keys(S.mistakes).filter(id => Q[id]);
  if (!ids.length) { location.hash = '#/mistakes'; return; }
  session({ title: 'Mistakes review', review: true, items: shuffle(ids).slice(0, 20).map(id => ({ item: Q[id].item })) });
}
function startWeak() {
  const pool = LESSONS.filter(l => l.weak).flatMap(l => l.items.filter(isQ));
  session({ title: 'Common-traps drill', review: false, drill: true, items: shuffle(pool).slice(0, 15).map(item => ({ item })) });
}

// ───────────────────────────── answer recap (summary screen + previous-question view) ─────────────────────────────
// Read-only by design: these render plain text/code, never input widgets, so a submitted answer can't be changed.
function answerText(item, ans, res) {
  if (res.gaveUp || ans == null) return null; // "I don't know" / unanswered
  switch (item.t) {
    case 'mcq': return item.o[ans] ? item.o[ans][0] : '';
    case 'out': return String(ans).replace(/\s+$/, '') || '(empty)';
    case 'num': return String(ans).trim();
    case 'fill': return ans.map((a, k) => `${k + 1}) ${a.trim() || '(empty)'}`).join('   ');
    case 'bug': return `Line ${ans + 1}: ${item.code.split('\n')[ans].trim()}`;
    case 'grid': { const [r, c] = String(ans).split(',').map(Number); return `${item.name}[${r}][${c}] = ${item.grid[r][c]}`; }
  }
  return String(ans);
}
function correctAnswerText(item, res) {
  switch (item.t) {
    case 'mcq': return item.o[item.a][0];
    case 'out': return item.a === '' ? '(nothing)' : item.a;
    case 'fill': return item.b.map((b, k) => `${k + 1}) ${b[0]}`).join('   ');
    case 'bug': return `Line ${item.a + 1} → ${item.fix || item.code.split('\n')[item.a].trim()}`;
    default: return res.correctText;
  }
}
function recapRow(entry, { open = false } = {}) {
  const { item, ans, res, n, retry } = entry;
  const mine = answerText(item, ans, res);
  const shownCode = item.t === 'fill' ? item.code.replace(/\[\[\d+\]\]/g, '____') : item.code;
  return h('details', { class: 'recap ' + (res.ok ? 'ok' : 'bad'), open: open || null },
    h('summary', {},
      h('span', { class: 'recap-ico', role: 'img', 'aria-label': res.ok ? 'Correct' : 'Wrong' }, res.ok ? '✅' : '❌'),
      h('span', { class: 'recap-main' },
        h('span', { class: 'recap-q' }, h('b', {}, `Q${n}. `), h('span', { html: md(item.q || 'What does this print?') }), retry && h('span', { class: 'tag retry' }, 'Re-ask')),
        h('span', { class: 'recap-ans' }, h('span', { class: 'lbl' }, 'Your answer'), mine == null ? h('i', { class: 'muted' }, "I don't know") : h('code', { class: res.ok ? 'is-ok' : 'is-bad' }, mine)),
        res.ok ? null : h('span', { class: 'recap-ans' }, h('span', { class: 'lbl' }, 'Correct'), h('code', { class: 'is-ok' }, correctAnswerText(item, res))),
        h('span', { class: 'recap-more' }, 'Explanation ▾'))),
    h('div', { class: 'recap-body' },
      shownCode && codeBlock(shownCode),
      item.stdin && h('p', { class: 'stdin' }, 'Keyboard input: ', h('code', {}, item.stdin.replace(/\n/g, ' ⏎ '))),
      h('div', { class: 'fb-body' }, feedbackBody(item, res, ans)),
      item.trace && traceToggle(item.trace)));
}

function session(cfg) {
  const queue = cfg.items.slice();
  let pos = 0, gained = 0, right = 0, wrong = 0, firstTry = 0, qTotal = queue.filter(e => isQ(e.item)).length;
  const t0 = Date.now();
  const bar = h('div', { class: 'pbar' }, h('span'));
  const xpChip = h('span', { class: 'chip xp' }, ico('bolt'), '+0');
  // every graded answer, in order (feeds the look-back view and the end-of-lesson summary)
  const history = [];
  // Look-back navigation: viewPos is the card on screen; pos is where you really are in the lesson.
  // Earlier cards are shown read-only (notes re-render, answered questions show your locked answer).
  // The live card's DOM is stashed while you look back, so half-typed answers survive the trip.
  let viewPos = 0, stash = null;
  const backBtn = h('button', { class: 'chip prev-btn', type: 'button', disabled: true, 'aria-label': 'Go back to the previous card', title: 'Go back (notes and answered questions, read-only)', onclick: () => goBack() }, '‹ Back');
  const updateNav = () => { backBtn.disabled = viewPos === 0; };
  const head = h('header', { class: 'lhead' }, h('div', { class: 'wrap lhead-in' },
    h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Quit', onclick: () => { if (pos === 0 || confirm('Leave this session? Progress in it is lost.')) location.hash = '#/'; }, html: icon.x }),
    bar, backBtn, soundBtn(), xpChip));
  const main = h('main', { class: 'wrap lmain' });
  const foot = h('footer', { class: 'lfoot' });
  $app.append(head, main, foot);
  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.tagName !== 'TEXTAREA') { const b = foot.querySelector('.btn.primary:not([disabled])'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { const b = foot.querySelector('.btn.primary:not([disabled])'); if (b) { e.preventDefault(); b.click(); } }
    if (/^[1-4]$/.test(e.key) && curW && curW.keys && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) curW.keys(+e.key - 1);
  };
  document.addEventListener('keydown', onKey);
  cleanup = () => document.removeEventListener('keydown', onKey);
  let curW = null;

  function progress() { bar.firstChild.style.width = `${pos / queue.length * 100}%`; xpChip.lastChild.textContent = `+${gained}`; }
  function footer(...kids) { foot.innerHTML = ''; foot.className = 'lfoot'; foot.append(h('div', { class: 'wrap lfoot-in' }, kids)); }

  // ── content builders shared by the live card and the look-back view
  const learnContent = it => [h('h2', { class: 'learn-h' }, it.h), it.p && h('div', { class: 'prose', html: md(it.p) }), it.table && tableViz(it.table),
    it.code && codeBlock(it.code), it.code && it.out != null && outBlock(it.out), it.stdin && it.out != null && h('p', { class: 'stdin' }, 'Keyboard input: ', h('code', {}, it.stdin)),
    it.array && arrayViz(it.array.name, it.array.values), it.grid && gridViz(it.grid.name, it.grid.rows), boxes(it)];
  const stepsHead = it => [h('h2', { class: 'learn-h' }, it.h), it.p && h('div', { class: 'prose', html: md(it.p) }), it.pre && h('p', { class: 'stdin' }, 'With ', h('code', {}, it.pre))];

  function goBack() {
    if (viewPos === 0) return;
    if (viewPos === pos) stash = { main: [...main.childNodes], foot: [...foot.childNodes], footClass: foot.className, pad: main.style.paddingBottom, curW, y: window.scrollY };
    viewPos--; renderLookBack();
  }
  function goForward() {
    if (viewPos >= pos) return;
    viewPos++;
    if (viewPos === pos) { // back to the live card, exactly as it was left
      main.replaceChildren(...stash.main); foot.replaceChildren(...stash.foot); foot.className = stash.footClass;
      main.style.paddingBottom = stash.pad; curW = stash.curW; const y = stash.y; stash = null; updateNav(); window.scrollTo(0, y);
    } else renderLookBack();
  }
  function renderLookBack() {
    const entry = queue[viewPos]; const it = entry.item;
    curW = null; main.style.paddingBottom = ''; window.scrollTo(0, 0); updateNav();
    const card = h('article', { class: 'card lookback' },
      h('p', { class: 'qtype' }, `Looking back · ${TYPE_LABEL[it.t]}`, h('span', { class: 'tag' }, 'read-only')));
    main.replaceChildren(card);
    if (it.t === 'learn') put(card, learnContent(it));
    else if (it.t === 'steps') put(card, stepsHead(it), h('ol', { class: 'steps' }, it.steps.map(s => h('li', {}, h('code', {}, s)))), boxes(it));
    else if (it.t === 'trace') put(card, h('h2', { class: 'learn-h' }, it.h || 'Trace it'), it.p && h('div', { class: 'prose', html: md(it.p) }), Tracer(it.id), boxes(it));
    else if (entry.hist) put(card, h('p', { class: 'muted small' }, 'Answers can’t be changed after submitting.'), recapRow(entry.hist, { open: true }));
    const toLive = viewPos + 1 === pos;
    const fwd = h('button', { class: 'btn primary', type: 'button', onclick: goForward }, toLive ? 'Back to where I was ›' : 'Forward ›');
    footer(h('button', { class: 'btn ghost', type: 'button', disabled: viewPos === 0, onclick: goBack }, '‹ Back'),
      h('span', { class: 'lb-count muted mono-s' }, `${viewPos + 1} / ${pos + 1}`), fwd);
  }

  function show() {
    progress(); main.innerHTML = ''; main.style.paddingBottom = ''; curW = null; window.scrollTo(0, 0);
    viewPos = pos; stash = null; updateNav();
    if (pos >= queue.length) return finish();
    const entry = queue[pos]; const it = entry.item;
    const tag = h('p', { class: 'qtype' }, TYPE_LABEL[it.t], entry.retry && h('span', { class: 'tag retry' }, 'Try again'), Q[it._id]?.lesson?.weak && cfg.drill && h('span', { class: 'tag weak' }, Q[it._id].lesson.title));
    const card = h('article', { class: 'card' }, tag);
    main.append(card);
    if (it.t === 'learn') {
      put(card, learnContent(it));
      footer(h('span'), h('button', { class: 'btn primary', type: 'button', onclick: next }, 'Continue'));
    } else if (it.t === 'steps') {
      let k = 1; const list = h('ol', { class: 'steps' });
      const draw = () => { list.innerHTML = ''; it.steps.slice(0, k).forEach((s, i) => list.append(h('li', { class: i === k - 1 ? 'new' : '' }, h('code', {}, s)))); };
      draw();
      put(card, stepsHead(it), list, boxes(it));
      const btn = h('button', { class: 'btn primary', type: 'button' }, 'Next step');
      btn.onclick = () => { if (k < it.steps.length) { k++; draw(); if (k === it.steps.length) btn.textContent = 'Continue'; } else next(); };
      if (it.steps.length === 1) btn.textContent = 'Continue';
      footer(h('span', { class: 'muted' }, 'Reveal each step'), btn);
    } else if (it.t === 'trace') {
      const tr = Tracer(it.id);
      put(card, h('h2', { class: 'learn-h' }, it.h || 'Trace it'), it.p && h('div', { class: 'prose', html: md(it.p) }), tr, boxes(it));
      const btn = h('button', { class: 'btn primary', type: 'button', onclick: next }, 'Continue');
      const skip = h('span', { class: 'muted' }, 'Step to the end, or continue any time');
      tr.addEventListener('trace', e => { if (e.detail.done) skip.textContent = 'Trace complete ✔'; });
      footer(skip, btn);
      setTimeout(() => tr.focus({ preventScroll: true }), 50);
    } else {
      put(card, questionHead(it));
      const check = h('button', { class: 'btn primary', type: 'button', disabled: true }, 'Check');
      const w = widget(it, () => { check.disabled = !w.ready(); });
      curW = w; put(card, w.el);
      check.onclick = () => grade(entry, w, card);
      footer(h('button', { class: 'btn ghost', type: 'button', onclick: () => grade(entry, w, card, true) }, "I don't know"), check);
      if (w.focus && matchMedia('(pointer:fine)').matches) setTimeout(() => w.focus(), 30);
    }
  }

  function grade(entry, w, card, gaveUp) {
    if (entry.graded) return; // an answer is final once submitted (also blocks double-taps on Check)
    entry.graded = true;
    const it = entry.item; const ans = gaveUp ? null : w.get();
    const res = gaveUp ? { ok: false, why: '', correctText: evaluate(it, it.t === 'mcq' ? -1 : (it.t === 'fill' ? it.b.map(() => '') : '')).correctText, blanks: it.b && it.b.map(() => false) } : evaluate(it, ans);
    if (gaveUp) { res.gaveUp = true; if (it.t === 'mcq') res.correctWhy = it.o[it.a][1]; }
    w.lock(res);
    entry.hist = { item: it, ans: Array.isArray(ans) ? ans.slice() : ans, res, retry: !!entry.retry, n: history.length + 1 };
    history.push(entry.hist);
    // feedback: sound + card animation (pulse when right, shake when wrong). "I don't know" stays quiet: asking isn't a mistake.
    if (!gaveUp) {
      sfx(res.ok ? 'ok' : 'bad');
      card.classList.remove('anim-ok', 'anim-bad'); void card.offsetWidth;
      card.classList.add(res.ok ? 'anim-ok' : 'anim-bad');
    }
    S.answered++; if (res.ok) S.correct++;
    if (res.ok) {
      right++; const pts = entry.retry ? 5 : 10; if (!entry.retry) firstTry++; gained += pts; addXP(pts);
      const pop = h('span', { class: 'xp-pop', 'aria-hidden': 'true' }, `+${pts}`);
      xpChip.append(pop); setTimeout(() => pop.remove(), 1000);
      if (cfg.review) clearMistake(it._id);
    } else {
      wrong++; addMistake(it._id);
      if (!entry.retry) queue.push({ item: it.again || it, retry: true });
    }
    save(); progress();
    const fb = h('div', { class: 'fb-body' }, feedbackBody(it, res, ans));
    if (it.trace) {
      const holder = h('div');
      const tbtn = h('button', { class: 'btn ghost sm', type: 'button' }, res.ok ? 'See the trace' : 'Show the correct trace');
      tbtn.onclick = () => { if (holder.firstChild) { holder.innerHTML = ''; return; } holder.append(Tracer(it.trace, { atEnd: !res.ok })); holder.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      fb.append(tbtn); put(card, holder);
    }
    if (!res.ok && !entry.retry) fb.append(h('p', { class: 'muted small' }, it.again ? 'A similar question will come back later in this session.' : 'This question will come back later in this session.'));
    foot.innerHTML = '';
    foot.className = 'lfoot ' + (res.ok ? 'is-ok' : gaveUp ? 'is-info' : 'is-bad');
    const cont = h('button', { class: 'btn primary', type: 'button', onclick: next }, 'Continue');
    foot.append(h('div', { class: 'wrap' },
      h('div', { class: 'fb' }, h('div', { class: 'fb-title' }, ico(res.ok ? 'check' : gaveUp ? 'target' : 'x', 'fb-ico'), res.ok ? (entry.retry ? 'Correct, that one stuck' : 'Correct') : (gaveUp ? "Here's how it works" : 'Not quite')), fb),
      h('div', { class: 'lfoot-in end' }, cont)));
    setTimeout(() => { cont.focus({ preventScroll: true }); main.style.paddingBottom = (foot.offsetHeight + 24) + 'px'; }, 30);
  }

  function next() { pos++; show(); }

  function finish() {
    cleanup && cleanup(); cleanup = null;
    const acc = qTotal ? Math.round(firstTry / qTotal * 100) : 100;
    if (cfg.lesson) {
      const prev = S.done[cfg.lesson.id]; const bonus = prev ? 5 : 20;
      gained += bonus; addXP(bonus);
      S.done[cfg.lesson.id] = { best: Math.max(acc, prev ? prev.best : 0), at: Date.now() }; save();
    }
    const nextL = cfg.lesson ? LESSONS[LESSONS.indexOf(cfg.lesson) + 1] : null;
    sfx('done');
    const mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
    head.remove(); foot.innerHTML = ''; foot.className = 'lfoot';
    $app.prepend(topbar(true));
    main.innerHTML = '';
    main.append(h('section', { class: 'card done-card' },
      h('div', { class: 'done-badge', html: icon.check }),
      h('h1', {}, cfg.lesson ? 'Lesson complete' : 'Session complete'), h('p', { class: 'muted mono-s' }, `process exited with code 0 · ${wrong} warning${wrong === 1 ? '' : 's'}`),
      h('p', { class: 'lead' }, cfg.title),
      h('div', { class: 'done-stats' }, stat(`+${gained}`, 'XP'), stat(`${acc}%`, 'right first time'), stat(`${mins} min`, 'time'), stat(liveStreak(), 'day streak')),
      wrong ? h('p', { class: 'muted' }, `${wrong} wrong answer${wrong > 1 ? 's were' : ' was'} added to your Mistakes deck.`) : h('p', { class: 'muted' }, 'No mistakes in this session.')));
    if (history.length) {
      const okN = history.filter(e => e.res.ok).length;
      main.append(h('section', { class: 'summary' },
        h('div', { class: 'summary-head' }, h('h2', { class: 'section-t' }, 'Your answers'),
          h('span', { class: 'muted mono-s' }, `✅ ${okN}   ❌ ${history.length - okN}   · tap a question for its explanation`)),
        history.map(e => recapRow(e))));
    }
    footer(h('a', { class: 'btn ghost', href: '#/' }, 'Back to path'),
      nextL ? h('a', { class: 'btn primary', href: `#/lesson/${nextL.id}` }, `Next: ${nextL.num} ${nextL.title}`) : h('a', { class: 'btn primary', href: '#/mock' }, 'Take a mock exam'));
  }
  show();
}

// ───────────────────────────── mistakes ─────────────────────────────
function mistakesView() {
  const ids = Object.keys(S.mistakes).filter(id => Q[id]).sort((a, b) => S.mistakes[b].n - S.mistakes[a].n);
  const groups = {};
  ids.forEach(id => { const k = Q[id].lesson ? Q[id].lesson.id : 'mock'; (groups[k] = groups[k] || []).push(id); });
  $app.append(topbar(true), h('main', { class: 'wrap page' },
    h('h1', {}, 'Mistakes deck'),
    h('p', { class: 'lead' }, ids.length ? `${ids.length} question${ids.length > 1 ? 's' : ''} you got wrong. Answer one correctly in a review and it leaves the deck.` : 'Empty. Every wrong answer from lessons and mock exams lands here automatically.'),
    ids.length ? h('div', { class: 'row' }, h('a', { class: 'btn primary lg', href: '#/review' }, `Review ${Math.min(20, ids.length)} now`),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => { if (confirm('Clear the mistakes deck?')) { S.mistakes = {}; save(); route(); } } }, 'Clear deck')) : h('a', { class: 'btn primary', href: '#/' }, 'Back to the path'),
    Object.entries(groups).map(([k, list]) => {
      const l = LESSONS.find(x => x.id === k);
      return h('section', { class: 'mgroup' }, h('h2', {}, l ? `${l.num} · ${l.title}` : 'Mock exam'),
        h('ul', { class: 'mlist' }, list.map(id => h('li', {}, h('span', { html: md(Q[id].item.q || Q[id].item.h || '') }), h('span', { class: 'tag' }, `×${S.mistakes[id].n}`)))));
    })));
}

// ───────────────────────────── cheat sheet ─────────────────────────────
function sheetView() {
  $app.append(topbar(true), h('main', { class: 'wrap page sheet' },
    h('h1', {}, 'Rules & traps sheet'),
    h('p', { class: 'lead' }, 'Every rule, key idea and trap from the lessons on one page. Read it the night before and the morning of the exam.'),
    h('button', { class: 'btn ghost sm noprint', type: 'button', onclick: () => print() }, 'Print'),
    UNITS.map((u, ui) => h('section', { class: 'unit' }, h('h2', {}, `Unit ${ui + 1} · ${u.title}`),
      u.lessons.map(l => {
        const items = l.items.filter(it => (it.t === 'learn' || it.t === 'steps') && (it.key || it.rule || it.trap || it.table));
        if (!items.length) return null;
        return h('div', { class: 'sheet-l' }, h('h3', {}, l.num + ' ', l.title, l.weak && h('span', { class: 'tag weak' }, 'Extra practice')),
          items.map(it => h('div', { class: 'sheet-i' }, h('h4', {}, it.h), it.table && tableViz(it.table), boxes(it))));
      })))));
}

// ───────────────────────────── mock exam ─────────────────────────────
function mockView() {
  $app.append(topbar(true), h('main', { class: 'wrap page' },
    h('h1', {}, 'Timed mock exam'),
    h('p', { class: 'lead' }, 'No feedback until you submit, just like the real thing. Every wrong answer goes into your Mistakes deck.'),
    h('div', { class: 'mock-cards' },
      h('a', { class: 'tool big', href: '#/mock/deck' }, h('b', {}, 'Deck mock exam'), h('span', {}, '19 questions from slides 55–58 · 30 minutes · 1 mark each'), h('span', { class: 'arrow' }, '→')),
      h('a', { class: 'tool big', href: '#/mock/past' }, h('b', {}, 'Past-paper exam'), h('span', {}, '25 real questions from previous CS116 online quizzes · 25 minutes'), h('span', { class: 'arrow' }, '→')),
      h('a', { class: 'tool big', href: '#/mock/mixed' }, h('b', {}, 'Mixed mock exam'), h('span', {}, '25 questions from every unit, weighted towards your weak spots · 40 minutes'), h('span', { class: 'arrow' }, '→'))),
    S.mocks.length ? h('section', { class: 'mgroup' }, h('h2', {}, 'Past attempts'),
      h('ul', { class: 'mlist' }, S.mocks.slice().reverse().slice(0, 10).map(m => h('li', {}, h('span', {}, `${({ deck: 'Deck', past: 'Past paper', mixed: 'Mixed' })[m.mode] || 'Mixed'} · ${new Date(m.at).toLocaleString()}`), h('b', {}, `${m.score}/${m.total}`))))) : null,
    h('p', { class: 'muted' }, 'Deck scoring: 17–19 ready · 14–16 redo the traps · under 14 redo the drills of your weak part.')));
}
function pickMixed() {
  const pool = LESSONS.flatMap(l => l.items.filter(isQ).map(it => ({ it, w: l.weak ? 2 : 1, u: l.unit.id })));
  const chosen = []; const used = new Set();
  // at least 3 per unit, rest weighted random
  for (const u of UNITS) shuffle(pool.filter(p => p.u === u.id)).slice(0, 3).forEach(p => { chosen.push(p.it); used.add(p.it); });
  const rest = shuffle(pool.filter(p => !used.has(p.it)).flatMap(p => p.w === 2 ? [p, p] : [p]));
  for (const p of rest) { if (chosen.length >= 25) break; if (!used.has(p.it)) { chosen.push(p.it); used.add(p.it); } }
  return shuffle(chosen);
}
function runMock(mode) {
  const pastPool = () => LESSONS.filter(l => l.unit.past).flatMap(l => l.items.filter(isQ));
  const items = mode === 'deck' ? MOCK.slice() : mode === 'past' ? shuffle(pastPool()).slice(0, 25) : pickMixed();
  const limit = ({ deck: 30, past: 25 })[mode] * 60 || 40 * 60;
  const answers = new Array(items.length).fill(null);
  const widgets = items.map(it => widget(it, () => { answers[items.indexOf(it)] = 1; drawNav(); }));
  let i = 0; const end = Date.now() + limit * 1000; let over = false;
  const timer = h('span', { class: 'chip timer' });
  const nav = h('div', { class: 'qnav' });
  const head = h('header', { class: 'lhead' }, h('div', { class: 'wrap lhead-in' },
    h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Quit exam', onclick: () => { if (confirm('Quit the exam? Your answers are lost.')) location.hash = '#/mock'; }, html: icon.x }),
    h('b', { class: 'lhead-t' }, mode === 'deck' ? 'Deck mock exam' : 'Mixed mock exam'), timer));
  const main = h('main', { class: 'wrap lmain' });
  const foot = h('footer', { class: 'lfoot' });
  $app.append(head, main, foot);
  const tick = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    timer.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    timer.classList.toggle('low', left < 300);
    if (left === 0 && !over) submit(true);
  };
  const iv = setInterval(tick, 1000); tick();
  cleanup = () => clearInterval(iv);
  function drawNav() {
    nav.innerHTML = '';
    items.forEach((it, k) => nav.append(h('button', { type: 'button', class: 'qdot' + (k === i ? ' on' : '') + (widgets[k].ready() ? ' ans' : ''), 'aria-label': `Question ${k + 1}`, onclick: () => { i = k; show(); } }, k + 1)));
  }
  function show() {
    main.innerHTML = ''; drawNav();
    const it = items[i];
    main.append(nav, h('article', { class: 'card' }, h('p', { class: 'qtype' }, `Question ${i + 1} of ${items.length} · ${TYPE_LABEL[it.t]}`), questionHead(it), widgets[i].el));
    foot.innerHTML = '';
    foot.append(h('div', { class: 'wrap lfoot-in' },
      h('button', { class: 'btn ghost', type: 'button', disabled: i === 0, onclick: () => { i--; show(); } }, '‹ Previous'),
      i < items.length - 1 ? h('button', { class: 'btn primary', type: 'button', onclick: () => { i++; show(); } }, 'Next ›')
        : h('button', { class: 'btn primary', type: 'button', onclick: () => submit(false) }, 'Submit exam')));
    window.scrollTo(0, 0);
  }
  function submit(timeUp) {
    const unanswered = widgets.filter(w => !w.ready()).length;
    if (!timeUp && unanswered && !confirm(`${unanswered} question${unanswered > 1 ? 's are' : ' is'} unanswered. Submit anyway?`)) return;
    over = true; clearInterval(iv);
    const results = items.map((it, k) => {
      const w = widgets[k]; const ans = w.ready() ? w.get() : null;
      const res = ans == null ? { ok: false, gaveUp: true, why: 'Not answered.', correctText: evaluate(it, it.t === 'mcq' ? -1 : it.t === 'fill' ? it.b.map(() => '') : '').correctText } : evaluate(it, ans);
      if (it.t === 'mcq') res.correctWhy = it.o[it.a][1];
      if (!res.ok) addMistake(it._id);
      S.answered++; if (res.ok) S.correct++;
      return { it, ans, res, w };
    });
    const score = results.filter(r => r.res.ok).length;
    S.mocks.push({ at: Date.now(), mode, score, total: items.length }); addXP(score * 5); save();
    head.remove(); foot.innerHTML = ''; main.innerHTML = '';
    $app.prepend(topbar(true));
    const pct = Math.round(score / items.length * 100);
    const verdict = mode === 'deck' ? (score >= 17 ? 'Ready.' : score >= 14 ? 'Close: redo the traps lessons (5.2, 5.3).' : 'Redo the drills of your weak parts, then try again.') : (pct >= 85 ? 'Strong result.' : pct >= 70 ? 'Good, now clear your Mistakes deck.' : 'Review your Mistakes deck, then retake.');
    main.append(h('section', { class: 'card done-card' },
      h('h1', {}, `${score} / ${items.length}`), h('p', { class: 'lead' }, (timeUp ? 'Time is up. ' : '') + verdict),
      h('div', { class: 'done-stats' }, stat(pct + '%', 'score'), stat(items.length - score, 'to review'))),
      h('h2', { class: 'section-t' }, 'Review every question'),
      results.map((r, k) => {
        r.w.lock(r.res);
        return h('details', { class: 'review ' + (r.res.ok ? 'ok' : 'bad'), open: !r.res.ok || null },
          h('summary', {}, ico(r.res.ok ? 'check' : 'x'), h('span', { html: `Q${k + 1}. ` + md(r.it.q || '') })),
          h('div', { class: 'review-b' }, questionHead(r.it).slice(1), r.w.el, h('div', { class: 'fb-body' }, feedbackBody(r.it, r.res, r.ans)), r.it.trace && traceToggle(r.it.trace)));
      }));
    foot.append(h('div', { class: 'wrap lfoot-in' }, h('a', { class: 'btn ghost', href: '#/mistakes' }, 'Mistakes deck'), h('a', { class: 'btn primary', href: '#/mock' }, 'Done')));
    window.scrollTo(0, 0);
  }
  show();
}
function traceToggle(id) {
  const holder = h('div');
  const b = h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { if (holder.firstChild) holder.innerHTML = ''; else holder.append(Tracer(id, { atEnd: true })); } }, 'Show the trace');
  return h('div', {}, b, holder);
}

route();
})();
