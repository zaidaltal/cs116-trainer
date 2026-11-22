// Unit 6 · Past exam questions (CS116 online quizzes, deduplicated). Every answer below is checked with gcc
// by tools/verify.js: run.expect = real output, run.compileError = gcc must reject it, run.infinite = must never stop.
(() => {
const R = String.raw;
CS116.unit({
  id: 'u6', title: 'Past exam questions', sub: 'CS116 online quizzes · 53 real questions', past: true,
  lessons: [

  // ───────────────────────────────────────── 6.1
  { id: 'u6-basics1', title: 'Past paper: values, types & operators', slides: 'past', mins: 6, items: [
    { t: 'mcq', q: 'What is the final value of v after this code?', code: R`int v = 5;
v+2;
v*9;
v==1;`,
      o: [['5', 'Correct: none of these lines STORE anything. v+2 and v*9 are calculated then thrown away; v==1 only compares. Only = (or +=, ++ …) changes v.'],
          ['7', 'v+2 computes 7 but never stores it. You would need v = v + 2 or v += 2.'],
          ['45', 'v*9 is not v *= 9: nothing is assigned.'],
          ['1', 'v==1 is a comparison (it gives 0 here), not an assignment.']], a: 0,
      run: { code: R`int v = 5; v+2; v*9; v==1; printf("%d", v);`, expect: '5' } },
    { t: 'mcq', q: 'What is the output?', code: R`#include <stdio.h>
void main()
{
    int k = 4;
    float k = 4;
    printf("%d", k)
}`,
      o: [['Compile time error', 'Correct: k is declared twice in the same block (and the printf line is missing its ;).'],
          ['4', 'The program never compiles, so nothing is printed.'], ['4.4', 'Nothing runs: a name can only be declared once per block.'], ['4.0000000', 'Compile error first.']], a: 0,
      run: { code: R`int k = 4; float k = 4; printf("%d", k);`, compileError: true } },
    { t: 'mcq', q: '"= is used for comparison, whereas == is used for assignment of two quantities."',
      o: [['False', 'Correct: it is the other way round. = assigns, == compares.'], ['True', 'Swapped: = is assignment, == is comparison.']], a: 0 },
    { t: 'mcq', q: 'What is the value of q?', code: R`int a=8;
int q=a++;`,
      o: [['8', 'Correct: a++ hands over the OLD value (8), then a becomes 9.'], ['9', '9 is a afterwards. q got the old value.'], ['7', '++ never subtracts.'], ['0', 'q gets a\'s old value, 8.']], a: 0,
      run: { code: R`int a=8; int q=a++; printf("%d %d", q, a);`, expect: '8 9' } },
    { t: 'mcq', q: 'Which operator has right-to-left associativity?',
      o: [['=', 'Correct: a = b = 5 is read as a = (b = 5). Assignment groups right to left.'], ['<', 'Comparisons group left to right.'], ['!=', 'Left to right.'], ['&&', 'Left to right.']], a: 0,
      run: { code: R`int a, b; a = b = 5; printf("%d %d", a, b);`, expect: '5 5' } },
    { t: 'mcq', q: 'Which is NOT a logical or relational operator?',
      o: [['=', 'Correct: = is the ASSIGNMENT operator.'], ['!=', 'Relational (not equal).'], ['||', 'Logical OR.'], ['==', 'Relational (equal).']], a: 0 },
    { t: 'mcq', q: 'Which is a valid C statement?',
      o: [['int my_num = 100000;', 'Correct.'], ['int my_num = 100,000;', 'No commas inside numbers: C reads 100, then tries to declare a variable called 000.'],
          ['int $my_num = 10000;', '$ is not allowed in a name.'], ['int my num = 1000;', 'Spaces are not allowed in a name.']], a: 0,
      run: { code: R`int my_num = 100000; printf("%d", my_num);`, expect: '100000' } },
    { t: 'mcq', q: 'What is the output?', code: R`char i='1';
printf("%d", i==1);`,
      o: [['0', "Correct: '1' is the CHARACTER 1 = ASCII 49. 49 == 1 is false → 0."], ['1', "'1' is 49, not the number 1."], ["1=1", 'printf prints the value of the comparison, which is 0 or 1.'], ["'1'=1", 'Only the number 0 or 1 is printed.']], a: 0,
      run: { code: R`char i='1'; printf("%d", i==1);`, expect: '0' } },
    { t: 'mcq', q: 'Which of these is NOT a valid variable declaration?',
      o: [['None of the mentioned', 'Correct: all three start with underscores and are legal names.'], ['int __3a;', 'Legal: it starts with _, and the digit is not first.'], ['int __A3;', 'Legal.'], ['int __a3;', 'Legal.']], a: 0,
      run: { code: R`int __3a = 1, __A3 = 2, __a3 = 3; printf("%d", __3a + __A3 + __a3);`, expect: '6' } },
    { t: 'mcq', q: 'What is the value of b?', code: R`float b=(int) 3.4 / 2;`,
      o: [['1.000000', 'Correct: the cast applies to 3.4 only → 3. Then 3 / 2 is int ÷ int = 1, stored as 1.0.'], ['1.500000', 'That would need 3.0 / 2. After the cast, both sides are ints.'], ['0', 'b is a float holding 1.0.'], ['Error', 'Casting is legal.']], a: 0,
      run: { code: R`float b=(int) 3.4 / 2; printf("%f", b);`, expect: '1.000000' } },
    { t: 'mcq', q: 'What is the output?', code: R`int a = 10, b = 5, c = 5;
int d;
d = a == (b + c);
printf("%d", d);`,
      o: [['1', 'Correct: (b + c) = 10, then a == 10 is true → 1. = has the lowest precedence, so it runs last.'], ['10', '== gives 1 or 0, never the number itself.'], ['5', 'd receives the result of the comparison.'], ['Syntax error', 'Legal: d = (a == (b + c)).']], a: 0,
      run: { code: R`int a = 10, b = 5, c = 5; int d; d = a == (b + c); printf("%d", d);`, expect: '1' } },
  ]},

  // ───────────────────────────────────────── 6.2
  { id: 'u6-basics2', title: 'Past paper: printf, names & ++/--', slides: 'past', mins: 6, items: [
    { t: 'mcq', q: 'What is the output?', code: R`#include <stdio.h>
int main()
{
    printf("Hello World! %d \n", x);
    return 0;
}`,
      o: [['Compile time error', 'Correct: x was never declared.'], ['Hello World! x;', 'x is not text here; it is an undeclared variable.'], ['Hello World!', 'It never compiles.'], ['Hello World! followed by a junk value', 'That would happen if x were declared but not initialised. Here x does not exist at all.']], a: 0,
      run: { code: R`printf("Hello World! %d \n", x);`, compileError: true } },
    { t: 'mcq', q: 'What is the final value of tester?', code: R`_Bool tester = 'F';`,
      o: [['1', "Correct: 'F' is 70 (non-zero), and _Bool turns any non-zero into 1."], ['0', "'F' is not 0: it is ASCII 70, so it is true."]], a: 0,
      run: { code: R`_Bool tester = 'F'; printf("%d", tester);`, expect: '1' } },
    { t: 'mcq', q: 'Which of the following is NOT a comment?',
      o: [['/*Prog1.c/*', 'Correct: it opens with /* but never closes with */ (it ends with /* again), so it is not a complete comment.'],
          ['//#include <stdio.h>', 'A // comment: everything after // is ignored.'], [R`//printf( "Welcome to C!\n" );`, 'A // comment.'], ['///', '// followed by a / is still a comment.']], a: 0,
      run: { code: "/*Prog1.c/*\nint x = 1;", compileError: true } },
    { t: 'mcq', q: 'What is the output?', code: R`int ThisIsVariableName = 12;
int ThisIsVariablename = 14;
printf("%d", ThisIsVariablename);`,
      o: [['14', 'Correct: C is case sensitive. ...Name and ...name are two different variables.'], ['12', 'Look closely: the printed one ends in lowercase "name".'], ['Compile-time error due to redeclaration', 'They differ in one letter\'s case, so they are different names.'], ['Runtime error', 'Nothing goes wrong at run time.']], a: 0,
      run: { code: R`int ThisIsVariableName = 12; int ThisIsVariablename = 14; printf("%d", ThisIsVariablename);`, expect: '14' } },
    { t: 'mcq', q: 'What is the output?', code: R`int x = 4, y, z;
y = --x;
z = x--;
printf("%d%d%d", x, y, z);`,
      o: [['233', 'Correct: --x makes x 3, then y = 3. x-- gives z the OLD 3, then x becomes 2. Printed: x y z = 2 3 3.'], ['322', 'Check the print order: x first (2), then y, then z.'], ['323', 'z = x-- takes the old value 3, not 2.'], ['234', 'y = --x gets the NEW value 3, not 4.']], a: 0,
      run: { code: R`int x = 4, y, z; y = --x; z = x--; printf("%d%d%d", x, y, z);`, expect: '233' } },
    { t: 'mcq', q: 'What is the final value of x?', code: R`int x = 5 * 9 / 3 + 9;`,
      o: [['24', 'Correct: 5*9 = 45, 45/3 = 15 (left to right), 15 + 9 = 24.'], ['3.75', 'Not possible for an int, and * / go before +.'], ['3', 'That would be 5 * 9 / (3 + 9) = 45/12. + is done last here.'], ['Depends on compiler', 'Precedence is fixed by the language.']], a: 0,
      run: { code: R`int x = 5 * 9 / 3 + 9; printf("%d", x);`, expect: '24' } },
    { t: 'mcq', q: 'Which operator has the highest precedence?',
      o: [['!', 'Correct: ! is unary, the top of the ladder.'], ['%', '% is high (with * and /), but below unary !.'], ['||', '|| is near the bottom.'], ['+=', 'Assignment operators are the lowest.']], a: 0 },
    { t: 'mcq', q: 'What is the output? (Look carefully at the printf.)', code: R`int a = 1, b = 1, c;
c = a++ + b;
printf("c = %d, a = %d", a, c);`,
      o: [['c = 2, a = 2', 'Correct: a++ gives the old 1, so c = 1 + 1 = 2, and a becomes 2. The arguments are passed as (a, c), but both are 2.'], ['c = 3, a = 2', 'a++ hands over 1, not 2: c = 1 + 1.'], ['c = 1, a = 1', 'a still grows to 2.']], a: 0,
      run: { code: R`int a = 1, b = 1, c; c = a++ + b; printf("c = %d, a = %d", a, c);`, expect: 'c = 2, a = 2' } },
    { t: 'mcq', q: 'What is the value of t?', code: R`char t='A';
if(5.5/2==2)
  t='2';`,
      o: [['A', 'Correct: 5.5 is a float, so 5.5/2 = 2.75 (real division). 2.75 == 2 is false, so t stays \'A\'.'], ['2', 'That only happens if 5.5/2 equalled 2. With a float it is 2.75.'], ['2.25', 't is a char; it can only be \'A\' or \'2\' here.'], ['Error', 'The code is legal.']], a: 0,
      run: { code: R`char t='A'; if(5.5/2==2) t='2'; printf("%c", t);`, expect: 'A' } },
    { t: 'mcq', q: '"A zero value is considered to be false and a non-zero value is considered to be true."',
      o: [['True', 'Correct: the big rule of C.'], ['False', 'It is exactly the rule: 0 is false, everything else is true.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 6.3
  { id: 'u6-decisions', title: 'Past paper: if & switch', slides: 'past', mins: 6, items: [
    { t: 'mcq', q: 'What is the output?', code: R`char a='M', b='O';
if(a+2==b)
  printf("Equal");
else if((a+2)!=b)
  printf("Not Equal");
else
  printf("Operation is wrong");`,
      o: [['Equal', "Correct: 'M' is 77, 77 + 2 = 79, which is 'O'. Letters are numbers."], ['Not Equal', "M → N → O: two steps along the alphabet, so they ARE equal."], ['Operation is wrong', 'The else is only reached if both conditions are false, which is impossible here.'], ['c', 'Not one of the printed strings.']], a: 0,
      run: { code: R`char a='M', b='O'; if(a+2==b) printf("Equal"); else if((a+2)!=b) printf("Not Equal"); else printf("Operation is wrong");`, expect: 'Equal' } },
    { t: 'mcq', q: 'What is the final value of t?', code: R`int t = 0;
if(t=0)
  t=-4;
else
  t=4;`,
      o: [['4', 'Correct: t=0 ASSIGNS 0, and 0 is false, so the else runs: t = 4.'], ['-4', 't=0 is not a comparison. Its value is 0 (false).'], ['0', 'The else branch then sets t to 4.'], ['Syntax error', 'Assignment inside if is legal (just usually a bug).']], a: 0,
      run: { code: R`int t = 0; if(t=0) t=-4; else t=4; printf("%d", t);`, expect: '4' } },
    { t: 'mcq', q: 'What is printed?', code: R`int test = 0;
if(test == -7)
  printf("case 1");
else if(test == 7)
  printf("case 2");
else if(test = 0)
  printf("case 3");
else
  printf("case 4");`,
      o: [['case 4', 'Correct: test = 0 is an ASSIGNMENT with value 0 (false), so the final else runs.'], ['case 3', 'test = 0 is not ==. Its value is 0, which is false.'], ['case 1', 'test is 0, not -7.'], ['case 2', 'test is 0, not 7.']], a: 0,
      run: { code: R`int test = 0; if(test == -7) printf("case 1"); else if(test == 7) printf("case 2"); else if(test = 0) printf("case 3"); else printf("case 4");`, expect: 'case 4' } },
    { t: 'mcq', q: 'What is the output?', code: R`int i = 0;
while (i = 0)
  printf("True\n");
printf("False\n");`,
      o: [['False', 'Correct: i = 0 has value 0, so the loop body never runs. Then "False" prints once.'], ['True (infinite time)', 'That would be while (i = 1). Here the value is 0.'], ['True (1 time) False', 'A while checks BEFORE running; 0 is false, so 0 runs.'], ['Compiler dependent', 'This is fully defined behaviour.']], a: 0,
      run: { code: R`int i = 0; while (i = 0) printf("True\n"); printf("False\n");`, expect: 'False' } },
    { t: 'mcq', q: 'What is printed?', code: R`char c = 8;
switch(c){
  case '8':
    printf("Eight");
    break;
  case 'c':
    printf("c");
    break;
  case 'x':
    printf("x");
    break;
  default:
    printf("Backspace");
    break;
}`,
      o: [['Backspace', "Correct: c holds the NUMBER 8. '8' is the character with ASCII code 56. No case matches, so default runs."], ['Eight', "8 ≠ '8': the character '8' is 56."], ['c', "The case 'c' is the letter c (99), not the variable."], ['x', 'No match.']], a: 0,
      run: { code: R`char c = 8; switch(c){ case '8': printf("Eight"); break; case 'c': printf("c"); break; case 'x': printf("x"); break; default: printf("Backspace"); break; }`, expect: 'Backspace' } },
    { t: 'mcq', q: 'What is printed?', code: R`int n = 3;
switch(n){
  case 1:
  case 2:
    printf("goodmorning");
    break;
  case 3:
    printf("good");
  default:
    printf("afternoon");
    break;
}`,
      o: [['goodafternoon', 'Correct: jump to case 3, print "good", no break, so it falls into default and prints "afternoon".'], ['good', 'There is no break after case 3: it falls through.'], ['goodmorning', 'That is cases 1 and 2.'], ['goodmorninggoodafternoon', 'It jumps straight to case 3; the cases above are skipped.']], a: 0,
      run: { code: R`int n = 3; switch(n){ case 1: case 2: printf("goodmorning"); break; case 3: printf("good"); default: printf("afternoon"); break; }`, expect: 'goodafternoon' } },
    { t: 'mcq', q: 'What is the final value of s?', code: R`int s=2;
switch(s){
  case 2:
  case 3:
    s*=4;
    break;
  case 1:
    s++;
  default:
    s--;
}`,
      o: [['8', 'Correct: case 2 has no code, so it falls into case 3: s = 2 * 4 = 8, then break.'], ['2', 's *= 4 changes s.'], ['3', 'The break stops it before case 1 and default.'], ['1', 'case 1 and default are never reached.']], a: 0,
      run: { code: R`int s=2; switch(s){ case 2: case 3: s*=4; break; case 1: s++; default: s--; } printf("%d", s);`, expect: '8' } },
    { t: 'mcq', q: 'Input: 1. What is printed after the prompt?', code: R`int ch;
printf("enter a value between 1 to 2:");
scanf("%d", &ch);
switch (ch)
{
    case 1:
      printf("1\n");
    default:
      printf("2\n");
}`, stdin: '1',
      o: [['1 then 2 (on two lines)', 'Correct: case 1 has no break, so it falls into default and prints 2 too.'], ['1', 'No break after case 1: it keeps falling into default.'], ['2', 'ch is 1, so case 1 runs first.'], ['Run time error', 'Nothing goes wrong.']], a: 0,
      run: { code: R`int ch; printf("enter a value between 1 to 2:"); scanf("%d", &ch); switch (ch) { case 1: printf("1\n"); default: printf("2\n"); }`, stdin: '1', expect: 'enter a value between 1 to 2:1\n2' } },
    { t: 'mcq', q: '"The switch statement can have any number of case instances."',
      o: [['True', 'Correct: as many cases as you like (each label unique). Only default is limited to one.'], ['False', 'There is no limit on cases. At most ONE default is the only limit.']], a: 0 },
  ]},

  // ───────────────────────────────────────── 6.4
  { id: 'u6-loops1', title: 'Past paper: loops (1)', slides: 'past', mins: 7, items: [
    { t: 'mcq', q: 'What is the output?', code: R`int a = 0, i = 0, b;
for (i = 0; i < 5; i++)
{
    a++;
    continue;
}
printf("%d\n", a);`,
      o: [['5', 'Correct: continue is the last line anyway, so it changes nothing. The loop runs 5 times.'], ['4', 'i = 0…4 is 5 rounds.'], ['3', 'continue does not stop the loop.'], ['2', 'Every round reaches a++.']], a: 0,
      run: { code: R`int a = 0, i = 0, b; for (i = 0; i < 5; i++) { a++; continue; } printf("%d\n", a);`, expect: '5' } },
    { t: 'mcq', q: 'What is the output?', code: R`int a = 0, i = 0, b;
for (i = 0; i < 5; i++)
{
    a++;
    if (i == 3)
        break;
}
printf("%d\n", a);`,
      o: [['4', 'Correct: rounds i = 0, 1, 2, 3 each do a++ (4 times). At i == 3 it breaks.'], ['3', 'a++ runs BEFORE the check, so round i = 3 also counts.'], ['5', 'The break stops it before i = 4.'], ['1', 'break only happens when i is 3.']], a: 0,
      run: { code: R`int a = 0, i = 0, b; for (i = 0; i < 5; i++) { a++; if (i == 3) break; } printf("%d\n", a);`, expect: '4' } },
    { t: 'mcq', q: 'What is the output?', code: R`double k = 0;
for (k = 0.0; k < 3.0; k++)
    printf("Hello");`,
      o: [['Hello is printed thrice', 'Correct: k = 0.0, 1.0, 2.0 pass; 3.0 < 3.0 fails. A double works fine as a loop counter.'], ['Hello is printed twice', 'Count 0.0, 1.0 and 2.0: three values.'], ['Hello is printed infinitely', 'k++ adds 1.0 each time, so it reaches 3.0.'], ['Run time error', 'Doubles in loops are legal.']], a: 0,
      run: { code: R`double k = 0; for (k = 0.0; k < 3.0; k++) printf("Hello");`, expect: 'HelloHelloHello' } },
    { t: 'mcq', q: 'What is the output?', code: R`int i = 0;
do
{
    printf("Hello");
} while (i != 0);`,
      o: [['Hello', 'Correct: do-while always runs once. Then 0 != 0 is false, so it stops.'], ['Nothing', 'do-while runs the body BEFORE checking.'], ['H is printed infinite times', 'i != 0 is false straight away.'], ['Run time error', 'Nothing goes wrong.']], a: 0,
      run: { code: R`int i = 0; do { printf("Hello"); } while (i != 0);`, expect: 'Hello' } },
    { t: 'mcq', q: 'How many times does the while loop run?', code: R`int j=1;
while(j <= 255)
{
    printf("%c %d\n", j, j);
    j++;
}`,
      o: [['255 times', 'Correct: j = 1…255 with <= → 255 − 1 + 1 = 255. j is an int, so the "2-byte short" in the question is a distraction.'], ['254 times', 'With <= the 255 counts too.'], ['256 times', 'j starts at 1, not 0.'], ['Infinite times', 'j is an int and easily reaches 256, so the loop stops.']], a: 0,
      run: { code: R`int j=1, c = 0; while(j <= 255) { c++; j++; } printf("%d", c);`, expect: '255' } },
    { t: 'mcq', q: 'What is the value of i at the end? (Watch the indentation trap.)', code: R`int i= 7;
while (i>0){
  if(i%3 == 0)
i = i - 4;
  else
     i = i - 2;
}`,
      o: [['-1', 'Correct: 7 (7%3=1) → 5 (5%3=2) → 3 (3%3=0) → 3−4 = −1. Then −1 > 0 fails.'], ['1', 'At 3, i%3 == 0 is true, so it subtracts 4, not 2.'], ['3', 'The loop keeps going while i > 0.'], ['5', 'It keeps going: 5 is still > 0.']], a: 0,
      run: { code: R`int i= 7; while (i>0){ if(i%3 == 0) i = i - 4; else i = i - 2; } printf("%d", i);`, expect: '-1' } },
    { t: 'mcq', q: 'What is the output?', code: R`int i=5;
while(--i);
printf("%i", i);`,
      o: [['0', 'Correct: the ; is the whole body. --i counts 4, 3, 2, 1, 0; when it hits 0 the check is false.'], ['-1', 'The check uses the NEW value (pre-decrement), so it stops exactly at 0.'], ['1', '--i makes i 0 in the final check.'], ['-2', 'It stops at 0.']], a: 0,
      run: { code: R`int i=5; while(--i); printf("%i", i);`, expect: '0' } },
    { t: 'mcq', q: 'How many times is "IndiaBIX" printed?', code: R`int x;
for(x=-1; x<=10; x++)
{
    if(x < 5)
        continue;
    else
        break;
    printf("IndiaBIX");
}`,
      o: [['0 times', 'Correct: every round either continues or breaks BEFORE reaching printf.'], ['11 times', 'printf sits after an if/else that always jumps away.'], ['10 times', 'printf is unreachable.'], ['Infinite times', 'At x = 5 the else breaks out.']], a: 0,
      run: { code: R`int x; for(x=-1; x<=10; x++) { if(x < 5) continue; else break; printf("IndiaBIX"); }`, expect: '' } },
    { t: 'mcq', q: 'What is the output?', code: R`int i = 0;
for (; ; ;)
    printf("In for loop\n");
    printf("After loop\n");`,
      o: [['Compile-time error', 'Correct: for needs exactly TWO semicolons inside the brackets: for (;;). "(; ; ;)" has three.'], ['Infinite loop', 'for (;;) would be infinite. This one has an extra ; and does not compile.'], ['After loop', 'Nothing runs.'], ['Undefined behavior', 'It is rejected by the compiler.']], a: 0,
      run: { code: R`int i = 0; for (; ; ;) printf("In for loop\n"); printf("After loop\n");`, compileError: true } },
    { t: 'mcq', q: 'The same idea written correctly. What happens?', code: R`int i = 0;
for (;;)
    printf("In for loop\n");
printf("After loop\n");`,
      o: [['Infinite loop: "In for loop" forever', 'Correct: an empty check counts as true, and there is no break.'], ['After loop', 'The program never gets past the loop.'], ['Compile-time error', 'for (;;) with two semicolons is legal.']], a: 0,
      run: { code: R`int i = 0; for (;;) printf("In for loop\n"); printf("After loop\n");`, infinite: true } },
    { t: 'mcq', q: 'What is the value of c?', code: R`int t=50, c=0;
do{
    t/=10;
    c++;
}
while(t>1);`,
      o: [['2', 'Correct: round 1: t = 5, c = 1 (5 > 1, so go on). Round 2: t = 0, c = 2 (0 > 1 is false).'], ['5', '5 is t after round 1, not c.'], ['0.5', 'c is an int counter.'], ['0', 'do-while runs at least once.']], a: 0,
      run: { code: R`int t=50, c=0; do{ t/=10; c++; } while(t>1); printf("%d", c);`, expect: '2' } },
    { t: 'mcq', q: 'What is printed?', code: R`int value = 10, counter = 0;
while(value/=2) counter++;
printf("%i", counter);`,
      o: [['3', 'Correct: value 5 → counter 1, 2 → 2, 1 → 3, then 0 is false.'], ['2', 'value = 1 is still non-zero (true), so counter grows once more.'], ['1', 'Keep halving until value becomes 0.'], ['0', 'The first halving gives 5, which is true.']], a: 0,
      run: { code: R`int value = 10, counter = 0; while(value/=2) counter++; printf("%i", counter);`, expect: '3' } },
  ]},

  // ───────────────────────────────────────── 6.5
  { id: 'u6-loops2', title: 'Past paper: loops (2)', slides: 'past', mins: 7, items: [
    { t: 'mcq', q: 'Which keyword is used to come out of a loop only for that iteration?',
      o: [['continue', 'Correct: continue skips the rest of THIS round only.'], ['break', 'break leaves the whole loop, not just one iteration.'], ['return', 'return leaves the whole function.'], ['none of the mentioned', 'continue does exactly this.']], a: 0 },
    { t: 'mcq', q: 'What is an example of iteration in C?',
      o: [['all of the mentioned', 'Correct: for, while and do-while are all loops (iteration).'], ['for', 'True, but so are the others.'], ['while', 'True, but so are the others.'], ['do-while', 'True, but so are the others.']], a: 0 },
    { t: 'mcq', q: 'Which for loop visits the same indexes as `for (i = 0; i < n; i++)`, but backwards?',
      o: [['for (i = n-1; i > -1; i--)', 'Correct: from n−1 down to 0 (i > -1 includes 0).'], ['for (i = n; i >= 0; i--)', 'Starts at n, which is one past the last index.'], ['for (i = n; i > 0; i--)', 'Covers n…1: includes n and misses 0.'], ['for (i = n-1; i > 0; i--)', 'Stops before 0, so index 0 is missed.']], a: 0,
      run: { code: R`int i, n = 4; for (i = n-1; i > -1; i--) printf("%d ", i);`, expect: '3 2 1 0' } },
    { t: 'mcq', q: 'What is the output?', code: R`int k;
for (k = -3; k < -5; k++)
    printf("Hello");`,
      o: [['Nothing', 'Correct: −3 < −5 is false on the first check, so the body runs 0 times.'], ['Hello', 'A for loop checks BEFORE the first round.'], ['Infinite hello', 'It never even starts.'], ['Run time error', 'Nothing goes wrong.']], a: 0,
      run: { code: R`int k; for (k = -3; k < -5; k++) printf("Hello");`, expect: '' } },
    { t: 'mcq', q: 'What is the output?', code: R`int k = 0;
for (k)
    printf("Hello");`,
      o: [['Compile-time error', 'Correct: a for needs its two semicolons: for (init; check; update).'], ['Nothing', 'It never compiles.'], ['hello', 'It never compiles.'], ['Varies', 'It is always a compile error.']], a: 0,
      run: { code: R`int k = 0; for (k) printf("Hello");`, compileError: true } },
    { t: 'mcq', q: 'What is printed?', code: R`int i = 5;
do{
    --i;
}
while(i);
printf("%i", i);`,
      o: [['0', 'Correct: i counts down 4, 3, 2, 1, 0. while(0) is false, so it stops.'], ['1', 'At 1 the check is true, so it runs once more.'], ['4', 'It keeps looping while i is non-zero.'], ['5', 'The body changes i.']], a: 0,
      run: { code: R`int i = 5; do{ --i; } while(i); printf("%i", i);`, expect: '0' } },
    { t: 'mcq', q: 'What is the output?', code: R`int i, j;
for(i=0;i<4;i++){
   for(j=0;j<4;j++){
      if(j%2)
         break;
      printf("*");
   }
   printf("\n");
}`,
      o: [['*\n*\n*\n*', 'Correct: j = 0 prints *, then j = 1 makes j%2 = 1 (true) → break. That happens on each of the 4 rows.'], ['****', 'The "\\n" runs once per outer round, giving 4 lines, and only one star fits before the break.'], ['**\n**', 'break happens at j = 1, so only ONE star per row, and there are 4 rows.'], ['*   *\n*   *\n*   *\n*   *', 'Only j = 0 prints; there is never a second star.']], a: 0,
      run: { code: R`int i, j; for(i=0;i<4;i++){ for(j=0;j<4;j++){ if(j%2) break; printf("*"); } printf("\n"); }`, expect: '*\n*\n*\n*' } },
    { t: 'mcq', q: 'What is the output?', code: R`for(i=1;i<5;i++)
{
    for(j=1;j<i;j++)
    {
        printf("%d",j);
    }
    printf("\n");
}`, pre: 'int i, j;',
      o: [['(empty line)\n1\n12\n123', 'Correct: for i = 1, j < 1 fails at once (empty line). Then 1, 12, 123.'], ['1\n12\n123\n1234', 'j < i (not <=), so the longest row is 123.'], ['1\n12', 'i runs up to 4, giving 4 lines.'], ['1', 'The outer loop runs 4 times.']], a: 0,
      run: { pre: "", code: R`int i, j; for(i=1;i<5;i++) { for(j=1;j<i;j++) { printf("%d",j); } printf("\n"); } printf("|");`, expect: '\n1\n12\n123\n|' } },
    { t: 'mcq', q: 'How many times is "Hi" printed?', code: R`int i = 0;
int j = 0;
for (i = 0; i < 5; i++)
{
    for (j = 0; j < 4; j++)
    {
        if (i > 1)
            continue;
        printf("Hi \n");
    }
}`,
      o: [['8 times', 'Correct: only i = 0 and i = 1 reach printf, 4 times each: 2 × 4 = 8.'], ['6 times', 'Each allowed row prints 4 times, not 3.'], ['9 times', 'i > 1 blocks i = 2, 3, 4.'], ['7 times', 'Count 2 rows × 4 columns.']], a: 0,
      run: { code: R`int i = 0, j = 0, c = 0; for (i = 0; i < 5; i++) { for (j = 0; j < 4; j++) { if (i > 1) continue; c++; } } printf("%d", c);`, expect: '8' } },
    { t: 'mcq', q: 'How many times is "Hi" printed? (printf is OUTSIDE the inner loop.)', code: R`int i = 0, j = 0;
for (i = 0; i < 5; i++)
{
    for (j = 0; j < 4; j++)
    {
        if (i > 1)
            break;
    }
    printf("Hi \n");
}`,
      o: [['5 times', 'Correct: printf is after the inner loop, so it runs once per outer round (5). The break only ends the inner loop early.'], ['4 times', 'The outer loop runs 5 times.'], ['7 times', 'printf is not inside the inner loop.'], ['9 times', 'printf is not inside the inner loop.']], a: 0,
      run: { code: R`int i = 0, j = 0; for (i = 0; i < 5; i++) { for (j = 0; j < 4; j++) { if (i > 1) break; } printf("Hi \n"); }`, expect: 'Hi\nHi\nHi\nHi\nHi' } },
    { t: 'mcq', q: 'What is the value of a at the end?', code: R`int a=5, b=6;
while(1)
{
    if(a!=b) break;
    a--;
    b++;
}`,
      o: [['5', 'Correct: 5 != 6 is true on the very first check, so it breaks before a-- ever runs.'], ['4', 'a-- is never reached.'], ['6', 'a never changes.'], ['0', 'The loop ends straight away.']], a: 0,
      run: { code: R`int a=5, b=6; while(1) { if(a!=b) break; a--; b++; } printf("%d", a);`, expect: '5' } },
    { t: 'mcq', q: 'Where is the mistake?', code: R`x = a++;
n = ++a;
int i;
for(i = 4, i >= 0, i--)`,
      o: [['for(i = 4, i >= 0, i--)', 'Correct: the three parts of a for are separated by SEMICOLONS: for (i = 4; i >= 0; i--).'], ['x = a++;', 'Legal.'], ['n = ++a;', 'Legal.'], ['int i;', 'Legal.']], a: 0,
      run: { code: R`int i; for(i = 4, i >= 0, i--) ;`, compileError: true } },
    { t: 'mcq', q: 'What is the output?', code: R`int i = 0;
while (++i)
{
    printf("H");
}`,
      o: [['H is printed infinite times', 'Correct (exam answer): ++i makes i 1, 2, 3… which is never 0, so the loop does not stop. (Strictly, the int eventually overflows, which C leaves undefined, but the expected answer is "infinite".)'], ['H', '++i is non-zero every round, not just once.'], ['Compile-time error', 'It compiles fine.'], ['Varies', 'The intended answer is an endless loop.']], a: 0,
      run: { code: R`int i = 0; while (++i) { printf("H"); }`, infinite: true } },
  ]},
  ]
});
})();
