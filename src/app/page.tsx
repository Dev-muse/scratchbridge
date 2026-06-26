// src/app/page.tsx
"use client";

import { useState } from "react";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"python" | "javascript">("python");

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header Banner */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded bg-indigo-500 shadow-sm shadow-indigo-500/50" />
          <h1 className="text-lg font-bold tracking-tight text-white">ScratchBridge Workspace</h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Compiler Engine Active</span>
        </div>
      </header>

      {/* Split Double View Pane Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side View Pane: Visual Scratch Block Editor Space */}
        <section className="flex flex-1 flex-col bg-slate-900/50 relative border-r border-slate-800">
          <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-950/40 px-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Visual Block Editor</span>
          </div>
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/20 p-8 text-center max-w-sm shadow-inner">
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag-and-drop block workbench coming up next. Your visual programming logic stack will settle right here.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side View Pane: Target Code Compilation Output Preview */}
        <section className="flex w-[450px] min-w-[350px] flex-col bg-slate-950">
          {/* Code Tabs Header Section */}
          <div className="flex h-10 items-center border-b border-slate-800 bg-slate-950 px-2">
            <button
              onClick={() => setActiveTab("python")}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all duration-150 cursor-pointer ${
                activeTab === "python"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Python Output
            </button>
            <button
              onClick={() => setActiveTab("javascript")}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all duration-150 cursor-pointer ${
                activeTab === "javascript"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              JavaScript Output
            </button>
          </div>

          {/* Compilation Text Output Panel */}
          <div className="flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed bg-slate-950 text-indigo-200 selection:bg-indigo-500/30">
            {activeTab === "python" ? (
              <pre className="text-emerald-400/90">
                {`# Compiled Python Output Preview\n# Your block logic converts here in real-time\n\nprint("Hello from ScratchBridge!")`}
              </pre>
            ) : (
              <pre className="text-amber-400/90">
                {`// Compiled JavaScript Output Preview\n// Your block logic converts here in real-time\n\nconsole.log("Hello from ScratchBridge!");`}
              </pre>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}