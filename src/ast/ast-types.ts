// src/ast/ast-types.ts

export type ASTNode =
  | ProgramNode
  | PrintNode
  | AssignNode
  | IfNode
  | IfElseNode
  | RepeatNode
  | WhileNode;

export type Expression =
  | LiteralNode
  | VariableNode
  | BinaryOpNode;

export interface ProgramNode {
  type: "program";
  body: ASTNode[];
}

export interface PrintNode {
  type: "print";
  value: Expression;
}

export interface AssignNode {
  type: "assign";
  name: string;
  value: Expression;
}

export interface IfNode {
  type: "if";
  condition: Expression;
  body: ASTNode[];
}

export interface IfElseNode {
  type: "ifelse";
  condition: Expression;
  body: ASTNode[];
  elseBody: ASTNode[];
}

export interface RepeatNode {
  type: "repeat";
  count: Expression;
  body: ASTNode[];
}

export interface WhileNode {
  type: "while";
  condition: Expression;
  body: ASTNode[];
}

export interface LiteralNode {
  type: "literal";
  value: string | number | boolean;
}

export interface VariableNode {
  type: "variable";
  name: string;
}

export interface BinaryOpNode {
  type: "binaryop";
  operator: "+" | "-" | "*" | "/" | "==" | "<" | ">" | string;
  left: Expression;
  right: Expression;
}