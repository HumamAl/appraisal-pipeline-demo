"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  appraisalOrders,
  pipelineRuns,
  dashboardStats,
  getRunByOrderId,
  getValuationByOrderId,
} from "@/data/mock-data";
import type { AppraisalOrder, AppraisalOrderStatus } from "@/lib/types";

const PipelinePhaseDetail = dynamic(
  () =>
    import("@/components/dashboard/pipeline-phase-detail").then(
      (m) => m.PipelinePhaseDetail
    ),
  { ssr: false, loading: () => <div className="h-full bg-muted/30 animate-pulse" /> }
);

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  AppraisalOrderStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  Completed: {
    label: "Completed",
    dotClass: "bg-success",
    textClass: "text-success",
  },
  Running: {
    label: "Running",
    dotClass: "bg-primary animate-pulse",
    textClass: "text-[color:var(--status-running)]",
  },
  Queued: {
    label: "Queued",
    dotClass: "bg-muted-foreground/50",
    textClass: "text-muted-foreground",
  },
  Failed: {
    label: "Failed",
    dotClass: "bg-destructive",
    textClass: "text-destructive",
  },
  "Needs Review": {
    label: "Review",
    dotClass: "bg-warning",
    textClass: "text-warning",
  },
};

const ALL_STATUSES: (AppraisalOrderStatus | "All")[] = [
  "All",
  "Running",
  "Completed",
  "Failed",
  "Needs Review",
  "Queued",
];

// ── Metric strip item ─────────────────────────────────────────────────────────
function MetricItem({
  label,
  value,
  suffix,
  delta,
  index,
}: {
  label: string;
  value: number;
  suffix?: string;
  delta?: number;
  index: number;
}) {
  // Store the value * 10 internally to preserve one decimal place during animation
  const intTarget = Math.round(value * 10);
  const { count, ref } = useCountUp(intTarget, 800 + index * 80);

  const displayValue =
    suffix === "min" || suffix === "%"
      ? (count / 10).toFixed(1)
      : Math.round(count / 10).toLocaleString();

  return (
    <div
      className="flex flex-col gap-0.5 px-4 py-2 border-r border-border/40 last:border-r-0 shrink-0"
      style={{
        animation: `fade-up-in 150ms ease-out ${index * 50}ms both`,
      }}
    >
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium whitespace-nowrap">
        {label}
      </span>
      <span ref={ref} className="mono-value font-bold" style={{ fontSize: "1.0625rem" }}>
        {displayValue}
        {suffix && (
          <span className="text-xs font-normal ml-0.5 text-muted-foreground">{suffix}</span>
        )}
      </span>
      {delta !== undefined && (
        <span
          className="text-[10px] font-medium"
          style={{ color: delta >= 0 ? "var(--success)" : "var(--destructive)" }}
        >
          {delta >= 0 ? "+" : ""}
          {delta}% vs prior
        </span>
      )}
    </div>
  );
}

// ── Session row ───────────────────────────────────────────────────────────────
function SessionRow({
  order,
  isSelected,
  onClick,
  index,
}: {
  order: AppraisalOrder;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-border/30 last:border-b-0",
        "transition-colors border-l-2",
        isSelected
          ? "bg-primary/5 border-l-primary"
          : "border-l-transparent hover:bg-surface-hover"
      )}
      style={{
        transitionDuration: "var(--dur-fast)",
        animation: `fade-up-in 120ms ease-out ${index * 30}ms both`,
      }}
    >
      <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dotClass)} />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate leading-tight">
          {order.subjectAddress}
        </p>
        <p className="mono-value text-[11px] leading-tight mt-0.5 truncate">
          {order.orderId} · {order.city}, {order.state}
        </p>
      </div>

      <div className="text-right shrink-0">
        {order.estimatedValue !== null ? (
          <p className="mono-value text-xs font-semibold">
            ${Math.round(order.estimatedValue / 1000)}K
          </p>
        ) : (
          <p className="mono-value text-xs text-muted-foreground">—</p>
        )}
        {order.confidence !== null ? (
          <p
            className="text-[10px] font-medium"
            style={{
              color:
                order.confidence >= 80
                  ? "var(--success)"
                  : order.confidence >= 65
                  ? "var(--warning)"
                  : "var(--destructive)",
            }}
          >
            {order.confidence}% conf
          </p>
        ) : (
          <p className={cn("text-[10px]", cfg.textClass)}>{cfg.label}</p>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PipelineMonitorPage() {
  const [statusFilter, setStatusFilter] = useState<AppraisalOrderStatus | "All">("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("APR-8791");

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return appraisalOrders;
    return appraisalOrders.filter((o) => o.status === statusFilter);
  }, [statusFilter]);

  const selectedOrder = useMemo(
    () => appraisalOrders.find((o) => o.orderId === selectedOrderId) ?? appraisalOrders[0],
    [selectedOrderId]
  );

  const selectedRun = useMemo(
    () => getRunByOrderId(selectedOrderId) ?? pipelineRuns[0],
    [selectedOrderId]
  );

  const selectedValuation = useMemo(
    () => getValuationByOrderId(selectedOrderId),
    [selectedOrderId]
  );

  // If filter removes selected order, auto-select first in filtered list
  useEffect(() => {
    if (
      filteredOrders.length > 0 &&
      !filteredOrders.find((o) => o.orderId === selectedOrderId)
    ) {
      setSelectedOrderId(filteredOrders[0].orderId);
    }
  }, [filteredOrders, selectedOrderId]);

  const stats = dashboardStats;

  return (
    <div
      className="flex flex-col"
      style={{
        padding: "var(--content-padding)",
        gap: "var(--section-gap)",
        minHeight: 0,
      }}
    >
      {/* ── Metrics strip ─────────────────────────────────────────── */}
      <div
        className="aesthetic-card flex flex-wrap items-stretch overflow-hidden"
        style={{ padding: 0 }}
      >
        <MetricItem
          label="Orders (MTD)"
          value={stats.totalOrders}
          delta={stats.ordersChange}
          index={0}
        />
        <MetricItem
          label="Avg Confidence"
          value={stats.avgConfidence}
          suffix="%"
          delta={stats.confidenceChange}
          index={1}
        />
        <MetricItem
          label="Straight-Through"
          value={stats.straightThroughRate}
          suffix="%"
          delta={stats.straightThroughChange}
          index={2}
        />
        <MetricItem
          label="Avg Turnaround"
          value={stats.avgTurnaroundMin}
          suffix="min"
          delta={stats.turnaroundChange}
          index={3}
        />
        <MetricItem
          label="Pending Review"
          value={stats.pendingReview}
          delta={stats.pendingReviewChange}
          index={4}
        />
        <MetricItem
          label="AVM Hit Rate"
          value={stats.hitRate}
          suffix="%"
          delta={stats.hitRateChange}
          index={5}
        />
      </div>

      {/* ── Two-panel layout ──────────────────────────────────────── */}
      <div className="flex gap-3" style={{ minHeight: "520px" }}>

        {/* Left panel — session list (40%) */}
        <div
          className="aesthetic-card flex flex-col overflow-hidden shrink-0"
          style={{ width: "40%", minWidth: "260px" }}
        >
          <div className="px-3 py-2 border-b border-border/50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Session Runs
              </p>
              <span className="mono-value text-[10px]">
                {filteredOrders.length}/{appraisalOrders.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ALL_STATUSES.map((s) => {
                const isActive = statusFilter === s;
                const cfg = s !== "All" ? STATUS_CONFIG[s as AppraisalOrderStatus] : null;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                    style={{ transitionDuration: "var(--dur-fast)" }}
                  >
                    {cfg && (
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dotClass)} />
                    )}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground py-8">
                No {statusFilter} orders
              </div>
            ) : (
              filteredOrders.map((order, idx) => (
                <SessionRow
                  key={order.orderId}
                  order={order}
                  isSelected={order.orderId === selectedOrderId}
                  onClick={() => setSelectedOrderId(order.orderId)}
                  index={idx}
                />
              ))
            )}
          </div>
        </div>

        {/* Right panel — pipeline phase detail (60%) */}
        <div
          className="aesthetic-card flex-1 flex flex-col overflow-hidden"
          style={{ minWidth: 0 }}
        >
          {selectedRun ? (
            <PipelinePhaseDetail
              run={selectedRun}
              valuation={selectedValuation}
              orderAddress={`${selectedOrder.subjectAddress}, ${selectedOrder.city} ${selectedOrder.state}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Select a session to view pipeline detail
            </div>
          )}
        </div>
      </div>

      {/* ── Conversion banner ────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-sm border px-4 py-3"
        style={{
          borderColor: "oklch(0.62 0.16 78 / 0.25)",
          background: "oklch(0.62 0.16 78 / 0.04)",
        }}
      >
        <div>
          <p className="text-sm font-medium">
            Live demo built for{" "}
            <span className="text-primary">
              {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
