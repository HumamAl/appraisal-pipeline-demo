"use client";

import { useState } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

export function StartupBeforeAfter() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSolution(false)}
          className="text-xs font-mono px-2.5 py-1 border transition-colors duration-[80ms]"
          style={{
            borderColor: !showSolution
              ? "color-mix(in oklch, var(--destructive) 40%, transparent)"
              : "var(--border)",
            backgroundColor: !showSolution
              ? "color-mix(in oklch, var(--destructive) 8%, transparent)"
              : "transparent",
            color: !showSolution ? "var(--destructive)" : "var(--muted-foreground)",
            borderRadius: "var(--radius)",
          }}
        >
          Current
        </button>
        <button
          onClick={() => setShowSolution(true)}
          className="text-xs font-mono px-2.5 py-1 border transition-colors duration-[80ms]"
          style={{
            borderColor: showSolution
              ? "color-mix(in oklch, var(--success) 40%, transparent)"
              : "var(--border)",
            backgroundColor: showSolution
              ? "color-mix(in oklch, var(--success) 8%, transparent)"
              : "transparent",
            color: showSolution ? "var(--success)" : "var(--muted-foreground)",
            borderRadius: "var(--radius)",
          }}
        >
          Fixed
        </button>
      </div>

      {!showSolution ? (
        <div
          className="rounded-[var(--radius)] border p-4 space-y-2"
          style={{
            borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
          }}
        >
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
            Manual startup — error-prone
          </p>
          {[
            "Terminal 1: uvicorn app:app --reload",
            "Wait... is it ready? Check logs manually",
            "Terminal 2: pnpm dev",
            "Hope Vite connects before timeout",
            "Backend restarts? Vite disconnects silently",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--destructive)" }} />
              <span className="text-sm font-mono" style={{ color: "var(--destructive)" }}>{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-[var(--radius)] border p-4 space-y-2"
          style={{
            borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
          }}
        >
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
            Orchestrated startup — deterministic
          </p>
          {[
            "pnpm dev — single command, no terminals",
            "Script spawns uvicorn, polls /health endpoint",
            "Vite starts only after backend is ready",
            "SIGTERM handler cleans up both processes",
            "Restart detection re-queues Vite hot-reload",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
              <span className="text-sm font-mono" style={{ color: "var(--success)" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
