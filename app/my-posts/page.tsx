"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, ImageIcon } from "lucide-react"
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

export default function MyPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // 사용자의 게시물 로드
  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        
        if (!userEmail) {
          router.push("/auth")
          return
        }

        const response = await fetch('/api/posts/my-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load posts')
          return
        }

        setPosts(data.posts)
      } catch (error) {
        setError('An error occurred while loading posts')
        console.error('Error loading posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserPosts()
  }, [router])

  // 게시물 상태 변경 (active/sold)
  const togglePostStatus = async (postId: number, currentStatus: string) => {
    try {
      const userEmail = localStorage.getItem("userEmail")
      const newStatus = currentStatus === "active" ? "sold" : "active"

      const response = await fetch('/api/posts/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          postId,
          status: newStatus
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to update post status')
        return
      }

      // UI 업데이트
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, status: newStatus as "active" | "sold" }
            : post
        )
      )

    } catch (error) {
      alert('An error occurred while updating post status')
      console.error('Error updating post status:', error)
    }
  }

  // 게시물 삭제
  const deletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const userEmail = localStorage.getItem("userEmail")

      const response = await fetch('/api/posts/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          postId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to delete post')
        return
      }

      // UI에서 게시물 제거
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

    } catch (error) {
      alert('An error occurred while deleting post')
      console.error('Error deleting post:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
        <p className="text-green-600 text-xl">Loading your posts...</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-600 border-b-2 border-green-600 pb-2 inline-block">
              MY POSTS
            </h2>
            <p className="text-gray-600 mt-2">Shows all your listings</p>
          </div>
          <Button
            onClick={() => router.push("/create-post")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3"
          >
            Create post
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-2 border-green-600 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* Title and Status Badge */}
              <div className="p-3 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-600">{post.title}</h3>
                <Badge
                  className={`${
                    post.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                  } text-white font-bold`}
                >
                  {post.status === "active" ? "Active" : "Sold"}
                </Badge>
              </div>

              {/* Image Placeholder */}
              <div className="bg-gray-200 h-48 flex items-center justify-center relative overflow-hidden">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    onClick={() => router.push(`/edit-post/${post.id}`)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => togglePostStatus(post.id, post.status)}
                    size="sm"
                    className={`${
                      post.status === "active" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {post.status === "active" ? "Mark Sold" : "Mark Active"}
                  </Button>
                  <Button
                    onClick={() => deletePost(post.id)}
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Post Info */}
              <div className="p-4">
                <p className="text-2xl font-bold text-gray-800">${post.price}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {post.item_type} • {post.size} • {post.condition_status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet. Create your first listing!</p>
          </div>
        )}
      </main>
    </div>
  )
}