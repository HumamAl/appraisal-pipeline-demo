"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Database, MapPin, Cpu, Image, Brain, GitMerge, FileText, Zap } from "lucide-react";
import type { PipelineRun, ValuationResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const PHASE_ICONS: Record<string, React.ElementType> = {
  "Data Ingestion": Database,
  "Enrichment": Zap,
  "Geocoding": MapPin,
  "Feature Extraction": Cpu,
  "Image Analysis": Image,
  "AVM Modeling": Brain,
  "Comp Selection": GitMerge,
  "Narrative Generation": FileText,
};

function PhaseStatusDot({ status }: { status: string }) {
  if (status === "Running") {
    return (
      <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ background: "oklch(0.62 0.16 78 / 0.5)" }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "var(--status-running)" }} />
      </span>
    );
  }
  if (status === "Completed") {
    return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-success shrink-0" />;
  }
  if (status === "Cached") {
    return (
      <span
        className="inline-flex h-2.5 w-2.5 rounded-full shrink-0"
        style={{ background: "var(--status-cached)" }}
      />
    );
  }
  if (status === "Failed") {
    return (
      <span
        className="inline-flex h-2.5 w-2.5 rounded-sm shrink-0"
        style={{ background: "var(--destructive)", animation: "phase-blink 1s step-end infinite" }}
      />
    );
  }
  if (status === "Skipped") {
    return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/30 shrink-0" />;
  }
  // Pending
  return (
    <span className="inline-flex h-2.5 w-2.5 rounded-full border border-muted-foreground/40 shrink-0" />
  );
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function PhaseStatusClass(status: string): string {
  switch (status) {
    case "Running": return "phase-running";
    case "Completed": return "phase-completed";
    case "Cached": return "phase-cached";
    case "Failed": return "phase-failed";
    default: return "phase-pending";
  }
}

interface PipelinePhaseDetailProps {
  run: PipelineRun;
  valuation?: ValuationResult;
  orderAddress: string;
}

export function PipelinePhaseDetail({ run, valuation, orderAddress }: PipelinePhaseDetailProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const allCompleted = run.phases.every(
    (p) => p.status === "Completed" || p.status === "Cached" || p.status === "Skipped"
  );
  const hasFailed = run.phases.some((p) => p.status === "Failed");

  return (
    <div className="flex flex-col h-full">
      {/* Run header */}
      <div className="px-4 py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Active Run</p>
            <p className="text-sm font-semibold truncate mt-0.5">{orderAddress}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="mono-value text-xs">{run.runId}</p>
            {run.totalDuration !== null ? (
              <p className="mono-value text-xs mt-0.5">{formatDuration(run.totalDuration)} total</p>
            ) : (
              <p className="mono-value text-xs mt-0.5 phase-running">running…</p>
            )}
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-0">
          {run.phases.map((phase, idx) => {
            const Icon = PHASE_ICONS[phase.name] ?? Database;
            const isExpanded = expandedPhase === phase.phaseId;
            const isLast = idx === run.phases.length - 1;
            const hasDetail = phase.errorMessage || phase.cached || phase.duration !== null;

            return (
              <div key={phase.phaseId} className={cn("phase-rail", isLast && "last")}>
                <div
                  className={cn(
                    "flex items-start gap-3 py-2 pl-1 cursor-pointer group",
                    "aesthetic-hover rounded-sm"
                  )}
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.phaseId)}
                >
                  {/* Phase status dot — positioned to sit on the rail */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5" style={{ width: "1.5rem" }}>
                    <PhaseStatusDot status={phase.status} />
                  </div>

                  {/* Phase info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className={cn("h-3 w-3 shrink-0", PhaseStatusClass(phase.status))} />
                        <span className={cn("text-xs font-medium", PhaseStatusClass(phase.status))}>
                          {phase.name}
                        </span>
                        {phase.cached && (
                          <span
                            className="text-[10px] px-1 rounded-sm border shrink-0"
                            style={{
                              color: "var(--status-cached)",
                              borderColor: "var(--status-cached)",
                              opacity: 0.8,
                            }}
                          >
                            cached
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="mono-value text-xs">
                          {formatDuration(phase.duration)}
                        </span>
                        {hasDetail && (
                          <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" style={{ transitionDuration: "var(--dur-fast)" }}>
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && hasDetail && (
                  <div
                    className="ml-9 mb-2 text-xs rounded-sm border p-2.5"
                    style={{
                      background: phase.errorMessage
                        ? "oklch(0.62 0.16 27 / 0.05)"
                        : "var(--muted)",
                      borderColor: phase.errorMessage
                        ? "oklch(0.62 0.16 27 / 0.25)"
                        : "var(--border)",
                    }}
                  >
                    {phase.errorMessage ? (
                      <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--destructive)" }}>
                        {phase.errorMessage}
                      </p>
                    ) : phase.cached ? (
                      <p className="text-muted-foreground">
                        Result served from cache — skipped recompute.
                        {phase.duration !== null && ` Saved ~${Math.round(phase.duration * 8)}s vs. fresh run.`}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">
                        Completed in <span className="mono-value">{phase.duration}s</span>.
                        {phase.startedAt && (
                          <> Started {new Date(phase.startedAt).toLocaleTimeString()}.</>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reconciled value — shown when run is fully complete */}
        {allCompleted && !hasFailed && valuation && (
          <div
            className="mt-4 p-3 rounded-sm border"
            style={{
              borderColor: "var(--success)",
              background: "oklch(0.62 0.19 145 / 0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-success">Reconciled Value</p>
              <p className="mono-value text-base font-bold" style={{ color: "var(--success)", fontSize: "1rem" }}>
                ${valuation.reconciledValue.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4 mb-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Confidence</p>
                <p className="mono-value text-xs font-semibold">{valuation.confidence}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">FSD</p>
                <p className="mono-value text-xs font-semibold">{valuation.fsd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Range</p>
                <p className="mono-value text-xs font-semibold">
                  ${Math.round(valuation.valueRangeLow / 1000)}K–${Math.round(valuation.valueRangeHigh / 1000)}K
                </p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-2 mt-1">
              {valuation.narrativeExcerpt}
            </p>
          </div>
        )}

        {/* Failed run — failure summary */}
        {hasFailed && (
          <div
            className="mt-4 p-3 rounded-sm border"
            style={{
              borderColor: "oklch(0.58 0.24 27 / 0.4)",
              background: "oklch(0.58 0.24 27 / 0.05)",
            }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--destructive)" }}>
              Pipeline halted — see error above
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Downstream phases were skipped. Correct the error and re-queue the order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
