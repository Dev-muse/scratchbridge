// tests/generate-javascript.test.ts
import { describe, it, expect } from "vitest";
import { ProgramNode } from "../src/ast/ast-types";
import { generateJavaScript } from "../src/codegen/generate-javascript";

describe("JavaScript Code Generator", () => {
  it("should generate console.log with numeric literals", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: 42 } }]
    };
    expect(generateJavaScript(ast)).toBe("console.log(42);\n");
  });

  it("should format string literals properly inside double quotes", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: "hello" } }]
    };
    expect(generateJavaScript(ast)).toBe('console.log("hello");\n');
  });

  it("should translate booleans to lowercase JavaScript syntax tokens", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: true } }]
    };
    expect(generateJavaScript(ast)).toBe("console.log(true);\n");
  });

  it("should handle reading values using identifiers", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "variable", name: "score" } }]
    };
    expect(generateJavaScript(ast)).toBe("console.log(score);\n");
  });

  it("should properly declare variables using let keywords", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "assign", name: "highScore", value: { type: "literal", value: 100 } }]
    };
    expect(generateJavaScript(ast)).toBe("let highScore = 100;\n");
  });

  it("should group binary operational groupings in parenthetical containers", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "print",
          value: {
            type: "binaryop",
            operator: "+",
            left: { type: "literal", value: 10 },
            right: { type: "variable", name: "bonus" }
          }
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe("console.log((10 + bonus));\n");
  });

  it("should render comparison operator expressions without variation", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "print",
          value: {
            type: "binaryop",
            operator: "==",
            left: { type: "variable", name: "counter" },
            right: { type: "literal", value: 0 }
          }
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe("console.log((counter == 0));\n");
  });

  it("should create empty if statement structures cleanly without crash loops", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "if", condition: { type: "literal", value: true }, body: [] }]
    };
    expect(generateJavaScript(ast)).toBe("if (true) {\n}\n");
  });

  it("should build structured single branch conditional layouts", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "if",
          condition: { type: "literal", value: true },
          body: [{ type: "print", value: { type: "literal", value: "working" } }]
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe('if (true) {\n    console.log("working");\n}\n');
  });

  it("should construct dual branching if/else configurations safely", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "ifelse",
          condition: { type: "variable", name: "isValid" },
          body: [{ type: "print", value: { type: "literal", value: 1 } }],
          elseBody: [{ type: "print", value: { type: "literal", value: 0 } }]
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe("if (isValid) {\n    console.log(1);\n} else {\n    console.log(0);\n}\n");
  });

  it("should produce a standard for-loop implementation for repeat blocks", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "repeat",
          count: { type: "literal", value: 5 },
          body: [{ type: "print", value: { type: "literal", value: "looping" } }]
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe('for (let i0 = 0; i0 < 5; i0++) {\n    console.log("looping");\n}\n');
  });

  it("should safely output standard while loops", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "while",
          condition: { type: "variable", name: "running" },
          body: [{ type: "assign", name: "running", value: { type: "literal", value: false } }]
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe("while (running) {\n    let running = false;\n}\n");
  });

  it("should support nested programs safely without emitting duplicates", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "program",
          body: [{ type: "print", value: { type: "literal", value: "nested" } }]
        }
      ]
    };
    expect(generateJavaScript(ast)).toBe('console.log("nested");\n');
  });

  it("should run deep nested repeat blocks with distinct counter iterators", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "repeat",
          count: { type: "literal", value: 2 },
          body: [
            {
              type: "repeat",
              count: { type: "literal", value: 3 },
              body: [{ type: "print", value: { type: "literal", value: "inner" } }]
            }
          ]
        }
      ]
    };
    const expected = [
      "for (let i0 = 0; i0 < 2; i0++) {",
      "    for (let i1 = 0; i1 < 3; i1++) {",
      '        console.log("inner");',
      "    }",
      "}",
      ""
    ].join("\n");
    expect(generateJavaScript(ast)).toBe(expected);
  });

  it("should process deep combined logical layouts smoothly", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "assign",
          name: "x",
          value: { type: "literal", value: 5 }
        },
        {
          type: "repeat",
          count: { type: "literal", value: 3 },
          body: [
            {
              type: "if",
              condition: {
                type: "binaryop",
                operator: ">",
                left: { type: "variable", name: "x" },
                right: { type: "literal", value: 2 }
              },
              body: [{ type: "print", value: { type: "variable", name: "x" } }]
            }
          ]
        }
      ]
    };

    const expected = [
      "let x = 5;",
      "for (let i0 = 0; i0 < 3; i0++) {",
      "    if ((x > 2)) {",
      "        console.log(x);",
      "    }",
      "}",
      ""
    ].join("\n");

    expect(generateJavaScript(ast)).toBe(expected);
  });
});