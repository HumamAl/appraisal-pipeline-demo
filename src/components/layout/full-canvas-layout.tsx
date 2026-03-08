"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CrossTabLinks,
  Attribution,
} from "@/components/layout/conversion-elements";

// ═══════════════════════════════════════════════════════════════════════════
// FULL-CANVAS LAYOUT
// Used by: landing-page, admin-console
//
// For admin-console: compact status bar + feature nav tabs at top.
// Structure:
//   +-----------------------------------------------+
//   | (TabNavigation is rendered by root layout)     |
//   +-----------------------------------------------+
//   | Status Bar: AppName | Nav Items | CTA          |
//   +-----------------------------------------------+
//   |                                                 |
//   |  Full-width content area (scrollable)           |
//   |                                                 |
//   +-----------------------------------------------+
//   | Bottom Bar: Attribution | CrossTabLinks         |
//   +-----------------------------------------------+
// ═══════════════════════════════════════════════════════════════════════════

const adminNavItems = [
  { label: "Pipeline Monitor", href: "/" },
  { label: "Comp Explorer", href: "/comp-explorer" },
  { label: "AVM Analytics", href: "/avm-analytics" },
  { label: "Error Log", href: "/error-log" },
];

export function FullCanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
      data-format={APP_CONFIG.demoFormat}
    >
      {/* ── Admin Console Header ─────────────────────────────────── */}
      <header
        className="flex items-center border-b border-border/60 bg-background shrink-0"
        style={{ height: "var(--header-height)" }}
      >
        {/* App identity */}
        <div className="flex items-center gap-2 px-4 border-r border-border/40 shrink-0" style={{ height: "100%" }}>
          <span className="text-sm font-semibold tracking-tight">{APP_CONFIG.appName}</span>
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
          </span>
        </div>

        {/* Feature nav */}
        <nav className="flex items-center h-full overflow-x-auto">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" ||
                  (!pathname.startsWith("/comp-explorer") &&
                    !pathname.startsWith("/avm-analytics") &&
                    !pathname.startsWith("/error-log") &&
                    !pathname.startsWith("/challenges") &&
                    !pathname.startsWith("/proposal"))
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 h-full flex items-center text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground/80"
                )}
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="ml-auto px-4 shrink-0">
          <Link
            href="/proposal"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            Work With Me <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* ── Canvas Area ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* ── Bottom Bar ──────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-background shrink-0">
        <Attribution variant="inline" />
        <CrossTabLinks variant="inline" />
      </footer>
    </div>
  );
}
