"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StudentFormProps {
  onSubmit: (name: string, usn: string) => void
  isLoading?: boolean
}

export function StudentForm({ onSubmit, isLoading = false }: StudentFormProps) {
  const [name, setName] = useState("")
  const [usn, setUsn] = useState("")
  const [errors, setErrors] = useState({ name: "", usn: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = { name: "", usn: "" }

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!usn.trim()) {
      newErrors.usn = "USN is required"
    }

    setErrors(newErrors)

    if (!newErrors.name && !newErrors.usn) {
      onSubmit(name.toUpperCase(), usn.toUpperCase())
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase())
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
  }

  const handleUsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsn(e.target.value.toUpperCase())
    if (errors.usn) setErrors((prev) => ({ ...prev, usn: "" }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="ENTER YOUR FULL NAME"
          disabled={isLoading}
          className="bg-[#0f0f0f] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-[#2563eb] transition-colors disabled:opacity-50"
        />
        {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="usn" className="text-white">
          USN (University Seat Number)
        </Label>
        <Input
          id="usn"
          type="text"
          value={usn}
          onChange={handleUsnChange}
          placeholder="ENTER YOUR USN"
          disabled={isLoading}
          className="bg-[#0f0f0f] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-[#2563eb] transition-colors disabled:opacity-50"
        />
        {errors.usn && <p className="text-red-400 text-sm">{errors.usn}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#2563eb] hover:bg-[#3b82f6] text-white py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? "Starting..." : "Start Quiz"}
      </Button>
    </form>
  )
}
