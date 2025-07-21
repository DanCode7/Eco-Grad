"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [createForm, setCreateForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [createError, setCreateError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize database on component mount
  useEffect(() => {
    fetch('/api/init-db')
      .then(res => res.json())
      .catch(err => console.error('Failed to initialize database:', err))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoginError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // Set login status and user email
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", loginForm.username)
      router.push("/my-posts")
    } catch (error) {
      setLoginError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: createForm.username,
          password: createForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCreateError(data.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      // Set login status and user email
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", createForm.username)
      router.push("/my-posts")
    } catch (error) {
      setCreateError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Sell</h1>
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-white hover:bg-green-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Login Form */}
          <div className="border-2 border-green-600 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-username" className="text-green-600 font-semibold">
                  Username
                </Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="border-green-600 focus:border-green-700"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="login-password" className="text-green-600 font-semibold">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="border-green-600 focus:border-green-700"
                  required
                  disabled={isLoading}
                />
              </div>
              {loginError && (
                <p className="text-red-600 text-sm">{loginError}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
              <p className="text-sm text-gray-600 mt-4">Login with your existing account</p>
            </form>
          </div>

          {/* Create Account Form */}
          <div className="border-2 border-green-600 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Create Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <Label htmlFor="create-username" className="text-green-600 font-semibold">
                  Username
                </Label>
                <Input
                  id="create-username"
                  type="text"
                  placeholder="Enter your username"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  className="border-green-600 focus:border-green-700"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="create-password" className="text-green-600 font-semibold">
                  Password
                </Label>
                <Input
                  id="create-password"
                  type="password"
                  placeholder="Must contain numbers and letters"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="border-green-600 focus:border-green-700"
                  required
                  disabled={isLoading}
                />
              </div>
              {createError && (
                <p className="text-red-600 text-sm">{createError}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Create Account'}
              </Button>
              <p className="text-sm text-gray-600 mt-4">Password must contain both numbers and letters</p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}