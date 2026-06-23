// tests/ast-compile.test.ts
import { describe, expect, it } from "vitest";
import { ProgramNode } from "../src/ast/ast-types";

// This mirrors the section 5 example: x = 5; repeat 3 { print(x) }
const mockProgram: ProgramNode = {
  type: "program",
  body: [
    {
      type: "assign",
      name: "x",
      value: {
        type: "literal",
        value: 5
      }
    },
    {
      type: "repeat",
      count: {
        type: "literal",
        value: 3
      },
      body: [
        {
          type: "print",
          value: {
            type: "variable",
            name: "x"
          }
        }
      ]
    }
  ]
};

describe("AST Type Compilation Check", () => {
  it("should compile and allow manual AST construction structural matching", () => {
    expect(mockProgram.type).toBe("program");
    expect(mockProgram.body.length).toBe(2);
  });
});