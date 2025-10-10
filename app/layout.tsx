import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SQL Playground",
  description: "Practice SQL with interactive problems",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} h-full flex flex-col bg-gray-900 text-white`}
      >
        <Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header stays at top */}
            {/* <Header /> */}

            {/* Main content fills remaining space */}
            <main className="flex-grow w-full">
              {children}
            </main>

            {/* Footer sticks to bottom */}
            {/* <Footer /> */}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
