import type { Metadata } from "next"
import Link from "next/link"
import { MetricCard } from "@/components/ui/metric-card"
import { FeatureCard } from "@/components/ui/feature-card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { IconContainer } from "@/components/ui/icon-container"
import { MarketingHeader } from "@/components/MarketingHeader"
import { MarketingFooter } from "@/components/MarketingFooter"

export const metadata: Metadata = {
  title: "About | SOS Safe Certification",
  description: "Learn how SOS Safe certification works. Train your staff, complete safety modules, and earn your certification badge for hotels and tour operators.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Safety Certification for Hospitality
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 text-balance leading-[1.1] tracking-tight">
            Become
            <br />
            <span className="gradient-text">SOS Safe Certified</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            The trusted safety certification for hotels and tour operators. Train your staff, verify your protocols, and give your guests confidence that safety comes first.
          </p>

          <div className="flex justify-center mb-10 sm:mb-12">
            <img src="/sosa-avatar.png" alt="SOSA AI Safety Assistant" className="w-28 sm:w-36 lg:w-40 h-auto" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 sm:mb-20">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-8 py-3 text-base font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto sm:min-w-[200px] justify-center"
            >
              Get Certified
            </Link>
            <Link
              href="#how-it-works"
              className="glass-card px-8 py-3 rounded-full text-base font-medium border border-border/50 transition-colors hover:bg-muted/50 w-full sm:w-auto sm:min-w-[200px] text-center"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 rounded-2xl p-8 sm:p-10">
            <MetricCard
              value="3"
              label="Certification tiers"
              subtext="Basic, Premium, Elite"
              subtextColor="green"
            />
            <MetricCard value="80%" label="Passing threshold" subtext="industry standard" subtextColor="green" />
            <MetricCard value="24/7" label="Emergency support" subtext="for certified partners" subtextColor="green" />
            <MetricCard
              value="30"
              label="Day free trial"
              subtext="no credit card required"
              subtextColor="green"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
                The Reality of Tourist Emergencies
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                When a guest has an emergency, is your team ready? Most hospitality staff lack proper training, leaving both guests and businesses vulnerable.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Untrained Staff</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      No standardized emergency protocols or confidence during crises
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Delayed Response</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Confusion about who to contact and what steps to take first
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Risk</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Liability exposure, negative reviews, and reputational damage
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Without Certification</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Staff preparedness</span>
                  <span className="font-bold text-red-600">Low</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Emergency response time</span>
                  <span className="font-bold text-red-600">Unpredictable</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Guest confidence</span>
                  <span className="font-bold text-red-600">Unknown</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground font-medium">Liability protection</span>
                  <span className="font-bold text-red-600">Minimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              SOS Safe Certification
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A comprehensive certification program that trains your team, establishes protocols, and connects you to professional emergency support.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              }
              title="Professional Certification"
              description="Complete our training modules to earn your SOS Safe badge - a trusted mark of safety excellence recognized across the industry."
            />

            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              title="Staff Training"
              description="Interactive training modules covering emergency protocols, communication, and guest care - tailored for hospitality and tour operations."
              className="[&>div:first-child]:bg-secondary/20"
            />

            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              title="24/7 Emergency Support"
              description="Certified partners get access to round-the-clock emergency coordination - report incidents and get professional guidance instantly."
              className="[&>div:first-child]:bg-accent/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              How Certification Works
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
              A straightforward path from signup to certified safety partner
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="step-1" className="glass-card rounded-xl border border-border/50 px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Register Your Property</h3>
                      <p className="text-sm text-muted-foreground">Quick online signup</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Create your account in minutes. Tell us about your property - whether you&apos;re a hotel, resort, hostel, or tour operator. We&apos;ll tailor the certification path to your specific needs.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">What you&apos;ll need:</div>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>- Property name and location</li>
                        <li>- Contact information</li>
                        <li>- Basic facility details</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-2" className="glass-card rounded-xl border border-border/50 px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-secondary">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Complete Training Modules</h3>
                      <p className="text-sm text-muted-foreground">Self-paced online learning</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Work through our three core training modules at your own pace. Each module includes assessments to ensure your team understands emergency protocols and best practices.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">Training Modules:</div>
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">1</span>
                          </div>
                          <span>Facility Assessment & Safety Audit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">2</span>
                          </div>
                          <span>Emergency Preparedness Protocols</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">3</span>
                          </div>
                          <span>Communication & Coordination</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-3" className="glass-card rounded-xl border border-border/50 px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-accent">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Earn Your Certification</h3>
                      <p className="text-sm text-muted-foreground">Official SOS Safe status</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Once you complete all modules and pass the assessments, you&apos;ll receive your official SOS Safe certification. Display your badge, access 24/7 support, and give your guests peace of mind.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">Certification includes:</div>
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Official SOS Safe Certified badge</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>24/7 emergency support access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Listing in certified partner directory</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Business Value Section */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              Why Get Certified?
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
              Join the network of properties that prioritize guest safety
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <IconContainer size="md" color="green" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-green-600 mb-2">Protected</div>
              <div className="text-sm text-muted-foreground font-medium">Reduced liability exposure</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="blue" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-blue-600 mb-2">Confident</div>
              <div className="text-sm text-muted-foreground font-medium">Trained, prepared staff</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="purple" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-purple-600 mb-2">Trusted</div>
              <div className="text-sm text-muted-foreground font-medium">Guest peace of mind</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="orange" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">Emergency support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
            Ready to Get Certified?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-16 leading-relaxed">
            Protect your guests, train your staff, and stand out as a safety-first property
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-20">
            <div className="glass-card p-8 rounded-2xl text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hotels & Resorts</h3>
              <p className="text-muted-foreground mb-4">
                From boutique hotels to large resorts - certification tailored to your property size and guest profile.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Front desk emergency protocols
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Guest communication training
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Facility safety assessment
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl text-left">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tour Operators</h3>
              <p className="text-muted-foreground mb-4">
                Adventure tours, day trips, or multi-day excursions - keep your guests safe wherever you take them.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Field emergency response
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Remote location protocols
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Activity-specific safety
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-8 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
            >
              Start Your Certification
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Questions?{" "}
            <Link href="/support" className="text-primary hover:underline font-medium">
              Contact our team
            </Link>{" "}
            - Already certified?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Log in to dashboard
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
