import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white mb-4">AI-Powered SQL Testing Platform</h1>
          <p className="text-xl text-[#d4d4d4] leading-relaxed">
            Master SQL skills with intelligent testing and real-time feedback
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <Link href="/student">
            <Button
              size="lg"
              className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[200px]"
            >
              Student
            </Button>
          </Link>

          <Link href="/teacher">
            <Button
              size="lg"
              className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl min-w-[200px]"
            >
              Teacher
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#2563eb] rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h3 className="text-white font-semibold">AI-Powered</h3>
            <p className="text-[#d4d4d4] text-sm">Intelligent feedback and suggestions</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#2563eb] rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
            <h3 className="text-white font-semibold">Real-time Testing</h3>
            <p className="text-[#d4d4d4] text-sm">Instant query execution and results</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#2563eb] rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <h3 className="text-white font-semibold">Progress Tracking</h3>
            <p className="text-[#d4d4d4] text-sm">Detailed analytics and insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}
