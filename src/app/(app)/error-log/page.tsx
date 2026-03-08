"use client";

import { useState, useMemo } from "react";
import { errorLog } from "@/data/mock-data";
import type { ErrorSeverity } from "@/lib/types";

type SeverityFilter = "all" | ErrorSeverity;
type SortKey = "timestamp" | "severity" | "orderId";

const SEVERITY_ORDER: Record<ErrorSeverity, number> = {
  critical: 0,
  error: 1,
  warning: 2,
  info: 3,
};

const SEVERITY_CONFIG: Record<
  ErrorSeverity,
  { label: string; colorClass: string; dotClass: string }
> = {
  critical: {
    label: "Critical",
    colorClass: "text-destructive bg-destructive/10 border-destructive/40 font-bold",
    dotClass: "bg-destructive",
  },
  error: {
    label: "Error",
    colorClass: "text-destructive bg-destructive/10 border-destructive/30",
    dotClass: "bg-destructive",
  },
  warning: {
    label: "Warning",
    colorClass: "text-[color:var(--warning)] bg-warning/10 border-warning/30",
    dotClass: "bg-[color:var(--warning)]",
  },
  info: {
    label: "Info",
    colorClass: "text-muted-foreground bg-muted border-border",
    dotClass: "bg-muted-foreground",
  },
};

const FILTER_TABS: { value: SeverityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "error", label: "Error" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
];

function SeverityBadge({ severity }: { severity: ErrorSeverity }) {
  const cfg = SEVERITY_CONFIG[severity];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm border ${cfg.colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function phaseName(phaseId: string): string {
  const phaseMap: Record<string, string> = {
    "1": "Data Ingestion",
    "2": "Enrichment",
    "3": "Geocoding",
    "4": "Feature Extraction",
    "5": "Image Analysis",
    "6": "AVM Modeling",
    "7": "Comp Selection",
    "8": "Narrative Generation",
  };
  const parts = phaseId.split("_");
  const n = parts[parts.length - 1];
  return phaseMap[n] ?? phaseId;
}

export default function ErrorLogPage() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [resolvedFilter, setResolvedFilter] = useState<"all" | "open" | "resolved">("all");
  const [localResolved, setLocalResolved] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(errorLog.map((e) => [e.errorId, e.resolved]))
  );

  const displayed = useMemo(() => {
    return errorLog
      .filter((e) => {
        if (severityFilter !== "all" && e.severity !== severityFilter) return false;
        if (resolvedFilter === "open" && localResolved[e.errorId]) return false;
        if (resolvedFilter === "resolved" && !localResolved[e.errorId]) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "timestamp") cmp = a.timestamp.localeCompare(b.timestamp);
        else if (sortKey === "severity") cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        else if (sortKey === "orderId") cmp = a.orderId.localeCompare(b.orderId);
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [severityFilter, resolvedFilter, sortKey, sortDir, localResolved]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function toggleResolved(id: string) {
    setLocalResolved((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const openCount = errorLog.filter((e) => !localResolved[e.errorId]).length;
  const criticalCount = errorLog.filter(
    (e) => e.severity === "critical" && !localResolved[e.errorId]
  ).length;

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-border ml-0.5 text-[10px]">↕</span>;
    return <span className="text-primary ml-0.5 text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Error Log</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pipeline phase diagnostics, geocoding failures, and AVM warnings
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 text-destructive font-medium">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              {criticalCount} critical open
            </span>
          )}
          <span className="text-muted-foreground">
            <span className="mono-value text-foreground font-medium">{openCount}</span> open of{" "}
            <span className="mono-value text-foreground font-medium">{errorLog.length}</span> total
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Severity filter tabs */}
        <div className="flex items-center gap-0.5">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? errorLog.length
                : errorLog.filter((e) => e.severity === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setSeverityFilter(tab.value)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                  severityFilter === tab.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-hover)]"
                }`}
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                {tab.label}
                <span className="ml-1 mono-value text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Resolved filter */}
        <div className="flex items-center gap-0.5 ml-auto">
          {(["all", "open", "resolved"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setResolvedFilter(v)}
              className={`text-xs px-2 py-1 rounded-sm border capitalize transition-colors ${
                resolvedFilter === v
                  ? "bg-muted border-border text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              {v}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-muted-foreground">
          {displayed.length} {displayed.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Table */}
      <div className="linear-card overflow-hidden" style={{ padding: 0 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  className="text-left px-3 py-2 text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  style={{ transitionDuration: "var(--dur-fast)" }}
                  onClick={() => toggleSort("timestamp")}
                >
                  Timestamp <SortIcon k="timestamp" />
                </th>
                <th
                  className="text-left px-3 py-2 text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  style={{ transitionDuration: "var(--dur-fast)" }}
                  onClick={() => toggleSort("orderId")}
                >
                  Order ID <SortIcon k="orderId" />
                </th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">
                  Pipeline Phase
                </th>
                <th
                  className="text-left px-3 py-2 text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  style={{ transitionDuration: "var(--dur-fast)" }}
                  onClick={() => toggleSort("severity")}
                >
                  Severity <SortIcon k="severity" />
                </th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">
                  Diagnostic Message
                </th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">
                  Resolved
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No pipeline errors match this filter.
                  </td>
                </tr>
              ) : (
                displayed.map((entry) => {
                  const resolved = localResolved[entry.errorId];
                  return (
                    <tr
                      key={entry.errorId}
                      className={`border-b border-border/40 transition-colors hover:bg-[color:var(--surface-hover)] ${resolved ? "opacity-50" : ""}`}
                      style={{ transitionDuration: "var(--dur-fast)" }}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="mono-value">{formatTimestamp(entry.timestamp)}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="mono-value text-primary">{entry.orderId}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                        {phaseName(entry.phaseId)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <SeverityBadge severity={entry.severity} />
                      </td>
                      <td className="px-3 py-2 max-w-md">
                        <span
                          className={`font-mono text-[10px] leading-relaxed break-words ${
                            entry.severity === "critical" || entry.severity === "error"
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {entry.message}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => toggleResolved(entry.errorId)}
                          title={resolved ? "Mark as open" : "Mark as resolved"}
                          className={`w-4 h-4 rounded-sm border transition-all inline-flex items-center justify-center ${
                            resolved
                              ? "bg-[color:var(--success)] border-success/60"
                              : "border-border hover:border-primary"
                          }`}
                          style={{ transitionDuration: "var(--dur-fast)" }}
                        >
                          {resolved && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostic code reference */}
      <div className="linear-card flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] text-muted-foreground" style={{ padding: "var(--card-padding-sm)" }}>
        <span className="font-medium text-foreground text-xs">Diagnostic codes:</span>
        <span><span className="mono-value">ADDR_NOT_FOUND</span> — USPS AMS geocoding miss</span>
        <span><span className="mono-value">GEOCODE_PARCEL_MISS</span> — County assessor miss</span>
        <span><span className="mono-value">LOW_COMP_DENSITY</span> — Thin market, &lt;3 comps/mi</span>
        <span><span className="mono-value">HIGH_GROSS_ADJ</span> — FNMA 25% guideline exceeded</span>
        <span><span className="mono-value">IMAGE_SERVICE_TIMEOUT</span> — Street View API failure</span>
        <span><span className="mono-value">OUTLIER_COMP_DETECTED</span> — &gt;2 SD from neighborhood median</span>
      </div>
    </div>
  );
}
