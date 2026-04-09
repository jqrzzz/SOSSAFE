import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Header */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">Support Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get help with Tourist SOS platform, emergency protocols, and technical support
          </p>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-2xl border-2 border-red-500/20 bg-red-500/5">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Emergency Support</h2>
              <p className="text-muted-foreground mb-6">
                For active emergencies or critical platform issues affecting guest safety
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+66-2-123-4567"
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Emergency Hotline
                </a>
                <a
                  href="mailto:emergency@touristsos.com"
                  className="inline-flex items-center gap-2 border border-red-500 text-red-600 hover:bg-red-500/10 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  emergency@touristsos.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Available 24/7 • Response time: Under 5 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center gradient-text mb-12">Get Support</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Live Chat</h3>
              <p className="text-muted-foreground mb-6">Get instant help from our support team during business hours</p>
              <a
                href="mailto:support@touristsos.com?subject=Support%20Request"
                className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white w-full block text-center"
              >
                Contact Us
              </a>
              <p className="text-sm text-muted-foreground mt-3">Response within 4 hours</p>
            </div>

            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Email Support</h3>
              <p className="text-muted-foreground mb-6">Send detailed questions and get comprehensive responses</p>
              <a
                href="mailto:support@touristsos.com"
                className="border border-secondary text-secondary hover:bg-secondary/10 px-6 py-3 rounded-lg font-medium transition-colors block"
              >
                support@touristsos.com
              </a>
              <p className="text-sm text-muted-foreground mt-3">Response within 4 hours</p>
            </div>

            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Phone Support</h3>
              <p className="text-muted-foreground mb-6">Speak directly with our technical support specialists</p>
              <a
                href="tel:+66-2-987-6543"
                className="border border-accent text-accent hover:bg-accent/10 px-6 py-3 rounded-lg font-medium transition-colors block"
              >
                +66-2-987-6543
              </a>
              <p className="text-sm text-muted-foreground mt-3">Mon-Fri 9AM-6PM (GMT+7)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center gradient-text mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">What is SOS Safe certification?</h3>
              <p className="text-muted-foreground">
                SOS Safe is a safety certification for hotels, hostels, guesthouses, and tour operators. Your team
                completes three training modules covering emergency preparedness, facility safety, and communication
                protocols. Score 80% or higher to earn your certification badge.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">How do I add staff members to our account?</h3>
              <p className="text-muted-foreground">
                Go to the Team page in your dashboard and copy your invite link. Share it with staff — when they
                sign up through the link, they&apos;re automatically added to your organization. You can track each
                team member&apos;s training progress from the same page.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">What are the certification tiers?</h3>
              <p className="text-muted-foreground">
                There are three tiers — Basic, Premium, and Elite — each covering progressively more advanced safety
                topics. All tiers require an 80% passing score. Your certification tier and verification code are
                displayed on a public verification page that guests and insurers can check.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">How much does it cost?</h3>
              <p className="text-muted-foreground">
                Plans start at $12/month for hostels, with pricing based on property type. Every plan includes full
                access to all features — certification, team management, AI assistant, and facility assessment.
                All new accounts start with a 30-day free trial, no credit card required.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">What happens if my subscription lapses?</h3>
              <p className="text-muted-foreground">
                Your dashboard becomes read-only and your certification status is set to inactive. Your data,
                training progress, and team information are preserved — nothing is deleted. Resubscribe at any
                time to reactivate everything.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Is staff training included?</h3>
              <p className="text-muted-foreground">
                Yes. All plans include unlimited staff seats. Each team member can complete the training modules
                independently, and managers can track completion across the team from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center gradient-text mb-12">Support Resources</h2>

          <div className="glass-card p-8 rounded-xl text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Resources In Development</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re building out user guides, video tutorials, and integration documentation.
              In the meantime, our support team is available 24/7 via the channels above.
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
