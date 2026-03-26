import type React from "react"
interface IconContainerProps {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "accent" | "green" | "blue" | "purple" | "orange" | "red"
  className?: string
}

export function IconContainer({ children, size = "md", color = "primary", className = "" }: IconContainerProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const colorClasses = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
    green: "bg-green-500/20",
    blue: "bg-blue-500/20",
    purple: "bg-purple-500/20",
    orange: "bg-orange-500/20",
    red: "bg-red-500/20",
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-2xl flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  )
}
