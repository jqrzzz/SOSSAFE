import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/admin"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminChatWidget } from "@/components/admin/AdminChatWidget"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminUser()

  if (!admin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background dark">
      <AdminNav adminEmail={admin.email!} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <AdminChatWidget />
    </div>
  )
}
