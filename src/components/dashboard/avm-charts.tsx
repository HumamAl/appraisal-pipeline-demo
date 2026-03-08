"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  orderVolumeByMonth,
  confidenceByMonth,
  phaseDurationBreakdown,
  confidenceDistribution,
  propertyTypeBreakdown,
} from "@/data/mock-data";

// ── Color palette — amber hue harmonized
const COLORS = {
  primary: "oklch(0.62 0.16 78)",
  chart2:  "oklch(0.60 0.15 108)",
  chart3:  "oklch(0.58 0.14 138)",
  chart4:  "oklch(0.64 0.14 48)",
  chart5:  "oklch(0.68 0.14 200)",
  target:  "oklch(0.75 0.12 70)",
  muted:   "oklch(0.556 0 0)",
  border:  "oklch(0.90 0.01 78)",
  success: "oklch(0.62 0.19 145)",
  warning: "oklch(0.75 0.18 85)",
};

// Use hex-compatible values for Recharts (doesn't render oklch)
const C = {
  amber:   "#B87333",
  green:   "#4A9B6F",
  teal:    "#4A8FA8",
  orange:  "#C47A35",
  gold:    "#C4A838",
  muted:   "#888",
  target:  "#C4A838",
  grid:    "#e8e2d8",
};

const PIE_COLORS = [C.amber, C.orange, C.gold, C.teal, C.green];

// ── Custom tooltip base
function TooltipBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="linear-card text-xs" style={{ padding: "8px 10px", minWidth: 140 }}>
      <p className="text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}

// ── Order Volume Chart
export function OrderVolumeChart() {
  const data = orderVolumeByMonth;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} />
        <YAxis tick={{ fontSize: 10, fill: C.muted }} />
        <ReferenceLine y={750} stroke={C.target} strokeDasharray="4 2" strokeWidth={1} label={{ value: "Target 750", position: "insideTopRight", fontSize: 9, fill: C.target }} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <TooltipBox label={label as string}>
                <p className="font-semibold text-foreground">{payload[0].value} orders</p>
                <p className="text-muted-foreground">Target: 750</p>
              </TooltipBox>
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={C.amber}
          strokeWidth={2}
          dot={{ fill: C.amber, r: 3 }}
          activeDot={{ r: 5 }}
          name="Order Volume"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Confidence Trend Chart
export function ConfidenceTrendChart() {
  const data = confidenceByMonth;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} />
        <YAxis domain={[72, 84]} tick={{ fontSize: 10, fill: C.muted }} />
        <ReferenceLine y={80} stroke={C.target} strokeDasharray="4 2" strokeWidth={1} label={{ value: "Target 80%", position: "insideTopRight", fontSize: 9, fill: C.target }} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <TooltipBox label={label as string}>
                <p className="font-semibold text-foreground">{payload[0].value}% confidence</p>
                <p className="text-muted-foreground">Target: 80%</p>
              </TooltipBox>
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={C.teal}
          strokeWidth={2}
          dot={{ fill: C.teal, r: 3 }}
          activeDot={{ r: 5 }}
          name="Avg Confidence"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Phase Duration Bar Chart
export function PhaseDurationChart() {
  const data = phaseDurationBreakdown.map((d) => ({
    phase: d.phase.replace(" ", "\n"),
    avg: d.avgDurationSec,
    p95: d.p95DurationSec,
    label: d.phase,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 80, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: C.muted }} unit="s" />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 9, fill: C.muted }}
          width={78}
        />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <TooltipBox label={label as string}>
                <p>Avg: <span className="font-semibold">{payload[0]?.value}s</span></p>
                <p>P95: <span className="font-semibold">{payload[1]?.value}s</span></p>
              </TooltipBox>
            ) : null
          }
        />
        <Bar dataKey="avg" fill={C.amber} name="Avg (s)" barSize={8} />
        <Bar dataKey="p95" fill={C.gold} name="P95 (s)" barSize={8} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Confidence Distribution Donut
export function ConfidenceDistributionChart() {
  const data = confidenceDistribution;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={80}
          dataKey="count"
          nameKey="range"
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.range} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <TooltipBox label={payload[0].name as string}>
                <p className="font-semibold">{payload[0].value} orders</p>
                <p className="text-muted-foreground">{(payload[0].payload as { percentage: number }).percentage}% of total</p>
              </TooltipBox>
            ) : null
          }
        />
        <Legend
          wrapperStyle={{ fontSize: 10 }}
          formatter={(value) => <span className="text-muted-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Property Type Confidence Bar
export function PropertyTypeChart() {
  const data = propertyTypeBreakdown;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
        <XAxis dataKey="type" tick={{ fontSize: 10, fill: C.muted }} />
        <YAxis tick={{ fontSize: 10, fill: C.muted }} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <TooltipBox label={label as string}>
                <p>Count: <span className="font-semibold">{payload[0]?.value}</span></p>
                <p>Avg Confidence: <span className="font-semibold">{payload[1]?.value}%</span></p>
              </TooltipBox>
            ) : null
          }
        />
        <Bar dataKey="count" fill={C.amber} name="Order Count" barSize={28} />
        <Bar dataKey="avgConfidence" fill={C.teal} name="Avg Confidence %" barSize={28} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
