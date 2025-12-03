import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workspaces = await db.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: {
        workspace: true,
      },
    })

    return NextResponse.json({
      workspaces: workspaces.map((wm) => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        slug: wm.workspace.slug,
        role: wm.role,
      })),
    })
  } catch (error) {
    console.error("Get workspaces error:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
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
    const validatedData = createWorkspaceSchema.parse(body)

    // Create workspace
    const workspace = await db.workspace.create({
      data: {
        name: validatedData.name,
        slug: `${validatedData.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
    })

    // Add creator as owner
    await db.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    })

    return NextResponse.json(
      { workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create workspace error:", error)
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    )
  }
}
