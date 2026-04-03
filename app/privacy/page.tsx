"use client"

import { useState } from "react"
import { MarketingHeader } from "@/components/MarketingHeader"

export default function PrivacyPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <MarketingHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Privacy Policy Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 rounded-2xl">
            <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
            <div className="text-sm text-muted-foreground mb-8">Last updated: January 2025</div>

            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Tourist SOS ("we," "our," or "us") operates a professional emergency response coordination platform
                  designed exclusively for adults aged 18 and over. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our services.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    <strong>Age Restriction:</strong> Our services are strictly limited to individuals who are 18 years
                    of age or older. By using our platform, you represent and warrant that you are at least 18 years
                    old.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  By accessing or using our services, you agree to the collection and use of information in accordance
                  with this policy. If you do not agree with our policies and practices, do not use our services.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>

                <h3 className="text-xl font-medium text-foreground mb-3">1.1 Information You Provide</h3>
                <p className="text-muted-foreground mb-4">
                  We collect information you directly provide to us, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Account Information:</strong> Full name, email address, phone number, professional title,
                    organization name, work address, emergency contact details
                  </li>
                  <li>
                    <strong>Professional Credentials:</strong> Certifications, training records, professional licenses,
                    employment verification
                  </li>
                  <li>
                    <strong>Emergency Case Data:</strong> Incident reports, case notes, communications, photos, videos,
                    audio recordings, location coordinates, timestamps
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Messages, calls, video conferences, file attachments sent
                    through our platform
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing address, payment method details (processed by
                    third-party payment processors)
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">1.2 Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Device Information:</strong> IP address, device type, operating system, browser type and
                    version, device identifiers
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns, search
                    queries, session recordings
                  </li>
                  <li>
                    <strong>Location Data:</strong> GPS coordinates, Wi-Fi network information, cell tower data (when
                    location services are enabled)
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Log files, cookies, web beacons, analytics data, performance
                    metrics
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">1.3 Information from Third Parties</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Professional verification services and background check providers</li>
                  <li>Emergency services and first responder organizations</li>
                  <li>Hotel management systems and property management platforms</li>
                  <li>Insurance companies and legal representatives</li>
                  <li>Government agencies and regulatory bodies</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use your information for the following purposes:</p>

                <h3 className="text-xl font-medium text-foreground mb-3">2.1 Service Provision</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Facilitate real-time emergency response coordination</li>
                  <li>Connect hospitality staff with qualified first responders</li>
                  <li>Provide training programs and certification management</li>
                  <li>Maintain emergency case records and documentation</li>
                  <li>Enable secure communication channels during emergencies</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.2 Platform Operations</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Verify professional credentials and maintain user safety</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Send service notifications, updates, and emergency alerts</li>
                  <li>Analyze usage patterns to improve our services</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.3 Legal and Safety</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Protect against fraud, abuse, and security threats</li>
                  <li>Enforce our terms of service and user agreements</li>
                  <li>Respond to legal requests and court orders</li>
                  <li>Maintain records for insurance and liability purposes</li>
                </ul>
              </section>

              {/* Information Sharing and Disclosure */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-4">
                  We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">3.1 Emergency Response</h3>
                <p className="text-muted-foreground mb-4">
                  During active emergency situations, we share relevant information with:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Certified first responders and emergency medical personnel</li>
                  <li>Local emergency services (police, fire, ambulance)</li>
                  <li>Hospital emergency departments and medical facilities</li>
                  <li>Hotel management and security personnel</li>
                  <li>Insurance companies and legal representatives (as required)</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">3.2 Service Providers</h3>
                <p className="text-muted-foreground mb-4">
                  We work with trusted third-party service providers who assist us in operating our platform:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Cloud hosting and data storage providers (AWS, Google Cloud)</li>
                  <li>Payment processors and financial institutions</li>
                  <li>Communication service providers (SMS, email, video calling)</li>
                  <li>Analytics and performance monitoring services</li>
                  <li>Professional verification and background check services</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">3.3 Legal Requirements</h3>
                <p className="text-muted-foreground mb-4">
                  We may disclose your information when required by law or when we believe disclosure is necessary to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Comply with legal process, court orders, or government requests</li>
                  <li>Protect the rights, property, or safety of Tourist SOS, our users, or the public</li>
                  <li>Investigate potential violations of our terms of service</li>
                  <li>Respond to claims of illegal activity or intellectual property infringement</li>
                </ul>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    <strong>Important:</strong> We never sell, rent, or trade your personal information to third parties
                    for marketing purposes. Your data is only shared as described in this policy or with your explicit
                    consent.
                  </p>
                </div>
              </section>

              {/* Data Security and Protection */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security and Protection</h2>
                <p className="text-muted-foreground mb-4">
                  We implement comprehensive security measures to protect your information:
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">4.1 Technical Safeguards</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>End-to-end encryption for all emergency communications</li>
                  <li>AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
                  <li>Multi-factor authentication for all user accounts</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Automated threat detection and response systems</li>
                  <li>Secure API endpoints with rate limiting and access controls</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">4.2 Organizational Safeguards</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Role-based access controls with principle of least privilege</li>
                  <li>Regular employee training on data protection and security</li>
                  <li>Confidentiality agreements with all staff and contractors</li>
                  <li>Incident response procedures and breach notification protocols</li>
                  <li>Regular backup and disaster recovery testing</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200">
                    <strong>Security Notice:</strong> While we implement industry-leading security measures, no system
                    is 100% secure. We continuously monitor and improve our security practices to protect your
                    information.
                  </p>
                </div>
              </section>

              {/* Data Retention and Deletion */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Retention and Deletion</h2>
                <p className="text-muted-foreground mb-4">
                  We retain your information for different periods based on the type of data and legal requirements:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Account Information:</strong> Until you delete your account, plus 30 days for account
                    recovery
                  </li>
                  <li>
                    <strong>Emergency Case Records:</strong> 10 years for legal, insurance, and regulatory compliance
                  </li>
                  <li>
                    <strong>Training and Certification Records:</strong> 7 years for professional compliance
                    requirements
                  </li>
                  <li>
                    <strong>Communication Data:</strong> 3 years for quality assurance and legal purposes
                  </li>
                  <li>
                    <strong>Usage and Analytics Data:</strong> 2 years for service improvement and analytics
                  </li>
                  <li>
                    <strong>Financial Records:</strong> 7 years for tax and accounting purposes
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  After the retention period expires, we securely delete or anonymize your information. Some information
                  may be retained longer if required by law or for legitimate business purposes.
                </p>
              </section>

              {/* Your Privacy Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Privacy Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">6.1 Access and Portability</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Request a copy of all personal information we hold about you</li>
                  <li>Receive your data in a structured, machine-readable format</li>
                  <li>Transfer your data to another service provider</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">6.2 Correction and Updates</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Update or correct inaccurate or incomplete information</li>
                  <li>Add missing information to your profile</li>
                  <li>Verify the accuracy of your professional credentials</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">6.3 Deletion and Restriction</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Request deletion of your personal information (subject to legal retention requirements)</li>
                  <li>Restrict or limit how we process your information</li>
                  <li>Object to certain types of processing activities</li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-4">
                  <h4 className="font-medium text-foreground mb-2">How to Exercise Your Rights</h4>
                  <p className="text-muted-foreground mb-2">To exercise any of these rights, contact us at:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      <strong>Email:</strong> privacy@touristsos.com
                    </li>
                    <li>
                      <strong>Subject Line:</strong> "Privacy Rights Request"
                    </li>
                    <li>
                      <strong>Response Time:</strong> We will respond within 30 days
                    </li>
                  </ul>
                </div>
              </section>

              {/* International Data Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. International Data Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Tourist SOS operates globally, and your information may be transferred to and processed in countries
                  other than your own, including the United States, European Union, and other jurisdictions where our
                  service providers operate.
                </p>
                <p className="text-muted-foreground mb-4">
                  When we transfer your information internationally, we ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions for countries with equivalent data protection laws</li>
                  <li>Binding Corporate Rules for transfers within our corporate group</li>
                  <li>Certification schemes and codes of conduct where applicable</li>
                </ul>
              </section>

              {/* Age Restrictions and Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  8. Age Restrictions and Children's Privacy
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-bold text-lg mb-2">ADULTS ONLY - 18+ REQUIRED</p>
                  <p className="text-red-800 dark:text-red-200">
                    Our services are exclusively designed for and restricted to individuals who are 18 years of age or
                    older. We do not knowingly collect, use, or disclose personal information from anyone under 18 years
                    of age.
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">
                  If we become aware that we have collected personal information from someone under 18, we will:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Immediately delete the information from our systems</li>
                  <li>Terminate the account and block future access</li>
                  <li>Notify relevant parties if required by law</li>
                  <li>Implement additional verification measures to prevent future occurrences</li>
                </ul>
                <p className="text-muted-foreground">
                  Parents or guardians who believe their child has provided information to us should contact us
                  immediately at privacy@touristsos.com.
                </p>
              </section>

              {/* Cookies and Tracking Technologies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>

                <h3 className="text-xl font-medium text-foreground mb-3">9.1 Types of Cookies</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic platform functionality and security
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us analyze usage and improve our services
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> Detect suspicious activity and prevent fraud
                  </li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">9.2 Managing Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  You can control cookies through your browser settings, but disabling certain cookies may affect
                  platform functionality. We also provide cookie preference controls in your account settings.
                </p>
              </section>

              {/* Changes to This Privacy Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this privacy policy periodically to reflect changes in our practices, technology, legal
                  requirements, or other factors. When we make material changes, we will:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Post the updated policy on our website with a new "Last updated" date</li>
                  <li>Send email notifications to registered users about significant changes</li>
                  <li>Provide in-app notifications for material changes affecting your rights</li>
                  <li>Maintain previous versions for your reference</li>
                </ul>
                <p className="text-muted-foreground">
                  Your continued use of our services after changes become effective constitutes acceptance of the
                  updated policy.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions, concerns, or requests regarding this privacy policy or our data practices,
                  please contact us:
                </p>
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Privacy Team</h4>
                      <div className="space-y-2 text-muted-foreground">
                        <div>
                          <strong>Email:</strong> privacy@touristsos.com
                        </div>
                        <div>
                          <strong>Phone:</strong> +66 (0) 2-123-4567
                        </div>
                        <div>
                          <strong>Response Time:</strong> 48 hours for urgent matters
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Mailing Address</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Tourist SOS Privacy Officer</div>
                        <div>123 Emergency Response Avenue</div>
                        <div>Sukhumvit District</div>
                        <div>Bangkok, Thailand 10110</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Data Protection Officer:</strong> For EU residents, you may also contact our Data Protection
                    Officer at dpo@touristsos.com for matters related to GDPR compliance.
                  </p>
                </div>
              </section>
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
