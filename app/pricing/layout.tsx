import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | SOS Safe Certification",
  description: "Simple, fair pricing for SOS Safe certification. Plans for hostels, guesthouses, hotels, and tour operators starting at $12/month.",
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
