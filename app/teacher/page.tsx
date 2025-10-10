"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import ClientOnly from "@/components/ClientOnly"

export default function TeacherDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-12 max-w-2xl w-full">
          <ClientOnly>
            {/* Welcome Section */}
            <div
              className={`space-y-4 transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-5xl sm:text-6xl font-bold text-white">
                Welcome, Teacher!
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-md mx-auto">
                Manage your SQL tests and monitor student progress efficiently.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Create Test */}
              <Link href="/teacher/create-test" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold px-10 py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg min-w-[250px]"
                >
                  Create Test
                </Button>
              </Link>

              {/* View Past Tests */}
              <Link href="/teacher/past-tests" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-10 py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg min-w-[250px]"
                >
                  View Past Tests
                </Button>
              </Link>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  )
}
