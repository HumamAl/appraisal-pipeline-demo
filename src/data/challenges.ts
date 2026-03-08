import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers who work on Python+Vite stacks treat startup reliability and state persistence as afterthoughts — they patch individual bugs one at a time and leave the process orchestration fragile. Error handling gets \"good enough\" treatment. Session state is rarely given a proper persistence contract.",
  differentApproach:
    "I'd fix these as a system: a single process manager that owns uvicorn and Vite lifecycle, a typed session persistence contract so state survives restarts, a cache-key layer that prevents phase re-runs, and structured error boundaries that surface failures at the phase level — not buried in logs.",
  accentWord: "as a system",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Two-Process Startup Sequencing",
    description:
      "Running uvicorn and Vite as separate terminal processes means startup order matters and isn't enforced. A developer opening the project cold has to know to start the backend first, wait, then start the frontend — or face connection errors that look like bugs.",
    visualizationType: "before-after",
    outcome:
      "Could eliminate manual startup sequencing — a single script manages uvicorn + Vite lifecycle with readiness checks, so `pnpm dev` just works from a cold start every time.",
  },
  {
    id: "challenge-2",
    title: "Session State Silently Reinitializing",
    description:
      "When the uvicorn process restarts, the in-memory session dict resets. The frontend doesn't detect this — it reuses its stored session ID, gets back a blank session object, and the user sees an empty pipeline with no indication of what happened.",
    visualizationType: "flow",
    outcome:
      "Could eliminate blank session bugs — persisted state loads reliably on restart instead of silently reinitializing, and a mismatch between client session ID and server state surfaces a recoverable error rather than silent data loss.",
  },
  {
    id: "challenge-3",
    title: "Phase Cache Miss on Completed Runs",
    description:
      "Completed phases should load from cache rather than re-execute. When the cache check fails — often due to a key mismatch or missing cache file — the phase re-runs from scratch. For AVM model calls this means unnecessary API cost and 30–90 second delays on what should be an instant load.",
    visualizationType: "before-after",
    outcome:
      "Could prevent redundant pipeline re-runs — a normalized cache-key contract means completed phases load in under 200ms from disk instead of re-calling the AVM model, saving compute cost on every non-first run.",
  },
  {
    id: "challenge-4",
    title: "Silent Failures with No Recovery Path",
    description:
      "When a phase fails mid-pipeline, the error often propagates silently — swallowed by a broad except block or logged to console only. The app surface shows a stalled phase with no way to recover short of killing and restarting the entire server.",
    visualizationType: "architecture",
    outcome:
      "Could turn invisible failures into recoverable states — per-phase error boundaries surface failures with structured error context, and a retry endpoint lets the pipeline resume from the failed phase without a full restart.",
  },
];
