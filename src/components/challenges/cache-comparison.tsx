// NO "use client" — pure JSX, no hooks

import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

interface CacheRow {
  phase: string;
  withoutCache: string;
  withCache: string;
}

const cacheRows: CacheRow[] = [
  { phase: "Data Ingestion", withoutCache: "4.2s", withCache: "<50ms" },
  { phase: "Enrichment", withoutCache: "8.7s", withCache: "<50ms" },
  { phase: "Geocoding", withoutCache: "2.1s", withCache: "<50ms" },
  { phase: "Feature Extraction", withoutCache: "5.4s", withCache: "<50ms" },
  { phase: "AVM Modeling", withoutCache: "42–90s", withCache: "<200ms" },
];

export function CacheComparison() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-1 items-center">
        <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">Phase</p>
        <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground text-right">Without cache</p>
        <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground px-1"></p>
        <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground text-right">With cache</p>

        {cacheRows.map((row) => (
          <Fragment key={row.phase}>
            <p className="text-xs font-mono text-foreground py-1">{row.phase}</p>
            <p
              className="text-xs font-mono text-right tabular-nums py-1"
              style={{ color: "var(--destructive)" }}
            >
              {row.withoutCache}
            </p>
            <ArrowRight className="h-3 w-3 text-muted-foreground mx-auto" />
            <p
              className="text-xs font-mono text-right tabular-nums py-1"
              style={{ color: "var(--success)" }}
            >
              {row.withCache}
            </p>
          </Fragment>
        ))}
      </div>

      <div
        className="flex items-start gap-2 rounded-[var(--radius)] border px-3 py-2"
        style={{
          borderColor: "color-mix(in oklch, var(--primary) 25%, transparent)",
          backgroundColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
        }}
      >
        <p className="text-xs font-mono text-muted-foreground">
          Cache key:{" "}
          <span className="mono-value">sha256(orderId + phaseId + inputHash)</span>
          {" "}— normalized across restarts so completed phases survive server bounces.
        </p>
      </div>
    </div>
  );
}
