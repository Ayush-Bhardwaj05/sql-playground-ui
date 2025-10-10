"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SQLPlayground } from "@/components/sql-playground"
import { Progress } from "@/components/ui/progress"
import { QuestionPanel } from "@/components/question-panel"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  FileText,
  CheckCircle,
  Target,
  FileQuestion,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  Send
} from "lucide-react"
// Types based on your API response
interface Question {
  id: number
  question_text: string
  difficulty: "easy" | "medium" | "hard"
  expected_sql: string
}

interface TestData {
  schema_sql: string
  questions: Question[]
  top_rows: any[]
}

interface ValidationResponse {
  is_correct: boolean
  expected_output: any[][]
  user_output: any[][]
  message: string
}

interface SubmissionResponse {
  message: string
  submission_id?: number
  status: "success" | "duplicate" | "error"
}

// Get backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

export default function QuizTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = Number.parseInt(params.id as string)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [queryAttempts, setQueryAttempts] = useState<number[]>([])
  const [questionScores, setQuestionScores] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [queryResults, setQueryResults] = useState<any>(null)
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState(Date.now())

  // Fetch test data from backend
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/student/tests/${testId}/questions`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch test data: ${response.status}`)
        }
        
        const data: TestData = await response.json()
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

    if (testId) {
      fetchTestData()
    }
  }, [testId])

  // Check for student details
  useEffect(() => {
    const details = sessionStorage.getItem("studentDetails")
    if (!details) {
      router.push(`/student/quiz/${testId}/details`)
      return
    }

    const parsedDetails = JSON.parse(details)
    if (parsedDetails.testId != testId) {
      router.push(`/student/quiz/${testId}/details`)
      return
    }

    setStudentDetails(parsedDetails)
  }, [testId, router])

  // Track quiz start time
  useEffect(() => {
    if (studentDetails && testData && !sessionStorage.getItem(`quiz_start_time_${testId}`)) {
      sessionStorage.setItem(`quiz_start_time_${testId}`, Date.now().toString())
    }
  }, [studentDetails, testData, testId])

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
    if (!testData || !studentDetails) return

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
      test_id: testId,
      total_marks: totalScore,
      max_marks: maxPossibleScore,
      time_taken: timeTaken,
      answers: answers.map((answer, index) => ({
        question_id: testData.questions[index].id,
        answer_sql: answer,
        marks_obtained: questionScores[index],
        attempts: queryAttempts[index]
      }))
    }

    try {
      // Send submission to backend
      const submissionResponse = await fetch(`${BACKEND_URL}/student/tests/${testId}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      let submissionResult: SubmissionResponse

      if (submissionResponse.ok) {
        submissionResult = await submissionResponse.json()
      } else {
        throw new Error(`Failed to submit quiz results: ${submissionResponse.status}`)
      }

      // Store locally as well
      const submission = {
        studentDetails,
        testId,
        answers,
        questionScores,
        queryAttempts,
        totalScore,
        maxPossibleScore,
        percentage,
        timeTaken,
        submittedAt: new Date().toISOString(),
        backendSubmissionId: submissionResult.submission_id,
        backendStatus: submissionResult.status || "success"
      }

      const submissions = JSON.parse(localStorage.getItem("quizSubmissions") || "[]")
      submissions.push(submission)
      localStorage.setItem("quizSubmissions", JSON.stringify(submissions))

      // Clean up session storage
      sessionStorage.removeItem("studentDetails")
      sessionStorage.removeItem(`quiz_start_time_${testId}`)
      setShowSubmitModal(false)

      // Show success message
      showCompletionPopup(
  submissionResult.status === "duplicate" 
    ? "This test was previously submitted and recorded in our system."
    : "Your test has been successfully submitted and saved.",
  submissionResult.status === "duplicate" ? "warning" : "success",
  percentage,
  totalScore,
  maxPossibleScore,
  timeTaken,
  router
)

    } catch (err) {
      console.error('Failed to submit to backend:', err)
      
      // Fallback: Store locally even if backend fails
      const submission = {
        studentDetails,
        testId,
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
      sessionStorage.removeItem(`quiz_start_time_${testId}`)
      setShowSubmitModal(false)

      // Show offline success message
      showCompletionPopup(
  "Your results have been saved locally and will sync when the server is available",
  "📱",
  percentage,
  totalScore,
  maxPossibleScore,
  timeTaken,
  router
)
    }
  }, [questionScores, studentDetails, testId, answers, queryAttempts, router, testData, startTime])

  // Helper function to show completion popup
    // Helper function to show completion popup
  const showCompletionPopup = (
    message: string,
    icon: string,
    percentage: number,
    totalScore: number,
    maxScore: number,
    timeTaken: number,
    router: any
  ) => {
    const popup = document.createElement("div")
    popup.className = "fixed inset-0 z-50 flex items-center justify-center p-4"
    
    const isSuccess = icon === "✅"
    const isDuplicate = message.includes("already submitted")
    
    popup.innerHTML = `
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"></div>
      
      <div class="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-500">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-yellow-500/10 border border-yellow-500/20'
          }">
            ${isSuccess ? `
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ` : `
              <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            `}
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">
            ${isDuplicate ? 'Submission Recorded' : 'Test Completed'}
          </h2>
          <p class="text-[#d4d4d4] text-sm">${message}</p>
        </div>

        <!-- Stats -->
        <div class="bg-[#0f0f0f] rounded-lg p-4 mb-6 border border-[#2d2d2d]">
          ${!isDuplicate ? `
            <div class="text-center mb-4">
              <div class="text-3xl font-bold ${
                percentage >= 80 ? 'text-green-400' : 
                percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
              }">
                ${percentage}%
              </div>
              <div class="text-xs text-[#888] mt-1">Overall Score</div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div class="text-lg font-semibold text-white">${totalScore}</div>
                <div class="text-xs text-[#666]">Points Scored</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-white">${maxScore}</div>
                <div class="text-xs text-[#666]">Max Points</div>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-[#2d2d2d]">
              <div class="flex items-center justify-center gap-2 text-sm text-[#888]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</span>
              </div>
            </div>
          ` : `
            <div class="text-center py-2">
              <div class="text-sm text-[#d4d4d4]">
                Your previous submission has been recorded in our system.
              </div>
            </div>
          `}
        </div>

        <!-- Status Badge -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            isDuplicate 
              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              : 'bg-green-500/10 text-green-400 border border-green-500/20'
          }">
            ${isDuplicate ? `
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Previously Submitted
            ` : `
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Successfully Submitted
            `}
          </div>
        </div>

        <!-- Action -->
        <button 
          onclick="this.closest('.fixed').remove(); setTimeout(() => window.location.href='/student', 100)"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Return to Dashboard
        </button>
      </div>
    `

    document.body.appendChild(popup)

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.classList.add("animate-out", "fade-out")
        setTimeout(() => {
          if (popup.parentNode) {
            document.body.removeChild(popup)
          }
          router.push("/student")
        }, 300)
      }
    }, 5000)
  }

  // Helper function to convert difficulty to marks
  const getMarksByDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 5
      case 'medium': return 10
      case 'hard': return 15
      default: return 5
    }
  }

  // Parse schema SQL to extract column information
  const parseSchema = useCallback((schemaSql: string) => {
    try {
      const tableMatch = schemaSql.match(/CREATE TABLE (\w+)\s*\(([\s\S]*?)\);/)
      if (!tableMatch) return { tableName: "unknown", columns: [] }

      const tableName = tableMatch[1]
      const columnDefinitions = tableMatch[2]
      
      const columns = columnDefinitions
        .split(',')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('PRIMARY KEY') && !line.startsWith('FOREIGN KEY'))
        .map(line => {
          const [name, type] = line.split(/\s+/)
          return {
            name: name.replace(/"/g, ''),
            type: type || 'unknown',
            constraints: line.includes('PRIMARY KEY') ? 'PRIMARY KEY' : 
                        line.includes('NOT NULL') ? 'NOT NULL' : ''
          }
        })
        .filter(col => col.name && col.type)

      return { tableName, columns }
    } catch (error) {
      console.error('Error parsing schema:', error)
      return { tableName: "unknown", columns: [] }
    }
  }, [])

  // Helper function to convert backend question to frontend format
  const convertQuestionToFrontendFormat = useCallback((question: Question, index: number) => {
    const marks = getMarksByDifficulty(question.difficulty)
    
    // Parse schema to get table structure
    const schemaInfo = testData?.schema_sql ? parseSchema(testData.schema_sql) : { tableName: "unknown", columns: [] }
    
    return {
      id: question.id,
      difficulty: question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1),
      marks,
      title: `Question ${index + 1}`,
      description: question.question_text,
      schema: {
        tables: [
          {
            name: schemaInfo.tableName,
            columns: schemaInfo.columns
          }
        ]
      },
      sampleData: testData?.top_rows ? { [schemaInfo.tableName]: testData.top_rows } : {},
      inputFormat: "Write SQL query as per question",
      outputFormat: "Query output will be validated automatically",
      expectedOutput: [],
      starterCode: "-- Write your SQL query here\n",
      hint: "Refer to the table schema and sample data above"
    }
  }, [testData, parseSchema])

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
        const validationResponse = await fetch(`${BACKEND_URL}/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            test_id: testId,
            question_id: currentQ.id,
            user_sql: query,
            student_usn: studentDetails?.usn
          })
        })

        if (!validationResponse.ok) {
          throw new Error('Validation request failed')
        }

        const validationResult: ValidationResponse = await validationResponse.json()

        // Calculate score if correct
        if (validationResult.is_correct && questionScores[currentQuestion] === 0) {
          setQuestionScores((prev) => {
            const newScores = [...prev]
            const maxScore = getMarksByDifficulty(currentQ.difficulty)
            newScores[currentQuestion] = maxScore
            return newScores
          })
        }

        // Convert output arrays to readable format
        const formatOutput = (output: any[][]) => {
          if (!output || output.length === 0) return []
          
          // If first row exists, use it to create column names
          const firstRow = output[0]
          const columns = firstRow ? 
            firstRow.map((_, index) => `column_${index + 1}`) : 
            ['result']
          
          return output.map(row => {
            const obj: any = {}
            row.forEach((value, index) => {
              obj[columns[index]] = value
            })
            return obj
          })
        }

        const userOutput = formatOutput(validationResult.user_output)
        const expectedOutput = formatOutput(validationResult.expected_output)

        setQueryResults({
          isCorrect: validationResult.is_correct,
          message: validationResult.message,
          attempts: queryAttempts[currentQuestion] + 1,
          score: questionScores[currentQuestion],
          maxScore: getMarksByDifficulty(currentQ.difficulty),
          feedback: validationResult.is_correct 
            ? "✅ Query executed successfully and matches expected output!" 
            : "❌ Query output doesn't match expected results",
          userOutput,
          expectedOutput,
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
    [currentQuestion, testData, testId, queryAttempts, questionScores, studentDetails],
  )

  const handleQuestionChange = useCallback((index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentQuestion(index)
      setIsTransitioning(false)
    }, 200)
  }, [])

  // Get current question data in frontend format
  const currentQuestionData = useMemo(() => {
    if (!testData || !testData.questions[currentQuestion]) return null
    return convertQuestionToFrontendFormat(testData.questions[currentQuestion], currentQuestion)
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

  // Get test name for header (extract from teacher's tests list)
  const testName = useMemo(() => {
    if (!studentDetails?.testId) return "SQL Test"
    
    // Try to get test name from localStorage or use generic name
    const teacherId = localStorage.getItem("studentTeacherId") || "1"
    const cachedTests = localStorage.getItem(`teacher_${teacherId}_tests`)
    if (cachedTests) {
      const tests = JSON.parse(cachedTests)
      const test = tests.find((t: any) => t.id === studentDetails.testId)
      return test?.name || "SQL Test"
    }
    return "SQL Test"
  }, [studentDetails])

  // Render output table component
  const renderOutputTable = (data: any[], title: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-[#2d2d2d] rounded p-2">
          <div className="text-xs text-[#d4d4d4] mb-2">{title}</div>
          <div className="text-xs text-gray-500 italic">No data returned</div>
        </div>
      )
    }

    const columns = Object.keys(data[0])

    return (
      <div className="bg-[#2d2d2d] rounded p-2">
        <div className="text-xs text-[#d4d4d4] mb-2">{title}</div>
        <div className="max-h-48 overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3d3d3d]">
                {columns.map((column) => (
                  <th key={column} className="text-left p-2 text-[#d4d4d4] text-xs font-semibold bg-[#3d3d3d]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#3d3d3d] hover:bg-[#3d3d3d]">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-2 text-[#d4d4d4] text-xs">
                      {String(row[column] ?? 'NULL')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && (
            <div className="text-xs text-[#888] mt-2 text-center">
              Showing {data.length} rows
            </div>
          )}
        </div>
      </div>
    )
  }

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
      {/* Header */}
      <div className="border-b border-[#2d2d2d] bg-[#1e1e1e] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">{testName}</h1>
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

      {/* Main Content */}
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
                        <h3 className="text-sm font-semibold text-white">Query Results</h3>
                        <Button
                          onClick={() => setShowResults(false)}
                          variant="ghost"
                          size="sm"
                          className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d2d] h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="h-full overflow-y-auto p-3 space-y-4">
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

                        {/* Your Query Results */}
                        {queryResults?.userOutput && renderOutputTable(queryResults.userOutput, "Your Query Results")}

                        {/* Expected Results (only show if wrong answer) */}
                        {!queryResults?.isCorrect && queryResults?.expectedOutput && 
                         renderOutputTable(queryResults.expectedOutput, "Expected Results")}

                        {/* Message */}
                        {queryResults?.message && (
                          <div className="bg-[#2d2d2d] rounded p-2">
                            <div className="text-xs text-[#d4d4d4] mb-1">Message</div>
                            <div className="text-xs text-[#d4d4d4]">{queryResults.message}</div>
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
                          <div className={`rounded p-2 ${queryResults?.isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-[#2d2d2d]'}`}>
                            <div className={`text-xs mb-1 ${queryResults?.isCorrect ? 'text-green-400' : 'text-[#d4d4d4]'}`}>
                              {queryResults?.isCorrect ? 'Success' : 'Feedback'}
                            </div>
                            <div className={`text-xs ${queryResults?.isCorrect ? 'text-green-300' : 'text-[#d4d4d4]'}`}>
                              {queryResults.feedback}
                            </div>
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
            {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowSubmitModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-6 mx-4 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Submit Test</h2>
              <p className="text-[#888] text-sm">
                Ready to submit your answers?
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0f0f0f] rounded-lg p-3 border border-[#2d2d2d]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-[#888]">Score</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {totalScore}<span className="text-sm text-[#666]">/{maxTotalScore}</span>
                </div>
              </div>
              
              <div className="bg-[#0f0f0f] rounded-lg p-3 border border-[#2d2d2d]">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-[#888]">Progress</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(progress)}%
                </div>
              </div>
              
              <div className="bg-[#0f0f0f] rounded-lg p-3 border border-[#2d2d2d]">
                <div className="flex items-center gap-2 mb-1">
                  <FileQuestion className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-[#888]">Answered</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {answers.filter(answer => answer.trim().length > 0).length}
                </div>
              </div>
              
              <div className="bg-[#0f0f0f] rounded-lg p-3 border border-[#2d2d2d]">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-[#888]">Attempts</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {queryAttempts.reduce((sum, attempts) => sum + attempts, 0)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#888] mb-2">
                <span>Test Completion</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-[#0f0f0f] rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-300 text-xs leading-relaxed">
                  After submission, you cannot modify your answers. Ensure all questions are attempted to your satisfaction.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSubmitModal(false)}
                variant="outline"
                className="flex-1 border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d] hover:text-white transition-colors h-11"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue
              </Button>
              <Button
                onClick={confirmSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors h-11 font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-[#2d2d2d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}