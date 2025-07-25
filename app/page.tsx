"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn")
    setIsLoggedIn(loginStatus === "true")
  }, [])

  const handleSellClick = () => {
    if (isLoggedIn) {
      router.push("/my-posts")
    } else {
      router.push("/auth")
    }
  }

  const handleBuyClick = () => {
    router.push("/buy")
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4 relative">
          <h1 className="text-6xl font-bold text-white text-center">EcoGrad</h1>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Main Tagline */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-green-600 font-bold mb-8">Sell or buy regalia today</h2>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-12">
            <Button
              onClick={handleSellClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-lg"
            >
              Sell
            </Button>
            <Button
              onClick={handleBuyClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-lg"
            >
              Buy
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-gray-400 my-12"></div>

          {/* Why Donate Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl text-green-600 font-bold mb-6">Why donate?</h3>
            
            {/* Mission Statement Link */}
            <div className="mb-6">
              <a 
                href="/mission-statement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg border-2 border-green-600 font-semibold transition-colors"
              >
                Mission statement
              </a>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Help fellow students save money on graduation regalia while promoting sustainability. Your gently used
              cap, gown, and stoles can make someone else's graduation day special without breaking the bank.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By participating in our marketplace, you're contributing to a circular economy that reduces waste and
              makes graduation accessible to all students.
            </p>
            
          </div>
          
          {/* Reference Section */}
          <div className="mt-12">
            {/* Divider - same as above */}
            <div className="border-t-2 border-dashed border-gray-400 mb-12"></div>
            
            <div className="text-center">
              <a 
                href="https://docs.google.com/document/d/1YADRt_5lUWG0BSegVcKdURNu2QO_iNT-6uVApA3R-BE/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
              >
                Reference
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
