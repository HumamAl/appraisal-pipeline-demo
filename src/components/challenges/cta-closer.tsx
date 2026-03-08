"use client";

import Link from "next/link";

export function CtaCloser() {
  return (
    <section
      className="rounded-[var(--radius)] border p-5"
      style={{
        borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
        backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold">Ready to fix the pipeline?</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            These are solvable bugs. Happy to walk through how I&apos;d approach each one on a short call.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-[80ms]"
          >
            See the proposal →
          </Link>
          <span
            className="text-xs font-mono font-medium px-3 py-1.5 rounded-[var(--radius)] border"
            style={{
              backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
              borderColor: "color-mix(in oklch, var(--primary) 25%, transparent)",
              color: "var(--primary)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}
