"use client"

import { useState, useEffect } from "react"
import { User, Save, X } from "lucide-react"

interface TeacherIdPopupProps {
  isOpen: boolean
  onClose: (teacherId: string) => void
}

export default function TeacherIdPopup({ isOpen, onClose }: TeacherIdPopupProps) {
  const [teacherId, setTeacherId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Load saved teacher ID from localStorage on component mount
  useEffect(() => {
    const savedTeacherId = localStorage.getItem("studentTeacherId")
    if (savedTeacherId) {
      setTeacherId(savedTeacherId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!teacherId.trim() || isNaN(Number(teacherId))) {
      alert("Please enter a valid teacher ID")
      return
    }

    setIsLoading(true)

    try {
      // Save to localStorage if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem("studentTeacherId", teacherId)
      }

      // Close popup and pass the teacher ID
      onClose(teacherId)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to validate teacher ID")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Use default teacher ID 1 and don't save to localStorage
    onClose("1")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-6 w-full max-w-md mx-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Enter Teacher ID</h2>
          </div>
          <button
            onClick={() => onClose("1")}
            className="text-[#d4d4d4] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[#d4d4d4] mb-6">
          Please enter your teacher&apos;s ID to access their tests. This helps us fetch the right content for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="teacherId" className="text-[#d4d4d4] text-sm font-medium block">
              Teacher ID *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input
                id="teacherId"
                type="number"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Enter teacher ID"
                className="w-full bg-[#0f0f0f] border border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-blue-500 transition-colors pl-10 pr-4 py-2 rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-[#0f0f0f] border border-[#2d2d2d] rounded focus:ring-blue-500 focus:ring-offset-[#0f0f0f]"
            />
            <label htmlFor="rememberMe" className="text-sm text-[#d4d4d4]">
              Remember my teacher ID
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 border border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d] transition-colors py-2 px-4 rounded-md"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isLoading || !teacherId.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white transition-colors py-2 px-4 rounded-md flex items-center justify-center"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save & Continue
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#888] text-center">
            You can change this later in settings
          </p>
        </form>
      </div>
    </div>
  )
}