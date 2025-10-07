"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Wand2 } from "lucide-react"
import { OptimizedMonaco } from "./optimized-monaco"

interface SQLPlaygroundProps {
  starterCode: string
  onCodeChange?: (code: string) => void
  onRunQuery?: (query: string) => void
  showConsole?: boolean
}

export const SQLPlayground = memo(function SQLPlayground({
  starterCode,
  onCodeChange,
  onRunQuery,
  showConsole = true,
}: SQLPlaygroundProps) {
  const [code, setCode] = useState(starterCode)
  const [isLoading, setIsLoading] = useState(false)
  const [fontSize, setFontSize] = useState("16")
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCode(starterCode)
  }, [starterCode])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || ""
      setCode(newCode)

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set new timeout for debounced callback
      debounceTimeoutRef.current = setTimeout(() => {
        onCodeChange?.(newCode)
      }, 300)
    },
    [onCodeChange],
  )

  const handleRunQuery = useCallback(async () => {
    if (!onRunQuery) return

    setIsLoading(true)
    try {
      onRunQuery(code)
    } finally {
      // Reset loading state after a shorter delay
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }, [onRunQuery, code])

  const handleFontSizeChange = useCallback((value: string) => {
    setFontSize(value)
  }, [])

  const handleBeautifyCode = useCallback(() => {
    const beautified = code
      .replace(/\s+/g, " ")
      .replace(/\bSELECT\b/gi, "\nSELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bJOIN\b/gi, "\nJOIN")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bHAVING\b/gi, "\nHAVING")
      .replace(/\bLIMIT\b/gi, "\nLIMIT")
      .trim()

    setCode(beautified)
    onCodeChange?.(beautified)
  }, [code, onCodeChange])

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d] bg-[#1e1e1e]">
        <h2 className="text-lg font-semibold text-white">SQL Editor</h2>
        <div className="flex items-center gap-3">
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="w-24 bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-[#2d2d2d]">
              <SelectItem value="12" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                Small
              </SelectItem>
              <SelectItem value="16" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                Medium
              </SelectItem>
              <SelectItem value="20" className="text-[#d4d4d4] hover:bg-[#3d3d3d]">
                Large
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
            disabled={isLoading || !onRunQuery}
            className="gap-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white transition-all duration-200"
          >
            <Play className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`} />
            {isLoading ? "Running..." : "Run Query"}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-[#1e1e1e] min-h-0">
        <OptimizedMonaco
          value={code}
          onChange={handleCodeChange}
          fontSize={Number.parseInt(fontSize)}
          theme="vs-dark"
        />
      </div>
    </div>
  )
})