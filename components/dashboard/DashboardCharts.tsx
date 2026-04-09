"use client"

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

interface ModuleScore {
  name: string
  score: number
  passed: boolean
}

interface ReadinessItem {
  label: string
  value: number
  max: number
}

interface DashboardChartsProps {
  moduleScores: ModuleScore[]
  readiness: ReadinessItem[]
  passingScore: number
}

export function DashboardCharts({
  moduleScores,
  readiness,
  passingScore,
}: DashboardChartsProps) {
  if (moduleScores.length === 0 && readiness.every((r) => r.value === 0)) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Module Scores Radar */}
      {moduleScores.length >= 3 && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-1">Module Performance</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Score breakdown across completed modules
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={moduleScores} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Passing"
                  dataKey={() => passingScore}
                  stroke="hsl(var(--destructive))"
                  fill="none"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-primary inline-block rounded" />
              Your score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-destructive inline-block rounded opacity-60" style={{ borderTop: "1px dashed" }} />
              {passingScore}% passing
            </span>
          </div>
        </div>
      )}

      {/* Module Scores Bar (shown when < 3 modules, or alongside radar) */}
      {moduleScores.length > 0 && moduleScores.length < 3 && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-1">Module Scores</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Complete more modules to unlock the radar chart
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleScores} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={32}>
                  {moduleScores.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.passed ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Safety Readiness Overview */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <h2 className="font-semibold mb-1">Safety Readiness</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Overall preparedness across key dimensions
        </p>
        <div className="space-y-5">
          {readiness.map((item) => {
            const pct = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0
            const color =
              pct >= 80
                ? "bg-green-500"
                : pct >= 50
                  ? "bg-yellow-500"
                  : pct > 0
                    ? "bg-orange-500"
                    : "bg-muted-foreground/30"

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.value}/{item.max}{" "}
                    <span className="text-xs">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Ready (80%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
              In Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
              Needs Work
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
