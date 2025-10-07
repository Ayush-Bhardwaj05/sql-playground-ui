"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SQLPlayground } from "@/components/sql-playground"
import { Progress } from "@/components/ui/progress"
import { QuestionPanel } from "@/components/question-panel"
import { QueryVerifier } from "@/components/query-verifier"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

// Types based on your API response
interface TableSchema {
  column_name: string
  data_type: string
}

interface TestData {
  id: number
  name: string
  table_name: string
  schema_sql: string
  table_schema: TableSchema[]
  top_rows: any[]
}

interface Question {
  id: number
  question_text: string
  difficulty: "easy" | "medium" | "hard"
  expected_sql: string
}

interface ApiResponse {
  test: TestData
  questions: Question[]
}

interface ValidationResponse {
  is_correct: boolean
  expected_output: any[][]
  user_output: any[][]
}

interface SubmissionResponse {
  message: string
  submission_id?: number
  status: "created" | "duplicate"
}

// Get backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

export default function QuizTestPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = Number.parseInt(params.id as string)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [queryAttempts, setQueryAttempts] = useState<number[]>([])
  const [questionScores, setQuestionScores] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [queryResults, setQueryResults] = useState<any>(null)
  const [testData, setTestData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState(Date.now())

  // Fetch test data from backend
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/schema/tests/${quizId}/questions`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch test data: ${response.status}`)
        }
        
        const data: ApiResponse = await response.json()
        setTestData(data)
        
        // Initialize state arrays based on number of questions
        const questionCount = data.questions.length
        setAnswers(new Array(questionCount).fill(""))
        setQueryAttempts(new Array(questionCount).fill(0))
        setQuestionScores(new Array(questionCount).fill(0))
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load test')
        console.error('Error fetching test data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestData()
  }, [quizId])

  useEffect(() => {
    const details = sessionStorage.getItem("studentDetails")
    if (!details) {
      router.push(`/student/quiz/${quizId}/details`)
      return
    }

    setStudentDetails(JSON.parse(details))
    setIsVisible(true)
  }, [quizId, router])

  // Track quiz start time
  useEffect(() => {
    if (studentDetails && testData && !sessionStorage.getItem(`quiz_start_time_${quizId}`)) {
      sessionStorage.setItem(`quiz_start_time_${quizId}`, Date.now().toString())
    }
  }, [studentDetails, testData, quizId])

  const handleAnswerChange = useCallback(
    (code: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev]
        newAnswers[currentQuestion] = code
        return newAnswers
      })
    },
    [currentQuestion],
  )

  const handleNext = useCallback(() => {
    if (testData && currentQuestion < testData.questions.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }, [currentQuestion, testData])

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }, [currentQuestion])

  const handleSubmitQuiz = useCallback(() => {
    setShowSubmitModal(true)
  }, [])

  const confirmSubmit = useCallback(async () => {
    if (!testData) return

    const totalScore = questionScores.reduce((sum, score) => sum + score, 0)
    const maxPossibleScore = testData.questions.reduce((sum, q, index) => {
      const marks = getMarksByDifficulty(q.difficulty)
      return sum + marks
    }, 0)
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)

    // Calculate time taken in seconds
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Prepare submission data for backend
    const submissionData = {
      student_name: studentDetails.name,
      student_usn: studentDetails.usn,
      test_id: quizId,
      total_marks: totalScore,
      max_marks: maxPossibleScore,
      time_taken: timeTaken
    }

    try {
      // Send submission to backend
      const submissionResponse = await fetch(`${BACKEND_URL}/schema/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!submissionResponse.ok) {
        throw new Error(`Failed to submit quiz results: ${submissionResponse.status}`)
      }

      const submissionResult: SubmissionResponse = await submissionResponse.json()

      // Store locally as well
      const submission = {
        studentDetails,
        quizId,
        answers,
        questionScores,
        queryAttempts,
        totalScore,
        maxPossibleScore,
        percentage,
        timeTaken,
        submittedAt: new Date().toISOString(),
        backendSubmissionId: submissionResult.submission_id,
        backendStatus: submissionResult.status
      }

      const submissions = JSON.parse(localStorage.getItem("quizSubmissions") || "[]")
      submissions.push(submission)
      localStorage.setItem("quizSubmissions", JSON.stringify(submissions))

      sessionStorage.removeItem("studentDetails")
      sessionStorage.removeItem(`quiz_start_time_${quizId}`)
      setShowSubmitModal(false)

      // Show appropriate message based on backend response
      const popupMessage = submissionResult.status === "duplicate" 
        ? "Quiz was already submitted previously"
        : "Your answers have been submitted successfully and stored in database!"

      const popupIcon = submissionResult.status === "duplicate" ? "⚠️" : "✅"

      const popup = document.createElement("div")
      popup.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300"
      popup.innerHTML = `
        <div class="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-xl border border-green-600 text-center animate-in zoom-in duration-500 max-w-md">
          <div class="text-6xl mb-4">${popupIcon}</div>
          <h2 class="text-2xl font-bold text-white mb-2">Test Completed!</h2>
          <p class="text-green-200 mb-4">${popupMessage}</p>
          <div class="bg-green-800/50 rounded-lg p-4 mb-4">
            <div class="text-3xl font-bold text-white">${percentage}%</div>
            <div class="text-green-200 text-sm">Final Score: ${totalScore}/${maxPossibleScore} points</div>
            <div class="text-green-200 text-sm mt-1">Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</div>
          </div>
          <p class="text-green-300 text-sm">Results have been saved to database</p>
        </div>
      `

      document.body.appendChild(popup)

      setTimeout(() => {
        popup.classList.add("animate-out", "fade-out")
        setTimeout(() => {
          document.body.removeChild(popup)
          router.push("/student")
        }, 300)
      }, 3000)

    } catch (err) {
      console.error('Failed to submit to backend:', err)
      
      // Fallback: Store locally even if backend fails
      const submission = {
        studentDetails,
        quizId,
        answers,
        questionScores,
        queryAttempts,
        totalScore,
        maxPossibleScore,
        percentage,
        timeTaken,
        submittedAt: new Date().toISOString(),
        backendSubmissionId: null,
        backendStatus: "failed",
        error: err instanceof Error ? err.message : 'Unknown error'
      }

      const submissions = JSON.parse(localStorage.getItem("quizSubmissions") || "[]")
      submissions.push(submission)
      localStorage.setItem("quizSubmissions", JSON.stringify(submissions))

      sessionStorage.removeItem("studentDetails")
      sessionStorage.removeItem(`quiz_start_time_${quizId}`)
      setShowSubmitModal(false)

      // Show error popup
      const popup = document.createElement("div")
      popup.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300"
      popup.innerHTML = `
        <div class="bg-gradient-to-br from-yellow-900 to-yellow-800 p-8 rounded-xl border border-yellow-600 text-center animate-in zoom-in duration-500 max-w-md">
          <div class="text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-white mb-2">Test Completed!</h2>
          <p class="text-yellow-200 mb-4">Results saved locally (backend unavailable)</p>
          <div class="bg-yellow-800/50 rounded-lg p-4 mb-4">
            <div class="text-3xl font-bold text-white">${percentage}%</div>
            <div class="text-yellow-200 text-sm">Final Score: ${totalScore}/${maxPossibleScore} points</div>
            <div class="text-yellow-200 text-sm mt-1">Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</div>
          </div>
          <p class="text-yellow-300 text-sm">Results saved offline - will sync when available</p>
        </div>
      `

      document.body.appendChild(popup)

      setTimeout(() => {
        popup.classList.add("animate-out", "fade-out")
        setTimeout(() => {
          document.body.removeChild(popup)
          router.push("/student")
        }, 300)
      }, 3000)
    }
  }, [questionScores, studentDetails, quizId, answers, queryAttempts, router, testData, startTime])

  // Helper function to convert difficulty to marks - UPDATED
  const getMarksByDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 5
      case 'medium': return 10
      case 'hard': return 15
      default: return 5
    }
  }

  // Helper function to convert backend question to frontend format
  const convertQuestionToFrontendFormat = useCallback((question: Question, test: TestData, index: number) => {
    const marks = getMarksByDifficulty(question.difficulty)
    
    return {
      id: question.id,
      difficulty: question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1),
      marks,
      title: `Question ${index + 1}`,
      description: question.question_text,
      schema: {
        tables: [
          {
            name: test.table_name,
            columns: test.table_schema.map(col => ({
              name: col.column_name,
              type: col.data_type,
              constraints: col.column_name === 'id' ? 'PRIMARY KEY' : ''
            }))
          }
        ]
      },
      sampleData: {
        [test.table_name]: test.top_rows
      },
      inputFormat: "Write SQL query as per question",
      outputFormat: "Query output will be validated automatically",
      expectedOutput: [], // Will be filled from validation response
      starterCode: "-- Write your SQL query here\n",
      hint: "Refer to the table schema and sample data above"
    }
  }, [])

  const handleRunQuery = useCallback(
    async (query: string) => {
      if (!testData) return

      const currentQ = testData.questions[currentQuestion]
      
      setQueryAttempts((prev) => {
        const newAttempts = [...prev]
        newAttempts[currentQuestion] += 1
        return newAttempts
      })

      try {
        // Send validation request to backend
        const validationResponse = await fetch(`${BACKEND_URL}/schema/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            test_id: quizId,
            question_id: currentQ.id,
            user_sql: query
          })
        })

        if (!validationResponse.ok) {
          throw new Error('Validation request failed')
        }

        const validationResult: ValidationResponse = await validationResponse.json()

        // Convert array output to object format for display
        const convertToObjectFormat = (output: any[][], isUserOutput: boolean = false) => {
          if (!output.length) return []
          
          // For user output, we don't know the exact columns, so use generic names
          // For expected output, we know it should match the question requirements
          if (isUserOutput) {
            // User output - create generic column names based on position
            return output.map((row, rowIndex) => {
              const obj: any = {}
              row.forEach((value, colIndex) => {
                obj[`column_${colIndex + 1}`] = value
              })
              return obj
            })
          } else {
            // Expected output - try to infer column names from the first row
            const firstRow = output[0]
            return output.map((row) => {
              const obj: any = {}
              row.forEach((value, colIndex) => {
                // Use generic names for expected output too
                obj[`column_${colIndex + 1}`] = value
              })
              return obj
            })
          }
        }

        const actualOutput = convertToObjectFormat(validationResult.user_output, true)
        const expectedOutput = convertToObjectFormat(validationResult.expected_output, false)

        // Calculate score if correct - UPDATED: No attempt penalty
        if (validationResult.is_correct && questionScores[currentQuestion] === 0) {
          setQuestionScores((prev) => {
            const newScores = [...prev]
            const maxScore = getMarksByDifficulty(currentQ.difficulty)
            // Full marks awarded regardless of attempts
            newScores[currentQuestion] = maxScore
            return newScores
          })
        }

        setQueryResults({
          isCorrect: validationResult.is_correct,
          actualOutput,
          expectedOutput,
          attempts: queryAttempts[currentQuestion] + 1,
          score: questionScores[currentQuestion],
          maxScore: getMarksByDifficulty(currentQ.difficulty),
          feedback: validationResult.is_correct 
            ? "✅ Query executed successfully and matches expected output!" 
            : "❌ Query output doesn't match expected results",
          hint: validationResult.is_correct ? null : getHintForQuestion(currentQ, query),
          rawOutput: {
            user: validationResult.user_output,
            expected: validationResult.expected_output
          }
        })
        setShowResults(true)

      } catch (err) {
        setQueryResults({
          isCorrect: false,
          error: err instanceof Error ? err.message : 'Failed to validate query',
          attempts: queryAttempts[currentQuestion] + 1,
          score: questionScores[currentQuestion],
          maxScore: getMarksByDifficulty(currentQ.difficulty),
          feedback: "Error occurred while validating query",
          hint: "Check your SQL syntax and make sure the table name is correct"
        })
        setShowResults(true)
      }
    },
    [currentQuestion, testData, quizId, queryAttempts, questionScores],
  )

  // Helper function to provide hints based on the question
  const getHintForQuestion = (question: Question, userSql: string): string => {
    const lowerSql = userSql.toLowerCase()
    
    // Check for common issues
    if (lowerSql.includes('*') && !question.expected_sql.toLowerCase().includes('*')) {
      return "Try selecting only the required columns instead of using SELECT *"
    }
    
    if (!lowerSql.includes('where') && question.expected_sql.toLowerCase().includes('where')) {
      return "You might need to add a WHERE clause to filter the results"
    }
    
    if (!lowerSql.includes('group by') && question.expected_sql.toLowerCase().includes('group by')) {
      return "Consider using GROUP BY for aggregation"
    }
    
    if (!lowerSql.includes('join') && question.expected_sql.toLowerCase().includes('join')) {
      return "You might need to JOIN tables together"
    }
    
    return "Compare your output with the expected output and check if you're filtering or selecting the correct columns"
  }

  const handleQuestionChange = useCallback((index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentQuestion(index)
      setIsTransitioning(false)
    }, 200)
  }, [])

  // Get current question data in frontend format
  const currentQuestionData = useMemo(() => {
    if (!testData) return null
    return convertQuestionToFrontendFormat(
      testData.questions[currentQuestion], 
      testData.test, 
      currentQuestion
    )
  }, [testData, currentQuestion, convertQuestionToFrontendFormat])

  const progress = useMemo(() => {
    if (!testData) return 0
    return ((currentQuestion + 1) / testData.questions.length) * 100
  }, [currentQuestion, testData])

  const totalScore = useMemo(() => questionScores.reduce((sum, score) => sum + score, 0), [questionScores])
  
  const maxTotalScore = useMemo(() => {
    if (!testData) return 0
    return testData.questions.reduce((sum, q) => sum + getMarksByDifficulty(q.difficulty), 0)
  }, [testData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
        <span className="ml-3 text-white">Loading test...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-xl mb-2">Error Loading Test</div>
          <div className="text-sm text-gray-400">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!studentDetails || !testData || !currentQuestionData) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
      <PerformanceMonitor />

      <div className="border-b border-[#2d2d2d] bg-[#1e1e1e] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">{testData.test.name}</h1>
            <div className="text-sm text-[#d4d4d4]">
              {studentDetails?.name} • {studentDetails?.usn}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0 || isTransitioning}
                variant="outline"
                size="sm"
                className="bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-[#d4d4d4] px-3">
                Question {currentQuestion + 1} of {testData.questions.length}
              </div>

              {currentQuestion === testData.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isTransitioning}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  size="sm"
                  className="bg-[#2563eb] hover:bg-[#3b82f6] text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="text-sm text-green-400 font-semibold">
              Score: {totalScore}/{maxTotalScore}
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Question */}
          <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
            <div className="h-full bg-[#1e1e1e] overflow-y-auto">
              <QuestionPanel
                question={currentQuestionData}
                currentQuestion={currentQuestion}
                totalQuestions={testData.questions.length}
                answers={answers}
                onQuestionChange={handleQuestionChange}
                isTransitioning={isTransitioning}
                attempts={queryAttempts[currentQuestion]}
                score={questionScores[currentQuestion]}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Editor and Console */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Editor Panel */}
              <ResizablePanel defaultSize={showResults ? 65 : 100} minSize={40}>
                <div className="h-full bg-[#1e1e1e]">
                  <SQLPlayground
                    starterCode={answers[currentQuestion] || currentQuestionData.starterCode}
                    onCodeChange={handleAnswerChange}
                    onRunQuery={handleRunQuery}
                    showConsole={false}
                  />
                </div>
              </ResizablePanel>

              {/* Console Panel - Only show when results are available */}
              {showResults && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
                    <div className="h-full bg-[#1e1e1e] border-t border-[#2d2d2d]">
                      <div className="flex items-center justify-between p-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
                        <h3 className="text-sm font-semibold text-white">Console</h3>
                        <Button
                          onClick={() => setShowResults(false)}
                          variant="ghost"
                          size="sm"
                          className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d2d] h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="h-full overflow-y-auto p-3 space-y-3">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${queryResults?.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                          />
                          <span
                            className={`text-sm font-medium ${queryResults?.isCorrect ? "text-green-400" : "text-red-400"}`}
                          >
                            {queryResults?.isCorrect ? "Accepted" : "Wrong Answer"}
                          </span>
                        </div>

                        {/* Score and Attempts */}
                        <div className="flex gap-2">
                          {queryResults?.score !== undefined && (
                            <div className="bg-[#2d2d2d] rounded p-2 flex-1">
                              <div className="text-xs text-[#d4d4d4] mb-1">Score</div>
                              <div className="text-sm font-bold text-green-400">
                                {queryResults.score}/{queryResults.maxScore}
                              </div>
                            </div>
                          )}
                          <div className="bg-[#2d2d2d] rounded p-2 flex-1">
                            <div className="text-xs text-[#d4d4d4] mb-1">Attempts</div>
                            <div className="text-sm font-bold text-blue-400">{queryResults?.attempts || 0}</div>
                          </div>
                        </div>

                        {/* Results Table */}
                        {queryResults?.actualOutput && (
                          <div className="bg-[#2d2d2d] rounded p-2">
                            <div className="text-xs text-[#d4d4d4] mb-2">Your Output</div>
                            <div className="max-h-32 overflow-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-[#3d3d3d]">
                                    {Object.keys(queryResults.actualOutput[0] || {}).map((key) => (
                                      <th key={key} className="text-left p-1 text-[#d4d4d4] text-xs">
                                        {key}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {queryResults.actualOutput.slice(0, 5).map((row: any, idx: number) => (
                                    <tr key={idx} className="border-b border-[#3d3d3d]">
                                      {Object.values(row).map((value: any, cellIdx: number) => (
                                        <td key={cellIdx} className="p-1 text-[#d4d4d4] text-xs">
                                          {String(value)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {queryResults.actualOutput.length > 5 && (
                                <div className="text-xs text-[#888] mt-1">
                                  ... and {queryResults.actualOutput.length - 5} more rows
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expected Output */}
                        {queryResults?.expectedOutput && !queryResults?.isCorrect && (
                          <div className="bg-[#2d2d2d] rounded p-2">
                            <div className="text-xs text-[#d4d4d4] mb-2">Expected Output</div>
                            <div className="max-h-32 overflow-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-[#3d3d3d]">
                                    {Object.keys(queryResults.expectedOutput[0] || {}).map((key) => (
                                      <th key={key} className="text-left p-1 text-[#d4d4d4] text-xs">
                                        {key}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {queryResults.expectedOutput.slice(0, 5).map((row: any, idx: number) => (
                                    <tr key={idx} className="border-b border-[#3d3d3d]">
                                      {Object.values(row).map((value: any, cellIdx: number) => (
                                        <td key={cellIdx} className="p-1 text-[#d4d4d4] text-xs">
                                          {String(value)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {queryResults.expectedOutput.length > 5 && (
                                <div className="text-xs text-[#888] mt-1">
                                  ... and {queryResults.expectedOutput.length - 5} more rows
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Error */}
                        {queryResults?.error && (
                          <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                            <div className="text-xs text-red-400 mb-1">Error</div>
                            <div className="text-xs text-red-300 font-mono">{queryResults.error}</div>
                          </div>
                        )}

                        {/* Feedback */}
                        {queryResults?.feedback && (
                          <div className="bg-[#2d2d2d] rounded p-2">
                            <div className="text-xs text-[#d4d4d4] mb-1">Feedback</div>
                            <div className="text-xs text-[#d4d4d4]">{queryResults.feedback}</div>
                          </div>
                        )}

                        {/* Hint */}
                        {queryResults?.hint && (
                          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                            <div className="text-xs text-yellow-400 mb-1">💡 Hint</div>
                            <div className="text-xs text-yellow-300">{queryResults.hint}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-xl border border-blue-600 text-center animate-in zoom-in duration-500 max-w-md">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-2">Submit Quiz?</h2>
            <p className="text-blue-200 mb-6">Are you sure you want to submit your answers? This action cannot be undone.</p>
            <div className="bg-blue-800/50 rounded-lg p-4 mb-6">
              <div className="text-lg font-bold text-white">Current Score: {totalScore}/{maxTotalScore}</div>
              <div className="text-blue-200 text-sm mt-1">Progress: {Math.round(progress)}% complete</div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowSubmitModal(false)}
                variant="outline"
                className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}