"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function CreatePostPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    size: "",
    condition: "",
    price: "",
    contactInfo: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string
        setFormData((prev) => ({ ...prev, image: imageDataUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 필수 필드 검증
      if (!formData.title || !formData.size || !formData.condition || !formData.price || !formData.contactInfo) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      // 가격 검증
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        setError("Please enter a valid price")
        setIsLoading(false)
        return
      }

      // 로그인 사용자 확인
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        setError("Please log in to create a post")
        router.push("/auth")
        return
      }

      // 데이터베이스에 게시물 생성
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          title: formData.title,
          item_type: formData.title,
          size: formData.size,
          condition_status: formData.condition,
          price: price,
          contact_info: formData.contactInfo,
          image_url: formData.image || null,
          image_path: null,
          image_filename: null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create post')
        setIsLoading(false)
        return
      }

      // 성공 시 My Posts 페이지로 리다이렉트
      router.push("/my-posts")
      
    } catch (error) {
      setError('An error occurred while creating the post')
      console.error('Error creating post:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Sell</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">create page</span>
            <Button
              onClick={() => router.push("/my-posts")}
              variant="ghost"
              className="text-white hover:bg-green-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div>
              <Label className="text-green-600 font-semibold mb-4 block">Product Image</Label>
              <div className="border-2 border-dashed border-green-600 rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-green-600 mb-4" />
                    <p className="text-green-600 font-semibold">Click to upload image</p>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              {formData.image && (
                <Button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                  variant="outline"
                  className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-50"
                  disabled={isLoading}
                >
                  Remove Image
                </Button>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-green-600 font-semibold">
                  Title
                </Label>
                <Select
                  value={formData.title}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gown">Gown</SelectItem>
                    <SelectItem value="Cap">Cap</SelectItem>
                    <SelectItem value="Stole">Stole</SelectItem>
                    <SelectItem value="Set">Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size" className="text-green-600 font-semibold">
                  Size
                </Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, size: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition" className="text-green-600 font-semibold">
                  Condition
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Worn">Worn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className="text-green-600 font-semibold">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price in dollars"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="border-green-600 focus:border-green-700"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="contactInfo" className="text-green-600 font-semibold">
                  Contact Info
                </Label>
                <Textarea
                  id="contactInfo"
                  placeholder="Enter your contact information or preferred method of contact"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                  className="border-green-600 focus:border-green-700 min-h-[100px]"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Post...' : 'POST'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}