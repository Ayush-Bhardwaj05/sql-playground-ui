"use client"

import { memo, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
    </div>
  ),
})

interface OptimizedMonacoProps {
  value: string
  onChange: (value: string | undefined) => void
  onMount?: (editor: any, monaco: any) => void
  fontSize: number
  language?: string
  theme?: string
}

export const OptimizedMonaco = memo(function OptimizedMonaco({
  value,
  onChange,
  onMount,
  fontSize,
  language = "sql",
  theme = "vs-dark",
}: OptimizedMonacoProps) {
  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: fontSize,
      lineNumbers: "on" as const,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on" as const,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      fontFamily: "GeistMono, 'Courier New', monospace",
      // Performance optimizations
      renderLineHighlight: "none" as const,
      occurrencesHighlight: false,
      renderValidationDecorations: "off" as const,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
    }),
    [fontSize],
  )

  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      monaco.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: () => {
          // Reduced set of suggestions for better performance
          const suggestions = [
            {
              label: "SELECT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "SELECT ",
            },
            {
              label: "FROM",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "FROM ",
            },
            {
              label: "WHERE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "WHERE ",
            },
            {
              label: "JOIN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "JOIN ",
            },
            {
              label: "GROUP BY",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "GROUP BY ",
            },
            {
              label: "ORDER BY",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "ORDER BY ",
            },
          ]
          return { suggestions }
        },
      })

      onMount?.(editor, monaco)
    },
    [onMount],
  )

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme={theme}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={editorOptions}
    />
  )
})
