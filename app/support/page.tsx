import type { Metadata } from "next"
import Link from "next/link"
import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"

export const metadata: Metadata = {
  title: "Support | SOS Safe Certification",
  description: "Get help with SOS Safe certification, onboarding, team management, and billing. We're here to help your business get certified.",
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Header */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">How Can We Help?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Questions about certification, onboarding, or managing your account — we&apos;re here for you.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-5">
                For certification questions, billing inquiries, or technical issues with your account.
              </p>
              <a
                href="mailto:support@tourist-sos.com"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                support@tourist-sos.com
              </a>
              <p className="text-xs text-muted-foreground mt-2">We respond within 4 business hours</p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">SOSA AI Assistant</h3>
              <p className="text-muted-foreground mb-5">
                Get instant answers about certification, training modules, and how the platform works.
              </p>
              <Link
                href="/"
                className="inline-block rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Chat with SOSA
              </Link>
              <p className="text-xs text-muted-foreground mt-2">Available on the homepage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Topics */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-10">Common Topics</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Getting Certified</h3>
              <p className="text-sm text-muted-foreground">How the 3-module certification works, passing scores, and earning your badge.</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Team Management</h3>
              <p className="text-sm text-muted-foreground">Inviting staff, tracking training progress, and managing team roles.</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Billing & Plans</h3>
              <p className="text-sm text-muted-foreground">Subscription management, plan upgrades, invoices, and payment questions.</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Property Setup</h3>
              <p className="text-sm text-muted-foreground">Setting up your profile, adding property details, and completing onboarding.</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Facility Policies</h3>
              <p className="text-sm text-muted-foreground">Understanding the SOSA facility assessment and generated safety policies.</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Account & Login</h3>
              <p className="text-sm text-muted-foreground">Password resets, email verification issues, and account access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>

          <div className="space-y-5">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">What is SOS Safe certification?</h3>
              <p className="text-muted-foreground text-sm">
                SOS Safe is a safety certification for hotels, hostels, guesthouses, and tour operators. Your team
                completes three training modules covering emergency preparedness, facility safety, and communication
                protocols. Score 80% or higher to earn your certification badge.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">How do I add staff members to our account?</h3>
              <p className="text-muted-foreground text-sm">
                Go to the Team page in your dashboard and copy your invite link. Share it with staff — when they
                sign up through the link, they&apos;re automatically added to your organization. You can track each
                team member&apos;s training progress from the same page.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">What are the certification tiers?</h3>
              <p className="text-muted-foreground text-sm">
                There are three tiers — Basic, Premium, and Elite — each covering progressively more advanced safety
                topics. All tiers require an 80% passing score. Your certification tier and verification code are
                displayed on a public verification page that guests and insurers can check.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">How much does it cost?</h3>
              <p className="text-muted-foreground text-sm">
                Plans start at $12/month for hostels, with pricing based on property type. Every plan includes full
                access to all features — certification, team management, AI assistant, and facility assessment.
                All new accounts start with a 30-day free trial, no credit card required.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">What happens if my subscription lapses?</h3>
              <p className="text-muted-foreground text-sm">
                Your dashboard becomes read-only and your certification status is set to inactive. Your data,
                training progress, and team information are preserved — nothing is deleted. Resubscribe at any
                time to reactivate everything.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Is staff training included?</h3>
              <p className="text-muted-foreground text-sm">
                Yes. All plans include unlimited staff seats. Each team member can complete the training modules
                independently, and managers can track completion across the team from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Sign up in minutes and start your 30-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              Get Certified
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-border px-8 py-3 font-medium hover:bg-muted/50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
