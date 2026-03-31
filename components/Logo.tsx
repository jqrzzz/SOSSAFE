import { cn } from "@/lib/utils"

type LogoSize = "sm" | "default" | "lg"

const sizeStyles: Record<LogoSize, { wrapper: string; tourist: string; divider: string; sos: string; safety: string }> = {
  sm: {
    wrapper: "gap-1.5",
    tourist: "text-xs tracking-[0.2em]",
    divider: "h-3 w-px",
    sos: "text-xs tracking-[0.02em]",
    safety: "text-xs tracking-[0.02em]",
  },
  default: {
    wrapper: "gap-2",
    tourist: "text-sm tracking-[0.2em]",
    divider: "h-4 w-px",
    sos: "text-sm tracking-[0.02em]",
    safety: "text-sm tracking-[0.02em]",
  },
  lg: {
    wrapper: "gap-2.5",
    tourist: "text-base tracking-[0.2em]",
    divider: "h-5 w-px",
    sos: "text-base tracking-[0.02em]",
    safety: "text-base tracking-[0.02em]",
  },
}

export function Logo({ size = "default", className }: { size?: LogoSize; className?: string }) {
  const s = sizeStyles[size]
  return (
    <span className={cn("inline-flex items-center select-none", s.wrapper, className)} aria-label="SOS Safety by Tourist SOS">
      <span className={cn("font-light uppercase text-foreground", s.tourist)}>Tourist</span>
      <span className={cn("bg-primary/40", s.divider)} aria-hidden="true" />
      <span className={cn("font-semibold uppercase", s.sos)}>
        <span className="text-red-500">SOS</span>
        <span className="text-primary ml-1">Safety</span>
      </span>
    </span>
  )
}
