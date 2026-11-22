# CS116 Trainer

Interactive exam practice for **CS116 Computing Fundamentals (C programming)** at the **German Jordanian University (GJU)**.
Built by **Zaid Altal**. Not an official GJU resource.

**Live site:** https://zaidaltal.github.io/cs116-trainer/

## What's inside

- **45 short lessons in 6 units**: C basics and types, decisions, loops, arrays, exam training, and 53 real past-paper questions.
- **Step-by-step code tracer**: click *Next line* and watch the variable table (variables as columns, steps as rows) and the output build up.
- **Question types**: multiple choice, "what does this print?", fill in the code, find the bug, count the iterations, and pick the `[row][col]`.
- **Feedback on wrong answers**: an explanation for your specific wrong answer, the correct trace, and a similar question later in the lesson. Wrong answers collect in a **Mistakes deck**.
- **Timed exams**: the deck's 20-question mock, a past-paper exam, and a mixed mock.
- **Progress**: XP, a daily streak and a daily goal, saved in your browser (localStorage).

## Every answer is checked with gcc

- `node tools/build-traces.js` compiles and runs every tracer program in `tracers/tracers.txt`, and writes the real step-by-step snapshots to `js/data/traces.js`.
- `node tools/verify.js` compiles and runs every code example and question in `js/data/unit*.js`. It fails if any stored answer differs from what C actually prints. It also confirms that "compile error" and "infinite loop" answers really behave that way.

## Editing content

Lessons live in `js/data/unit1.js` … `unit6.js`. Each lesson is a list of items:

| `t` | Item type | Key fields |
|---|---|---|
| `learn` | teaching card | `h`, `p`, `code`, `out`, `table`, `key` / `rule` / `trap` boxes |
| `steps` | step-by-step evaluation | `code`, `steps[]`, `check` (C code whose output must equal the last step) |
| `trace` | code tracer | `id` (from `tracers/tracers.txt`) |
| `mcq` | multiple choice | `o: [[text, why], …]` (a "why" for every option), `a` (correct index) |
| `out` | type the output | `code`, `a`, `w: { wrongAnswer: why }` |
| `num` | number answer | `a`, `w`, `run` |
| `fill` | fill in the code | `code` with `[[0]]` blanks, `b: [[accepted answers]]` |
| `bug` | tap the buggy line | `code`, `a` (line index), `fix` |
| `grid` | tap `a[r][c]` | `grid`, `a: [r, c]` |

Any question can have `again` (a similar question to re-ask when you get it wrong), `trace` (a tracer id) and `run` (code to check with gcc).

After editing, run `node tools/verify.js`. To test locally, run `node tools/serve.js` and open http://localhost:8116.
