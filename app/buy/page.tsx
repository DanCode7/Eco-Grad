"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
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

export default function BuyPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // 모든 활성 게시물 로드
  useEffect(() => {
    const loadActivePosts = async () => {
      try {
        const response = await fetch('/api/posts/all-active')
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load posts')
          return
        }

        setProducts(data.posts)
      } catch (error) {
        setError('An error occurred while loading posts')
        console.error('Error loading posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivePosts()
  }, [])

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    regalia: [] as string[],
    condition: "",
    sizes: [] as string[],
    sortOrder: "",
  })

  const handleRegaliaChange = (type: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({ ...prev, regalia: [...prev.regalia, type] }))
    } else {
      setFilters((prev) => ({ ...prev, regalia: prev.regalia.filter((r) => r !== type) }))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({ ...prev, sizes: [...prev.sizes, size] }))
    } else {
      setFilters((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== size) }))
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Price range filter
      const minPrice = filters.minPrice ? Number.parseFloat(filters.minPrice) : 0
      const maxPrice = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : Number.POSITIVE_INFINITY
      if (product.price < minPrice || product.price > maxPrice) {
        return false
      }

      // Regalia filter - item_type을 사용
      if (filters.regalia.length > 0 && !filters.regalia.includes(product.item_type + "s")) {
        return false
      }

      // Condition filter - condition_status를 사용
      if (filters.condition && product.condition_status !== filters.condition) {
        return false
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (filters.sortOrder === "price-low") {
        return a.price - b.price
      } else if (filters.sortOrder === "price-high") {
        return b.price - a.price
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Comic Neue, Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Buy</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white hover:bg-green-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="border-2 border-green-600 rounded-lg mb-8">
          <div className="grid grid-cols-5 divide-x-2 divide-green-600">
            {/* Price Range */}
            <div className="relative group">
              <div className="p-4 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
                <Label className="text-green-600 font-semibold">Price Range</Label>
              </div>
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-600 border-t-0 rounded-b-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min price ($)"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                    className="border-green-600 focus:border-green-700 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max price ($)"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    className="border-green-600 focus:border-green-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Regalia */}
            <div className="relative group">
              <div className="p-4 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
                <Label className="text-green-600 font-semibold">Regalia</Label>
              </div>
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-600 border-t-0 rounded-b-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="space-y-2">
                  {["Gowns", "Caps", "Stoles", "Sets"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`regalia-${type}`}
                        checked={filters.regalia.includes(type)}
                        onCheckedChange={(checked) => handleRegaliaChange(type, checked as boolean)}
                        className="border-green-600"
                      />
                      <Label htmlFor={`regalia-${type}`} className="text-sm text-green-600">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div className="relative group">
              <div className="p-4 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
                <Label className="text-green-600 font-semibold">Sort Order</Label>
              </div>
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-600 border-t-0 rounded-b-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="space-y-2">
                  {[
                    { value: "price-low", label: "Low to High" },
                    { value: "price-high", label: "High to Low" },
                    { value: "newest", label: "Newest First" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`sort-${option.value}`}
                        name="sortOrder"
                        value={option.value}
                        checked={filters.sortOrder === option.value}
                        onChange={(e) => setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))}
                        className="text-green-600"
                      />
                      <Label htmlFor={`sort-${option.value}`} className="text-sm text-green-600">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="relative group">
              <div className="p-4 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
                <Label className="text-green-600 font-semibold">Condition</Label>
              </div>
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-600 border-t-0 rounded-b-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="space-y-2">
                  {["New", "Like New", "Worn"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`condition-${condition}`}
                        name="condition"
                        value={condition}
                        checked={filters.condition === condition}
                        onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value }))}
                        className="text-green-600"
                      />
                      <Label htmlFor={`condition-${condition}`} className="text-sm text-green-600">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="relative group">
              <div className="p-4 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
                <Label className="text-green-600 font-semibold">Size</Label>
              </div>
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-600 border-t-0 rounded-b-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="space-y-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.sizes.includes(size)}
                        onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                        className="border-green-600"
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm text-green-600">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-green-600 text-xl">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`border-2 border-green-600 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative ${
                product.status === "sold" ? "opacity-75" : ""
              }`}
              onClick={() => router.push(`/buy/${product.id}`)}
            >
              {/* Title and Status Badge */}
              <div className="p-3 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-600">{product.title}</h3>
                <Badge
                  className={`${
                    product.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                  } text-white font-bold`}
                >
                  {product.status === "active" ? "Available" : "Sold"}
                </Badge>
              </div>

              {/* Image Placeholder */}
              <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                {product.status === "sold" && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                      SOLD
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className={`text-2xl font-bold ${product.status === "sold" ? "text-gray-500" : "text-gray-800"}`}>
                  ${product.price}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {product.item_type} • {product.size} • {product.condition_status}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Seller: {product.seller_email}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
