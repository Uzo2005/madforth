import {
  Arithmetic,
  Comparison,
  Logic,
  ControlFlow,
  IOTokens,
  StackOps,
  TokenType,
  allOperators,
  Token,
  IO,
  StackResult,
} from "./types";

// const inputFile = "examples/main.mdf";
// const sampleSrc = await Bun.file(inputFile).text();
export const io: IO = {
  stdin: [],
  stdout: [],
  stderr: [],
};
let variableLookupTable = new Map<string, Token>();
const maxLoopDepth = 10000;
let loopHaveMaxDepth = true;

let breakLoopCount = 0;

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  const keywords = Object.values(allOperators);
  const maxKeyWordLength = keywords.reduce(
    (max, str) => Math.max(max, str.length),
    0
  );

  while (current < input.length) {
    let char = input[current];

    // Handle whitespace
    if (/\s/.test(char)) {
      current++;
      continue;
    }

    // Handle numbers (including negative and floating point)
    if (/[-0-9]/.test(char)) {
      let value = "";
      let isNumber = true;
      let hasDecimal = false;

      if (char === "-") {
        // Check if it's a negative number or minus operator
        if (current === 0 || /[\s(]/.test(input[current - 1])) {
          value += char;
          char = input[++current];
          if (!/[0-9]/.test(char)) {
            tokens.push({ type: TokenType.Keyword, value: "-" });
            continue;
          }
        } else {
          tokens.push({ type: TokenType.Keyword, value: "-" });
          current++;
          continue;
        }
      }

      while (/[0-9.]/.test(char) && isNumber) {
        if (char === ".") {
          if (hasDecimal) {
            isNumber = false;
            break;
          }
          hasDecimal = true;
        }
        value += char;
        char = input[++current];
      }

      if (value.endsWith(".")) {
        isNumber = false;
      }

      if (isNumber) {
        tokens.push({ type: TokenType.Number, value });
      } else {
        io.stderr.push("Invalid token after " + value);
      }
      continue;
    }

    // Handle strings
    if (char === '"') {
      let value = "";
      char = input[++current];
      while (char !== '"' && current < input.length) {
        value += char;
        char = input[++current];
      }
      if (char === '"') {
        tokens.push({ type: TokenType.String, value: `"${value}"` });
        current++;
      } else {
        io.stderr.push("Unterminated string: " + value);
      }
      continue;
    }

    // Handle groups (parentheses)
    if (char === "(") {
      let value = "";
      let nestLevel = 1;
      char = input[++current];
      while (nestLevel > 0 && current < input.length) {
        if (char === "(") nestLevel++;
        if (char === ")") nestLevel--;
        if (nestLevel > 0) value += char;
        char = input[++current];
      }
      if (nestLevel === 0) {
        tokens.push({ type: TokenType.Group, value });
      } else {
        io.stderr.push("Unmatched parentheses: " + value);
      }
      continue;
    }

    // Handle keywords and operators
    let isKeyword = false;
    for (
      let keywordLength = maxKeyWordLength;
      keywordLength > 0;
      keywordLength--
    ) {
      const potentialKeyword = input.slice(current, current + keywordLength);
      if (keywords.includes(potentialKeyword)) {
        tokens.push({ type: TokenType.Keyword, value: potentialKeyword });
        current += keywordLength;
        isKeyword = true;
        break;
      }
    }
    if (isKeyword) continue;

    // Handle identifiers (starting with $ or ending with [])
    if (char === "$" || /[A-Za-z_]/.test(char)) {
      let value = "";
      while (current < input.length && !/\s/.test(char)) {
        value += char;
        char = input[++current];
      }

      if (value.startsWith("$") || value.endsWith("[]")) {
        tokens.push({ type: TokenType.Identifier, value });
      } else if (/^(TRUE|FALSE)$/.test(value)) {
        tokens.push({ type: TokenType.Boolean, value });
      } else {
        io.stderr.push("Invalid token " + value);
      }
      continue;
    }

    // Handle unknown characters, in case our parser has a blindspot
    tokens.push({ type: TokenType.Unknown, value: char });
    current++;
  }

  return tokens;
}

function interpret(tokens: Token[]): Token[] {
  let interpretedStack: Token[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    const type = token.type;
    const value = token.value;

    switch (type) {
      case TokenType.Keyword:
        let controlFlowKeywords = Object.values(ControlFlow) as string[];
        if (controlFlowKeywords.includes(value)) {
          let a;
          switch (value) {
            case ControlFlow.IF:
              a = interpretedStack.pop();
              if (a?.type == TokenType.Boolean) {
                if (a.value == "TRUE") {
                  let trueExpr = tokens[index + 1];
                  if (trueExpr.type == TokenType.Group) {
                    let trueExprResult = interpret(tokenize(trueExpr.value));
                    interpretedStack = [...interpretedStack, ...trueExprResult];
                  } else {
                    io.stderr.push(
                      "Group expression expected but got " + a?.value
                    );
                  }
                  let hasElseStmt = false;
                  if (
                    index + 2 < tokens.length &&
                    tokens[index + 2].value == "ELSE"
                  ) {
                    hasElseStmt = true;
                  }
                  if (hasElseStmt) {
                    index += 4;
                  } else {
                    index += 2;
                  }
                  continue;
                } else if (a.value == "FALSE") {
                  let hasElseStmt = false;
                  if (
                    index + 2 < tokens.length &&
                    tokens[index + 2].value == "ELSE"
                  ) {
                    hasElseStmt = true;
                  }

                  if (hasElseStmt) {
                    let falseExpr = tokens[index + 3];
                    if (falseExpr.type == TokenType.Group) {
                      let falseExprResult = interpret(
                        tokenize(falseExpr.value)
                      );
                      interpretedStack = [
                        ...interpretedStack,
                        ...falseExprResult,
                      ];
                    } else {
                      io.stderr.push(
                        "Group expression expected but got " + a?.value
                      );
                    }

                    index += 4;
                    continue;
                  } else {
                    index += 2;
                    continue;
                  }
                }
              } else {
                io.stderr.push(
                  "Boolean expression expected but got " + a?.value
                );
              }
              break;

            case ControlFlow.ELSE:
              io.stderr.push(
                "ELSE keyword found with no corresponding IF statement preceeding it"
              );
              break;

            case ControlFlow.WHILE:
              let conditional = interpretedStack.pop();
              if (conditional?.type == TokenType.Boolean) {
                if (index + 1 >= tokens.length) {
                  io.stderr.push("WHILE statement has no body section");
                } else {
                  let whileStmtBody = tokens[index + 1];
                  if (whileStmtBody.type == TokenType.Group) {
                    if (conditional.value == "TRUE") {
                      let loopIndex = 0;
                      while (true) {
                        interpret(
                          tokenize(whileStmtBody.value)
                        );
                        if (breakLoopCount > 0) {
                          breakLoopCount--;
                          break;
                        }
                        if (loopIndex == maxLoopDepth && loopHaveMaxDepth) {
                          io.stderr.push(
                            "Exiting loop because max loop depth of " +
                              maxLoopDepth +
                              " has been reached... if you are sure this seeming infinite loop is intentional, disable `loopsHaveMaxDepth`"
                          );
                          break;
                        }
                        loopIndex++;
                      }

                      index += 2;
                      continue;
                    } else if (conditional.value == "FALSE") {
                      index += 2;
                      continue;
                    } else {
                      io.stderr.push(
                        "Boolean expression expected but got " + a?.value
                      );
                    }
                  } else {
                    io.stderr.push(
                      "Group expression expected but got " + a?.value
                    );
                  }
                }
              } else {
                io.stderr.push(
                  "Boolean expression expected but got " + a?.value
                );
              }
              break;

            case ControlFlow.BREAK:
              breakLoopCount++;
              break;

            case ControlFlow.REPEAT:
              let numberOfRepeats = interpretedStack.pop();
              if (numberOfRepeats?.type == TokenType.Number) {
                if (index + 1 >= tokens.length) {
                  io.stderr.push("REPEAT statement has no body section");
                } else {
                  let repeatStmtBody = tokens[index + 1];
                  if (repeatStmtBody.type == TokenType.Group) {
                    let j = Number(numberOfRepeats.value);
                    for (let i = 0; i < j; i++) {
                      interpret(tokenize(repeatStmtBody.value));

                      if (breakLoopCount > 0) {
                        breakLoopCount--;
                        break;
                      }
                      index += 2;
                      continue;
                    }
                  } else {
                    io.stderr.push(
                      "Group expression expected but got " + a?.value
                    );
                  }
                }
              } else {
                io.stderr.push(
                  "Boolean expression expected but got " + a?.value
                );
              }
              break;
          }
        } else {
          interpretedStack = evaluate(token, interpretedStack);
        }
        break;

      case TokenType.Boolean:
      case TokenType.String:
      case TokenType.Number:
        interpretedStack.push(token);
        break;

      case TokenType.Group:
        let groupTokens = tokenize(value);
        let stackResult = interpret(groupTokens);

        interpretedStack = [...interpretedStack, ...stackResult];
        break;

      case TokenType.Identifier:
        if (value.startsWith("$")) {
          //store op
          const variableName = value.substring(1, value.length);
          const variableValue = interpretedStack.pop();
          if (variableValue) {
            variableLookupTable.set(variableName, variableValue);
          } else {
            io.stderr.push(
              "No value present for variable assignment of " + variableName
            );
            //ERROR from trying to store nothing
          }
        } else if (value.endsWith("[]")) {
          //fetch op
          const variableName = value.substring(0, value.length - 2);
          const variableValue = variableLookupTable.get(variableName);

          if (variableValue) {
            interpretedStack.push(variableValue);
          } else {
            io.stderr.push(
              "Dereferenced variable `" +
                variableName +
                "` does not store anything and is undefined"
            );
          }
        } else {
          io.stderr.push("Invalid identifier `" + value + "` cant be parsed");
          //ERROR: invalid identifier syntax
        }
        break;
    }
    index++;
  }

  return interpretedStack;
}

function evaluate(command: Token, stack: Token[]): Token[] {
  const operation = command.value;

  let result = [...stack];

  if (
    stack.length < 2 &&
    (operation in Arithmetic ||
      operation in Comparison ||
      operation in Logic ||
      operation == StackOps.SWAP)
  ) {
    let err = `${operation} requires that the stack contains more than 1 content`;
    io.stderr.push(err);
    return result;
  }
  let a, b, c;

  function str2Bool(str: string): boolean | undefined {
    if (str == "TRUE") {
      return true;
    } else if (str == "FALSE") {
      return false;
    } else {
      io.stderr.push("Invalid Boolean Value " + str);
    }
  }

  switch (operation) {
    //arithmetic ops
    case Arithmetic.ADD:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a + b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    case Arithmetic.SUB:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a - b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    case Arithmetic.MUL:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a * b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    case Arithmetic.DIV:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a / b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    case Arithmetic.MOD:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a % b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    case Arithmetic.POW:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a ** b;

      result.push({ type: TokenType.Number, value: c.toString() });
      break;

    //comparison ops
    case Comparison.EQ:
      b = result.pop()?.value;
      a = result.pop()?.value;
      c = a === b;
      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Comparison.NE:
      b = result.pop()?.value;
      a = result.pop()?.value;
      c = a !== b;
      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Comparison.LT:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a < b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Comparison.GT:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a > b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Comparison.LE:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a <= b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Comparison.GE:
      b = Number(result.pop()?.value);
      a = Number(result.pop()?.value);
      c = a >= b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    //logical ops
    case Logic.AND:
      b = result.pop()?.value;
      a = result.pop()?.value;

      if (a && b) {
        b = str2Bool(b);
        a = str2Bool(a);
      }

      c = a && b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Logic.OR:
      b = result.pop()?.value;
      a = result.pop()?.value;

      if (a && b) {
        b = str2Bool(b);
        a = str2Bool(a);
      }
      c = a || b;

      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    case Logic.NOT:
      a = result.pop()?.value;
      if (a) {
        a = str2Bool(a);
      }
      c = !a;
      result.push({
        type: TokenType.Boolean,
        value: c ? "TRUE" : "FALSE",
      });
      break;

    //stack ops
    case StackOps.DUP:
      a = result[result.length - 1];
      result.push(a);
      break;

    case StackOps.SWAP:
      if (result.length < 2) {
        io.stderr.push("Insufficient operands to swap");
      }
      b = result.pop();
      a = result.pop();

      if (a && b) {
        result.push(b);
        result.push(a);
      }
      break;

    case StackOps.POP:
      result.pop();
      break;

    // IO ops
    case IOTokens.OUTPUT:
      let str = result.pop()?.value;
      if (str) {
        io.stdout.push(str);
      }
      break;

    case IOTokens.INPUT:
      if (io.stdin.length == 0) {
        io.stderr.push("No Input Provided In STDIN....");
      } else {
        let input = io.stdin.pop();
        if (input) {
          result.push({ type: TokenType.String, value: input });
        }
      }
      break;
  }

  return result;
}

export function compile(input: string): StackResult {
  let result: StackResult = {
    state: [],
    variableMap: new Map<string, Token>(),
    io: { stdin: [], stdout: [], stderr: [] },
  };
  const tokens = tokenize(input);
  result.state = interpret(tokens);
  result.variableMap = variableLookupTable;
  result.io = io;
  console.log(io);
  return result;
}

// io.stdin.push("20");
// io.stdin.push("1");

// const tokens = tokenize(sampleSrc);
// // console.log(tokens);
// console.log(interpret(tokens));

// if (io.stdout.length > 0) {
//   console.log("--------------------------------------------");
//   console.log("STDOUT: ");
//   for (let output of io.stdout) {
//     console.log(output);
//   }
//   console.log("--------------------------------------------");
// }

// if (io.stderr.length > 0) {
//   console.log("--------------------------------------------");
//   console.log("STDERR: ");
//   for (let err of io.stderr) {
//     console.log(err);
//   }
//   console.log("--------------------------------------------");
// }
