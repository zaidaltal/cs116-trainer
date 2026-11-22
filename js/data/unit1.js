// Unit 1 · C basics, data types, arithmetic, type conversion (deck slides 3–10)
// Item types: learn, steps, trace, mcq, out, num, fill, bug, grid. See README.md for the format.
(() => {
const R = String.raw;
CS116.unit({
  id: 'u1', title: 'C basics, types & arithmetic', sub: 'Lectures 1–2 · slides 3–10',
  lessons: [

  // ───────────────────────────────────────── 1.1
  { id: 'u1-first', title: 'Your first program', slides: '4', mins: 3, items: [
    { t: 'learn', h: 'Anatomy of a C program',
      code: R`#include <stdio.h>
int main(void)
{
  /* My first program */
  printf("Assalamu Aleikom\n");
  return 0;
}`, out: 'Assalamu Aleikom',
      p: `**#include <stdio.h>** borrows ready-made commands such as \`printf\`.
**main** is where the program starts and ends.
**void** inside the brackets means main takes no inputs.
**return 0** tells the system "finished OK". A non-zero value means an error.`,
      key: 'Every statement ends with **;**. Comments (`/* … */` or `// …`) do not need one.' },
    { t: 'mcq', q: 'What does `return 0;` at the end of main mean?',
      o: [['The program finished OK', 'Correct. 0 = success. Any non-zero value signals an error.'],
          ['It prints 0 on the screen', '`return` never prints anything. Only printf prints.'],
          ['The program had an error', 'The opposite: errors are signalled with a NON-zero value.'],
          ['main starts again from the top', 'return ends main; nothing restarts.']], a: 0 },
    { t: 'mcq', q: 'Why do we write `#include <stdio.h>`?',
      o: [['To use ready-made commands like printf and scanf', 'Correct. stdio = standard input/output.'],
          ['To start the program', 'The program starts at main, not at #include.'],
          ['To declare variables', 'Variables are declared with types like int, not with #include.'],
          ['It is a comment', 'Comments use /* */ or //. #include is a real instruction to the compiler.']], a: 0 },
    { t: 'learn', h: 'C rules that affect your code',
      table: [['Fact', 'Answer'], ['Level', '"mid-level" (close to hardware)'],
              ['Every statement ends with', '; (comments don\'t)'],
              ['Case sensitive?', 'Yes: x and X differ'], ['Comments', '/* … */ or // …']],
      p: 'Language levels, top to bottom: **scripting** (Python) → **mid/high** (C, C++) → **assembly** (MOV EAX, 5) → **machine** (binary) → hardware.' },
    { t: 'mcq', q: 'C is usually described as a…',
      o: [['mid-level language', 'Correct: high-level syntax, but close to the hardware.'],
          ['scripting language', 'Scripting languages are higher, like Python.'],
          ['assembly language', 'Assembly is lower (MOV EAX, 5).'],
          ['machine language', 'Machine language is binary, the lowest level.']], a: 0 },
    { t: 'mcq', q: 'Which of these does NOT need a semicolon at the end?',
      o: [['/* print the result */', 'Correct: comments are ignored by the compiler and never need ;.'],
          ['printf("Hi")', 'A statement: it must end with ;.'],
          ['return 0', 'A statement: it must end with ;.'],
          ['int x = 5', 'A declaration is a statement: it needs ;.']], a: 0 },
    { t: 'mcq', q: '`int x = 1, X = 2;`: what happens?',
      o: [['Two different variables are created', 'Correct. C is case sensitive: x and X are different names.'],
          ['Error: x is declared twice', 'x and X are not the same name, because C is case sensitive.'],
          ['X overwrites x, so both are 2', 'They are separate boxes in memory.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 1.2
  { id: 'u1-types', title: 'Types, printf codes & escapes', slides: '5', mins: 5, items: [
    { t: 'learn', h: 'Types and format codes',
      table: [['Type', 'Holds', 'printf / scanf code'], ['int', 'whole number', '%d or %i'], ['float', 'decimal (single)', '%f (6 decimals)'],
              ['double', 'decimal (double)', '%f / %lf'], ['char', 'one character, 1 byte', '%c'], ['void', '"no type"', '–'],
              ['string', 'text', '%s'], ['–', 'a % sign', '%%']],
      rule: '`%.2f` prints exactly 2 decimals. Plain `%f` ALWAYS prints 6 decimals.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%f", 2.5);`, a: '2.500000',
      w: { '2.5': '%f always shows 6 decimals: 2.500000.' }, x: '%f → 6 decimals.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%.2f", 3.14159);`, a: '3.14',
      w: { '3.141590': 'That is %f. %.2f keeps 2 decimals.', '3.15': '3.14159 rounds to 3.14 (the next digit is 1).' } },
    { t: 'out', q: 'What does this print?', code: R`printf("50%%");`, a: '50%',
      w: { '50%%': '%% inside printf is the code for ONE % sign.' } },
    { t: 'mcq', q: 'Which format code prints a single character?',
      o: [['%c', 'Correct.'], ['%s', '%s prints a whole string.'], ['%d', '%d prints an int (for a char it shows its ASCII number).'], ['%f', '%f is for float.']], a: 0 },
    { t: 'learn', h: 'Escape sequences',
      table: [['Code', 'Meaning'], ['\\n', 'new line'], ['\\t', 'tab'], ['\\b', 'backspace (cursor back one place)'], ['\\a', 'beep'],
              ['\\r', 'carriage return (back to the start of the line)'], ['\\\\  \\\'  \\"', 'print \\  \'  "']],
      trap: '`\\b` is not printed as a letter: it moves the cursor back, and the next characters **overwrite** what was there.' },
    { t: 'out', q: 'What appears on the console?', code: R`printf("Salam Shabab\b\b\b\bAAA");`, a: 'Salam ShAAAb', alt: ['Salam ShAAA'],
      x: 'The four \\b move the cursor back 4 places, to just after "Salam Sh". "AAA" overwrites "aba". The deck writes the answer as **Salam ShAAA**. On a real console the final "b" is still visible, because \\b moves back without erasing. Both answers are accepted here.' },
    { t: 'out', q: 'What does this print?', code: R`printf("A\tB\nC");`, a: 'A\tB\nC',
      x: '\\t is a tab between A and B; \\n starts a new line before C.' },
    { t: 'mcq', q: 'How do you print one backslash \\ ?',
      o: [[R`printf("\\");`, 'Correct: \\\\ is the escape for one backslash.'], [R`printf("\");`, 'A single \\ starts an escape: \\" means a quote, so the string never ends.'],
          [R`printf("/");`, 'That is a forward slash.']], a: 0 },
    { t: 'out', q: '`\'3\'` is a char, not the number 3. What is printed?', code: R`char x = '3';
printf("%d", x);`, a: '51',
      w: { '3': "'3' is the CHARACTER 3. %d shows its ASCII code, which is 51." },
      x: "char x = '3'; is legal: it stores the ASCII value 51." },
    { t: 'mcq', q: 'Which declaration is correct?',
      o: [['char grade = \'A\';', 'Correct.'], ['Char grade = \'A\';', 'Keywords are lowercase: Char is not a type.'],
          ['Int count = 0;', 'Keywords are lowercase: Int is not the type int.'], ['int count = 0', 'The semicolon is missing.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 1.3 WEAK
  { id: 'u1-names', title: 'Variable naming rules', weak: true, slides: '5', mins: 5, items: [
    { t: 'learn', h: 'The 5 naming rules (learn them word for word)',
      p: `**1.** Only **letters, digits and _** (underscore). No spaces, no $, no -, no other symbols.
**2.** It must **not start with a digit**. It may start with a letter or with _.
**3.** It must **not be a keyword**: int, char, float, double, long, if, else, for, while, do, switch, case, break, continue, return, void…
**4.** C is **case sensitive**: count, Count and COUNT are three different names.
**5.** Keywords are all **lowercase**, so Int and Char are NOT the types int and char.`,
      table: [['Name', 'Valid?', 'Why'], ['_count', '✔', 'starts with _ (allowed)'], ['comp3', '✔', 'digit is fine after the first character'],
              ['comp_fund', '✔', 'letters + _'], ['2ndValue', '✘', 'starts with a digit'], ['comp$fund', '✘', '$ not allowed'],
              ['my value', '✘', 'space not allowed'], ['first-name', '✘', '- is not allowed (C reads it as minus)'], ['int', '✘', 'keyword']] },
    { t: 'mcq', q: 'Is `_count` a valid variable name?',
      o: [['Valid', 'Correct: a name may START with an underscore. Rule 2 only bans a leading DIGIT.'],
          ['Invalid', 'An underscore is allowed anywhere, including first. Only a leading digit is banned.']], a: 0,
      again: { t: 'mcq', q: 'Is `_x9` a valid variable name?',
        o: [['Valid', 'Correct: starts with _, then a letter and a digit. All allowed.'], ['Invalid', '_ may come first; digits may come after the first character.']], a: 0 } },
    { t: 'mcq', q: 'Is `2ndValue` a valid variable name?',
      o: [['Invalid', 'Correct: it STARTS with a digit (rule 2).'],
          ['Valid', 'Digits are allowed, but never as the FIRST character. second_value or value2 would work.']], a: 0,
      again: { t: 'mcq', q: 'Is `3comp` a valid variable name?',
        o: [['Invalid', 'Correct: a leading digit is not allowed.'], ['Valid', 'It starts with the digit 3, which breaks rule 2. comp3 would be fine.']], a: 0 } },
    { t: 'mcq', q: 'Is `comp$fund` a valid variable name?',
      o: [['Invalid', 'Correct: $ is not a letter, digit or underscore.'], ['Valid', 'Only letters, digits and _ are allowed. $ is a symbol.']], a: 0,
      again: { t: 'mcq', q: 'Is `total$` a valid variable name?', o: [['Invalid', 'Correct: $ is not allowed anywhere.'], ['Valid', '$ is not a letter, digit or _.']], a: 0 } },
    { t: 'mcq', q: 'Is `comp_fund` a valid variable name?',
      o: [['Valid', 'Correct: letters and an underscore.'], ['Invalid', 'Underscores are allowed anywhere in a name.']], a: 0 },
    { t: 'mcq', q: 'Is `int` a valid variable name?',
      o: [['Invalid', 'Correct: int is a keyword (rule 3).'], ['Valid', 'Keywords are reserved by C and cannot be used as names.']], a: 0,
      again: { t: 'mcq', q: 'Is `while` a valid variable name?', o: [['Invalid', 'Correct: while is a keyword.'], ['Valid', 'while is a reserved keyword (it starts a loop).']], a: 0 } },
    { t: 'mcq', q: 'Is `comp3` a valid variable name?',
      o: [['Valid', 'Correct: the digit comes AFTER the first character.'], ['Invalid', 'Digits are fine, just not first.']], a: 0 },
    { t: 'mcq', q: 'Is `my value` a valid variable name?',
      o: [['Invalid', 'Correct: spaces are not allowed. Use my_value.'], ['Valid', 'A space would split it into two words.']], a: 0 },
    { t: 'mcq', q: 'Is `first-name` a valid variable name?',
      o: [['Invalid', 'Correct: - is the minus operator. C would read first minus name.'], ['Valid', 'Only _ is allowed as a separator, not -.']], a: 0 },
    { t: 'mcq', q: 'Which one is a valid name?',
      o: [['_total3', 'Correct: _ first, then letters and a digit.'], ['3total', 'Starts with a digit.'], ['total$', '$ is not allowed.'], ['char', 'char is a keyword.']], a: 0,
      again: { t: 'mcq', q: 'Which one is a valid name?',
        o: [['value_2', 'Correct.'], ['2value', 'Starts with a digit.'], ['value-2', '- is not allowed.'], ['float', 'Keyword.']], a: 0 } },
    { t: 'mcq', q: 'Which one is NOT a valid name?',
      o: [['2ndValue', 'Correct: leading digit.'], ['_count', 'Valid: a leading underscore is fine.'], ['secondValue', 'Valid: letters only.'], ['value_2nd', 'Valid: the digit is not first.']], a: 0 },
    { t: 'mcq', q: '`Int x = 5;`: does this compile?',
      o: [['No: the type keyword is int (lowercase)', 'Correct. C is case sensitive, so Int is not the type int.'],
          ['Yes', 'Int with a capital I is not a type, so this is an error.']], a: 0 },
    { t: 'bug', q: 'Tap the line with the mistake.', code: R`int count = 0;
int 2nd = 3;
float avg = 0;`, a: 1, fix: 'int second = 3;',
      x: 'A name cannot start with a digit. 2nd is illegal; second or value2 is fine.',
      w: { 0: 'count is a valid name and the line ends with ;.', 2: 'avg is valid, and float is lowercase.' } },
  ]},

  // ───────────────────────────────────────── 1.4
  { id: 'u1-arith', title: 'Arithmetic: the 3 rules', slides: '6', mins: 5, items: [
    { t: 'steps', h: 'Rule 1 · Order', p: '**\\* / %** first, then **+ −**. On the same level, work **left to right**.',
      code: '6 + 25 / 5 * 2', steps: ['6 + 25 / 5 * 2', '= 6 + 5 * 2    ← 25/5 first (leftmost of * / %)', '= 6 + 10       ← then 5*2', '= 16'],
      check: R`printf("%d", 6 + 25 / 5 * 2);` },
    { t: 'learn', h: 'Rule 2 · int ÷ int = int',
      p: 'When **both** sides are int, the decimals are **chopped off**: not rounded, just cut towards 0.',
      code: R`printf("%d %d %d", 7 / 2, 25 / 2 * 2, -150 / 100);`, out: '3 24 -1',
      trap: '-150 / 100 is **-1**, not -2: C chops towards zero.' },
    { t: 'learn', h: 'Rule 3 · % = remainder',
      p: '% gives what is left over after whole division. It works on ints only.',
      code: R`printf("%d %d %d", 25 % 7, 25 % 5, 8 % 2 == 0);`, out: '4 0 1',
      key: 'Integer division gives the quotient (7/2 = **3**); % gives the remainder (7%2 = **1**). They always rebuild the number: **a/b*b + a%b == a**.' },
    { t: 'mcq', q: '`7 / 2` with ints gives…',
      o: [['3', 'Correct: int ÷ int chops the .5 off.'], ['3.5', 'Both are ints, so the result is an int. You would need 7.0/2.'],
          ['4', 'C never rounds integer division; it chops.'], ['3.0', 'An int has no decimal part at all.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 25 / 2 * 2);`, a: '24',
      w: { '25': '25/2 is 12 (chopped), then 12*2 = 24. The lost .5 never comes back.' }, x: '25/2 = 12, then 12*2 = 24.' },
    { t: 'num', q: 'What is `25 % 7`?', a: 4, w: { 3: '25/7 = 3 is the quotient. % asks for the remainder: 25 − 21 = 4.' },
      run: { code: R`printf("%d", 25 % 7);`, expect: '4' } },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", -150 / 100);`, a: '-1',
      w: { '-2': 'C chops towards zero: -1.5 becomes -1, not -2.', '-1.5': 'Both are ints, so the result is an int.' } },
    { t: 'num', q: 'What is `17 % 5`?', a: 2, w: { 3: '17/5 = 3 is the quotient; the remainder is 17 − 15 = 2.' },
      run: { code: R`printf("%d", 17 % 5);`, expect: '2' } },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 10 - 4 / 2 * 3);`, a: '4',
      w: { '9': 'You did (10-4)/2*3. * and / come before −: 4/2 = 2, 2*3 = 6, 10 − 6 = 4.', '18': 'Do / and * before −.' },
      x: '4/2 = 2 → 2*3 = 6 → 10 − 6 = 4.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 25 / 7 * 7 + 25 % 7);`, a: '25',
      x: 'a/b*b + a%b == a: 25/7 = 3, 3*7 = 21, 25%7 = 4, 21 + 4 = 25.' },
    { t: 'mcq', q: 'Which expression gives 3.5?',
      o: [['7.0 / 2', 'Correct: one side is a float, so real division happens.'], ['7 / 2', 'int ÷ int = 3.'],
          ['7 % 2', 'That is the remainder: 1.']], a: 0,
      run: { code: R`printf("%.1f %d %d", 7.0 / 2, 7 / 2, 7 % 2);`, expect: '3.5 3 1' } },
  ]},

  // ───────────────────────────────────────── 1.5
  { id: 'u1-drill', title: 'Arithmetic drill', slides: '7–8', mins: 4, items: [
    { t: 'out', q: 'Line 1 of the drill. What does it print?', code: R`int a = 25, b = 2;
printf("%i\n", 6 + a / 5 * b);`, a: '16',
      w: { '17': 'You probably did 6 + 25/10. Work left to right: a/5 = 5 first, then 5*b = 10, then 6 + 10.' }, x: '25/5 = 5 → 5*2 = 10 → 6 + 10 = 16.' },
    { t: 'out', q: 'What does it print?', code: R`int a = 25, b = 2;
printf("%i\n", a / b * b);`, a: '24',
      w: { '25': 'a/b = 25/2 = 12 (chopped). 12*2 = 24.' } },
    { t: 'out', q: 'Now with floats. What does it print?', code: R`float c = 25.0, d = 2.0;
printf("%f\n", c / d * d);`, a: '25.000000',
      w: { '25': '%f always prints 6 decimals.', '24.000000': 'These are floats, so 25.0/2.0 = 12.5 (nothing is chopped). 12.5*2 = 25.0.' },
      x: 'Floats keep decimals: 12.5 * 2.0 = 25.0 → %f prints 25.000000.' },
    { t: 'out', q: 'What does it print?', code: R`int a = 25;
printf("%i\n", -a);`, a: '-25' },
    { t: 'out', q: 'Three remainders. What does it print?', code: R`int a2 = 25, e = 5, g = 10, h = 7;
printf("%i %i %i\n", a2 % e, a2 % g, a2 % h);`, a: '0 5 4',
      x: '25%5 = 0 · 25%10 = 5 · 25%7 = 4.' },
    { t: 'out', q: 'What does it print?', code: R`int a2 = 25, h = 7;
printf("%i\n", a2 / h * h + a2 % h);`, a: '25', x: '21 + 4 = 25 (the a/b*b + a%b rule).' },
    { t: 'out', q: 'What does it print?', code: R`int x = 7, y = 2;
printf("%d %d\n", x / y, x % y);`, a: '3 1' },
  ]},

  // ───────────────────────────────────────── 1.6 WEAK
  { id: 'u1-intfloat', title: 'int ÷ int stored in a float', weak: true, slides: '8, 47', mins: 6, items: [
    { t: 'learn', h: 'The rule: the division decides first, the box decides later',
      p: `C works out the right-hand side **first**, using only the types of the two numbers being divided. Only **after that** does it look at where the result is stored.
\`float f = 7 / 2;\` happens in two steps:
**Step 1.** 7 / 2: both are int → int division → **3** (the .5 is gone forever).
**Step 2.** Store 3 into the float f → **3.0**. printf("%f") shows **3.000000**.`,
      rule: 'To keep the decimals, at least ONE side of the / must be a float **before** dividing: `7.0 / 2`, `7 / 2.0` or `(float) 7 / 2`.' },
    { t: 'trace', h: 'Watch it happen', id: 'intdiv', p: 'Click **Next line** and watch f. It gets 3.0, not 3.5, on the `f = x / y;` line.' },
    { t: 'out', q: 'What does this print?', code: R`float f = 7 / 2;
printf("%f", f);`, a: '3.000000', trace: 'intdiv',
      w: { '3.500000': '7 / 2 is int ÷ int = 3 BEFORE it reaches f. f only ever receives 3.',
           '3.5': '7/2 = 3 first (int division), and %f prints 6 decimals: 3.000000.',
           '3': 'f is a float, and %f always prints 6 decimals: 3.000000.' },
      again: { t: 'out', q: 'Same trap, new numbers. What does this print?', code: R`float g = 9 / 4;
printf("%.2f", g);`, a: '2.00',
        w: { '2.25': '9 / 4 is int ÷ int = 2 first. Then 2 is stored as 2.0 → 2.00.' } } },
    { t: 'mcq', q: 'Which one prints 3.5?',
      o: [['printf("%.1f", (float) 7 / 2);', 'Correct: the cast makes 7 into 7.0 BEFORE the division.'],
          ['printf("%.1f", (float) (7 / 2));', 'The brackets divide first (7/2 = 3), and only then cast: 3.0.'],
          ['float f = 7 / 2; printf("%.1f", f);', 'int ÷ int = 3 happens first, so f = 3.0.']], a: 0,
      run: { code: R`printf("%.1f %.1f", (float) 7 / 2, (float) (7 / 2));`, expect: '3.5 3.0' } },
    { t: 'out', q: 'Average of two ints. What does this print?', code: R`int sum = 7, n = 2;
float avg = sum / n;
printf("%.2f", avg);`, a: '3.00',
      w: { '3.50': 'sum / n is int ÷ int = 3 before it is stored. You need (float) sum / n.' },
      again: { t: 'out', q: 'What does this print?', code: R`int sum = 10, n = 4;
float avg = sum / n;
printf("%.2f", avg);`, a: '2.00', w: { '2.50': '10 / 4 is int ÷ int = 2 first, so avg = 2.00.' } } },
    { t: 'out', q: 'Now with the cast. What does this print?', code: R`int sum = 7, n = 2;
float avg = (float) sum / n;
printf("%.2f", avg);`, a: '3.50', x: '(float) sum turns 7 into 7.0 first, so 7.0 / 2 = 3.5.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%f", 7 / 2.0);`, a: '3.500000',
      w: { '3.000000': '2.0 is a float, so this is real division: 3.5.' } },
    { t: 'fill', q: 'Fill the blank so avg gets 3.5 (sum = 7, n = 2).', code: R`avg = [[0]] sum / n;`, b: [['(float)']],
      pre: 'int sum = 7, n = 2; float avg;', run: { post: R`printf("%.1f", avg);`, expect: '3.5' },
      x: 'Cast one side BEFORE dividing: (float) sum / n.' },
    { t: 'out', q: 'What does this print?', code: R`float f = 10 / 4;
printf("%f", f);`, a: '2.000000',
      w: { '2.500000': '10 / 4 is int ÷ int = 2 first. f receives 2.0.' } },
    { t: 'out', q: 'Going the other way: a decimal into an int.', code: R`int i = 3.99;
printf("%d", i);`, a: '3',
      w: { '4': 'float → int CHOPS the decimals. It never rounds.' } },
    { t: 'mcq', q: '`float f = 7.0 / 2;`: what is in f?',
      o: [['3.5', 'Correct: 7.0 is a float, so the division keeps decimals.'],
          ['3.0', 'That would be 7 / 2. Here one side is 7.0.'], ['3', 'f is a float and the division is real.']], a: 0,
      run: { code: R`float f = 7.0 / 2; printf("%.1f", f);`, expect: '3.5' } },
    { t: 'out', q: 'Last check. What does this print?', code: R`int x = 9, y = 2;
float a = x / y, b = (float) x / y;
printf("%.1f %.1f", a, b);`, a: '4.0 4.5',
      w: { '4.5 4.5': 'a = x / y is int ÷ int = 4 first, so a = 4.0. Only b has the cast.', '4.0 4.0': 'b casts x to float BEFORE dividing, giving 4.5.' } },
  ]},

  // ───────────────────────────────────────── 1.7
  { id: 'u1-cast', title: 'Type conversion & casting', slides: '9', mins: 4, items: [
    { t: 'learn', h: 'Conversions you must know',
      table: [['Code (f1, f2 float · i1, i2 int · i2 = -150)', 'Result', 'Why'],
              ['i1 = 123.125;', '123', 'float → int: decimals chopped'], ['f1 = i2;', '-150.000000', 'int → float: adds .000000'],
              ['f1 = i2 / 100;', '-1.000000', 'int/int = -1, then stored as float'], ['f2 = i2 / 100.0;', '-1.500000', '100.0 is a float → real division'],
              ['f2 = (float) i2 / 100;', '-1.500000', 'the cast turns i2 into a float first'], ['f = 70.0 / 3.0;', '23.333334', 'floats aren\'t perfectly exact']],
      key: 'A cast such as **(float)** converts a value for that ONE expression only. The variable keeps its declared type.',
      rule: 'Average of ints: **avg = (float) sum / n;** Without the cast you lose the decimals.' },
    { t: 'out', q: 'What does this print?', code: R`int i1;
i1 = 123.125;
printf("%d", i1);`, a: '123' },
    { t: 'out', q: 'What does this print?', code: R`int i2 = -150;
float f1;
f1 = i2;
printf("%f", f1);`, a: '-150.000000', w: { '-150': 'f1 is a float, and %f prints 6 decimals.' } },
    { t: 'out', q: 'What does this print?', code: R`int i2 = -150;
float f1;
f1 = i2 / 100;
printf("%f", f1);`, a: '-1.000000',
      w: { '-1.500000': 'i2 / 100 is int ÷ int = -1 before it is stored.', '-2.000000': 'C chops towards zero: -1.5 → -1.' } },
    { t: 'out', q: 'What does this print?', code: R`int i2 = -150;
float f2;
f2 = i2 / 100.0;
printf("%f", f2);`, a: '-1.500000', w: { '-1.000000': '100.0 is a float, so this is real division.' } },
    { t: 'out', q: 'What does this print?', code: R`int i2 = -150;
float f2;
f2 = (float) i2 / 100;
printf("%f", f2);`, a: '-1.500000' },
    { t: 'out', q: 'What does this print?', code: R`float f = 70.0 / 3.0;
printf("%f", f);`, a: '23.333334',
      w: { '23.333333': 'Floats are not perfectly exact. The stored value is a tiny bit above 23.333333, so it prints 23.333334.' },
      x: 'This is the lecture\'s example: floats aren\'t perfectly exact.' },
    { t: 'mcq', q: '`int n = 5; float r = (float) n / 2;`: after this line, what type is n?',
      o: [['Still int', 'Correct: the cast only affects that one expression.'], ['float', 'A cast never changes the declared type of a variable.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 1.8
  { id: 'u1-logic', title: 'True/false & logical operators', slides: '10', mins: 5, items: [
    { t: 'learn', h: 'The big rule',
      p: '**0 = false.** **Any non-zero = true** (5, -3 and 100 are all true).\nA comparison always produces **1** (true) or **0** (false), never the words true/false.',
      table: [['Operator', 'Meaning', 'Example → result'], ['==', 'equal', '10 == 10 → 1'], ['!=', 'not equal', '3 != 3 → 0'],
              ['&&', 'AND (both)', '1 && 0 → 0'], ['||', 'OR (either)', '1 || 0 → 1'], ['!', 'NOT (flip)', '!0 → 1, !7 → 0']],
      key: '&& is true only if **both** sides are true. || is true if **at least one** side is true. ! inverts.' },
    { t: 'out', q: 'What does this print?', code: R`printf("%d", 5 > 3);`, a: '1',
      w: { 'true': 'C prints numbers: a true comparison gives 1.' } },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %d", !0, !7);`, a: '1 0',
      w: { '1 -7': '! does not negate the number. It flips truth: 7 is true, so !7 is 0.', '0 1': '!0: 0 is false, flipped is true → 1. !7: 7 is true → 0.' } },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %d", 1 && 0, 0 || 7);`, a: '0 1',
      w: { '0 7': '|| gives 1 or 0, never the operand itself.' } },
    { t: 'out', q: 'What does this print?', code: R`printf("%d %d", 10 == 10, 3 != 3);`, a: '1 0' },
    { t: 'learn', h: '_Bool and bool',
      p: '**_Bool** holds only 0 or 1. Storing 0 gives 0. Storing **any non-zero** (5, -3) gives **1**.\n**bool** needs `#include <stdbool.h>` and lets you write the words **true** / **false**. Printed with %d, it shows 1 / 0.' },
    { t: 'out', q: 'What does this print?', code: R`_Bool b = 5;
printf("%d", b);`, a: '1', w: { '5': '_Bool can only hold 0 or 1. Any non-zero becomes 1.' } },
    { t: 'out', q: 'What does this print?', code: R`_Bool b = -3;
printf("%d", b);`, a: '1', w: { '0': '-3 is non-zero, so it is TRUE → 1.', '-3': '_Bool stores only 0 or 1.' } },
    { t: 'mcq', q: 'What do you need in order to use the words `bool`, `true` and `false`?',
      o: [['#include <stdbool.h>', 'Correct.'], ['#include <stdio.h>', 'stdio gives printf and scanf, not bool.'], ['Nothing, they are built in', '_Bool is built in; bool/true/false come from stdbool.h.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`bool ok = true;
printf("%d", ok);`, a: '1', w: { 'true': '%d prints the number: true is 1.' } },
    { t: 'mcq', q: 'Which value counts as TRUE in C?',
      o: [['-1', 'Correct: any non-zero value is true, negatives included.'], ['0', '0 is the only false value.']], a: 0 },
  ]},
  ]
});
})();
