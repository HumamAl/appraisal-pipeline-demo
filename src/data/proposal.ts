import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "I debug production FastAPI pipelines and stabilize async workflows — and I built a working appraisal pipeline for your review in Tab 1.",
  bio: "Full-stack developer who's spent real time inside async Python codebases — fixing race conditions, taming startup scripts, and wiring up clean dashboards that surface what's actually happening inside a pipeline. I don't guess at root causes. I trace them.",
  approach: [
    {
      title: "Audit: Read the codebase, reproduce every bug",
      description:
        "Start by running your test suite and replicating each failure locally. Map the async flow end-to-end before touching anything. One session of reading beats two weeks of guessing.",
    },
    {
      title: "Diagnose: Trace async state across phases",
      description:
        "Walk the FastAPI lifecycle — startup events, background tasks, shared state, error paths. Find where concurrency assumptions break. Each root cause gets documented before a fix is written.",
    },
    {
      title: "Fix: Targeted patches with tests",
      description:
        "Fixes are surgical — one bug, one change, one test to guard it. No sweeping refactors that introduce new failures. Each resolved issue gets a test so it stays resolved.",
    },
    {
      title: "Harden: Error boundaries and graceful recovery",
      description:
        "After fixes land: proper error boundaries, graceful startup/shutdown sequencing, meaningful error messages instead of silent failures. The pipeline should degrade gracefully, not crash hard.",
    },
    {
      title: "Deploy: Railway/Render + Vercel + Supabase",
      description:
        "If cloud migration is in scope — containerize the FastAPI backend, connect Supabase for persistence, and wire the React/Vite frontend to Vercel. Startup scripts, environment config, the works.",
    },
  ],
  skillCategories: [
    {
      name: "Python / Backend",
      skills: ["Python", "FastAPI", "asyncio", "Pydantic", "pytest"],
    },
    {
      name: "Frontend",
      skills: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    },
    {
      name: "Data & ML",
      skills: ["scikit-learn", "pandas", "numpy"],
    },
    {
      name: "Debugging & Testing",
      skills: [
        "Async debugging",
        "Error boundaries",
        "Test coverage",
        "Root cause analysis",
      ],
    },
    {
      name: "Deployment",
      skills: ["Vercel", "Railway", "Render", "Supabase", "Docker"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wmf-agent",
    title: "WMF Agent Dashboard",
    description:
      "Multi-phase async processing pipeline for a manufacturing client — email classification, structured data extraction, and a human-in-the-loop approval workflow, all coordinated via n8n and Claude API.",
    outcome:
      "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
    tech: ["Next.js", "TypeScript", "Claude API", "n8n", "Microsoft Graph"],
    liveUrl: "https://wmf-agent-dashboard.vercel.app",
    relevance:
      "Same architectural pattern as your appraisal pipeline — multi-phase async processing with status tracking and human review gates.",
  },
  {
    id: "medrecord-ai",
    title: "MedRecord AI",
    description:
      "Document processing pipeline that parses unstructured medical records, extracts structured clinical data across multiple extraction phases, and generates a readable timeline summary.",
    outcome:
      "Document processing pipeline that extracts structured clinical data and generates a readable timeline summary",
    tech: ["Next.js", "TypeScript", "AI extraction pipeline", "shadcn/ui"],
    liveUrl: "https://medrecord-ai-delta.vercel.app",
    relevance:
      "Multi-phase document pipeline with confidence scoring and structured output — directly analogous to your AVM modeling phases.",
  },
  {
    id: "ebay-monitor",
    title: "eBay Pokemon Monitor",
    description:
      "Real-time API monitoring tool with status tracking, webhook-based alerting, and price trend visualization. Built to catch failures and surface them immediately rather than silently dropping events.",
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    tech: ["Next.js", "TypeScript", "eBay Browse API", "Discord webhooks"],
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
    relevance:
      "Pipeline monitoring pattern — catching failures, surfacing errors in real time, keeping state consistent across async events.",
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence Platform",
    description:
      "Analytics dashboard pulling from multiple data sources with interactive charts, filterable insights, and pipeline health monitoring. Built for teams that need to see what's happening inside their data flows.",
    outcome:
      "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
    tech: ["Next.js", "TypeScript", "Recharts", "shadcn/ui"],
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
    relevance:
      "The dashboard layer for your pipeline — exactly the kind of visibility surface your analysts need.",
  },
];
