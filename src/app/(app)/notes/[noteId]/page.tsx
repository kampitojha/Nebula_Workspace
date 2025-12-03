"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { toast } from "sonner"
import Editor from "@/components/ui/editor"
import Comments from "@/components/ui/comments"
import { format } from "date-fns"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  createdBy: {
    name: string | null
    image: string | null
  }
  project: {
    id: string
    name: string
  }
}

export default function NoteDetailPage() {
  const params = useParams()
  const noteId = params.noteId as string
  
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNote()
  }, [noteId])

  const fetchNote = async () => {
    try {
      // Note: We need a specific API route for fetching a single note or update existing one
      // For now, let's assume we can fetch it via the list endpoint with filtering or add a new endpoint
      // Actually, I should create [noteId]/route.ts. Let's assume it exists or I'll create it next.
      // Wait, I haven't created [noteId]/route.ts yet. I should do that.
      // But for now, let's implement the UI assuming the endpoint will be there.
      const response = await fetch(`/api/notes/${noteId}`)
      if (response.ok) {
        const data = await response.json()
        setNote(data.note)
      } else {
        toast.error("Failed to load note")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading note...</p>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground mb-4">Note not found</p>
        <Link href="/notes">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/notes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{note.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {note.createdBy.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(note.createdAt), "PPP")}
            </div>
            <div className="px-2 py-0.5 bg-secondary rounded-full text-xs">
              {note.project.name}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 min-h-[400px]">
        <Editor content={note.content} onChange={() => {}} editable={false} />
      </div>

      <div className="border-t pt-8">
        <Comments noteId={note.id} />
      </div>
    </div>
  )
}
