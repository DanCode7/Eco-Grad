"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ImageIcon } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"

interface Product {
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
  status: string
  created_at: string
  updated_at: string
  seller_email: string
}

export default function BuyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const handleImageClick = () => {
    if (product?.image_url) {
      setIsImageModalOpen(true)
    }
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageModalOpen(false)
      }
    }

    if (isImageModalOpen) {
      document.addEventListener("keydown", handleEscKey)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "unset"
    }
  }, [isImageModalOpen])

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const response = await fetch('/api/posts/detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: resolvedParams.id }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load product details')
          return
        }

        setProduct(data.product)
      } catch (error) {
        setError('An error occurred while loading product details')
        console.error('Error loading product details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductDetails()
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}>
        <p className="text-green-600 text-xl">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}
      >
        <div className="text-center">
          <p className="text-gray-500 text-lg">{error || "Product not found"}</p>
          <Button onClick={() => router.push("/buy")} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
            Back to Buy
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Buy</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/buy")}
              variant="ghost"
              className="text-white hover:bg-green-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Buy
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div>
              <div
                className="border-2 border-green-600 rounded-lg h-96 flex items-center justify-center bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative"
                onClick={handleImageClick}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.item_type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-24 h-24 text-gray-400" />
                )}
                {product.status === "sold" && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                      SOLD
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-green-600 font-semibold text-lg">Item Type</Label>
                  <p className="text-xl font-bold text-gray-800 mt-1">{product.item_type}</p>
                </div>
                <Badge
                  className={`${
                    product.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                  } text-white font-bold text-lg px-4 py-2`}
                >
                  {product.status === "active" ? "Available" : "Sold"}
                </Badge>
              </div>

              <div>
                <Label className="text-green-600 font-semibold text-lg">Size</Label>
                <p className="text-xl text-gray-800 mt-1">{product.size}</p>
              </div>

              <div>
                <Label className="text-green-600 font-semibold text-lg">Condition</Label>
                <p className="text-xl text-gray-800 mt-1">{product.condition_status}</p>
              </div>

              <div>
                <Label className="text-green-600 font-semibold text-lg">Price</Label>
                <p className={`text-3xl font-bold mt-1 ${product.status === "sold" ? "text-gray-500 line-through" : "text-gray-800"}`}>
                  ${product.price}
                </p>
              </div>

              <div>
                <Label className="text-green-600 font-semibold text-lg">Seller</Label>
                <p className="text-lg text-gray-800 mt-1">{product.seller_email}</p>
              </div>

              <div>
                <Label className="text-green-600 font-semibold text-lg">Contact Info</Label>
                <div className={`border border-gray-200 rounded-lg p-4 mt-2 ${product.status === "sold" ? "bg-gray-100" : "bg-gray-50"}`}>
                  <p className={`${product.status === "sold" ? "text-gray-500" : "text-gray-800"}`}>
                    {product.status === "sold" ? "This item has been sold" : product.contact_info}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* More Info Indicator */}
          <div className="flex justify-end mt-8">
            <span className="text-green-600 font-semibold">more info</span>
          </div>
        </div>
      </main>
      {/* Image Modal */}
      {isImageModalOpen && product.image_url && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors z-10"
            >
              ✕
            </button>
            <img
              src={product.image_url}
              alt={product.item_type}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
