"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProblemPanel } from "@/components/problem-panel"
import { SQLPlayground } from "@/components/sql-playground"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

interface Question {
  id: number
  question_text: string
  difficulty: string
  expected_sql: string
}

interface SchemaColumn {
  column_name: string
  data_type: string
}

interface Test {
  id: number
  name: string
  table_name: string
  schema_sql: string
  table_schema: SchemaColumn[]
  top_rows: any[]
}


interface TestData {
  test: Test
  questions: Question[]
}

export default function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const [testData, setTestData] = useState<TestData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: string }>({})
  const [validationResults, setValidationResults] = useState<{ [questionId: number]: any }>({})

  const resolvedParams = use(params)
  const testId = parseInt(resolvedParams.testId)

  useEffect(() => {
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://aps-backend-j6mc.onrender.com/schema/tests/${testId}/questions`)
      if (!response.ok) {
        throw new Error('Failed to fetch test data')
      }
      const data = await response.json()
      setTestData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleValidateAnswer = async (questionId: number, userSql: string) => {
  try {
    const response = await fetch("https://aps-backend-j6mc.onrender.com/schema/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    test_id: testId,
    question_id: questionId,
    user_sql: userSql,
  }),
})


    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Validation failed')
    }

    const result = await response.json()
    setValidationResults(prev => ({
      ...prev,
      [questionId]: result
    }))
  } catch (err) {
    console.error('Validation error:', err)
  }
}



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const goToNextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p className="text-[#d4d4d4]">Loading test...</p>
        </div>
      </div>
    )
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || 'Test not found'}</p>
          <Link href="/student/tests">
            <Button className="bg-[#2563eb] hover:bg-[#3b82f6]">
              Back to Tests
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = testData.questions[currentQuestionIndex]
  const currentAnswer = userAnswers[currentQuestion.id] || ''
  const currentValidation = validationResults[currentQuestion.id]

  const questionData = {
  id: currentQuestion.id,
  title: `Question ${currentQuestionIndex + 1}`,
  description: currentQuestion.question_text,
  difficulty: currentQuestion.difficulty,
  starterCode:
    currentAnswer ||
    '-- Write your SQL query here\nSELECT * FROM ' + testData.test.table_name + ';',
  expectedOutput: currentValidation?.expected_output || [],
  userOutput: currentValidation?.user_output || [],
  isCorrect: currentValidation?.is_correct || false,

  // ✅ Use backend keys: table_schema + top_rows
  schema: [
    {
      table: testData.test.table_name,
      cols: testData.test.table_schema
        ? testData.test.table_schema.map(
            (col: any) => `${col.column_name} (${col.data_type})`
          )
        : []
    }
  ],

  sampleData: testData.test.top_rows
    ? { [testData.test.table_name]: testData.test.top_rows }
    : {},

  examples: []
}




  return (
    <div className="h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/student/tests">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{testData.test.name}</h1>
            <p className="text-sm text-[#d4d4d4]">
              Question {currentQuestionIndex + 1} of {testData.questions.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
            {currentQuestion.difficulty.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === testData.questions.length - 1}
              className="bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 py-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto bg-[#1e1e1e] rounded-lg mr-2 shadow-lg">
              <ProblemPanel question={questionData} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-[#2d2d2d] hover:bg-[#3d3d3d]" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full bg-[#1e1e1e] rounded-lg ml-2 overflow-hidden shadow-lg">
              <SQLPlayground 
                starterCode={questionData.starterCode}
                onCodeChange={(code) => handleAnswerChange(currentQuestion.id, code)}
                onRunQuery={() => handleValidateAnswer(currentQuestion.id, currentAnswer)}
                validationResult={currentValidation}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
