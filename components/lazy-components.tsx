"use client"

import { lazy, Suspense } from "react"

export const LazyResultsPopup = lazy(() =>
  import("./results-popup").then((module) => ({ default: module.ResultsPopup })),
)

export const LazyQuestionPanel = lazy(() =>
  import("./question-panel").then((module) => ({ default: module.QuestionPanel })),
)

export function ComponentLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
    </div>
  )
}

export function LazyResultsPopupWrapper(props: any) {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <LazyResultsPopup {...props} />
    </Suspense>
  )
}

export function LazyQuestionPanelWrapper(props: any) {
  return (
    <Suspense fallback={<ComponentLoader className="h-full" />}>
      <LazyQuestionPanel {...props} />
    </Suspense>
  )
}
