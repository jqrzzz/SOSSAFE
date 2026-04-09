import type { Metadata } from "next"
import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"

export const metadata: Metadata = {
  title: "Privacy Policy | SOS Safe",
  description: "How Tourist SOS, Inc. collects, uses, and protects your information on the SOS Safe certification platform.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 rounded-2xl">
            <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
            <div className="text-sm text-muted-foreground mb-8">Last updated: April 2026</div>

            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Tourist SOS, Inc. (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the SOS Safety
                  certification platform. This Privacy Policy explains how we collect, use, disclose, and protect your
                  information when you use our Platform.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    <strong>Age Restriction:</strong> Our Platform is for individuals 18 years of age or older. We do
                    not knowingly collect information from anyone under 18. By using the Platform, you confirm you are
                    at least 18 years old.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  By using the Platform, you agree to the collection and use of information as described here. If you
                  do not agree, please do not use the Platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>

                <h3 className="text-xl font-medium text-foreground mb-3">1.1 Information You Provide</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Account Information:</strong> Name, email address, password, organization name, role
                  </li>
                  <li>
                    <strong>Organization Details:</strong> Property or company name, type (accommodation/tour operator),
                    address, phone, website, property size, guest capacity
                  </li>
                  <li>
                    <strong>Assessment Data:</strong> Your responses to certification module questions, facility
                    assessment answers, and scores
                  </li>
                  <li>
                    <strong>Knowledge Contributions:</strong> Local safety information you share through the knowledge base
                  </li>
                  <li>
                    <strong>Chat Data:</strong> Messages you send to the SOSA AI assistant
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">1.2 Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Device Information:</strong> IP address, browser type, operating system, device type
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used, time spent, via Vercel Analytics
                  </li>
                  <li>
                    <strong>Authentication Data:</strong> Login timestamps, session tokens (managed by Supabase Auth)
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">1.3 Information from Third Parties</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Emergency case data from the Tourist SOS Command Center (read-only, linked to your organization)</li>
                  <li>Team member information when staff join via invite links</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>

                <h3 className="text-xl font-medium text-foreground mb-3">2.1 Platform Operations</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Operate the certification, training, and assessment features</li>
                  <li>Generate and verify digital certificates and verification codes</li>
                  <li>Manage team memberships and role-based access</li>
                  <li>Generate Policies &amp; Procedures documents from your facility assessment</li>
                  <li>Power the SOSA AI assistant with context about your organization</li>
                  <li>Send notifications about certification status, team activity, and training progress</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.2 Public Verification</h3>
                <p className="text-muted-foreground mb-4">
                  When your organization earns an SOS Safe certification, limited information is made publicly
                  accessible via the verification page (/verify/[code]):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Organization name, type, city, and country</li>
                  <li>Certification tier, issue date, and expiry date</li>
                  <li>Verification code and certification status (active/expired/revoked)</li>
                </ul>
                <p className="text-muted-foreground mb-6">
                  This is a core feature of the certification system — it allows travelers and insurers to verify your
                  certification. Assessment scores, internal team data, and other details are never exposed publicly.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">2.3 Improvement and Analytics</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Analyze usage patterns to improve the Platform</li>
                  <li>Monitor performance and fix technical issues</li>
                  <li>We use Vercel Analytics for anonymized, privacy-friendly web analytics</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, rent, or trade your personal information. We share information only as follows:
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">3.1 Service Providers</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li><strong>Supabase:</strong> Authentication, database hosting, and file storage</li>
                  <li><strong>Vercel:</strong> Application hosting and analytics</li>
                  <li><strong>Anthropic:</strong> AI model provider for the SOSA assistant and policy generation</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">3.2 Public Verification</h3>
                <p className="text-muted-foreground mb-6">
                  Organization name, location, and certification status are visible on the public verification page
                  as described in Section 2.2.
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">3.3 Legal Requirements</h3>
                <p className="text-muted-foreground mb-4">
                  We may disclose information when required by law, court order, or government request, or to protect
                  the rights, property, or safety of Tourist SOS, our users, or the public.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    <strong>We never sell your data.</strong> Your personal information and assessment data are not
                    shared with advertisers, data brokers, or any third party for marketing purposes.
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We take reasonable measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>All data transmitted over HTTPS/TLS encryption</li>
                  <li>Passwords are hashed and never stored in plain text (managed by Supabase Auth)</li>
                  <li>Row-Level Security (RLS) policies ensure users can only access their own organization&rsquo;s data</li>
                  <li>API endpoints are rate-limited to prevent abuse</li>
                  <li>Authentication middleware protects all dashboard routes</li>
                  <li>Soft deletes for team member removal (data preserved for audit)</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200">
                    <strong>No system is 100% secure.</strong> While we implement industry-standard security practices,
                    we cannot guarantee absolute security. We continuously monitor and improve our security posture.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Retention</h2>
                <p className="text-muted-foreground mb-4">
                  We retain your information for different periods depending on the type:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>
                    <strong>Account and Profile Data:</strong> Until you delete your account, plus 30 days for recovery
                  </li>
                  <li>
                    <strong>Certification Records:</strong> 7 years after expiry, for compliance and audit purposes
                  </li>
                  <li>
                    <strong>Training Completion Records:</strong> 5 years, for staff training compliance verification
                  </li>
                  <li>
                    <strong>Assessment Responses:</strong> Duration of your active certification plus 1 year
                  </li>
                  <li>
                    <strong>Usage Analytics:</strong> 2 years (anonymized after 12 months)
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  After retention periods expire, data is securely deleted or anonymized. Some data may be retained
                  longer if required by law.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Privacy Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                  <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                  <h4 className="font-medium text-foreground mb-2">How to Exercise Your Rights</h4>
                  <p className="text-muted-foreground mb-2">Contact us at:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><strong>Email:</strong> privacy@tourist-sos.com</li>
                    <li><strong>Subject:</strong> &ldquo;Privacy Rights Request&rdquo;</li>
                    <li><strong>Response Time:</strong> Within 30 days</li>
                  </ul>
                </div>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. International Data Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Your data may be processed in countries other than your own, as our service providers
                  (Supabase, Vercel, Anthropic) operate globally. We rely on appropriate safeguards such as
                  Standard Contractual Clauses where applicable.
                </p>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We use a limited set of cookies:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>
                    <strong>Essential (Authentication):</strong> Supabase session cookies for login functionality.
                    These are required for the Platform to work.
                  </li>
                  <li>
                    <strong>Analytics:</strong> Vercel Analytics collects anonymized usage data. No personally
                    identifiable information is tracked.
                  </li>
                  <li>
                    <strong>Preferences:</strong> Cookie consent choice stored in local storage.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  You can manage cookies through your browser settings. Disabling essential cookies will prevent
                  you from logging in.
                </p>
              </section>

              {/* Children */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children&rsquo;s Privacy</h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-bold mb-1">Adults Only &mdash; 18+ Required</p>
                  <p className="text-red-800 dark:text-red-200">
                    The Platform is not intended for anyone under 18. If we learn we have collected information from a
                    minor, we will delete it immediately and terminate the account.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Parents or guardians who believe their child has provided information to us should contact us
                  immediately at privacy@tourist-sos.com.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this policy from time to time. Material changes will be communicated via email and/or
                  a notice on the Platform. The &ldquo;Last updated&rdquo; date at the top will reflect the most recent
                  revision. Continued use after changes take effect constitutes acceptance.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact</h2>
                <p className="text-muted-foreground mb-4">
                  For privacy questions or requests:
                </p>
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Privacy Team</h4>
                      <div className="space-y-2 text-muted-foreground">
                        <div><strong>Email:</strong> privacy@tourist-sos.com</div>
                        <div><strong>General:</strong> support@tourist-sos.com</div>
                        <div><strong>Response Time:</strong> 48 hours for urgent matters</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Mailing Address</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Tourist SOS, Inc.</div>
                        <div>388 Exchange Tower, Sukhumvit Road</div>
                        <div>Klongtoey, Bangkok 10110</div>
                        <div>Thailand</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
