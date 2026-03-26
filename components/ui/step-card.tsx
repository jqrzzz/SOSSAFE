import type React from "react"
interface StepCardProps {
  number: number
  title: string
  timing: string
  description: string
  example: React.ReactNode
  gradientColor?: string
}

export function StepCard({ number, title, timing, description, example, gradientColor = "primary" }: StepCardProps) {
  const colorClasses = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
  }

  return (
    <div className="glass-card p-8 rounded-2xl h-full">
      <div className="flex items-center mb-6">
        <div
          className={`w-12 h-12 ${colorClasses[gradientColor as keyof typeof colorClasses]} rounded-full flex items-center justify-center mr-4`}
        >
          <span className="text-xl font-bold">{number}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div
            className={`text-sm font-medium ${gradientColor === "primary" ? "text-primary" : gradientColor === "secondary" ? "text-secondary" : "text-accent"}`}
          >
            {timing}
          </div>
        </div>
      </div>
      <p className="text-base text-muted-foreground mb-6 leading-relaxed">{description}</p>
      {example}
    </div>
  )
}
