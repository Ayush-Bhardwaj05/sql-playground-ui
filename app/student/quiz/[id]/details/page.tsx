"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function QuizDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [usn, setUsn] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Fetch test details dynamically from backend
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/schema/tests`)
        if (!res.ok) throw new Error("Failed to fetch test details")
        const data = await res.json()
        const found = data.tests.find((t: any) => t.id === Number(id))
        setTest(found)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [id])

  const handleSubmit = () => {
    if (!name || !usn) {
      alert("Please enter both Name and USN.")
      return
    }

    setSubmitting(true)
    sessionStorage.setItem(
      "studentDetails",
      JSON.stringify({ name, usn, quizId: id })
    )

    setTimeout(() => {
      router.push(`/student/quiz/${id}/test`)
    }, 1000)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading test details...
      </div>
    )

  if (error || !test)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        {error || "Test not found"}
      </div>
    )

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 text-white">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{test.name}</h1>
        <p className="text-gray-400 mb-4">{test.description}</p>
        <p className="text-sm text-gray-500 mb-6">Table: {test.table_name}</p>

        <h3 className="text-lg font-semibold mb-4">Enter Your Details</h3>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-[#2a2a2a] border border-[#3a3a3a] text-white outline-none"
        />
        <input
          type="text"
          placeholder="Enter your USN"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a2a2a] border border-[#3a3a3a] text-white outline-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Starting..." : "Start Test"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
          className="w-full mt-3 text-gray-400 hover:text-white"
        >
          ← Back
        </Button>
      </div>
    </div>
  )
}
