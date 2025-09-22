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

const dummyQuestions = [
  {
    id: 1,
    difficulty: "Easy",
    marks: 10,
    title: "Basic SELECT Query",
    description: "Write a SQL query to select all columns from the 'students' table.",
    schema: {
      tables: [
        {
          name: "students",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "age", type: "INT", constraints: "" },
            { name: "marks", type: "DECIMAL(5,2)", constraints: "" },
            { name: "course_id", type: "INT", constraints: "FOREIGN KEY" },
          ],
        },
      ],
    },
    sampleData: {
      students: [
        { id: 1, name: "Alice Johnson", age: 20, marks: 85.5, course_id: 1 },
        { id: 2, name: "Bob Smith", age: 21, marks: 92.0, course_id: 2 },
        { id: 3, name: "Carol Davis", age: 19, marks: 78.5, course_id: 1 },
        { id: 4, name: "David Wilson", age: 22, marks: 88.0, course_id: 3 },
      ],
    },
    inputFormat: "No input parameters required",
    outputFormat: "All columns: id, name, age, marks, course_id",
    expectedOutput: [
      { id: 1, name: "Alice Johnson", age: 20, marks: 85.5, course_id: 1 },
      { id: 2, name: "Bob Smith", age: 21, marks: 92.0, course_id: 2 },
      { id: 3, name: "Carol Davis", age: 19, marks: 78.5, course_id: 1 },
      { id: 4, name: "David Wilson", age: 22, marks: 88.0, course_id: 3 },
    ],
    starterCode: "-- Write your SQL query here\nSELECT ",
    hint: "Use SELECT * FROM table_name",
  },
  {
    id: 2,
    difficulty: "Easy",
    marks: 10,
    title: "Filtering with WHERE",
    description: "Write a SQL query to select students with marks greater than 80.",
    schema: {
      tables: [
        {
          name: "students",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "age", type: "INT", constraints: "" },
            { name: "marks", type: "DECIMAL(5,2)", constraints: "" },
            { name: "course_id", type: "INT", constraints: "FOREIGN KEY" },
          ],
        },
      ],
    },
    sampleData: {
      students: [
        { id: 1, name: "Alice Johnson", age: 20, marks: 85.5, course_id: 1 },
        { id: 2, name: "Bob Smith", age: 21, marks: 92.0, course_id: 2 },
        { id: 3, name: "Carol Davis", age: 19, marks: 78.5, course_id: 1 },
        { id: 4, name: "David Wilson", age: 22, marks: 88.0, course_id: 3 },
      ],
    },
    inputFormat: "Filter condition: marks > 80",
    outputFormat: "Students with marks greater than 80",
    expectedOutput: [
      { id: 1, name: "Alice Johnson", age: 20, marks: 85.5, course_id: 1 },
      { id: 2, name: "Bob Smith", age: 21, marks: 92.0, course_id: 2 },
      { id: 4, name: "David Wilson", age: 22, marks: 88.0, course_id: 3 },
    ],
    starterCode: "-- Write your SQL query here\nSELECT * FROM students\nWHERE ",
    hint: "Use WHERE column_name > value",
  },
  {
    id: 3,
    difficulty: "Medium",
    marks: 30,
    title: "JOIN Operations",
    description: "Write a SQL query to join students and courses tables to show student names with their course names.",
    schema: {
      tables: [
        {
          name: "students",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "course_id", type: "INT", constraints: "FOREIGN KEY REFERENCES courses(id)" },
          ],
        },
        {
          name: "courses",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "course_name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "credits", type: "INT", constraints: "" },
          ],
        },
      ],
    },
    sampleData: {
      students: [
        { id: 1, name: "Alice Johnson", course_id: 1 },
        { id: 2, name: "Bob Smith", course_id: 2 },
        { id: 3, name: "Carol Davis", course_id: 1 },
        { id: 4, name: "David Wilson", course_id: 3 },
      ],
      courses: [
        { id: 1, course_name: "Computer Science", credits: 4 },
        { id: 2, course_name: "Mathematics", credits: 3 },
        { id: 3, course_name: "Physics", credits: 4 },
      ],
    },
    inputFormat: "Join students and courses tables",
    outputFormat: "student_name, course_name",
    expectedOutput: [
      { name: "Alice Johnson", course_name: "Computer Science" },
      { name: "Bob Smith", course_name: "Mathematics" },
      { name: "Carol Davis", course_name: "Computer Science" },
      { name: "David Wilson", course_name: "Physics" },
    ],
    starterCode: "-- Write your SQL query here\nSELECT s.name, c.course_name\nFROM students s\n",
    hint: "Use JOIN to combine tables on matching foreign key",
  },
  {
    id: 4,
    difficulty: "Hard",
    marks: 50,
    title: "Complex Aggregation",
    description:
      "Write a SQL query to find the average marks for each course, showing only courses with average marks above 75.",
    schema: {
      tables: [
        {
          name: "students",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "marks", type: "DECIMAL(5,2)", constraints: "" },
            { name: "course_id", type: "INT", constraints: "FOREIGN KEY" },
          ],
        },
        {
          name: "courses",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "course_name", type: "VARCHAR(100)", constraints: "NOT NULL" },
          ],
        },
      ],
    },
    sampleData: {
      students: [
        { id: 1, name: "Alice Johnson", marks: 85.5, course_id: 1 },
        { id: 2, name: "Bob Smith", marks: 92.0, course_id: 2 },
        { id: 3, name: "Carol Davis", marks: 78.5, course_id: 1 },
        { id: 4, name: "David Wilson", marks: 88.0, course_id: 3 },
        { id: 5, name: "Eve Brown", marks: 95.0, course_id: 2 },
        { id: 6, name: "Frank Miller", marks: 72.0, course_id: 3 },
      ],
      courses: [
        { id: 1, course_name: "Computer Science" },
        { id: 2, course_name: "Mathematics" },
        { id: 3, course_name: "Physics" },
      ],
    },
    inputFormat: "Group by course, filter average > 75",
    outputFormat: "course_name, average_marks",
    expectedOutput: [
      { course_name: "Computer Science", average_marks: 82.0 },
      { course_name: "Mathematics", average_marks: 93.5 },
    ],
    starterCode: "-- Write your SQL query here\nSELECT \n",
    hint: "Use GROUP BY, HAVING, and AVG functions",
  },
  {
    id: 5,
    difficulty: "Hard",
    marks: 50,
    title: "Subquery Challenge",
    description:
      "Write a SQL query to find students who scored higher than the average marks of their respective courses.",
    schema: {
      tables: [
        {
          name: "students",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "name", type: "VARCHAR(100)", constraints: "NOT NULL" },
            { name: "marks", type: "DECIMAL(5,2)", constraints: "" },
            { name: "course_id", type: "INT", constraints: "FOREIGN KEY" },
          ],
        },
        {
          name: "courses",
          columns: [
            { name: "id", type: "INT", constraints: "PRIMARY KEY" },
            { name: "course_name", type: "VARCHAR(100)", constraints: "NOT NULL" },
          ],
        },
      ],
    },
    sampleData: {
      students: [
        { id: 1, name: "Alice Johnson", marks: 85.5, course_id: 1 },
        { id: 2, name: "Bob Smith", marks: 92.0, course_id: 2 },
        { id: 3, name: "Carol Davis", marks: 78.5, course_id: 1 },
        { id: 4, name: "David Wilson", marks: 88.0, course_id: 3 },
        { id: 5, name: "Eve Brown", marks: 95.0, course_id: 2 },
        { id: 6, name: "Frank Miller", marks: 72.0, course_id: 3 },
      ],
      courses: [
        { id: 1, course_name: "Computer Science" },
        { id: 2, course_name: "Mathematics" },
        { id: 3, course_name: "Physics" },
      ],
    },
    inputFormat: "Compare student marks with course average",
    outputFormat: "Students above their course average",
    expectedOutput: [
      { name: "Alice Johnson", marks: 85.5, course_name: "Computer Science" },
      { name: "Eve Brown", marks: 95.0, course_name: "Mathematics" },
      { name: "David Wilson", marks: 88.0, course_name: "Physics" },
    ],
    starterCode: "-- Write your SQL query here\nSELECT \n",
    hint: "Use subqueries with comparison operators",
  },
]

export default function QuizTestPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = Number.parseInt(params.id as string)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(5).fill(""))
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [queryAttempts, setQueryAttempts] = useState<number[]>(new Array(5).fill(0))
  const [questionScores, setQuestionScores] = useState<number[]>(new Array(5).fill(0))
  const [showResults, setShowResults] = useState(false)
  const [queryResults, setQueryResults] = useState<any>(null)

  useEffect(() => {
    const details = sessionStorage.getItem("studentDetails")
    if (!details) {
      router.push(`/student/quiz/${quizId}/details`)
      return
    }

    setStudentDetails(JSON.parse(details))
    setIsVisible(true)
  }, [quizId, router])

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
    if (currentQuestion < dummyQuestions.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }, [currentQuestion])

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

  const confirmSubmit = useCallback(() => {
    const totalScore = questionScores.reduce((sum, score) => sum + score, 0)
    const maxPossibleScore = dummyQuestions.reduce((sum, q) => sum + q.marks, 0)
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)

    const submission = {
      studentDetails,
      quizId,
      answers,
      questionScores,
      queryAttempts,
      totalScore,
      maxPossibleScore,
      percentage,
      submittedAt: new Date().toISOString(),
    }

    const submissions = JSON.parse(localStorage.getItem("quizSubmissions") || "[]")
    submissions.push(submission)
    localStorage.setItem("quizSubmissions", JSON.stringify(submissions))

    sessionStorage.removeItem("studentDetails")

    setShowSubmitModal(false)

    const popup = document.createElement("div")
    popup.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300"
    popup.innerHTML = `
      <div class="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-xl border border-green-600 text-center animate-in zoom-in duration-500 max-w-md">
        <div class="text-6xl mb-4">✅</div>
        <h2 class="text-2xl font-bold text-white mb-2">Test Completed!</h2>
        <p class="text-green-200 mb-4">Your answers have been submitted successfully.</p>
        <div class="bg-green-800/50 rounded-lg p-4 mb-4">
          <div class="text-3xl font-bold text-white">${percentage}%</div>
          <div class="text-green-200 text-sm">Final Score: ${totalScore}/${maxPossibleScore} points</div>
        </div>
        <p class="text-green-300 text-sm">Results will be available in your dashboard</p>
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
  }, [questionScores, studentDetails, quizId, answers, queryAttempts, router])

  const handleRunQuery = useCallback(
    (query: string) => {
      const question = dummyQuestions[currentQuestion]

      setQueryAttempts((prev) => {
        const newAttempts = [...prev]
        newAttempts[currentQuestion] += 1
        return newAttempts
      })

      const results = QueryVerifier.verifyQuery(query, question)

      if (results.isCorrect && questionScores[currentQuestion] === 0) {
        setQuestionScores((prev) => {
          const newScores = [...prev]
          const maxScore = question.marks
          const attemptPenalty = Math.max(0, queryAttempts[currentQuestion] * 0.1)
          const score = Math.max(maxScore * 0.3, maxScore * (1 - attemptPenalty))
          newScores[currentQuestion] = Math.round(score)
          return newScores
        })
      }

      setQueryResults({
        ...results,
        attempts: queryAttempts[currentQuestion] + 1,
        score: questionScores[currentQuestion],
        maxScore: question.marks,
        hint: results.isCorrect ? null : QueryVerifier.getHint(question.id, query),
      })
      setShowResults(true)
    },
    [currentQuestion, queryAttempts, questionScores],
  )

  const handleQuestionChange = useCallback((index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentQuestion(index)
      setIsTransitioning(false)
    }, 200)
  }, [])

  const currentQuestionData = useMemo(() => dummyQuestions[currentQuestion], [currentQuestion])
  const progress = useMemo(() => ((currentQuestion + 1) / dummyQuestions.length) * 100, [currentQuestion])
  const totalScore = useMemo(() => questionScores.reduce((sum, score) => sum + score, 0), [questionScores])
  const maxTotalScore = useMemo(() => dummyQuestions.reduce((sum, q) => sum + q.marks, 0), [])

  if (!studentDetails) {
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
            <h1 className="text-xl font-bold text-white">SQL Quiz</h1>
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
                Question {currentQuestion + 1} of {dummyQuestions.length}
              </div>

              {currentQuestion === dummyQuestions.length - 1 ? (
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
                totalQuestions={dummyQuestions.length}
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
                            <div className="text-xs text-[#d4d4d4] mb-2">Output</div>
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
    </div>
  )
}
