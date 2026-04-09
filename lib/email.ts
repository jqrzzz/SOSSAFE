import { Resend } from "resend"
import { PRICING_PLANS } from "./pricing-data"

/**
 * Email service — sends transactional emails via Resend.
 *
 * Falls back to console logging when RESEND_API_KEY is not set,
 * so development works without an email provider.
 */

const FROM_ADDRESS = "SOS Safe <notifications@tourist-sos.com>"

type EmailType =
  | "welcome"
  | "subscription_confirmed"
  | "payment_failed"
  | "trial_expiring"
  | "certification_approved"
  | "team_member_joined"

interface EmailPayload {
  to: string
  type: EmailType
  data: Record<string, string | number | undefined>
}

function buildEmail(type: EmailType, data: Record<string, string | number | undefined>): { subject: string; html: string } {
  const partnerName = String(data.partnerName || "your organization")

  switch (type) {
    case "welcome":
      return {
        subject: `Welcome to SOS Safe, ${partnerName}`,
        html: emailLayout(`
          <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px">Welcome to SOS Safe</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            Hi there! <strong>${partnerName}</strong> is now set up on SOS Safe.
            Your 30-day free trial has started — full access to everything, no credit card required.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            Here's what to do next:
          </p>
          <ol style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 24px;padding-left:20px">
            <li>Complete your <strong>Facility Assessment</strong> — SOSA will generate your safety policies</li>
            <li>Start <strong>Module 1: Facility Assessment</strong> to begin certification</li>
            <li>Invite your team so they can complete individual training</li>
          </ol>
          ${ctaButton("Go to Dashboard", dashboardUrl())}
          <p style="color:#94a3b8;font-size:13px;margin:24px 0 0">
            Questions? Reply to this email or chat with SOSA inside your dashboard.
          </p>
        `),
      }

    case "subscription_confirmed": {
      const plan = PRICING_PLANS.find(p => p.id === data.planName) || PRICING_PLANS[1]
      const intervalLabel = data.interval === "annual" ? "annual" : "monthly"
      return {
        subject: `Subscription confirmed — ${partnerName}`,
        html: emailLayout(`
          <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px">You're subscribed!</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            <strong>${partnerName}</strong> is now on the <strong>${plan.name}</strong> plan (${intervalLabel}).
            Your certification, team training, and all platform features are fully active.
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:0 0 24px">
            <p style="color:#475569;font-size:14px;margin:0 0 8px"><strong>Plan:</strong> ${plan.name}</p>
            <p style="color:#475569;font-size:14px;margin:0 0 8px"><strong>Billing:</strong> ${intervalLabel === "annual" ? `$${plan.annualPrice}/year` : `$${plan.monthlyPrice}/month`}</p>
            <p style="color:#475569;font-size:14px;margin:0"><strong>Invoices:</strong> Sent automatically by Stripe to this email</p>
          </div>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            You can manage your subscription, update payment details, and download invoices anytime from your billing page.
          </p>
          ${ctaButton("Manage Billing", `${dashboardUrl()}/settings/billing`)}
        `),
      }
    }

    case "payment_failed":
      return {
        subject: `Action needed — payment failed for ${partnerName}`,
        html: emailLayout(`
          <h1 style="color:#dc2626;font-size:24px;margin:0 0 16px">Payment failed</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            We weren't able to process the latest payment for <strong>${partnerName}</strong>.
            This can happen when a card expires or has insufficient funds.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            Please update your payment method to keep your subscription active.
            If the payment isn't resolved, your dashboard will switch to read-only mode.
          </p>
          ${ctaButton("Update Payment Method", `${dashboardUrl()}/settings/billing`)}
          <p style="color:#94a3b8;font-size:13px;margin:24px 0 0">
            If you believe this is an error, reply to this email and we'll help sort it out.
          </p>
        `),
      }

    case "trial_expiring": {
      const daysLeft = Number(data.daysLeft) || 0
      return {
        subject: `Your SOS Safe trial ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
        html: emailLayout(`
          <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px">Your trial is ending soon</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            <strong>${partnerName}</strong> has <strong>${daysLeft} day${daysLeft !== 1 ? "s" : ""}</strong> left
            on the free trial. After that, your dashboard becomes read-only.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            Subscribe to keep your certification active, your team trained, and your safety data accessible.
            All your progress is preserved — you won't lose anything.
          </p>
          ${ctaButton("Subscribe Now", `${dashboardUrl()}/settings/billing`)}
        `),
      }
    }

    case "certification_approved": {
      const tierName = data.tierName || "SOS Safe Basic"
      return {
        subject: `${partnerName} is now ${tierName} Certified`,
        html: emailLayout(`
          <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px">Congratulations!</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            <strong>${partnerName}</strong> has earned <strong>${tierName}</strong> certification.
            Your certificate is now active and your public verification page is live.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            Display your certification badge, share your verification link with guests,
            and continue building trust in your safety standards.
          </p>
          ${ctaButton("View Certificate", `${dashboardUrl()}/certification`)}
        `),
      }
    }

    case "team_member_joined":
      return {
        subject: `New team member joined ${partnerName}`,
        html: emailLayout(`
          <h1 style="color:#0f172a;font-size:24px;margin:0 0 16px">New team member</h1>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px">
            <strong>${data.memberName || "A new member"}</strong> has joined
            <strong>${partnerName}</strong> on SOS Safe.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
            They can now begin their individual training modules.
            Track their progress on the Team page.
          </p>
          ${ctaButton("View Team", `${dashboardUrl()}/team`)}
        `),
      }
  }
}

// ── Helpers ────────────────────────────────────────────────────────

function dashboardUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://safe.tourist-sos.com"
}

function ctaButton(text: string, url: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
      <tr>
        <td style="border-radius:8px;background:#f97316;text-align:center">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `
}

function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f9">
    <tr>
      <td style="padding:40px 16px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto">
          <!-- Logo -->
          <tr>
            <td style="padding:0 0 24px;text-align:center">
              <span style="font-size:20px;font-weight:700;color:#f97316">SOS</span>
              <span style="font-size:20px;font-weight:700;color:#0f172a"> Safe</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e2e8f0">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 4px">
                SOS Safe by Tourist SOS &mdash; Emergency preparedness certification for hospitality
              </p>
              <p style="color:#94a3b8;font-size:12px;margin:0">
                <a href="https://tourist-sos.com" style="color:#94a3b8">tourist-sos.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// ── Send ───────────────────────────────────────────────────────────

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const { subject, html } = buildEmail(payload.type, payload.data)

  // If no Resend key, log and return (development mode)
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email]", { to: payload.to, subject, type: payload.type })
    return { success: true }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: payload.to,
      subject,
      html,
    })

    if (error) {
      console.error("[Email Error]", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("[Email Error]", err)
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}
