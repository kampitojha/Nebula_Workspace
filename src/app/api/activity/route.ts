import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let whereClause: any = {}

    if (workspaceId) {
      // Check access to specific workspace
      const member = await db.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: session.user.id,
        },
      })

      if (!member) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
      whereClause = { workspaceId }
    } else {
      // Get all workspaces for user
      const memberships = await db.workspaceMember.findMany({
        where: { userId: session.user.id },
        select: { workspaceId: true },
      })
      const workspaceIds = memberships.map((m) => m.workspaceId)
      whereClause = { workspaceId: { in: workspaceIds } }
    }

    const activities = await db.activityLog.findMany({
      where: whereClause,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Get activity log error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity log" },
      { status: 500 }
    )
  }
}
