import { ProblemPanel } from "@/components/problem-panel"
import { SQLPlayground } from "@/components/sql-playground"
import { ThemeToggle } from "@/components/theme-toggle"
import questionData from "@/data/question.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">SQL Playground</h1>
            <p className="text-muted-foreground">Practice SQL queries with interactive problems</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Problem Description */}
          <div className="overflow-y-auto border rounded-lg bg-card">
            <ProblemPanel question={questionData} />
          </div>

          {/* Right Panel - SQL Editor */}
          <div className="border rounded-lg bg-card overflow-hidden">
            <SQLPlayground starterCode={questionData.starterCode} />
          </div>
        </div>
      </div>
    </div>
  )
}
