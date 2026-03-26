import { redirect } from "next/navigation"

// Demo has been replaced with the new certification portal
// Users should sign up for a real account to access the dashboard
export default function DemoPage() {
  redirect("/auth/sign-up")
}
