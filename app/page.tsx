import { SosaChat } from "@/components/SosaChat"
import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1">
        <SosaChat />
      </main>
      <MarketingFooter />
    </div>
  )
}
