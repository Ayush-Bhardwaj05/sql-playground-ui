"use client"

import { useEffect, useState } from "react"

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    memory: 0,
    renderTime: 0,
    componentCount: 0,
  })

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return

    const updateMetrics = () => {
      const memory = (performance as any).memory?.usedJSHeapSize || 0
      const renderStart = performance.now()

      requestAnimationFrame(() => {
        const renderTime = performance.now() - renderStart
        setMetrics((prev) => ({
          ...prev,
          memory: Math.round(memory / 1024 / 1024),
          renderTime: Math.round(renderTime * 100) / 100,
        }))
      })
    }

    const interval = setInterval(updateMetrics, 2000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded border border-gray-600 font-mono">
      <div>Memory: {metrics.memory}MB</div>
      <div>Render: {metrics.renderTime}ms</div>
    </div>
  )
}
