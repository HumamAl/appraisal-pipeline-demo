"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeCard } from "./challenge-card";
import { StartupBeforeAfter } from "./startup-before-after";
import { SessionFlow } from "./session-flow";
import { CacheComparison } from "./cache-comparison";
import { ErrorBoundarySketch } from "./error-boundary-sketch";

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {challenges.map((challenge, index) => {
        let visualization: ReactNode = null;

        if (challenge.id === "challenge-1") {
          visualization = <StartupBeforeAfter />;
        } else if (challenge.id === "challenge-2") {
          visualization = (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p
                  className="text-[10px] font-mono uppercase tracking-wide mb-2"
                  style={{ color: "var(--destructive)" }}
                >
                  Current — blank session
                </p>
                <SessionFlow variant="problem" />
              </div>
              <div>
                <p
                  className="text-[10px] font-mono uppercase tracking-wide mb-2"
                  style={{ color: "var(--success)" }}
                >
                  Fixed — persisted state
                </p>
                <SessionFlow variant="fixed" />
              </div>
            </div>
          );
        } else if (challenge.id === "challenge-3") {
          visualization = <CacheComparison />;
        } else if (challenge.id === "challenge-4") {
          visualization = <ErrorBoundarySketch />;
        }

        return (
          <ChallengeCard
            key={challenge.id}
            index={index}
            title={challenge.title}
            description={challenge.description}
            outcome={challenge.outcome}
          >
            {visualization}
          </ChallengeCard>
        );
      })}
    </div>
  );
}
