import { redirect } from "next/navigation"

// Contacts/chat UI is intentionally removed from the partner-facing app.
// Emergency coordination is handled through external messaging lanes.
export default function ContactsPage() {
  redirect("/dashboard/cases")
}
