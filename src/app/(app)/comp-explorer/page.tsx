"use client";

import { useState, useMemo } from "react";
import {
  comparableSales,
  subjectProperties,
  appraisalOrders,
  getCompsByOrderId,
  getPropertyByOrderId,
  getValuationByOrderId,
} from "@/data/mock-data";
import type { ComparableSale, SubjectProperty } from "@/lib/types";

// Only orders that have subject property + at least 2 comps
const VIEWABLE_ORDER_IDS = ["APR-8841", "APR-8807", "APR-8833"];

function fmt(n: number, prefix = "") {
  return prefix + n.toLocaleString("en-US");
}

function fmtAdj(n: number) {
  if (n === 0) return <span className="text-muted-foreground">—</span>;
  const color = n > 0 ? "text-[color:var(--success)]" : "text-destructive";
  return (
    <span className={`mono-value ${color}`}>
      {n > 0 ? "+" : ""}${Math.abs(n).toLocaleString()}
    </span>
  );
}

function FlagBadge({ reason }: { reason?: string }) {
  return (
    <span
      title={reason}
      className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-sm border border-warning/40 text-[color:var(--warning)] bg-warning/10 cursor-help"
    >
      FLAG
    </span>
  );
}

function GrossAdjCell({ pct }: { pct: number }) {
  const flagged = pct > 25;
  return (
    <span
      className={`mono-value ${
        flagged
          ? "text-destructive font-semibold"
          : pct > 15
          ? "text-[color:var(--warning)]"
          : ""
      }`}
    >
      {pct.toFixed(1)}%{flagged && <span className="ml-1 text-[10px]">▲</span>}
    </span>
  );
}

function SimilarityCell({ score }: { score: number }) {
  const flagged = score < 0.7;
  return (
    <span className={`mono-value ${flagged ? "text-[color:var(--warning)]" : "text-[color:var(--success)]"}`}>
      {(score * 100).toFixed(0)}%
    </span>
  );
}

const ROWS: {
  label: string;
  subjectKey?: keyof SubjectProperty;
  render?: (comp: ComparableSale, subject: SubjectProperty) => React.ReactNode;
  renderSubject?: (subject: SubjectProperty) => React.ReactNode;
  mono?: boolean;
}[] = [
  {
    label: "Address",
    render: (c) => (
      <span className="text-xs text-foreground leading-tight">{c.address}</span>
    ),
    renderSubject: (s) => (
      <span className="text-xs leading-tight">{s.address}, {s.city} {s.state} {s.zip}</span>
    ),
  },
  {
    label: "Sale Price",
    render: (c) => <span className="mono-value">${c.salePrice.toLocaleString()}</span>,
    renderSubject: (s) =>
      s.listPrice ? (
        <span className="mono-value text-primary">${s.listPrice.toLocaleString()} (list)</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Sale Date",
    render: (c) => <span className="mono-value">{c.saleDate}</span>,
    renderSubject: () => <span className="text-muted-foreground text-xs">N/A</span>,
  },
  {
    label: "GLA (sq ft)",
    render: (c) => <span className="mono-value">{c.gla.toLocaleString()}</span>,
    renderSubject: (s) => <span className="mono-value">{s.gla.toLocaleString()}</span>,
  },
  {
    label: "Lot Size (sq ft)",
    render: (c, s) => <span className="mono-value">{s.lotSize.toLocaleString()}</span>,
    renderSubject: (s) => <span className="mono-value">{s.lotSize.toLocaleString()}</span>,
  },
  {
    label: "Beds / Baths",
    render: (c, s) => <span className="mono-value">{s.bedrooms} / {s.bathrooms}</span>,
    renderSubject: (s) => <span className="mono-value">{s.bedrooms} / {s.bathrooms}</span>,
  },
  {
    label: "Year Built",
    render: (c, s) => <span className="mono-value">{s.yearBuilt}</span>,
    renderSubject: (s) => <span className="mono-value">{s.yearBuilt}</span>,
  },
  {
    label: "Condition (UAD)",
    render: (c, s) => <span className="mono-value">{s.conditionCode}</span>,
    renderSubject: (s) => <span className="mono-value">{s.conditionCode}</span>,
  },
  { label: "— ADJUSTMENTS —", render: () => null, renderSubject: () => null },
  {
    label: "GLA Adj",
    render: (c) => fmtAdj(c.glaAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  {
    label: "Lot Size Adj",
    render: (c) => fmtAdj(c.lotSizeAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  {
    label: "Condition Adj",
    render: (c) => fmtAdj(c.conditionAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  {
    label: "Bathroom Adj",
    render: (c) => fmtAdj(c.bathroomAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  {
    label: "Garage Adj",
    render: (c) => fmtAdj(c.garageAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  {
    label: "Time/Market Adj",
    render: (c) => fmtAdj(c.timeAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">base</span>,
  },
  { label: "— RECONCILIATION —", render: () => null, renderSubject: () => null },
  {
    label: "Net Adjustment",
    render: (c) => fmtAdj(c.netAdj),
    renderSubject: () => <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    label: "Gross Adj %",
    render: (c) => <GrossAdjCell pct={c.grossAdjPct} />,
    renderSubject: () => <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    label: "Indicated Value",
    render: (c) => (
      <span className="mono-value font-semibold text-foreground">
        ${c.adjustedValue.toLocaleString()}
      </span>
    ),
    renderSubject: () => <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    label: "Similarity Score",
    render: (c) => <SimilarityCell score={c.similarityScore} />,
    renderSubject: () => <span className="text-muted-foreground text-xs">subject</span>,
  },
  {
    label: "Distance (mi)",
    render: (c) => <span className="mono-value">{c.distance.toFixed(2)}</span>,
    renderSubject: () => <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    label: "Selected",
    render: (c) => (
      <span className={`text-xs font-medium ${c.selected ? "text-[color:var(--success)]" : "text-muted-foreground"}`}>
        {c.selected ? "Yes" : "No"}
      </span>
    ),
    renderSubject: () => <span className="text-muted-foreground text-xs">—</span>,
  },
];

export default function CompExplorerPage() {
  const [selectedOrderId, setSelectedOrderId] = useState(VIEWABLE_ORDER_IDS[0]);

  const subject = getPropertyByOrderId(selectedOrderId);
  const comps = getCompsByOrderId(selectedOrderId).slice(0, 3);
  const valuation = getValuationByOrderId(selectedOrderId);
  const order = appraisalOrders.find((o) => o.orderId === selectedOrderId);

  const compCount = comps.length;

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Comp Explorer</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            UAD-compliant comparable sales grid — FNMA 1004/70 adjustment worksheet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Order:</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="text-xs font-mono border border-border bg-card text-foreground px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {VIEWABLE_ORDER_IDS.map((id) => {
              const o = appraisalOrders.find((a) => a.orderId === id);
              return (
                <option key={id} value={id}>
                  {id} — {o?.subjectAddress}, {o?.city} {o?.state}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Order metadata row */}
      {order && (
        <div className="linear-card flex flex-wrap gap-4 text-xs" style={{ padding: "var(--card-padding-sm)" }}>
          <div>
            <span className="text-muted-foreground">Loan Purpose</span>{" "}
            <span className="font-medium">{order.loanPurpose}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Property Type</span>{" "}
            <span className="font-medium">{order.propertyType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Lender</span>{" "}
            <span className="font-medium">{order.lenderName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Analyst</span>{" "}
            <span className="font-medium">{order.assignedAnalyst}</span>
          </div>
          {valuation && (
            <>
              <div>
                <span className="text-muted-foreground">AVM Value</span>{" "}
                <span className="mono-value font-semibold text-foreground">${valuation.estimatedValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence</span>{" "}
                <span className={`mono-value font-semibold ${valuation.confidence < 60 ? "text-destructive" : valuation.confidence >= 80 ? "text-[color:var(--success)]" : "text-[color:var(--warning)]"}`}>
                  {valuation.confidence}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">FSD</span>{" "}
                <span className={`mono-value ${valuation.fsd > 0.2 ? "text-destructive" : ""}`}>{valuation.fsd.toFixed(2)}</span>
              </div>
            </>
          )}
          {order.flagged && (
            <div className="flex items-center gap-1">
              <FlagBadge reason={order.flagReason} />
              <span className="text-[color:var(--warning)] text-[10px]">{order.flagReason}</span>
            </div>
          )}
        </div>
      )}

      {/* Comp grid table */}
      {subject ? (
        <div className="linear-card overflow-hidden" style={{ padding: 0 }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium w-40 sticky left-0 bg-muted/60 z-10">
                    Characteristic
                  </th>
                  <th className="text-left px-3 py-2 text-foreground font-semibold bg-primary/5 border-l border-border">
                    Subject Property
                  </th>
                  {comps.map((c, i) => (
                    <th
                      key={c.compId}
                      className="text-left px-3 py-2 font-medium border-l border-border"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Comp {i + 1}</span>
                        {c.flagged && <FlagBadge reason={c.flagReason} />}
                        {!c.selected && (
                          <span className="text-[10px] text-muted-foreground italic">(excl.)</span>
                        )}
                      </div>
                      <div className="mono-value text-muted-foreground font-normal mt-0.5">{c.compId}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, rowIdx) => {
                  const isSectionHeader = row.label.startsWith("—");
                  if (isSectionHeader) {
                    return (
                      <tr key={rowIdx} className="bg-muted/40 border-y border-border/60">
                        <td
                          colSpan={2 + compCount}
                          className="px-3 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                        >
                          {row.label.replace(/—/g, "").trim()}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr
                      key={rowIdx}
                      className="border-b border-border/40 hover:bg-[color:var(--surface-hover)] transition-colors"
                      style={{ transitionDuration: "var(--dur-fast)" }}
                    >
                      <td className="px-3 py-1.5 text-muted-foreground font-medium sticky left-0 bg-[var(--card)] border-r border-border/40">
                        {row.label}
                      </td>
                      <td className="px-3 py-1.5 bg-primary/5 border-l border-border/30">
                        {row.renderSubject ? row.renderSubject(subject) : <span className="text-muted-foreground">—</span>}
                      </td>
                      {comps.map((c) => (
                        <td key={c.compId} className="px-3 py-1.5 border-l border-border/30">
                          {row.render ? row.render(c, subject) : <span className="text-muted-foreground">—</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="linear-card flex items-center justify-center h-40 text-sm text-muted-foreground">
          No subject property data available for this order.
        </div>
      )}

      {/* Value range summary */}
      {valuation && (
        <div className="linear-card" style={{ padding: "var(--card-padding-sm)" }}>
          <div className="flex flex-wrap gap-6 items-center text-xs">
            <div>
              <span className="text-muted-foreground uppercase tracking-wide text-[10px]">Indicated Value Range</span>
              <div className="mono-value text-sm font-semibold text-foreground mt-0.5">
                ${valuation.valueRangeLow.toLocaleString()} – ${valuation.valueRangeHigh.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-wide text-[10px]">AVM Reconciled Value</span>
              <div className="mono-value text-sm font-semibold text-primary mt-0.5">
                ${valuation.reconciledValue.toLocaleString()}
              </div>
            </div>
            <div className="flex-1 min-w-48">
              <span className="text-muted-foreground uppercase tracking-wide text-[10px]">Narrative Excerpt</span>
              <p className="text-foreground/80 leading-relaxed mt-0.5 line-clamp-2">{valuation.narrativeExcerpt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
