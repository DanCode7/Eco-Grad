"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"

interface Post {
  id: number
  title: string
  item_type: string
  size: string
  condition_status: string
  price: number
  contact_info: string
  image_path?: string
  image_filename?: string
  image_url?: string
  status: "active" | "sold"
  created_at: string
  updated_at: string
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [formData, setFormData] = useState({
    title: "",
    size: "",
    condition: "",
    price: "",
    contactInfo: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // 게시물 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        
        if (!userEmail) {
          router.push("/auth")
          return
        }

        const response = await fetch('/api/posts/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userEmail, 
            postId: resolvedParams.id 
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load post')
          return
        }

        const post = data.post
        setFormData({
          title: post.item_type,
          size: post.size,
          condition: post.condition_status,
          price: post.price.toString(),
          contactInfo: post.contact_info,
          image: post.image_url || "",
        })
      } catch (error) {
        setError('An error occurred while loading post')
        console.error('Error loading post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [resolvedParams.id, router])

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

    try {
      // 필수 필드 검증
      if (!formData.title || !formData.size || !formData.condition || !formData.price || !formData.contactInfo) {
        setError("All fields are required")
        return
      }

      // 가격 검증
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        setError("Please enter a valid price")
        return
      }

      // 로그인 사용자 확인
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        setError("Please log in to edit a post")
        router.push("/auth")
        return
      }

      // 게시물 업데이트
      const response = await fetch('/api/posts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          postId: resolvedParams.id,
          title: formData.title,
          item_type: formData.title,
          size: formData.size,
          condition_status: formData.condition,
          price: price,
          contact_info: formData.contactInfo,
          image_url: formData.image || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update post')
        return
      }

      // 성공 시 My Posts 페이지로 리다이렉트
      router.push("/my-posts")
      
    } catch (error) {
      setError('An error occurred while updating the post')
      console.error('Error updating post:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
        <p className="text-green-600 text-xl">Loading post...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Sell</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">edit page</span>
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
                    <p className="text-green-600 font-semibold">Click to change image</p>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {formData.image && (
                <Button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                  variant="outline"
                  className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-50"
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
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue />
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
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue />
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
                >
                  <SelectTrigger className="border-green-600 focus:border-green-700">
                    <SelectValue />
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
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="border-green-600 focus:border-green-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactInfo" className="text-green-600 font-semibold">
                  Contact Info
                </Label>
                <Textarea
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                  className="border-green-600 focus:border-green-700 min-h-[100px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
              >
                SAVE
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
