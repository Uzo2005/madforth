const allOperators = {
  "+": "Add top two stack values",
  "-": "Subtract top two stack values",
  "*": "Multiply top two stack values",
  "/": "Divide top two stack values",
  "%": "Modulo of top two stack values",
  "**": "Exponentiation of top two stack values",
  "=": "Check equality of top two stack values",
  "!=": "Check inequality of top two stack values",
  "<": "Less than comparison of top two stack values",
  ">": "Greater than comparison of top two stack values",
  "<=": "Less than or equal comparison of top two stack values",
  ">=": "Greater than or equal comparison of top two stack values",
  "&": "Logical AND of top two stack values",
  "||": "Logical OR of top two stack values",
  "!": "Logical NOT of top stack value",
  IF: "Execute block if top stack value is true",
  ELSE: "Alternative execution block for IF",
  WHILE: "Repeat block while top stack value is true",
  REPEAT: "Execute block n times (n from top stack value)",
  BREAK: "Exit current loop or block",
  ECHO: "Output top stack value",
  TAKE: "Read input to stack",
  POP: "Remove top stack value",
  DUP: "Duplicate top stack value",
  SWAP: "Swap top two stack values",
  "(": "Begin code block or subexpression",
  ")": "End code block or subexpression",
  TRUE: "Boolean True",
  FALSE: "Boolean False",
};

import Operator from "./Operator";
const OperatorBox = () => {
  return (
    <div className="grid grid-cols-3 gap-2 *:col-span-1 h-fit">
      {(Object.keys(allOperators) as Array<keyof typeof allOperators>).map(
        (operator, index) => {
          return (
            <Operator
              key={index}
              explanation={allOperators[operator]}
              tokenValue={operator}
            />
          );
        }
      )}
    </div>
  );
};

export default OperatorBox;
