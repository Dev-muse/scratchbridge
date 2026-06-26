// src/codegen/generate-javascript.ts
import { ASTNode, Expression, ProgramNode } from "../ast/ast-types";
import { indent } from "./indent";

export function generateJavaScript(program: ProgramNode): string {
  return walkNodes(program.body, 0);
}

function walkNodes(nodes: ASTNode[], depth: number): string {
  let code = "";
  for (const node of nodes) {
    switch (node.type) {
      case "print":
        code +=
          indent(depth) + `console.log(${generateExpression(node.value)});\n`;
        break;

      case "assign":
        // Using let for block-scoped variable declarations as per our language goals
        code +=
          indent(depth) +
          `let ${node.name} = ${generateExpression(node.value)};\n`;
        break;

      case "if":
        code +=
          indent(depth) + `if (${generateExpression(node.condition)}) {\n`;
        code += walkNodes(node.body, depth + 1);
        code += indent(depth) + "}\n";
        break;

      case "ifelse":
        code +=
          indent(depth) + `if (${generateExpression(node.condition)}) {\n`;
        code += walkNodes(node.body, depth + 1);
        code += indent(depth) + "} else {\n";
        code += walkNodes(node.elseBody, depth + 1);
        code += indent(depth) + "}\n";
        break;

      case "repeat": {
        // Use simple 'i' at the top level, otherwise append the depth number
        const loopVar = depth === 0 ? "i" : `i${depth}`;
        const countStr = generateExpression(node.count);
        code +=
          indent(depth) +
          `for (let ${loopVar} = 0; ${loopVar} < ${countStr}; ${loopVar}++) {\n`;
        code += walkNodes(node.body, depth + 1);
        code += indent(depth) + "}\n";
        break;
      }

      case "while":
        code +=
          indent(depth) + `while (${generateExpression(node.condition)}) {\n`;
        code += walkNodes(node.body, depth + 1);
        code += indent(depth) + "}\n";
        break;

      case "program":
        code += walkNodes(node.body, depth);
        break;

      default: {
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
