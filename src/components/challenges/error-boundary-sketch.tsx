"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, Layers, Cpu, Database, ShieldAlert } from "lucide-react";

interface Layer {
  id: string;
  label: string;
  sub: string;
  icon: typeof Layers;
  type: "surface" | "boundary" | "phase" | "recovery";
}

const layers: Layer[] = [
  {
    id: "surface",
    label: "UI Error Surface",
    sub: "Phase card shows error state + Retry button",
    icon: Layers,
    type: "surface",
  },
  {
    id: "boundary",
    label: "Phase Error Boundary",
    sub: "Catches exception, wraps in ErrorResult, stops propagation",
    icon: ShieldAlert,
    type: "boundary",
  },
  {
    id: "phase",
    label: "Pipeline Phase Runner",
    sub: "Each phase isolated: Data Ingestion, AVM Modeling, etc.",
    icon: Cpu,
    type: "phase",
  },
  {
    id: "recovery",
    label: "Recovery Endpoint",
    sub: "POST /session/{id}/retry?phase=avm-modeling",
    icon: RefreshCw,
    type: "recovery",
  },
];

const typeStyles = {
  surface: {
    borderColor: "color-mix(in oklch, var(--primary) 30%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
  },
  boundary: {
    borderColor: "color-mix(in oklch, var(--warning) 35%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--warning) 7%, transparent)",
  },
  phase: {
    borderColor: "var(--border)",
    backgroundColor: "var(--card)",
  },
  recovery: {
    borderColor: "color-mix(in oklch, var(--success) 30%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
  },
};

export function ErrorBoundarySketch() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
        Hover a layer to see its role
      </p>
      <div className="flex flex-col gap-1.5">
        {layers.map((layer) => {
          const style = typeStyles[layer.type];
          const isActive = activeLayer === layer.id;

          return (
            <button
              key={layer.id}
              onMouseEnter={() => setActiveLayer(layer.id)}
              onMouseLeave={() => setActiveLayer(null)}
              className="w-full text-left rounded-[var(--radius)] border px-3 py-2.5 transition-all duration-[80ms]"
              style={{
                ...style,
                opacity: activeLayer && !isActive ? 0.5 : 1,
                transform: isActive ? "translateX(4px)" : "none",
              }}
            >
              <div className="flex items-center gap-2.5">
                <layer.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-mono font-medium">{layer.label}</p>
                  {isActive && (
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5 leading-relaxed">
                      {layer.sub}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div
        className="flex items-start gap-2 rounded-[var(--radius)] border px-3 py-2"
        style={{
          borderColor: "color-mix(in oklch, var(--warning) 25%, transparent)",
          backgroundColor: "color-mix(in oklch, var(--warning) 5%, transparent)",
        }}
      >
        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
        <p className="text-xs font-mono text-muted-foreground">
          Today: broad <span className="mono-value">except Exception: pass</span> blocks swallow errors
          silently — the phase stalls and the only recovery is a server restart.
        </p>
      </div>
    </div>
  );
}
