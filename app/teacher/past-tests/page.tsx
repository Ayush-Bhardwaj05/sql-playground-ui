import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Edit, Trash2, Users, Clock, CheckCircle } from "lucide-react"

const dummyTests = [
  {
    id: 1,
    title: "SQL Joins and Relationships",
    description: "Test covering INNER, LEFT, RIGHT, and FULL OUTER joins with multiple tables",
    createdDate: "2024-01-15",
    submissions: 24,
    avgScore: 78,
    status: "Active",
    difficulty: "Medium",
    duration: "45 min",
  },
  {
    id: 2,
    title: "Database Design Fundamentals",
    description: "Creating tables, defining relationships, and normalization principles",
    createdDate: "2024-01-10",
    submissions: 18,
    avgScore: 85,
    status: "Active",
    difficulty: "Easy",
    duration: "30 min",
  },
  {
    id: 3,
    title: "Advanced Query Optimization",
    description: "Complex queries, subqueries, window functions, and performance optimization",
    createdDate: "2024-01-05",
    submissions: 12,
    avgScore: 65,
    status: "Closed",
    difficulty: "Hard",
    duration: "60 min",
  },
  {
    id: 4,
    title: "Aggregate Functions and Grouping",
    description: "COUNT, SUM, AVG, GROUP BY, HAVING clauses with real-world scenarios",
    createdDate: "2023-12-20",
    submissions: 31,
    avgScore: 82,
    status: "Active",
    difficulty: "Medium",
    duration: "40 min",
  },
  {
    id: 5,
    title: "Data Manipulation (DML)",
    description: "INSERT, UPDATE, DELETE operations with constraints and transactions",
    createdDate: "2023-12-15",
    submissions: 27,
    avgScore: 73,
    status: "Closed",
    difficulty: "Medium",
    duration: "35 min",
  },
]

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-600 text-white"
    case "Closed":
      return "bg-gray-600 text-white"
    default:
      return "bg-gray-600 text-white"
  }
}

export default function PastTests() {
  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/teacher">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Past Tests</h1>
            <p className="text-sm text-[#d4d4d4]">View and manage your created tests</p>
          </div>
        </div>
        <Link href="/teacher/create-test">
          <Button className="bg-[#2563eb] hover:bg-[#3b82f6] text-white">Create New Test</Button>
        </Link>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-[#d4d4d4]">Total Tests</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">112</div>
                  <div className="text-sm text-[#d4d4d4]">Total Submissions</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">77%</div>
                  <div className="text-sm text-[#d4d4d4]">Avg Score</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-[#d4d4d4]">Active Tests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tests List */}
          <div className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] overflow-hidden">
            <div className="p-4 border-b border-[#2d2d2d]">
              <h2 className="text-lg font-semibold text-white">All Tests</h2>
            </div>

            <div className="divide-y divide-[#2d2d2d]">
              {dummyTests.map((test) => (
                <div key={test.id} className="p-6 hover:bg-[#252525] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{test.title}</h3>
                        <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                        <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                      </div>

                      <p className="text-[#d4d4d4] mb-4 leading-relaxed">{test.description}</p>

                      <div className="flex items-center gap-6 text-sm text-[#d4d4d4]">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{test.submissions} submissions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>{test.avgScore}% avg score</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.duration}</span>
                        </div>
                        <div>
                          <span>Created: {new Date(test.createdDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d2d]">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white hover:bg-[#2d2d2d]">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
