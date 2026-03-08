import type { Metadata } from "next";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengePageContent } from "@/components/challenges/challenge-page-content";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { challenges, executiveSummary } from "@/data/challenges";

export const metadata: Metadata = {
  title: "My Approach",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{ letterSpacing: "var(--heading-tracking)" }}>
            Stabilizing Your Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I&apos;d approach the four bugs in your job post — and why they&apos;re connected
          </p>
        </div>

        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />

        <ChallengePageContent challenges={challenges} />

        <CtaCloser />
      </div>
    </div>
  );
}
