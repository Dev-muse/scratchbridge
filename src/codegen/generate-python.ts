// src/codegen/generate-python.ts
import { ASTNode, Expression, ProgramNode } from "../ast/ast-types";
import { indent } from "./indent";

export function generatePython(program: ProgramNode): string {
  return walkNodes(program.body, 0);
}

function walkNodes(nodes: ASTNode[], depth: number): string {
  if (nodes.length === 0) {
    return indent(depth) + "pass\n";
  }

  let code = "";
  for (const node of nodes) {
    switch (node.type) {
      case "print":
        code += indent(depth) + `print(${generateExpression(node.value)})\n`;
        break;

      case "assign":
        code += indent(depth) + `${node.name} = ${generateExpression(node.value)}\n`;
        break;

      case "if":
        code += indent(depth) + `if ${generateExpression(node.condition)}:\n`;
        code += walkNodes(node.body, depth + 1);
        break;

      case "ifelse":
        code += indent(depth) + `if ${generateExpression(node.condition)}:\n`;
        code += walkNodes(node.body, depth + 1);
        code += indent(depth) + "else:\n";
        code += walkNodes(node.elseBody, depth + 1);
        break;

      case "repeat":
        code += indent(depth) + `for _ in range(${generateExpression(node.count)}):\n`;
        code += walkNodes(node.body, depth + 1);
        break;

      case "while":
        code += indent(depth) + `while ${generateExpression(node.condition)}:\n`;
        code += walkNodes(node.body, depth + 1);
        break;

      case "program":
        code += walkNodes(node.body, depth);
        break;

      default: {
        // Strict compile-time check ensuring all ASTNode types are fully handled
        const _exhaustiveCheck: never = node;
        throw new Error(`Unhandled AST node structure: ${_exhaustiveCheck}`);
      }
    }
  }
  return code;
}

function generateExpression(expr: Expression): string {
  switch (expr.type) {
    case "literal":
      if (typeof expr.value === "boolean") {
        return expr.value ? "True" : "False";
      }
      if (typeof expr.value === "string") {
        return `"${expr.value}"`;
      }
      return String(expr.value);

    case "variable":
      return expr.name;

    case "binaryop": {
      const leftStr = generateExpression(expr.left);
      const rightStr = generateExpression(expr.right);
      return `(${leftStr} ${expr.operator} ${rightStr})`;
    }

    default: {
      const _exhaustiveCheck: never = expr;
      throw new Error(`Unhandled expression shape: ${_exhaustiveCheck}`);
    }
  }
}