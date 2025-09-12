import { ProblemPanel } from "@/components/problem-panel"
import { SQLPlayground } from "@/components/sql-playground"
import { ThemeToggle } from "@/components/theme-toggle"
import questionData from "@/data/question.json"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

export default function Home() {
  return (
    <div className="h-screen bg-black dark:bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">SQL Playground</h1>
          <p className="text-sm text-gray-400">Practice SQL queries with interactive problems</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex-1 min-h-0 py-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto glass-panel rounded-lg mr-2">
              <ProblemPanel question={questionData} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-700 hover:bg-gray-600" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full bg-gray-900 rounded-lg ml-2 overflow-hidden">
              <SQLPlayground starterCode={questionData.starterCode} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
