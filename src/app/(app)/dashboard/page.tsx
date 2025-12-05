"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, CheckSquare, FileText, Activity } from "lucide-react"
import ActivityFeed from "@/components/dashboard/activity-feed"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    notes: 0,
    workspaces: 0
  })

  useEffect(() => {
    // Fetch stats client-side for animation demo
    // In a real app, you might pass these as props or use SWR
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/projects") // Simplified for demo
        if (res.ok) {
          const data = await res.json()
          setStats(prev => ({ ...prev, projects: data.projects?.length || 0 }))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])

  if (!session?.user) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={stats.projects}
          icon={<FolderKanban className="h-6 w-6 text-purple-600" />}
          delay={0.1}
        />
        <StatsCard
          title="Active Tasks"
          value={stats.tasks}
          icon={<CheckSquare className="h-6 w-6 text-blue-600" />}
          delay={0.2}
        />
        <StatsCard
          title="Notes"
          value={stats.notes}
          icon={<FileText className="h-6 w-6 text-cyan-600" />}
          delay={0.3}
        />
        <StatsCard
          title="Workspaces"
          value={1} // Hardcoded for now as we don't have workspace count API easily available here
          icon={<Activity className="h-6 w-6 text-purple-600" />}
          delay={0.4}
        />
      </div>

      {/* Recent Activity */}
      <motion.div variants={item} className="col-span-3">
        <Card className="hover:shadow-lg transition-shadow border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function StatsCard({ title, value, icon, delay }: { title: string; value: string | number; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Card className="h-full border-primary/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
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
    </motion.div>
  )
}
