import Link from "next/link"

interface QuizCardProps {
  quiz: {
    id: number
    title: string
    description: string
    difficulty: string
    questions: number
    duration: string
    color: string
  }
  index: number
  isVisible: boolean
}

export function QuizCard({ quiz, index, isVisible }: QuizCardProps) {
  return (
    <Link href={`/student/quiz/${quiz.id}/details`}>
      <div
        className={`p-6 bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-xl border border-[#2d2d2d] hover:border-[#2563eb] transition-all duration-300 hover:scale-105 cursor-pointer group animate-in fade-in slide-in-from-bottom duration-500`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div
          className={`w-12 h-12 ${quiz.color} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <span className="text-white font-bold text-xl">{quiz.id}</span>
        </div>

        <h3 className="text-white font-semibold mb-2 text-xl">{quiz.title}</h3>
        <p className="text-[#d4d4d4] text-sm mb-4 leading-relaxed">{quiz.description}</p>

        <div className="flex justify-between items-center text-sm">
          <span className={`px-3 py-1 rounded-full text-white ${quiz.color}`}>{quiz.difficulty}</span>
          <div className="text-[#d4d4d4]">
            <span>
              {quiz.questions} questions • {quiz.duration}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
