import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-sm text-[#d4d4d4]">Access your SQL tests and track progress</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Welcome, Student!</h2>
            <p className="text-lg text-[#d4d4d4]">
              Choose an option below to start practicing SQL or review your progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/student/tests">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[250px]"
              >
                View Tests
              </Button>
            </Link>

            <Link href="/student/stats">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[250px]"
              >
                View Past Test Stats
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-[#1e1e1e] rounded-lg border border-[#2d2d2d]">
            <h3 className="text-white font-semibold mb-2">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2563eb]">12</div>
                <div className="text-sm text-[#d4d4d4]">Tests Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">85%</div>
                <div className="text-sm text-[#d4d4d4]">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">7</div>
                <div className="text-sm text-[#d4d4d4]">Current Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
