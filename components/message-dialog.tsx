"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"

interface Message {
  id: number
  sender_id: number
  receiver_id: number
  message: string
  is_read: boolean
  created_at: string
  sender_username: string
}

interface MessageDialogProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: number
  otherUserId: number
  otherUsername: string
  postId: number
  postTitle: string
}

export function MessageDialog({
  isOpen,
  onClose,
  currentUserId,
  otherUserId,
  otherUsername,
  postId,
  postTitle,
}: MessageDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadMessages()
      const interval = setInterval(loadMessages, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen, currentUserId, otherUserId, postId])

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages/thread?userId=${currentUserId}&otherUserId=${otherUserId}&postId=${postId}`
      )
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: otherUserId,
          postId: postId,
          message: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        loadMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-green-600">Chat with {otherUsername}</h3>
            <p className="text-sm text-gray-600">About: {postTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === currentUserId
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === currentUserId
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              disabled={sending}
            />
            <Button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}