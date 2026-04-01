import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { SosaChatWidget } from "@/components/dashboard/SosaChatWidget"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="print:hidden">
        <DashboardNav user={user} />
      </div>
      <main className="container mx-auto px-4 py-6 max-w-7xl print:px-0 print:py-0">
        {children}
      </main>
      <SosaChatWidget />
    </div>
  )
}
