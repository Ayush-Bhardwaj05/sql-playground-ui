"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Test {
  id: number
  name: string
  description: string
}

export default function QuizDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [usn, setUsn] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Fetch test details from backend
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
        
        // First, get all tests for the teacher
        const teacherId = localStorage.getItem("studentTeacherId") || "1" // Default to teacher 1
        const testsResponse = await fetch(`${backendUrl}/student/teachers/${teacherId}/tests`)
        
        if (!testsResponse.ok) {
          throw new Error(`Failed to fetch tests: ${testsResponse.status}`)
        }
        
        const testsData = await testsResponse.json()
        const foundTest = testsData.tests.find((t: Test) => t.id === Number(id))
        
        if (!foundTest) {
          throw new Error("Test not found")
        }
        
        setTest(foundTest)
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching test:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTest()
    }
  }, [id])

  const handleSubmit = () => {
    if (!name.trim() || !usn.trim()) {
      alert("Please enter both Name and USN.")
      return
    }

    setSubmitting(true)
    
    // Store student details in sessionStorage
    sessionStorage.setItem(
      "studentDetails",
      JSON.stringify({ 
        name: name.trim(), 
        usn: usn.trim(), 
        testId: id 
      })
    )

    // Navigate to test page
    setTimeout(() => {
      router.push(`/student/quiz/${id}/test`)
    }, 500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          Loading test details...
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Test Not Found</h2>
          <p className="text-gray-400 mb-4">{error || "The test you're looking for doesn't exist."}</p>
          <Button
            onClick={() => router.push("/student")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Tests
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 text-white">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">{test.name}</h1>
        <p className="text-gray-400 mb-6 text-center">
          {test.description || "No description available"}
        </p>

        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center">Enter Your Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded bg-[#1a1a1a] border border-[#3a3a3a] text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">USN (University Serial Number) *</label>
              <input
                type="text"
                placeholder="Enter your USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                className="w-full p-3 rounded bg-[#1a1a1a] border border-[#3a3a3a] text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !usn.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 text-lg font-semibold"
        >
          {submitting ? "Starting Test..." : "Start Test"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push("/student")}
          disabled={submitting}
          className="w-full mt-3 text-gray-400 hover:text-white hover:bg-[#2a2a2a] py-3"
        >
          ← Back to Tests
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Make sure you have stable internet connection before starting the test.
        </p>
      </div>
    </div>
  )
}