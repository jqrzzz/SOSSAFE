import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { CookieConsent } from "@/components/CookieConsent"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
  ],
}

export const metadata: Metadata = {
  title: "SOS Safety | Certification Portal by Tourist SOS",
  description:
    "SOS Safe certification for hotels, resorts, and tour operators. Protect your guests with verified safety training and join the Tourist SOS emergency coordination network.",
  keywords:
    "hotel safety certification, tour operator safety, guest safety, emergency preparedness, tourist safety, SOS Safe, Tourist SOS",
  authors: [{ name: "Tourist SOS" }],
  creator: "Tourist SOS",
  publisher: "Tourist SOS",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SOS Safety | Certification Portal by Tourist SOS",
    description:
      "SOS Safe certification for hotels, resorts, and tour operators. Protect your guests with verified safety training.",
    siteName: "Tourist SOS",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable} dark scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/sosa-avatar.png" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
