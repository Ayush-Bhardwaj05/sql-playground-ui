import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Clock, CheckCircle, Target, Award } from "lucide-react"

const dummyStats = {
  overall: {
    testsCompleted: 12,
    averageScore: 85,
    totalTimeSpent: "8h 45m",
    currentStreak: 7,
    bestStreak: 12,
    rank: 15,
    totalStudents: 156,
  },
  recentTests: [
    {
      id: 1,
      title: "SQL Joins and Relationships",
      completedDate: "2024-01-20",
      score: 92,
      timeSpent: "42 min",
      difficulty: "Medium",
      status: "Passed",
    },
    {
      id: 2,
      title: "Database Design Fundamentals",
      completedDate: "2024-01-18",
      score: 88,
      timeSpent: "28 min",
      difficulty: "Easy",
      status: "Passed",
    },
    {
      id: 3,
      title: "Advanced Query Optimization",
      completedDate: "2024-01-15",
      score: 76,
      timeSpent: "58 min",
      difficulty: "Hard",
      status: "Passed",
    },
    {
      id: 4,
      title: "Aggregate Functions and Grouping",
      completedDate: "2024-01-12",
      score: 94,
      timeSpent: "35 min",
      difficulty: "Medium",
      status: "Passed",
    },
    {
      id: 5,
      title: "Data Manipulation (DML)",
      completedDate: "2024-01-10",
      score: 82,
      timeSpent: "40 min",
      difficulty: "Medium",
      status: "Passed",
    },
  ],
  skillBreakdown: [
    { skill: "Basic Queries", score: 95, tests: 4 },
    { skill: "Joins", score: 88, tests: 3 },
    { skill: "Aggregations", score: 91, tests: 2 },
    { skill: "Subqueries", score: 79, tests: 2 },
    { skill: "Advanced Functions", score: 73, tests: 1 },
  ],
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-600 text-white"
    case "Medium":
      return "bg-yellow-600 text-white"
    case "Hard":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-600 text-white"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-400"
  if (score >= 80) return "text-yellow-400"
  if (score >= 70) return "text-orange-400"
  return "text-red-400"
}

export default function StudentStats() {
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
            <h1 className="text-2xl font-bold text-white">Test Statistics</h1>
            <p className="text-sm text-[#d4d4d4]">Track your SQL learning progress and performance</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{dummyStats.overall.testsCompleted}</div>
                  <div className="text-sm text-[#d4d4d4]">Tests Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{dummyStats.overall.averageScore}%</div>
                  <div className="text-sm text-[#d4d4d4]">Average Score</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{dummyStats.overall.currentStreak}</div>
                  <div className="text-sm text-[#d4d4d4]">Current Streak</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">#{dummyStats.overall.rank}</div>
                  <div className="text-sm text-[#d4d4d4]">Class Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tests */}
            <div className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] overflow-hidden">
              <div className="p-4 border-b border-[#2d2d2d]">
                <h2 className="text-lg font-semibold text-white">Recent Tests</h2>
              </div>

              <div className="divide-y divide-[#2d2d2d] max-h-96 overflow-y-auto">
                {dummyStats.recentTests.map((test) => (
                  <div key={test.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{test.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                          <span className="text-xs text-[#d4d4d4]">
                            {new Date(test.completedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${getScoreColor(test.score)}`}>{test.score}%</div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#d4d4d4]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.timeSpent}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{test.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] overflow-hidden">
              <div className="p-4 border-b border-[#2d2d2d]">
                <h2 className="text-lg font-semibold text-white">Skill Breakdown</h2>
              </div>

              <div className="p-4 space-y-4">
                {dummyStats.skillBreakdown.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        <span className="text-xs text-[#d4d4d4]">({skill.tests} tests)</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#2d2d2d] rounded-full h-2">
                      <div
                        className="bg-[#2563eb] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d] text-center">
              <Clock className="w-8 h-8 text-[#2563eb] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{dummyStats.overall.totalTimeSpent}</div>
              <div className="text-sm text-[#d4d4d4]">Total Time Spent</div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d] text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{dummyStats.overall.bestStreak}</div>
              <div className="text-sm text-[#d4d4d4]">Best Streak</div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d] text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">Top 10%</div>
              <div className="text-sm text-[#d4d4d4]">Class Percentile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
