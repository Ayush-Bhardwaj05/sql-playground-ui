"use client"

interface Column {
  name: string
  type: string
  constraints: string
}

interface Table {
  name: string
  columns: Column[]
}

interface Schema {
  tables: Table[]
}

interface Question {
  id: number
  difficulty: string
  marks: number
  title: string
  description: string
  schema: Schema
  sampleData: Record<string, any[]>
  inputFormat: string
  outputFormat: string
  expectedOutput: any[]
  hint: string
}

interface QuestionPanelProps {
  question: Question
  currentQuestion: number
  totalQuestions: number
  answers: string[]
  onQuestionChange: (index: number) => void
  isTransitioning: boolean
  attempts?: number
  score?: number
}

export function QuestionPanel({
  question,
  currentQuestion,
  totalQuestions,
  answers,
  onQuestionChange,
  isTransitioning,
  attempts = 0,
  score = 0,
}: QuestionPanelProps) {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </div>
          <div className="text-[#d4d4d4] text-sm">{question.marks} marks</div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {attempts > 0 && <div className="text-yellow-400">Attempts: {attempts}</div>}
          {score > 0 && (
            <div className="text-green-400 font-semibold">
              Score: {score}/{question.marks}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-3">{question.title}</h2>
        <p className="text-[#d4d4d4] leading-relaxed mb-4">{question.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">Schema</h3>
        {question.schema.tables.map((table, tableIndex) => (
          <div key={tableIndex} className="bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] p-4">
            <h4 className="text-blue-300 font-semibold mb-3">{table.name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2d2d2d]">
                    <th className="text-left text-[#d4d4d4] py-2">Column</th>
                    <th className="text-left text-[#d4d4d4] py-2">Type</th>
                    <th className="text-left text-[#d4d4d4] py-2">Constraints</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((column, colIndex) => (
                    <tr key={colIndex} className="border-b border-[#2d2d2d]/50">
                      <td className="text-white py-2 font-mono">{column.name}</td>
                      <td className="text-[#d4d4d4] py-2 font-mono">{column.type}</td>
                      <td className="text-[#d4d4d4] py-2 font-mono text-xs">{column.constraints || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">Sample Data</h3>
        {Object.entries(question.sampleData).map(([tableName, rows]) => (
          <div key={tableName} className="bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] p-4">
            <h4 className="text-green-300 font-semibold mb-3">{tableName}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2d2d2d]">
                    {rows.length > 0 &&
                      Object.keys(rows[0]).map((key) => (
                        <th key={key} className="text-left text-[#d4d4d4] py-2 px-2">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 4).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-[#2d2d2d]/50">
                      {Object.values(row).map((value, valueIndex) => (
                        <td key={valueIndex} className="text-white py-2 px-2 font-mono text-xs">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 4 && <p className="text-[#d4d4d4] text-xs mt-2">... and {rows.length - 4} more rows</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <h3 className="text-blue-300 font-semibold mb-2">Input Format:</h3>
          <p className="text-blue-200 text-sm">{question.inputFormat}</p>
        </div>
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
          <h3 className="text-purple-300 font-semibold mb-2">Output Format:</h3>
          <p className="text-purple-200 text-sm">{question.outputFormat}</p>
        </div>
      </div>

      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
        <h3 className="text-yellow-300 font-semibold mb-2">Hint:</h3>
        <p className="text-yellow-200 text-sm">{question.hint}</p>
      </div>

      <div className="flex justify-center gap-2 pt-4">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
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
