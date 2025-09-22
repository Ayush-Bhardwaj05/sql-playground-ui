"use client"

import { memo } from "react"
import { CheckCircle, XCircle, AlertCircle, Clock, Trophy } from "lucide-react"
import { VirtualTable } from "./virtual-table"

interface QueryConsoleProps {
  output?: {
    isCorrect: boolean
    executionTime: number
    rowsAffected: number
    results: any[]
    error?: string
    feedback: string
    attempts: number
    score: number
    maxScore: number
    hint?: string
  }
}

export const QueryConsole = memo(function QueryConsole({ output }: QueryConsoleProps) {
  if (!output) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 p-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          <span className="text-sm font-medium text-[#d4d4d4]">Console</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-[#888] text-sm">
          Run your query to see results here...
        </div>
      </div>
    )
  }

  const { isCorrect, executionTime, rowsAffected, results, error, feedback, attempts, score, maxScore, hint } = output

  return (
    <div className="h-full flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isCorrect ? "bg-green-500" : error ? "bg-red-500" : "bg-yellow-500"}`}
          ></div>
          <span className="text-sm font-medium text-[#d4d4d4]">Console</span>
          {isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
          {error && <XCircle className="w-4 h-4 text-red-500" />}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#888]">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {executionTime}ms
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {score}/{maxScore} pts
          </div>
          <div>Attempt {attempts}</div>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-red-400 font-medium text-sm mb-1">Query Error</div>
                <div className="text-red-300 text-sm font-mono bg-red-900/20 p-2 rounded border border-red-800">
                  {error}
                </div>
              </div>
            </div>

            {hint && (
              <div className="flex items-start gap-2 mt-4">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-yellow-400 font-medium text-sm mb-1">Hint</div>
                  <div className="text-yellow-200 text-sm bg-yellow-900/20 p-2 rounded border border-yellow-800">
                    {hint}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Status Message */}
            <div className="flex items-start gap-2 mb-4">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className={`font-medium text-sm mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? "Query Executed Successfully" : "Incorrect Result"}
                </div>
                <div className="text-[#d4d4d4] text-sm">{feedback}</div>
                {!isCorrect && <div className="text-[#888] text-xs mt-1">Returned {rowsAffected} rows</div>}
              </div>
            </div>

            {/* Results Table */}
            {results && results.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-[#d4d4d4] mb-2">Query Results:</div>
                <div className="border border-[#2d2d2d] rounded-lg overflow-hidden">
                  <VirtualTable data={results} maxHeight={120} />
                </div>
              </div>
            )}

            {/* Hint for incorrect answers */}
            {!isCorrect && hint && (
              <div className="flex items-start gap-2 mt-4">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-yellow-400 font-medium text-sm mb-1">Hint</div>
                  <div className="text-yellow-200 text-sm bg-yellow-900/20 p-2 rounded border border-yellow-800">
                    {hint}
                  </div>
                </div>
              </div>
            )}

            {/* Score Information */}
            {score > 0 && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <Trophy className="w-4 h-4" />
                  Points Earned: {score}/{maxScore}
                </div>
                <div className="text-green-300 text-xs mt-1">
                  {attempts === 1 ? "Perfect! First try bonus applied." : `Completed in ${attempts} attempts.`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
