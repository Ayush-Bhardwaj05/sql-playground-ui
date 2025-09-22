"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StudentForm } from "@/components/student-form"

const dummyQuizzes = [
  {
    id: 1,
    title: "Basic SQL Queries",
    description: "Learn SELECT, WHERE, and ORDER BY statements",
    difficulty: "Beginner",
    questions: 5,
    duration: "30 min",
    color: "bg-green-600",
  },
  {
    id: 2,
    title: "Advanced Joins",
    description: "Master INNER, LEFT, RIGHT, and FULL OUTER joins",
    difficulty: "Intermediate",
    questions: 5,
    duration: "45 min",
    color: "bg-yellow-600",
  },
  {
    id: 3,
    title: "Database Design",
    description: "Normalization, indexes, and optimization",
    difficulty: "Advanced",
    questions: 5,
    duration: "60 min",
    color: "bg-red-600",
  },
]

export default function QuizDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = Number.parseInt(params.id as string)

  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const quiz = dummyQuizzes.find((q) => q.id === quizId)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleFormSubmit = (name: string, usn: string) => {
    setIsLoading(true)

    // Store student details in sessionStorage for the quiz
    sessionStorage.setItem(
      "studentDetails",
      JSON.stringify({
        name,
        usn,
        quizId: quizId,
      }),
    )

    // Simulate loading delay
    setTimeout(() => {
      router.push(`/student/quiz/${quizId}/test`)
    }, 1000)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-8">
          <div
            className={`text-center space-y-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className={`w-16 h-16 ${quiz.color} rounded-xl mx-auto flex items-center justify-center mb-4`}>
              <span className="text-white font-bold text-2xl">{quiz.id}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">{quiz.title}</h2>
            <p className="text-[#d4d4d4] leading-relaxed">{quiz.description}</p>

            <div className="flex justify-center gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full text-white ${quiz.color}`}>{quiz.difficulty}</span>
              <span className="text-[#d4d4d4] bg-[#1a1a1a] px-3 py-1 rounded-full">{quiz.questions} questions</span>
              <span className="text-[#d4d4d4] bg-[#1a1a1a] px-3 py-1 rounded-full">{quiz.duration}</span>
            </div>
          </div>

          <div
            className={`p-8 bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-xl border border-[#2d2d2d] shadow-xl transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="text-white font-semibold mb-6 text-xl">Enter Your Details</h3>

            <StudentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
              className="text-[#d4d4d4] hover:text-white transition-colors disabled:opacity-50"
            >
              ← Back to Quiz Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
