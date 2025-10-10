"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Users, Filter, User, Settings } from "lucide-react"
import TeacherIdPopup from "@/components/teacher-id-popup"

interface Test {
  id: string
  title: string
  description: string
  teacher_id: number
  status: string
  created_at: string
  table_name: string
}

export default function StudentPage() {
  const [teacherId, setTeacherId] = useState("")
  const [tests, setTests] = useState<Test[]>([])
  const [filteredTests, setFilteredTests] = useState<Test[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showTeacherPopup, setShowTeacherPopup] = useState(false)
  const [hasTeacherId, setHasTeacherId] = useState(false)
  const [error, setError] = useState<string>("")

  // Check for saved teacher ID on component mount
  useEffect(() => {
    const savedTeacherId = localStorage.getItem("studentTeacherId")
    if (savedTeacherId) {
      setTeacherId(savedTeacherId)
      setHasTeacherId(true)
      fetchTests(savedTeacherId)
    } else {
      setShowTeacherPopup(true)
      setIsLoading(false)
    }
  }, [])

  // Filter tests based on search term
  useEffect(() => {
    if (!Array.isArray(tests)) {
      setFilteredTests([])
      return
    }

    if (searchTerm.trim() === "") {
      setFilteredTests(tests)
    } else {
      const filtered = tests.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTests(filtered)
    }
  }, [searchTerm, tests])

  const fetchTests = async (id: string) => {
    setIsLoading(true)
    setError("")
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/student/teachers/${id}/tests`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tests: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats
      let testsData: Test[] = []
      
      if (Array.isArray(data)) {
        // If response is directly an array
        testsData = data
      } else if (data && Array.isArray(data.tests)) {
        // If response has a tests property
        testsData = data.tests
      } else if (data && typeof data === 'object') {
        // If response is an object, try to extract array from it
        testsData = Object.values(data).find(val => Array.isArray(val)) as Test[] || []
      }
      
      console.log('Fetched tests data:', testsData)
      
      if (!Array.isArray(testsData)) {
        throw new Error("Invalid response format: tests data is not an array")
      }
      
      setTests(testsData)
      setFilteredTests(testsData)
    } catch (error) {
      console.error("Error fetching tests:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch tests")
      setTests([])
      setFilteredTests([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTeacherIdSubmit = (submittedTeacherId: string) => {
    setTeacherId(submittedTeacherId)
    setHasTeacherId(true)
    setShowTeacherPopup(false)
    fetchTests(submittedTeacherId)
  }

  const handleChangeTeacher = () => {
    setShowTeacherPopup(true)
  }

  const refreshTests = () => {
    if (teacherId) {
      fetchTests(teacherId)
    }
  }

  const clearTeacherId = () => {
    localStorage.removeItem("studentTeacherId")
    setTeacherId("")
    setHasTeacherId(false)
    setTests([])
    setFilteredTests([])
    setShowTeacherPopup(true)
  }

  // Safe array checks
  const totalTests = Array.isArray(tests) ? tests.length : 0
  const activeTests = Array.isArray(tests) ? tests.filter(t => t.status === "Active").length : 0
  const displayTests = Array.isArray(filteredTests) ? filteredTests : []

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Teacher ID Popup */}
      <TeacherIdPopup 
        isOpen={showTeacherPopup} 
        onClose={handleTeacherIdSubmit} 
      />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-[#2d2d2d] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">SQL Practice Tests</h1>
                <p className="text-sm text-[#d4d4d4]">Practice your SQL skills with real-world scenarios</p>
              </div>
            </div>
          </div>
          
          {hasTeacherId && (
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-md text-sm flex items-center">
                <User className="w-3 h-3 mr-1" />
                Teacher ID: {teacherId}
              </div>
              <Button
                onClick={handleChangeTeacher}
                variant="outline"
                size="sm"
                className="border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d]"
              >
                <Settings className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
              <p className="font-semibold">Error loading tests:</p>
              <p>{error}</p>
              <Button 
                onClick={refreshTests} 
                variant="outline" 
                size="sm" 
                className="mt-2 border-red-300 text-red-300 hover:bg-red-500/20"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Stats and Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1e1e1e] border-[#2d2d2d]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#d4d4d4]">
                  Total Tests
                </CardTitle>
                <BookOpen className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? "..." : totalTests}
                </div>
                <p className="text-xs text-[#888]">
                  Available for practice
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e1e1e] border-[#2d2d2d]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#d4d4d4]">
                  Active Tests
                </CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? "..." : activeTests}
                </div>
                <p className="text-xs text-[#888]">
                  Ready to attempt
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e1e1e] border-[#2d2d2d]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#d4d4d4]">
                  Search Tests
                </CardTitle>
                <Search className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#0f0f0f] border-[#2d2d2d] text-white pl-10 placeholder:text-[#666]"
                    disabled={!hasTeacherId || isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tests Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Tests</h2>
              <div className="flex gap-2">
                <Button
                  onClick={refreshTests}
                  variant="outline"
                  size="sm"
                  disabled={!hasTeacherId || isLoading}
                  className="border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d]"
                >
                  Refresh
                </Button>
                {hasTeacherId && (
                  <Button
                    onClick={clearTeacherId}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Clear Teacher ID
                  </Button>
                )}
              </div>
            </div>

            {!hasTeacherId ? (
              <Card className="bg-[#1e1e1e] border-[#2d2d2d]">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="w-16 h-16 text-[#666] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Teacher ID Set</h3>
                  <p className="text-[#d4d4d4] mb-4 max-w-md">
                    Please enter your teacher&apos;s ID to view available tests.
                  </p>
                  <Button onClick={() => setShowTeacherPopup(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Enter Teacher ID
                  </Button>
                </CardContent>
              </Card>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-[#1e1e1e] border-[#2d2d2d] animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-[#2d2d2d] rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#2d2d2d] rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-[#2d2d2d] rounded w-full mb-2"></div>
                      <div className="h-3 bg-[#2d2d2d] rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayTests.length === 0 ? (
              <Card className="bg-[#1e1e1e] border-[#2d2d2d]">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="w-16 h-16 text-[#666] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {searchTerm ? "No tests found" : "No tests available"}
                  </h3>
                  <p className="text-[#d4d4d4]">
                    {searchTerm 
                      ? "Try adjusting your search terms" 
                      : "No tests are available for this teacher ID yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayTests.map((test) => (
                  <Card key={test.id} className="bg-[#1e1e1e] border-[#2d2d2d] hover:border-blue-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white text-lg">{test.title}</CardTitle>
                        <Badge 
                          variant={test.status === "Active" ? "default" : "secondary"}
                          className={test.status === "Active" 
                            ? "bg-green-500/20 text-green-300 border-green-500/30" 
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {test.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-[#d4d4d4] line-clamp-2">
                        {test.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-[#888]">
                        <span>Created: {new Date(test.created_at).toLocaleDateString()}</span>
                        <span>Tables: {test.table_name ? 1 : 0}</span>
                      </div>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href={`/student/quiz/${test.id}/test`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Start Practice
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}