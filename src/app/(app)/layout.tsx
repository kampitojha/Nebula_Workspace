import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Sidebar from "@/components/layout/sidebar"
import Topbar from "@/components/layout/topbar"
import PageTransition from "@/components/layout/page-transition"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's workspaces
  const workspacesData = await db.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: true,
    },
  })

  const workspaces = workspacesData.map((wm) => ({
    id: wm.workspace.id,
    name: wm.workspace.name,
    slug: wm.workspace.slug,
    role: wm.role,
  }))

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar workspaces={workspaces} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
