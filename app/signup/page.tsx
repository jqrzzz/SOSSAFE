import { redirect } from "next/navigation"

// Old route - redirecting to new auth system
export default function SignupPage() {
  redirect("/auth/sign-up")
}
