"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  body: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface CommentsProps {
  taskId?: string
  noteId?: string
}

export default function Comments({ taskId, noteId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [taskId, noteId])

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (taskId) queryParams.append("taskId", taskId)
      if (noteId) queryParams.append("noteId", noteId)

      const response = await fetch(`/api/comments?${queryParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: newComment,
          taskId,
          noteId,
        }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments()
        toast.success("Comment added")
      } else {
        toast.error("Failed to add comment")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.image || ""} />
              <AvatarFallback>{comment.author.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          {/* Current user avatar would go here ideally */}
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
        <div className="flex-1 gap-2 flex flex-col">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
