import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-4">
        Welcome to ScratchBridge
      </h1>
      <p className="max-w-md text-lg text-slate-600 mb-8">
        Bridge the gap between visual puzzle blocks and real-world Python or JavaScript syntax code.
      </p>
      <Link
        href="/editor"
        className="rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
      >
        Start Coding →
      </Link>
    </main>
  );
}