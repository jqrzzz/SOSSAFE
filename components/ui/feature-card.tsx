import type React from "react"
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`metric-card p-8 rounded-2xl text-center ${className}`}>
      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
