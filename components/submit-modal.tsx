"use client"

import { Button } from "@/components/ui/button"

interface SubmitModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function SubmitModal({ isOpen, onClose, onConfirm, isLoading = false }: SubmitModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] p-8 rounded-xl border border-[#2d2d2d] max-w-md w-full mx-4 animate-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-4">Submit Quiz?</h2>
        <p className="text-[#d4d4d4] mb-6">
          Are you sure you want to submit your quiz? You won't be able to make changes after submission.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="flex-1 bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d] disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Yes, Submit"}
          </Button>
        </div>
      </div>
    </div>
  )
}
