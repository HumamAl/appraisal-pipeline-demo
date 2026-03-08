import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* ── Hero — dark panel ────────────────────────────────────── */}
        <div
          className="rounded-[var(--radius)] p-8 space-y-5"
          style={{ background: "var(--section-dark)" }}
        >
          {/* Effort badge */}
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Built this demo for your project
            </span>
          </div>

          {/* Role prefix */}
          <p className="font-mono text-xs tracking-widest uppercase text-white/40">
            Full-Stack Developer · Python / FastAPI / React
          </p>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl leading-none">
            <span className="font-light text-white/60">Hi, I&apos;m </span>
            <span className="font-black text-white">{profile.name}</span>
          </h1>

          {/* Value prop — specific to this job */}
          <p className="text-base md:text-lg text-white/65 max-w-2xl leading-relaxed">
            {profile.tagline}
          </p>

          {/* Stats shelf */}
          <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-4">
            {[
              { value: "24+", label: "Projects Shipped" },
              { value: "< 48hr", label: "Demo Turnaround" },
              { value: "15+", label: "Industries" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl md:text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/45 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Proof of Work ────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Proof of Work
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            Relevant Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tech={project.tech}
                relevance={project.relevance}
                outcome={project.outcome}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        </div>

        {/* ── How I Work ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Process
          </p>
          <h2 className="text-lg font-semibold tracking-tight">How I Work</h2>
          <div className="space-y-1">
            {profile.approach.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {/* Step number node */}
                  <div className="w-7 h-7 rounded-[var(--radius)] bg-primary/10 border border-primary/30 text-primary flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Connector rail */}
                  {i < profile.approach.length - 1 && (
                    <div className="w-px flex-1 bg-border/60 mt-1 mb-1" style={{ minHeight: "1rem" }} />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills Grid ──────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Tech Stack
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            What I Build With
          </h2>
          <SkillsGrid categories={profile.skillCategories} />
        </div>

        {/* ── CTA — dark panel ────────────────────────────────────── */}
        <div
          className="rounded-[var(--radius)] p-8 space-y-4"
          style={{ background: "var(--section-dark)" }}
        >
          {/* Pulsing availability indicator */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs text-white/50">Currently available for new projects</span>
          </div>

          {/* Tailored headline */}
          <h2 className="text-xl font-semibold text-white leading-snug max-w-xl">
            Your pipeline is already debugged in Tab 1 — production-ready is{" "}
            <span className="text-primary">one reply away.</span>
          </h2>

          {/* Specific body — not generic */}
          <p className="text-sm text-white/55 leading-relaxed max-w-lg">
            I&apos;ve already built a working{" "}
            {APP_CONFIG.projectName} with async phase tracking, error recovery,
            and a clean analyst dashboard. The same approach applies to your
            codebase — audit the bugs, fix the roots, harden the pipeline, and
            get it deployed somewhere you can actually share it.
          </p>

          {/* Primary action — text, not a dead link */}
          <p className="text-base font-semibold text-primary">
            Reply on Upwork to start
          </p>

          {/* Back-link to demo */}
          <a
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/35 hover:text-white/60 transition-colors duration-100"
          >
            ← Back to the demo
          </a>

          {/* Signature */}
          <p className="text-sm text-white/30 pt-2 border-t border-white/10">
            — Humam
          </p>
        </div>

      </div>
    </div>
  );
}
