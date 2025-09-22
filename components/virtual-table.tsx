"use client"

import { memo, useMemo } from "react"

interface VirtualTableProps {
  data: any[]
  columns: string[]
  maxRows?: number
  className?: string
}

export const VirtualTable = memo(function VirtualTable({
  data,
  columns,
  maxRows = 100,
  className = "",
}: VirtualTableProps) {
  const displayData = useMemo(() => {
    return data.slice(0, maxRows)
  }, [data, maxRows])

  const hasMoreRows = data.length > maxRows

  if (!displayData.length) {
    return <div className={`text-center text-[#d4d4d4] py-8 ${className}`}>No data available</div>
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2d2d2d] bg-[#1a1a1a]">
            {columns.map((column) => (
              <th key={column} className="text-left text-[#d4d4d4] py-3 px-4 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#2d2d2d]/50 hover:bg-[#1a1a1a]/50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="text-white py-3 px-4 font-mono">
                  {String(row[column] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasMoreRows && (
        <div className="text-center text-[#d4d4d4] text-xs py-2 bg-[#1a1a1a]/50">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  )
})
