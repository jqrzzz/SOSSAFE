import { MarketingHeader } from "@/components/MarketingHeader"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Terms Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">Last updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing, downloading, installing, or using Tourist SOS ("the Service," "Platform," "Application"),
                you ("User," "you," or "your") acknowledge that you have read, understood, and agree to be legally bound
                by these Terms of Service ("Terms," "Agreement") and our Privacy Policy, which is incorporated herein by
                reference.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Age Requirement:</strong> You must be at least 18 years of age to use this Service. By using
                Tourist SOS, you represent and warrant that you are 18 years of age or older and have the legal capacity
                to enter into this Agreement.
              </p>
              <p className="text-muted-foreground">
                If you do not agree to these Terms or do not meet the age requirement, you must not access or use the
                Service. These Terms apply to all users, including hospitality staff, tour operators, first responders,
                administrators, and any other parties accessing the Platform.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Service Description and Scope</h2>
              <p className="text-muted-foreground mb-4">
                Tourist SOS is a professional emergency communication and coordination platform designed exclusively for
                hospitality industry professionals, tour operators, and certified first responders. The Service
                provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Real-time secure messaging and communication infrastructure</li>
                <li>Emergency protocol guidance and AI-powered decision support tools</li>
                <li>Professional training modules and certification tracking systems</li>
                <li>Incident documentation, reporting, and analytics capabilities</li>
                <li>Integration with local emergency response networks and authorities</li>
                <li>Multi-language support and cultural sensitivity resources</li>
                <li>Geolocation services and mapping functionality</li>
                <li>Audit trails and compliance monitoring tools</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Professional Use Only:</strong> This Platform is intended solely for professional emergency
                response coordination and is not a consumer application. Users must maintain appropriate professional
                credentials and certifications as required by their jurisdiction.
              </p>
              <p className="text-muted-foreground">
                <strong>Service Limitations:</strong> Tourist SOS facilitates communication and provides informational
                resources but does not provide medical advice, diagnosis, treatment, or replace professional emergency
                services. The Platform is a coordination tool only.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                3. User Eligibility and Account Requirements
              </h2>
              <p className="text-muted-foreground mb-4">
                <strong>Professional Requirements:</strong> Users must be:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>At least 18 years of age with valid government-issued identification</li>
                <li>Currently employed in hospitality, tourism, or emergency response sectors</li>
                <li>Authorized by their employer or organization to use emergency communication systems</li>
                <li>Compliant with all applicable professional licensing and certification requirements</li>
                <li>Able to demonstrate legitimate business need for emergency coordination services</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Account Verification:</strong> We reserve the right to verify user credentials, employment
                status, and professional qualifications. Accounts may be suspended pending verification or if
                credentials cannot be authenticated.
              </p>
              <p className="text-muted-foreground">
                <strong>Account Security:</strong> Users are solely responsible for maintaining the confidentiality of
                their account credentials and for all activities that occur under their account. You must immediately
                notify us of any unauthorized use or security breach.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                4. User Obligations and Prohibited Conduct
              </h2>
              <p className="text-muted-foreground mb-4">
                <strong>Required Conduct:</strong> Users must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration and use</li>
                <li>Use the Platform exclusively for legitimate emergency response and coordination purposes</li>
                <li>Maintain strict confidentiality of all emergency-related communications and data</li>
                <li>
                  Comply with all applicable laws, regulations, professional standards, and organizational policies
                </li>
                <li>Respect the privacy, dignity, and rights of all individuals involved in emergency situations</li>
                <li>Report suspected misuse, security vulnerabilities, or inappropriate behavior immediately</li>
                <li>Keep professional certifications and training current as required by jurisdiction</li>
                <li>Follow established emergency protocols and chain of command procedures</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Strictly Prohibited Activities:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Using the Service for non-emergency communications or personal purposes</li>
                <li>Sharing account credentials or allowing unauthorized access</li>
                <li>Transmitting false, misleading, or fraudulent emergency information</li>
                <li>Harassment, discrimination, or unprofessional conduct toward any user</li>
                <li>Attempting to circumvent security measures or access unauthorized data</li>
                <li>Using the Platform for commercial solicitation or marketing purposes</li>
                <li>Reverse engineering, decompiling, or attempting to extract source code</li>
                <li>Interfering with or disrupting the Service or its infrastructure</li>
                <li>Violating any applicable privacy laws or professional confidentiality requirements</li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                5. Emergency Response and Medical Disclaimers
              </h2>
              <p className="text-muted-foreground mb-4">
                <strong>CRITICAL DISCLAIMER:</strong> Tourist SOS is a communication and coordination platform only. It
                does not provide medical advice, diagnosis, treatment, or emergency response services.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>User Acknowledgments:</strong> By using this Service, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  The Platform facilitates communication but does not guarantee response times, availability, or
                  outcomes
                </li>
                <li>All medical and emergency response decisions must be made by qualified, licensed professionals</li>
                <li>
                  In life-threatening emergencies, you must immediately contact local emergency services (911, 112,
                  etc.)
                </li>
                <li>
                  AI-powered guidance and recommendations are informational only and must not replace professional
                  judgment
                </li>
                <li>
                  Tourist SOS bears no responsibility for emergency response outcomes, medical decisions, or treatment
                  results
                </li>
                <li>
                  The Platform may experience technical failures, outages, or limitations that could affect emergency
                  communications
                </li>
                <li>
                  You assume all risks associated with relying on digital communication systems during emergencies
                </li>
              </ul>
              <p className="text-muted-foreground">
                <strong>Professional Responsibility:</strong> Users remain fully responsible for their professional
                duties, decisions, and compliance with applicable standards of care, regardless of any information or
                guidance provided through the Platform.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Data Protection and Privacy</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Data Security Measures:</strong> We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>End-to-end encryption for all communications and sensitive data</li>
                <li>Multi-factor authentication and advanced access controls</li>
                <li>Regular security audits, penetration testing, and vulnerability assessments</li>
                <li>Compliance with SOC 2, GDPR, HIPAA, and other applicable data protection standards</li>
                <li>Secure data centers with 24/7 monitoring and incident response capabilities</li>
                <li>Data minimization principles and purpose limitation practices</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Data Retention and Deletion:</strong> Emergency communications and incident data may be retained
                for legal, regulatory, and safety purposes as outlined in our Privacy Policy. Users may request data
                deletion subject to applicable legal requirements.
              </p>
              <p className="text-muted-foreground">
                For comprehensive information about our data practices, please review our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                , which forms an integral part of this Agreement.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Intellectual Property Rights</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Platform Ownership:</strong> Tourist SOS and its licensors retain all rights, title, and
                interest in the Platform, including all software, algorithms, user interfaces, content, trademarks,
                service marks, and other intellectual property.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Limited License:</strong> Subject to these Terms, we grant you a limited, non-exclusive,
                non-transferable, revocable license to access and use the Service solely for its intended professional
                purposes. This license does not include any right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Modify, adapt, or create derivative works of the Platform</li>
                <li>Reverse engineer, decompile, or disassemble any software components</li>
                <li>Remove or alter any proprietary notices or labels</li>
                <li>Use our trademarks, service marks, or branding without written permission</li>
                <li>Access or use the Platform for competitive analysis or development</li>
              </ul>
              <p className="text-muted-foreground">
                <strong>User Content:</strong> You retain ownership of content you create, but grant us necessary rights
                to operate the Service, including storing, transmitting, and processing communications for emergency
                response purposes.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                8. Limitation of Liability and Disclaimers
              </h2>
              <p className="text-muted-foreground mb-4">
                <strong>SERVICE PROVIDED "AS IS":</strong> Tourist SOS is provided on an "as is" and "as available"
                basis without warranties of any kind, either express or implied, including but not limited to warranties
                of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by applicable law, Tourist
                SOS, its officers, directors, employees, agents, and affiliates shall not be liable for any direct,
                indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Personal injury, death, or property damage arising from emergency situations</li>
                <li>Medical malpractice, negligence, or professional liability claims</li>
                <li>Service interruptions, technical failures, data loss, or security breaches</li>
                <li>Decisions made by users based on Platform information or recommendations</li>
                <li>Actions or omissions of third-party service providers or emergency responders</li>
                <li>Loss of business, profits, data, or other economic losses</li>
                <li>Any damages exceeding the amount paid by you for the Service in the preceding 12 months</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>INDEMNIFICATION:</strong> You agree to indemnify, defend, and hold harmless Tourist SOS from any
                claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or
                infringement of any third-party rights.
              </p>
              <p className="text-muted-foreground">
                <strong>JURISDICTIONAL LIMITATIONS:</strong> Some jurisdictions do not allow the exclusion or limitation
                of certain warranties or damages. In such jurisdictions, our liability is limited to the maximum extent
                permitted by law.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Account Suspension and Termination</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Grounds for Termination:</strong> We may suspend or terminate your account immediately, with or
                without notice, for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Material breach of these Terms or our Privacy Policy</li>
                <li>Misuse of the Platform or violation of professional standards</li>
                <li>Failure to maintain required professional certifications or credentials</li>
                <li>Non-payment of applicable fees or charges</li>
                <li>Suspected fraudulent, illegal, or harmful activity</li>
                <li>Compromise of account security or unauthorized access</li>
                <li>Legal or regulatory requirements or court orders</li>
                <li>Discontinuation of the Service or specific features</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>User-Initiated Termination:</strong> You may terminate your account at any time by following the
                account closure procedures in the Platform or contacting our support team. Termination does not relieve
                you of obligations incurred prior to termination.
              </p>
              <p className="text-muted-foreground">
                <strong>Effect of Termination:</strong> Upon termination, your access to the Service will cease
                immediately. We may retain certain data as required by law, for legitimate business purposes, or to
                comply with our data retention policies.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Modifications and Updates</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Terms Modifications:</strong> We reserve the right to modify these Terms at any time to reflect
                changes in our services, legal requirements, or business practices. Material changes will be
                communicated through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>In-app notifications and prominent Platform notices</li>
                <li>Email notifications to your registered address</li>
                <li>Updates to this page with revised effective dates</li>
                <li>Direct communication for significant changes affecting user rights</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Service Updates:</strong> We may modify, update, or discontinue features of the Service at any
                time. We will provide reasonable notice for material changes that significantly impact functionality.
              </p>
              <p className="text-muted-foreground">
                <strong>Continued Use:</strong> Your continued use of the Service after any modifications constitutes
                acceptance of the revised Terms. If you do not agree to the changes, you must discontinue use of the
                Service.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Dispute Resolution and Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of
                the Kingdom of Thailand, without regard to conflict of law principles. Any legal action or proceeding arising
                under these Terms will be brought exclusively in the courts of Bangkok, Thailand.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Dispute Resolution Process:</strong>
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  <strong>Informal Resolution:</strong> Before initiating formal proceedings, parties must attempt to
                  resolve disputes through good faith negotiations for at least 30 days.
                </li>
                <li>
                  <strong>Mediation:</strong> If informal resolution fails, disputes will be submitted to binding
                  mediation administered by a recognized mediation service.
                </li>
                <li>
                  <strong>Arbitration:</strong> Unresolved disputes will be settled through binding arbitration in
                  accordance with applicable arbitration rules.
                </li>
                <li>
                  <strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive any right
                  to participate in class action lawsuits or class-wide arbitration.
                </li>
              </ol>
              <p className="text-muted-foreground">
                <strong>Exceptions:</strong> Either party may seek injunctive relief in court for intellectual property
                infringement, confidentiality breaches, or other matters requiring immediate judicial intervention.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Miscellaneous Provisions</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any additional
                agreements, constitute the entire agreement between you and Tourist SOS regarding the Service.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable or invalid,
                the remaining provisions will continue in full force and effect, and the invalid provision will be
                modified to the minimum extent necessary to make it enforceable.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Assignment:</strong> You may not assign or transfer your rights under these Terms without our
                written consent. We may assign our rights and obligations without restriction.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Force Majeure:</strong> Neither party will be liable for delays or failures in performance
                resulting from circumstances beyond their reasonable control, including natural disasters, government
                actions, or technical infrastructure failures.
              </p>
              <p className="text-muted-foreground">
                <strong>Survival:</strong> Provisions relating to intellectual property, confidentiality, limitation of
                liability, indemnification, and dispute resolution will survive termination of these Terms.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information and Support</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms of Service, legal matters, or compliance issues, please contact our
                Legal Department:
              </p>
              <div className="text-muted-foreground space-y-2 mb-6">
                <p>
                  <strong>Legal Department:</strong> legal@touristsos.com
                </p>
                <p>
                  <strong>Compliance Officer:</strong> compliance@touristsos.com
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> privacy@touristsos.com
                </p>
                <p>
                  <strong>Security Issues:</strong> security@touristsos.com
                </p>
                <p>
                  <strong>Mailing Address:</strong> Tourist SOS Legal Department
                  <br />
                  388 Exchange Tower, Sukhumvit Road
                  <br />
                  Klongtoey, Bangkok 10110
                  <br />
                  Thailand
                </p>
              </div>
              <p className="text-muted-foreground mb-4">
                <strong>Technical Support:</strong> For technical assistance, account issues, or general inquiries,
                please use our support portal or contact support@touristsos.com.
              </p>
              <p className="text-muted-foreground">
                <strong>Emergency Support:</strong> For urgent technical issues affecting emergency response
                capabilities, please use our 24/7 emergency support hotline available through the Platform.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">© 2025 Tourist SOS. All rights reserved.</div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="/support" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
