import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
  taskId: z.string().optional(),
  noteId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createCommentSchema.parse(body)

    if (!validatedData.taskId && !validatedData.noteId) {
      return NextResponse.json(
        { error: "Either taskId or noteId is required" },
        { status: 400 }
      )
    }

    const comment = await db.comment.create({
      data: {
        body: validatedData.body,
        taskId: validatedData.taskId,
        noteId: validatedData.noteId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("taskId")
    const noteId = searchParams.get("noteId")

    const where: any = {}
    if (taskId) where.taskId = taskId
    if (noteId) where.noteId = noteId

    const comments = await db.comment.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
