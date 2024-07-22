export enum Arithmetic {
  ADD = "+",
  SUB = "-",
  MUL = "*",
  DIV = "/",
  MOD = "%",
  POW = "**",
}

export enum Comparison {
  EQ = "=",
  NE = "!=",
  LT = "<",
  GT = ">",
  LE = "<=",
  GE = ">=",
}

export enum Logic {
  AND = "&",
  OR = "||",
  NOT = "!",
}

export enum ControlFlow {
  IF = "IF",
  ELSE = "ELSE",
  WHILE = "WHILE",
  REPEAT = "REPEAT",
  BREAK = "BREAK",
}

export enum IOTokens {
  OUTPUT = "ECHO",
  INPUT = "TAKE",
}

export enum StackOps {
  POP = "POP",
  DUP = "DUP",
  SWAP = "SWAP",
}

export enum Group {
  BEGIN = "(",
  END = ")",
}

export enum TokenType {
  Keyword, //0
  Number, //1
  String, //2
  Boolean, //3
  Group, //4
  Identifier, //5
  Unknown //6
}

export const allOperators: { [key: string]: string } = {
  ...Arithmetic,
  ...Comparison,
  ...Logic,
  ...ControlFlow,
  ...IOTokens,
  ...StackOps,
  ...Group,
};

export type Token = {
  type: TokenType;
  value: string;
};


export interface IO {
  stdin: string[];
  stdout: string[];
  stderr: string[];
}


export interface StackResult {
  state: Token[];
  variableMap: Map<string, Token>;
  io: IO;
}