"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  monthlyMetrics,
  phaseDurationBreakdown,
} from "@/data/mock-data";

const OrderVolumeChart = dynamic(
  () => import("@/components/dashboard/avm-charts").then((m) => m.OrderVolumeChart),
  { ssr: false }
);
const ConfidenceTrendChart = dynamic(
  () => import("@/components/dashboard/avm-charts").then((m) => m.ConfidenceTrendChart),
  { ssr: false }
);
const PhaseDurationChart = dynamic(
  () => import("@/components/dashboard/avm-charts").then((m) => m.PhaseDurationChart),
  { ssr: false }
);
const ConfidenceDistributionChart = dynamic(
  () => import("@/components/dashboard/avm-charts").then((m) => m.ConfidenceDistributionChart),
  { ssr: false }
);
const PropertyTypeChart = dynamic(
  () => import("@/components/dashboard/avm-charts").then((m) => m.PropertyTypeChart),
  { ssr: false }
);

type PeriodKey = "3m" | "6m" | "12m";

// Summary stats derived from monthlyMetrics
const latest = monthlyMetrics[monthlyMetrics.length - 1];
const prev    = monthlyMetrics[monthlyMetrics.length - 2];

const summaryStats = [
  {
    label: "Avg Confidence",
    value: `${latest.avgConfidence.toFixed(1)}%`,
    delta: +(latest.avgConfidence - prev.avgConfidence).toFixed(1),
    unit: "pp vs prev month",
    invertDelta: false,
  },
  {
    label: "AVM Hit Rate",
    value: `${latest.hitRate.toFixed(1)}%`,
    delta: +(latest.hitRate - prev.hitRate).toFixed(1),
    unit: "pp vs prev month",
    invertDelta: false,
  },
  {
    label: "Avg Turnaround",
    value: `${latest.avgTurnaroundMin.toFixed(1)} min`,
    delta: +(latest.avgTurnaroundMin - prev.avgTurnaroundMin).toFixed(1),
    unit: "min vs prev",
    invertDelta: true,
  },
  {
    label: "Straight-Through Rate",
    value: `${latest.completionRate.toFixed(1)}%`,
    delta: +(latest.completionRate - prev.completionRate).toFixed(1),
    unit: "pp vs prev month",
    invertDelta: false,
  },
  {
    label: "Order Volume",
    value: latest.orderVolume.toLocaleString(),
    delta: latest.orderVolume - prev.orderVolume,
    unit: "orders vs prev",
    invertDelta: false,
  },
];

// Bottleneck phase
const bottleneck = [...phaseDurationBreakdown].sort(
  (a, b) => b.p95DurationSec - a.p95DurationSec
)[0];

export default function AvmAnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>("12m");

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AVM Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Model performance trends, phase latency, and confidence distribution
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {(["3m", "6m", "12m"] as PeriodKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setPeriod(k)}
              className={`px-2.5 py-1 rounded-sm border transition-colors ${
                period === k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-hover)]"
              }`}
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--grid-gap)]">
        {summaryStats.map((s) => {
          const positive = s.invertDelta ? (s.delta ?? 0) < 0 : (s.delta ?? 0) > 0;
          const negative = s.invertDelta ? (s.delta ?? 0) > 0 : (s.delta ?? 0) < 0;
          return (
            <div key={s.label} className="linear-card" style={{ padding: "var(--card-padding-sm)" }}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
              <p className="mono-value text-lg font-semibold text-foreground">{s.value}</p>
              <p
                className={`text-[10px] mt-0.5 ${
                  positive ? "text-[color:var(--success)]" : negative ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {(s.delta ?? 0) > 0 ? "+" : ""}
                {s.delta} {s.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottleneck callout */}
      <div className="linear-card flex items-center gap-3 text-xs" style={{ padding: "var(--card-padding-sm)", borderColor: "oklch(0.75 0.18 85 / 0.4)" }}>
        <span className="text-[10px] px-1.5 py-0.5 bg-warning/10 text-[color:var(--warning)] border border-warning/30 rounded-sm font-medium uppercase tracking-wide">Bottleneck</span>
        <span className="font-medium">{bottleneck.phase}</span>
        <span className="text-muted-foreground">P95 latency:</span>
        <span className="mono-value font-semibold text-foreground">{bottleneck.p95DurationSec}s</span>
        <span className="text-muted-foreground">(avg: {bottleneck.avgDurationSec}s)</span>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--grid-gap)]">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm font-semibold mb-0.5">Monthly Order Volume</p>
          <p className="text-[10px] text-muted-foreground mb-3">Total appraisal orders vs. 750/mo target</p>
          <OrderVolumeChart />
        </div>

        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm font-semibold mb-0.5">AVM Confidence Trend</p>
          <p className="text-[10px] text-muted-foreground mb-3">Rolling avg model confidence vs. 80% threshold</p>
          <ConfidenceTrendChart />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--grid-gap)]">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm font-semibold mb-0.5">Phase Duration Breakdown</p>
          <p className="text-[10px] text-muted-foreground mb-3">Avg vs. P95 per pipeline phase (seconds)</p>
          <PhaseDurationChart />
        </div>

        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm font-semibold mb-0.5">Confidence Distribution</p>
          <p className="text-[10px] text-muted-foreground mb-3">Orders by confidence bucket — current period</p>
          <ConfidenceDistributionChart />
        </div>
      </div>

      {/* Property type chart */}
      <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
        <p className="text-sm font-semibold mb-0.5">Property Type Volume &amp; Confidence</p>
        <p className="text-[10px] text-muted-foreground mb-3">
          Order count and avg AVM confidence by FNMA property type classification
        </p>
        <PropertyTypeChart />
      </div>

      {/* Phase latency table */}
      <div className="linear-card overflow-hidden" style={{ padding: 0 }}>
        <div className="px-3 py-2 border-b border-border bg-muted/40 flex items-center justify-between">
          <p className="text-xs font-semibold">Phase Latency Detail</p>
          <p className="text-[10px] text-muted-foreground">All durations in seconds</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-1.5 text-muted-foreground font-medium">Pipeline Phase</th>
                <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">Avg (s)</th>
                <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">P95 (s)</th>
                <th className="px-3 py-1.5 text-muted-foreground font-medium w-32">P95 Bar</th>
              </tr>
            </thead>
            <tbody>
              {phaseDurationBreakdown.map((ph) => {
                const maxP95 = Math.max(...phaseDurationBreakdown.map((p) => p.p95DurationSec));
                const pct = (ph.p95DurationSec / maxP95) * 100;
                const isBottleneckRow = ph.p95DurationSec === maxP95;
                return (
                  <tr
                    key={ph.phase}
                    className="border-b border-border/40 hover:bg-[color:var(--surface-hover)] transition-colors"
                    style={{ transitionDuration: "var(--dur-fast)" }}
                  >
                    <td className="px-3 py-1.5 font-medium">
                      {ph.phase}
                      {isBottleneckRow && (
                        <span className="ml-2 text-[9px] px-1 py-0.5 bg-warning/10 text-[color:var(--warning)] border border-warning/30 rounded-sm">
                          BOTTLENECK
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right mono-value">{ph.avgDurationSec}</td>
                    <td className="px-3 py-1.5 text-right mono-value">{ph.p95DurationSec}</td>
                    <td className="px-3 py-1.5 w-32">
                      <div className="h-2 bg-muted rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all"
                          style={{
                            width: `${pct}%`,
                            background: isBottleneckRow
                              ? "oklch(0.75 0.18 85)"
                              : "oklch(0.62 0.16 78)",
                            transitionDuration: "var(--dur-normal)",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
