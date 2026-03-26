import { cn } from "@/lib/utils"

type LogoSize = "sm" | "default" | "lg"

const sizeStyles: Record<LogoSize, { wrapper: string; tourist: string; divider: string; sos: string }> = {
  sm: {
    wrapper: "gap-1.5",
    tourist: "text-xs tracking-[0.2em]",
    divider: "h-3 w-px",
    sos: "text-xs tracking-[0.02em]",
  },
  default: {
    wrapper: "gap-2",
    tourist: "text-sm tracking-[0.2em]",
    divider: "h-4 w-px",
    sos: "text-sm tracking-[0.02em]",
  },
  lg: {
    wrapper: "gap-2.5",
    tourist: "text-base tracking-[0.2em]",
    divider: "h-5 w-px",
    sos: "text-base tracking-[0.02em]",
  },
}

export function Logo({ size = "default", className }: { size?: LogoSize; className?: string }) {
  const s = sizeStyles[size]
  return (
    <span className={cn("inline-flex items-center select-none", s.wrapper, className)} aria-label="Tourist SOS">
      <span className={cn("font-light uppercase text-foreground", s.tourist)}>Tourist</span>
      <span className={cn("bg-primary/40", s.divider)} aria-hidden="true" />
      <span className={cn("font-semibold uppercase text-red-600 dark:text-red-500", s.sos)}>SOS</span>
    </span>
  )
}
