interface MetricCardProps {
  value: string
  label: string
  subtext?: string
  subtextColor?: "green" | "blue" | "purple" | "orange" | "red"
}

export function MetricCard({ value, label, subtext, subtextColor = "green" }: MetricCardProps) {
  const subtextColorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
  }

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-sm sm:text-base text-muted-foreground font-medium">{label}</div>
      {subtext && <div className={`text-xs font-semibold mt-1 ${subtextColorClasses[subtextColor]}`}>{subtext}</div>}
    </div>
  )
}
