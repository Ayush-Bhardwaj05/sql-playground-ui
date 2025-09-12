"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Database, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Test {
  id: number
  name: string
  description: string | null
  table_name: string
  created_at: string | null
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/schema/tests')
      if (!response.ok) {
        throw new Error('Failed to fetch tests')
      }
      const data = await response.json()
      setTests(data.tests)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p className="text-[#d4d4d4]">Loading tests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Button onClick={fetchTests} className="bg-[#2563eb] hover:bg-[#3b82f6]">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/student">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Available Tests</h1>
            <p className="text-sm text-[#d4d4d4]">Select a test to start practicing SQL</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6">
        {tests.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-[#d4d4d4] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tests Available</h3>
            <p className="text-[#d4d4d4] mb-6">
              There are no tests available at the moment. Please check back later.
            </p>
            <Link href="/student">
              <Button className="bg-[#2563eb] hover:bg-[#3b82f6]">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] p-6 hover:border-[#3d3d3d] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{test.name}</h3>
                    {test.description && (
                      <p className="text-[#d4d4d4] mb-3">{test.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#d4d4d4]">
                      <div className="flex items-center gap-1">
                        <Database className="h-4 w-4" />
                        <span>Table: {test.table_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created: {formatDate(test.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/student/test/${test.id}`}>
                    <Button className="bg-[#2563eb] hover:bg-[#3b82f6] text-white gap-2">
                      <Play className="h-4 w-4" />
                      Start Test
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[#d4d4d4] border-[#2d2d2d]">
                      Test ID: {test.id}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
