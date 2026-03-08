// NO "use client" — pure JSX, no hooks

import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";

interface ChallengeCardProps {
  index: number;
  title: string;
  description: string;
  outcome?: string;
  children?: ReactNode;
}

export function ChallengeCard({
  index,
  title,
  description,
  outcome,
  children,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className="bg-card border border-border/60 rounded-[var(--radius)] p-5 space-y-4"
      style={{
        animationDelay: `${index * 80}ms`,
        animationDuration: "120ms",
      }}
    >
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-medium text-primary/60 w-6 shrink-0 tabular-nums">
            {stepNumber}
          </span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 pl-[calc(1.5rem+0.75rem)]">
          {description}
        </p>
      </div>
      {children && <div>{children}</div>}
      {outcome && <OutcomeStatement outcome={outcome} />}
    </div>
  );
}
