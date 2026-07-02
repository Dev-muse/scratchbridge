# ScratchBridge

> Bridge the gap between visual puzzle blocks and real-world code.

ScratchBridge is an interactive, browser-based workspace that lets you assemble visual programming blocks and instantly see the equivalent **Python** or **JavaScript** output — live, with semantic validation as you build.

---

## Features

- **Visual Block Editor** — toolbox with Print, Assign Variable, and Repeat Loop blocks
- **Live Code Preview** — every block change instantly re-generates Python and JavaScript output side-by-side
- **AST-Backed Architecture** — UI interactions map to a typed Abstract Syntax Tree (AST), keeping codegen and validation cleanly separated
- **Semantic Validation** — real-time detection of empty variable names, negative repeat counts, and static divide-by-zero errors
- **Dual Language Output** — toggle between Python and JavaScript previews with a single click
- **TypeScript Throughout** — fully typed AST nodes, expressions, and codegen pipeline

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| Unit Tests | Vitest |
| E2E Tests | Playwright |

---

## Project Structure

```
src/
├── app/
│   └── page.tsx          # Main workspace UI (block editor + live preview)
├── ast/
│   ├── ast-types.ts      # TypeScript types for the AST
│   └── validate-ast.ts   # Semantic validator (empty names, div/0, negative counts)
└── codegen/
    ├── generate-python.ts
    └── generate-javascript.ts

tests/
├── generate-javascript.test.ts
└── validate-ast.test.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start local dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Unit tests in watch mode |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm lint` | Lint the codebase |

---

## How It Works

1. **Add blocks** from the toolbox on the left panel
2. **Configure** each block inline (variable name, value, repeat count, print text)
3. The UI state is **derived into an AST** on every render
4. The AST is **validated** for semantic errors (shown in the header and a warning tray)
5. The AST is **compiled** to Python and JavaScript, displayed live in the right panel

---

## Semantic Validation

The validator (`validate-ast.ts`) catches these errors at edit-time:

| Rule | Example |
|---|---|
| Empty variable name | Assign block with blank name field |
| Negative repeat count | Repeat block set to `-5` |
| Static divide-by-zero | `100 / 0` binary expression |

---

## License

MIT
test shh
