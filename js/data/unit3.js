// Unit 3 · Loops: while, do-while, for, ASCII, nested loops, ++/--, break/continue (deck slides 18–33)
(() => {
const R = String.raw;
CS116.unit({
  id: 'u3', title: 'Loops', sub: 'Lectures 4–8 · slides 18–33',
  lessons: [

  // ───────────────────────────────────────── 3.1
  { id: 'u3-while', title: 'while loops', slides: '19', mins: 5, items: [
    { t: 'learn', h: 'while: check, then do, then check again',
      code: R`int u, v, temp;
scanf("%i%i", &u, &v);  // 150 35
while (v != 0)
{
  temp = u % v;
  u = v;
  v = temp;
}
printf("GCD is %i\n", u);`,
      p: 'check the condition → true: run the body → check again… → false: skip to the line after the loop.',
      key: 'If the condition is false the very first time, the body runs **0 times**.' },
    { t: 'trace', h: 'Trace the GCD', id: 'gcd', p: 'Input 150 35. This is exactly the trace table from the slide.' },
    { t: 'out', q: 'Same GCD program. Input: 48 18', code: R`int u, v, temp;
scanf("%i%i", &u, &v);
while (v != 0)
{
  temp = u % v;
  u = v;
  v = temp;
}
printf("GCD is %i\n", u);`, stdin: '48 18', a: 'GCD is 6', x: '48%18 = 12 → (18,12) · 18%12 = 6 → (12,6) · 12%6 = 0 → (6,0) · stop: u = 6.' },
    { t: 'out', q: 'What does this print?', code: R`int i = 10;
while (i < 5) {
  printf("%d ", i);
  i++;
}
printf("done");`, a: 'done', w: { '10 done': '10 < 5 is false on the very first check, so the body runs 0 times.' } },
    { t: 'learn', h: 'Infinite loops', trap: 'If nothing in the body changes the variable in the condition (no i++), the condition never becomes false: an **infinite loop**.' },
    { t: 'mcq', q: 'What is wrong with this code?', code: R`i = 0;
while (i < 10) {
  printf("%d", i);
}`,
      o: [['i never changes, so it loops forever', 'Correct: add i++; inside the body.'], ['The condition should be i <= 10', 'That would change the count, but the real problem is that i never grows.'],
          ['Nothing: it prints 0 to 9', 'Without i++, i stays 0 forever.']], a: 0 },
    { t: 'num', q: 'How many times does the body run?', code: R`int n = 1;
while (n < 100)
  n *= 2;`, a: 7, x: 'n: 1, 2, 4, 8, 16, 32, 64 all pass the check (7 rounds). Then n = 128 fails.',
      w: { 6: 'Count the round where n = 64: 64 < 100 is true, so it doubles once more.', 100: 'n doubles each round; it does not count up by 1.' },
      run: { code: R`int n = 1, c = 0;
while (n < 100) { n *= 2; c++; }
printf("%d", c);`, expect: '7' } },
    { t: 'out', q: 'Same loop. What is n afterwards?', code: R`int n = 1;
while (n < 100)
  n *= 2;
printf("%d", n);`, a: '128', w: { '64': '64 < 100 is true, so the body runs again: n = 128. Then the check fails.' } },
  ]},

  // ───────────────────────────────────────── 3.2
  { id: 'u3-dowhile', title: 'do-while loops', slides: '20', mins: 5, items: [
    { t: 'learn', h: 'do-while: do first, ask later',
      code: R`int a = 21;
do
{
  printf("value of a: %d\n", a);
  a = a + 1;
}
while (a < 20);   // ← semicolon here!`, out: 'value of a: 21',
      key: '**while** tests BEFORE each round (pre-test loop). **do-while** tests AFTER each round (post-test loop), so the body always runs **at least once**.' },
    { t: 'trace', h: 'Trace it', id: 'dowhile', p: '21 < 20 is false, but the body has already run once.' },
    { t: 'mcq', q: 'With a normal `while (a < 20)` and a = 21, how many times does the body run?',
      o: [['0 times', 'Correct: while checks first, and 21 < 20 is false.'], ['Once', 'Only do-while guarantees one run.'], ['Forever', 'a < 20 is false straight away.']], a: 0 },
    { t: 'trace', h: 'Exam classic: reverse the digits', id: 'reverse', p: 'Input 13579. % 10 takes the last digit; / 10 removes it.' },
    { t: 'out', q: 'What does this print?', code: R`int number = 13579, right_digit;
do {
  right_digit = number % 10;
  printf("%i", right_digit);
  number = number / 10;
} while (number != 0);`, a: '97531', trace: 'reverse' },
    { t: 'out', q: 'The same code with number = 0. What does it print?', code: R`int number = 0, right_digit;
do {
  right_digit = number % 10;
  printf("%i", right_digit);
  number = number / 10;
} while (number != 0);`, a: '0',
      w: { '': 'do-while ALWAYS runs once: it prints 0 % 10 = 0 before checking.' }, x: 'This is the only input where the while and do-while versions differ: while prints nothing, do-while prints 0.' },
    { t: 'mcq', q: 'For which input do the while and do-while versions of "reverse the digits" print different things?',
      o: [['0', 'Correct: while prints nothing, do-while prints 0.'], ['13579', 'Both print 97531.'], ['Every input', 'They agree on every input except 0.']], a: 0 },
    { t: 'bug', q: 'Tap the line with the mistake.', code: R`int i = 0;
do {
  i++;
} while (i < 5)
printf("%d", i);`, a: 3, fix: '} while (i < 5);', x: 'A do-while ends with a semicolon after while ( ).',
      w: { 1: 'do { is correct.', 2: 'i++; is fine.', 4: 'The printf is fine.' } },
  ]},

  // ───────────────────────────────────────── 3.3
  { id: 'u3-for', title: 'for loops', slides: '21', mins: 5, items: [
    { t: 'learn', h: 'The order the 3 parts run in',
      code: R`for ( ① i = 1 ; ② i <= 3 ; ④ i++ )   ③ body;`,
      p: '**①** start: runs **once**. → **②** check → **③** body → **④** update → back to **②**…',
      rule: `Count the rounds fast:
• i = a; i < b; i++ → **b − a** rounds
• i = a; i <= b; i++ → **b − a + 1** rounds
• After the loop, i is the **first value that failed** the check.` },
    { t: 'trace', h: 'Trace the order', id: 'forbasic', p: 'Watch the pattern: check, body, update, check… The last check (4 <= 3) fails, so i = 4 after the loop.' },
    { t: 'num', q: 'How many times does the body run?', code: R`for (i = 0; i < 10; i++)
  printf("*");`, a: 10, w: { 11: '< 10 stops at 9: 0…9 is 10 values (b − a).', 9: '0 to 9 is 10 values, not 9.' },
      pre: 'int i;', run: { code: R`int c = 0; for (i = 0; i < 10; i++) c++; printf("%d", c);`, expect: '10' } },
    { t: 'num', q: 'How many times does the body run?', code: R`for (i = 2; i <= 9; i++)
  printf("*");`, a: 8, w: { 7: 'With <= the end counts: 9 − 2 + 1 = 8.' },
      pre: 'int i;', run: { code: R`int c = 0; for (i = 2; i <= 9; i++) c++; printf("%d", c);`, expect: '8' } },
    { t: 'out', q: 'What is i after the loop?', code: R`for (i = 0; i < 7; i++) { }
printf("%d", i);`, pre: 'int i;', a: '7', w: { '6': '6 is the last value that PASSED. The loop stops when i = 7 fails the check.' } },
    { t: 'num', q: 'How many times does the body run?', code: R`for (i = 10; i > 0; i -= 3)
  printf("%d ", i);`, a: 4, x: 'i = 10, 7, 4, 1 → then -2 fails.', pre: 'int i;',
      run: { code: R`int c = 0; for (i = 10; i > 0; i -= 3) c++; printf("%d", c);`, expect: '4' } },
    { t: 'learn', h: 'for-loop traps',
      trap: `• **for (;;)** is an infinite loop: all 3 parts are optional.
• **for (i=0; i<5; i++);** ← the ; is an empty body. The loop does nothing 5 times, then the next line runs **once**.
• No { } → only **one** statement is the body.` },
    { t: 'out', q: 'What does this print?', code: R`for (i = 0; i < 3; i++)
  printf("a");
  printf("b");`, pre: 'int i;', a: 'aaab', w: { 'ababab': 'No { }: only printf("a") is the body. printf("b") runs once after the loop.' } },
    { t: 'out', q: 'What does this print?', code: R`for (i = 1; i <= 3; ++i)
  printf("%d ", i);`, pre: 'int i;', a: '1 2 3', w: { '2 3 4': 'As the update part, ++i and i++ behave exactly the same. The update runs AFTER the body.' } },
    { t: 'mcq', q: '`for (;;) { … }` with no break inside is…',
      o: [['an infinite loop', 'Correct: an empty check counts as true.'], ['a syntax error', 'All three parts are optional, so it compiles.'], ['a loop that runs 0 times', 'The missing condition is treated as true.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 3.4
  { id: 'u3-drill', title: 'Loop drill', slides: '22–23', mins: 5, items: [
    { t: 'out', q: 'Drill 1. What does it print?', code: R`int i = 0;
while (i < 10)
{
  i += 3;
}
printf("%d", i);`, a: '12', trace: 'while3',
      w: { '9': 'At i = 9 the check 9 < 10 is still TRUE, so it adds 3 once more.', '10': 'i jumps by 3: 0, 3, 6, 9, 12. It never equals 10.' } },
    { t: 'out', q: 'Drill 2. What does it print?', code: R`for (i = 10; i > 0;
     i -= 3)
  printf("%d ", i);`, pre: 'int i;', a: '10 7 4 1', w: { '10 7 4 1 -2': '−2 > 0 is false, so −2 is never printed.' } },
    { t: 'out', q: 'Drill 3. What does it print?', code: R`for (i = 0; i < 5; i++);
printf("%d", i);`, pre: 'int i;', a: '5', trace: 'forsemi',
      w: { '01234': 'The ; after for(...) is the entire body. printf runs once, after the loop.', '4': 'After the loop, i is the first value that failed: 5.' } },
    { t: 'out', q: 'Drill 4. What does it print?', code: R`int n = 20;
do {
  printf("%d ", n);
  n /= 2;
} while (n > 0);`, a: '20 10 5 2 1', trace: 'halve',
      w: { '20 10 5 2.5': 'n is an int: 5/2 = 2 (chopped).', '20 10 5 2 1 0': 'When n becomes 0 the check fails before it can print.' } },
    { t: 'out', q: 'Drill 5. What does it print?', code: R`float j;
for (j = 5.5; j > 0; j--)
  printf("%.1f ", j);`, a: '5.5 4.5 3.5 2.5 1.5 0.5', w: { '5.5 4.5 3.5 2.5 1.5': '0.5 > 0 is true, so 0.5 prints. Then −0.5 fails.' } },
    { t: 'out', q: 'Drill 6. What does it print?', code: R`int sum = 0, c;
for (c = 1; c <= 5; c++)
  sum += c;
printf("Sum = %d", sum);`, a: 'Sum = 15', w: { 'Sum = 10': '<= 5 includes 5: 1+2+3+4+5 = 15.' } },
    { t: 'out', q: 'The triangular number 1 + 2 + … + 200. What does it print?', code: R`int sum = 0, c;
for (c = 1; c <= 200; c++)
  sum += c;
printf("%d", sum);`, a: '20100' },
  ]},

  // ───────────────────────────────────────── 3.5
  { id: 'u3-ascii', title: 'ASCII & char loops', slides: '24', mins: 4, items: [
    { t: 'learn', h: 'Every char is secretly a number',
      table: [['Char', 'ASCII', 'Char', 'ASCII'], ["'A'", '65', "'a'", '97'], ["'B'", '66', "'b'", '98'], ["'Z'", '90', "'k'", '107'], ["'0'", '48', "'3'", '51']],
      p: 'ASCII = American Standard Code for Information Interchange · early 1960s · **7-bit** · **128** characters · lowercase = uppercase **+ 32**.',
      key: '%c shows the **letter**, %d shows its **number**. Adding to a char moves you along the alphabet.' },
    { t: 'out', q: 'What does this print?', code: R`char c = 'k';
printf("%c is %d", c, c);`, a: 'k is 107' },
    { t: 'out', q: 'What does this print?', code: R`char ch = 'A' + 2;
printf("%c %d", ch, ch);`, a: 'C 67', w: { 'A2 67': "'A' + 2 is a number (67), which is the letter C." } },
    { t: 'out', q: 'What does this print?', code: R`printf("%c", 'a' - 32);`, a: 'A' },
    { t: 'trace', h: 'A loop over letters', id: 'ascii' },
    { t: 'out', q: 'What does this print?', code: R`char c;
for (c = 'a'; c <= 'e'; c += 2)
  printf("%c", c);`, a: 'ace' },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %c", '0' + 5, '0' + 5);`, a: '53 5', x: "'0' is 48. 48 + 5 = 53, which is the character '5'." },
    { t: 'mcq', q: 'ASCII is…',
      o: [['7-bit, 128 characters', 'Correct.'], ['8-bit, 256 characters', 'The lecture defines ASCII as 7-bit with 128 characters.'], ['16-bit, 65536 characters', 'That is closer to Unicode.']], a: 0 },
    { t: 'mcq', q: "Is `'A' == 'a'` true?",
      o: [['No: 65 vs 97', 'Correct: C is case sensitive, even for chars.'], ['Yes', "They are different codes: 'a' is 'A' + 32."]], a: 0 },
  ]},

  // ───────────────────────────────────────── 3.6 WEAK
  { id: 'u3-nested', title: 'Nested loops multiply', weak: true, slides: '25', mins: 6, items: [
    { t: 'learn', h: 'The rule',
      p: `For **every single round** of the outer loop, the inner loop runs **all** of its rounds, starting again from its first value.
So when both limits are fixed: **total = outer rounds × inner rounds**. With 3 rows and 4 columns that is 3 × 4 = **12**, not 3 + 4 = 7.
The inner variable **restarts** every time the outer loop goes round (j = 1 again).`,
      code: R`for (i = 1; i <= 3; i++)      // rows
{
  for (j = 1; j <= 4; j++)  // columns
    printf("*");
  printf("\n");  // after each row
}`, out: '****\n****\n****', pre: 'int i, j;' },
    { t: 'trace', h: 'Count the rounds', id: 'nestcount', p: 'Watch j reset to 1 every time i moves on, and count climb to 12.' },
    { t: 'num', q: 'How many stars are printed?', code: R`for (i = 0; i < 3; i++)
  for (j = 0; j < 4; j++)
    printf("*");`, a: 12, trace: 'nestcount',
      w: { 7: 'You ADDED 3 + 4. The inner loop runs all 4 rounds for EACH of the 3 outer rounds: 3 × 4.', 4: 'That is one row only. There are 3 rows.', 3: 'Each outer round prints 4 stars, not 1.' },
      pre: 'int i, j;', run: { code: R`int c = 0; for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) c++; printf("%d", c);`, expect: '12' },
      again: { t: 'num', q: 'How many times does printf run?', code: R`for (i = 0; i < 4; i++)
  for (j = 1; j <= 5; j++)
    printf("x");`, a: 20, w: { 9: '4 + 5 is wrong: 4 outer rounds × 5 inner rounds = 20.' },
        pre: 'int i, j;', run: { code: R`int c = 0; for (i = 0; i < 4; i++) for (j = 1; j <= 5; j++) c++; printf("%d", c);`, expect: '20' } } },
    { t: 'num', q: 'How many times does printf run?', code: R`for (i = 1; i <= 5; i++)
  for (j = 1; j <= 2; j++)
    printf("x");`, a: 10, w: { 7: 'Multiply, don\'t add: 5 × 2.' },
      pre: 'int i, j;', run: { code: R`int c = 0; for (i = 1; i <= 5; i++) for (j = 1; j <= 2; j++) c++; printf("%d", c);`, expect: '10' } },
    { t: 'num', q: 'How many lines are printed?', code: R`for (i = 1; i <= 4; i++)
  for (j = 1; j < 3; j++)
    printf("%i %i\n", i, j);`, a: 8, trace: 'nestpairs',
      w: { 12: 'j < 3 means j = 1, 2 only (2 rounds). 4 × 2 = 8.', 6: '4 + 2 is wrong: multiply.' },
      pre: 'int i, j;', run: { code: R`int c = 0; for (i = 1; i <= 4; i++) for (j = 1; j < 3; j++) c++; printf("%d", c);`, expect: '8' } },
    { t: 'num', q: 'Careful: the inner limit uses i. How many stars?', code: R`for (i = 1; i <= 3; i++)
  for (j = 1; j <= i; j++)
    printf("*");`, a: 6, trace: 'triangle',
      w: { 9: 'Only multiply when the inner limit is FIXED. Here row i has i stars: 1 + 2 + 3 = 6.' },
      pre: 'int i, j;', run: { code: R`int c = 0; for (i = 1; i <= 3; i++) for (j = 1; j <= i; j++) c++; printf("%d", c);`, expect: '6' } },
    { t: 'num', q: 'How many times does count++ run?', code: R`for (i = 0; i < 3; i++)
  for (j = 0; j < 5; j += 2)
    count++;`, a: 9, x: 'Inner: j = 0, 2, 4 → 3 rounds. 3 × 3 = 9.', w: { 15: 'j goes up by 2: 0, 2, 4 is only 3 values.' },
      pre: 'int i, j, count = 0;', run: { post: R`printf("%d", count);`, expect: '9' } },
    { t: 'mcq', q: 'After this code, what are i and j?', code: R`for (i = 1; i <= 3; i++)
  for (j = 1; j <= 4; j++) { }`,
      o: [['i = 4, j = 5', 'Correct: each variable ends at the first value that FAILED its check.'], ['i = 3, j = 4', 'Those are the last values that passed.'], ['i = 4, j = 1', 'j failed at 5 at the end of the last outer round.']], a: 0,
      pre: 'int i, j;', run: { post: R`printf("i = %d, j = %d", i, j);`, code: R`for (i = 1; i <= 3; i++)
  for (j = 1; j <= 4; j++) { }`, expect: 'i = 4, j = 5' } },
  ]},

  // ───────────────────────────────────────── 3.7
  { id: 'u3-shapes', title: 'Nested loop drill: shapes', slides: '26–27', mins: 5, items: [
    { t: 'out', q: 'Drill 1. Write all the lines.', code: R`for (i = 1; i <= 4; i++)
  for (j = 1; j < 3; j++)
    printf("%i %i\n", i, j);`, pre: 'int i, j;', a: '1 1\n1 2\n2 1\n2 2\n3 1\n3 2\n4 1\n4 2', trace: 'nestpairs', x: 'j < 3 → only j = 1, 2. 4 × 2 = 8 lines.' },
    { t: 'out', q: 'Drill 2 (n = 6). What does it draw?', code: R`for (row = 1; row < n; row++) {
  for (col = 1; col < n; col++) {
    if (col != 3) printf("#");
    if (col == 3) printf("*");
  }
  printf("\n");
}`, pre: 'int n = 6, row, col;', a: '##*##\n##*##\n##*##\n##*##\n##*##', x: 'row and col go 1 to 5 (< 6). Column 3 is *.' },
    { t: 'out', q: 'Drill 3 (n = 5). What does it draw?', code: R`for (row = 1; row <= n; row++) {
  for (col = 5; col >= row; col--)
    printf("#");
  printf("\n");
}`, pre: 'int n = 5, row, col;', a: '#####\n####\n###\n##\n#', trace: 'shrink' },
    { t: 'out', q: 'Drill 4. What does it draw?', code: R`for (i = 1; i <= 3; i++) {
  for (j = 1; j <= i; j++)
    printf("*");
  printf("\n");
}`, pre: 'int i, j;', a: '*\n**\n***', trace: 'triangle' },
    { t: 'learn', h: 'Where is the "\\n"?',
      trap: 'Inside the inner loop → a new line after **every** symbol. After the inner loop (but inside the outer) → one new line **per row**. Check the { } carefully!',
      p: '**Shape trick:** inner limit uses i (j <= i) → triangle growing ◢. Inner starts at a fixed number and goes down to i → triangle shrinking. Fixed limits → rectangle.' },
    { t: 'out', q: 'The \\n is inside the inner block. What does it print?', code: R`for (i = 1; i <= 2; i++)
  for (j = 1; j <= 3; j++) {
    printf("*");
    printf("\n");
  }`, pre: 'int i, j;', a: '*\n*\n*\n*\n*\n*', w: { '***\n***': 'The \\n is inside the inner { }, so it runs after EVERY star: 6 lines.' } },
    { t: 'out', q: 'Mock-style: inner loop starts at i. What does it print?', code: R`for (i = 1; i <= 2; i++) {
  for (j = i; j <= 4; j++)
    printf("%d", j);
  printf("\n");
}`, pre: 'int i, j;', a: '1234\n234' },
    { t: 'mcq', q: 'The inner loop is `for (j = 1; j <= i; j++)`. The shape is…',
      o: [['a growing triangle', 'Correct: row i prints i symbols.'], ['a rectangle', 'Rectangles need fixed limits.'], ['a shrinking triangle', 'Shrinking needs the inner loop to count down to i (or start at i).']], a: 0 },
  ]},

  // ───────────────────────────────────────── 3.8 WEAK
  { id: 'u3-incdec', title: '++ and --: before or after?', weak: true, slides: '28', mins: 6, items: [
    { t: 'learn', h: 'The rule',
      p: `Both **x++** and **++x** add 1 to x. The only difference is the **value the expression hands over**:
• **x++** (post): hands over the **OLD** value, then x grows.
• **++x** (pre): x grows **first**, then hands over the **NEW** value.
Read \`j = i++ + 2;\` with i = 5 in 3 steps:
**1.** i++ hands over the old value **5**.
**2.** i becomes **6**.
**3.** j = 5 + 2 = **7**.`,
      key: 'x = 5; y = x++; → y = 5, x = 6.   x = 5; y = ++x; → y = 6, x = 6.' },
    { t: 'trace', h: 'Post vs pre', id: 'postpre' },
    { t: 'trace', h: 'Your weak spot: j = i++ + 2', id: 'weakinc' },
    { t: 'out', q: 'What does this print?', code: R`int i = 5, j;
j = i++ + 2;
printf("%d %d", i, j);`, a: '6 7', trace: 'weakinc',
      w: { '6 8': 'You used the NEW i (6). i++ hands over the OLD value 5, so j = 5 + 2 = 7.', '5 7': 'j is right, but i still increases to 6.', '5 8': 'i++ gives the old value (5) to the sum, then i grows to 6.' },
      again: { t: 'out', q: 'Now with pre-increment. What does this print?', code: R`int i = 5, j;
j = ++i + 2;
printf("%d %d", i, j);`, a: '6 8', trace: 'weakinc2',
        w: { '6 7': '++i adds 1 FIRST, so the sum uses 6: j = 8.' } } },
    { t: 'out', q: 'What does this print?', code: R`int x = 5, y;
y = x++;
printf("%d %d", x, y);`, a: '6 5', w: { '6 6': 'x++ gives y the OLD value 5.', '5 5': 'x still increases to 6.' } },
    { t: 'out', q: 'What does this print?', code: R`int x = 5, y;
y = ++x;
printf("%d %d", x, y);`, a: '6 6', w: { '6 5': '++x increments FIRST, then y gets the new 6.' } },
    { t: 'out', q: 'What does this print?', code: R`int a = 10;
printf("%d ", a--);
printf("%d", a);`, a: '10 9', w: { '9 9': 'a-- prints the OLD value 10, then a becomes 9.' } },
    { t: 'out', q: 'What does this print?', code: R`int a = 10;
printf("%d ", --a);
printf("%d", a);`, a: '9 9', w: { '10 9': '--a decrements FIRST, then prints 9.' } },
    { t: 'out', q: 'What does this print?', code: R`int x = 5, y;
y = ++x * 2;
printf("%d %d", x, y);`, a: '6 12', w: { '6 10': '++x makes x 6 BEFORE the multiplication: 6 * 2 = 12.' } },
    { t: 'out', q: 'What does this print?', code: R`int n = 3;
int m = n-- - 1;
printf("%d %d", n, m);`, a: '2 2', w: { '2 1': 'n-- hands over the OLD 3: m = 3 − 1 = 2. Then n becomes 2.' } },
    { t: 'learn', h: 'On its own line, they are the same',
      p: '`i++;` and `++i;` on their own, or as the update part of a for loop, do exactly the same thing. `for (i=1; i<=3; ++i)` still prints 1 2 3.',
      rule: 'Shortcuts: x += 2 → x = x + 2 · x *= n → x = x * n · x /= 10 → x = x / 10' },
    { t: 'out', q: 'What does this print?', code: R`int x = 4;
x *= 3;
x -= 2;
x /= 5;
printf("%d", x);`, a: '2', x: '4*3 = 12 → 12−2 = 10 → 10/5 = 2.' },
    { t: 'out', q: 'On their own lines. What does this print?', code: R`int a = 1, b = 1;
a++;
++b;
printf("%d %d", a, b);`, a: '2 2', w: { '2 1': 'Alone on a line, a++ and ++b both just add 1.' } },
  ]},

  // ───────────────────────────────────────── 3.9
  { id: 'u3-incdrill', title: '++ / -- drill (lecture example)', slides: '29–30', mins: 5, items: [
    { t: 'trace', h: 'The lecture example', id: 'incdrill', p: 'Keep a column for q and m, and change q only at the right moment.' },
    { t: 'num', q: 'After this code, what is y?', code: R`int q = 1, m = -5, x, y, z;
printf("q++ = %d\n", q++);
printf("++q = %d\n", ++q);
y = q++;
x = ++q;
z = ++m + q++;`, a: 3, trace: 'incdrill', w: { 4: 'y = q++ gives y the OLD q (3) before q grows to 4.' },
      run: { post: R`printf("%d", y);`, expect: 'q++ = 1\n++q = 3\n3' } },
    { t: 'num', q: 'Same code: what is x?', code: R`int q = 1, m = -5, x, y, z;
printf("q++ = %d\n", q++);
printf("++q = %d\n", ++q);
y = q++;
x = ++q;
z = ++m + q++;`, a: 5, trace: 'incdrill', w: { 4: 'q is 4 before this line; ++q makes it 5 FIRST, then x = 5.' },
      run: { post: R`printf("%d", x);`, expect: 'q++ = 1\n++q = 3\n5' } },
    { t: 'num', q: 'Same code: what is z?', code: R`int q = 1, m = -5, x, y, z;
printf("q++ = %d\n", q++);
printf("++q = %d\n", ++q);
y = q++;
x = ++q;
z = ++m + q++;`, a: 1, trace: 'incdrill',
      w: { 0: '++m is −4 (pre). q++ hands over the old 5. −4 + 5 = 1.', 2: 'q++ hands over 5, not 6.' },
      run: { post: R`printf("%d", z);`, expect: 'q++ = 1\n++q = 3\n1' } },
    { t: 'out', q: 'Same code, then print q and m. What appears on the last line?', code: R`int q = 1, m = -5, x, y, z;
q++;
++q;
y = q++;
x = ++q;
z = ++m + q++;
printf("q = %d, m = %d", q, m);`, a: 'q = 6, m = -4', trace: 'incdrill',
      w: { 'q = 5, m = -4': 'q++ in the last line still increments q after it is used: 5 → 6.', 'q = 6, m = -5': '++m changed m to −4.' } },
    { t: 'out', q: 'Bonus. What does it print?', code: R`int a = 3, b;
b = a++;
printf("%d %d\n", a, b);
b = ++a * 2;
printf("%d %d\n", a, b);`, a: '4 3\n5 10', trace: 'incbonus',
      w: { '4 4\n5 10': 'b = a++ gives b the OLD 3.', '4 3\n5 8': '++a makes a 5 FIRST: 5 * 2 = 10.' } },
  ]},

  // ───────────────────────────────────────── 3.10 WEAK
  { id: 'u3-break', title: 'break vs continue', weak: true, slides: '31–33', mins: 6, items: [
    { t: 'learn', h: 'The rules',
      p: `**break** stops the loop **completely**. It jumps to the first line **after** the loop: no update, no more checks.
**continue** skips only **the rest of this round**:
• in a **for** loop it jumps to the **update** (i++), then the check;
• in a **while / do-while** it jumps straight to the **check**.
Code below break/continue in the same round **never runs**.`,
      trap: 'In nested loops, break and continue affect **only the innermost** loop they are in. `while (5)` is the same as `while (1)`: it runs forever until a break.' },
    { t: 'trace', h: 'continue', id: 'continue', p: 'sum2 = sum2 + i is never reached: continue always jumps past it.' },
    { t: 'trace', h: 'break', id: 'break', p: 'Same code with break: the loop dies in round 1.' },
    { t: 'out', q: 'Drill 1 with continue. What does it print?', code: R`int i, sum1 = 0, sum2 = 0;
for (i = 1; i < 4; i++) {
  sum1 = sum1 + i;
  continue;
  sum2 = sum2 + i;
}
printf("%d %d", sum1, sum2);`, a: '6 0', trace: 'continue',
      w: { '1 0': 'That is the break version. continue keeps looping: sum1 = 1+2+3 = 6.', '6 6': 'continue skips sum2 = sum2 + i every round, so sum2 stays 0.' },
      again: { t: 'out', q: 'Same code with break instead. What does it print?', code: R`int i, sum1 = 0, sum2 = 0;
for (i = 1; i < 4; i++) {
  sum1 = sum1 + i;
  break;
  sum2 = sum2 + i;
}
printf("%d %d", sum1, sum2);`, a: '1 0', trace: 'break', w: { '6 0': 'break leaves the loop in round 1, after sum1 = 1.' } } },
    { t: 'out', q: 'Drill 2. What does it print?', code: R`int sum1 = 0;
while (5) {
  sum1 = sum1 + 1;
  if (sum1 == 7) break;
}
printf("sum1 = %d", sum1);`, a: 'sum1 = 7', trace: 'while5', w: { 'sum1 = 6': 'The break happens AFTER sum1 reaches 7.', 'sum1 = 5': 'while (5) is just "always true". The 5 is not a count.' } },
    { t: 'out', q: 'Drill 3. What does it print?', code: R`for (i = 1; i < 20; i = i + 5)
  for (j = 1; j < 4; j++) {
    printf("i = %d\n", i);
    break;
    printf("j = %d\n", j);
  }`, pre: 'int i, j;', a: 'i = 1\ni = 6\ni = 11\ni = 16', trace: 'nestbreak',
      w: { 'i = 1': 'break leaves only the INNER loop. The outer loop keeps going (i += 5).' } },
    { t: 'out', q: 'Drill 4. What does it print?', code: R`for (i = 1; i <= 10; i++) {
  if (i % 3 == 0) continue;
  if (i == 8) break;
  printf("%d ", i);
}`, pre: 'int i;', a: '1 2 4 5 7', trace: 'contbreak',
      w: { '1 2': 'continue does not stop the loop; it only skips 3 (and 6).', '1 2 4 5 7 8': 'At i = 8 the break runs BEFORE printf.', '1 2 4 5 7 10': 'break ends the loop for good at 8, so 10 is never reached.' } },
  ]},

  // ───────────────────────────────────────── 3.11 WEAK
  { id: 'u3-break2', title: 'Tracing continue & break', weak: true, slides: '31–33, 57', mins: 6, items: [
    { t: 'out', q: 'What does this print?', code: R`for (i = 1; i <= 5; i++) {
  if (i == 3) continue;
  printf("%d ", i);
}`, pre: 'int i;', a: '1 2 4 5',
      w: { '1 2': 'That would be break. continue only skips round 3.', '1 2 3 4 5': 'When i is 3, continue skips the printf.' },
      again: { t: 'out', q: 'Now with break. What does this print?', code: R`for (i = 1; i <= 5; i++) {
  if (i == 3) break;
  printf("%d ", i);
}`, pre: 'int i;', a: '1 2', w: { '1 2 4 5': 'break ends the whole loop at 3; it does not just skip 3.' } } },
    { t: 'out', q: 'continue in a while loop. What does this print?', code: R`int i = 0, s = 0;
while (i < 5) {
  i++;
  if (i % 2 == 0) continue;
  s += i;
}
printf("%d", s);`, a: '9', x: 'i = 1, 3, 5 are added (1 + 3 + 5 = 9). Even values hit continue and skip s += i.',
      w: { '15': 'continue skips s += i for the even values 2 and 4.', '6': 'Even numbers are SKIPPED, not added.' } },
    { t: 'num', q: 'How many x are printed?', code: R`for (i = 1; i <= 10; i++) {
  if (i == 4) break;
  printf("x");
}`, a: 3, pre: 'int i;', w: { 4: 'At i = 4 the break runs before printf.', 9: 'break ends the loop; it does not skip one round.' },
      run: { code: R`for (i = 1; i <= 10; i++) { if (i == 4) break; printf("x"); }`, post: '', expect: 'xxx' } },
    { t: 'out', q: 'break in the inner loop. What does this print?', code: R`for (i = 1; i <= 3; i++) {
  for (j = 1; j <= 3; j++) {
    if (j == 2) break;
    printf("%d%d ", i, j);
  }
}`, pre: 'int i, j;', a: '11 21 31', w: { '11': 'break leaves only the inner loop; the outer loop continues with i = 2, 3.' } },
    { t: 'out', q: 'continue in the inner loop. What does this print?', code: R`for (i = 1; i <= 3; i++) {
  for (j = 1; j <= 3; j++) {
    if (j == 2) continue;
    printf("%d%d ", i, j);
  }
}`, pre: 'int i, j;', a: '11 13 21 23 31 33', w: { '11 21 31': 'That is break. continue skips only j = 2, then j = 3 still prints.' } },
    { t: 'mcq', q: 'In a `for` loop, where does `continue` jump to?',
      o: [['The update (i++), then the check', 'Correct: the update still runs.'], ['Straight to the check, skipping i++', 'That is how a while loop behaves. In a for loop the update runs first.'],
          ['The first line after the loop', 'That is break.']], a: 0 },
    { t: 'mcq', q: 'What happens here?', code: R`i = 0;
while (i < 5) {
  if (i == 2) continue;
  i++;
}`,
      o: [['Infinite loop: i gets stuck at 2', 'Correct: continue jumps to the check, skipping i++, so i stays 2 forever.'], ['The loop runs 5 times', 'Once i is 2, i++ is never reached again.'], ['The loop runs 4 times', 'continue in a while loop skips i++ here.']], a: 0 },
    { t: 'out', q: 'Mock-style. What does this print?', code: R`int s = 0;
for (i = 1; i <= 8; i++) {
  if (i == 3) continue;
  if (i == 6) break;
  s += i;
}
printf("%d", s);`, pre: 'int i;', a: '12', x: '1 + 2 + 4 + 5 = 12 (3 skipped, stops at 6).',
      w: { '15': '3 is skipped by continue.', '33': 'The break at 6 ends the loop.', '18': 'At i = 6, break runs BEFORE s += i.' } },
    { t: 'mcq', q: 'Does code after `break;` in the same round ever run?',
      o: [['Never', 'Correct.'], ['Only in nested loops', 'Code after break in the same block never runs.'], ['Yes, once', 'break leaves immediately.']], a: 0 },
  ]},
  ]
});
})();
