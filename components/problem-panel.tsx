import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Problem Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{question.title}</CardTitle>
            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{question.description}</p>
        </CardContent>
      </Card>

      {/* Schema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.schema.map((table, index) => (
              <div key={index} className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">{table.table}</h4>
                <div className="space-y-1">
                  {table.cols.map((col, colIndex) => (
                    <div key={colIndex} className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(question.sampleData).map(([tableName, data]) => (
              <div key={tableName}>
                <h4 className="font-semibold mb-2">{tableName}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        {data.length > 0 &&
                          Object.keys(data[0]).map((key) => (
                            <th key={key} className="border border-border px-3 py-2 text-left font-semibold">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="border border-border px-3 py-2">
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
        </CardContent>
      </Card>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {question.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <h5 className="font-semibold text-sm">Input:</h5>
                  <p className="text-sm text-muted-foreground">{example.input}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-sm">Output:</h5>
                  <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(example.output, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
