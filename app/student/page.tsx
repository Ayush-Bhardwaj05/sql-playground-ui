"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Test {
  id: number
  name: string
  description: string
  table_name: string
  schema_sql: string
}

export default function StudentDashboard() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/schema/tests`)
        if (!res.ok) throw new Error("Failed to fetch tests")
        const data = await res.json()
        setTests(data.tests) // backend returns { tests: [...] }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading tests...
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Available Tests</h1>

      {tests.length === 0 ? (
        <p className="text-gray-400">No tests available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {tests.map((test) => (
            <div
              key={test.id}
              className="p-5 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] hover:border-[#2563eb] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
              <p className="text-gray-400 mb-3">{test.description}</p>
              <div className="text-sm text-gray-500 mb-4">{test.table_name}</div>

              <Button
                className="w-full"
                onClick={() => router.push(`/student/quiz/${test.id}/details`)}
              >
                Start Test
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
