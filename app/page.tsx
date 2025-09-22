"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-12 max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/sql-ai-hero.png"
            alt="SQL Playground Logo"
            width={200}
            height={160}
            className="mx-auto rounded-xl"
            priority
          />
        </div>

        {/* Platform Name */}
        <h1 className="text-5xl font-bold text-white mb-4">
          <span className="text-white">SQL</span> <span className="text-blue-400">Playground</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl text-gray-300 mb-12">AI-Powered SQL Testing Platform</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/student">
            <Button
              size="lg"
              className="bg-blue-600/80 hover:bg-blue-600/90 text-white px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-200 min-w-[200px] border border-blue-500/50"
            >
              Student
            </Button>
          </Link>

          <Link href="/teacher">
            <Button
              size="lg"
              className="bg-purple-600/80 hover:bg-purple-600/90 text-white px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-200 min-w-[200px] border border-purple-500/50"
            >
              Teacher
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
