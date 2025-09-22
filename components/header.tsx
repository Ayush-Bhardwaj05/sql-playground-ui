"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#2d2d2d] shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SQL</span>
          </div>
          <span className="font-semibold text-xl">
            
            <span className="text-white"> Playground</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-[#d4d4d4] hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-[#d4d4d4] hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-[#d4d4d4] hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
