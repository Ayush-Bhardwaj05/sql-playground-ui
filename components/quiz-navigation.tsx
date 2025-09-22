"use client"

import { Button } from "@/components/ui/button"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  answers: string[]
  isTransitioning: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  onQuestionSelect: (index: number) => void
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answers,
  isTransitioning,
  onPrevious,
  onNext,
  onSubmit,
  onQuestionSelect,
}: QuizNavigationProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="space-y-6">
      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          disabled={currentQuestion === 0 || isTransitioning}
          variant="outline"
          className="flex-1 bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d] disabled:opacity-50 transition-all duration-200 hover:scale-105"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={onSubmit}
            disabled={isTransitioning}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={isTransitioning}
            className="flex-1 bg-[#2563eb] hover:bg-[#3b82f6] text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Next
          </Button>
        )}
      </div>

      {/* Question indicators */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed ${
              index === currentQuestion
                ? "bg-[#2563eb] scale-125"
                : answers[index]
                  ? "bg-green-600 hover:scale-110"
                  : "bg-[#2d2d2d] hover:bg-[#3d3d3d] hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
