"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, LogOut, MessageCircle, Package } from "lucide-react"

interface ProfileDropdownProps {
  className?: string
}

export function ProfileDropdown({ className = "" }: ProfileDropdownProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // 로그인 상태 확인
    const loginStatus = localStorage.getItem("isLoggedIn")
    const email = localStorage.getItem("userEmail")

    if (loginStatus === "true" && email) {
      setIsLoggedIn(true)
      setUserEmail(email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setUserEmail("")
    router.push("/")
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className={`relative group ${className}`}>
      <Button variant="ghost" className="text-white hover:bg-green-700 flex items-center gap-2">
        <User className="w-4 h-4" />
        Profile
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 bg-white border-2 border-green-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 min-w-48">
        <div className="p-2">
          {/* User Email */}
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-sm text-gray-600">Signed in as:</p>
            <p className="text-sm font-semibold text-green-600 truncate">{userEmail}</p>
          </div>

          {/* My Posts */}
          <button
            onClick={() => router.push('/my-posts')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            <Package className="w-4 h-4" />
            My Posts
          </button>

          {/* Messages */}
          <button
            onClick={() => router.push('/messages')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Messages
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
