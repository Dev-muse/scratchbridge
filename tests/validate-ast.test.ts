// tests/validate-ast.test.ts
import { describe, it, expect } from "vitest";
import { ProgramNode } from "../src/ast/ast-types";
import { validateAST } from "../src/ast/validate-ast";

describe("AST Semantic Analyzer Validator", () => {
  it("should return an empty errors list for clean code configurations", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "assign",
          name: "total",
          value: { type: "literal", value: 10 }
        }
      ]
    };
    const errors = validateAST(ast);
    expect(errors.length).toBe(0);
  });

  it("should flag clear division by zero evaluation bugs", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "print",
          value: {
            type: "binaryop",
            operator: "/",
            left: { type: "literal", value: 100 },
            right: { type: "literal", value: 0 }
          }
        }
      ]
    };
    const errors = validateAST(ast);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("division by zero");
  });

  it("should reject repeat blocks containing negative loop counts", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "repeat",
          count: { type: "literal", value: -5 },
          body: [{ type: "print", value: { type: "literal", value: "error" } }]
        }
      ]
    };
    const errors = validateAST(ast);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("cannot be negative");
  });
});