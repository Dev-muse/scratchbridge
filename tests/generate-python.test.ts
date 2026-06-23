import { describe, it, expect } from "vitest";
import { ProgramNode } from "../src/ast/ast-types";
import { generatePython } from "../src/codegen/generate-python";

describe("Python Code Generator", () => {
  // 1-3. Literals (Numbers, Strings, Booleans)
  it("should generate standard print blocks with numeric literals", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: 42 } }],
    };
    expect(generatePython(ast)).toBe("print(42)\n");
  });

  it("should format string literals properly wrapped in quotes", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: "hello" } }],
    };
    expect(generatePython(ast)).toBe('print("hello")\n');
  });

  it("should translate booleans to Python specific casing syntax", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "literal", value: true } }],
    };
    expect(generatePython(ast)).toBe("print(True)\n");
  });

  // 4. Variables
  it("should handle reading values using standard identifier names", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [{ type: "print", value: { type: "variable", name: "score" } }],
    };
    expect(generatePython(ast)).toBe("print(score)\n");
  });

  // 5-6. Assignments
  it("should properly structure simple assignments", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "assign",
          name: "high_score",
          value: { type: "literal", value: 100 },
        },
      ],
    };
    expect(generatePython(ast)).toBe("high_score = 100\n");
  });

  // 7-9. Binary Operators
  it("should safely group binary operational configurations", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "print",
          value: {
            type: "binaryop",
            operator: "+",
            left: { type: "literal", value: 10 },
            right: { type: "variable", name: "bonus" },
          },
        },
      ],
    };
    expect(generatePython(ast)).toBe("print((10 + bonus))\n");
  });

  it("should format logical comparison syntax strings safely", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "print",
          value: {
            type: "binaryop",
            operator: "==",
            left: { type: "variable", name: "counter" },
            right: { type: "literal", value: 0 },
          },
        },
      ],
    };
    expect(generatePython(ast)).toBe("print((counter == 0))\n");
  });

  // 10. Empty Control Blocks
  it("should handle structural blocks that contain zero instructions cleanly using pass", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        { type: "if", condition: { type: "literal", value: true }, body: [] },
      ],
    };
    expect(generatePython(ast)).toBe("if True:\n    pass\n");
  });

  // 11. If Statement
  it("should build simple single branch conditional statement flows with nested scopes", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "if",
          condition: { type: "literal", value: true },
          body: [
            { type: "print", value: { type: "literal", value: "working" } },
          ],
        },
      ],
    };
    expect(generatePython(ast)).toBe('if True:\n    print("working")\n');
  });

  // 12. If / Else Statement
  it("should construct dual branching structure trees smoothly", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "ifelse",
          condition: { type: "variable", name: "is_valid" },
          body: [{ type: "print", value: { type: "literal", value: 1 } }],
          elseBody: [{ type: "print", value: { type: "literal", value: 0 } }],
        },
      ],
    };
    expect(generatePython(ast)).toBe(
      "if is_valid:\n    print(1)\nelse:\n    print(0)\n",
    );
  });

  // 13. Repeat Loop
  it("should handle custom execution ranges cleanly within standard range blocks", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "repeat",
          count: { type: "literal", value: 5 },
          body: [
            { type: "print", value: { type: "literal", value: "looping" } },
          ],
        },
      ],
    };
    expect(generatePython(ast)).toBe(
      'for _ in range(5):\n    print("looping")\n',
    );
  });

  // 14. While Loop
  it("should output standard while condition templates cleanly", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "while",
          condition: { type: "variable", name: "running" },
          body: [
            {
              type: "assign",
              name: "running",
              value: { type: "literal", value: false },
            },
          ],
        },
      ],
    };
    expect(generatePython(ast)).toBe("while running:\n    running = False\n");
  });

  // 15. Nested Architecture Structures
  it("should scale deep logic configurations smoothly", () => {
    const ast: ProgramNode = {
      type: "program",
      body: [
        {
          type: "assign",
          name: "x",
          value: { type: "literal", value: 5 },
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
                right: { type: "literal", value: 2 },
              },
              body: [{ type: "print", value: { type: "variable", name: "x" } }],
            },
          ],
        },
      ],
    };

    const expected = [
      "x = 5",
      "for _ in range(3):",
      "    if (x > 2):",
      "        print(x)",
      "",
    ].join("\n");

    expect(generatePython(ast)).toBe(expected);
  });
});
