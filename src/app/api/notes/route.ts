import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  projectId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const workspaceId = searchParams.get("workspaceId")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (projectId) where.projectId = projectId
    if (workspaceId) where.project = { workspaceId }

    const notes = await db.note.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Get notes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createNoteSchema.parse(body)

    const note = await db.note.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        projectId: validatedData.projectId,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error("Create note error:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}
