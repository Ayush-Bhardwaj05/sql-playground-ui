"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, X, Wand2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-800 rounded flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
  const [showResults, setShowResults] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  const handleRunQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)
    setShowResults(true)

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

  const handleFontSizeChange = (value: string) => {
    const size = Number.parseInt(value)
    setFontSize(size)
  }

  const handleBeautifyCode = () => {
    const beautified = code
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ",\n  ")
      .replace(/\bSELECT\b/gi, "SELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bHAVING\b/gi, "\nHAVING")
      .replace(/\bJOIN\b/gi, "\nJOIN")
      .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN")
      .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN")
      .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN")
      .trim()

    setCode(beautified)
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Register SQL completion provider
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: "SELECT",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "SELECT ",
            documentation: "SELECT statement",
          },
          {
            label: "FROM",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "FROM ",
            documentation: "FROM clause",
          },
          {
            label: "WHERE",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "WHERE ",
            documentation: "WHERE clause",
          },
          {
            label: "ORDER BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "ORDER BY ",
            documentation: "ORDER BY clause",
          },
          {
            label: "GROUP BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "GROUP BY ",
            documentation: "GROUP BY clause",
          },
          {
            label: "HAVING",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "HAVING ",
            documentation: "HAVING clause",
          },
          {
            label: "INSERT INTO",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "INSERT INTO ",
            documentation: "INSERT statement",
          },
          {
            label: "UPDATE",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "UPDATE ",
            documentation: "UPDATE statement",
          },
          {
            label: "DELETE FROM",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "DELETE FROM ",
            documentation: "DELETE statement",
          },
          {
            label: "JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "JOIN ",
            documentation: "JOIN clause",
          },
          {
            label: "LEFT JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "LEFT JOIN ",
            documentation: "LEFT JOIN clause",
          },
          {
            label: "RIGHT JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "RIGHT JOIN ",
            documentation: "RIGHT JOIN clause",
          },
          {
            label: "INNER JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "INNER JOIN ",
            documentation: "INNER JOIN clause",
          },
          {
            label: "COUNT",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "COUNT($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "COUNT function",
          },
          {
            label: "SUM",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "SUM($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "SUM function",
          },
          {
            label: "AVG",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "AVG($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "AVG function",
          },
          {
            label: "MAX",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "MAX($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "MAX function",
          },
          {
            label: "MIN",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "MIN($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "MIN function",
          },
        ]
        return { suggestions }
      },
    })
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d] bg-[#1e1e1e]">
        <h2 className="text-lg font-semibold text-white">Code</h2>
        <div className="flex items-center gap-3">
          <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="w-20 bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-[#2d2d2d]">
              <SelectItem value="12" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                12px
              </SelectItem>
              <SelectItem value="16" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                16px
              </SelectItem>
              <SelectItem value="20" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                20px
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleBeautifyCode}
            variant="outline"
            size="sm"
            className="gap-2 bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]"
          >
            <Wand2 className="h-4 w-4" />
            Format
          </Button>
          <Button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="gap-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white border-0"
          >
            <Play className="h-4 w-4" />
            {isLoading ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-[#1e1e1e]">
        <MonacoEditor
          height="100%"
          language="sql"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
          }}
        />
      </div>

      {showResults && (
        <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-[#2d2d2d] shadow-lg max-h-80 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
            <h3 className="font-semibold text-sm text-white">Console</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResults(false)}
              className="h-6 w-6 p-0 text-[#d4d4d4] hover:text-white hover:bg-[#2d2d2d]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[#d4d4d4]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563eb]"></div>
                Running query...
              </div>
            ) : error ? (
              <div className="text-[#ef4444] font-mono text-sm">{error}</div>
            ) : results ? (
              <div className="space-y-2">
                <div className="text-sm text-[#22c55e]">
                  Query executed successfully. {results.length} row(s) returned.
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[#2d2d2d]">
                        {results.length > 0 &&
                          Object.keys(results[0]).map((key) => (
                            <th key={key} className="text-left p-2 font-semibold text-white">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={index} className="border-b border-[#2d2d2d]">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="p-2 text-[#d4d4d4]">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
