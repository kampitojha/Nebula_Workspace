import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, CheckSquare, FileText, Activity } from "lucide-react"
import ActivityFeed from "@/components/dashboard/activity-feed"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  // Get user's workspaces
  const workspaces = await db.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          projects: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
      },
    },
  })

  const totalProjects = workspaces.reduce(
    (acc, wm) => acc + wm.workspace._count.projects,
    0
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={totalProjects}
          icon={<FolderKanban className="h-6 w-6 text-purple-600" />}
        />
        <StatsCard
          title="Active Tasks"
          value="0"
          icon={<CheckSquare className="h-6 w-6 text-blue-600" />}
        />
        <StatsCard
          title="Notes"
          value="0"
          icon={<FileText className="h-6 w-6 text-cyan-600" />}
        />
        <StatsCard
          title="Workspaces"
          value={workspaces.length}
          icon={<Activity className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Recent Activity */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed />
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
