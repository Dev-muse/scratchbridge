// src/ast/validate-ast.ts
import { ASTNode, Expression, ProgramNode } from "./ast-types";

export interface ValidationError {
  message: string;
  nodeType: string;
}

export function validateAST(program: ProgramNode): ValidationError[] {
  const errors: ValidationError[] = [];
  analyzeNodes(program.body, errors);
  return errors;
}

function analyzeNodes(nodes: ASTNode[], errors: ValidationError[]): void {
  for (const node of nodes) {
    switch (node.type) {
      case "print":
        analyzeExpression(node.value, node.type, errors);
        break;

      case "assign":
        if (!node.name || node.name.trim() === "") {
          errors.push({
            message: "Variable assignment target name cannot be empty.",
            nodeType: node.type
          });
        }
        analyzeExpression(node.value, node.type, errors);
        break;

      case "if":
        analyzeExpression(node.condition, node.type, errors);
        analyzeNodes(node.body, errors);
        break;

      case "ifelse":
        analyzeExpression(node.condition, node.type, errors);
        analyzeNodes(node.body, errors);
        analyzeNodes(node.elseBody, errors);
        break;

      case "repeat":
        // Look for explicit negative literal values right away
        if (node.count.type === "literal" && typeof node.count.value === "number" && node.count.value < 0) {
          errors.push({
            message: `Repeat loop execution count cannot be negative (${node.count.value}).`,
            nodeType: node.type
          });
        }
        analyzeExpression(node.count, node.type, errors);
        analyzeNodes(node.body, errors);
        break;

      case "while":
        analyzeExpression(node.condition, node.type, errors);
        analyzeNodes(node.body, errors);
        break;

      case "program":
        analyzeNodes(node.body, errors);
        break;

      default: {
        const _exhaustiveCheck: never = node;
        throw new Error(`Unhandled AST node validation structure: ${_exhaustiveCheck}`);
      }
    }
  }
}

function analyzeExpression(expr: Expression, parentNodeType: string, errors: ValidationError[]): void {
  switch (expr.type) {
    case "literal":
      break;

    case "variable":
      if (!expr.name || expr.name.trim() === "") {
        errors.push({
          message: "Variable evaluation reference name identifier cannot be empty.",
          nodeType: parentNodeType
        });
      }
      break;

    case "binaryop":
      // Detect static divide by zero compile-time vulnerabilities
      if (expr.operator === "/" && expr.right.type === "literal" && expr.right.value === 0) {
        errors.push({
          message: "Mathematical evaluation contains an invalid division by zero operational sequence.",
          nodeType: parentNodeType
        });
      }
      analyzeExpression(expr.left, parentNodeType, errors);
      analyzeExpression(expr.right, parentNodeType, errors);
      break;

    default: {
      const _exhaustiveCheck: never = expr;
      throw new Error(`Unhandled expression validation shape: ${_exhaustiveCheck}`);
    }
  }
}