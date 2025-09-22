import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProblemPanel } from "@/components/problem-panel"
import { SQLPlayground } from "@/components/sql-playground"
import { ArrowLeft } from "lucide-react"
import questionData from "@/data/question.json"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

export default function StudentTest() {
  return (
    <div className="h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/student">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">SQL Test</h1>
            <p className="text-sm text-[#d4d4d4]">Practice SQL queries with interactive problems</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 py-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto bg-[#1e1e1e] rounded-lg mr-2 shadow-lg">
              <ProblemPanel question={questionData} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-[#2d2d2d] hover:bg-[#3d3d3d]" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full bg-[#1e1e1e] rounded-lg ml-2 overflow-hidden shadow-lg">
              <SQLPlayground starterCode={questionData.starterCode} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
