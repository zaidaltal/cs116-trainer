// Unit 4 · Arrays: 1D & 2D (deck slides 34–44)
(() => {
const R = String.raw;
const A34 = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];
const X45 = [[10, 5, -3, 17, 82], [9, 0, 0, 8, -7], [3, 2, 2, 0, 10], [14, 0, 0, 8, 76]];
const A34_DECL = R`int a[3][4] = {
  {0, 1, 2, 3},
  {4, 5, 6, 7},
  {8, 9, 10, 11}
};`;
const X_DECL = 'int X[4][5] = {{10, 5, -3, 17, 82}, {9, 0, 0, 8, -7}, {3, 2, 2, 0, 10}, {14, 0, 0, 8, 76}};';
CS116.unit({
  id: 'u4', title: 'Arrays: 1D & 2D', sub: 'Lectures 9–10 · slides 34–44',
  lessons: [

  // ───────────────────────────────────────── 4.1
  { id: 'u4-arr', title: 'An array is a row of numbered boxes', slides: '35', mins: 5, items: [
    { t: 'learn', h: 'Numbered boxes',
      code: R`int age[5] = { 12, 7, 30, 4, 9 };`, array: { name: 'age', values: [12, 7, 30, 4, 9] },
      rule: `• Size 5 → indexes **0 to 4** (last = size − 1)
• Same type, stored **side by side** in memory
• Jump straight to any box: age[2] is 30
• Loop through all of them: for (i = 0; i < 5; i++)` },
    { t: 'mcq', q: '`int age[5];`: which indexes exist?',
      o: [['0 to 4', 'Correct: the last index is size − 1.'], ['1 to 5', 'C counts from 0, not 1.'], ['0 to 5', 'age[5] would be a 6th box, and there are only 5.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`int age[5] = { 12, 7, 30, 4, 9 };
printf("%d", age[2]);`, a: '30', w: { '7': 'age[2] is the THIRD box (0, 1, 2). 7 is age[1].' } },
    { t: 'out', q: 'What does this print?', code: R`int age[5] = { 12, 7, 30, 4, 9 };
printf("%d", age[1] + age[4]);`, a: '16', x: 'age[1] = 7, age[4] = 9.' },
    { t: 'learn', h: 'Array traps',
      trap: `• **age[5] does not exist** (out of bounds).
• int a[10] = {0, 1, 4}; → all the others are filled with **0**.
• char w[] = {'H','i'}; → the size is counted for you (**2**).
• No initialiser at all → in standard C the boxes hold **garbage**. (The lecture's run happened to show 0s.)` },
    { t: 'out', q: 'What does this print?', code: R`int a[10] = {0, 1, 4};
printf("%d %d", a[2], a[7]);`, a: '4 0', w: { '4 garbage': 'When SOME values are given, the rest become 0.' } },
    { t: 'mcq', q: "`char w[] = {'H', 'i'};`: what is the size of w?",
      o: [['2', 'Correct: the compiler counts the initial values.'], ['0', 'An empty [] means "count them for me".'], ['It does not compile', 'Leaving the size out is allowed when you give initial values.']], a: 0 },
    { t: 'mcq', q: '`int a[5];` with no initialiser. In standard C, the boxes contain…',
      o: [['garbage (unknown values)', 'Correct. Never rely on them being 0.'], ['all zeros, always', 'Only arrays with an initialiser such as {0} are guaranteed zero.'], ['a compile error', 'It compiles. The values are just unknown.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`int age[5] = { 12, 7, 30, 4, 9 };
for (i = 0; i < 5; i++)
  printf("%d ", age[i]);`, pre: 'int i;', a: '12 7 30 4 9' },
    { t: 'bug', q: 'This should set all 5 boxes to 0. Tap the buggy line.', code: R`int a[5];
for (i = 1; i <= 5; i++)
  a[i] = 0;`, a: 1, fix: 'for (i = 0; i < 5; i++)', x: 'Indexes are 0–4. This loop skips a[0] and writes to a[5], which does not exist.',
      w: { 0: 'Declaring int a[5]; is fine.', 2: 'a[i] = 0; is correct. The problem is which values i takes.' } },
  ]},

  // ───────────────────────────────────────── 4.2
  { id: 'u4-drill1', title: 'Array drill 1', slides: '36–37', mins: 5, items: [
    { t: 'trace', h: 'Fill the boxes', id: 'arrvalues', p: 'Watch each box change. --values[2] turns −100 into −101.' },
    { t: 'num', q: 'After this code, what is values[3]?', code: R`int values[10] = {0};
values[0] = 197;
values[2] = -100;
values[5] = 350;
values[3] = values[0] + values[5];
values[9] = values[5] / 10;
--values[2];`, a: 547, trace: 'arrvalues', run: { post: R`printf("%d", values[3]);`, expect: '547' } },
    { t: 'num', q: 'Same code: what is values[9]?', code: R`int values[10] = {0};
values[0] = 197;
values[2] = -100;
values[5] = 350;
values[3] = values[0] + values[5];
values[9] = values[5] / 10;
--values[2];`, a: 35, trace: 'arrvalues', run: { post: R`printf("%d", values[9]);`, expect: '35' } },
    { t: 'num', q: 'Same code: what is values[2]?', code: R`int values[10] = {0};
values[0] = 197;
values[2] = -100;
values[5] = 350;
values[3] = values[0] + values[5];
values[9] = values[5] / 10;
--values[2];`, a: -101, trace: 'arrvalues', w: { '-99': '-- SUBTRACTS 1: −100 − 1 = −101.', '-100': '--values[2] changes the box.' },
      run: { post: R`printf("%d", values[2]);`, expect: '-101' } },
    { t: 'out', q: 'Drill 2. What does it print?', code: R`for (i = 0; i < 10; i++)
  n[i] = i + 100;
printf("%d %d", n[0], n[9]);`, pre: 'int n[10], i;', a: '100 109', w: { '100 110': 'The last index is 9: n[9] = 9 + 100 = 109.' } },
    { t: 'out', q: 'Drill 3. What does it print?', code: R`int v[10] = { 0, 1, 4, 9, 16 };
for (i = 5; i < 10; ++i)
  v[i] = i * i;
for (i = 0; i < 10; i++)
  printf("%d ", v[i]);`, pre: 'int i;', a: '0 1 4 9 16 25 36 49 64 81', x: 'The first 5 are filled directly, the rest by the loop (i*i). Mixing both ways is fine.' },
    { t: 'out', q: 'Drill 4. What does it print?', code: R`int arr[5] = {2, 4, 6};
int s = 0;
for (i = 0; i < 5; i++)
  s += arr[i];
printf("%d %d", s, arr[4]);`, pre: 'int i;', a: '12 0', trace: 'arrsum', w: { '12 6': 'arr is {2, 4, 6, 0, 0}: missing values become 0.' } },
  ]},

  // ───────────────────────────────────────── 4.3
  { id: 'u4-patterns', title: 'The 4 array patterns', slides: '38', mins: 6, items: [
    { t: 'learn', h: 'Read n values · sum and average',
      code: R`for (i = 0; i < n; i++)
  scanf("%d", &a[i]);

sum = 0;
for (i = 0; i < n; i++)
  sum = sum + a[i];
avg = (float) sum / n;`, p: 'Read with **&a[i]**. Sum starts at 0. Average needs the **(float)** cast.' },
    { t: 'learn', h: 'Minimum (for maximum, change < to >)',
      code: R`min = a[0];
for (i = 0; i < n; i++)
  if (a[i] < min)
    min = a[i];`,
      key: 'Min/max search: assume the **first** element is the answer, compare every element against it, and replace it whenever a smaller (or larger) value is found.' },
    { t: 'fill', q: 'Complete the minimum search.', code: R`min = a[0];
for (i = 0; i < 5; i++)
  if (a[i] [[0]] min)
    min = [[1]];`, b: [['<', '<='], ['a[i]']],
      pre: 'int a[5] = {8, 3, 9, 1, 6}, i, min;', run: { post: R`printf("%d", min);`, expect: '1' } },
    { t: 'out', q: 'Maximum search. What does it print?', code: R`int a[4] = {3, 9, 2, 7}, i, max;
max = a[0];
for (i = 0; i < 4; i++)
  if (a[i] > max)
    max = a[i];
printf("%d", max);`, a: '9' },
    { t: 'out', q: 'Average with the cast. What does it print?', code: R`int a[4] = {4, 5, 6, 8}, i, sum = 0;
float avg;
for (i = 0; i < 4; i++)
  sum = sum + a[i];
avg = (float) sum / 4;
printf("%.2f", avg);`, a: '5.75', w: { '5.00': 'The cast (float) keeps the decimals: 23 / 4 = 5.75.' } },
    { t: 'out', q: 'Char array. What does it print?', code: R`char word[] = {'H','e','l','l','o','!'};
for (i = 0; i < 6; ++i)
  printf("%c", word[i]);`, pre: 'int i;', a: 'Hello!' },
    { t: 'mcq', q: 'Why does the min search start with `min = a[0]` instead of `min = 0`?',
      o: [['If every value is above 0, min = 0 would never be replaced and the answer would be wrong', 'Correct: start from a real element.'],
          ['min = 0 does not compile', 'It compiles; it just gives the wrong answer.'], ['It makes no difference', 'Try {5, 8, 3}: starting at 0 would "find" 0, which is not even in the array.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 4.4
  { id: 'u4-drill2', title: 'Array drill 2: interesting problems', slides: '39–40', mins: 5, items: [
    { t: 'trace', h: 'Each box = sum of the boxes before it', id: 'doubling', p: 'For i = 0, the check j < 0 is false straight away: the inner loop runs 0 times.' },
    { t: 'out', q: 'Problem 1. What does it print?', code: R`int numbers[10] = {1,0,0,0,0,0,0,0,0,0};
for (i = 0; i < 10; ++i)
  for (j = 0; j < i; ++j)
    numbers[i] += numbers[j];
for (i = 0; i < 10; ++i)
  printf("%i ", numbers[i]);`, pre: 'int i, j;', a: '1 1 2 4 8 16 32 64 128 256', trace: 'doubling',
      w: { '1 2 4 8 16 32 64 128 256 512': 'numbers[1] = numbers[0] = 1, so 1 appears twice before the doubling starts.' } },
    { t: 'mcq', q: 'In problem 1, for i = 0, how many times does the inner loop run?',
      o: [['0 times', 'Correct: j < 0 is false at once.'], ['Once', 'j = 0 and 0 < 0 is false.'], ['10 times', 'The inner limit is i, which is 0.']], a: 0 },
    { t: 'trace', h: 'The "xyz" problem', id: 'min', p: 'Input 5, then 55 44 22 11 99. Watch xyz (the champion) shrink.' },
    { t: 'out', q: 'Problem 2. Input: 5, then 55 44 22 11 99', code: R`scanf("%d", &num);
for (i = 0; i < num; i++)
  scanf("%d", &a[i]);
xyz = a[0];
for (i = 0; i < num; i++)
  if (a[i] < xyz)
    xyz = a[i];
printf("xyz Element : %d", xyz);`, pre: 'int a[5], num, i, xyz;', stdin: '5\n55 44 22 11 99', a: 'xyz Element : 11', trace: 'min',
      w: { 'xyz Element : 99': 'It keeps the SMALLER value (a[i] < xyz). 99 is not smaller than 11.' } },
    { t: 'mcq', q: 'What is the best name for xyz?',
      o: [['min', 'Correct: it finds the smallest value. Champion: 55 → 44 → 22 → 11.'], ['max', 'It replaces xyz when a[i] is SMALLER.'], ['sum', 'Nothing is added up.'], ['count', 'Nothing is counted.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 4.5 WEAK
  { id: 'u4-2d', title: '2D arrays: [row][col] from 0', weak: true, slides: '41', mins: 6, items: [
    { t: 'learn', h: 'The rule',
      p: `**First index = ROW** (which line, counting down from the top).
**Second index = COLUMN** (which position along that line, counting from the left).
**Both start at 0.** Think "row first, then across", the way you read a page.
\`int a[3][4]\` → **3 rows × 4 columns = 12** elements: rows 0–2, columns 0–3.`,
      code: A34_DECL, grid: { name: 'a', rows: A34 },
      key: 'a[1][2]: go to row 1 (the second line), then column 2 (the third value) → **6**.' },
    { t: 'grid', q: 'Tap **a[1][2]**.', name: 'a', grid: A34, a: [1, 2], again: { t: 'grid', q: 'Tap **a[2][1]**.', name: 'a', grid: A34, a: [2, 1] } },
    { t: 'grid', q: 'Tap **a[2][0]**.', name: 'a', grid: A34, a: [2, 0] },
    { t: 'grid', q: 'Tap **a[0][3]**.', name: 'a', grid: A34, a: [0, 3], again: { t: 'grid', q: 'Tap **a[1][0]**.', name: 'a', grid: A34, a: [1, 0] } },
    { t: 'mcq', q: 'In the grid above, which index holds the value 9?',
      o: [['a[2][1]', 'Correct: row 2 is {8, 9, 10, 11}, and 9 is at column 1.'], ['a[1][2]', 'That is row 1, column 2 → 6. You swapped row and column.'],
          ['a[3][2]', 'Counting from 1 gives row 3, column 2. In C, subtract 1 from both: [2][1].'], ['a[2][2]', 'Column 2 of row 2 is 10.']], a: 0 },
    { t: 'learn', h: 'Maths counts from 1, C counts from 0',
      trap: 'Maths element **X3,2** (row 3, column 2) is **X[2][1]** in C. Subtract 1 from both.',
      grid: { name: 'X', rows: X45 } },
    { t: 'grid', q: 'In maths notation this is **X3,2** (row 3, column 2). Tap it.', name: 'X', grid: X45, a: [2, 1], math: true },
    { t: 'mcq', q: 'Maths element X2,4 is which C element?',
      o: [['X[1][3]', 'Correct: subtract 1 from both.'], ['X[2][4]', 'C counts from 0, so subtract 1 from both.'], ['X[3][1]', 'Row comes first, and you subtract 1 from each.']], a: 0 },
    { t: 'num', q: '`int a[3][4];`: how many elements?', a: 12, w: { 7: 'Multiply: 3 rows × 4 columns.' },
      again: { t: 'num', q: '`int b[2][5];`: how many elements?', a: 10, w: { 7: '2 × 5, not 2 + 5.' } } },
    { t: 'mcq', q: '`int a[3][4];`: which of these does NOT exist?',
      o: [['a[3][0]', 'Correct: rows go 0–2. Row 3 is out of bounds.'], ['a[2][3]', 'Row 2, column 3 is the last element: valid.'], ['a[0][0]', 'The first element: valid.'], ['a[1][3]', 'Valid.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: R`int m[2][3] = {{1,2,3},{4,5,6}};
printf("%d", m[1][0]);`, a: '4', w: { '2': 'm[1][0] is row 1 (the second row), column 0 → 4. 2 is m[0][1].' } },
    { t: 'out', q: 'Drill question 3. What does it print?', code: A34_DECL + R`
printf("%d", a[0][3] + a[2][3]);`, a: '14', x: 'a[0][3] = 3, a[2][3] = 11.' },
  ]},

  // ───────────────────────────────────────── 4.6
  { id: 'u4-2dloops', title: '2D arrays + nested loops', slides: '42–44', mins: 6, items: [
    { t: 'learn', h: 'Always the same shape',
      code: R`int a[4][4], i, j;
for (i = 0; i < 4; i++)        // i = row
  for (j = 0; j < 4; j++)      // j = column
  {
    a[i][j] = i * j;
    printf("a[%d][%d] = %d\n", i, j, a[i][j]);
  }`,
      p: 'It prints row by row: a[0][0]…a[0][3] are all 0, then a[1][0]=0, a[1][1]=1, a[1][2]=2, a[1][3]=3, … a[3][3]=9.',
      key: 'Outer loop = rows (i), inner loop = columns (j). Printing "\\n" after the inner loop gives one line per row, like a real grid.' },
    { t: 'trace', h: 'Fill the grid', id: 'grid' },
    { t: 'num', q: 'With `a[i][j] = i * j` on a 4 × 4 array, what is a[3][2]?', a: 6, w: { 5: 'i * j, not i + j: 3 × 2 = 6.' },
      pre: 'int a[4][4], i, j;', run: { code: R`for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) a[i][j] = i * j;
printf("%d", a[3][2]);`, expect: '6' } },
    { t: 'out', q: 'Drill question 5. What does it print?', code: R`int m[2][3] = {{1,2,3},{4,5,6}};
int s = 0;
for (i = 0; i < 2; i++)
  for (j = 0; j < 3; j++)
    s += m[i][j];
printf("%d %d %d", m[1][2],
  m[0][1] + m[1][0], s);`, pre: 'int i, j;', a: '6 6 21', x: 'm[1][2] = 6 · 2 + 4 = 6 · 1+2+3+4+5+6 = 21.' },
    { t: 'out', q: 'Print a grid. What does it print?', code: R`int m[2][3] = {{1,2,3},{4,5,6}};
for (i = 0; i < 2; i++) {
  for (j = 0; j < 3; j++)
    printf("%d ", m[i][j]);
  printf("\n");
}`, pre: 'int i, j;', a: '1 2 3\n4 5 6' },
    { t: 'out', q: 'The loops are swapped (j outside). What does it print?', code: R`int m[2][3] = {{1,2,3},{4,5,6}};
for (j = 0; j < 3; j++)
  for (i = 0; i < 2; i++)
    printf("%d ", m[i][j]);`, pre: 'int i, j;', a: '1 4 2 5 3 6', w: { '1 2 3 4 5 6': 'Now the OUTER loop is the column: it prints column 0 (1, 4), then column 1 (2, 5)…' } },
    { t: 'learn', h: 'C = A + B (2 × 2), the lecture\'s "write it yourself"',
      code: R`int A[2][2], B[2][2], C[2][2], i, j;
for (i = 0; i < 2; i++)
  for (j = 0; j < 2; j++)
    scanf("%d", &A[i][j]);
for (i = 0; i < 2; i++)
  for (j = 0; j < 2; j++)
    scanf("%d", &B[i][j]);
for (i = 0; i < 2; i++) {
  for (j = 0; j < 2; j++) {
    C[i][j] = A[i][j] + B[i][j];
    printf("%d ", C[i][j]);
  }
  printf("\n");
}`, stdin: '1 2 3 4 5 6 7 8', out: '6 8\n10 12', p: 'Input: 1 2 3 4 (A), then 5 6 7 8 (B).' },
    { t: 'mcq', q: 'In a standard 2D loop, the outer loop variable usually picks the…',
      o: [['row', 'Correct: i = row, j = column.'], ['column', 'The column is the inner variable, j.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 4.7 WEAK
  { id: 'u4-2dpractice', title: '[row][col] practice', weak: true, slides: '41–44', mins: 5, items: [
    { t: 'grid', q: 'Tap **X[3][4]**.', name: 'X', grid: X45, a: [3, 4], again: { t: 'grid', q: 'Tap **X[0][4]**.', name: 'X', grid: X45, a: [0, 4] } },
    { t: 'grid', q: 'Tap **X[1][4]**.', name: 'X', grid: X45, a: [1, 4] },
    { t: 'grid', q: 'Tap **X[0][2]**.', name: 'X', grid: X45, a: [0, 2], again: { t: 'grid', q: 'Tap **X[2][0]**.', name: 'X', grid: X45, a: [2, 0] } },
    { t: 'mcq', q: 'In the X grid, where is 82?',
      o: [['X[0][4]', 'Correct: row 0, the last column.'], ['X[4][0]', 'Row first: 82 is in row 0. There is no row 4.'], ['X[1][5]', 'Count from 0: row 0, column 4.']], a: 0 },
    { t: 'out', q: 'What does this print?', code: X_DECL + R`
printf("%d", X[2][4]);`, a: '10' },
    { t: 'out', q: 'What does this print?', code: X_DECL + R`
printf("%d", X[3][0] + X[0][3]);`, a: '31', x: 'X[3][0] = 14, X[0][3] = 17.', w: { '14': 'X[0][3] is 17 (row 0, column 3), not 0.' } },
    { t: 'mcq', q: '`int X[4][5];`: what is the index of the very last element?',
      o: [['X[3][4]', 'Correct: size − 1 for both.'], ['X[4][5]', 'Out of bounds on both: indexes stop at size − 1.'], ['X[5][4]', 'Row first, and both start at 0.']], a: 0 },
    { t: 'out', q: 'Sum of row 1. What does it print?', code: X_DECL + R`
int j, s = 0;
for (j = 0; j < 5; j++)
  s += X[1][j];
printf("%d", s);`, a: '10', x: 'Row 1 is {9, 0, 0, 8, -7}: 9 + 8 − 7 = 10.' },
    { t: 'out', q: 'Sum of column 0. What does it print?', code: X_DECL + R`
int i, s = 0;
for (i = 0; i < 4; i++)
  s += X[i][0];
printf("%d", s);`, a: '36', x: 'Column 0 is 10, 9, 3, 14 → 36.', w: { '111': 'That is row 0. X[i][0] moves DOWN column 0.' } },
  ]},
  ]
});
})();
