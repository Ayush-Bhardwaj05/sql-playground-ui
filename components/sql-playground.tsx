"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { ResultsPane } from "./results-pane"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-muted rounded flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
})

interface SQLPlaygroundProps {
  starterCode: string
}

export function SQLPlayground({ starterCode }: SQLPlaygroundProps) {
  const [code, setCode] = useState(starterCode)
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRunQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock results based on the query
    if (code.toLowerCase().includes("select") && code.toLowerCase().includes("students")) {
      if (code.toLowerCase().includes("marks > 80")) {
        setResults([{ name: "John" }, { name: "Sarah" }])
      } else if (code.toLowerCase().includes("*")) {
        setResults([
          { id: 1, name: "John", marks: 85 },
          { id: 2, name: "Alex", marks: 70 },
          { id: 3, name: "Sarah", marks: 92 },
          { id: 4, name: "Mike", marks: 78 },
        ])
      } else {
        setResults([{ name: "John" }, { name: "Alex" }, { name: "Sarah" }, { name: "Mike" }])
      }
    } else if (code.trim() === "") {
      setError("Please enter a SQL query")
    } else {
      setError("Syntax error: Invalid SQL query")
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* SQL Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">SQL Editor</CardTitle>
            <Button onClick={handleRunQuery} disabled={isLoading} className="gap-2">
              <Play className="h-4 w-4" />
              {isLoading ? "Running..." : "Run Query"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <MonacoEditor
              height="300px"
              language="sql"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <ResultsPane results={results} error={error} isLoading={isLoading} />
    </div>
  )
}
