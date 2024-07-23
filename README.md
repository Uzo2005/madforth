# MadForth Programming Language

MadForth is an experimental stack-based programming language inspired by Forth. It provides operators for arithmetic, comparison, logic, and control flow, as well as basic input/output operations.

## Language Features

### Data Types

- Numbers
- Strings
- Booleans
- Identifiers (variables)

### Operators

#### Arithmetic

- `+` (addition)
- `-` (subtraction)
- `*` (multiplication)
- `/` (division)
- `%` (modulus)
- `**` (power)

#### Comparison

- `=` (equal to)
- `!=` (not equal to)
- `<` (less than)
- `>` (greater than)
- `<=` (less than or equal to)
- `>=` (greater than or equal to)

#### Logic

- `&` (and)
- `||` (or)
- `!` (not)

### Control Flow

- `IF` ... `ELSE` ... (conditional execution)
- `WHILE` ... (loop while condition is true)
- `REPEAT` ... (loop n times)
- `BREAK` (exit a loop)

### Stack Operations

- `POP` (remove top item from stack)
- `DUP` (duplicate top item on stack)
- `SWAP` (swap top two items on stack)

### Input/Output

- `ECHO` (output to stdout)
- `TAKE` (input from stdin)

### Grouping

Use parentheses `(` and `)` to group expressions and scope branching.

## Example Programs

Here are a few example programs to help you get started with MadForth:

1. Hello, World!

```
"Hello, World!" ECHO
```

2. Simple addition

```
5 3 + ECHO
```

3. Conditional statement

```
10 5 > IF
    ("10 is greater than 5" ECHO)
ELSE
  ("10 is not greater than 5" ECHO)
```

4. Loop

```
TRUE WHILE (
  "infinite loop" ECHO
)
```

5. Variable Assignment and Use (assigments start with `$`, dereferences end with `[]`)

```
1 3 + $i i[] ECHO
```

6. Read From Stdin

```
TAKE 3 + ECHO
```

7. Fizzbuzz

```
TAKE $start TAKE $end start[] $index TRUE WHILE (index[] end[] = IF (BREAK) ELSE (index[] 3 % 0 = IF ("fizz" ECHO) index[] 5 % 0 = IF ("buzz" ECHO)) 1 index[] + $index)
```

## Getting Started

To use MadForth, visit the [online demo where I tried to turn it into a visual language](https://uzo2005.github.io/madforth), forgive me for the horrible UI!

Use MadForth At Your Own Peril!
