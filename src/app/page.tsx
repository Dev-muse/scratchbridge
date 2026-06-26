// src/app/page.tsx
"use client";

import { useState } from "react";
import { ProgramNode, ASTNode } from "../ast/ast-types";
import { generatePython } from "../codegen/generate-python";
import { generateJavaScript } from "../codegen/generate-javascript";
import { validateAST } from "../ast/validate-ast";

// Cleaned up UI Block type: Removed the "while" string literal stub
interface UIBlock {
  id: string;
  type: "print" | "assign" | "repeat";
  stringParam?: string; 
  numParam?: number;    
  valueType?: "string" | "number";
}

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"python" | "javascript">("python");
  const [blocks, setBlocks] = useState<UIBlock[]>([
    { id: "init-1", type: "assign", stringParam: "counter", numParam: 0, valueType: "number" },
    { id: "init-2", type: "repeat", numParam: 5 }
  ]);

  // --- DERIVED STATE ---
  const astBody: ASTNode[] = blocks.map((b) => {
    switch (b.type) {
      case "print":
        return {
          type: "print",
          value: { type: "literal", value: b.stringParam !== undefined ? b.stringParam : "Hello!" }
        };
        
      case "assign":
        return {
          type: "assign",
          name: b.stringParam && b.stringParam.trim() !== "" ? b.stringParam : "variableName",
          value: { type: "literal", value: b.numParam ?? 0 }
        };
        
      case "repeat":
        return {
          type: "repeat",
          count: { type: "literal", value: b.numParam ?? 1 },
          body: [{ type: "print", value: { type: "literal", value: "Looping!" } }]
        };

      default:
        return {
          type: "print",
          value: { type: "literal", value: "" }
        };
    }
  });

  const program: ProgramNode = { type: "program", body: astBody };

  const errors = validateAST(program);
  const pythonCode = generatePython(program);
  const jsCode = generateJavaScript(program);

  // Toolbox actions
  const addBlock = (type: UIBlock["type"]) => {
    const newBlock: UIBlock = {
      id: `block-${Date.now()}`,
      type,
      stringParam: type === "print" ? "Hello World!" : type === "assign" ? "variableName" : undefined,
      numParam: type === "assign" ? 10 : type === "repeat" ? 3 : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updatedFields: Partial<UIBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded bg-indigo-500 shadow-sm shadow-indigo-500/50" />
          <h1 className="text-lg font-bold tracking-tight text-white">ScratchBridge Workspace</h1>
        </div>
        
        {/* Error / Status Indicator */}
        <div className="flex items-center space-x-2 text-xs bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
          {errors.length > 0 ? (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-medium">{errors.length} Analysis Errors Detected</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Compiler Engine Synchronized</span>
            </>
          )}
        </div>
      </header>

      {/* Main Interactive Editor Workspace */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Leftmost Sticky Block Toolbox Tray */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Block Toolbox</h2>
          
          <button 
            onClick={() => addBlock("print")}
            className="flex items-center space-x-3 w-full p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 cursor-pointer text-left transition"
          >
            <span className="bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded text-xs font-bold">▶</span>
            <span>Print Block</span>
          </button>

          <button 
            onClick={() => addBlock("assign")}
            className="flex items-center space-x-3 w-full p-3 rounded-lg border border-amber-500/20 bg-amber-950/30 text-amber-400 text-sm font-medium hover:bg-amber-500/10 cursor-pointer text-left transition"
          >
            <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-xs font-bold">=</span>
            <span>Assign Variable</span>
          </button>

          <button 
            onClick={() => addBlock("repeat")}
            className="flex items-center space-x-3 w-full p-3 rounded-lg border border-indigo-500/20 bg-indigo-950/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/10 cursor-pointer text-left transition"
          >
            <span className="bg-indigo-500 text-slate-950 px-1.5 py-0.5 rounded text-xs font-bold">⟳</span>
            <span>Repeat Loop</span>
          </button>
        </aside>

        {/* Middle Canvas: Active Block Construction Workspace */}
        <section className="flex flex-1 flex-col bg-slate-900/40 relative overflow-y-auto border-r border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Active Workspace Canvas</span>
            <span className="text-xs text-slate-500">{blocks.length} blocks active</span>
          </div>

          {blocks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/10 p-8 text-center max-w-sm">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your canvas is completely blank! Click any block archetype on the left sidebar tray to load it into your editor stack.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-xl">
              {blocks.map((block) => (
                <div 
                  key={block.id}
                  className={`flex items-center justify-between p-4 rounded-xl shadow-md border transition duration-150 ${
                    block.type === "print" ? "bg-cyan-950/40 border-cyan-500/30" :
                    block.type === "assign" ? "bg-amber-950/40 border-amber-500/30" :
                    "bg-indigo-950/40 border-indigo-500/30"
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded text-slate-950 uppercase ${
                      block.type === "print" ? "bg-cyan-400" :
                      block.type === "assign" ? "bg-amber-400" : "bg-indigo-400"
                    }`}>
                      {block.type}
                    </span>

                    <div className="flex items-center space-x-2 flex-1">
                      {block.type === "print" && (
                        <>
                          <span className="text-xs text-slate-400 font-medium">text:</span>
                          <input
                            type="text"
                            value={block.stringParam || ""}
                            onChange={(e) => updateBlock(block.id, { stringParam: e.target.value })}
                            className="bg-slate-950 text-slate-100 text-sm px-2.5 py-1 rounded-md border border-slate-800 focus:outline-none focus:border-cyan-400 w-full max-w-xs"
                          />
                        </>
                      )}

                      {block.type === "assign" && (
                        <>
                          <span className="text-xs text-slate-400 font-medium">var:</span>
                          <input
                            type="text"
                            value={block.stringParam || ""}
                            onChange={(e) => updateBlock(block.id, { stringParam: e.target.value })}
                            className="bg-slate-950 text-slate-100 text-sm px-2 py-1 rounded-md border border-slate-800 focus:outline-none focus:border-amber-400 w-24"
                          />
                          <span className="text-xs text-slate-400 font-medium">=</span>
                          <input
                            type="number"
                            value={block.numParam ?? ""}
                            onChange={(e) => updateBlock(block.id, { numParam: parseInt(e.target.value) || 0 })}
                            className="bg-slate-950 text-slate-100 text-sm px-2 py-1 rounded-md border border-slate-800 focus:outline-none focus:border-amber-400 w-20"
                          />
                        </>
                      )}

                      {block.type === "repeat" && (
                        <>
                          <span className="text-xs text-slate-400 font-medium">count:</span>
                          <input
                            type="number"
                            value={block.numParam ?? ""}
                            onChange={(e) => updateBlock(block.id, { numParam: parseInt(e.target.value) || 0 })}
                            className="bg-slate-950 text-slate-100 text-sm px-2 py-1 rounded-md border border-slate-800 focus:outline-none focus:border-indigo-400 w-20"
                          />
                          <span className="text-xs text-slate-400/60 font-medium ml-2">times ➔ [print warning]</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteBlock(block.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs p-1 cursor-pointer transition font-mono ml-4"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Validation Warnings Feedback Tray */}
          {errors.length > 0 && (
            <div className="absolute bottom-4 left-6 right-6 bg-rose-950/80 border border-rose-500/30 p-4 rounded-xl shadow-lg backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">Compilation Intercept Warnings</h4>
              <ul className="space-y-1">
                {errors.map((err, idx) => (
                  <li key={idx} className="text-xs text-rose-200/90 font-mono flex items-center space-x-2">
                    <span>•</span>
                    <span>{err.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right Side View Pane */}
        <section className="flex w-[480px] min-w-[380px] flex-col bg-slate-950">
          <div className="flex h-10 items-center border-b border-slate-800 bg-slate-950 px-2">
            <button
              onClick={() => setActiveTab("python")}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all duration-150 cursor-pointer ${
                activeTab === "python"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Python Output Preview
            </button>
            <button
              onClick={() => setActiveTab("javascript")}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all duration-150 cursor-pointer ${
                activeTab === "javascript"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              JavaScript Output Preview
            </button>
          </div>

          <div className="flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed bg-slate-950 selection:bg-indigo-500/30">
            {activeTab === "python" ? (
              <pre className="text-emerald-400/95">{pythonCode || "# No execution nodes active"}</pre>
            ) : (
              <pre className="text-amber-400/95">{jsCode || "// No execution nodes active"}</pre>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}