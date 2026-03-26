import { redirect } from "next/navigation"

// Old route - redirecting to new auth system
export default function LoginPage() {
  redirect("/auth/login")
}
