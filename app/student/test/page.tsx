"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentTest() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to tests page
    router.push("/student/tests")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
        <p className="text-[#d4d4d4]">Redirecting to tests...</p>
      </div>
    </div>
  )
}
