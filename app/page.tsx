"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(60,60,60,0.15)_0%,rgba(10,10,10,1)_70%)] pointer-events-none" />

      {/* Hero Container */}
      <div className="text-center space-y-8 max-w-xl relative z-10">
        {/* Logo */}
        <div className="mb-2">
          <Image
            src="/images/sql-ai-hero.png"
            alt="SQL Playground Logo"
            width={150}
            height={120}
            className="mx-auto opacity-90"
            priority
          />
        </div>

        {/* Platform Name */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
          SQL <span className="text-gray-400 font-light">Playground</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-gray-400 font-normal">
          AI-powered platform for learning and testing SQL efficiently.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
          {/* Continue as Student */}
          <Link href="/student" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold px-12 py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg min-w-[250px]"
            >
              Continue as Student
            </Button>
          </Link>

          {/* Teacher Portal */}
          <Link href="/teacher" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-12 py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg min-w-[250px]"
            >
              Teacher Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-500 text-xs tracking-wide">
        &copy; {new Date().getFullYear()} SQL Playground — All rights reserved.
      </div>
    </div>
  )
}
