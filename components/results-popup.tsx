"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Target, Lightbulb } from "lucide-react"

interface QueryResults {
  success: boolean
  results: any[] | null
  error: string | null
  executionTime: number
  isCorrect?: boolean
  feedback?: string
  attempts?: number
  score?: number
  maxScore?: number
  hint?: string
}

interface ResultsPopupProps {
  results: QueryResults
  onClose: () => void
}

export function ResultsPopup({ results, onClose }: ResultsPopupProps) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-400"
    if (percentage >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-t-xl border border-[#2d2d2d] border-b-0 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-500 ease-out">
        <div className={`p-6 border-b border-[#2d2d2d] ${results.isCorrect ? "bg-green-900/20" : "bg-red-900/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {results.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <h2 className={`text-xl font-bold ${results.isCorrect ? "text-green-300" : "text-red-300"}`}>
                {results.isCorrect ? "Correct Answer!" : results.success ? "Query Executed" : "Query Failed"}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {results.attempts && (
                <div className="flex items-center gap-2 text-[#d4d4d4]">
                  <Target className="w-4 h-4" />
                  <span>Attempt {results.attempts}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#d4d4d4]">
                <Clock className="w-4 h-4" />
                <span>{results.executionTime.toFixed(1)}ms</span>
              </div>
            </div>
          </div>

          {results.score !== undefined && results.maxScore && (
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[#d4d4d4]">Question Score:</span>
                <span className={`font-bold text-lg ${getScoreColor(results.score, results.maxScore)}`}>
                  {results.score}/{results.maxScore} points
                </span>
              </div>
              {results.attempts && results.attempts > 1 && (
                <div className="text-xs text-yellow-400 mt-1">Score reduced due to multiple attempts</div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {results.feedback && (
            <div
              className={`p-4 rounded-lg border mb-4 ${
                results.isCorrect ? "bg-green-900/20 border-green-800/30" : "bg-yellow-900/20 border-yellow-800/30"
              }`}
            >
              <p className={`font-semibold ${results.isCorrect ? "text-green-300" : "text-yellow-300"}`}>
                {results.isCorrect ? "✓ " : "⚠ "}Feedback
              </p>
              <p className={`text-sm mt-1 ${results.isCorrect ? "text-green-200" : "text-yellow-200"}`}>
                {results.feedback}
              </p>
            </div>
          )}

          {!results.isCorrect && results.hint && (
            <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/30 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-300" />
                <p className="text-blue-300 font-semibold">Hint</p>
              </div>
              <p className="text-blue-200 text-sm">{results.hint}</p>
            </div>
          )}

          {results.success && results.results ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-3">Query Results ({results.results.length} rows)</h3>
                <div className="bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2d2d2d] bg-[#1a1a1a]">
                          {results.results.length > 0 &&
                            Object.keys(results.results[0]).map((key) => (
                              <th key={key} className="text-left text-[#d4d4d4] py-3 px-4 font-semibold">
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.results.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-[#2d2d2d]/50 hover:bg-[#1a1a1a]/50">
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="text-white py-3 px-4 font-mono">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            results.error && (
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                  <p className="text-red-300 font-semibold">✗ Query Error</p>
                  <p className="text-red-200 text-sm mt-1">{results.error}</p>
                </div>

                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
                  <h3 className="text-yellow-300 font-semibold mb-2">Suggestions:</h3>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Check your SQL syntax</li>
                    <li>• Verify table and column names</li>
                    <li>• Review the question requirements</li>
                    <li>• Use the provided hint for guidance</li>
                  </ul>
                </div>
              </div>
            )
          )}
        </div>

        <div className="p-6 border-t border-[#2d2d2d] flex justify-end">
          <Button onClick={onClose} className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-6">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
