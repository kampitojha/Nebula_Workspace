import { db } from "@/lib/db"

export async function logActivity(
  workspaceId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: any
) {
  try {
    await db.activityLog.create({
      data: {
        workspaceId,
        userId,
        action,
        entityType,
        entityId,
        metadata: metadata || {},
      },
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
    // Don't throw error to prevent blocking main action
  }
}
