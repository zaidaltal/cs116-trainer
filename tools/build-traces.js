// Builds js/data/traces.js from tracers/*.c by compiling and RUNNING each program with gcc.
// Every row in every tracer table is a real snapshot taken from the running program.
//
// Tracer source format:
//   //@id      unique id
//   //@title   short title
//   //@watch   i:d s:d f:f c:c a:d[5] m:d[3][4]     (d=int, f=float/double, c=char)
//   //@uninit  x y        (shown as "?" until a displayed line assigns them)
//   //@stdin   150 35     (keyboard input)
//   //@expect  exact final output, \n for newlines (checked against the real run)
//   ...code...
// Inside the code, «...» is hidden instrumentation: compiled, but not shown on screen.
//   «S();»          snapshot after this statement
//   «C(»cond«)»     snapshot a condition check (records true/false)
//   «E(»expr«)»     snapshot an expression (for-loop init/update)
//   «V(»expr«)»     snapshot a switch value
//   «N("text");»    snapshot with a note
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'tracers');
const tmp = path.join(require('os').tmpdir(), 'cs116-traces');
fs.mkdirSync(tmp, { recursive: true });

const PRELUDE = `#include <stdio.h>
#include <string.h>
#include <stdbool.h>
static char ob_[65536]; static int bp_ = 0; static int first_; static int tc_; static long long tv_;
static void js_(const char*s){ fputc('"',stdout); for(;*s;s++){ unsigned char c=*s;
  if(c=='"'||c=='\\\\'){fputc('\\\\',stdout);fputc(c,stdout);} else if(c=='\\n') fputs("\\\\n",stdout);
  else if(c=='\\t') fputs("\\\\t",stdout); else if(c<32) fprintf(stdout,"\\\\u%04x",c); else fputc(c,stdout);} fputc('"',stdout);}
static int sb_(int line,const char*k,const char*t,long long r){ fprintf(stdout,"{\\"l\\":%d,\\"k\\":\\"%s\\",\\"t\\":",line,k); js_(t);
  fprintf(stdout,",\\"r\\":%lld,\\"o\\":",r); ob_[bp_]=0; js_(ob_); fputs(",\\"v\\":{",stdout); first_=1; return 0; }
static int se_(void){ fputs("}}\\n",stdout); return 0; }
static void key_(const char*n){ if(!first_) fputc(',',stdout); first_=0; js_(n); fputc(':',stdout); }
static int wd_(const char*n,long long v){ key_(n); fprintf(stdout,"\\"%lld\\"",v); return 0; }
static int wf_(const char*n,double v){ key_(n); fprintf(stdout,"\\"%f\\"",v); return 0; }
static int wc_(const char*n,int v){ key_(n); fprintf(stdout,"\\"c%d\\"",v); return 0; }
static int wa_(const char*n,const int*a,int len){ key_(n); fputc('[',stdout); for(int i=0;i<len;i++){ if(i) fputc(',',stdout); fprintf(stdout,"\\"%d\\"",a[i]); } fputc(']',stdout); return 0; }
static int wm_(const char*n,const int*a,int r,int c){ key_(n); fputc('[',stdout); for(int i=0;i<r;i++){ if(i) fputc(',',stdout); fputc('[',stdout);
  for(int j=0;j<c;j++){ if(j) fputc(',',stdout); fprintf(stdout,"\\"%d\\"",a[i*c+j]); } fputc(']',stdout);} fputc(']',stdout); return 0; }
#define SNAP_(k,t,r) (sb_(__LINE__,k,t,r), WATCH_, se_())
#define S() SNAP_("s","",0)
#define N(txt) SNAP_("n",txt,0)
#define C(e) (tc_=((e)!=0), SNAP_("c",#e,tc_), tc_)
#define E(e) ((e), SNAP_("e",#e,0))
#define V(e) (tv_=(e), SNAP_("v",#e,tv_), tv_)
#define printf(...) (bp_ += sprintf(ob_+bp_, __VA_ARGS__))
`;

function parse(file, src) {
  const meta = { watch: [], uninit: [], stdin: '', expect: null };
  const body = [];
  for (const line of src.split('\n')) {
    const m = line.match(/^\/\/@(\w+)\s?(.*)$/);
    if (m) {
      const [, k, v] = m;
      if (k === 'watch') meta.watch = v.trim().split(/\s+/).map(w => {
        const mm = w.match(/^(\w+):(\w)((?:\[\d+\])*)$/);
        if (!mm) throw new Error(`${file}: bad watch ${w}`);
        const dims = [...mm[3].matchAll(/\[(\d+)\]/g)].map(x => +x[1]);
        return { name: mm[1], type: mm[2], dims };
      });
      else if (k === 'uninit') meta.uninit = v.trim().split(/\s+/);
      else if (k === 'expect') meta.expect = JSON.parse('"' + v.replace(/"/g, '\\"') + '"');
      else meta[k] = v.trim();
    } else body.push(line);
  }
  while (body.length && body[body.length - 1].trim() === '') body.pop();
  while (body.length && body[0].trim() === '') body.shift();
  return { meta, body };
}

function watchMacro(watch) {
  if (!watch.length) return '0';
  return '(' + watch.map(w => {
    if (w.dims.length === 1) return `wa_("${w.name}",${w.name},${w.dims[0]})`;
    if (w.dims.length === 2) return `wm_("${w.name}",&${w.name}[0][0],${w.dims[0]},${w.dims[1]})`;
    if (w.type === 'f') return `wf_("${w.name}",${w.name})`;
    if (w.type === 'c') return `wc_("${w.name}",${w.name})`;
    return `wd_("${w.name}",${w.name})`;
  }).join(',') + ')';
}

const display = l => l.replace(/«[^»]*»/g, '').replace(/\s+$/, '');
const instr = l => l.replace(/«([^»]*)»/g, '$1');

const out = {};
let failed = 0;
const all = fs.readFileSync(path.join(dir, 'tracers.txt'), 'utf8').replace(/\r\n/g, '\n');
const blocks = all.split(/^(?=\/\/@id )/m).filter(b => b.startsWith('//@id '));
for (const block of blocks) {
  const { meta, body } = parse('tracer', block);
  const id = meta.id, f = id;
  if (out[id]) throw new Error('duplicate tracer id ' + id);
  const code = body.map(display);
  const csrc = PRELUDE + `#define WATCH_ ${watchMacro(meta.watch)}\nint main(void){\n#line 1\n` +
    body.map(instr).join('\n') + `\n;sb_(0,"x","",0), WATCH_, se_();\nreturn 0;}\n`;
  const cfile = path.join(tmp, id + '.c');
  const exe = path.join(tmp, id + '.exe');
  fs.writeFileSync(cfile, csrc);
  try {
    execFileSync('gcc', ['-std=c11', '-w', '-o', exe, cfile], { stdio: 'pipe' });
  } catch (e) {
    console.error(`✘ ${f}: compile error\n${e.stderr}`); failed++; continue;
  }
  const raw = execFileSync(exe, { input: meta.stdin.replace(/\\n/g, '\n'), timeout: 5000 }).toString();
  const steps = raw.trim().split('\n').map(l => JSON.parse(l));
  // Uninitialised variables: "?" until a displayed line assigns them
  const assigned = new Set();
  for (const s of steps) {
    const text = s.l > 0 ? code[s.l - 1] : '';
    for (const u of meta.uninit) {
      const re = new RegExp(`(\\b${u}\\s*(=(?!=)|[-+*/%]=|\\+\\+|--))|((\\+\\+|--)\\s*${u}\\b)|&${u}\\b`);
      if (re.test(text) && (s.k !== 'c' && s.k !== 'v')) assigned.add(u);
      if (!assigned.has(u)) s.v[u] = '?';
    }
  }
  const final = steps[steps.length - 1];
  steps.pop(); // the hidden end-of-program snapshot
  const finalOut = final.o;
  const norm = t => t.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n+$/, '');
  if (meta.expect !== null && norm(meta.expect) !== norm(finalOut)) {
    console.error(`✘ ${f}: output mismatch\n  expected: ${JSON.stringify(meta.expect)}\n  gcc ran:  ${JSON.stringify(finalOut)}`);
    failed++;
  } else console.log(`✔ ${f}: ${steps.length} steps, output ${JSON.stringify(finalOut)}`);
  out[id] = {
    title: meta.title || id, code, stdin: meta.stdin || '',
    watch: meta.watch.map(w => ({ name: w.name, type: w.type, dims: w.dims })),
    output: finalOut,
    steps: steps.map(s => ({ l: s.l, k: s.k, t: s.t, r: s.r, o: s.o, v: s.v })),
  };
}
fs.writeFileSync(path.join(root, 'js', 'data', 'traces.js'),
  '// GENERATED by tools/build-traces.js from tracers/*.c (real gcc runs). Do not edit by hand.\n' +
  'window.CS116_TRACES = ' + JSON.stringify(out) + ';\n');
console.log(`\n${Object.keys(out).length} tracers written${failed ? `, ${failed} FAILED` : ''}.`);
process.exit(failed ? 1 : 0);
