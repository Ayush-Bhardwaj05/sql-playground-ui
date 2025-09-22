"use client"

import { useEffect, useState } from "react"
import { QuizCard } from "@/components/quiz-card"

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

export default function StudentDashboard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-center space-y-8 max-w-4xl w-full">
          <div
            className={`space-y-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-4xl font-bold text-white">Available Quizzes</h2>
            <p className="text-lg text-[#d4d4d4] leading-relaxed">Select a quiz to start practicing SQL</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} quiz={quiz} index={index} isVisible={isVisible} />
            ))}
          </div>

          <div
            className={`mt-12 p-8 bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-xl border border-[#2d2d2d] shadow-xl transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="text-white font-semibold mb-6 text-xl">Your Progress</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-[#2563eb] transition-all duration-300">
                <div className="text-3xl font-bold text-[#2563eb] mb-2">12</div>
                <div className="text-sm text-[#d4d4d4]">Tests Completed</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-green-400 transition-all duration-300">
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <div className="text-sm text-[#d4d4d4]">Average Score</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0f0f0f] border border-[#2d2d2d] hover:border-yellow-400 transition-all duration-300">
                <div className="text-3xl font-bold text-yellow-400 mb-2">7</div>
                <div className="text-sm text-[#d4d4d4]">Current Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
