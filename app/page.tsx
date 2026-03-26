"use client"

import { useState } from "react"
import Link from "next/link"
import { MetricCard } from "@/components/ui/metric-card"
import { FeatureCard } from "@/components/ui/feature-card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { IconContainer } from "@/components/ui/icon-container"
import { MarketingHeader } from "@/components/MarketingHeader"

export default function PitchDeckLandingPage() {
  const [email, setEmail] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <MarketingHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Hero Section - Enhanced luxury spacing and typography */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 sm:mb-12 text-balance leading-[1.1] tracking-tight">
            Together Against
            <br />
            <span className="gradient-text">Tourist Emergency</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 sm:mb-16 max-w-4xl mx-auto text-pretty leading-relaxed">
            Connect hotel staff and tour operators with local first responders. Transform tourist emergencies from chaos
            into coordinated, professional care.
          </p>

          <div className="flex justify-center mb-12 sm:mb-16">
            <img src="/images/sosa-avatar.png" alt="SOS SAFETY by Tourist SOS Avatar" className="w-32 sm:w-40 lg:w-48 h-auto" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 sm:mb-24">
            <Link
              href="/signup"
              className="btn-primary-gradient px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 premium-hover w-full sm:w-auto sm:min-w-[200px] shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="glass-card px-8 py-4 rounded-xl text-lg font-semibold border border-border/50 transition-all duration-300 premium-hover w-full sm:w-auto sm:min-w-[200px]"
            >
              View Demo
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pitch-metrics rounded-2xl p-8 sm:p-10">
            <MetricCard
              value="45 sec"
              label="Average response time"
              subtext="vs 12+ minutes before"
              subtextColor="green"
            />
            <MetricCard value="98%" label="Staff confidence increase" subtext="after training" subtextColor="green" />
            <MetricCard value="300+" label="Hotels using platform" subtext="across Thailand" subtextColor="green" />
            <MetricCard
              value="$50K"
              label="Average liability reduction"
              subtext="per property annually"
              subtextColor="green"
            />
          </div>
        </div>
      </section>

      {/* Problem Section - Enhanced spacing */}
      <section className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
                The Problem
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                When tourists have emergencies, most hotel staff panic. While they say they're prepared, the reality is
                they don't know who to call, what to do, or how to communicate with local providers.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Staff Feel Helpless</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      No training, no protocols, no confidence during emergencies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Poor Outcomes</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Delayed response, wrong providers, communication barriers
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
                      Liability exposure, bad reviews, insurance claims
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">😰</div>
                <h3 className="text-xl font-semibold mb-2">Current Reality</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Average response time</span>
                  <span className="font-bold text-red-600">12+ minutes</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Staff confidence level</span>
                  <span className="font-bold text-red-600">2/10</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Successful outcomes</span>
                  <span className="font-bold text-red-600">45%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground font-medium">Guest satisfaction</span>
                  <span className="font-bold text-red-600">Poor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Enhanced spacing */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              Our Solution
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A WhatsApp-like platform that connects hospitality staff with local first responders, guided by AI
              protocols and professional training.
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              title="Instant Communication"
              description="WhatsApp-style chat connects staff, responders, and managers in real-time during emergencies."
            />

            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="AI-Guided Protocols"
              description="Smart protocols appear as pinned cards, guiding staff through emergency procedures step-by-step."
              className="[&>div:first-child]:bg-secondary/20"
            />

            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M0 18h.897c.35 0 .684-.188.949-.505C4.188 15.684 4.5 15.35 4.5 15s-.316-.684-.505-.949H0v.897zm0-3.707c0 .35.188.684.505.949H3.693c.35 0 .684-.188.949-.505C4.5 10.316 4.832 10 5.188 10H0v3.707zm18.147 0H21v-3.707c0-.35-.188-.684-.505-.949H19.813c-.35 0-.684.188-.949.505C19.416 10 19 10.316 19 10.693v3.707zm0 3.707H21v.897c0 .35-.188.684-.505.949H19.813c-.35 0-.684-.188-.949.505C19.416 14.316 19 14 19 13.693v-3.707zm0-7.486H21V7.486c0-.35-.188-.684-.505-.949H19.813c-.35 0-.684.188-.949.505C19.416 6.813 19 7.145 19 7.486v7.486z"
                  />
                </svg>
              }
              title="Professional Training"
              description="Certification programs build staff confidence and create 'Tourist SOS Certified' properties."
              className="[&>div:first-child]:bg-accent/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced spacing */}
      <section className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
              Three simple steps transform emergency chaos into professional response
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
                      <h3 className="text-xl font-semibold text-foreground">Emergency Alert</h3>
                      <p className="text-sm text-muted-foreground">Instant response activation</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Hotel staff taps 'Emergency' button. AI immediately creates chat room with relevant responders and
                      suggests initial protocols.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">🚨 Tourist Emergency</div>
                      <div className="text-muted-foreground text-sm mb-2">
                        Guest fell in lobby, conscious, bleeding from head
                      </div>
                      <div className="text-xs text-primary">Dr. Patel notified • ETA 8 minutes</div>
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
                      <h3 className="text-xl font-semibold text-foreground">Guided Response</h3>
                      <p className="text-sm text-muted-foreground">Real-time protocol assistance</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Protocol cards appear with step-by-step guidance. Staff follows checklist while responder
                      coordinates arrival and preparation.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">📋 Head Injury Protocol</div>
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                            </svg>
                          </div>
                          <span>Keep guest still and conscious</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                            </svg>
                          </div>
                          <span>Apply gentle pressure to wound</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-muted-foreground rounded-full"></div>
                          <span>Clear area of other guests</span>
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
                      <h3 className="text-xl font-semibold text-foreground">Professional Care</h3>
                      <p className="text-sm text-muted-foreground">Coordinated expert response</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pb-2">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Certified responder arrives prepared with context. Insurance documentation auto-generated. Guest
                      receives professional care, hotel looks competent.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">✅ Case Completed</div>
                      <div className="text-muted-foreground mb-2 text-sm">Guest treated and stable</div>
                      <div className="text-xs space-y-1">
                        <div>Response time: 8 minutes</div>
                        <div>Insurance claim: Auto-filed</div>
                        <div>Guest satisfaction: 5/5 ⭐</div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Business Value Section - Enhanced spacing */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
              Business Impact
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
              Transform your property into a "Tourist SOS Certified" destination
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm text-muted-foreground font-medium">Faster response times</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="blue" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-muted-foreground font-medium">Staff confidence increase</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="purple" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-purple-600 mb-2">$50K</div>
              <div className="text-sm text-muted-foreground font-medium">Annual liability reduction</div>
            </div>

            <div className="text-center">
              <IconContainer size="md" color="orange" className="mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </IconContainer>
              <div className="text-2xl font-bold text-orange-600 mb-2">4.8/5</div>
              <div className="text-sm text-muted-foreground font-medium">Guest satisfaction score</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced spacing */}
      <section className="bg-muted/30 py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-8 tracking-tight">
            How to Get Started
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-16 leading-relaxed">
            Join the network in 3 simple steps - just like setting up WhatsApp for your team
          </p>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            <div className="text-center">
              <IconContainer size="md" color="primary" className="mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </IconContainer>
              <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your account in under 2 minutes</p>
            </div>
            <div className="text-center">
              <IconContainer size="md" color="secondary" className="mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary">2</span>
              </IconContainer>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">Link with local first responders in your area</p>
            </div>
            <div className="text-center">
              <IconContainer size="md" color="accent" className="mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </IconContainer>
              <h3 className="text-lg font-semibold mb-2">Start Helping</h3>
              <p className="text-muted-foreground">Begin coordinating professional emergency response</p>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <Link
              href="/signup"
              className="btn-primary-gradient px-12 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 premium-hover shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Questions?{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact our team
            </Link>{" "}
            • Existing user?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in here
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced spacing */}
      <footer className="border-t border-border/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 SOS SAFETY by Tourist SOS. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors font-medium">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors font-medium">
                Terms
              </a>
              <a href="/support" className="hover:text-foreground transition-colors font-medium">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
