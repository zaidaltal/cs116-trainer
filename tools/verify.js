// Compiles and runs every code example / question in js/data/unit*.js with gcc and
// checks that the expected output stored in the content matches what C really prints.
// Usage: node tools/verify.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const tmp = path.join(require('os').tmpdir(), 'cs116-verify');
fs.mkdirSync(tmp, { recursive: true });

const ctx = { window: {}, console };
ctx.CS116 = { units: [], mock: [], unit(u) { this.units.push(u); }, mockExam(m) { this.mock = m; }, ex: {}, explain(m) { Object.assign(this.ex, m); } };
ctx.window.CS116 = ctx.CS116;
vm.createContext(ctx);
const files = fs.readdirSync(path.join(root, 'js', 'data')).filter(f => /^(unit\d|mock|explain).*\.js$/.test(f)).sort();
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, 'js', 'data', f), 'utf8'), ctx, { filename: f });
global.window = {}; require(path.join(root, 'js', 'data', 'traces.js'));
const TRACES = global.window.CS116_TRACES;

const norm = t => String(t).replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');
function terminal(s) { // render \b and \r the way a console shows them
  const lines = s.split('\n').map(line => {
    const buf = []; let x = 0;
    for (const ch of line) {
      if (ch === '\b') x = Math.max(0, x - 1);
      else if (ch === '\r') x = 0;
      else { buf[x] = ch; x++; }
    }
    return buf.map(c => c ?? ' ').join('');
  });
  return lines.join('\n');
}

let n = 0, ok = 0; const fails = []; const seen = new Set();
function run(label, { code, pre = '', post = '', stdin = '', expect, compileError, infinite }) {
  n++;
  const hasMain = /\bmain\s*\(/.test(code);
  const src = (hasMain ? '#include <stdio.h>\n#include <stdbool.h>\n' + code :
    `#include <stdio.h>\n#include <stdbool.h>\nint main(void){\n${pre}\n${code}\n${post}\nreturn 0;\n}\n`);
  const id = 'c' + n;
  const cf = path.join(tmp, id + '.c'), exe = path.join(tmp, id + '.exe');
  fs.writeFileSync(cf, src);
  if (compileError) { // the expected answer is "compile-time error": gcc must reject it
    try { execFileSync('gcc', ['-std=c11', '-w', '-o', exe, cf], { stdio: 'pipe' }); fails.push(`${label}\n  expected a COMPILE ERROR, but it compiled`); }
    catch { ok++; }
    return;
  }
  try { execFileSync('gcc', ['-std=c11', '-w', '-o', exe, cf], { stdio: 'pipe' }); }
  catch (e) { fails.push(`${label}\n  COMPILE ERROR:\n${String(e.stderr).split('\n').slice(0, 6).join('\n')}\n--- source ---\n${src}`); return; }
  let outp;
  try { outp = execFileSync(exe, { input: stdin, timeout: infinite ? 1500 : 4000, maxBuffer: 4 << 20 }).toString(); }
  catch (e) { if (infinite) { ok++; return; } fails.push(`${label}\n  RUNTIME ERROR / TIMEOUT`); return; }
  if (infinite) { fails.push(`${label}\n  expected it to run forever, but it ended`); return; }
  if (/[\b\r]/.test(outp)) outp = terminal(outp);
  if (norm(outp) === norm(expect)) ok++;
  else fails.push(`${label}\n  expected: ${JSON.stringify(norm(expect))}\n  gcc ran:  ${JSON.stringify(norm(outp))}`);
}

function fillCode(item) {
  return item.code.replace(/\[\[(\d+)\]\]/g, (_, k) => item.b[+k][0]);
}

let qCount = 0;
const ids = new Set();
function check(item, label) {
  if (!item) return;
  if (item.t !== 'learn' && item.t !== 'steps' && item.t !== 'trace') qCount++;
  if (item.t === 'trace' && !TRACES[item.id]) fails.push(`${label}: unknown tracer id ${item.id}`);
  if (item.trace && !TRACES[item.trace]) fails.push(`${label}: unknown tracer id ${item.trace}`);
  if (item.t === 'mcq') {
    if (!Array.isArray(item.o) || item.a == null || !item.o[item.a]) fails.push(`${label}: bad mcq`);
    item.o.forEach((o, i) => { if (!Array.isArray(o) || o.length < 2 || !o[1]) fails.push(`${label}: option ${i} needs [text, why]`); });
  }
  if (item.t === 'fill' && (!item.b || (item.code.match(/\[\[\d+\]\]/g) || []).length !== item.b.length)) fails.push(`${label}: blanks mismatch`);
  if (item.t === 'bug' && item.code.split('\n')[item.a] == null) fails.push(`${label}: bug line out of range`);
  if (item.t === 'grid' && (!item.grid[item.a[0]] || item.grid[item.a[0]][item.a[1]] == null)) fails.push(`${label}: grid answer out of range`);
  const base = { pre: item.pre || '', stdin: item.stdin || '' };
  if (item.run) run(label + ' [run]', { code: item.run.code || (item.t === 'fill' ? fillCode(item) : item.code), pre: item.run.pre ?? base.pre, post: item.run.post || '', stdin: item.run.stdin ?? base.stdin, expect: item.run.expect, compileError: item.run.compileError, infinite: item.run.infinite });
  else if (item.t === 'learn' && item.code && item.out != null) run(label, { ...base, code: item.code, expect: item.out });
  else if (item.t === 'out') run(label, { ...base, code: item.code, expect: item.a });
  else if (item.t === 'mcq' && item.out) run(label, { ...base, code: item.code, expect: item.o[item.a][0] });
  else if (item.t === 'steps' && item.check) run(label, { ...base, code: item.check, expect: item.steps[item.steps.length - 1].replace(/^=\s*/, '') });
  if (item.again) check(item.again, label + ' (again)');
}

// Merge js/data/explain.js the same way app.js does, then require an explanation on every question:
// mcq has a "why" per option, grid builds one automatically; everything else needs x (or a tracer).
const EX = ctx.CS116.ex || {}; const usedEx = new Set();
const explained = it => it.t === 'mcq' || it.t === 'grid' || !!it.x || !!it.trace;
for (const u of ctx.CS116.units) for (const l of u.lessons) {
  if (ids.has(l.id)) fails.push(`duplicate lesson id ${l.id}`); ids.add(l.id);
  l.items.forEach((it, i) => {
    const pairs = [[`${l.id}:${i}`, it]]; if (it.again) pairs.push([`${l.id}:${i}b`, it.again]);
    for (const [id, q] of pairs) {
      if (EX[id]) { usedEx.add(id); if (!q.x) q.x = EX[id]; }
      if (['out', 'num', 'fill', 'bug'].includes(q.t) && !explained(q)) fails.push(`${id} (${q.t}) has no explanation: add it to js/data/explain.js`);
    }
    check(it, `${l.id} #${i} ${it.t} ${(it.q || it.h || '').slice(0, 50)}`);
  });
}
for (const k of Object.keys(EX)) if (!usedEx.has(k)) fails.push(`explain.js key ${k} does not match any question (items moved?)`);
(ctx.CS116.mock || []).forEach((it, i) => { if (!explained(it)) fails.push(`mock Q${i + 1} has no explanation`); check(it, `mock Q${i + 1}`); });

const lessons = ctx.CS116.units.reduce((a, u) => a + u.lessons.length, 0);
console.log(`${ctx.CS116.units.length} units, ${lessons} lessons, ${qCount} questions, ${(ctx.CS116.mock || []).length} mock questions`);
console.log(`gcc checks: ${ok}/${n} passed`);
if (fails.length) { console.log('\nFAILURES:\n' + fails.join('\n\n')); process.exit(1); }
