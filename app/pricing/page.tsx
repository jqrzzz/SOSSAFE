"use client"

import { useState } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"
import {
  PRICING_PLANS,
  INCLUDED_FEATURES,
  TRIAL_DAYS,
  formatPrice,
} from "@/lib/pricing-data"

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Hero */}
      <section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Simple, Fair Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every plan includes full access to all features. Pick the plan that
            matches your business — start with a {TRIAL_DAYS}-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-muted/50 border border-border/50">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs text-primary font-semibold">Save ~15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => {
              const price =
                billing === "monthly"
                  ? plan.monthlyPrice
                  : plan.annualMonthly
              const isPopular = plan.id === "guesthouse"

              return (
                <div
                  key={plan.id}
                  className={`relative glass-card rounded-xl border p-6 flex flex-col ${
                    isPopular
                      ? "border-primary/50 ring-1 ring-primary/20"
                      : "border-border/50"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <PlanIcon type={plan.icon} />
                  </div>

                  {/* Name & description */}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {formatPrice(price)}
                      </span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    {billing === "annual" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPrice(plan.annualPrice)} billed annually
                      </p>
                    )}
                    {billing === "monthly" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        billed monthly
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/auth/sign-up?plan=${plan.id}`}
                    className={`w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isPopular
                        ? "btn-primary-gradient text-white"
                        : "border border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    Start Free Trial
                  </Link>

                  {/* Examples */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {plan.examples.map((ex) => (
                        <li
                          key={ex}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="text-primary text-[10px]">&#10003;</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* All plans include */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-xl border border-border/50 p-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              Every Plan Includes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INCLUDED_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2.5"
                >
                  <svg
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Ready to protect your guests?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start your {TRIAL_DAYS}-day free trial today. No credit card required.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "What happens after the free trial?",
    a: "After 30 days your dashboard becomes read-only until you subscribe. Your certification data and team progress are preserved — nothing is deleted. Subscribe any time to reactivate.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. Sign up with just your email and start your free trial immediately. We'll only ask for payment details when you're ready to subscribe.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. If your business changes — for example, you upgrade from a guesthouse to a hotel — you can switch plans at any time from your dashboard settings.",
  },
  {
    q: "Do all plans really include everything?",
    a: "Yes. Every plan has full access to all certification tiers, unlimited staff seats, the AI assistant, facility assessment, policy generation, case dashboard, and certificate verification. The only difference is the price, which reflects the scale of your business.",
  },
  {
    q: "Is this a one-year commitment?",
    a: "Monthly plans can be cancelled any time. Annual plans are paid upfront for a full year at a discounted rate. Both include the same 30-day free trial.",
  },
  {
    q: "What happens to my certification if I cancel?",
    a: "Your SOS Safe certification becomes inactive and your public verification page will show an expired status. Your badge must no longer be displayed. You can resubscribe at any time to reactivate.",
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass-card rounded-lg border border-border/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium pr-4">{question}</span>
        <svg
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

/* ── Plan Icons ───────────────────────────────────────────────────── */

function PlanIcon({ type }: { type: string }) {
  switch (type) {
    case "hostel":
      return (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case "guesthouse":
      return (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case "hotel":
      return (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    case "tour":
      return (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return null
  }
}
