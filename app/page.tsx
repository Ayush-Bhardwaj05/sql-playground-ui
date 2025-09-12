import { ProblemPanel } from "@/components/problem-panel"
import { SQLPlayground } from "@/components/sql-playground"
import questionData from "@/data/question.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SQL Playground</h1>
          <p className="text-muted-foreground">Practice SQL queries with interactive problems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="lg:max-h-screen lg:overflow-y-auto">
            <ProblemPanel question={questionData} />
          </div>

          {/* Right Panel - SQL Editor and Results */}
          <div className="lg:max-h-screen lg:overflow-y-auto">
            <SQLPlayground starterCode={questionData.starterCode} />
          </div>
        </div>
      </div>
    </div>
  )
}
