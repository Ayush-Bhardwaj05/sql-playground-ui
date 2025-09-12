import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  title: string
  difficulty: string
  description: string
  schema: Array<{
    table: string
    cols: string[]
  }>
  sampleData: Record<string, any[]>
  examples: Array<{
    input: string
    output: any[]
  }>
}

interface ProblemPanelProps {
  question: Question
}

export function ProblemPanel({ question }: ProblemPanelProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-600 text-white border border-green-500"
      case "medium":
        return "bg-yellow-600 text-white border border-yellow-500"
      case "hard":
        return "bg-red-600 text-white border border-red-500"
      default:
        return "bg-gray-600 text-white border border-gray-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Problem Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{question.title}</h1>
          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
        </div>
        <p className="text-[#d4d4d4] leading-relaxed">{question.description}</p>
      </div>

      {/* Schema */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Schema</h2>
        <div className="space-y-3">
          {question.schema.map((table, index) => (
            <div key={index} className="border border-[#2d2d2d] rounded-lg p-4 bg-black/20">
              <h4 className="font-semibold mb-3 text-white">{table.table}</h4>
              <div className="space-y-2">
                {table.cols.map((col, colIndex) => (
                  <div key={colIndex} className="text-sm font-mono bg-[#2d2d2d] text-[#d4d4d4] px-3 py-2 rounded">
                    {col}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Data */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Sample Data</h2>
        <div className="space-y-4">
          {Object.entries(question.sampleData).map(([tableName, data]) => (
            <div key={tableName}>
              <h4 className="font-semibold mb-3 text-white">{tableName}</h4>
              <div className="overflow-x-auto border border-[#2d2d2d] rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#2d2d2d]">
                      {data.length > 0 &&
                        Object.keys(data[0]).map((key) => (
                          <th
                            key={key}
                            className="border-r border-[#2d2d2d] px-4 py-3 text-left font-semibold text-white"
                          >
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className="border-t border-[#2d2d2d]">
                        {Object.values(row).map((value, valueIndex) => (
                          <td key={valueIndex} className="border-r border-[#2d2d2d] px-4 py-3 text-[#d4d4d4]">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Examples</h2>
        <div className="space-y-6">
          {question.examples.map((example, index) => (
            <div key={index} className="space-y-3">
              <div>
                <h5 className="font-semibold text-sm text-white mb-2">Input:</h5>
                <p className="text-sm text-[#d4d4d4]">{example.input}</p>
              </div>
              <div>
                <h5 className="font-semibold text-sm text-white mb-2">Output:</h5>
                <pre className="text-sm bg-[#2d2d2d] text-[#d4d4d4] p-3 rounded overflow-x-auto">
                  {JSON.stringify(example.output, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
