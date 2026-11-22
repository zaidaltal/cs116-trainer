// Unit 2 · Decisions: if, logical operators, switch (deck slides 11–17)
(() => {
const R = String.raw;
CS116.unit({
  id: 'u2', title: 'Decisions: if & switch', sub: 'Lectures 2–4 · slides 11–17',
  lessons: [

  // ───────────────────────────────────────── 2.1
  { id: 'u2-if', title: 'if, else-if, nested if', slides: '12', mins: 5, items: [
    { t: 'learn', h: 'if / else and the else-if chain',
      code: R`if (num % 2 == 0)
  printf("%d is even.", num);
else
  printf("%d is odd.", num);

if (c >= 'a' && c <= 'z')
  printf("letter");
else if (c >= '0' && c <= '9')
  printf("digit");
else
  printf("special");`,
      key: 'In an else-if chain, conditions are tested **top to bottom**. Only the **first** true branch runs; every branch after it is skipped.' },
    { t: 'out', q: 'What does this print?', code: R`int num = 7;
if (num % 2 == 0)
  printf("%d is even.", num);
else
  printf("%d is odd.", num);`, a: '7 is odd.', w: { '7 is odd': 'Copy the output exactly: the full stop is part of the string.' } },
    { t: 'out', q: 'What does this print?', code: R`char c = '5';
if (c >= 'a' && c <= 'z')
  printf("letter");
else if (c >= '0' && c <= '9')
  printf("digit");
else
  printf("special");`, a: 'digit',
      again: { t: 'out', q: 'Same chain, c = \'#\'. What does it print?', code: R`char c = '#';
if (c >= 'a' && c <= 'z')
  printf("letter");
else if (c >= '0' && c <= '9')
  printf("digit");
else
  printf("special");`, a: 'special' } },
    { t: 'mcq', q: 'm = 85. What does this print?', code: R`int m = 85;
if (m >= 50) printf("pass");
else if (m >= 80) printf("good");
else printf("fail");`, out: true,
      o: [['pass', 'Correct: m >= 50 is the FIRST true condition, so the rest of the chain is skipped.'],
          ['good', '85 >= 80 is true, but the chain never gets there: the first true branch (>= 50) already ran.'],
          ['passgood', 'An else-if chain runs at most ONE branch.'], ['fail', 'm >= 50 is true.']], a: 0 },
    { t: 'learn', h: 'Curly brackets',
      rule: 'Without **{ }**, an if (or else) controls only the **one** next statement. For more than one statement you need { }.',
      code: R`int x = 2;
if (x > 5)
  printf("A");
  printf("B");     // NOT part of the if, despite the indent`, out: 'B' },
    { t: 'out', q: 'What does this print?', code: R`int x = 9;
if (x > 5)
  printf("A");
  printf("B");`, a: 'AB', w: { 'A': 'printf("B") is not controlled by the if, so it always runs.' } },
    { t: 'out', q: 'What does this print?', code: R`int a = 5, b = 10;
if (a > 3) {
  if (b < 5) printf("X");
  else printf("Y");
}
else printf("Z");`, a: 'Y',
      w: { 'X': 'b < 5 is false (b = 10), so the inner else runs.', 'Z': 'a > 3 is true, so we go into the outer if block.' } },
    { t: 'learn', h: 'Reading input: scanf',
      p: '`scanf("%d", &x);` reads an int from the keyboard into x.\nIt needs **&** before the variable (printf does not).\nIn Visual Studio, put `#define _CRT_SECURE_NO_WARNINGS` at the top, or scanf is rejected.' },
    { t: 'mcq', q: 'Which line correctly reads an int into x?',
      o: [['scanf("%d", &x);', 'Correct.'], ['scanf("%d", x);', 'Missing & before x.'],
          ['scanf("%f", &x);', '%f is for float; x is an int.'], ['printf("%d", &x);', 'printf prints; it does not read. And printf takes x, not &x.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 2.2 WEAK
  { id: 'u2-assign', title: 'if (x = 5): = vs ==', weak: true, slides: '12–14', mins: 5, items: [
    { t: 'learn', h: 'The rule: = puts a value in; the if then tests that value',
      p: `**=** assigns. **==** compares.
An assignment is also an expression, and its value is **the value that was assigned**.
So \`if (x = 5)\` does two things:
**1.** x becomes 5 (the old value is lost).
**2.** The if tests 5. 5 is non-zero, so it is **true**, always.
\`if (a = 0)\` makes a 0, tests 0 → **false**, always.`,
      trap: 'Exam favourite: after `if (a = 0)`, a really IS 0. Print it later and you get 0.' },
    { t: 'trace', h: 'Trace it', id: 'ifassign', p: 'Watch a: the check `a = 0` changes a to 0, and the check is false.' },
    { t: 'out', q: 'Program 3 of the drill. What does it print?', code: R`int a = 5;
if (a = 0)
  printf("A");
else
  printf("B");
printf("%d", a);`, a: 'B0', trace: 'ifassign',
      w: { 'A5': 'a = 0 is not a comparison. It sets a to 0, and 0 means false.', 'B5': 'Right branch, but a = 0 changed a. It prints 0.', 'A0': 'The value of (a = 0) is 0, which is false, so the else runs.' },
      again: { t: 'out', q: 'What does this print?', code: R`int k = 3;
if (k = 0)
  printf("zero ");
else
  printf("not zero ");
printf("%d", k);`, a: 'not zero 0', w: { 'zero 0': 'k = 0 has value 0, so the if is false.', 'not zero 3': 'k = 0 assigned 0 to k.' } } },
    { t: 'out', q: 'What does this print?', code: R`int x = 5;
if (x = 10)
  printf("ten ");
printf("%d", x);`, a: 'ten 10', trace: 'ifassign5',
      w: { '5': 'x = 10 is an assignment: x becomes 10, and 10 is non-zero (true).', 'ten 5': 'x was overwritten with 10.' } },
    { t: 'out', q: 'Any non-zero is true, even negative. What does this print?', code: R`int y = 0;
if (y = -1)
  printf("yes");
else
  printf("no");`, a: 'yes', w: { 'no': '-1 is non-zero, so it is true. Only 0 is false.' } },
    { t: 'out', q: 'Compare with the correct version. What does this print?', code: R`int a = 5;
if (a == 0)
  printf("A");
else
  printf("B");
printf("%d", a);`, a: 'B5', w: { 'B0': '== only compares. It never changes a.' } },
    { t: 'mcq', q: 'Which condition is true for every value of x?',
      o: [['x = 7', 'Correct: it assigns 7, and 7 is non-zero.'], ['x == 7', 'Only true when x is 7.'],
          ['x = 0', 'Always FALSE: it assigns 0.'], ['x != 7', 'False when x is 7.']], a: 0 },
    { t: 'learn', h: 'The stray semicolon',
      trap: '`if (x > 5);` ← that semicolon IS the if\'s body (an empty statement). The next line is no longer controlled by the if, so it **always** runs.' },
    { t: 'out', q: 'What does this print?', code: R`int x = 1;
if (x > 5);
  printf("hi");`, a: 'hi', w: { '': 'The ; ends the if. printf("hi") always runs.' } },
    { t: 'bug', q: 'This should print "ten" only when x is 10. Tap the buggy line.', code: R`int x = 5;
if (x = 10)
  printf("ten");`, a: 1, fix: 'if (x == 10)', x: '= assigns; == compares. With = it always prints "ten".',
      w: { 0: 'Declaring and initialising x is fine.', 2: 'The printf is fine; the problem is the condition above it.' } },
  ]},

  // ───────────────────────────────────────── 2.3 WEAK
  { id: 'u2-prec', title: 'Precedence: ! · comparisons · && · ||', weak: true, slides: '13–14, 56', mins: 6, items: [
    { t: 'learn', h: 'The precedence ladder (highest first)',
      table: [['Level', 'Operators', 'Note'], ['1', '( )', 'brackets always first'], ['2', '!   -x   ++  --', 'unary: applies to the ONE thing right after it'],
              ['3', '*  /  %', ''], ['4', '+  -', ''], ['5', '<  <=  >  >=', 'each gives 1 or 0'], ['6', '==  !=', ''],
              ['7', '&&', 'AND before OR'], ['8', '||', ''], ['9', '=  +=  …', 'assignment is last']],
      rule: 'Arithmetic → comparisons → **&& before ||**. ! sticks to the value right after it: `!2 + 3` is `(!2) + 3`.' },
    { t: 'steps', h: 'Example: i = 10, j = 20, k = 30', code: 'i + k < j || 30 - i >= j',
      steps: ['i + k < j || 30 - i >= j', '= 40 < 20 || 20 >= 20     ← arithmetic first', '= 0 || 1                  ← comparisons give 1 or 0', '= 1'],
      pre: 'int i = 10, j = 20, k = 30;', check: R`printf("%d", i + k < j || 30 - i >= j);` },
    { t: 'steps', h: '&& binds tighter than ||', code: '1 || 0 && 0',
      steps: ['1 || 0 && 0', '= 1 || (0 && 0)     ← && first, even though it is on the right', '= 1 || 0', '= 1'],
      check: R`printf("%d", 1 || 0 && 0);`,
      p: 'Reading strictly left to right would give (1 || 0) && 0 = 0. **Wrong.** && always goes first.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 1 || 0 && 0);`, a: '1',
      w: { '0': 'You went left to right. && binds first: 0 && 0 = 0, then 1 || 0 = 1.' } },
    { t: 'out', q: 'What does this print?', code: R`int a = 0, b = 1, c = 1;
printf("%d", a && b || c);`, a: '1',
      w: { '0': '&& first: (0 && 1) = 0. Then 0 || 1 = 1.' },
      again: { t: 'out', q: 'What does this print?', code: R`int a = 0, b = 1, c = 1;
printf("%d", a || b && !c);`, a: '0',
        w: { '1': '! first: !c = 0. Then && : b && 0 = 0. Then || : 0 || 0 = 0.' } } },
    { t: 'out', q: '! applies only to the value right after it. What does this print?', code: R`printf("%d", !2 + 3);`, a: '3',
      w: { '0': 'That would be !(2 + 3). Without brackets, ! takes only the 2: !2 = 0, then 0 + 3 = 3.', '4': '!2 is 0 (2 is true, so NOT gives 0).' } },
    { t: 'out', q: 'Drill program 1, line 2 (i = 10, j = 20). What does it print?', code: R`int i = 10, j = 20;
printf("%d", i >= 10 && j < 4);`, a: '0', x: '10 >= 10 → 1; 20 < 4 → 0; 1 && 0 → 0.' },
    { t: 'out', q: 'What does this print? (j = 20)', code: R`int j = 20;
printf("%d", !(j - 20));`, a: '1', w: { '0': 'j − 20 = 0 and !0 = 1.' } },
    { t: 'out', q: 'k = 3, j = 5. What does this print?', code: R`int k = 3, j = 5;
printf("%d", k > 5 && j < 10 || !(k == 3));`, a: '0',
      x: 'k > 5 → 0, so 0 && … = 0. k == 3 → 1, !1 = 0. 0 || 0 = 0.',
      again: { t: 'out', q: 'k = 2, j = 5. What does this print?', code: R`int k = 2, j = 5;
printf("%d", k > 5 && j < 10 || !(k == 3));`, a: '1', x: '(0 && 1) = 0. k == 3 is 0, !0 = 1. 0 || 1 = 1.' } },
    { t: 'mcq', q: 'In `a || b && c`, what is evaluated first?',
      o: [['b && c', 'Correct: && has higher precedence than ||.'], ['a || b', '|| is lower than &&, so it waits.'], ['They are equal: left to right', '&& and || are different levels.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 3 + 2 > 4 && 0 == 0);`, a: '1', x: '3+2 = 5 → 5 > 4 = 1 → 0 == 0 = 1 → 1 && 1 = 1.' },
    { t: 'out', q: 'Comparisons give 1 or 0, and they chain left to right. What does this print?', code: R`printf("%d", 10 > 5 > 2);`, a: '0',
      w: { '1': '10 > 5 is 1. Then 1 > 2 is 0. C does not read this like maths.' } },
  ]},

  // ───────────────────────────────────────── 2.4
  { id: 'u2-drill', title: 'Logic & if drill', slides: '13–14', mins: 4, items: [
    { t: 'out', q: 'Program 1. Write all 5 lines of output.', code: R`int i = 10, j = 20, k = 30;
printf("%d\n", i == 10);
printf("%d\n", i >= 10 && j < 4);
printf("%d\n", i + k < j || 30 - i >= j);
printf("%d\n", !(j - 20));
printf("%d\n", !(k > j));`, a: '1\n0\n1\n1\n0',
      x: '10==10 → 1 · 1 && (20<4 = 0) → 0 · (40<20 = 0) || (20>=20 = 1) → 1 · j−20 = 0, !0 → 1 · 30>20 is 1, !1 → 0' },
    { t: 'out', q: 'Program 2. What does it print?', code: R`char username = 'a';
int password = 12345;
if (username == 'A') {
  if (password == 1345) printf("Login successful");
  else printf("Password is incorrect");
}
else printf("Username is incorrect");`, a: 'Username is incorrect',
      w: { 'Password is incorrect': "'a' (97) is not 'A' (65), so the outer if is false and the inner if is never checked.", 'Login successful': 'Neither condition is true here.' } },
    { t: 'out', q: 'Program 4 with input 8. What does it print?', code: R`char c = '8';
if ((c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z'))
  printf("alphabetic");
else if (c >= '0' && c <= '9')
  printf("digit");
else printf("special");`, a: 'digit' },
    { t: 'out', q: 'Program 4 with input &. What does it print?', code: R`char c = '&';
if ((c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z'))
  printf("alphabetic");
else if (c >= '0' && c <= '9')
  printf("digit");
else printf("special");`, a: 'special' },
    { t: 'out', q: 'Program 4 with input Q. What does it print?', code: R`char c = 'Q';
if ((c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z'))
  printf("alphabetic");
else if (c >= '0' && c <= '9')
  printf("digit");
else printf("special");`, a: 'alphabetic' },
  ]},

  // ───────────────────────────────────────── 2.5
  { id: 'u2-switch', title: 'switch: the rules', slides: '15–17', mins: 5, items: [
    { t: 'learn', h: 'switch: jump to a case, then fall until break',
      code: R`switch (grade)
{
  case 'A':
    printf("Excellent!\n");
    break;
  case 'B':
  case 'C':
    printf("Well done\n");
    break;
  default:
    printf("Invalid grade\n");
}`,
      key: 'switch jumps to the matching case label, then executes **every statement below it** until it reaches a **break** or the closing brace.',
      rule: `• Labels are **unique constants**: int or char only
• **No** floats, **no** variables, **no** strings
• Each label ends with a **colon :**
• At most **one default** (optional)
• Cases can share one break ('B' and 'C' above)
• Nesting, and if inside a case, are allowed. { } inside a case are optional.` },
    { t: 'trace', h: 'Trace the grade switch', id: 'switchgrade' },
    { t: 'mcq', q: 'Which of these is a legal case label?',
      o: [["case 'A':", 'Correct: a char constant.'], ['case 2.5:', 'Floats are not allowed as labels.'],
          ['case x:', 'Variables are not allowed: labels must be constants.'], ['case "A":', 'Strings are not allowed.']], a: 0 },
    { t: 'mcq', q: 'Is `case 3+1:` allowed?',
      o: [['Yes: 3+1 is a constant (4)', 'Correct. A constant expression is fine. It just has to be known before the program runs.'],
          ['No: no maths in labels', 'Constant expressions such as 3+1 are allowed. Only variables, floats and strings are banned.']], a: 0 },
    { t: 'mcq', q: 'How many `default:` labels can a switch have?',
      o: [['At most one (it is optional)', 'Correct.'], ['Exactly one, always', 'default is optional.'], ['As many as you like', 'Only one is allowed.']], a: 0 },
    { t: 'mcq', q: 'What must come right after a case label?',
      o: [['A colon :', "Correct: case 'A':"], ['A semicolon ;', 'Labels end with a colon, not a semicolon.'], ['Curly brackets { }', '{ } inside a case are optional.']], a: 0 },
    { t: 'out', q: 'Drill program 1. What does it print?', code: R`int num = 2;
switch ((num + 2) % 3) {
  case 1: printf("Case1: %d", num);
    break;
  case 2: printf("Case2: %d", num);
    break;
  default: printf("Default: %d", num);
}`, a: 'Case1: 2', trace: 'switchmod',
      w: { 'Case1: 1': 'It jumps to case 1 because (2+2)%3 = 1, but it PRINTS num, which is 2.', 'Case2: 2': '(2+2)%3 = 4%3 = 1, not 2.' } },
    { t: 'out', q: "Drill program 2: grade = 'B'. What does it print?", code: R`char grade = 'B';
switch (grade)
{
  case 'A':
    printf("Excellent!\n");
    break;
  case 'B':
  case 'C':
    printf("Well done\n");
    break;
  default:
    printf("Invalid grade\n");
}
printf("Your grade is %c\n", grade);`, a: 'Well done\nYour grade is B', trace: 'switchgrade',
      w: { 'Your grade is B': "'B' has no code of its own, so it falls into 'C' and prints Well done." } },
    { t: 'out', q: 'Drill program 4. Input: 178.99 - 326.8', code: R`float v1, v2;
char op;
scanf("%f %c %f", &v1, &op, &v2);
switch (op) {
  case '+': printf("%.2f", v1 + v2); break;
  case '-': printf("%.2f", v1 - v2); break;
}`, stdin: '178.99 - 326.8', a: '-147.81', x: '178.99 − 326.8 = −147.81, printed with 2 decimals.' },
    { t: 'out', q: "grade = 'F'. What does it print?", code: R`char grade = 'F';
switch (grade)
{
  case 'A':
    printf("Excellent!\n");
    break;
  case 'B':
  case 'C':
    printf("Well done\n");
    break;
  default:
    printf("Invalid grade\n");
}`, a: 'Invalid grade' },
  ]},

  // ───────────────────────────────────────── 2.6 WEAK
  { id: 'u2-fall', title: 'switch fall-through', weak: true, slides: '15–17, 56', mins: 6, items: [
    { t: 'learn', h: 'The 2-step rule',
      p: `**Step 1 · JUMP.** Work out the switch value, then jump to the case with that value. No match → jump to **default**. No default → skip the whole switch.
**Step 2 · FALL.** From there, run **every line below**, straight through any other case labels (they are **not checked** again), until a **break** or the closing **}**.`,
      trap: 'A missing break means the next case\'s code also runs, **without checking its label**.' },
    { t: 'trace', h: 'Trace a fall-through', id: 'switchfall', p: 'n = 2: watch it jump to case 2, then fall into case 3.' },
    { t: 'out', q: 'Drill program 3. What does it print?', code: R`int n = 2;
switch (n) {
  case 1: printf("one ");
  case 2: printf("two ");
  case 3: printf("three ");
    break;
  default: printf("other");
}`, a: 'two three', trace: 'switchfall',
      w: { 'two': 'Case 2 has no break, so it falls into case 3 and prints "three " too.',
           'two three other': 'The break after "three " stops it before default.',
           'one two three': 'It JUMPS straight to case 2. Case 1 above it never runs.' },
      again: { t: 'out', q: 'Same switch, n = 1. What does it print?', code: R`int n = 1;
switch (n) {
  case 1: printf("one ");
  case 2: printf("two ");
  case 3: printf("three ");
    break;
  default: printf("other");
}`, a: 'one two three', w: { 'one': 'No break after case 1, so it keeps falling until the break after "three ".' } } },
    { t: 'out', q: "g = 'a'. What does it print?", code: R`char g = 'a';
switch (g) {
  case 'a': printf("A");
  case 'b': printf("B");
  case 'c': printf("C");
    break;
  default: printf("X");
}`, a: 'ABC', w: { 'A': "No break after case 'a', so B and C also print.", 'ABCX': 'The break after C stops it.' } },
    { t: 'out', q: 'default can sit in the middle. x = 3. What does it print?', code: R`int x = 3;
switch (x) {
  case 1: printf("1");
  case 3: printf("3");
  default: printf("D");
  case 4: printf("4");
}`, a: '3D4',
      w: { '3': 'No breaks at all, so it falls through default AND case 4.', '3D': 'case 4 is below default, so it falls into it too.' },
      again: { t: 'out', q: 'Same switch, x = 7. What does it print?', code: R`int x = 7;
switch (x) {
  case 1: printf("1");
  case 3: printf("3");
  default: printf("D");
  case 4: printf("4");
}`, a: 'D4', w: { 'D': 'No match → jump to default, then fall into case 4.' } } },
    { t: 'out', q: 'No match and no default. What does it print?', code: R`switch (5) {
  case 1: printf("one ");
    break;
  case 2: printf("two ");
}
printf("end");`, a: 'end' },
    { t: 'out', q: 'Shared cases. x = 2. What does it print?', code: R`int x = 2;
switch (x) {
  case 1:
  case 2: printf("small ");
    break;
  case 3: printf("three ");
  default: printf("big");
}`, a: 'small',
      again: { t: 'out', q: 'Same switch, x = 3. What does it print?', code: R`int x = 3;
switch (x) {
  case 1:
  case 2: printf("small ");
    break;
  case 3: printf("three ");
  default: printf("big");
}`, a: 'three big', w: { 'three': 'No break after case 3, so it falls into default.' } } },
    { t: 'mcq', q: 'After the switch has jumped to a case, does C check the labels below it?',
      o: [['No: it runs everything below until break or }', 'Correct. Labels are only entry points.'],
          ['Yes: it runs only the cases that match', 'This is the fall-through trap: later labels are NOT checked.']], a: 0 },
    { t: 'bug', q: 'This should print only "one" when x is 1. Tap the line that needs fixing.', code: R`switch (x) {
  case 1: printf("one");
  case 2: printf("two");
}`, a: 1, fix: 'case 1: printf("one"); break;', x: 'Without break, case 1 falls into case 2 and also prints "two".',
      w: { 0: 'switch (x) { is correct.', 2: 'Case 2 is the last case, so it does not need a break.', 3: 'The closing brace is fine.' } },
  ]},
  ]
});
})();
