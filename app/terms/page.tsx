import Link from "next/link"
import { MarketingHeader } from "@/components/MarketingHeader"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">Last updated: April 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using the SOS Safety certification platform (&ldquo;the Platform&rdquo;), operated by
                Tourist SOS, Inc. (&ldquo;Tourist SOS,&rdquo; &ldquo;we,&rdquo; &ldquo;our&rdquo;), you (&ldquo;User,&rdquo;
                &ldquo;you,&rdquo; or &ldquo;your&rdquo;) agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;)
                and our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is
                incorporated by reference.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Age Requirement:</strong> You must be at least 18 years of age to use this Platform. By creating
                an account, you represent and warrant that you are 18 years of age or older.
              </p>
              <p className="text-muted-foreground">
                If you do not agree to these Terms, do not use the Platform. These Terms apply to all users, including
                accommodation providers, tour operators, their staff, and any other parties accessing the Platform.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Service Description</h2>
              <p className="text-muted-foreground mb-4">
                SOS Safety is a safety certification and training platform for the hospitality industry. The Platform
                provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Online safety training modules and assessments across three certification tiers (Basic, Premium, Elite)</li>
                <li>Digital certificates with public verification codes and QR-based authentication</li>
                <li>Team management tools for inviting staff and tracking training completion</li>
                <li>Local safety knowledge sharing between team members</li>
                <li>Facility assessment interviews and generated Policies &amp; Procedures documents</li>
                <li>Read-only access to emergency case data created through the Tourist SOS network</li>
                <li>AI-powered assistant (SOSA) for safety guidance and platform support</li>
              </ul>
              <p className="text-muted-foreground">
                <strong>Not an Emergency Service:</strong> The Platform is a training and certification tool. It does not
                provide emergency response, medical advice, diagnosis, or treatment. In any emergency, contact local
                emergency services immediately.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. SOS Safe Certification</h2>
              <p className="text-muted-foreground mb-4">
                <strong>What Certification Represents:</strong> An SOS Safe certification indicates that the certified
                organization has completed the required training modules with a minimum passing score of 80% in the
                applicable tier. It demonstrates a commitment to guest safety preparedness and training standards
                defined by Tourist SOS.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>What Certification Does Not Guarantee:</strong> Certification does not constitute:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>A guarantee that emergencies will not occur at the certified property</li>
                <li>An endorsement of the property&rsquo;s physical safety, structural integrity, or regulatory compliance</li>
                <li>A warranty of the quality of care provided by the certified organization&rsquo;s staff</li>
                <li>Insurance coverage or liability protection of any kind</li>
                <li>Compliance with local safety regulations, building codes, or licensing requirements</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Validity and Expiry:</strong> Certifications are valid for the period stated on the certificate
                (1 year for Basic and Premium, 2 years for Elite). Expired certifications must be renewed by
                re-completing the required modules. Expired or revoked certifications must not be displayed or
                represented as active.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Badge and Logo Usage:</strong> Certified organizations may display the SOS Safe certification
                badge on their website, marketing materials, and physical premises for the duration of their active
                certification only. The badge must not be altered, and its use must cease immediately upon expiration
                or revocation.
              </p>
              <p className="text-muted-foreground">
                <strong>Revocation:</strong> We reserve the right to revoke certification at any time if we determine
                that the certified organization has misrepresented its certification status, engaged in conduct that
                undermines guest safety, or violated these Terms.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Accounts and Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Account Registration:</strong> You must provide accurate, current, and complete information
                during registration. You are responsible for maintaining the confidentiality of your account credentials
                and for all activities under your account.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Organization Accounts:</strong> The account owner who registers an organization is responsible
                for managing team member access. Staff invited via team invite links are governed by these same Terms.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Prohibited Conduct:</strong> You must not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide false or misleading information in assessments or registration</li>
                <li>Share account credentials or allow unauthorized access</li>
                <li>Attempt to manipulate assessment scores or bypass module requirements</li>
                <li>Display expired or revoked certification badges</li>
                <li>Misrepresent the scope or meaning of your SOS Safe certification</li>
                <li>Use the Platform for any unlawful purpose</li>
                <li>Reverse engineer, decompile, or attempt to extract the Platform&rsquo;s source code</li>
                <li>Interfere with or disrupt the Platform or its infrastructure</li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. AI-Powered Features</h2>
              <p className="text-muted-foreground mb-4">
                The Platform includes AI-powered features such as the SOSA assistant and policy document generation.
                These features are informational tools and have inherent limitations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>AI-generated content is provided for guidance only and may contain errors or omissions</li>
                <li>Generated Policies &amp; Procedures documents should be reviewed by qualified personnel before adoption</li>
                <li>AI responses do not constitute professional safety, legal, or medical advice</li>
                <li>You are responsible for verifying the accuracy and suitability of any AI-generated content</li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Our IP:</strong> The Platform, including all software, content, training materials, assessment
                questions, certification badges, trademarks, and design, are owned by Tourist SOS. You may not copy,
                modify, or distribute any part of the Platform except as expressly permitted.
              </p>
              <p className="text-muted-foreground">
                <strong>Your Content:</strong> You retain ownership of content you submit (e.g., local knowledge entries,
                facility assessment answers). By submitting content, you grant us a non-exclusive, worldwide license to
                use, store, and process it for the purpose of operating the Platform and providing services to you.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Pricing and Payment</h2>
              <p className="text-muted-foreground mb-4">
                The Platform operates on a subscription basis with plans based on property type (Hostel, Guesthouse,
                Hotel &amp; Resort, Tour Operator). All plans include full access to all Platform features. Current
                pricing is available on our{" "}
                <Link href="/pricing" className="text-primary hover:underline">Pricing page</Link>.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Free Trial:</strong> New accounts receive a 30-day free trial with full access. No payment
                is required during the trial period. After the trial, an active subscription is required to
                maintain certification status and dashboard access.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Billing:</strong> Subscriptions are billed either monthly or annually, at your choice.
                Annual subscriptions are billed upfront for the full year at a discounted rate. Payments are
                processed by Stripe. We will provide at least 30 days&rsquo; notice before any pricing changes
                that affect existing subscribers.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Cancellation:</strong> Monthly subscriptions may be cancelled at any time. Annual
                subscriptions remain active for the paid period. Upon cancellation or non-payment, your
                certification becomes inactive, your dashboard becomes read-only, and your public verification
                page will reflect the inactive status.
              </p>
              <p className="text-muted-foreground">
                <strong>Refund Policy:</strong> Monthly subscriptions are non-refundable. Annual subscriptions
                may be refunded on a prorated basis within the first 30 days of the subscription period.
                Contact support@tourist-sos.com for refund requests.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                <strong>AS-IS BASIS:</strong> The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                without warranties of any kind, express or implied, including warranties of merchantability, fitness for
                a particular purpose, or non-infringement.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>LIMITATION:</strong> To the maximum extent permitted by law, Tourist SOS shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Personal injury, death, or property damage arising at certified or non-certified properties</li>
                <li>Emergency outcomes, regardless of the organization&rsquo;s certification status</li>
                <li>Service interruptions, technical failures, or data loss</li>
                <li>Decisions made based on AI-generated content, training materials, or assessment results</li>
                <li>Actions or omissions of certified organizations, their staff, or third parties</li>
                <li>Loss of business, profits, data, or other economic losses</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>INDEMNIFICATION:</strong> You agree to indemnify and hold harmless Tourist SOS from any claims,
                damages, losses, or expenses arising from your use of the Platform, your certification status, your
                violation of these Terms, or your organization&rsquo;s operations.
              </p>
              <p className="text-muted-foreground">
                <strong>MAXIMUM LIABILITY:</strong> In any event, our total aggregate liability shall not exceed the
                amount you have paid us in the 12 months preceding the claim, or USD $100, whichever is greater.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Account Termination</h2>
              <p className="text-muted-foreground mb-4">
                <strong>By You:</strong> You may close your account at any time by contacting support. Closing your
                account will deactivate your certification and remove your team&rsquo;s access.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>By Us:</strong> We may suspend or terminate your account for material breach of these Terms,
                fraudulent activity, non-payment of applicable fees, or if required by law. We will provide reasonable
                notice where possible.
              </p>
              <p className="text-muted-foreground">
                <strong>Effect:</strong> Upon termination, your certification becomes inactive and your right to display
                the SOS Safe badge ceases immediately. We may retain certain data as required by law or for legitimate
                business purposes.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Modifications</h2>
              <p className="text-muted-foreground mb-4">
                We may update these Terms from time to time. Material changes will be communicated via email to your
                registered address and/or a notice on the Platform. Continued use after changes take effect constitutes
                acceptance of the updated Terms.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Dispute Resolution and Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Governing Law:</strong> These Terms are governed by the laws of the Kingdom of Thailand. Any
                legal proceedings shall be brought exclusively in the courts of Bangkok, Thailand.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Dispute Process:</strong> Before initiating legal proceedings, both parties agree to attempt
                informal resolution for at least 30 days. If unresolved, disputes will be submitted to mediation
                before proceeding to binding arbitration or litigation.
              </p>
              <p className="text-muted-foreground">
                <strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive any right to
                participate in class action lawsuits or class-wide arbitration.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. General Provisions</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire
                agreement between you and Tourist SOS regarding the Platform.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions continue
                in full effect.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Force Majeure:</strong> Neither party is liable for delays or failures caused by circumstances
                beyond reasonable control, including natural disasters, government actions, or infrastructure failures.
              </p>
              <p className="text-muted-foreground">
                <strong>Assignment:</strong> You may not assign your rights under these Terms without our written
                consent. We may assign our rights and obligations without restriction.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms, contact us at:
              </p>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Email:</strong> legal@tourist-sos.com</p>
                <p><strong>General Support:</strong> support@tourist-sos.com</p>
                <p>
                  <strong>Mailing Address:</strong><br />
                  Tourist SOS, Inc.<br />
                  388 Exchange Tower, Sukhumvit Road<br />
                  Klongtoey, Bangkok 10110<br />
                  Thailand
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Tourist SOS, Inc.</div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
