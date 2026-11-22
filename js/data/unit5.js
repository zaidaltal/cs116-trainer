// Unit 5 · Exam training: tracing, traps, fill-in, find-the-bug, write-the-code (deck slides 45–54, 61)
(() => {
const R = String.raw;
CS116.unit({
  id: 'u5', title: 'Exam training', sub: 'Part 5 · slides 45–61',
  lessons: [

  // ───────────────────────────────────────── 5.1
  { id: 'u5-trace', title: 'How to trace any program', slides: '2, 46', mins: 5, items: [
    { t: 'learn', h: 'The golden rule',
      p: 'Most marks come from "what does this print?". Never guess: run the code in your head line by line and keep a **trace table** of every variable.',
      rule: `**1.** Draw a table: **one column per variable**, plus one for the output.
**2.** Fill in the starting values from the declarations.
**3.** Go **line by line**. Every time a variable changes, write a new row.
**4.** At every loop/if, **write the check** with real numbers (e.g. 9 < 10 ✔).
**5.** Copy output **exactly**: spaces, \\n, \\t, and %f → 6 decimals.` },
    { t: 'trace', h: 'The slide example', id: 'forsum', p: 'This is exactly the table on the slide: one column per variable, one row per change.' },
    { t: 'out', q: 'What does this print?', code: R`int i, s = 0;
for (i = 1; i <= 4; i += 2)
  s = s + i * i;
printf("%d %d", i, s);`, a: '5 10', trace: 'forsum',
      w: { '3 10': 'After the loop i is the first value that FAILED the check: 5.', '5 30': 'i jumps by 2: only i = 1 and 3 run (1 + 9 = 10).' } },
    { t: 'out', q: 'Your turn. What does this print?', code: R`int i, s = 0;
for (i = 2; i <= 8; i += 3)
  s = s + i;
printf("%d %d", i, s);`, a: '11 15', x: 'i = 2, 5, 8 pass (s = 2, 7, 15). Then i = 11 fails.', w: { '8 15': 'i ends at the first FAILED value, 11.' } },
    { t: 'trace', h: 'Practice: sum of digits', id: 'digitsum' },
  ]},

  // ───────────────────────────────────────── 5.2
  { id: 'u5-traps1', title: 'Traps 1: types, operators, decisions', slides: '47', mins: 5, items: [
    { t: 'learn', h: 'Read this the night before',
      table: [['Trap', 'What really happens'], ['7 / 2', '3 (int ÷ int chops decimals). 7.0/2 = 3.5'], ['float f = 7 / 2;', '3.000000: divided as ints first, then stored'],
              ['avg = sum / n; (ints)', 'loses decimals → write (float) sum / n'], ['int i = 3.99;', '3 (chopped, never rounded)'], ['%f prints', '6 decimals: 25.000000. %.2f → 2 decimals'],
              ['if (a = 5)', 'assigns 5 → always true. Comparing needs =='], ['if (x > 5);', 'the ; ends the if → the next line always runs'], ['printf("%d", 3 > 2)', '1 (comparisons give 1 or 0)'],
              ['!5 · !0', '0 · 1 (any non-zero is true)'], ['switch without break', 'falls through into the next cases'], ['case 2.5: / case x:', 'not allowed: only int/char constants'],
              ["'A' vs 'a'", 'different (65 vs 97): C is case sensitive']] },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %.1f", 7 / 2, 7.0 / 2);`, a: '3 3.5' },
    { t: 'out', q: 'What does this print?', code: R`float f = 7 / 2;
printf("%f", f);`, a: '3.000000', trace: 'intdiv', w: { '3.500000': 'Divided as ints FIRST (= 3), then stored.' } },
    { t: 'out', q: 'What does this print?', code: R`int i = 3.99;
printf("%d", i);`, a: '3', w: { '4': 'Chopped, never rounded.' } },
    { t: 'out', q: 'What does this print?', code: R`int a = 1;
if (a = 5) printf("yes ");
printf("%d", a);`, a: 'yes 5', w: { '1': 'a = 5 assigns 5, and 5 is true.', 'yes 1': 'a was overwritten with 5.' } },
    { t: 'out', q: 'What does this print?', code: R`int x = 2;
if (x > 5);
printf("run");`, a: 'run' },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %d %d", 3 > 2, !5, !0);`, a: '1 0 1' },
    { t: 'mcq', q: 'Which case label is allowed?',
      o: [['case 4:', 'Correct: an int constant.'], ['case 2.5:', 'Floats are not allowed.'], ['case x:', 'Variables are not allowed.'], ['case "4":', 'Strings are not allowed.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %d", 'A', 'a');`, a: '65 97' },
  ]},

  // ───────────────────────────────────────── 5.3
  { id: 'u5-traps2', title: 'Traps 2: loops and arrays', slides: '48', mins: 5, items: [
    { t: 'learn', h: 'Read this the morning of',
      table: [['Trap', 'What really happens'], ['for (i=0; i<5; i++);', 'empty body; after it i = 5 and the next line runs once'], ['while with no i++', 'infinite loop'],
              ['do { } while (false);', 'the body still runs once. Needs ; after while( )'], ['i < 5 vs i <= 5', '5 rounds vs 6 rounds (starting at 0)'], ['value of i after the loop', 'the first value that failed the check'],
              ['y = x++  vs  y = ++x', 'old value vs new value; x grows by 1 either way'], ['break in a nested loop', 'leaves only the inner loop'], ['continue in a for loop', 'skips the rest, but the update (i++) still runs'],
              ['int a[5]', 'indexes 0–4; a[5] is out of bounds'], ['int a[5] = {1, 2};', '{1, 2, 0, 0, 0}'], ['X3,2 in maths', 'X[2][1] in C'], ['scanf("%d", x);', 'missing & → write &x (not for printf!)']] },
    { t: 'out', q: 'What does this print?', code: R`int c = 0;
do {
  c++;
} while (0);
printf("%d", c);`, a: '1', w: { '0': 'do-while runs the body once before checking.' } },
    { t: 'num', q: 'How many rounds does `for (i = 0; i <= 5; i++)` run?', a: 6, w: { 5: '<= includes 5: 0, 1, 2, 3, 4, 5 = 6 rounds.' },
      pre: 'int i;', run: { code: R`int c = 0; for (i = 0; i <= 5; i++) c++; printf("%d", c);`, expect: '6' } },
    { t: 'out', q: 'continue in a for loop. What does this print?', code: R`for (i = 0; i < 4; i++) {
  if (i == 1) continue;
  printf("%d", i);
}`, pre: 'int i;', a: '023', w: { '0': 'continue skips only round 1, then i++ runs and the loop goes on.' } },
    { t: 'out', q: 'What does this print?', code: R`int a[5] = {1, 2};
for (i = 0; i < 5; i++)
  printf("%d ", a[i]);`, pre: 'int i;', a: '1 2 0 0 0' },
    { t: 'mcq', q: 'What is wrong with `scanf("%d", x);`?',
      o: [['It is missing & before x', 'Correct: scanf("%d", &x);'], ['%d should be %i', 'Both work for int.'], ['Nothing', 'scanf needs the ADDRESS of x: &x.']], a: 0 },
    { t: 'mcq', q: '`y = x++` vs `y = ++x` (x starts at 5). What does y get?',
      o: [['5 vs 6', 'Correct: old value vs new value. x ends at 6 either way.'], ['6 vs 6', 'x++ hands over the OLD value.'], ['5 vs 5', '++x hands over the NEW value.']], a: 0 },
    { t: 'mcq', q: 'Maths X3,2 in C is…',
      o: [['X[2][1]', 'Correct: subtract 1 from both.'], ['X[3][2]', 'C counts from 0.'], ['X[1][2]', 'The row stays first: [3−1][2−1].']], a: 0 },
  ]},

  // ───────────────────────────────────────── 5.4
  { id: 'u5-fill', title: 'Fill in the blanks', slides: '49–50', mins: 6, items: [
    { t: 'learn', h: 'How fill-in questions are marked', p: 'Write the **exact** symbols: a missing ; or : counts as wrong. Check that every loop counter starts, stops and moves correctly.' },
    { t: 'fill', q: 'Print 1 to 10.', code: R`for (i = [[0]]; i [[1]] 10; [[2]])
  printf("%d ", i);`, b: [['1'], ['<='], ['i++', '++i', 'i += 1', 'i+=1', 'i = i + 1', 'i=i+1']],
      pre: 'int i;', run: { expect: '1 2 3 4 5 6 7 8 9 10' }, x: 'i = 1; i <= 10; i++' },
    { t: 'fill', q: 'Sum of int a[8].', code: R`sum = [[0]];
for (i = 0; i < [[1]]; i++)
  sum [[2]] a[i];`, b: [['0'], ['8'], ['+=', '= sum +']],
      pre: 'int a[8] = {1, 2, 3, 4, 5, 6, 7, 8}, i, sum;', run: { post: R`printf("%d", sum);`, expect: '36' }, x: 'sum = 0; i < 8; sum += a[i] (or sum = sum + a[i])' },
    { t: 'fill', q: 'Print int m[3][4] as a grid.', code: R`for (i = 0; i < 3; i++) {
  for (j = 0; j < [[0]]; j++)
    printf("%d ", m[[[1]]][[[2]]]);
  printf([[3]]);
}`, b: [['4'], ['i'], ['j'], ['"\\n"']],
      pre: 'int m[3][4] = {{0,1,2,3},{4,5,6,7},{8,9,10,11}}, i, j;', run: { expect: '0 1 2 3\n4 5 6 7\n8 9 10 11' }, x: 'j < 4; m[i][j]; printf("\\n")' },
    { t: 'fill', q: 'Maximum of a[n].', code: R`max = a[0];
for (i = 1; i < n; i++)
  if (a[i] [[0]] max)
    max = [[1]];`, b: [['>', '>='], ['a[i]']],
      pre: 'int a[5] = {4, 11, 2, 9, 7}, n = 5, i, max;', run: { post: R`printf("%d", max);`, expect: '11' } },
    { t: 'fill', q: 'Read an int and test it.', code: R`scanf("%d", [[0]]n);
if (n % 2 [[1]] 0) printf("even");`, b: [['&'], ['==']], pre: 'int n;', stdin: '4', run: { expect: 'even' },
      x: '&n · n % 2 == 0 (a single = would assign).' },
    { t: 'fill', q: 'A switch case, plus an average.', code: R`switch (ch) {
  case 'y'[[0]] printf("yes"); [[1]];
}
avg = [[2]] sum / n;`, b: [[':'], ['break'], ['(float)']],
      pre: "char ch = 'y'; int sum = 7, n = 2; float avg;", run: { post: R`printf(" %.1f", avg);`, expect: 'yes 3.5' }, x: "case 'y':  break;  (float)" },
    { t: 'fill', q: 'Print int a[6] backwards.', code: R`for (i = [[0]]; i [[1]] 0; i--)
  printf("%d ", a[i]);`, b: [['5'], ['>=']],
      pre: 'int a[6] = {1, 2, 3, 4, 5, 6}, i;', run: { expect: '6 5 4 3 2 1' }, x: 'Start at the last index (size − 1 = 5) and include index 0 (>=).' },
  ]},

  // ───────────────────────────────────────── 5.5
  { id: 'u5-bugs', title: 'Spot the bug', slides: '51–52', mins: 6, items: [
    { t: 'learn', h: 'Each snippet has exactly one mistake', p: 'Read every line. Circle every **;**, **{ }**, **=** vs **==**, missing **&**, and missing **break**.' },
    { t: 'bug', q: 'Tap the buggy line.', code: R`int x = 5;
if (x = 10)
  printf("ten");`, a: 1, fix: 'if (x == 10)', x: '= instead of ==. As written it always prints "ten".', w: { 0: 'This declaration is fine.', 2: 'The printf is fine.' } },
    { t: 'bug', q: 'Tap the buggy line.', code: R`for (i = 0; i < 5; i++);
{
  printf("%d", i);
}`, a: 0, fix: 'for (i = 0; i < 5; i++)', x: 'The ; after for( ) is the whole loop body. The block then runs once and prints 5.',
      w: { 1: 'The brace is fine; the problem is the line above.', 2: 'The printf is fine. It runs only once because of the line above.' } },
    { t: 'bug', q: 'Tap the buggy line.', code: R`int a[5];
for (i = 1; i <= 5; i++)
  a[i] = 0;`, a: 1, fix: 'for (i = 0; i < 5; i++)', x: 'Indexes 1–5: a[5] does not exist and a[0] is skipped.', w: { 0: 'The declaration is fine.', 2: 'The assignment is fine.' } },
    { t: 'bug', q: 'Tap the buggy line.', code: R`int n;
scanf("%d", n);
printf("%d", n);`, a: 1, fix: 'scanf("%d", &n);', x: 'scanf needs &.', w: { 0: 'Fine.', 2: 'printf takes the value, so no & is needed here.' } },
    { t: 'mcq', q: 'What is the bug?', code: R`i = 0;
while (i < 10) {
  printf("%d", i);
}`, o: [['i never changes: infinite loop', 'Correct: add i++; inside the loop.'], ['The braces are wrong', 'The braces are fine.'], ['printf needs &i', 'printf never takes &.']], a: 0 },
    { t: 'bug', q: 'This should print "one" for x = 1. Tap the line to fix.', code: R`switch (x) {
  case 1: printf("one");
  case 2: printf("two");
}`, a: 1, fix: 'case 1: printf("one"); break;', x: 'No break, so case 1 also prints "two".', w: { 0: 'The switch header is fine.', 2: 'The last case does not need a break.', 3: 'Fine.' } },
    { t: 'bug', q: 'Tap the buggy line.', code: R`int count = 3;
int 2nd = 3;
float avg;`, a: 1, fix: 'int second = 3;', x: 'A name cannot start with a digit.', w: { 0: 'count is a valid name.', 2: 'float avg; is correct.' } },
    { t: 'bug', q: 'Tap the buggy line.', code: R`int second = 3;
Float avg;
avg = second / 2.0;`, a: 1, fix: 'float avg;', x: 'Float with a capital F is not a type. Keywords are lowercase.', w: { 0: 'second is a valid name.', 2: 'Dividing by 2.0 is correct.' } },
    { t: 'bug', q: 'We want 3.5. Tap the buggy line.', code: R`int sum = 7, n = 2;
float avg = sum / n;
printf("%.1f", avg);`, a: 1, fix: 'float avg = (float) sum / n;', x: 'int ÷ int → 3, so avg = 3.0.', w: { 0: 'The ints are fine; the cast belongs in the division.', 2: '%.1f is fine.' } },
  ]},

  // ───────────────────────────────────────── 5.6
  { id: 'u5-write1', title: 'Write-the-code: factorial, GCD, sums', slides: '53', mins: 6, items: [
    { t: 'learn', h: 'Factorial (while)',
      code: R`int n;
long long f = 1;
scanf("%d", &n);
while (n > 0) {
  f *= n;
  --n;
}
printf("%lld", f);`, stdin: '5', out: '120', p: '5! = 120. **long long** holds big numbers; print it with **%lld**.' },
    { t: 'trace', h: 'Trace factorial(5)', id: 'factorial' },
    { t: 'fill', q: 'Complete the factorial.', code: R`int n;
long long f = 1;
scanf("%d", &n);
while (n [[0]] 0) {
  f [[1]] n;
  --n;
}
printf("%lld", f);`, b: [['>', '!='], ['*=']], stdin: '6', run: { expect: '720' } },
    { t: 'mcq', q: 'Why `long long` for the factorial?',
      o: [['Factorials grow very fast and overflow int (13! is too big)', 'Correct: long long holds much bigger numbers. Print it with %lld.'], ['Because n is negative', 'n is positive here.'], ['long long is faster', 'It is about size, not speed.']], a: 0 },
    { t: 'learn', h: 'GCD (Euclid)',
      code: R`int u, v, temp;
scanf("%i%i", &u, &v);
while (v != 0) {
  temp = u % v;
  u = v;
  v = temp;
}
printf("%i", u);`, stdin: '150 35', out: '5', p: '150, 35 → 5. 48, 18 → 6.' },
    { t: 'fill', q: 'Complete the GCD loop body.', code: R`int u, v, temp;
scanf("%i%i", &u, &v);
while (v != 0) {
  temp = u [[0]] v;
  u = [[1]];
  v = [[2]];
}
printf("%i", u);`, b: [['%'], ['v'], ['temp']], stdin: '48 18', run: { expect: '6' } },
    { t: 'learn', h: '1 + 2 + … + n',
      code: R`int n, i, sum = 0;
scanf("%d", &n);
for (i = 1; i <= n; i++)
  sum += i;
printf("%d", sum);`, stdin: '200', out: '20100', p: 'n = 5 → 15. n = 200 → 20100.' },
    { t: 'fill', q: 'Complete the sum 1 + … + n.', code: R`int n, i, sum = 0;
scanf("%d", &n);
for (i = 1; i [[0]] n; i++)
  sum [[1]] i;
printf("%d", sum);`, b: [['<='], ['+=']], stdin: '10', run: { expect: '55' } },
  ]},

  // ───────────────────────────────────────── 5.7
  { id: 'u5-write2', title: 'Write-the-code: evens/odds, average, grades', slides: '54', mins: 6, items: [
    { t: 'learn', h: 'Sum of evens a→b, odds b→c (input ascending)',
      code: R`int a, b, c, sumOdd = 0, sumEven = 0;
scanf("%d %d %d", &a, &b, &c);
for (int i = a; i <= b; i++)
  if (i % 2 == 0) sumEven += i;
for (int j = b; j <= c; j++)
  if (j % 2 == 1) sumOdd += j;
printf("%d %d", sumEven, sumOdd);`, stdin: '10 20 30', out: '90 125', p: '10 20 30 → evens 10..20 = 90, odds 20..30 = 125.' },
    { t: 'out', q: 'Same program, input 1 4 7.', code: R`int a, b, c, sumOdd = 0, sumEven = 0;
scanf("%d %d %d", &a, &b, &c);
for (int i = a; i <= b; i++)
  if (i % 2 == 0) sumEven += i;
for (int j = b; j <= c; j++)
  if (j % 2 == 1) sumOdd += j;
printf("%d %d", sumEven, sumOdd);`, stdin: '1 4 7', a: '6 12', x: 'Evens 1..4: 2 + 4 = 6. Odds 4..7: 5 + 7 = 12.' },
    { t: 'learn', h: 'Average of 20 integers in an array',
      code: R`int num[20], sum = 0, x;
float avg;
for (x = 0; x <= 19; x++)
  scanf("%d", &num[x]);
for (x = 0; x <= 19; x++)
  sum = sum + num[x];
avg = (float) sum / 20;
printf("%f", avg);`, stdin: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20', out: '10.500000', p: 'Input 1…20 → 210 / 20 = 10.5.' },
    { t: 'fill', q: 'Complete the average of 20.', code: R`int num[20], sum = 0, x;
float avg;
for (x = 0; x [[0]] 19; x++)
  scanf("%d", &num[x]);
for (x = 0; x <= 19; x++)
  sum = sum + num[x];
avg = [[1]] sum / 20;
printf("%f", avg);`, b: [['<='], ['(float)']], stdin: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20', run: { expect: '10.500000' } },
    { t: 'out', q: 'Grades homework: average and failures (< 65). What does it print?', code: R`int g[7] = {93, 63, 87, 65, 62, 88, 76};
int i, sum = 0, fails = 0;
for (i = 0; i < 7; i++) {
  sum += g[i];
  if (g[i] < 65) fails++;
}
printf("%.2f %d", (float) sum / 7, fails);`, a: '76.29 2', x: 'sum = 534, 534 / 7 = 76.2857 → 76.29. 63 and 62 fail (65 is not < 65).',
      w: { '76.29 3': '65 < 65 is false, so 65 passes.', '76.00 2': 'The (float) cast keeps the decimals.' } },
    { t: 'num', q: 'Sum of the even numbers from 1 to 10?', a: 30, x: '2 + 4 + 6 + 8 + 10 = 30.',
      run: { code: R`int s = 0; for (int i = 1; i <= 10; i++) if (i % 2 == 0) s += i; printf("%d", s);`, expect: '30' } },
  ]},

  // ───────────────────────────────────────── 5.8
  { id: 'u5-checklist', title: 'Exam-day checklist', slides: '61', mins: 3, items: [
    { t: 'learn', h: 'Your full-mark checklist',
      rule: `**Before you answer:** read the code twice. Circle every **;**, **{ }**, **=** vs **==**, and missing **break**.
**Every output question:** make a trace table. Never do loops in your head "roughly".
**Every division:** are both sides int? Then chop the decimals.
**Every loop:** write the first value, the last value that passes, and how many rounds.
**Every printf:** copy spaces, \\n and \\t exactly. %f = 6 decimals.
**Every array:** index 0 to size − 1. [row][column]. Missing values = 0.` },
    { t: 'out', q: 'Final warm-up. What does this print?', code: R`int i, c = 0;
float f = 5 / 2;
for (i = 0; i < 3; i++)
  c += i;
printf("%.1f %d %d", f, c, i);`, a: '2.0 3 3', w: { '2.5 3 3': '5 / 2 is int ÷ int = 2 → 2.0.', '2.0 3 2': 'i ends at the first failing value: 3.' } },
    { t: 'out', q: 'What does this print?', code: R`int k = 0;
switch (k + 1) {
  case 1: printf("a");
  case 2: printf("b"); break;
  case 3: printf("c");
}`, a: 'ab' },
    { t: 'out', q: 'What does this print?', code: R`int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
int x = 1, y;
y = x++ + a[1][2];
printf("%d %d", x, y);`, a: '2 7', x: 'x++ hands over the old 1; a[1][2] is row 1, column 2 → 6. y = 1 + 6 = 7, and x becomes 2.',
      w: { '2 8': 'x++ hands over the OLD value 1, not 2.', '2 4': 'a[1][2] is row 1 {4, 5, 6}, column 2 → 6.' } },
  ]},
  ]
});

// ═══════════════════════════════════════ Mock exam (deck slides 55–60) ═══════════════════════════════════════
CS116.mockExam([
  { t: 'mcq', q: 'Q1. C was developed by', o: [['Dennis Ritchie', 'Correct: 1972.'], ['Bjarne Stroustrup', 'C++.'], ['James Gosling', 'Java.'], ['Guido van Rossum', 'Python.']], a: 0 },
  { t: 'mcq', q: 'Q2. Which is a valid name?', o: [['_total3', 'Correct: no leading digit, no $, not a keyword.'], ['3total', 'Starts with a digit.'], ['total$', '$ is not allowed.'], ['int', 'Keyword.']], a: 0 },
  { t: 'mcq', q: 'Q3. NOT allowed as a case label', o: [['2.5', 'Correct: floats cannot be case labels.'], ['5', 'An int constant is fine.'], ["'x'", 'A char constant is fine.'], ['3+1', 'A constant expression is fine.']], a: 0 },
  { t: 'mcq', q: "Q4. ASCII value of 'a'", o: [['97', "Correct: 'A' is 65, lowercase is +32."], ['65', "That is 'A'."], ['48', "That is '0'."], ['32', 'That is the difference between upper and lower case.']], a: 0 },
  { t: 'mcq', q: 'Q5. Always runs its body at least once', o: [['do-while', 'Correct: the check is at the end.'], ['for', 'for checks first.'], ['while', 'while checks first.'], ['none', 'do-while does.']], a: 0 },
  { t: 'mcq', q: 'Q6. int a[8]: last valid index', o: [['7', 'Correct: size − 1.'], ['8', 'a[8] is out of bounds.'], ['9', 'Out of bounds.'], ['1', 'The first index is 0.']], a: 0 },
  { t: 'mcq', q: 'Q7. Format specifier for a char', o: [['%c', 'Correct.'], ['%d', 'int.'], ['%f', 'float.'], ['%s', 'string.']], a: 0 },
  { t: 'out', q: 'Q8. Output?', code: R`printf("%d",
  17 % 5 * 2 + 9 / 2);`, a: '8', x: '17%5 = 2, 2*2 = 4; 9/2 = 4; 4 + 4 = 8.' },
  { t: 'out', q: 'Q9. Output?', code: R`float f = 9 / 2;
printf("%.1f", f);`, a: '4.0', x: '9/2 = 4 as ints, then stored as 4.0.', w: { '4.5': '9 / 2 is int ÷ int = 4 BEFORE it is stored.' } },
  { t: 'out', q: 'Q10. Output?', code: R`int k = 10, j = 20;
printf("%d", k > 5 &&
  j < 10 || !(k == 3));`, a: '1', x: '(1 && 0) = 0; !(0) = 1; 0 || 1 = 1.' },
  { t: 'out', q: 'Q11. Output?', code: R`char g = 'b';
switch (g) {
 case 'a': printf("A");
 case 'b': printf("B");
 case 'c': printf("C");
   break;
 default: printf("X");
}`, a: 'BC', trace: 'switchmock', x: "Jumps to 'b', no break → falls into 'c', then break.", w: { 'B': "No break after case 'b'.", 'ABC': "It jumps straight to 'b'." } },
  { t: 'num', q: 'Q12. How many lines are printed?', code: R`for (i = 3; i <= 15;
     i += 4)
  printf("Hi\n");`, a: 4, x: 'i = 3, 7, 11, 15; then 19 fails.', pre: 'int i;', run: { expect: 'Hi\nHi\nHi\nHi' } },
  { t: 'out', q: 'Q13. Output?', code: R`int i = 1;
do {
  printf("%d", i);
  i *= 3;
} while (i < 20);`, a: '139', trace: 'mock13', x: 'Prints 1, 3, 9; then i = 27 fails (no spaces!).', w: { '1 3 9': 'There are no spaces in the format string.', '13927': '27 < 20 fails before it can print.' } },
  { t: 'out', q: 'Q14. Output?', code: R`for (i = 1; i <= 3; i++) {
  for (j = i; j <= 3; j++)
    printf("%d", j);
  printf("\n");
}`, pre: 'int i, j;', a: '123\n23\n3', trace: 'mock14', x: 'The inner loop starts at i: three lines.' },
  { t: 'out', q: 'Q15. Output?', code: R`int x = 5, y;
y = x++ * 2;
printf("%d %d", x, y);`, a: '6 10', trace: 'mock15', x: 'Uses the old x (5) × 2 = 10, then x → 6.', w: { '6 12': 'x++ hands over the OLD 5.' } },
  { t: 'out', q: 'Q16. Output?', code: R`int s = 0;
for (i = 1; i <= 6; i++) {
  if (i == 2) continue;
  if (i == 5) break;
  s += i;
}
printf("%d", s);`, pre: 'int i;', a: '8', trace: 'mock16', x: '1 + 3 + 4 (2 skipped, stops at 5).' },
  { t: 'out', q: 'Q17. Output?', code: R`int a[6] = {3, 8, 1, 9, 4};
printf("%d %d",
  a[1] + a[3], a[5]);`, a: '17 0', x: '8 + 9; a[5] was never given → 0.' },
  { t: 'out', q: 'Q18. Output?', code: R`int m[3][3], s = 0;
for (i = 0; i < 3; i++)
  for (j = 0; j < 3; j++)
    m[i][j] = i + j;
for (i = 0; i < 3; i++)
  s += m[i][i];
printf("%d %d", m[2][1], s);`, pre: 'int i, j;', a: '3 6', trace: 'mock18', x: 'm[2][1] = 2+1; diagonal 0 + 2 + 4.' },
  { t: 'fill', q: 'Q19. Fill the blanks to print int a[5] backwards.', code: R`for (i = [[0]]; i [[1]] 0; i--)
  printf("%d ", a[i]);`, b: [['4'], ['>=']], pre: 'int a[5] = {1, 2, 3, 4, 5}, i;', run: { expect: '5 4 3 2 1' }, x: 'Start at the last index, include index 0.' },
  { t: 'out', q: 'Q20. Output?', code: R`int n = 1234, s = 0;
while (n) {
  s += n % 10;
  n /= 10;
}
printf("%d", s);`, a: '10', trace: 'digitsum', x: 'Adds the digits: 4 + 3 + 2 + 1.' },
]);
})();
