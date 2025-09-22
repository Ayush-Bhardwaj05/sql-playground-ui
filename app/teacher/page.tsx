"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function TeacherDashboard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl">
          <div
            className={`space-y-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-4xl font-bold text-white">Welcome, Teacher!</h2>
            <p className="text-lg text-[#d4d4d4] leading-relaxed">Manage your SQL tests and monitor student progress</p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link href="/teacher/create-test">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 min-w-[250px]"
              >
                Create Test
              </Button>
            </Link>

            <Link href="/teacher/past-tests">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 min-w-[250px]"
              >
                View Past Tests
              </Button>
            </Link>
          </div>

          <div
            className={`mt-12 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-xl border border-[#2d2d2d] shadow-xl transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="text-white font-semibold mb-6 text-xl">Recent Activity</h3>
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-green-400 transition-all duration-300">
                <span className="text-[#d4d4d4] font-medium">SQL Joins Test</span>
                <span className="text-sm text-green-400 font-semibold">24 submissions</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-yellow-400 transition-all duration-300">
                <span className="text-[#d4d4d4] font-medium">Database Design Quiz</span>
                <span className="text-sm text-yellow-400 font-semibold">12 submissions</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-[#2563eb] transition-all duration-300">
                <span className="text-[#d4d4d4] font-medium">Advanced Queries</span>
                <span className="text-sm text-[#2563eb] font-semibold">8 submissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
