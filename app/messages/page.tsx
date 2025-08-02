"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { MessageDialog } from "@/components/message-dialog"
import { ImageIcon, MessageCircle, ArrowLeft } from "lucide-react"

interface Conversation {
  post_id: number
  post_title: string
  price: number
  image_url?: string
  other_user_id: number
  other_username: string
  last_message: string
  last_message_time: string
  unread_count: number
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/auth')
      return
    }

    loadCurrentUser()
  }, [router])

  useEffect(() => {
    if (currentUserId) {
      loadConversations()
      const interval = setInterval(loadConversations, 10000) // Refresh every 10 seconds
      return () => clearInterval(interval)
    }
  }, [currentUserId])

  const loadCurrentUser = async () => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      try {
        const response = await fetch('/api/auth/current-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: userEmail }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setCurrentUserId(data.userId)
        }
      } catch (error) {
        console.error('Error loading current user:', error)
      }
    }
  }

  const loadConversations = async () => {
    if (!currentUserId) return

    try {
      const response = await fetch(`/api/messages/conversations?userId=${currentUserId}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowDialog(true)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold">My Messages</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-green-600 text-lg">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No messages yet</p>
            <p className="text-gray-400 mt-2">Start a conversation by messaging a seller!</p>
            <Button
              onClick={() => router.push('/buy')}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Browse Items
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {conversations.map((conversation) => (
              <div
                key={`${conversation.post_id}-${conversation.other_user_id}`}
                onClick={() => openConversation(conversation)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {conversation.image_url ? (
                      <img
                        src={conversation.image_url}
                        alt={conversation.post_title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-green-600">
                          {conversation.other_username}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {conversation.post_title} - ${conversation.price}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm truncate">
                      {conversation.last_message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.last_message_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Message Dialog */}
      {selectedConversation && currentUserId && (
        <MessageDialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false)
            loadConversations() // Refresh to update unread counts
          }}
          currentUserId={currentUserId}
          otherUserId={selectedConversation.other_user_id}
          otherUsername={selectedConversation.other_username}
          postId={selectedConversation.post_id}
          postTitle={selectedConversation.post_title}
        />
      )}
    </div>
  )
}