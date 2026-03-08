// NO "use client" — pure JSX, no hooks

import { AlertTriangle, CheckCircle2, Database, Monitor } from "lucide-react";

interface FlowNode {
  label: string;
  sub?: string;
  type: "client" | "store" | "error" | "ok";
}

const problemFlow: FlowNode[] = [
  { label: "Client", sub: "session_id: abc123", type: "client" },
  { label: "Server restart", sub: "in-memory dict cleared", type: "error" },
  { label: "GET /session/abc123", sub: "returns {} blank", type: "error" },
  { label: "Frontend renders", sub: "empty pipeline — silent fail", type: "error" },
];

const fixedFlow: FlowNode[] = [
  { label: "Client", sub: "session_id: abc123", type: "client" },
  { label: "Server restart", sub: "loads sessions.json on boot", type: "store" },
  { label: "GET /session/abc123", sub: "returns persisted state", type: "ok" },
  { label: "Frontend restores", sub: "pipeline resumes", type: "ok" },
];

function NodeIcon({ type }: { type: FlowNode["type"] }) {
  const Icon = type === "client" ? Monitor : type === "store" ? Database : type === "error" ? AlertTriangle : CheckCircle2;
  return <Icon className="h-3.5 w-3.5 shrink-0" />;
}

interface SessionFlowProps {
  variant: "problem" | "fixed";
}

export function SessionFlow({ variant }: SessionFlowProps) {
  const flow = variant === "problem" ? problemFlow : fixedFlow;

  return (
    <div className="flex flex-col gap-1.5">
      {flow.map((node, i) => {
        const colorStyle =
          node.type === "error"
            ? {
                borderColor: "color-mix(in oklch, var(--destructive) 25%, transparent)",
                backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
                color: "var(--destructive)",
              }
            : node.type === "ok" || node.type === "store"
            ? {
                borderColor: "color-mix(in oklch, var(--success) 25%, transparent)",
                backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
                color: "var(--success)",
              }
            : {
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
              };

        return (
          <div key={i} className="phase-rail">
            <div
              className="flex items-start gap-2.5 rounded-[var(--radius)] border px-3 py-2"
              style={colorStyle}
            >
              <NodeIcon type={node.type} />
              <div className="min-w-0">
                <p className="text-xs font-mono font-medium">{node.label}</p>
                {node.sub && (
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{node.sub}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
