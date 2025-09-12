import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TeacherDashboard() {
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
            <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
            <p className="text-sm text-[#d4d4d4]">Create and manage SQL tests for your students</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Welcome, Teacher!</h2>
            <p className="text-lg text-[#d4d4d4]">Manage your SQL tests and monitor student progress</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/teacher/create-test">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[250px]"
              >
                Create Test
              </Button>
            </Link>

            <Link href="/teacher/past-tests">
              <Button
                size="lg"
                className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[250px]"
              >
                View Past Tests
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-[#1e1e1e] rounded-lg border border-[#2d2d2d]">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[#d4d4d4]">SQL Joins Test</span>
                <span className="text-sm text-green-400">24 submissions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#d4d4d4]">Database Design Quiz</span>
                <span className="text-sm text-yellow-400">12 submissions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#d4d4d4]">Advanced Queries</span>
                <span className="text-sm text-[#2563eb]">8 submissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
