"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Activity as ActivityIcon } from "lucide-react"

interface Activity {
  id: string
  action: string
  entityType: string
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

interface ActivityFeedProps {
  workspaceId?: string
}

export default function ActivityFeed({ workspaceId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (workspaceId) {
      fetchActivities()
    }
  }, [workspaceId])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity?workspaceId=${workspaceId}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      console.error("Failed to load activities")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading activity...</div>
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ActivityIcon className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarImage src={activity.user.image || ""} />
              <AvatarFallback>{activity.user.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">
                  {activity.action.toLowerCase()} {activity.entityType.toLowerCase()}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
